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
            this.logger.log("Extracting YouTube video metadata (yt-dlp gaps only)...", "info");

            await page.goto(videoUrl, { waitUntil: "networkidle" });
            await this.delay(3000);

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
            
            if (embeddedData) {
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

                    // Dimension (2d/3d) and projection (360/rectangular)
                    const streamingData = playerData?.streamingData;
                    if (streamingData?.adaptiveFormats) {
                        for (const format of streamingData.adaptiveFormats) {
                            if (format.projectionType) {
                                result.projection = format.projectionType === 'RECTANGULAR' ? 'rectangular' : '360';
                            }
                            if (format.stereoLayout) {
                                result.dimension = '3d';
                            }
                            break;
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
                    }

                    // Microformat data
                    const microformat = playerData?.microformat?.playerMicroformatRenderer;
                    if (microformat) {
                        if (microformat.category) {
                            result.category = microformat.category;
                        }
                        if (microformat.defaultAudioLanguage) {
                            result.defaultLanguage = microformat.defaultAudioLanguage;
                        }
                        if (microformat.isUnlisted !== undefined) {
                            result.isUnlisted = microformat.isUnlisted;
                        }
                        if (microformat.liveBroadcastDetails) {
                            result.isLive = microformat.liveBroadcastDetails.isLiveNow || false;
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
                    }

                    // Extract mentions from description
                    const secondaryInfo = ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[1]?.videoSecondaryInfoRenderer;
                    const description = secondaryInfo?.attributedDescription?.content;
                    if (description) {
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
                }

                return result;
            });

            return data;
        } catch (error) {
            this.logger.log(`Failed to extract YouTube-specific data: ${error}`, "debug");
            return null;
        }
    }
}
