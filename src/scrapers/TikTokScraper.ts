import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata } from "../types/index.js";
import { CreatorMetadataScraper } from "./CreatorMetadataScraper.js";
import { Logger } from "../helpers/StringBuilder.js";

export class TikTokScraper extends CreatorMetadataScraper {
    async getCreatorProfileUrl(videoUrl: string): Promise<string | null> {
        try {
            const match = videoUrl.match(/tiktok\.com\/@([^\/]+)/);
            if (match) {
                return `https://www.tiktok.com/@${match[1]}`;
            }
            return null;
        } catch {
            return null;
        }
    }

    async extractMetadata(page: Page, videoUrl: string): Promise<CreatorMetadata | null> {
        try {
            this.logger.log("Extracting TikTok creator metadata...", "info");

            const profileUrl = await this.getCreatorProfileUrl(videoUrl);
            if (!profileUrl) {
                this.logger.log("Could not determine TikTok profile URL", "warn");
                return null;
            }

            await page.goto(profileUrl, { waitUntil: "domcontentloaded" });
            await this.delay(3000);

            const metadata: CreatorMetadata = {
                platform: "tiktok",
                url: profileUrl,
                extractedAt: Date.now(),
            };

            const usernameMatch = profileUrl.match(/@([^\/\?]+)/);
            if (usernameMatch) {
                metadata.creator_username = usernameMatch[1];
            }

            const nameSelectors = [
                '[data-e2e="user-title"]',
                'h1[data-e2e="user-title"]',
                '.user-title',
                'h1'
            ];

            for (const selector of nameSelectors) {
                const name = await this.getElementText(page, selector);
                if (name && !name.includes("@")) {
                    metadata.creator_name = this.cleanText(name);
                    break;
                }
            }

            const followerSelectors = [
                '[data-e2e="followers-count"]',
                '[data-e2e="followers"]',
                '.followers-count',
                'strong[title*="followers"]'
            ];

            for (const selector of followerSelectors) {
                const followerText = await this.getElementText(page, selector);
                if (followerText) {
                    metadata.creator_follower_count = this.parseCount(followerText);
                    break;
                }
            }

            const bioSelectors = [
                '[data-e2e="user-bio"]',
                '.user-bio',
                '[data-e2e="user-desc"]'
            ];

            for (const selector of bioSelectors) {
                const bio = await this.getElementText(page, selector);
                if (bio && bio.length > 5) {
                    metadata.creator_bio = this.cleanText(bio);
                    break;
                }
            }

            const avatarSelectors = [
                '[data-e2e="user-avatar"] img',
                '.avatar img',
                'img[alt*="avatar"]',
                'img[data-e2e="user-avatar"]'
            ];

            for (const selector of avatarSelectors) {
                const avatar = await this.getElementAttribute(page, selector, "src");
                if (avatar) {
                    metadata.creator_avatar_url = avatar;
                    break;
                }
            }

            const verifiedSelectors = [
                '[data-e2e="verified-icon"]',
                '.verified-badge',
                '[aria-label*="Verified"]',
                '[title*="Verified"]',
                'svg[data-e2e="verified-icon"]',
                '[class*="verified"]',
                '[class*="Verified"]'
            ];

            metadata.creator_verified = false;
            for (const selector of verifiedSelectors) {
                const verified = await page.locator(selector).first();
                if (await verified.isVisible({ timeout: 2000 }).catch(() => false)) {
                    metadata.creator_verified = true;
                    this.logger.log(`Found verified badge with selector: ${selector}`, "debug");
                    break;
                }
            }
            
            if (!metadata.creator_verified) {
                try {
                    const verifiedInPage = await page.evaluate(() => {
                        const elements = document.querySelectorAll('*');
                        for (const el of elements) {
                            const ariaLabel = el.getAttribute('aria-label');
                            const title = el.getAttribute('title');
                            const className = el.className || '';
                            if ((ariaLabel && ariaLabel.toLowerCase().includes('verified')) || 
                                (title && title.toLowerCase().includes('verified')) ||
                                (className && className.toLowerCase().includes('verified'))) {
                                return true;
                            }
                        }
                        return false;
                    });
                    if (verifiedInPage) {
                        metadata.creator_verified = true;
                        this.logger.log("Found verified badge via page evaluation", "debug");
                    }
                } catch (e) {
                    this.logger.log(`Error checking verified status: ${e}`, "debug");
                }
            }

            this.logger.log("Successfully extracted TikTok creator metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract TikTok metadata: ${error}`, "error");
            return null;
        }
    }

    async extractVideoMetadata(page: Page, videoUrl: string): Promise<VideoMetadata | null> {
        try {
            this.logger.log("Extracting TikTok video metadata (yt-dlp gaps only)...", "info");

            const apiResponses: any[] = [];
            const allApiResponses: any[] = [];
            
            const responseHandler = async (response: any) => {
                const url = response.url();
                
                if (url.includes("/api/") || url.includes("/aweme/") || url.includes("/post/") || url.includes("/tiktok/")) {
                    try {
                        const json = await response.json();
                        allApiResponses.push({ url, data: json });
                        
                        const hasVideoData = url.includes("item_list") || 
                            url.includes("itemList") ||
                            url.includes("/post/item_list") ||
                            url.includes("/api/post/item_list") ||
                            url.includes("related/item_list") ||
                            url.includes("video") || 
                            url.includes("post") ||
                            url.includes("item/detail") ||
                            url.includes("aweme/detail") ||
                            url.includes("item/info") ||
                            url.includes("feed") ||
                            url.includes("aweme/v1") ||
                            url.includes("aweme/v2") ||
                            url.includes("item") ||
                            (json.itemInfo || json.itemList || json.items || json.aweme_detail || json.item || json.data);
                        
                        if (hasVideoData) {
                            apiResponses.push({ url, data: json });
                            this.logger.log(`Found potential video data API: ${url.substring(0, 150)}`, "debug");
                            
                            const dataKeys = Object.keys(json).slice(0, 10);
                            this.logger.log(`  API response keys: ${dataKeys.join(", ")}`, "debug");
                            
                            if (json.itemInfo || json.itemList || json.items || json.aweme_detail || json.item) {
                                this.logger.log(`  Contains video data structure!`, "info");
                            }
                        }
                    } catch (e) {
                        // Not JSON or already consumed
                    }
                }
            };

            page.on("response", responseHandler);

            try {
                await page.goto(videoUrl, { waitUntil: "networkidle" });
                
                await Promise.race([
                    page.waitForResponse((response: any) => {
                        const url = response.url();
                        return (url.includes("/api/") || url.includes("/aweme/") || url.includes("/tiktok/")) && 
                               (url.includes("item") || url.includes("video") || url.includes("post") || url.includes("feed") || url.includes("aweme/v"));
                    }, { timeout: 15000 }).catch(() => null),
                    new Promise(resolve => setTimeout(resolve, 15000))
                ]);
                
                await this.delay(5000);
                
                try {
                    await page.waitForSelector('[data-e2e="browse-video-desc"], [data-e2e="video-desc"], [class*="desc"], h1, [class*="Description"]', { timeout: 5000 });
                } catch (e) {
                    this.logger.log("Video description element not found, continuing anyway", "debug");
                }
                
                await page.evaluate(() => {
                    window.scrollTo(0, document.body.scrollHeight / 2);
                });
                await this.delay(2000);
                
                await page.evaluate(() => {
                    window.scrollTo(0, 0);
                });
                await this.delay(1000);
            } finally {
                page.off("response", responseHandler);
            }
            
            this.logger.log(`Total API responses captured: ${allApiResponses.length}`, "debug");

            const metadata: VideoMetadata = {
                platform: "tiktok",
                url: videoUrl,
                extractedAt: Date.now(),
            };

            const videoIdMatch = videoUrl.match(/\/video\/(\d+)/);
            if (videoIdMatch) {
                metadata.video_id = videoIdMatch[1];
            }

            const videoId = videoIdMatch?.[1];
            const embeddedData = await this.extractTikTokEmbeddedData(page, videoId, apiResponses);
            if (embeddedData) {
                this.logger.log(`Extracted ${Object.keys(embeddedData).length} fields from embedded data`, "debug");
                this.logger.log(`Embedded data keys: ${Object.keys(embeddedData).join(", ")}`, "debug");
                if (embeddedData.embed_link) metadata.embed_link = embeddedData.embed_link;
                if (embeddedData.hashtags) {
                    metadata.hashtags = embeddedData.hashtags;
                    this.logger.log(`Merged hashtags: ${Array.isArray(embeddedData.hashtags) ? embeddedData.hashtags.join(", ") : embeddedData.hashtags}`, "info");
                }
                if (embeddedData.effect_ids) {
                    metadata.effect_ids = embeddedData.effect_ids;
                    this.logger.log(`Merged effect_ids: ${Array.isArray(embeddedData.effect_ids) ? embeddedData.effect_ids.join(", ") : embeddedData.effect_ids}`, "info");
                }
                if (embeddedData.playlist_id) metadata.playlist_id = embeddedData.playlist_id;
                if (embeddedData.voice_to_text) metadata.voice_to_text = embeddedData.voice_to_text;
                if (embeddedData.region_code) metadata.region_code = embeddedData.region_code;
                if (embeddedData.music_id) metadata.music_id = embeddedData.music_id;
            } else {
                this.logger.log("No embedded data found", "debug");
            }
            
            if (!metadata.embed_link && videoIdMatch?.[1]) {
                metadata.embed_link = `https://www.tiktok.com/embed/v2/${videoIdMatch[1]}`;
            }

            const domData = await this.extractTikTokDOMData(page);
            if (domData) {
                this.logger.log(`Extracted ${Object.keys(domData).length} fields from DOM`, "debug");
                this.logger.log(`DOM data keys: ${Object.keys(domData).join(", ")}`, "debug");
                if (domData.embed_link && !metadata.embed_link) metadata.embed_link = domData.embed_link;
                if (domData.hashtags && !metadata.hashtags) {
                    metadata.hashtags = domData.hashtags;
                    this.logger.log(`Found ${domData.hashtags.length} hashtags in DOM`, "info");
                }
                if (domData.music_id && !metadata.music_id) {
                    metadata.music_id = domData.music_id;
                    this.logger.log(`Found music_id in DOM: ${domData.music_id}`, "info");
                }
                if (domData.caption && !metadata.caption) {
                    metadata.caption = domData.caption;
                    this.logger.log(`Found caption in DOM (${domData.caption.length} chars)`, "info");
                }
            } else {
                this.logger.log("No data extracted from DOM", "debug");
            }
            
            this.logger.log(`Final metadata keys: ${Object.keys(metadata).join(", ")}`, "debug");
            if (metadata.effect_ids) {
                this.logger.log(`Final effect_ids: ${Array.isArray(metadata.effect_ids) ? metadata.effect_ids.join(", ") : metadata.effect_ids}`, "info");
            }
            if (metadata.hashtags) {
                this.logger.log(`Final hashtags: ${Array.isArray(metadata.hashtags) ? metadata.hashtags.join(", ") : metadata.hashtags}`, "info");
            }

            this.logger.log("Successfully extracted TikTok video metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract TikTok video metadata: ${error}`, "error");
            return null;
        }
    }

    private async extractTikTokEmbeddedData(page: Page, videoId?: string, apiResponses?: any[]): Promise<Partial<VideoMetadata> | null> {
        try {
            const evalCode = `
                (function(vidId) {
                    var result = {};
                    var debugInfo = {
                        foundSIGI: false,
                        foundVideo: false,
                        videoKeys: [],
                        sigiTopLevelKeys: [],
                        itemModuleKeys: []
                    };

                    function findVideoInItemModule(itemModule, targetId) {
                        if (!itemModule) return null;
                        if (targetId) {
                            return itemModule[targetId] || null;
                        }
                        var entries = Object.values(itemModule);
                        if (entries.length > 0) {
                            return entries[0];
                        }
                        return null;
                    }

                    function extractFromSIGI(sigiState, vidId, result, debugInfo) {
                        if (!sigiState) return;
                        debugInfo.foundSIGI = true;
                        debugInfo.sigiTopLevelKeys = Object.keys(sigiState).slice(0, 20);
                        
                        var itemModule = sigiState.ItemModule || sigiState.itemModule;
                        if (itemModule) {
                            debugInfo.itemModuleKeys = Object.keys(itemModule).slice(0, 10);
                        }
                        
                        var video = findVideoInItemModule(itemModule, vidId);
                        
                        if (video) {
                            debugInfo.foundVideo = true;
                            debugInfo.videoKeys = Object.keys(video).slice(0, 50);
                            
                            if (video.embedLink || video.embed_link) {
                                result.embed_link = video.embedLink || video.embed_link;
                            } else if (vidId) {
                                result.embed_link = "https://www.tiktok.com/embed/v2/" + vidId;
                            }

                            if (video.music) {
                                if (video.music.id) {
                                    result.music_id = String(video.music.id);
                                } else if (video.music.musicId) {
                                    result.music_id = String(video.music.musicId);
                                }
                            }

                            if (video.effectStickers && Array.isArray(video.effectStickers)) {
                                result.effect_ids = video.effectStickers
                                    .map(function(e) { return e.id || e.effectId || e.effect_id; })
                                    .filter(function(id) { return id != null; })
                                    .map(function(id) { return String(id); });
                            }

                            if (video.challengeList && Array.isArray(video.challengeList)) {
                                result.hashtags = video.challengeList
                                    .map(function(c) { return c.title || c.challengeName || c.name; })
                                    .filter(function(val) { return val != null; });
                            } else if (video.textExtra && Array.isArray(video.textExtra)) {
                                var hashtags = video.textExtra
                                    .filter(function(item) { return item.hashtagName || item.hashtag; })
                                    .map(function(item) { return item.hashtagName || item.hashtag; });
                                if (hashtags.length > 0) {
                                    result.hashtags = hashtags;
                                }
                            }

                            if (video.desc) {
                                var descHashtags = (video.desc.match(/#[\\w]+/g) || [])
                                    .map(function(h) { return h.substring(1); });
                                if (descHashtags.length > 0) {
                                    result.hashtags = (result.hashtags || []).concat(descHashtags);
                                    result.hashtags = result.hashtags.filter(function(v, i, a) { return a.indexOf(v) === i; });
                                }
                            }

                            if (video.playlistId) {
                                result.playlist_id = String(video.playlistId);
                            }

                            if (video.regionCode) {
                                result.region_code = video.regionCode;
                            }

                            if (video.transcription || video.voiceToText || video.voice_to_text) {
                                result.voice_to_text = video.transcription || video.voiceToText || video.voice_to_text;
                            }
                        }
                    }

                    var scripts = document.querySelectorAll('script');
                    debugInfo.scriptCount = scripts.length;
                    var scriptIds = [];
                    var scriptTypes = [];
                    
                    for (var i = 0; i < scripts.length; i++) {
                        var script = scripts[i];
                        var id = script.id || "";
                        var type = script.getAttribute("type") || "";
                        if (id) scriptIds.push(id);
                        if (type) scriptTypes.push(type);
                    }
                    debugInfo.scriptIds = scriptIds.slice(0, 20);
                    debugInfo.scriptTypes = scriptTypes.slice(0, 10);
                    
                    for (var i = 0; i < scripts.length; i++) {
                        var script = scripts[i];
                        try {
                            var text = script.textContent || "";
                            var id = script.id || "";
                            var type = script.getAttribute("type") || "";

                            if (id.indexOf("SIGI_STATE") !== -1 || text.indexOf("SIGI_STATE") !== -1 || text.indexOf("ItemModule") !== -1) {
                                var sigiState = null;
                                
                                if (id.indexOf("SIGI_STATE") !== -1) {
                                    try {
                                        sigiState = JSON.parse(text);
                                    } catch (e) {
                                        var match = text.match(/SIGI_STATE\\s*=\\s*({.+?});/s);
                                        if (match) {
                                            sigiState = JSON.parse(match[1]);
                                        }
                                    }
                                } else {
                                    var match1 = text.match(/SIGI_STATE\\s*=\\s*({.+?});/s);
                                    var match2 = text.match(/window\\[['"]SIGI_STATE['"]\\]\\s*=\\s*({.+?});/s);
                                    var match3 = text.match(/<script[^>]*id=['"]SIGI_STATE['"][^>]*>([\\s\\S]*?)<\\/script>/);
                                    
                                    if (match1) {
                                        sigiState = JSON.parse(match1[1]);
                                    } else if (match2) {
                                        sigiState = JSON.parse(match2[1]);
                                    } else if (match3) {
                                        sigiState = JSON.parse(match3[1]);
                                    } else if (text.indexOf("ItemModule") !== -1 && (type === "application/json" || id === "")) {
                                        try {
                                            var jsonMatch = text.match(/\\{[\\s\\S]*"ItemModule"[\\s\\S]*\\}/);
                                            if (jsonMatch) {
                                                sigiState = JSON.parse(jsonMatch[0]);
                                            }
                                        } catch (e) {
                                            try {
                                                sigiState = JSON.parse(text);
                                            } catch (e2) {
                                                var lines = text.split("\\n");
                                                for (var j = 0; j < lines.length; j++) {
                                                    if (lines[j].indexOf("ItemModule") !== -1) {
                                                        try {
                                                            var lineMatch = lines[j].match(/\\{[\\s\\S]*\\}/);
                                                            if (lineMatch) {
                                                                sigiState = JSON.parse(lineMatch[0]);
                                                                break;
                                                            }
                                                        } catch (e3) {}
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                if (sigiState) {
                                    extractFromSIGI(sigiState, vidId, result, debugInfo);
                                    break;
                                }
                            }

                            if (id === "__UNIVERSAL_DATA_FOR_REHYDRATION__" || text.indexOf("__UNIVERSAL_DATA_FOR_REHYDRATION__") !== -1) {
                                try {
                                    var parsed = null;
                                    
                                    if (id === "__UNIVERSAL_DATA_FOR_REHYDRATION__") {
                                        try {
                                            parsed = JSON.parse(text);
                                        } catch (e) {
                                            var match = text.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__\\s*=\\s*({.+?});/s);
                                            if (match) {
                                                parsed = JSON.parse(match[1]);
                                            }
                                        }
                                    } else {
                                        var match1 = text.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__\\s*=\\s*({.+?});/s);
                                        var match2 = text.match(/window\\.__UNIVERSAL_DATA_FOR_REHYDRATION__\\s*=\\s*({.+?});/s);
                                        var match3 = text.match(/\\{.*"defaultScope".*\\}/s);
                                        
                                        if (match1) {
                                            parsed = JSON.parse(match1[1]);
                                        } else if (match2) {
                                            parsed = JSON.parse(match2[1]);
                                        } else if (match3) {
                                            parsed = JSON.parse(match3[0]);
                                        } else {
                                            try {
                                                parsed = JSON.parse(text);
                                            } catch (e) {}
                                        }
                                    }
                                    
                                    if (parsed) {
                                        var state = parsed.defaultScope || parsed.__UNIVERSAL_DATA_FOR_REHYDRATION__ || parsed;
                                        if (state && (state.ItemModule || state.itemModule || state.VideoModule || state.videoModule)) {
                                            extractFromSIGI(state, vidId, result, debugInfo);
                                        }
                                    }
                                } catch (e) {
                                    // Ignore parsing errors
                                }
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                    
                    if (!debugInfo.foundSIGI) {
                        debugInfo.searchText = "Searched " + scripts.length + " scripts, found ItemModule in: " + 
                            Array.from(scripts).filter(function(s) { 
                                return (s.textContent || "").indexOf("ItemModule") !== -1; 
                            }).length;
                    }

                    if (window.location.href.indexOf("embed") !== -1) {
                        var embedUrl = window.location.href;
                        if (embedUrl.indexOf("/embed/") !== -1) {
                            result.embed_link = embedUrl;
                        }
                    }

                    if (vidId && !result.embed_link) {
                        result.embed_link = "https://www.tiktok.com/embed/v2/" + vidId;
                    }

                    if (window.__UNIVERSAL_DATA_FOR_REHYDRATION__) {
                        try {
                            var universalData = window.__UNIVERSAL_DATA_FOR_REHYDRATION__;
                            var state = universalData.defaultScope || universalData;
                            if (state && (state.ItemModule || state.itemModule || state.VideoModule || state.videoModule)) {
                                extractFromSIGI(state, vidId, result, debugInfo);
                            }
                        } catch (e) {
                            debugInfo.windowAccessError = String(e);
                        }
                    }

                    var metaTags = document.querySelectorAll('meta[property], meta[name]');
                    for (var i = 0; i < metaTags.length; i++) {
                        var meta = metaTags[i];
                        var property = meta.getAttribute("property") || meta.getAttribute("name") || "";
                        var content = meta.getAttribute("content") || "";
                        
                        if (property.indexOf("music") !== -1 && content && !result.music_id) {
                            var musicMatch = content.match(/\\/(\\d+)/);
                            if (musicMatch) {
                                result.music_id = musicMatch[1];
                            }
                        }
                    }

                    var jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
                    for (var i = 0; i < jsonLdScripts.length; i++) {
                        try {
                            var jsonLd = JSON.parse(jsonLdScripts[i].textContent || "{}");
                            if (jsonLd["@type"] === "VideoObject" || jsonLd["@type"] === "SocialMediaPosting") {
                                if (jsonLd.description && !result.hashtags) {
                                    var descHashtags = (jsonLd.description.match(/#[\\w]+/g) || [])
                                        .map(function(h) { return h.substring(1); });
                                    if (descHashtags.length > 0) {
                                        result.hashtags = descHashtags;
                                    }
                                }
                            }
                        } catch (e) {
                            continue;
                        }
                    }

                    var descSelectors = [
                        '[data-e2e="browse-video-desc"]',
                        '[data-e2e="video-desc"]',
                        'h1[data-e2e="browse-video-desc"]',
                        '[class*="desc"]',
                        '[class*="Description"]',
                        'span[class*="desc"]',
                        'div[class*="desc"]'
                    ];
                    
                    var descElement = null;
                    for (var s = 0; s < descSelectors.length; s++) {
                        descElement = document.querySelector(descSelectors[s]);
                        if (descElement) break;
                    }
                    
                    if (!descElement) {
                        var allSpans = document.querySelectorAll('span');
                        for (var s = 0; s < Math.min(allSpans.length, 200); s++) {
                            var text = allSpans[s].textContent || "";
                            if (text.indexOf("#") !== -1 && text.length < 500 && text.length > 5) {
                                descElement = allSpans[s];
                                break;
                            }
                        }
                    }
                    
                    if (!descElement) {
                        var allDivs = document.querySelectorAll('div');
                        for (var d = 0; d < Math.min(allDivs.length, 200); d++) {
                            var text = allDivs[d].textContent || "";
                            if (text.indexOf("#") !== -1 && text.length < 500 && text.length > 5) {
                                var parent = allDivs[d].parentElement;
                                if (parent && parent.textContent && parent.textContent.length < 1000) {
                                    descElement = parent;
                                } else {
                                    descElement = allDivs[d];
                                }
                                break;
                            }
                        }
                    }
                    
                    if (!descElement) {
                        var bodyText = document.body.textContent || "";
                        var hashtagMatches = bodyText.match(/#[\\w]+/g);
                        if (hashtagMatches && hashtagMatches.length > 0) {
                            var uniqueHashtags = Array.from(new Set(hashtagMatches.map(function(h) { return h.substring(1); })));
                            var genericTags = ["tiktok", "fyp", "foryou", "foryoupage", "viral", "trending", "trend", "animals", "animalcare", "beauty", "comedyvideos", "dance", "food", "gaming", "sports", "entertainment", "funny", "comedy", "music", "love", "like", "follow", "share", "comment"];
                            uniqueHashtags = uniqueHashtags.filter(function(tag) {
                                return genericTags.indexOf(tag.toLowerCase()) === -1;
                            });
                            if (uniqueHashtags.length > 0 && uniqueHashtags.length < 50) {
                                result.hashtags = uniqueHashtags;
                                debugInfo.foundHashtagsInDOM = true;
                                debugInfo.descText = "Found in body text (filtered)";
                            }
                        }
                    }
                    
                    if (descElement && !result.hashtags) {
                        var descText = descElement.textContent || "";
                        var descHashtags = (descText.match(/#[\\w]+/g) || [])
                            .map(function(h) { return h.substring(1); });
                        if (descHashtags.length > 0) {
                            result.hashtags = descHashtags;
                            debugInfo.foundHashtagsInDOM = true;
                            debugInfo.descText = descText.substring(0, 100);
                        }
                    }
                    
                    debugInfo.descElementFound = descElement !== null;

                    return {
                        data: Object.keys(result).length > 0 ? result : null,
                        debug: debugInfo
                    };
                })
            `;

            let response = await page.evaluate(evalCode + `(${JSON.stringify(videoId)})`) as { data: Partial<VideoMetadata> | null; debug?: any } | null;
            
            if (!response) {
                response = { data: {} };
            } else if (!response.data) {
                response.data = {};
            }

            if (apiResponses && apiResponses.length > 0) {
                this.logger.log(`Found ${apiResponses.length} potential video data API responses`, "debug");
                for (const apiResp of apiResponses) {
                    this.logger.log(`Processing API URL: ${apiResp.url.substring(0, 150)}`, "debug");
                    const dataKeys = apiResp.data ? Object.keys(apiResp.data).slice(0, 15) : [];
                    this.logger.log(`API data keys: ${dataKeys.join(", ")}`, "debug");
                    
                    const extractVideoData = (videoData: any, source: string) => {
                        if (!videoData || !response?.data) return;
                        
                        const videoKeys = Object.keys(videoData);
                        this.logger.log(`${source} video keys (first 50): ${videoKeys.slice(0, 50).join(", ")}`, "debug");
                        if (videoKeys.length > 50) {
                            this.logger.log(`${source} video has ${videoKeys.length} total keys (showing first 50)`, "debug");
                        }
                        
                        const hasEffectStickers = videoKeys.includes('effectStickers');
                        if (hasEffectStickers) {
                            this.logger.log(`${source} has effectStickers key`, "debug");
                        }
                        
                        if (videoData.effectStickers) {
                            this.logger.log(`${source} effectStickers type: ${Array.isArray(videoData.effectStickers) ? 'array' : typeof videoData.effectStickers}, length: ${Array.isArray(videoData.effectStickers) ? videoData.effectStickers.length : 'N/A'}`, "debug");
                            if (Array.isArray(videoData.effectStickers) && videoData.effectStickers.length > 0) {
                                this.logger.log(`${source} effectStickers sample: ${JSON.stringify(videoData.effectStickers[0])}`, "debug");
                            }
                        } else {
                            this.logger.log(`${source} no effectStickers found (checked ${videoKeys.length} keys)`, "debug");
                        }
                        
                        if (videoData.desc) {
                            this.logger.log(`${source} desc preview: ${String(videoData.desc).substring(0, 100)}`, "debug");
                        }
                        
                        if (videoData.textExtra) {
                            this.logger.log(`${source} textExtra type: ${Array.isArray(videoData.textExtra) ? 'array' : typeof videoData.textExtra}, length: ${Array.isArray(videoData.textExtra) ? videoData.textExtra.length : 'N/A'}`, "debug");
                        }
                        
                        if (videoData.challengeList) {
                            this.logger.log(`${source} challengeList type: ${Array.isArray(videoData.challengeList) ? 'array' : typeof videoData.challengeList}, length: ${Array.isArray(videoData.challengeList) ? videoData.challengeList.length : 'N/A'}`, "debug");
                        }
                        
                        if (!response.data.hashtags && videoData.desc) {
                            const descText = String(videoData.desc);
                            const hashtags = (descText.match(/#[\w\u4e00-\u9fff]+/g) || []).map((h: string) => h.substring(1));
                            if (hashtags.length > 0) {
                                const genericTags = ["fyp", "foryou", "foryoupage", "viral", "trending", "trend", "fypシ", "fypage", "fy"];
                                const filtered = hashtags.filter(tag => !genericTags.includes(tag.toLowerCase()));
                                if (filtered.length > 0) {
                                    response.data.hashtags = filtered;
                                    this.logger.log(`Extracted hashtags from ${source}: ${filtered.join(", ")}`, "info");
                                } else if (hashtags.length > 0) {
                                    response.data.hashtags = hashtags;
                                    this.logger.log(`Extracted hashtags from ${source} (all generic): ${hashtags.join(", ")}`, "debug");
                                }
                            }
                        }
                        
                        if (!response.data.hashtags && videoData.textExtra && Array.isArray(videoData.textExtra)) {
                            const hashtags = videoData.textExtra
                                .filter((item: any) => item.hashtagName || item.hashtag)
                                .map((item: any) => item.hashtagName || item.hashtag)
                                .filter(Boolean);
                            if (hashtags.length > 0) {
                                response.data.hashtags = hashtags;
                                this.logger.log(`Extracted hashtags from ${source} textExtra: ${hashtags.join(", ")}`, "info");
                            }
                        }
                        
                        if (!response.data.hashtags && videoData.challengeList && Array.isArray(videoData.challengeList)) {
                            const hashtags = videoData.challengeList
                                .map((c: any) => c.title || c.challengeName || c.name)
                                .filter(Boolean);
                            if (hashtags.length > 0) {
                                response.data.hashtags = hashtags;
                                this.logger.log(`Extracted hashtags from ${source} challengeList: ${hashtags.join(", ")}`, "info");
                            }
                        }
                        
                        if (!response.data.music_id && videoData.music) {
                            const musicId = videoData.music.id || videoData.music.musicId || videoData.musicId || videoData.music?.idStr;
                            if (musicId) {
                                response.data.music_id = String(musicId);
                                this.logger.log(`Extracted music_id from ${source}: ${musicId}`, "info");
                            }
                        }
                        
                        if (!response.data.effect_ids && videoData.effectStickers) {
                            this.logger.log(`${source} has effectStickers, type: ${typeof videoData.effectStickers}, isArray: ${Array.isArray(videoData.effectStickers)}`, "debug");
                            let effects: string[] = [];
                            if (Array.isArray(videoData.effectStickers)) {
                                this.logger.log(`${source} effectStickers array length: ${videoData.effectStickers.length}`, "debug");
                                effects = videoData.effectStickers
                                    .map((e: any) => {
                                        if (typeof e === 'string') return e;
                                        if (typeof e === 'number') return String(e);
                                        return e?.ID || e?.id || e?.effectId || e?.effect_id || e?.stickerId || e?.sticker_id;
                                    })
                                    .filter(Boolean)
                                    .map(String);
                                this.logger.log(`${source} extracted effect IDs: ${effects.join(", ")}`, "debug");
                            } else if (typeof videoData.effectStickers === 'object' && videoData.effectStickers !== null) {
                                const effectObj = videoData.effectStickers;
                                if (effectObj.ID) effects.push(String(effectObj.ID));
                                if (effectObj.id) effects.push(String(effectObj.id));
                                if (effectObj.effectId) effects.push(String(effectObj.effectId));
                            }
                            if (effects.length > 0) {
                                response.data.effect_ids = effects;
                                this.logger.log(`Extracted effect_ids from ${source}: ${effects.join(", ")}`, "info");
                            } else {
                                this.logger.log(`${source} effectStickers exists but no IDs extracted`, "debug");
                            }
                        }
                        
                        if (!response.data.effect_ids && videoData.effectIds && Array.isArray(videoData.effectIds)) {
                            response.data.effect_ids = videoData.effectIds.map(String);
                            this.logger.log(`Extracted effect_ids from ${source} effectIds: ${response.data.effect_ids?.join(", ")}`, "info");
                        }
                        
                        if (!response.data.effect_ids && videoData.stickersOnItem && Array.isArray(videoData.stickersOnItem)) {
                            const effects = videoData.stickersOnItem
                                .map((s: any) => s.stickerId || s.id || s.effectId)
                                .filter(Boolean)
                                .map(String);
                            if (effects.length > 0) {
                                response.data.effect_ids = effects;
                                this.logger.log(`Extracted effect_ids from ${source} stickersOnItem: ${effects.join(", ")}`, "info");
                            }
                        }
                        
                        if (!response.data.playlist_id && videoData.playlistId) {
                            response.data.playlist_id = String(videoData.playlistId);
                            this.logger.log(`Extracted playlist_id from ${source}: ${response.data.playlist_id}`, "info");
                        }
                        
                        if (!response.data.playlist_id && videoData.playlist_id) {
                            response.data.playlist_id = String(videoData.playlist_id);
                            this.logger.log(`Extracted playlist_id from ${source} (playlist_id): ${response.data.playlist_id}`, "info");
                        }
                        
                        if (!response.data.playlist_id && videoData.music?.playlistId) {
                            response.data.playlist_id = String(videoData.music.playlistId);
                            this.logger.log(`Extracted playlist_id from ${source} (music.playlistId): ${response.data.playlist_id}`, "info");
                        }
                        
                        if (!response.data.region_code && videoData.regionCode) {
                            response.data.region_code = videoData.regionCode;
                            this.logger.log(`Extracted region_code from ${source}: ${response.data.region_code}`, "info");
                        }
                        
                        if (!response.data.region_code && videoData.region) {
                            response.data.region_code = videoData.region;
                            this.logger.log(`Extracted region_code from ${source} (region): ${response.data.region_code}`, "info");
                        }
                        
                        if (!response.data.region_code && videoData.video?.region) {
                            response.data.region_code = videoData.video.region;
                            this.logger.log(`Extracted region_code from ${source} (video.region): ${response.data.region_code}`, "info");
                        }
                        
                        if (!response.data.voice_to_text && videoData.transcription) {
                            response.data.voice_to_text = videoData.transcription;
                            this.logger.log(`Extracted voice_to_text from ${source} (${videoData.transcription.length} chars)`, "info");
                        }
                        
                        if (!response.data.voice_to_text && videoData.voiceToText) {
                            response.data.voice_to_text = videoData.voiceToText;
                            this.logger.log(`Extracted voice_to_text from ${source} (${videoData.voiceToText.length} chars)`, "info");
                        }
                        
                        if (!response.data.voice_to_text && videoData.subtitleInfos && Array.isArray(videoData.subtitleInfos)) {
                            const subtitles = videoData.subtitleInfos
                                .map((s: any) => s.content || s.text || s.subtitle)
                                .filter(Boolean)
                                .join(" ");
                            if (subtitles) {
                                response.data.voice_to_text = subtitles;
                                this.logger.log(`Extracted voice_to_text from ${source} subtitleInfos (${subtitles.length} chars)`, "info");
                            }
                        }
                    };
                    
                    if (apiResp.data?.itemList) {
                        const items = apiResp.data.itemList;
                        if (Array.isArray(items) && items.length > 0) {
                            const video = items.find((item: any) => 
                                item.itemInfo?.itemId === videoId || 
                                item.itemInfo?.itemStruct?.id === videoId ||
                                item.id === videoId ||
                                item.itemInfo?.itemStruct?.video?.id === videoId
                            ) || items[0];
                            
                            if (video?.itemInfo?.itemStruct) {
                                extractVideoData(video.itemInfo.itemStruct, "itemList.itemInfo.itemStruct");
                            } else if (video?.itemStruct) {
                                extractVideoData(video.itemStruct, "itemList.itemStruct");
                            } else if (video) {
                                extractVideoData(video, "itemList item");
                            }
                        }
                    }
                    
                    if (apiResp.data?.itemList && Array.isArray(apiResp.data.itemList)) {
                        for (const item of apiResp.data.itemList) {
                            if (item && (item.id === videoId || item.itemInfo?.itemId === videoId)) {
                                if (item.effectStickers || item.music || item.desc || item.playlistId) {
                                    extractVideoData(item, "itemList direct");
                                }
                                if (item.itemInfo?.itemStruct) {
                                    extractVideoData(item.itemInfo.itemStruct, "itemList.itemInfo.itemStruct");
                                }
                                break;
                            }
                        }
                    }
                    
                    if (apiResp.data?.itemInfo?.itemStruct) {
                        extractVideoData(apiResp.data.itemInfo.itemStruct, "itemInfo.itemStruct");
                    }
                    
                    if (apiResp.data?.aweme_detail) {
                        extractVideoData(apiResp.data.aweme_detail, "aweme_detail");
                    }
                    
                    if (apiResp.data?.items && Array.isArray(apiResp.data.items)) {
                        const video = apiResp.data.items.find((item: any) => item.id === videoId) || apiResp.data.items[0];
                        if (video) {
                            extractVideoData(video, "items array");
                        }
                    }
                    
                    if (apiResp.data?.item) {
                        extractVideoData(apiResp.data.item, "item");
                    }
                    
                    if (apiResp.data?.keywordsByItemId && videoId) {
                        const keywords = apiResp.data.keywordsByItemId[videoId];
                        if (keywords && Array.isArray(keywords) && keywords.length > 0 && response?.data && !response.data.hashtags) {
                            response.data.hashtags = keywords.map((k: any) => typeof k === 'string' ? k : k.keyword || k.name || k).filter(Boolean);
                            this.logger.log(`Extracted hashtags from SEO keywords: ${response.data.hashtags.join(", ")}`, "debug");
                        }
                    }
                }
            }
            
            const windowData = await page.evaluate((vidId) => {
                const result: any = {};
                try {
                    const win = window as any;
                    
                    if (win.__UNIVERSAL_DATA_FOR_REHYDRATION__) {
                        result.hasUniversalData = true;
                        try {
                            const data = win.__UNIVERSAL_DATA_FOR_REHYDRATION__;
                            const state = data.defaultScope || data;
                            if (state && (state.ItemModule || state.itemModule)) {
                                const itemModule = state.ItemModule || state.itemModule;
                                const video = itemModule && itemModule[vidId] || (itemModule && Object.values(itemModule)[0]);
                                if (video) {
                                    result.foundVideoInUniversal = true;
                                    result.videoKeys = Object.keys(video).slice(0, 30);
                                    if (video.desc) {
                                        const hashtags = (video.desc.match(/#\w+/g) || []).map((h: string) => h.substring(1));
                                        if (hashtags.length > 0) {
                                            result.hashtags = hashtags;
                                        }
                                    }
                                    if (video.music && video.music.id) {
                                        result.music_id = String(video.music.id);
                                    }
                                }
                            }
                        } catch (e) {
                            result.universalError = String(e);
                        }
                    }
                    
                    if (win.__$UNIVERSAL_DATA$__) {
                        result.hasUniversalDataDollar = true;
                    }
                    
                    if (win.SIGI_STATE) {
                        result.hasSIGI = true;
                    }
                    
                    result.windowKeys = Object.keys(win).filter(k => k.startsWith('__') || k.includes('DATA') || k.includes('STATE')).slice(0, 20);
                } catch (e) {
                    result.error = String(e);
                }
                return result;
            }, videoId || "");
            
            if (windowData.foundVideoInUniversal) {
                this.logger.log(`Found video in __UNIVERSAL_DATA_FOR_REHYDRATION__`, "debug");
                if (windowData.videoKeys) {
                    this.logger.log(`Video keys: ${windowData.videoKeys.join(", ")}`, "debug");
                }
                if (windowData.hashtags && response?.data) {
                    response.data.hashtags = windowData.hashtags;
                    this.logger.log(`Extracted hashtags from window: ${windowData.hashtags.join(", ")}`, "debug");
                }
                if (windowData.music_id && response?.data) {
                    response.data.music_id = windowData.music_id;
                    this.logger.log(`Extracted music_id from window: ${windowData.music_id}`, "debug");
                }
            }
            
            if (windowData.windowKeys && windowData.windowKeys.length > 0) {
                this.logger.log(`Window objects found: ${windowData.windowKeys.join(", ")}`, "debug");
            }

            if (response && response.debug) {
                this.logger.log(`SIGI_STATE debug - Found SIGI: ${response.debug.foundSIGI}, Found Video: ${response.debug.foundVideo}`, "debug");
                this.logger.log(`Script count: ${response.debug.scriptCount || 0}`, "debug");
                if (response.debug.scriptIds && response.debug.scriptIds.length > 0) {
                    this.logger.log(`Script IDs found: ${response.debug.scriptIds.join(", ")}`, "debug");
                }
                if (response.debug.searchText) {
                    this.logger.log(response.debug.searchText, "debug");
                }
                if (response.debug.sigiTopLevelKeys && response.debug.sigiTopLevelKeys.length > 0) {
                    this.logger.log(`SIGI top-level keys: ${response.debug.sigiTopLevelKeys.join(", ")}`, "debug");
                }
                if (response.debug.itemModuleKeys && response.debug.itemModuleKeys.length > 0) {
                    this.logger.log(`ItemModule keys (first 10): ${response.debug.itemModuleKeys.join(", ")}`, "debug");
                }
                if (response.debug.videoKeys && response.debug.videoKeys.length > 0) {
                    this.logger.log(`Video object keys (first 50): ${response.debug.videoKeys.join(", ")}`, "debug");
                }
                if (response.debug.descElementFound !== undefined) {
                    this.logger.log(`Description element found: ${response.debug.descElementFound}`, "debug");
                }
                if (response.debug.foundHashtagsInDOM) {
                    this.logger.log(`Found hashtags in DOM: ${response.debug.descText}`, "debug");
                }
            }
            
            if (response?.data) {
                const extractedKeys = Object.keys(response.data);
                this.logger.log(`Final extracted data keys: ${extractedKeys.join(", ")}`, "debug");
                if (response.data.effect_ids) {
                    this.logger.log(`Effect IDs in response.data: ${Array.isArray(response.data.effect_ids) ? response.data.effect_ids.join(", ") : response.data.effect_ids}`, "info");
                }
                if (response.data.hashtags) {
                    this.logger.log(`Hashtags in response.data: ${Array.isArray(response.data.hashtags) ? response.data.hashtags.join(", ") : response.data.hashtags}`, "info");
                }
            }

            return response?.data || null;
        } catch (error) {
            this.logger.log(`Failed to extract embedded TikTok data: ${error}`, "debug");
            return null;
        }
    }

    private async extractTikTokDOMData(page: Page): Promise<Partial<VideoMetadata> | null> {
        try {
            const evalCode = `
                (function() {
                    var result = {};
                    var debug = [];

                    function logDebug(msg) {
                        debug.push(msg);
                    }

                    var descSelectors = [
                        '[data-e2e="browse-video-desc"]',
                        '[data-e2e="video-desc"]',
                        '[data-e2e="video-desc-text"]',
                        'h1[data-e2e="browse-video-desc"]',
                        '[class*="desc"]',
                        '[class*="Description"]',
                        'span[class*="desc"]',
                        'div[class*="desc"]',
                        '[class*="video-desc"]',
                        '[class*="VideoDesc"]'
                    ];

                    var captionText = "";
                    var descElement = null;
                    
                    for (var i = 0; i < descSelectors.length; i++) {
                        var selector = descSelectors[i];
                        descElement = document.querySelector(selector);
                        if (descElement) {
                            captionText = descElement.textContent || "";
                            if (captionText && captionText.length > 0) {
                                logDebug("Found description with selector: " + selector + ", length: " + captionText.length);
                                break;
                            }
                        }
                    }

                    if (!captionText) {
                        var allSpans = Array.from(document.querySelectorAll('span, div, p, h1, h2, h3, h4'));
                        for (var j = 0; j < Math.min(allSpans.length, 200); j++) {
                            var el = allSpans[j];
                            var text = el.textContent || "";
                            if (text.indexOf("#") !== -1 && text.length > 5 && text.length < 1000) {
                                var parent = el.closest('[class*="desc"], [class*="video"], [class*="caption"], [data-e2e*="desc"], [data-e2e*="video"], [data-e2e*="caption"]');
                                if (parent) {
                                    captionText = parent.textContent || text;
                                    descElement = parent;
                                    logDebug("Found description in parent element, length: " + captionText.length);
                                    break;
                                } else if (text.length > 10 && text.length < 500) {
                                    captionText = text;
                                    descElement = el;
                                    logDebug("Found description directly in element, length: " + captionText.length);
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (!captionText) {
                        var bodyText = document.body.textContent || "";
                        var lines = bodyText.split("\\n");
                        for (var l = 0; l < lines.length; l++) {
                            var line = lines[l].trim();
                            if (line.indexOf("#") !== -1 && line.length > 5 && line.length < 500 && line.split("#").length > 1) {
                                var hashtagCount = (line.match(/#/g) || []).length;
                                if (hashtagCount >= 1 && hashtagCount <= 20) {
                                    captionText = line;
                                    logDebug("Found description in body text line, length: " + captionText.length);
                                    break;
                                }
                            }
                        }
                    }

                    if (captionText) {
                        var captionHashtags = captionText.match(/#[\\w\\u4e00-\\u9fff]+/g);
                        if (captionHashtags && captionHashtags.length > 0) {
                            var extracted = captionHashtags.map(function(h) { return h.substring(1); }).filter(function(h) { return h.length > 0 && h.length < 100; });
                            var genericTags = ["fyp", "foryou", "foryoupage", "viral", "trending", "trend", "fypシ", "fypage", "fy", "fypシ゚viral", "viralvideos", "viralvideo", "trendingnow", "trendingvideos"];
                            extracted = extracted.filter(function(tag) {
                                return genericTags.indexOf(tag.toLowerCase()) === -1;
                            });
                            if (extracted.length > 0) {
                                result.hashtags = Array.from(new Set(extracted));
                                logDebug("Extracted " + result.hashtags.length + " hashtags from description: " + extracted.join(", "));
                            } else {
                                logDebug("Found hashtags in description but all were filtered as generic");
                            }
                        } else {
                            logDebug("Description found but no hashtags in it: " + captionText.substring(0, 100));
                        }
                        result.caption = captionText.substring(0, 500);
                    }
                    
                    if (!result.hashtags || result.hashtags.length === 0) {
                        var videoContainer = document.querySelector('[class*="video"], [class*="Video"], [data-e2e*="video"], [class*="player"], [class*="Player"]');
                        if (videoContainer) {
                            var containerText = videoContainer.textContent || "";
                            var containerHashtags = containerText.match(/#[\\w\\u4e00-\\u9fff]+/g);
                            if (containerHashtags && containerHashtags.length > 0) {
                                var extracted = containerHashtags.map(function(h) { return h.substring(1); }).filter(function(h) { return h.length > 0 && h.length < 100; });
                                var genericTags = ["fyp", "foryou", "foryoupage", "viral", "trending", "trend", "fypシ", "fypage", "fy"];
                                extracted = extracted.filter(function(tag) {
                                    return genericTags.indexOf(tag.toLowerCase()) === -1;
                                });
                                if (extracted.length > 0 && extracted.length <= 30) {
                                    result.hashtags = Array.from(new Set(extracted));
                                    logDebug("Extracted " + result.hashtags.length + " hashtags from video container");
                                }
                            }
                        }
                    }
                    
                    if (!result.hashtags || result.hashtags.length === 0) {
                        var mainContent = document.querySelector('[class*="video"], [class*="Video"], [data-e2e*="video"], main, article') || document.body;
                        var mainText = mainContent.textContent || "";
                        var allHashtags = mainText.match(/#[\\w\\u4e00-\\u9fff]+/g);
                        if (allHashtags && allHashtags.length > 0) {
                            var extracted = allHashtags.map(function(h) { return h.substring(1); }).filter(function(h) { return h.length > 0 && h.length < 100; });
                            var genericTags = ["fyp", "foryou", "foryoupage", "viral", "trending", "trend", "fypシ", "fypage", "fy", "fypシ゚viral", "viralvideos", "viralvideo", "trendingnow", "trendingvideos", "tiktok", "tiktokviral", "tiktoktrending", "explore", "discover"];
                            extracted = extracted.filter(function(tag) {
                                return genericTags.indexOf(tag.toLowerCase()) === -1;
                            });
                            if (extracted.length > 0 && extracted.length <= 30) {
                                result.hashtags = Array.from(new Set(extracted));
                                logDebug("Extracted " + result.hashtags.length + " hashtags from main content");
                            }
                        }
                    }
                    
                    if (!result.hashtags || result.hashtags.length === 0) {
                        var linkElements = document.querySelectorAll('a[href*="/tag/"], a[href*="/challenge/"], a[href*="/hashtag/"]');
                        var linkHashtags = [];
                        for (var q = 0; q < Math.min(linkElements.length, 50); q++) {
                            var link = linkElements[q];
                            var href = link.getAttribute("href") || "";
                            var linkText = link.textContent || "";
                            var match = href.match(/[\\/](tag|challenge|hashtag)[\\/]([^\\/\\?#]+)/i);
                            if (match && match[2]) {
                                linkHashtags.push(match[2].trim());
                            } else if (linkText && linkText.indexOf("#") === 0) {
                                linkHashtags.push(linkText.substring(1).trim());
                            }
                        }
                        if (linkHashtags.length > 0) {
                            var uniqueLinkHashtags = Array.from(new Set(linkHashtags.filter(function(h) { return h.length > 0 && h.length < 100; })));
                            if (uniqueLinkHashtags.length > 0 && uniqueLinkHashtags.length <= 30) {
                                result.hashtags = uniqueLinkHashtags;
                                logDebug("Extracted " + result.hashtags.length + " hashtags from link elements");
                            }
                        }
                    }

                    var hashtagSelectors = [
                        '[data-e2e="challenge-item"]',
                        '[data-e2e="challenge-list"] a',
                        '[data-e2e="challenge"]',
                        '[data-e2e*="challenge"]',
                        '[data-e2e*="hashtag"]',
                        '[data-e2e*="tag"]',
                        '.hashtag',
                        '[href*="/tag/"]',
                        '[href*="/challenge/"]',
                        '[href*="/hashtag/"]',
                        'a[href*="hashtag"]',
                        'a[href*="/tag/"]',
                        'a[href*="/challenge/"]',
                        '[class*="hashtag"]',
                        '[class*="challenge"]',
                        '[class*="Tag"]',
                        '[class*="Hashtag"]',
                        '[class*="Challenge"]',
                        'span[class*="hashtag"]',
                        'div[class*="hashtag"]',
                        'a[class*="hashtag"]'
                    ];

                    var hashtags = [];
                    for (var k = 0; k < hashtagSelectors.length; k++) {
                        var sel = hashtagSelectors[k];
                        var elements = document.querySelectorAll(sel);
                        logDebug("Selector " + sel + " found " + elements.length + " elements");
                        for (var m = 0; m < elements.length; m++) {
                            var el = elements[m];
                            var text = (el.textContent || "").trim();
                            var href = el.getAttribute("href") || "";
                            
                            if (text) {
                                if (text.indexOf("#") === 0) {
                                    hashtags.push(text.substring(1).trim());
                                } else if (text.length > 0 && text.length < 50 && text.indexOf(" ") === -1 && text.indexOf("\\n") === -1) {
                                    hashtags.push(text.trim());
                                }
                            }
                            
                            if (href) {
                                var match = href.match(/[#\\/](tag|challenge|hashtag)[\\/#]([^\\/\\?#]+)/i);
                                if (match && match[2]) {
                                    hashtags.push(match[2].trim());
                                }
                            }
                        }
                    }

                    if (hashtags.length > 0) {
                        var uniqueHashtags = Array.from(new Set(hashtags.filter(function(h) { return h.length > 0 && h.length < 50; })));
                        if (result.hashtags) {
                            result.hashtags = Array.from(new Set(result.hashtags.concat(uniqueHashtags)));
                        } else {
                            result.hashtags = uniqueHashtags;
                        }
                        logDebug("Total unique hashtags: " + result.hashtags.length);
                    }

                    var musicSelectors = [
                        '[data-e2e="browse-music"]',
                        '[data-e2e="music"]',
                        '[class*="music"]',
                        '[class*="Music"]',
                        '[class*="sound"]',
                        '[class*="Sound"]',
                        'a[href*="/music/"]',
                        'a[href*="/sound/"]'
                    ];

                    for (var n = 0; n < musicSelectors.length; n++) {
                        var musicSel = musicSelectors[n];
                        var musicEl = document.querySelector(musicSel);
                        if (musicEl) {
                            var musicText = musicEl.textContent || "";
                            var musicHref = musicEl.getAttribute("href") || "";
                            
                            if (musicHref) {
                                var musicMatch = musicHref.match(/[\\/](music|sound)[\\/]([^\\/\\?#]+)/i);
                                if (musicMatch && musicMatch[2]) {
                                    var musicIdStr = musicMatch[2];
                                    musicIdStr = musicIdStr.replace(/^(original-sound-|som-original-)/i, "");
                                    var numericMatch = musicIdStr.match(/\\d+/);
                                    if (numericMatch) {
                                        result.music_id = numericMatch[0];
                                    } else {
                                        result.music_id = musicIdStr;
                                    }
                                    logDebug("Found music ID from href: " + result.music_id);
                                    break;
                                }
                            }
                            
                            if (musicText && musicText.length < 100) {
                                var dataId = musicEl.getAttribute("data-id") || musicEl.getAttribute("data-music-id");
                                if (dataId) {
                                    result.music_id = dataId;
                                    logDebug("Found music ID from data attribute: " + result.music_id);
                                    break;
                                }
                            }
                        }
                    }

                    var embedSelectors = [
                        '[data-e2e="embed-button"]',
                        'a[href*="/embed/"]',
                        'button[aria-label*="embed" i]',
                        'button[aria-label*="Embed" i]',
                        '[class*="embed"]',
                        '[class*="Embed"]'
                    ];

                    for (var p = 0; p < embedSelectors.length; p++) {
                        var embedSel = embedSelectors[p];
                        var embedButton = document.querySelector(embedSel);
                        if (embedButton) {
                            var embedHref = embedButton.getAttribute("href");
                            if (embedHref) {
                                result.embed_link = embedHref.indexOf("http") === 0 ? embedHref : "https://www.tiktok.com" + embedHref;
                                logDebug("Found embed link: " + result.embed_link);
                                break;
                            }
                        }
                    }

                    logDebug("Total result keys: " + Object.keys(result).length);
                    logDebug("Has hashtags: " + !!result.hashtags + ", Has music_id: " + !!result.music_id + ", Has embed_link: " + !!result.embed_link + ", Has caption: " + !!result.caption);
                    
                    if (debug.length > 0) {
                        result.debug = debug;
                    }
                    
                    return result;
                })
            `;

            const data = await page.evaluate(evalCode + "()") as any;

            if (data) {
                if (data.debug) {
                    data.debug.forEach((log: string) => this.logger.log(`[DOM Debug] ${log}`, "debug"));
                    delete data.debug;
                }
                
                if (Object.keys(data).length === 0) {
                    return null;
                }
                
                return data;
            }

            return null;
        } catch (error) {
            this.logger.log(`Failed to extract DOM TikTok data: ${error}`, "debug");
            return null;
        }
    }
}

