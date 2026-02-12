import { Page, Response } from "playwright";
import { CreatorMetadata, VideoMetadata } from "../types/index.js";
import { CreatorMetadataScraper } from "./CreatorMetadataScraper.js";
import { Logger } from "../helpers/StringBuilder.js";

type TwitchContentType = "vod" | "clip" | "stream" | "channel";

interface GqlResponseData {
    [key: string]: any;
}

/**
 * Twitch scraper focused on extracting metadata that yt-dlp cannot get.
 * Uses GraphQL response interception for reliable data extraction.
 * 
 * Fields yt-dlp CANNOT get (what this scraper extracts):
 * 
 * VOD:
 * - stream_id: Original stream ID
 * - published_at: Publish vs create time
 * - muted_segments: Muted section info
 * 
 * Clip:
 * - embed_url: Embed URL
 * - source_video_id: Source VOD ID
 * - game_id: Game/category ID
 * - vod_offset: Offset in source VOD
 * - is_featured: Featured status
 * - clip_creator_id: Clip creator ID
 * 
 * Stream:
 * - game_id: Game categorization
 * - game_name: (partial)
 * - is_mature: (partial)
 * 
 * Channel:
 * - content_classification_labels: Content labels
 * - is_branded_content: Sponsored content flag
 */
export class TwitchScraper extends CreatorMetadataScraper {

    private detectContentType(url: string): TwitchContentType {
        if (url.includes("/videos/")) return "vod";
        if (url.includes("/clip/") || url.includes("clips.twitch.tv")) return "clip";

        const match = url.match(/twitch\.tv\/([^\/\?]+)/);
        if (match && match[1] !== "videos" && match[1] !== "directory") {
            if (!url.includes("/clip") && !url.includes("/videos")) {
                return "stream";
            }
        }
        return "channel";
    }

    private extractVideoId(url: string): string | null {
        const vodMatch = url.match(/\/videos\/(\d+)/);
        if (vodMatch) return vodMatch[1];
        return null;
    }

    private extractClipSlug(url: string): string | null {
        const clipMatch = url.match(/\/clip\/([^\/\?]+)/);
        if (clipMatch) return clipMatch[1];

        const clipsMatch = url.match(/clips\.twitch\.tv\/([^\/\?]+)/);
        if (clipsMatch) return clipsMatch[1];
        return null;
    }

    async getCreatorProfileUrl(videoUrl: string): Promise<string | null> {
        try {
            const match = videoUrl.match(/twitch\.tv\/([^\/\?]+)/);
            if (match && match[1] !== "videos" && match[1] !== "clip" && match[1] !== "directory") {
                return `https://www.twitch.tv/${match[1]}`;
            }
            return null;
        } catch {
            return null;
        }
    }

    async extractVideoMetadata(page: Page, videoUrl: string): Promise<VideoMetadata | null> {
        try {
            const contentType = this.detectContentType(videoUrl);
            this.logger.log(`Extracting Twitch ${contentType} metadata via GraphQL...`, "info");

            const gqlData: Map<string, GqlResponseData> = new Map();

            const responseHandler = async (response: Response) => {
                const reqUrl = response.url();
                if (reqUrl.includes("gql.twitch.tv") || reqUrl.includes("/gql")) {
                    try {
                        const json = await response.json();
                        const responses = Array.isArray(json) ? json : [json];

                        for (const resp of responses) {
                            const opName = resp?.extensions?.operationName;
                            if (opName && resp?.data) {
                                gqlData.set(opName, resp.data);
                            }
                        }
                    } catch (e) { }
                }
            };

            page.on("response", responseHandler);

            try {
                await page.goto(videoUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

                await Promise.race([
                    page.waitForResponse((response: Response) => {
                        const url = response.url();
                        return url.includes("gql.twitch.tv") || url.includes("/gql");
                    }, { timeout: 5000 }).catch(() => null),
                    new Promise(resolve => setTimeout(resolve, 5000))
                ]);

                await this.delay(2000);

                try {
                    await page.waitForSelector('[data-a-target="player-overlay-click-handler"], video, [data-test-selector="video-player"]', { timeout: 2000 });
                } catch {
                    // Continue if selector not found
                }

                await this.delay(500);
            } finally {
                page.off("response", responseHandler);
            }

            const metadata: VideoMetadata = {
                platform: "twitch",
                url: videoUrl,
                extractedAt: Date.now(),
                twitch_content_type: contentType,
            };

            switch (contentType) {
                case "vod":
                    this.extractVodFromGql(gqlData, videoUrl, metadata);
                    break;
                case "clip":
                    await this.extractClipFromGql(gqlData, page, videoUrl, metadata);
                    break;
                case "stream":
                    await this.extractStreamFromGql(gqlData, page, metadata);
                    break;
            }

            this.extractChannelFromGql(gqlData, metadata);

            this.logger.log(`Successfully extracted Twitch ${contentType} metadata`, "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract Twitch video metadata: ${error}`, "error");
            return null;
        }
    }

    private extractVodFromGql(gqlData: Map<string, GqlResponseData>, url: string, metadata: VideoMetadata): void {
        const videoId = this.extractVideoId(url);
        if (videoId) {
            metadata.video_id = videoId;
        }

        // VideoMetadata operation - contains all basic video info
        const videoMetadata = gqlData.get("VideoMetadata");
        if (videoMetadata?.video) {
            const video = videoMetadata.video;
            // Basic fields yt-dlp can get
            if (video.id) metadata.video_id = video.id;
            if (video.title) metadata.title = video.title;
            if (video.description !== undefined && video.description !== null) metadata.description = video.description;
            if (video.createdAt) metadata.created_at = video.createdAt;
            if (video.publishedAt) metadata.published_at = video.publishedAt;
            if (video.viewCount !== undefined) metadata.view_count = video.viewCount;
            if (video.lengthSeconds !== undefined) metadata.duration = video.lengthSeconds;
            if (video.language) metadata.language = video.language;
            if (video.previewThumbnailURL) metadata.thumbnail_url = video.previewThumbnailURL;
            // Owner/user info
            if (video.owner) {
                if (video.owner.id) metadata.user_id = video.owner.id;
                if (video.owner.login) metadata.user_login = video.owner.login;
                if (video.owner.displayName) metadata.user_name = video.owner.displayName;
            }
            // Game info (gap fields)
            if (video.game?.id) metadata.game_id = video.game.id;
            if (video.game?.name) metadata.game_name = video.game.name;
        }

        // NielsenContentMetadata - backup for basic fields
        const nielsenData = gqlData.get("NielsenContentMetadata");
        if (nielsenData?.video) {
            const video = nielsenData.video;
            if (!metadata.video_id && video.id) metadata.video_id = video.id;
            if (!metadata.title && video.title) metadata.title = video.title;
            if (!metadata.created_at && video.createdAt) metadata.created_at = video.createdAt;
            if (!metadata.published_at && video.createdAt) metadata.published_at = video.createdAt;
            if (!metadata.game_id && video.game?.id) metadata.game_id = video.game.id;
            if (!metadata.game_name && video.game?.displayName) metadata.game_name = video.game.displayName;
            if (video.owner) {
                if (!metadata.user_id && video.owner.id) metadata.user_id = video.owner.id;
                if (!metadata.user_login && video.owner.login) metadata.user_login = video.owner.login;
            }
        }

        // AdRequestHandling - isMature, broadcastType, and backup for basic fields
        const adData = gqlData.get("AdRequestHandling");
        if (adData?.video) {
            // Basic fields backup
            if (!metadata.video_id && adData.video.id) metadata.video_id = adData.video.id;
            if (!metadata.title && adData.video.title) metadata.title = adData.video.title;
            if (adData.video.lengthSeconds !== undefined && metadata.duration === undefined) {
                metadata.duration = adData.video.lengthSeconds;
            }
            if (adData.video.owner) {
                if (!metadata.user_id && adData.video.owner.id) metadata.user_id = adData.video.owner.id;
                if (!metadata.user_login && adData.video.owner.login) metadata.user_login = adData.video.owner.login;
                if (!metadata.user_name && adData.video.owner.displayName) metadata.user_name = adData.video.owner.displayName;
            }
            if (adData.video.game) {
                if (!metadata.game_id && adData.video.game.id) metadata.game_id = adData.video.game.id;
                if (!metadata.game_name && adData.video.game.name) metadata.game_name = adData.video.game.name;
            }
            // Gap fields
            if (adData.video.owner?.broadcastSettings?.isMature !== undefined) {
                metadata.is_mature = adData.video.owner.broadcastSettings.isMature;
            }
            if (adData.video.broadcastType) {
                metadata.vod_type = adData.video.broadcastType;
            }
        }

        // ChannelVideoCore - backup for user info
        const channelVideo = gqlData.get("ChannelVideoCore");
        if (channelVideo?.video?.owner) {
            if (!metadata.user_id && channelVideo.video.owner.id) metadata.user_id = channelVideo.video.owner.id;
            if (!metadata.user_login && channelVideo.video.owner.login) metadata.user_login = channelVideo.video.owner.login;
            if (!metadata.user_name && channelVideo.video.owner.displayName) metadata.user_name = channelVideo.video.owner.displayName;
        }

        // VideoPlayer_VODSeekbarPreviewVideo - contains seekPreviewsURL with broadcast ID
        const seekbarPreviewData = gqlData.get("VideoPlayer_VODSeekbarPreviewVideo");
        if (seekbarPreviewData?.video?.seekPreviewsURL) {
            const seekUrl = seekbarPreviewData.video.seekPreviewsURL;
            // Pattern: {hash}_{username}_{broadcastID}_{timestamp}/storyboards/...
            const broadcastMatch = seekUrl.match(/_(\d{12,})_\d+\/storyboards/);
            if (broadcastMatch) {
                metadata.stream_id = broadcastMatch[1];
            }
        }

        // VideoPlayer_MutedSegmentsAlertOverlay - muted segments
        const mutedData = gqlData.get("VideoPlayer_MutedSegmentsAlertOverlay");
        if (mutedData?.video?.muteInfo?.mutedSegmentConnection?.nodes) {
            const nodes = mutedData.video.muteInfo.mutedSegmentConnection.nodes;
            if (nodes.length > 0) {
                metadata.muted_segments = nodes.map((n: any) => ({
                    offset: n.offset,
                    duration: n.duration
                }));
            }
        }

        // VideoPlayer_VODSeekbar - backup for muted segments
        const seekbarData = gqlData.get("VideoPlayer_VODSeekbar");
        if (!metadata.muted_segments && seekbarData?.video?.muteInfo?.mutedSegmentConnection?.nodes) {
            const nodes = seekbarData.video.muteInfo.mutedSegmentConnection.nodes;
            if (nodes.length > 0) {
                metadata.muted_segments = nodes.map((n: any) => ({
                    offset: n.offset,
                    duration: n.duration
                }));
            }
        }

        // ContentPolicyPropertiesQuery - branded content
        const policyData = gqlData.get("ContentPolicyPropertiesQuery");
        if (policyData?.video?.contentPolicyProperties?.hasBrandedContent !== undefined) {
            metadata.is_branded_content = policyData.video.contentPolicyProperties.hasBrandedContent;
        }

        // ContentClassificationContext - content labels
        const classificationData = gqlData.get("ContentClassificationContext");
        if (classificationData?.video?.contentClassificationLabels) {
            const labels = classificationData.video.contentClassificationLabels;
            if (labels.length > 0) {
                metadata.content_classification_labels = labels;
            }
        }

        // WatchTrackQuery - backup for broadcastType and view count
        const watchData = gqlData.get("WatchTrackQuery");
        if (watchData?.video) {
            if (!metadata.vod_type && watchData.video.broadcastType) {
                metadata.vod_type = watchData.video.broadcastType;
            }
            if (metadata.view_count === undefined && watchData.video.viewCount !== undefined) {
                metadata.view_count = watchData.video.viewCount;
            }
        }

        // PlayerTrackingContextQuery - another backup for broadcastType
        const playerTracking = gqlData.get("PlayerTrackingContextQuery");
        if (playerTracking?.video) {
            if (!metadata.vod_type && playerTracking.video.broadcastType) {
                metadata.vod_type = playerTracking.video.broadcastType;
            }
            if (metadata.view_count === undefined && playerTracking.video.viewCount !== undefined) {
                metadata.view_count = playerTracking.video.viewCount;
            }
        }
    }

    private async extractClipFromGql(gqlData: Map<string, GqlResponseData>, page: Page, url: string, metadata: VideoMetadata): Promise<void> {
        const clipSlug = this.extractClipSlug(url);
        if (clipSlug) {
            metadata.video_id = clipSlug;
            metadata.embed_url = `https://clips.twitch.tv/embed?clip=${clipSlug}`;
        }

        // ChatClip - contains videoOffsetSeconds and source video ID
        const chatClip = gqlData.get("ChatClip");
        if (chatClip?.clip) {
            const clip = chatClip.clip;
            if (clip.videoOffsetSeconds !== undefined) metadata.vod_offset = clip.videoOffsetSeconds;
            if (clip.video?.id) metadata.source_video_id = clip.video.id;
        }

        // ChannelClipCore - contains isFeatured and broadcaster info
        const clipCore = gqlData.get("ChannelClipCore");
        if (clipCore?.clip) {
            const clip = clipCore.clip;
            if (clip.isFeatured !== undefined) metadata.is_featured = clip.isFeatured;
            if (clip.videoOffsetSeconds !== undefined && metadata.vod_offset === undefined) {
                metadata.vod_offset = clip.videoOffsetSeconds;
            }
            // Broadcaster info
            if (clip.broadcaster) {
                if (!metadata.user_id && clip.broadcaster.id) metadata.user_id = clip.broadcaster.id;
                if (!metadata.user_login && clip.broadcaster.login) metadata.user_login = clip.broadcaster.login;
                if (!metadata.user_name && clip.broadcaster.displayName) metadata.user_name = clip.broadcaster.displayName;
            }
        }

        // FeedInteractionHook_GetClipBySlug - contains all basic clip info
        const feedClip = gqlData.get("FeedInteractionHook_GetClipBySlug");
        if (feedClip?.clip) {
            const clip = feedClip.clip;
            // Basic fields yt-dlp can get
            if (clip.id) metadata.video_id = clip.id;
            if (clip.slug) metadata.video_id = clip.slug; // Use slug as video_id for clips
            if (clip.title) metadata.title = clip.title;
            if (clip.viewCount !== undefined) metadata.view_count = clip.viewCount;
            if (clip.createdAt) metadata.created_at = clip.createdAt;
            if (clip.durationSeconds !== undefined) metadata.duration = clip.durationSeconds;
            if (clip.language) metadata.language = clip.language;
            if (clip.thumbnailURL) metadata.thumbnail_url = clip.thumbnailURL;
            // Broadcaster info
            if (clip.broadcaster) {
                if (!metadata.user_id && clip.broadcaster.id) metadata.user_id = clip.broadcaster.id;
                if (!metadata.user_login && clip.broadcaster.login) metadata.user_login = clip.broadcaster.login;
                if (!metadata.user_name && clip.broadcaster.displayName) metadata.user_name = clip.broadcaster.displayName;
            }
            // Game info (gap fields)
            if (clip.game?.id) metadata.game_id = clip.game.id;
            if (clip.game?.name) metadata.game_name = clip.game.name;
        }

        // PlayerTrackingContextQuery - backup for game info
        const trackingData = gqlData.get("PlayerTrackingContextQuery");
        if (trackingData?.clip) {
            const clip = trackingData.clip;
            if (!metadata.game_id && clip.game?.id) metadata.game_id = clip.game.id;
            if (!metadata.game_name && clip.game?.name) metadata.game_name = clip.game.name;
        }

        // ContentClassificationContext - content labels for clips
        const classificationData = gqlData.get("ContentClassificationContext");
        if (classificationData?.clip?.contentClassificationLabels) {
            const labels = classificationData.clip.contentClassificationLabels;
            if (labels.length > 0) {
                metadata.content_classification_labels = labels.map((l: any) =>
                    l.localizedName || l.id || l
                );
            }
        }

        // Look for clip data in ChannelVideoShelvesQuery (backup - contains isFeatured)
        const shelvesData = gqlData.get("ChannelVideoShelvesQuery");
        if (shelvesData?.user?.videoShelves?.edges) {
            for (const edge of shelvesData.user.videoShelves.edges) {
                if (edge?.node?.items) {
                    for (const item of edge.node.items) {
                        if (item.slug === clipSlug || item.id === clipSlug) {
                            if (metadata.is_featured === undefined && item.isFeatured !== undefined) {
                                metadata.is_featured = item.isFeatured;
                            }
                            if (!metadata.clip_creator_id && item.curator?.id) {
                                metadata.clip_creator_id = item.curator.id;
                            }
                        }
                    }
                }
            }
        }

        // Fallback: extract curator from page scripts
        if (!metadata.clip_creator_id) {
            const clipData = await page.evaluate(() => {
                const scripts = document.querySelectorAll('script');
                for (const script of scripts) {
                    const content = script.textContent || "";
                    const curatorMatch = content.match(/"curator"\s*:\s*\{[^}]*"id"\s*:\s*"(\d+)"/);
                    if (curatorMatch) {
                        return { clip_creator_id: curatorMatch[1] };
                    }
                }
                return {};
            });
            if (clipData.clip_creator_id) metadata.clip_creator_id = clipData.clip_creator_id;
        }
    }

    private async extractStreamFromGql(gqlData: Map<string, GqlResponseData>, page: Page, metadata: VideoMetadata): Promise<void> {
        // WatchTrackQuery - game info for streams
        const watchData = gqlData.get("WatchTrackQuery");
        if (watchData?.user?.lastBroadcast?.game) {
            const game = watchData.user.lastBroadcast.game;
            if (game.id) metadata.game_id = game.id;
            if (game.name) metadata.game_name = game.name;
        }

        // AdRequestHandling - isMature (for VODs)
        const adData = gqlData.get("AdRequestHandling");
        if (adData?.video?.owner?.broadcastSettings?.isMature !== undefined) {
            metadata.is_mature = adData.video.owner.broadcastSettings.isMature;
        }

        // ChannelShell - isMature for live streams
        const channelShell = gqlData.get("ChannelShell");
        if (channelShell?.userOrError?.broadcastSettings?.isMature !== undefined) {
            metadata.is_mature = channelShell.userOrError.broadcastSettings.isMature;
        }

        // VideoMetadata - isMature backup for streams
        const videoMetadata = gqlData.get("VideoMetadata");
        if (videoMetadata?.user?.broadcastSettings?.isMature !== undefined && metadata.is_mature === undefined) {
            metadata.is_mature = videoMetadata.user.broadcastSettings.isMature;
        }

        // UseViewCount - stream info and game
        const useViewCount = gqlData.get("UseViewCount");
        if (useViewCount?.user) {
            if (useViewCount.user.id) metadata.user_id = useViewCount.user.id;
            if (useViewCount.user.login) metadata.user_login = useViewCount.user.login;
            if (useViewCount.user.stream) {
                if (useViewCount.user.stream.id) metadata.video_id = useViewCount.user.stream.id;
                if (useViewCount.user.stream.viewersCount !== undefined) metadata.viewer_count = useViewCount.user.stream.viewersCount;
                if (useViewCount.user.stream.game) {
                    if (!metadata.game_id && useViewCount.user.stream.game.id) metadata.game_id = useViewCount.user.stream.game.id;
                    if (!metadata.game_name && useViewCount.user.stream.game.name) metadata.game_name = useViewCount.user.stream.game.name;
                }
            }
        }

        // VideoMetadata - stream title and basic info
        if (videoMetadata?.user) {
            if (!metadata.user_id && videoMetadata.user.id) metadata.user_id = videoMetadata.user.id;
            if (!metadata.user_login && videoMetadata.user.login) metadata.user_login = videoMetadata.user.login;
            if (videoMetadata.user.stream) {
                if (!metadata.video_id && videoMetadata.user.stream.id) metadata.video_id = videoMetadata.user.stream.id;
                if (metadata.viewer_count === undefined && videoMetadata.user.stream.viewersCount !== undefined) {
                    metadata.viewer_count = videoMetadata.user.stream.viewersCount;
                }
            }
            if (videoMetadata.user.lastBroadcast) {
                if (videoMetadata.user.lastBroadcast.startedAt) metadata.started_at = videoMetadata.user.lastBroadcast.startedAt;
            }
        }

        // ChannelShell - stream title and broadcaster info
        if (channelShell?.userOrError) {
            if (!metadata.user_id && channelShell.userOrError.id) metadata.user_id = channelShell.userOrError.id;
            if (!metadata.user_login && channelShell.userOrError.login) metadata.user_login = channelShell.userOrError.login;
            if (!metadata.user_name && channelShell.userOrError.displayName) metadata.user_name = channelShell.userOrError.displayName;
            if (channelShell.userOrError.broadcastSettings?.title) metadata.title = channelShell.userOrError.broadcastSettings.title;
        }

        // StreamMetadata - another source for stream info
        const streamMetadata = gqlData.get("StreamMetadata");
        if (streamMetadata?.user) {
            const user = streamMetadata.user;
            if (user.broadcastSettings?.isMature !== undefined) {
                metadata.is_mature = user.broadcastSettings.isMature;
            }
            if (user.stream?.game) {
                if (!metadata.game_id && user.stream.game.id) metadata.game_id = user.stream.game.id;
                if (!metadata.game_name && user.stream.game.name) metadata.game_name = user.stream.game.name;
            }
        }

        // FFZ_StreamTagList or similar
        const ffzData = gqlData.get("FFZ_StreamTagList");
        if (ffzData?.user?.stream?.game) {
            const game = ffzData.user.stream.game;
            if (!metadata.game_id && game.id) metadata.game_id = game.id;
            if (!metadata.game_name && game.name) metadata.game_name = game.name;
        }

        // Extract tags from DOM (not available in GraphQL)
        const tags = await page.evaluate(() => {
            const tagElements: string[] = [];

            // Method 1: Look for Twitch tag links (common pattern: /directory/tags/...)
            const tagLinks = document.querySelectorAll('a[href*="/directory/tags/"]');
            for (const link of tagLinks) {
                const text = link.textContent?.trim();
                const href = link.getAttribute('href') || '';
                // Extract tag name from URL or text
                const urlMatch = href.match(/\/tags\/([^\/\?]+)/);
                if (urlMatch) {
                    const tagName = decodeURIComponent(urlMatch[1].replace(/-/g, ' '));
                    if (tagName && tagName.length > 0 && tagName.length < 100) {
                        tagElements.push(tagName);
                    }
                } else if (text && text.length > 0 && text.length < 100 && !text.toLowerCase().includes('tag')) {
                    tagElements.push(text);
                }
            }

            // Method 2: Look for tag elements with data attributes
            const tagElementsWithData = document.querySelectorAll('[data-a-target*="tag"], [data-test-selector*="tag"]');
            for (const elem of tagElementsWithData) {
                const text = elem.textContent?.trim();
                if (text && text.length > 0 && text.length < 100) {
                    tagElements.push(text);
                }
            }

            // Method 3: Look for tag chips/buttons in stream info panels
            const streamInfo = document.querySelector('[data-a-target="stream-info"], .stream-info, [class*="StreamInfo"]');
            if (streamInfo) {
                const infoTags = streamInfo.querySelectorAll('a, button, span[class*="tag"], div[class*="tag"]');
                for (const tag of infoTags) {
                    const text = tag.textContent?.trim();
                    if (text && text.length > 0 && text.length < 100 && !text.toLowerCase().includes('tag')) {
                        tagElements.push(text);
                    }
                }
            }

            // Method 4: Search script tags for tag arrays in JSON
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                const content = script.textContent || "";

                // Look for tags array patterns
                const patterns = [
                    /"tags"\s*:\s*\[(.*?)\]/,
                    /"streamTags"\s*:\s*\[(.*?)\]/,
                    /tags:\s*\[(.*?)\]/,
                ];

                for (const pattern of patterns) {
                    const match = content.match(pattern);
                    if (match) {
                        try {
                            // Try to parse as JSON array
                            const jsonStr = `[${match[1]}]`;
                            const tagArray = JSON.parse(jsonStr);
                            for (const tag of tagArray) {
                                if (typeof tag === 'string' && tag.length > 0) {
                                    tagElements.push(tag);
                                } else if (tag?.name && typeof tag.name === 'string') {
                                    tagElements.push(tag.name);
                                } else if (tag?.localizedName && typeof tag.localizedName === 'string') {
                                    tagElements.push(tag.localizedName);
                                }
                            }
                        } catch (e) {
                            // Try extracting quoted strings
                            const stringMatches = match[1].match(/"([^"]+)"/g);
                            if (stringMatches) {
                                for (const strMatch of stringMatches) {
                                    const tag = strMatch.replace(/"/g, '');
                                    if (tag.length > 0 && tag.length < 100) {
                                        tagElements.push(tag);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Remove duplicates, filter out common false positives, and return
            const filtered = [...new Set(tagElements)].filter(tag => {
                const lower = tag.toLowerCase();
                return tag.length > 0 &&
                    tag.length < 100 &&
                    !lower.includes('tag') &&
                    !lower.includes('tags') &&
                    !lower.includes('viewer') &&
                    !lower.includes('follow');
            });

            return filtered;
        });

        if (tags && tags.length > 0) {
            metadata.tags = tags;
        }
    }

    private extractChannelFromGql(gqlData: Map<string, GqlResponseData>, metadata: VideoMetadata): void {
        // ContentClassificationContext - content labels
        const classificationData = gqlData.get("ContentClassificationContext");
        if (classificationData?.video?.contentClassificationLabels && !metadata.content_classification_labels) {
            const labels = classificationData.video.contentClassificationLabels;
            if (labels.length > 0) {
                metadata.content_classification_labels = labels;
            }
        }

        // ContentPolicyPropertiesQuery - branded content
        const policyData = gqlData.get("ContentPolicyPropertiesQuery");
        if (policyData?.video?.contentPolicyProperties?.hasBrandedContent !== undefined && metadata.is_branded_content === undefined) {
            metadata.is_branded_content = policyData.video.contentPolicyProperties.hasBrandedContent;
        }
    }

    async extractMetadata(page: Page, videoUrl: string): Promise<CreatorMetadata | null> {
        try {
            this.logger.log("Extracting Twitch creator metadata...", "info");

            let profileUrl = await this.getCreatorProfileUrl(videoUrl);

            if (!profileUrl) {
                await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
                try {
                    await page.waitForSelector('a[href*="/"]', { timeout: 2000 });
                } catch {
                    // Continue if selector not found
                }
                await this.delay(500);

                const link = await this.getElementAttribute(page, 'a[href*="/"]', "href");
                if (link && link.includes("twitch.tv/") && !link.includes("/videos/")) {
                    profileUrl = link.startsWith("http") ? link : `https://www.twitch.tv${link}`;
                }
            }

            if (!profileUrl) {
                this.logger.log("Could not find Twitch profile URL", "warn");
                return null;
            }

            const currentUrl = page.url();
            const contentType = this.detectContentType(videoUrl);
            const alreadyOnVideoPage = currentUrl.includes("twitch.tv") &&
                (contentType === "vod" || contentType === "clip" || contentType === "stream");

            if (alreadyOnVideoPage) {
                this.logger.log("Already on video page, attempting to extract creator data from GraphQL first", "debug");
                const fromVideoPage = await this.tryExtractCreatorFromGqlData(page, profileUrl);
                if (fromVideoPage) {
                    this.logger.log("Successfully extracted Twitch creator metadata from video page (skipped profile)", "info");
                    return fromVideoPage;
                }
            }

            await page.goto(profileUrl, { waitUntil: "domcontentloaded" });
            try {
                await page.waitForSelector('[data-a-target="user-channel-header-item"], h2, [data-a-target="user-avatar"]', { timeout: 3000 });
            } catch {
                // Continue if selector not found
            }
            await this.delay(500);

            const metadata: CreatorMetadata = {
                platform: "twitch",
                url: profileUrl,
                extractedAt: Date.now(),
            };

            const usernameMatch = profileUrl.match(/twitch\.tv\/([^\/\?]+)/);
            if (usernameMatch) {
                metadata.creator_username = usernameMatch[1];
            }

            const nameSelectors = [
                'h2[data-a-target="user-channel-header-item"]',
                'h2',
                '[data-a-target="user-display-name"]'
            ];

            for (const selector of nameSelectors) {
                const name = await this.getElementText(page, selector);
                if (name && name.length > 0) {
                    metadata.creator_name = this.cleanText(name);
                    break;
                }
            }

            const bioSelectors = [
                '[data-a-target="user-channel-description"]',
                '.channel-info-content',
                '[data-a-target="user-channel-description-text"]'
            ];

            for (const selector of bioSelectors) {
                const bio = await this.getElementText(page, selector);
                if (bio && bio.length > 5) {
                    metadata.creator_bio = this.cleanText(bio);
                    break;
                }
            }

            const followerSelectors = [
                '[data-a-target="follow-count"]',
                'a[href*="/followers"]',
                '[data-a-target="user-channel-header-item"]'
            ];

            for (const selector of followerSelectors) {
                const followerText = await this.getElementText(page, selector);
                if (followerText && (followerText.includes("followers") || followerText.includes("Follower"))) {
                    metadata.creator_follower_count = this.parseCount(followerText);
                    break;
                }
            }

            const avatarSelectors = [
                'img[alt*="avatar"]',
                '[data-a-target="user-avatar"] img',
                'img[src*="static-cdn.jtvnw.net"]'
            ];

            for (const selector of avatarSelectors) {
                const avatar = await this.getElementAttribute(page, selector, "src");
                if (avatar && avatar.includes("static-cdn.jtvnw.net")) {
                    metadata.creator_avatar_url = avatar;
                    break;
                }
            }

            const verifiedSelectors = [
                '[data-a-target="verified-badge"]',
                '[aria-label*="Verified"]',
                '.verified-badge'
            ];

            for (const selector of verifiedSelectors) {
                const verified = await page.locator(selector).first();
                if (await verified.isVisible({ timeout: 2000 }).catch(() => false)) {
                    metadata.creator_verified = true;
                    break;
                }
            }

            this.logger.log("Successfully extracted Twitch creator metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract Twitch metadata: ${error}`, "error");
            return null;
        }
    }

    private async tryExtractCreatorFromGqlData(page: Page, profileUrl: string): Promise<CreatorMetadata | null> {
        try {
            const gqlData: Map<string, GqlResponseData> = new Map();
            let hasData = false;

            const responseHandler = async (response: Response) => {
                const reqUrl = response.url();
                if (reqUrl.includes("gql.twitch.tv") || reqUrl.includes("/gql")) {
                    try {
                        const json = await response.json();
                        const responses = Array.isArray(json) ? json : [json];

                        for (const resp of responses) {
                            const opName = resp?.extensions?.operationName;
                            if (opName && resp?.data) {
                                gqlData.set(opName, resp.data);
                                hasData = true;
                            }
                        }
                    } catch (e) { }
                }
            };

            page.on("response", responseHandler);

            await new Promise(resolve => setTimeout(resolve, 1000));

            page.off("response", responseHandler);

            if (!hasData) return null;

            const metadata: CreatorMetadata = {
                platform: "twitch",
                url: profileUrl,
                extractedAt: Date.now(),
            };

            const usernameMatch = profileUrl.match(/twitch\.tv\/([^\/\?]+)/);
            if (usernameMatch) {
                metadata.creator_username = usernameMatch[1];
            }

            let foundData = false;

            for (const [opName, data] of gqlData.entries()) {
                if (data.video?.owner) {
                    const owner = data.video.owner;
                    if (owner.displayName && !metadata.creator_name) {
                        metadata.creator_name = owner.displayName;
                        foundData = true;
                    }
                    if (owner.profileImageURL && !metadata.creator_avatar_url) {
                        metadata.creator_avatar_url = owner.profileImageURL;
                        foundData = true;
                    }
                }

                if (data.user) {
                    const user = data.user;
                    if (user.displayName && !metadata.creator_name) {
                        metadata.creator_name = user.displayName;
                        foundData = true;
                    }
                    if (user.profileImageURL && !metadata.creator_avatar_url) {
                        metadata.creator_avatar_url = user.profileImageURL;
                        foundData = true;
                    }
                    if (user.description && !metadata.creator_bio) {
                        metadata.creator_bio = user.description;
                        foundData = true;
                    }
                    if (user.followers?.totalCount !== undefined && !metadata.creator_follower_count) {
                        metadata.creator_follower_count = user.followers.totalCount;
                        foundData = true;
                    }
                }

                if (data.clip?.broadcaster) {
                    const broadcaster = data.clip.broadcaster;
                    if (broadcaster.displayName && !metadata.creator_name) {
                        metadata.creator_name = broadcaster.displayName;
                        foundData = true;
                    }
                    if (broadcaster.profileImageURL && !metadata.creator_avatar_url) {
                        metadata.creator_avatar_url = broadcaster.profileImageURL;
                        foundData = true;
                    }
                }
            }

            if (!foundData) return null;

            return metadata;
        } catch {
            return null;
        }
    }
}

