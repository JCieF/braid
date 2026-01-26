import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata } from "../types/index.js";
import { CreatorMetadataScraper } from "./CreatorMetadataScraper.js";
import { Logger } from "../helpers/StringBuilder.js";

export class FacebookScraper extends CreatorMetadataScraper {
    async getCreatorProfileUrl(videoUrl: string): Promise<string | null> {
        try {
            const match = videoUrl.match(/facebook\.com\/([^\/\?]+)/);
            if (match && !match[1].includes("watch")) {
                return `https://www.facebook.com/${match[1]}`;
            }
            return null;
        } catch {
            return null;
        }
    }

    async extractMetadata(page: Page, videoUrl: string): Promise<CreatorMetadata | null> {
        try {
            this.logger.log("Extracting Facebook creator metadata...", "info");

            await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
            await this.delay(3000);

            let profileUrl: string | null = null;
            const links = await page.locator('a[href*="facebook.com"]').all();
            for (const link of links) {
                const href = await link.getAttribute("href");
                if (href && !href.includes("/watch") && !href.includes("/videos") && href.match(/facebook\.com\/[^\/]+$/)) {
                    profileUrl = href;
                    break;
                }
            }

            if (!profileUrl) {
                this.logger.log("Could not find Facebook profile URL", "warn");
                return null;
            }

            await page.goto(profileUrl, { waitUntil: "domcontentloaded" });
            await this.delay(3000);

            const metadata: CreatorMetadata = {
                platform: "facebook",
                url: profileUrl,
                extractedAt: Date.now(),
            };

            const nameSelectors = [
                'h1',
                '[data-testid="profile-name"]',
                'header h1'
            ];

            for (const selector of nameSelectors) {
                const name = await this.getElementText(page, selector);
                if (name && name.length > 0) {
                    metadata.creator_name = this.cleanText(name);
                    break;
                }
            }

            const bioSelectors = [
                '[data-testid="profile-bio"]',
                '.profile-bio',
                'div[data-testid="profile-info"]'
            ];

            for (const selector of bioSelectors) {
                const bio = await this.getElementText(page, selector);
                if (bio && bio.length > 5) {
                    metadata.creator_bio = this.cleanText(bio);
                    break;
                }
            }

            const followerSelectors = [
                '[data-testid="followers"]',
                'a[href*="/followers"]'
            ];

            for (const selector of followerSelectors) {
                const followerText = await this.getElementText(page, selector);
                if (followerText) {
                    metadata.creator_follower_count = this.parseCount(followerText);
                    break;
                }
            }

            const avatarSelectors = [
                'img[alt*="profile picture"]',
                'img[alt*="Profile picture"]',
                '[data-testid="profile-picture"] img'
            ];

            for (const selector of avatarSelectors) {
                const avatar = await this.getElementAttribute(page, selector, "src");
                if (avatar) {
                    metadata.creator_avatar_url = avatar;
                    break;
                }
            }

            const verifiedSelectors = [
                '[aria-label*="Verified"]',
                '[data-testid="verified-badge"]'
            ];

            for (const selector of verifiedSelectors) {
                const verified = await page.locator(selector).first();
                if (await verified.isVisible({ timeout: 2000 }).catch(() => false)) {
                    metadata.creator_verified = true;
                    break;
                }
            }

            this.logger.log("Successfully extracted Facebook creator metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract Facebook metadata: ${error}`, "error");
            return null;
        }
    }

    async extractVideoMetadata(page: Page, videoUrl: string): Promise<VideoMetadata | null> {
        try {
            this.logger.log("Extracting Facebook video metadata...", "info");

            const apiResponses: any[] = [];
            
            page.on('response', async (response) => {
                try {
                    const url = response.url();
                    if (url.includes('graphql') || url.includes('api') || url.includes('graph.facebook.com') || url.includes('graphql/')) {
                        try {
                            const json = await response.json().catch(() => null);
                            if (json) {
                                apiResponses.push(json);
                            }
                        } catch (e) {
                            // Ignore JSON parse errors
                        }
                    }
                } catch (e) {
                    // Ignore response errors
                }
            });

            await page.goto(videoUrl, { waitUntil: "networkidle", timeout: 60000 });
            await this.delay(5000);

            try {
                const loginSelectors = [
                    '[aria-label*="Log in" i]',
                    '[aria-label*="login" i]',
                    'button:has-text("Log in")',
                    'button:has-text("Sign up")',
                    '[role="dialog"]',
                    '[data-testid*="login" i]'
                ];
                
                for (const selector of loginSelectors) {
                    try {
                        const element = await page.locator(selector).first();
                        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
                            this.logger.log("Login overlay detected, attempting to dismiss", "debug");
                            try {
                                await page.keyboard.press("Escape");
                                await this.delay(1000);
                                const closeButton = await page.locator('button[aria-label*="close" i], button[aria-label*="Close" i], [aria-label*="Close" i]').first();
                                if (await closeButton.isVisible({ timeout: 1000 }).catch(() => false)) {
                                    await closeButton.click();
                                    await this.delay(1000);
                                }
                            } catch (e) {
                                this.logger.log("Could not dismiss login overlay", "debug");
                            }
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }
            } catch (e) {
                this.logger.log("No login overlay found or already dismissed", "debug");
            }

            await this.delay(3000);

            try {
                await page.waitForSelector('video, [role="article"], [data-pagelet]', { timeout: 10000 });
            } catch (e) {
                this.logger.log("Facebook content may not be fully loaded", "debug");
            }

            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight / 2);
            });
            await this.delay(2000);
            await page.evaluate(() => {
                window.scrollTo(0, 0);
            });
            await this.delay(3000);

            const metadata: VideoMetadata = {
                platform: "facebook",
                url: videoUrl,
                extractedAt: Date.now(),
            };

            const videoIdMatch = videoUrl.match(/\/videos\/(\d+)/) || 
                                 videoUrl.match(/\/watch\/\?v=(\d+)/) ||
                                 videoUrl.match(/\/reel\/(\d+)/);
            if (videoIdMatch) {
                metadata.video_id = videoIdMatch[1];
            }

            await this.delay(2000);

            for (const apiResponse of apiResponses) {
                try {
                    const extracted = this.extractFromAPIResponse(apiResponse);
                    if (extracted && Object.keys(extracted).length > 0) {
                        Object.assign(metadata, extracted);
                    }
                } catch (e) {
                    // Ignore errors
                }
            }

            const embeddedData = await this.extractFromEmbeddedJSON(page);
            if (embeddedData) {
                const extractedKeys = Object.keys(embeddedData);
                if (extractedKeys.length > 0) {
                    this.logger.log(`Extracted ${extractedKeys.length} fields from embedded data: ${extractedKeys.join(", ")}`, "debug");
                }
                if (embeddedData.updated_time !== undefined) metadata.updated_time = embeddedData.updated_time;
                if (embeddedData.content_category) metadata.content_category = embeddedData.content_category;
                if (embeddedData.embed_html) metadata.embed_html = embeddedData.embed_html;
                if (embeddedData.embeddable !== undefined) metadata.embeddable = embeddedData.embeddable;
                if (embeddedData.icon) metadata.icon = embeddedData.icon;
                if (embeddedData.is_crosspost_video !== undefined) metadata.is_crosspost_video = embeddedData.is_crosspost_video;
                if (embeddedData.is_crossposting_eligible !== undefined) metadata.is_crossposting_eligible = embeddedData.is_crossposting_eligible;
                if (embeddedData.is_episode !== undefined) metadata.is_episode = embeddedData.is_episode;
                if (embeddedData.is_instagram_eligible !== undefined) metadata.is_instagram_eligible = embeddedData.is_instagram_eligible;
                if (embeddedData.live_status) metadata.live_status = embeddedData.live_status;
                if (embeddedData.post_views !== undefined) metadata.post_views = embeddedData.post_views;
                if (embeddedData.premiere_living_room_status) metadata.premiere_living_room_status = embeddedData.premiere_living_room_status;
                if (embeddedData.privacy) metadata.privacy = embeddedData.privacy;
                if (embeddedData.published !== undefined) metadata.published = embeddedData.published;
                if (embeddedData.status) metadata.status = embeddedData.status;
                if (embeddedData.universal_video_id) metadata.universal_video_id = embeddedData.universal_video_id;
                if (embeddedData.total_video_views_unique !== undefined) metadata.total_video_views_unique = embeddedData.total_video_views_unique;
                if (embeddedData.total_video_avg_time_watched !== undefined) metadata.total_video_avg_time_watched = embeddedData.total_video_avg_time_watched;
                if (embeddedData.total_video_complete_views !== undefined) metadata.total_video_complete_views = embeddedData.total_video_complete_views;
                if (embeddedData.total_video_10s_views !== undefined) metadata.total_video_10s_views = embeddedData.total_video_10s_views;
                if (embeddedData.total_video_30s_views !== undefined) metadata.total_video_30s_views = embeddedData.total_video_30s_views;
                if (embeddedData.total_video_60s_excludes_shorter_views !== undefined) metadata.total_video_60s_excludes_shorter_views = embeddedData.total_video_60s_excludes_shorter_views;
                if (embeddedData.reaction_love_count !== undefined) metadata.reaction_love_count = embeddedData.reaction_love_count;
                if (embeddedData.reaction_wow_count !== undefined) metadata.reaction_wow_count = embeddedData.reaction_wow_count;
                if (embeddedData.reaction_haha_count !== undefined) metadata.reaction_haha_count = embeddedData.reaction_haha_count;
                if (embeddedData.reaction_sad_count !== undefined) metadata.reaction_sad_count = embeddedData.reaction_sad_count;
                if (embeddedData.reaction_angry_count !== undefined) metadata.reaction_angry_count = embeddedData.reaction_angry_count;
                if (embeddedData.location) metadata.location = embeddedData.location;
                if (embeddedData.hashtags) metadata.hashtags = embeddedData.hashtags;
                if (embeddedData.caption) metadata.caption = embeddedData.caption;
            }

            const domData = await this.extractFromDOM(page);
            if (domData) {
                if (domData.embed_html && !metadata.embed_html) metadata.embed_html = domData.embed_html;
                if (domData.embeddable !== undefined && metadata.embeddable === undefined) metadata.embeddable = domData.embeddable;
                if (domData.live_status && !metadata.live_status) metadata.live_status = domData.live_status;
                if (domData.published !== undefined && metadata.published === undefined) metadata.published = domData.published;
                if (domData.location && !metadata.location) metadata.location = domData.location;
                if (domData.hashtags && !metadata.hashtags) metadata.hashtags = domData.hashtags;
                if (domData.caption && !metadata.caption) metadata.caption = domData.caption;
            }

            this.logger.log("Successfully extracted Facebook video metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract Facebook video metadata: ${error}`, "error");
            return null;
        }
    }

    private async extractFromEmbeddedJSON(page: Page): Promise<Partial<VideoMetadata> | null> {
        try {
            const data = await page.evaluate(() => {
                const result: any = {};
                
                function safeAccess(obj: any, prop: string): any {
                    try {
                        return obj && typeof obj === 'object' ? obj[prop] : undefined;
                    } catch (e) {
                        return undefined;
                    }
                }

                function extractVideoData(obj: any, path: string = ""): void {
                    if (!obj || typeof obj !== 'object') return;
                    
                    if (Array.isArray(obj)) {
                        for (let i = 0; i < obj.length; i++) {
                            extractVideoData(obj[i], `${path}[${i}]`);
                        }
                        return;
                    }

                    const keys = Object.keys(obj);
                    for (const key of keys) {
                        const value = obj[key];
                        const currentPath = path ? `${path}.${key}` : key;

                        if (key === 'updated_time' || key === 'updatedTime') {
                            if (value) {
                                const date = value instanceof Date ? value : new Date(value);
                                if (!isNaN(date.getTime())) {
                                    result.updated_time = Math.floor(date.getTime() / 1000);
                                }
                            }
                        } else if (key === 'content_category' || key === 'contentCategory' || key === 'category') {
                            if (value && !result.content_category) {
                                result.content_category = typeof value === 'string' ? value : (value.name || String(value));
                            }
                        } else if (key === 'embed_html' || key === 'embedHtml' || key === 'embedCode') {
                            if (value && !result.embed_html) {
                                result.embed_html = String(value);
                            }
                        } else if (key === 'embeddable') {
                            if (value !== undefined && result.embeddable === undefined) {
                                result.embeddable = Boolean(value);
                            }
                        } else if (key === 'icon') {
                            if (value && !result.icon) {
                                result.icon = String(value);
                            }
                        } else if (key === 'is_crosspost_video' || key === 'isCrosspostVideo') {
                            if (value !== undefined && result.is_crosspost_video === undefined) {
                                result.is_crosspost_video = Boolean(value);
                            }
                        } else if (key === 'is_crossposting_eligible' || key === 'isCrosspostingEligible') {
                            if (value !== undefined && result.is_crossposting_eligible === undefined) {
                                result.is_crossposting_eligible = Boolean(value);
                            }
                        } else if (key === 'is_episode' || key === 'isEpisode') {
                            if (value !== undefined && result.is_episode === undefined) {
                                result.is_episode = Boolean(value);
                            }
                        } else if (key === 'is_instagram_eligible' || key === 'isInstagramEligible') {
                            if (value !== undefined && result.is_instagram_eligible === undefined) {
                                result.is_instagram_eligible = Boolean(value);
                            }
                        } else if (key === 'live_status' || key === 'liveStatus') {
                            if (value && !result.live_status) {
                                result.live_status = String(value);
                            }
                        } else if (key === 'post_views' || key === 'postViews') {
                            if (typeof value === 'number' && result.post_views === undefined) {
                                result.post_views = value;
                            }
                        } else if (key === 'premiere_living_room_status' || key === 'premiereLivingRoomStatus') {
                            if (value && !result.premiere_living_room_status) {
                                result.premiere_living_room_status = String(value);
                            }
                        } else if (key === 'privacy') {
                            if (value && !result.privacy) {
                                result.privacy = typeof value === 'string' ? value : JSON.stringify(value);
                            }
                        } else if (key === 'published') {
                            if (value !== undefined && result.published === undefined) {
                                result.published = Boolean(value);
                            }
                        } else if (key === 'status') {
                            if (value && !result.status) {
                                result.status = typeof value === 'string' ? value : JSON.stringify(value);
                            }
                        } else if (key === 'universal_video_id' || key === 'universalVideoId') {
                            if (value && !result.universal_video_id) {
                                result.universal_video_id = String(value);
                            }
                        } else if (key === 'total_video_views_unique' || key === 'totalVideoViewsUnique') {
                            if (typeof value === 'number' && result.total_video_views_unique === undefined) {
                                result.total_video_views_unique = value;
                            }
                        } else if (key === 'total_video_avg_time_watched' || key === 'totalVideoAvgTimeWatched') {
                            if (typeof value === 'number' && result.total_video_avg_time_watched === undefined) {
                                result.total_video_avg_time_watched = value;
                            }
                        } else if (key === 'total_video_complete_views' || key === 'totalVideoCompleteViews') {
                            if (typeof value === 'number' && result.total_video_complete_views === undefined) {
                                result.total_video_complete_views = value;
                            }
                        } else if (key === 'total_video_10s_views' || key === 'totalVideo10sViews') {
                            if (typeof value === 'number' && result.total_video_10s_views === undefined) {
                                result.total_video_10s_views = value;
                            }
                        } else if (key === 'total_video_30s_views' || key === 'totalVideo30sViews') {
                            if (typeof value === 'number' && result.total_video_30s_views === undefined) {
                                result.total_video_30s_views = value;
                            }
                        } else if (key === 'total_video_60s_excludes_shorter_views' || key === 'totalVideo60sExcludesShorterViews') {
                            if (typeof value === 'number' && result.total_video_60s_excludes_shorter_views === undefined) {
                                result.total_video_60s_excludes_shorter_views = value;
                            }
                        } else if (key === 'reactions' && value && typeof value === 'object') {
                            if (value.LOVE !== undefined) result.reaction_love_count = Number(value.LOVE);
                            if (value.WOW !== undefined) result.reaction_wow_count = Number(value.WOW);
                            if (value.HAHA !== undefined) result.reaction_haha_count = Number(value.HAHA);
                            if (value.SAD !== undefined) result.reaction_sad_count = Number(value.SAD);
                            if (value.ANGRY !== undefined) result.reaction_angry_count = Number(value.ANGRY);
                        } else if (key === 'total_video_reactions_by_type_total' && value && typeof value === 'object') {
                            if (value.LOVE !== undefined) result.reaction_love_count = Number(value.LOVE);
                            if (value.WOW !== undefined) result.reaction_wow_count = Number(value.WOW);
                            if (value.HAHA !== undefined) result.reaction_haha_count = Number(value.HAHA);
                            if (value.SAD !== undefined) result.reaction_sad_count = Number(value.SAD);
                            if (value.ANGRY !== undefined) result.reaction_angry_count = Number(value.ANGRY);
                        } else if (key === 'place' && value) {
                            if (!result.location) {
                                result.location = typeof value === 'string' ? value : (value.name || value.address || JSON.stringify(value));
                            }
                        } else if (key === 'content_tags' && Array.isArray(value)) {
                            if (!result.hashtags) {
                                const validTags: string[] = [];
                                for (const tag of value) {
                                    const tagStr = typeof tag === 'string' ? tag : (tag.name || String(tag));
                                    if (tagStr && tagStr.length >= 2 && tagStr.length <= 50) {
                                        if (!/^[0-9A-Fa-f]{3,8}$/.test(tagStr) && !tagStr.match(/^[0-9]+$/)) {
                                            if (/^[a-zA-Z0-9_]+$/.test(tagStr)) {
                                                validTags.push(tagStr);
                                            }
                                        }
                                    }
                                }
                                if (validTags.length > 0) {
                                    result.hashtags = validTags;
                                }
                            }
                        } else if (key === 'description' || key === 'text' || key === 'caption') {
                            if (value && !result.caption) {
                                const captionText = String(value);
                                const lowerText = captionText.toLowerCase();
                                const errorMessages = ['sorry', 'trouble', 'error', 'loading', 'please wait', 'log in', 'sign up'];
                                if (!errorMessages.some(msg => lowerText.includes(msg)) && captionText.length >= 10) {
                                    result.caption = captionText;
                                }
                            }
                        }

                        if (typeof value === 'object' && value !== null) {
                            extractVideoData(value, currentPath);
                        }
                    }
                }

                const scripts = document.querySelectorAll('script[type="application/ld+json"]');
                for (const script of scripts) {
                    try {
                        const json = JSON.parse(script.textContent || '{}');
                        if (json['@type'] === 'VideoObject' || json['@type'] === 'SocialMediaPosting') {
                            extractVideoData(json);
                        }
                    } catch (e) {
                        continue;
                    }
                }

                const allScripts = document.querySelectorAll('script:not([src])');
                for (const script of allScripts) {
                    const text = script.textContent || '';
                    if (text.length < 100 || text.length > 1000000) continue;
                    
                    const searchTerms = [
                        'updated_time', 'content_category', 'embed_html', 'embeddable',
                        'is_crosspost_video', 'live_status', 'total_video_views_unique',
                        'reactions', 'total_video_reactions_by_type_total', 'content_tags',
                        'universal_video_id', 'premiere_living_room_status'
                    ];
                    
                    const hasRelevantData = searchTerms.some(term => text.includes(term));
                    if (!hasRelevantData) continue;

                    try {
                        const jsonMatches = [
                            text.match(/\{[\s\S]{100,100000}\}/g),
                            text.match(/\[[\s\S]{100,100000}\]/g)
                        ].flat().filter(Boolean);

                        for (const match of jsonMatches) {
                            try {
                                const json = JSON.parse(match);
                                extractVideoData(json);
                            } catch (e) {
                                continue;
                            }
                        }

                        const requireMatches = text.match(/require\([^)]+\)/g);
                        if (requireMatches) {
                            for (const match of requireMatches) {
                                try {
                                    const innerMatch = match.match(/\{[\s\S]{50,50000}\}/);
                                    if (innerMatch) {
                                        const json = JSON.parse(innerMatch[0]);
                                        extractVideoData(json);
                                    }
                                } catch (e) {
                                    continue;
                                }
                            }
                        }
                    } catch (e) {
                        continue;
                    }
                }

                try {
                    const win = window;
                    const windowProps = ['__d', 'require', '_sharedData', '__initialData'];
                    
                    for (const prop of windowProps) {
                        try {
                            if (prop in win) {
                                const descriptor = Object.getOwnPropertyDescriptor(win, prop);
                                if (descriptor && descriptor.value) {
                                    const value = descriptor.value;
                                    if (value && typeof value === 'object') {
                                        extractVideoData(value);
                                    }
                                } else {
                                    try {
                                        const value = (win as any)[prop];
                                        if (value && typeof value === 'object') {
                                            extractVideoData(value);
                                        }
                                    } catch (e) {
                                        continue;
                                    }
                                }
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                } catch (e) {
                    // Ignore errors accessing window properties
                }

                const metaTags = document.querySelectorAll('meta[property], meta[name]');
                for (const meta of metaTags) {
                    const property = meta.getAttribute("property") || meta.getAttribute("name") || "";
                    const content = meta.getAttribute("content") || "";
                    
                    if (property.includes("og:video:tag") && content) {
                        if (!result.hashtags) result.hashtags = [];
                        result.hashtags.push(content);
                    }
                    if ((property.includes("video:category") || property.includes("og:video:category")) && !result.content_category) {
                        result.content_category = content;
                    }
                    if (property.includes("og:video:embed") && !result.embed_html) {
                        result.embed_html = content;
                    }
                }

                return result;
            }).catch((error) => {
                this.logger.log(`Error in page.evaluate: ${error}`, "debug");
                return {};
            });

            return data && Object.keys(data).length > 0 ? data : null;
        } catch (error) {
            this.logger.log(`Failed to extract from embedded JSON: ${error}`, "debug");
            return null;
        }
    }

    private extractFromAPIResponse(response: any): Partial<VideoMetadata> | null {
        try {
            const result: any = {};
            
            function extractData(obj: any): void {
                if (!obj || typeof obj !== 'object') return;
                
                if (Array.isArray(obj)) {
                    for (const item of obj) {
                        extractData(item);
                    }
                    return;
                }

                for (const key in obj) {
                    const value = obj[key];
                    
                    if (key === 'updated_time' && value) {
                        const date = new Date(value);
                        if (!isNaN(date.getTime())) {
                            result.updated_time = Math.floor(date.getTime() / 1000);
                        }
                    } else if (key === 'content_category' && value && !result.content_category) {
                        result.content_category = String(value);
                    } else if (key === 'embed_html' && value && !result.embed_html) {
                        result.embed_html = String(value);
                    } else if (key === 'embeddable' && value !== undefined && result.embeddable === undefined) {
                        result.embeddable = Boolean(value);
                    } else if (key === 'is_crosspost_video' && value !== undefined && result.is_crosspost_video === undefined) {
                        result.is_crosspost_video = Boolean(value);
                    } else if (key === 'live_status' && value && !result.live_status) {
                        result.live_status = String(value);
                    } else if (key === 'total_video_views_unique' && value !== undefined && result.total_video_views_unique === undefined) {
                        result.total_video_views_unique = Number(value) || 0;
                    } else if (key === 'total_video_avg_time_watched' && value !== undefined && result.total_video_avg_time_watched === undefined) {
                        result.total_video_avg_time_watched = Number(value) || 0;
                    } else if (key === 'total_video_complete_views' && value !== undefined && result.total_video_complete_views === undefined) {
                        result.total_video_complete_views = Number(value) || 0;
                    } else if (key === 'reactions' && value && typeof value === 'object') {
                        if (value.summary && value.summary.total_count !== undefined) {
                            // Handle reaction counts
                        }
                        if (value.data && Array.isArray(value.data)) {
                            for (const reaction of value.data) {
                                if (reaction.type === 'LOVE' && reaction.total_count !== undefined) {
                                    result.reaction_love_count = reaction.total_count;
                                } else if (reaction.type === 'WOW' && reaction.total_count !== undefined) {
                                    result.reaction_wow_count = reaction.total_count;
                                } else if (reaction.type === 'HAHA' && reaction.total_count !== undefined) {
                                    result.reaction_haha_count = reaction.total_count;
                                } else if (reaction.type === 'SAD' && reaction.total_count !== undefined) {
                                    result.reaction_sad_count = reaction.total_count;
                                } else if (reaction.type === 'ANGRY' && reaction.total_count !== undefined) {
                                    result.reaction_angry_count = reaction.total_count;
                                }
                            }
                        }
                    }
                    
                    if (typeof value === 'object' && value !== null) {
                        extractData(value);
                    }
                }
            }
            
            extractData(response);
            return Object.keys(result).length > 0 ? result : null;
        } catch (error) {
            return null;
        }
    }

    private async extractFromDOM(page: Page): Promise<Partial<VideoMetadata> | null> {
        try {
            const data = await page.evaluate(() => {
                const result: any = {};

                const videoElement = document.querySelector('video');
                if (videoElement) {
                    result.is_video = true;
                }

                const embedButtons = document.querySelectorAll('button[aria-label*="embed" i], a[href*="embed"]');
                if (embedButtons.length > 0) {
                    result.embeddable = true;
                    for (const btn of embedButtons) {
                        const href = btn.getAttribute('href');
                        if (href && href.includes('embed')) {
                            result.embed_html = href;
                            break;
                        }
                    }
                }

                const liveIndicators = document.querySelectorAll('[aria-label*="live" i], [class*="live" i], [data-testid*="live" i]');
                if (liveIndicators.length > 0) {
                    result.live_status = "LIVE";
                } else {
                    const vodIndicators = document.querySelectorAll('[aria-label*="video" i], [class*="video" i], video');
                    if (vodIndicators.length > 0) {
                        result.live_status = "VOD";
                    }
                }

                const publishedIndicators = document.querySelectorAll('[aria-label*="published" i], [class*="published" i]');
                if (publishedIndicators.length > 0) {
                    result.published = true;
                }

                const locationElements = document.querySelectorAll('[aria-label*="location" i], [class*="location" i], [data-testid*="location" i]');
                for (const el of locationElements) {
                    const text = el.textContent || '';
                    if (text.length > 0 && text.length < 200) {
                        result.location = text.trim();
                        break;
                    }
                }

                function isValidHashtag(tag: string): boolean {
                    if (!tag || tag.length < 2 || tag.length > 50) return false;
                    if (/^[0-9A-Fa-f]{3,8}$/.test(tag)) return false;
                    if (tag.match(/^[0-9]+$/)) return false;
                    if (tag.includes(' ') || tag.includes('\n')) return false;
                    return /^[a-zA-Z0-9_]+$/.test(tag);
                }

                const hashtagElements = document.querySelectorAll('a[href*="/hashtag/"], a[href*="/tag/"], a[href*="hashtag"]');
                const hashtags: string[] = [];
                for (const el of hashtagElements) {
                    const text = el.textContent || '';
                    const cleanText = text.startsWith('#') ? text.substring(1).trim() : text.trim();
                    if (isValidHashtag(cleanText) && !hashtags.includes(cleanText)) {
                        hashtags.push(cleanText);
                    }
                }
                
                const captionText = document.body.textContent || '';
                const captionHashtags = captionText.match(/#[a-zA-Z0-9_]+/g);
                if (captionHashtags) {
                    captionHashtags.forEach(tag => {
                        const cleanTag = tag.substring(1);
                        if (isValidHashtag(cleanTag) && !hashtags.includes(cleanTag)) {
                            hashtags.push(cleanTag);
                        }
                    });
                }
                
                if (hashtags.length > 0) {
                    result.hashtags = hashtags;
                }

                function isValidCaption(text: string): boolean {
                    if (!text || text.length < 10 || text.length > 5000) return false;
                    const errorMessages = [
                        'sorry', 'trouble', 'error', 'loading', 'please wait',
                        'log in', 'sign up', 'sign in', 'create account',
                        'learn more', 'try again', 'refresh', 'reload'
                    ];
                    const lowerText = text.toLowerCase();
                    if (errorMessages.some(msg => lowerText.includes(msg))) return false;
                    return true;
                }

                const captionSelectors = [
                    '[data-testid*="post" i]',
                    '[class*="post" i]',
                    '[class*="caption" i]',
                    '[role="article"]',
                    'article',
                    '[data-pagelet]'
                ];
                
                for (const selector of captionSelectors) {
                    const elements = document.querySelectorAll(selector);
                    for (const el of elements) {
                        const text = el.textContent || '';
                        if (isValidCaption(text)) {
                            result.caption = text.trim();
                            break;
                        }
                    }
                    if (result.caption) break;
                }

                const metaTags = document.querySelectorAll('meta[property], meta[name]');
                for (const meta of metaTags) {
                    const property = meta.getAttribute("property") || meta.getAttribute("name") || "";
                    const content = meta.getAttribute("content") || "";
                    
                    if ((property.includes("og:title") || property.includes("twitter:title")) && !result.caption) {
                        result.caption = content;
                    }
                    if ((property.includes("og:description") || property.includes("twitter:description")) && !result.caption) {
                        result.caption = content;
                    }
                }

                return result;
            }).catch((error) => {
                return {};
            });

            return data && Object.keys(data).length > 0 ? data : null;
        } catch (error) {
            this.logger.log(`Failed to extract from DOM: ${error}`, "debug");
            return null;
        }
    }
}

