import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata } from "../types/index.js";
import { CreatorMetadataScraper } from "./CreatorMetadataScraper.js";

/**
 * YouTube scraper focused on extracting metadata that yt-dlp cannot get.
 * 
 * Fields yt-dlp CANNOT get (what this scraper extracts):
 * - creator_avatar_url: Channel profile image
 * - creator_verified: Verification badge status
 * - mentions: @mentions parsed from description
 * - embeddable: Whether video can be embedded
 * - dimension: 2d or 3d
 * - projection: 360 or rectangular
 * - madeForKids: Kids content flag
 * - isShort: YouTube Shorts detection
 */
export class YouTubeScraper extends CreatorMetadataScraper {
    async getCreatorProfileUrl(videoUrl: string): Promise<string | null> {
        return null;
    }

    async extractMetadata(page: Page, videoUrl: string): Promise<CreatorMetadata | null> {
        try {
            this.logger.log("Extracting YouTube creator metadata (avatar, verified)...", "info");

            await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
            await this.delay(3000);

            let channelUrl: string | null = null;
            const channelSelectors = [
                'a[href*="/channel/"]',
                'a[href*="/c/"]',
                'a[href*="/user/"]',
                'a[href*="/@"]',
                'ytd-channel-name a',
                '#channel-name a',
            ];

            for (const selector of channelSelectors) {
                const link = await this.getElementAttribute(page, selector, "href");
                if (link && (link.includes("/channel/") || link.includes("/c/") || link.includes("/user/") || link.includes("/@"))) {
                    channelUrl = link.startsWith("http") ? link : `https://www.youtube.com${link}`;
                    break;
                }
            }

            if (!channelUrl) {
                this.logger.log("Could not find channel URL", "warn");
                return null;
            }

            this.logger.log(`Found channel URL: ${channelUrl}`, "debug");

            await page.goto(channelUrl, { waitUntil: "networkidle" });
            await this.delay(3000);

            try {
                await page.waitForSelector('ytd-channel-avatar, #avatar', { timeout: 5000 });
            } catch {
                // Continue if selector not found
            }

            const metadata: CreatorMetadata = {
                platform: "youtube",
                url: channelUrl,
                extractedAt: Date.now(),
            };

            // Extract avatar URL (yt-dlp cannot get this)
            metadata.creator_avatar_url = await this.extractAvatarUrl(page);

            // Extract verified status (yt-dlp cannot get this)
            metadata.creator_verified = await this.extractVerifiedStatus(page);

            this.logger.log("Successfully extracted YouTube creator metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract YouTube metadata: ${error}`, "error");
            return null;
        }
    }

    async extractVideoMetadata(page: Page, videoUrl: string): Promise<VideoMetadata | null> {
        try {
            this.logger.log("Extracting YouTube video metadata (all fields for fallback)...", "info");

            await page.goto(videoUrl, { waitUntil: "networkidle" });
            await this.delay(3000);
            
            // Wait for engagement metrics to load (like/comment counts)
            try {
                await page.waitForSelector('ytd-video-primary-info-renderer, #top-level-buttons-computed', { timeout: 5000 });
            } catch {
                // Continue if not found
            }
            await this.delay(2000);
            
            // Scroll to comments section to trigger loading
            try {
                await page.evaluate(() => {
                    const commentsSection = document.querySelector('ytd-comments-header-renderer, #comments');
                    if (commentsSection) {
                        commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
                await this.delay(2000);
            } catch {
                // Continue if scroll fails
            }

            const videoIdMatch = videoUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
            const isShortUrl = videoUrl.includes("/shorts/");

            const metadata: VideoMetadata = {
                platform: "youtube",
                url: videoUrl,
                extractedAt: Date.now(),
            };

            if (videoIdMatch) {
                metadata.video_id = videoIdMatch[1];
            }

            // Extract data from YouTube's embedded JSON
            const embeddedData = await this.extractYouTubeSpecificData(page);
            
            // Fallback: Try DOM extraction for like_count and comment_count if JSON extraction failed
            if (embeddedData) {
                const domData = await this.extractFromDOM(page);
                if (domData) {
                    if (!embeddedData.like_count && domData.like_count) {
                        embeddedData.like_count = domData.like_count;
                    }
                    if (!embeddedData.comment_count && domData.comment_count) {
                        embeddedData.comment_count = domData.comment_count;
                    }
                }
            }
            
            if (embeddedData) {
                // Fields that yt-dlp can get (for fallback/redundancy)
                // Store title and description - prefer full description from ytInitialData
                if (embeddedData.title) {
                    metadata.caption = embeddedData.title;
                }
                // Store full description (from ytInitialData is longer than shortDescription from videoDetails)
                if (embeddedData.description) {
                    // If we have title, store description in a way we can access it
                    // For now, if no title, use description as caption
                    if (!metadata.caption) {
                        metadata.caption = embeddedData.description;
                    } else {
                        // Title exists, append description to caption or store separately
                        // Since VideoMetadata doesn't have separate description field, append to caption
                        metadata.caption = `${metadata.caption}\n\n${embeddedData.description}`;
                    }
                }
                if (embeddedData.view_count !== undefined) metadata.view_count = embeddedData.view_count;
                if (embeddedData.like_count !== undefined) metadata.like_count = embeddedData.like_count;
                if (embeddedData.comment_count !== undefined) metadata.comment_count = embeddedData.comment_count;
                if (embeddedData.timestamp !== undefined) metadata.timestamp = embeddedData.timestamp;
                if (embeddedData.tags) metadata.hashtags = embeddedData.tags;
                if (embeddedData.duration !== undefined) metadata.duration = embeddedData.duration;
                if (embeddedData.channel_id) metadata.channel_id = embeddedData.channel_id;
                if (embeddedData.channel_name) metadata.channel_name = embeddedData.channel_name;
                if (embeddedData.thumbnails && embeddedData.thumbnails.length > 0) metadata.thumbnails = embeddedData.thumbnails;
                if (embeddedData.definition) metadata.definition = embeddedData.definition;
                if (embeddedData.concurrentViewers !== undefined) metadata.concurrentViewers = embeddedData.concurrentViewers;
                
                // Fields that yt-dlp cannot get
                if (embeddedData.mentions) metadata.mentions = embeddedData.mentions;
                if (embeddedData.embeddable !== undefined) metadata.embeddable = embeddedData.embeddable;
                if (embeddedData.dimension) metadata.dimension = embeddedData.dimension;
                if (embeddedData.projection) metadata.projection = embeddedData.projection;
                if (embeddedData.madeForKids !== undefined) metadata.madeForKids = embeddedData.madeForKids;
                if (embeddedData.isShort !== undefined) metadata.isShort = embeddedData.isShort;
                if (embeddedData.isLive !== undefined) metadata.isLive = embeddedData.isLive;
                if (embeddedData.isUpcoming !== undefined) metadata.isUpcoming = embeddedData.isUpcoming;
                if (embeddedData.hasCaptions !== undefined) metadata.hasCaptions = embeddedData.hasCaptions;
                if (embeddedData.isUnlisted !== undefined) metadata.isUnlisted = embeddedData.isUnlisted;
                if (embeddedData.isAgeRestricted !== undefined) metadata.isAgeRestricted = embeddedData.isAgeRestricted;
                if (embeddedData.category) metadata.category = embeddedData.category;
                if (embeddedData.defaultLanguage) metadata.defaultLanguage = embeddedData.defaultLanguage;
            }

            // URL-based short detection as fallback
            if (metadata.isShort === undefined && isShortUrl) {
                metadata.isShort = true;
            }

            this.logger.log("Successfully extracted YouTube video metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract YouTube video metadata: ${error}`, "error");
            return null;
        }
    }

    private async extractFromDOM(page: Page): Promise<{ like_count?: number; comment_count?: number } | null> {
        try {
            const data = await page.evaluate(() => {
                const result: any = {};

                // Try to extract like count from DOM
                const likeSelectors = [
                    'ytd-toggle-button-renderer[aria-label*="like"]',
                    'button[aria-label*="like"]',
                    '#top-level-buttons-computed button[aria-label*="like"]',
                ];

                for (const selector of likeSelectors) {
                    try {
                        const elements = document.querySelectorAll(selector);
                        for (const el of elements) {
                            const ariaLabel = el.getAttribute('aria-label') || '';
                            if (ariaLabel && ariaLabel.toLowerCase().includes('like') && 
                                !ariaLabel.toLowerCase().includes('view') && 
                                /[\d.,]+[KMB]?/.test(ariaLabel)) {
                                const match = ariaLabel.match(/([\d.,]+[KMB]?)/);
                                if (match) {
                                    let num = parseFloat(match[1].replace(/,/g, ''));
                                    const matchText = match[1];
                                    if (matchText.includes('K') || matchText.includes('k')) num *= 1000;
                                    else if (matchText.includes('M') || matchText.includes('m')) num *= 1000000;
                                    else if (matchText.includes('B') || matchText.includes('b')) num *= 1000000000;
                                    if (num < 1000000000 && num > 0) {
                                        result.like_count = Math.floor(num);
                                        break;
                                    }
                                }
                            }
                        }
                        if (result.like_count) break;
                    } catch (e) {
                        continue;
                    }
                }

                // Try to extract comment count from DOM
                const commentSelectors = [
                    'ytd-comments-header-renderer #count',
                    'h2#count',
                    'yt-formatted-string[id="count"]',
                    'ytd-comments-header-renderer yt-formatted-string',
                    '#count-text',
                    '[aria-label*="comment"]',
                    'ytd-comments-header-renderer span',
                ];

                for (const selector of commentSelectors) {
                    try {
                        const elements = document.querySelectorAll(selector);
                        for (const el of elements) {
                            const text = (el.textContent || '').trim();
                            if (text && /^[\d.,]+[KMB]?\s*(comment|comments)?$/i.test(text)) {
                                const match = text.match(/([\d.,]+[KMB]?)/);
                                if (match) {
                                    let num = parseFloat(match[1].replace(/,/g, ''));
                                    const matchText = match[1];
                                    if (matchText.includes('K') || matchText.includes('k')) num *= 1000;
                                    else if (matchText.includes('M') || matchText.includes('m')) num *= 1000000;
                                    else if (matchText.includes('B') || matchText.includes('b')) num *= 1000000000;
                                    // Sanity check: comment count shouldn't exceed 100 million
                                    if (num > 0 && num < 100000000) {
                                        result.comment_count = Math.floor(num);
                                        break;
                                    }
                                }
                            }
                        }
                        if (result.comment_count) break;
                    } catch (e) {
                        continue;
                    }
                }

                return result;
            });

            return data;
        } catch (error) {
            this.logger.log(`Failed to extract from DOM: ${error}`, "debug");
            return null;
        }
    }

    private async extractAvatarUrl(page: Page): Promise<string | undefined> {
        try {
            await this.delay(2000);

            // Try to find avatar via page.evaluate (most reliable)
            const avatar = await page.evaluate(() => {
                // Method 1: ytd-channel-avatar container
                const avatarContainer = document.querySelector('ytd-channel-avatar');
                if (avatarContainer) {
                    const img = avatarContainer.querySelector('img');
                    if (img) {
                        const src = img.src || img.currentSrc;
                        if (src && (src.includes('ggpht.com') || src.includes('ytimg.com') || src.includes('googleusercontent.com'))) {
                            return src;
                        }
                    }
                }
                
                // Method 2: #avatar element
                const avatarEl = document.querySelector('#avatar img');
                if (avatarEl) {
                    const img = avatarEl as HTMLImageElement;
                    const src = img.src || img.currentSrc;
                    if (src && (src.includes('ggpht.com') || src.includes('ytimg.com') || src.includes('googleusercontent.com'))) {
                        return src;
                    }
                }
                
                // Method 3: Search all images for channel avatar pattern
                const images = document.querySelectorAll('img');
                for (const img of images) {
                    const src = img.src || img.currentSrc;
                    if (src && src.includes('ggpht.com') && src.includes('=s')) {
                        // Check if it's likely an avatar (usually has =s followed by dimensions)
                        if (!src.includes('banner') && !src.includes('hqdefault') && !src.includes('mqdefault')) {
                            return src;
                        }
                    }
                }
                
                // Method 4: Look in ytInitialData for channel avatar
                if ((window as any).ytInitialData) {
                    const ytData = (window as any).ytInitialData;
                    const header = ytData?.header?.c4TabbedHeaderRenderer;
                    if (header?.avatar?.thumbnails) {
                        const thumbnails = header.avatar.thumbnails;
                        if (thumbnails.length > 0) {
                            // Get the largest thumbnail
                            const largest = thumbnails[thumbnails.length - 1];
                            return largest.url;
                        }
                    }
                }
                
                return null;
            });

            if (avatar && this.isValidAvatarUrl(avatar)) {
                this.logger.log(`Found avatar URL: ${avatar.substring(0, 60)}...`, "info");
                return avatar;
            }

            this.logger.log("Could not find avatar URL on channel page", "warn");
            return undefined;
        } catch (error) {
            this.logger.log(`Error extracting avatar: ${error}`, "warn");
            return undefined;
        }
    }

    private isValidAvatarUrl(url: string): boolean {
        if (!url) return false;
        const isYouTubeImage = url.includes('ytimg.com') || 
                              url.includes('googleusercontent.com') ||
                              url.includes('ggpht.com');
        const isNotBanner = !url.includes('featured_channel') && 
                           !url.includes('banner') && 
                           !url.includes('hqdefault') &&
                           !url.includes('mqdefault') &&
                           !url.includes('sddefault');
        return isYouTubeImage && isNotBanner;
    }

    private async extractVerifiedStatus(page: Page): Promise<boolean> {
        try {
            const verifiedSelectors = [
                '[aria-label*="Verified"]',
                '[aria-label*="verified"]',
                '#badge',
                'yt-icon#badge',
            ];

            for (const selector of verifiedSelectors) {
                try {
                    const verified = page.locator(selector).first();
                    if (await verified.isVisible({ timeout: 2000 }).catch(() => false)) {
                        const ariaLabel = await verified.getAttribute("aria-label").catch(() => null);
                        if (ariaLabel && ariaLabel.toLowerCase().includes("verified")) {
                            return true;
                        }
                    }
                } catch {
                    continue;
                }
            }

            return false;
        } catch {
            return false;
        }
    }

    private async extractYouTubeSpecificData(page: Page): Promise<{
        //fields that yt-dlp can get but i added here for completeness
        title?: string;
        description?: string;
        view_count?: number;
        like_count?: number;
        comment_count?: number;
        timestamp?: number;
        duration?: number;
        channel_id?: string;
        channel_name?: string;
        tags?: string[];
        thumbnails?: string[];
        definition?: string;
        concurrentViewers?: number;
        //fields that yt-dlp cannot get
        mentions?: string[];
        embeddable?: boolean;
        dimension?: string;
        projection?: string;
        madeForKids?: boolean;
        isShort?: boolean;
        isLive?: boolean;
        isUpcoming?: boolean;
        hasCaptions?: boolean;
        isUnlisted?: boolean;
        isAgeRestricted?: boolean;
        category?: string;
        defaultLanguage?: string;
    } | null> {
        try {
            // Verify page has loaded YouTube data
            const hasData = await page.evaluate(() => {
                return !!(window as any).ytInitialPlayerResponse || !!(window as any).ytInitialData;
            });
            
            if (!hasData) {
                this.logger.log("YouTube data not loaded yet, waiting...", "warn");
                await this.delay(3000);
            }
            
            const data = await page.evaluate(() => {
                const result: any = {};

                // Extract from ytInitialPlayerResponse
                if ((window as any).ytInitialPlayerResponse) {
                    const playerData = (window as any).ytInitialPlayerResponse;

                    // Embeddable status
                    if (playerData?.playabilityStatus?.playableInEmbed !== undefined) {
                        result.embeddable = playerData.playabilityStatus.playableInEmbed;
                    }

                    // Age restriction
                    const playabilityStatus = playerData?.playabilityStatus;
                    if (playabilityStatus) {
                        if (playabilityStatus.reason?.includes('age') || 
                            playabilityStatus.messages?.some((m: string) => m.toLowerCase().includes('age'))) {
                            result.isAgeRestricted = true;
                        } else {
                            result.isAgeRestricted = false;
                        }
                    }

                    // Dimension (2d/3d), projection (360/rectangular), and definition (HD/SD)
                    const streamingData = playerData?.streamingData;
                    if (streamingData?.adaptiveFormats) {
                        let highestQuality = 0;
                        for (const format of streamingData.adaptiveFormats) {
                            if (format.projectionType) {
                                result.projection = format.projectionType === 'RECTANGULAR' ? 'rectangular' : '360';
                            }
                            if (format.stereoLayout) {
                                result.dimension = '3d';
                            }
                            // Check for definition (HD/SD) - look for height >= 720 for HD
                            if (format.height && format.height >= 720) {
                                result.definition = 'hd';
                                highestQuality = Math.max(highestQuality, format.height);
                            }
                        }
                        // If we found HD, keep it; otherwise check if any format exists
                        if (!result.definition && streamingData.adaptiveFormats.length > 0) {
                            // Check if any format has height < 720, then it's SD
                            const hasLowQuality = streamingData.adaptiveFormats.some((f: any) => f.height && f.height < 720);
                            if (hasLowQuality) {
                                result.definition = 'sd';
                            }
                        }
                    }
                    if (!result.dimension) {
                        result.dimension = '2d';
                    }

                    // Check videoDetails
                    const videoDetails = playerData?.videoDetails;
                    if (videoDetails) {
                        if (videoDetails.isShortFormVideo !== undefined) {
                            result.isShort = videoDetails.isShortFormVideo;
                        }
                        if (videoDetails.isLiveContent !== undefined) {
                            result.isLive = videoDetails.isLiveContent;
                        }
                        if (videoDetails.isUpcoming !== undefined) {
                            result.isUpcoming = videoDetails.isUpcoming;
                        }
                        // Extract concurrent viewers for live streams
                        if (result.isLive) {
                            // Try videoDetails.concurrentViewers first
                            if (videoDetails.concurrentViewers) {
                                const viewersStr = String(videoDetails.concurrentViewers);
                                if (viewersStr.includes(',') || viewersStr.includes('.')) {
                                    let num = parseFloat(viewersStr.replace(/,/g, ''));
                                    if (viewersStr.includes('K') || viewersStr.includes('k')) num *= 1000;
                                    else if (viewersStr.includes('M') || viewersStr.includes('m')) num *= 1000000;
                                    result.concurrentViewers = Math.floor(num);
                                } else {
                                    result.concurrentViewers = parseInt(viewersStr) || 0;
                                }
                            }
                            // Also check videoDetails.concurrentViewerCount (alternative field name)
                            if (!result.concurrentViewers && (videoDetails as any).concurrentViewerCount) {
                                const viewersStr = String((videoDetails as any).concurrentViewerCount);
                                if (viewersStr.includes(',') || viewersStr.includes('.')) {
                                    let num = parseFloat(viewersStr.replace(/,/g, ''));
                                    if (viewersStr.includes('K') || viewersStr.includes('k')) num *= 1000;
                                    else if (viewersStr.includes('M') || viewersStr.includes('m')) num *= 1000000;
                                    result.concurrentViewers = Math.floor(num);
                                } else {
                                    result.concurrentViewers = parseInt(viewersStr) || 0;
                                }
                            }
                        }
                        // Check video length for Shorts (usually <= 60 seconds)
                        if (result.isShort === undefined && videoDetails.lengthSeconds) {
                            const length = parseInt(videoDetails.lengthSeconds);
                            if (length > 0 && length <= 60) {
                                // Could be a Short, but not definitive
                                // We'll rely on other indicators
                            }
                        }
                        if (videoDetails.title) {
                            result.title = videoDetails.title;
                        }
                        if (videoDetails.shortDescription) {
                            result.description = videoDetails.shortDescription;
                        }
                        if (videoDetails.viewCount) {
                            const viewCountStr = String(videoDetails.viewCount);
                            // Handle formatted numbers like "1,503,533,943" or "1.5B"
                            if (viewCountStr.includes(',') || viewCountStr.includes('.')) {
                                let num = parseFloat(viewCountStr.replace(/,/g, ''));
                                if (viewCountStr.includes('K') || viewCountStr.includes('k')) num *= 1000;
                                else if (viewCountStr.includes('M') || viewCountStr.includes('m')) num *= 1000000;
                                else if (viewCountStr.includes('B') || viewCountStr.includes('b')) num *= 1000000000;
                                result.view_count = Math.floor(num);
                            } else {
                                result.view_count = parseInt(viewCountStr) || 0;
                            }
                        }
                        if (videoDetails.lengthSeconds) {
                            result.duration = parseInt(videoDetails.lengthSeconds) || 0;
                        }
                        if (videoDetails.channelId) {
                            result.channel_id = videoDetails.channelId;
                        }
                        if (videoDetails.author) {
                            result.channel_name = videoDetails.author;
                        }
                        if (videoDetails.thumbnail?.thumbnails && videoDetails.thumbnail.thumbnails.length > 0) {
                            result.thumbnails = videoDetails.thumbnail.thumbnails.map((t: any) => t.url);
                        }
                        if (videoDetails.keywords && videoDetails.keywords.length > 0) {
                            result.tags = videoDetails.keywords;
                        }
                    }

                    // Microformat data
                    const microformat = playerData?.microformat?.playerMicroformatRenderer;
                    if (microformat) {
                        if (microformat.category) {
                            result.category = microformat.category;
                        }
                        // Priority 1: defaultAudioLanguage (most reliable - actual video audio language)
                        if (microformat.defaultAudioLanguage) {
                            result.defaultLanguage = microformat.defaultAudioLanguage;
                        }
                        // Priority 2: videoDetails.defaultAudioLanguage
                        if (!result.defaultLanguage && videoDetails?.defaultAudioLanguage) {
                            result.defaultLanguage = videoDetails.defaultAudioLanguage;
                        }
                        // Priority 3: Look for original/primary caption track (not first one, which might be user's language)
                        // Only use caption tracks if defaultAudioLanguage is not available
                        // And be very careful - caption tracks can be in any language, including user's interface language
                        if (!result.defaultLanguage && playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks) {
                            const tracks = playerData.captions.playerCaptionsTracklistRenderer.captionTracks;
                            // Look for track marked as original or primary (not auto-generated)
                            const originalTrack = tracks.find((t: any) => 
                                t.name?.simpleText?.toLowerCase().includes('original') ||
                                (t.kind !== 'asr' && t.isTranslatable === false)
                            );
                            if (originalTrack && originalTrack.languageCode) {
                                result.defaultLanguage = originalTrack.languageCode;
                            } else {
                                // Try to find English track first (most common video language)
                                const englishTrack = tracks.find((t: any) => 
                                    t.languageCode && (t.languageCode.startsWith('en') || t.languageCode === 'en')
                                );
                                if (englishTrack && englishTrack.languageCode) {
                                    result.defaultLanguage = englishTrack.languageCode;
                                } else {
                                    // Only use first track if it's not auto-generated (ASR) and matches common video languages
                                    // Avoid using user's interface language (zh-*, etc. unless it's a common video language)
                                    const firstTrack = tracks[0];
                                    if (firstTrack && firstTrack.languageCode && firstTrack.kind !== 'asr') {
                                        const langCode = firstTrack.languageCode.split('-')[0];
                                        // Common video languages - prefer these over interface language
                                        const commonVideoLanguages = ['en', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'it', 'nl', 'pl', 'tr', 'vi', 'ar', 'hi', 'th', 'id', 'ms', 'tl', 'zh'];
                                        // Only use if it's a common video language (zh is included but we prefer en)
                                        if (commonVideoLanguages.includes(langCode) && langCode !== 'zh') {
                                            result.defaultLanguage = firstTrack.languageCode;
                                        }
                                    }
                                }
                            }
                        }
                        // Don't use microformat.language - it's usually the user's interface language, not video language
                        // If we still don't have a language, leave it undefined rather than using wrong data
                        if (microformat.isUnlisted !== undefined) {
                            result.isUnlisted = microformat.isUnlisted;
                        }
                        if (microformat.liveBroadcastDetails) {
                            result.isLive = microformat.liveBroadcastDetails.isLiveNow || false;
                            // Check for upcoming/scheduled streams
                            if (microformat.liveBroadcastDetails.startTimestamp) {
                                const startTime = parseInt(microformat.liveBroadcastDetails.startTimestamp);
                                const now = Math.floor(Date.now() / 1000);
                                if (startTime > now) {
                                    result.isUpcoming = true;
                                }
                            }
                        }
                        // Timestamp from publishDate or uploadDate
                        if (microformat.publishDate) {
                            const date = new Date(microformat.publishDate);
                            result.timestamp = Math.floor(date.getTime() / 1000);
                        } else if (microformat.uploadDate) {
                            const date = new Date(microformat.uploadDate);
                            result.timestamp = Math.floor(date.getTime() / 1000);
                        }
                    }

                    // Made for kids - check multiple locations
                    // Location 1: videoDetails
                    if (playerData?.videoDetails?.isMadeForKids !== undefined) {
                        result.madeForKids = playerData.videoDetails.isMadeForKids;
                    }
                    // Location 2: playabilityStatus
                    if (result.madeForKids === undefined && playerData?.playabilityStatus?.madeForKids !== undefined) {
                        result.madeForKids = playerData.playabilityStatus.madeForKids;
                    }
                    // Location 3: microformat
                    if (result.madeForKids === undefined && microformat?.isMadeForKids !== undefined) {
                        result.madeForKids = microformat.isMadeForKids;
                    }
                    // Location 4: Check if comments are disabled (kids videos have no comments)
                    // This is a heuristic, not definitive
                    // Location 5: Check videoDetails for kids content indicators
                    if (result.madeForKids === undefined && videoDetails) {
                        // Some videos have explicit kids content flags
                        if (videoDetails.isKidsContent !== undefined) {
                            result.madeForKids = videoDetails.isKidsContent;
                        }
                    }

                    // Captions
                    const captions = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
                    result.hasCaptions = captions && captions.length > 0;
                }

                // Extract from ytInitialData
                if ((window as any).ytInitialData) {
                    const ytData = (window as any).ytInitialData;

                    // Made for kids from ytInitialData (multiple checks)
                    if (result.madeForKids === undefined) {
                        // Check 1: Direct flag in response context
                        const responseContext = ytData?.responseContext;
                        if (responseContext?.mainAppWebResponseContext?.madeForKids !== undefined) {
                            result.madeForKids = responseContext.mainAppWebResponseContext.madeForKids;
                        }
                        
                        // Check 2: Comments section - kids videos have comments disabled
                        const contents = ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents;
                        if (contents) {
                            let hasCommentsSection = false;
                            for (const content of contents) {
                                if (content?.itemSectionRenderer?.sectionIdentifier === 'comment-item-section') {
                                    hasCommentsSection = true;
                                    break;
                                }
                            }
                            // If no comments section at all, might be kids content
                            // But we need more evidence, so just use as supporting info
                        }
                        
                        // Check 3: Badge labels
                        const videoDetails = contents?.[0]?.videoPrimaryInfoRenderer;
                        if (videoDetails?.badges) {
                            for (const badge of videoDetails.badges) {
                                const label = badge?.metadataBadgeRenderer?.label?.toLowerCase() || '';
                                if (label.includes('kids') || label.includes('children')) {
                                    result.madeForKids = true;
                                    break;
                                }
                            }
                        }
                        
                        // Check 4: Look for "Made for kids" text in page
                        const pageText = document.body?.innerText || '';
                        if (pageText.includes('Made for kids') || pageText.includes('Made for Kids')) {
                            result.madeForKids = true;
                        }
                        
                        // Check 5: ytcfg config
                        if ((window as any).ytcfg) {
                            const ytcfg = (window as any).ytcfg;
                            const data = ytcfg.data_ || ytcfg.d?.() || {};
                            if (data.PLAYER_VARS?.madeForKids !== undefined) {
                                result.madeForKids = data.PLAYER_VARS.madeForKids;
                            }
                        }
                        
                        // Check 6: If still undefined, default to false (most videos are not for kids)
                        if (result.madeForKids === undefined) {
                            result.madeForKids = false;
                        }
                    }

                    // Extract like_count and comment_count from ytInitialData
                    const contents = ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents;
                    if (contents) {
                        // Like count from videoPrimaryInfoRenderer
                        const videoPrimaryInfo = contents[0]?.videoPrimaryInfoRenderer;
                        if (videoPrimaryInfo) {
                            // Try multiple paths for like button
                            const topLevelButtons = videoPrimaryInfo?.videoActions?.menuRenderer?.topLevelButtons;
                            if (topLevelButtons) {
                                for (const button of topLevelButtons) {
                                    if (button?.segmentedLikeDislikeButtonRenderer) {
                                        const likeButton = button.segmentedLikeDislikeButtonRenderer.likeButton;
                                        if (likeButton?.toggleButtonRenderer) {
                                            const likeText = likeButton.toggleButtonRenderer.defaultText?.accessibility?.accessibilityData?.label ||
                                                           likeButton.toggleButtonRenderer.defaultText?.simpleText ||
                                                           likeButton.toggleButtonRenderer.toggledText?.accessibility?.accessibilityData?.label ||
                                                           likeButton.toggleButtonRenderer.toggledText?.simpleText ||
                                                           likeButton.toggleButtonRenderer.defaultText?.runs?.[0]?.text ||
                                                           '';
                                            if (likeText && !likeText.toLowerCase().includes('view') && !likeText.toLowerCase().includes('like this')) {
                                                const likeMatch = likeText.match(/([\d.,]+[KMB]?)/);
                                                if (likeMatch) {
                                                    let num = parseFloat(likeMatch[1].replace(/,/g, ''));
                                                    const matchText = likeMatch[1];
                                                    if (matchText.includes('K') || matchText.includes('k')) num *= 1000;
                                                    else if (matchText.includes('M') || matchText.includes('m')) num *= 1000000;
                                                    else if (matchText.includes('B') || matchText.includes('b')) num *= 1000000000;
                                                    if (num < 1000000000 && num > 0) {
                                                        result.like_count = Math.floor(num);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // Comment count from commentsEntryPointHeaderRenderer - try multiple locations
                        for (const content of contents) {
                            if (content?.itemSectionRenderer?.contents?.[0]?.commentsEntryPointHeaderRenderer) {
                                const commentHeader = content.itemSectionRenderer.contents[0].commentsEntryPointHeaderRenderer;
                                const commentCount = commentHeader?.commentCount?.simpleText || 
                                                   commentHeader?.commentCount?.runs?.[0]?.text ||
                                                   commentHeader?.contentRenderer?.commentsEntryPointHeaderRenderer?.commentCount?.simpleText ||
                                                   commentHeader?.commentCount?.accessibility?.accessibilityData?.label;
                                if (commentCount) {
                                    const match = commentCount.match(/([\d.,]+[KMB]?)/);
                                    if (match) {
                                        let num = parseFloat(match[1].replace(/,/g, ''));
                                        const matchText = match[1];
                                        if (matchText.includes('K') || matchText.includes('k')) num *= 1000;
                                        else if (matchText.includes('M') || matchText.includes('m')) num *= 1000000;
                                        else if (matchText.includes('B') || matchText.includes('b')) num *= 1000000000;
                                        // Sanity check: comment count shouldn't exceed 100 million (very rare)
                                        if (num > 0 && num < 100000000) {
                                            result.comment_count = Math.floor(num);
                                            break;
                                        }
                                    }
                                }
                            }
                            
                            // Also check for comment count in other renderers
                            if (content?.commentsEntryPointHeaderRenderer) {
                                const commentHeader = content.commentsEntryPointHeaderRenderer;
                                const commentCount = commentHeader?.commentCount?.simpleText || 
                                                   commentHeader?.commentCount?.runs?.[0]?.text;
                                if (commentCount && !result.comment_count) {
                                    const match = commentCount.match(/([\d.,]+[KMB]?)/);
                                    if (match) {
                                        let num = parseFloat(match[1].replace(/,/g, ''));
                                        const matchText = match[1];
                                        if (matchText.includes('K') || matchText.includes('k')) num *= 1000;
                                        else if (matchText.includes('M') || matchText.includes('m')) num *= 1000000;
                                        else if (matchText.includes('B') || matchText.includes('b')) num *= 1000000000;
                                        // Sanity check: comment count shouldn't exceed 100 million (very rare)
                                        if (num > 0 && num < 100000000) {
                                            result.comment_count = Math.floor(num);
                                            break;
                                        }
                                    }
                                }
                            }
                            
                            // Check all itemSectionRenderer contents for comment headers
                            if (content?.itemSectionRenderer?.contents) {
                                for (const item of content.itemSectionRenderer.contents) {
                                    if (item?.commentsEntryPointHeaderRenderer) {
                                        const commentHeader = item.commentsEntryPointHeaderRenderer;
                                        const commentCount = commentHeader?.commentCount?.simpleText || 
                                                           commentHeader?.commentCount?.runs?.[0]?.text;
                                        if (commentCount && !result.comment_count) {
                                            const match = commentCount.match(/([\d.,]+[KMB]?)/);
                                            if (match) {
                                                let num = parseFloat(match[1].replace(/,/g, ''));
                                                const matchText = match[1];
                                                if (matchText.includes('K') || matchText.includes('k')) num *= 1000;
                                                else if (matchText.includes('M') || matchText.includes('m')) num *= 1000000;
                                                else if (matchText.includes('B') || matchText.includes('b')) num *= 1000000000;
                                                // Sanity check: comment count shouldn't exceed 100 million
                                                if (num > 0 && num < 100000000) {
                                                    result.comment_count = Math.floor(num);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Try searching specific known locations for comment count
                        if (!result.comment_count) {
                            try {
                                // Check responseContext
                                const responseContext = ytData?.responseContext;
                                if (responseContext) {
                                    const visitorData = responseContext?.visitorData;
                                    // Comment count might be in various response contexts
                                }
                                
                                // Check onResponseReceivedActions
                                const onResponseReceived = ytData?.onResponseReceivedActions;
                                if (onResponseReceived && Array.isArray(onResponseReceived)) {
                                    for (const action of onResponseReceived) {
                                        if (action?.reloadContinuationItemsCommand?.continuationItems) {
                                            const items = action.reloadContinuationItemsCommand.continuationItems;
                                            for (const item of items) {
                                                if (item?.commentsEntryPointHeaderRenderer?.commentCount) {
                                                    const commentCount = item.commentsEntryPointHeaderRenderer.commentCount.simpleText || 
                                                                       item.commentsEntryPointHeaderRenderer.commentCount.runs?.[0]?.text;
                                                    if (commentCount) {
                                                        const match = commentCount.match(/([\d.,]+[KMB]?)/);
                                                        if (match) {
                                                            let num = parseFloat(match[1].replace(/,/g, ''));
                                                            const matchText = match[1];
                                                            if (matchText.includes('K') || matchText.includes('k')) num *= 1000;
                                                            else if (matchText.includes('M') || matchText.includes('m')) num *= 1000000;
                                                            else if (matchText.includes('B') || matchText.includes('b')) num *= 1000000000;
                                                            // Sanity check: comment count shouldn't exceed 100 million
                                                            if (num > 0 && num < 100000000) {
                                                                result.comment_count = Math.floor(num);
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } catch (e) {
                                // Silently fail - comment count extraction is optional
                            }
                        }
                    }

                    // Extract concurrent viewers from ytInitialData for live streams
                    if (result.isLive && !result.concurrentViewers) {
                        const videoPrimaryInfo = contents?.[0]?.videoPrimaryInfoRenderer;
                        if (videoPrimaryInfo) {
                            // Check for viewer count in live stream indicators
                            const viewCount = videoPrimaryInfo?.viewCount?.videoViewCountRenderer?.viewCount?.simpleText ||
                                           videoPrimaryInfo?.viewCount?.videoViewCountRenderer?.originalViewCount;
                            if (viewCount && (viewCount.includes('watching') || viewCount.includes('viewers'))) {
                                const match = viewCount.match(/([\d.,]+[KMB]?)/);
                                if (match) {
                                    let num = parseFloat(match[1].replace(/,/g, ''));
                                    const matchText = match[1];
                                    if (matchText.includes('K') || matchText.includes('k')) num *= 1000;
                                    else if (matchText.includes('M') || matchText.includes('m')) num *= 1000000;
                                    if (num > 0 && num < 100000000) {
                                        result.concurrentViewers = Math.floor(num);
                                    }
                                }
                            }
                        }
                    }

                    // Extract full description and mentions from ytInitialData (longer than shortDescription)
                    const secondaryInfo = ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[1]?.videoSecondaryInfoRenderer;
                    const description = secondaryInfo?.attributedDescription?.content;
                    if (description) {
                        // Store full description (prefer this over shortDescription)
                        result.description = description;
                        const mentions = description.match(/@[\w.]+/g);
                        if (mentions) {
                            result.mentions = mentions.map((m: string) => m.substring(1));
                        }
                    }

                    // Alternative description source
                    if (!result.mentions) {
                        const playerResponse = (window as any).ytInitialPlayerResponse;
                        const shortDesc = playerResponse?.videoDetails?.shortDescription;
                        if (shortDesc) {
                            const mentions = shortDesc.match(/@[\w.]+/g);
                            if (mentions) {
                                result.mentions = mentions.map((m: string) => m.substring(1));
                            }
                        }
                    }

                    // Shorts detection from page type
                    const pageType = ytData?.page;
                    if (pageType === 'shorts') {
                        result.isShort = true;
                    }

                    // Check engagement panels for shorts indicator
                    const engagementPanels = ytData?.engagementPanels;
                    if (engagementPanels) {
                        for (const panel of engagementPanels) {
                            if (panel?.engagementPanelSectionListRenderer?.panelIdentifier === 'shorts-info-panel') {
                                result.isShort = true;
                                break;
                            }
                        }
                    }
                    
                    // Default isShort to false if still undefined
                    if (result.isShort === undefined) {
                        result.isShort = false;
                    }
                    
                    // Default isUpcoming to false if still undefined
                    if (result.isUpcoming === undefined) {
                        result.isUpcoming = false;
                    }
                }

                return result;
            });

            return data;
        } catch (error) {
            this.logger.log(`Failed to extract YouTube-specific data: ${error}`, "error");
            return null;
        }
    }
}
