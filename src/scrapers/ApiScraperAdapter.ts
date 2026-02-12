import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata, CreatorMetadataScraperConfig } from "../types/index.js";
import { CreatorMetadataScraper } from "./CreatorMetadataScraper.js";
import { Logger } from "../helpers/StringBuilder.js";

export abstract class ApiScraperAdapter extends CreatorMetadataScraper {
    protected apiConfig: {
        baseUrl: string;
        timeout: number;
        retries: number;
        enabled: boolean;
        pollInterval: number;
        maxPollAttempts: number;
        resultsPath?: string;
    };

    constructor(logger: Logger, config: CreatorMetadataScraperConfig = {}) {
        super(logger, config);
        
        this.apiConfig = {
            baseUrl: config.apiConfig?.baseUrl || process.env.ML_API_BASE_URL || "https://ondemand-scraper-api.media-meter.in",
            timeout: config.apiConfig?.timeout || 30000,
            retries: config.apiConfig?.retries || 3,
            enabled: config.apiConfig?.enabled !== false,
            pollInterval: 2000,
            maxPollAttempts: 30,
            resultsPath: config.apiConfig?.resultsPath,
        };

        if (!this.apiConfig.baseUrl) {
            this.logger.log("API base URL not configured. API scrapers will not work.", "warn");
        }
    }

    async extractMetadata(page: Page, videoUrl: string): Promise<CreatorMetadata | null> {
        if (!this.apiConfig.enabled || !this.apiConfig.baseUrl) {
            this.logger.log("API scraper is disabled or not configured", "warn");
            return null;
        }

        return this.extractMetadataFromApi(videoUrl);
    }

    async extractVideoMetadata(page: Page, videoUrl: string): Promise<VideoMetadata | null> {
        if (!this.apiConfig.enabled || !this.apiConfig.baseUrl) {
            return null;
        }

        return this.extractVideoMetadataFromApi(videoUrl);
    }

    protected abstract extractMetadataFromApi(url: string): Promise<CreatorMetadata | null>;
    
    protected async extractVideoMetadataFromApi(url: string): Promise<VideoMetadata | null> {
        return null;
    }

    protected async makeApiRequest(
        endpoint: string,
        payload: any,
        options?: { method?: "GET" | "POST"; queryParams?: Record<string, string> }
    ): Promise<any> {
        const logAgent = this.logger;
        let url = `${this.apiConfig.baseUrl}${endpoint}`;
        if (options?.queryParams && Object.keys(options.queryParams).length > 0) {
            const search = new URLSearchParams(options.queryParams).toString();
            url += (url.includes("?") ? "&" : "?") + search;
        }
        const method = options?.method ?? "POST";

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        let lastError: Error | null = null;
        const maxRetries = this.apiConfig.retries;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                logAgent.log(`API request attempt ${attempt}/${maxRetries} to ${endpoint}`, "debug");

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.apiConfig.timeout);

                const fetchOptions: RequestInit = {
                    method,
                    headers,
                    signal: controller.signal,
                };
                if (method === "POST" && payload != null) {
                    fetchOptions.body = JSON.stringify(payload);
                }

                const response = await fetch(url, fetchOptions);

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text().catch(() => "Unknown error");
                    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
                }

                const data = await response.json();
                logAgent.log(`API request successful to ${endpoint}`, "debug");
                return data;

            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                
                if (error instanceof Error && error.name === "AbortError") {
                    logAgent.log(`API request timeout after ${this.apiConfig.timeout}ms`, "warn");
                } else {
                    logAgent.log(`API request failed (attempt ${attempt}/${maxRetries}): ${lastError.message}`, "warn");
                }

                if (attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                    logAgent.log(`Retrying in ${delay}ms...`, "debug");
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        logAgent.log(`All API request attempts failed: ${lastError?.message}`, "error");
        throw lastError || new Error("API request failed after all retries");
    }

    /**
     * Override to extract platform-specific video id from URL. Default returns null.
     */
    protected getVideoIdFromUrl(_url: string): string | null {
        return null;
    }

    /**
     * Normalize MLDC API payload (title, content, authors, engagements, reach_metrics, etc.)
     * to creator shape (creator_name, creator_username, creator_follower_count, etc.).
     */
    protected normalizeApiPayloadToCreatorShape(payload: Record<string, unknown>): Record<string, unknown> {
        const out: Record<string, unknown> = { ...payload };
        const authors = payload.authors;
        if (typeof authors === "string" && authors.trim()) {
            out.creator_username = authors.trim();
            if (out.creator_name == null) out.creator_name = authors.trim(); 
        } else if (Array.isArray(authors) && authors.length > 0) {
            const first = authors[0];
            if (typeof first === "string" && first.trim()) {
                out.creator_username = first.trim();
                if (out.creator_name == null) out.creator_name = first.trim();
            } else if (first && typeof first === "object") {
                const author = first as Record<string, unknown>;
                if (author.name != null) out.creator_name = String(author.name);
                if (author.username != null) out.creator_username = String(author.username);
                if (author.display_name != null && out.creator_name == null) out.creator_name = String(author.display_name);
                if (author.title != null && out.creator_name == null) out.creator_name = String(author.title);
                if (author.channel_name != null && out.creator_name == null) out.creator_name = String(author.channel_name);
                if (author.channel_title != null && out.creator_name == null) out.creator_name = String(author.channel_title);
                if (author.handle != null && out.creator_username == null) out.creator_username = String(author.handle);
                if (author.avatar_url != null) out.creator_avatar_url = String(author.avatar_url);
                if (author.profile_url != null) out.creator_profile_deep_link = String(author.profile_url);
                if (author.follower_count != null) out.creator_follower_count = Number(author.follower_count);
                if (author.subscriber_count != null) out.creator_follower_count = Number(author.subscriber_count);
                if (author.subscribers != null && out.creator_follower_count == null) out.creator_follower_count = Number(author.subscribers);
                if (author.id != null) out.creator_id = String(author.id);
            }
        }
        const organicTraffic = payload.organic_traffic;
        if (organicTraffic != null && typeof organicTraffic === "object") {
            const ot = organicTraffic as Record<string, unknown>;
            if (ot.followers != null && out.creator_follower_count == null) out.creator_follower_count = Number(ot.followers);
        }
        const reachMetrics = payload.reach_metrics;
        if (reachMetrics != null && typeof reachMetrics === "object") {
            const rm = reachMetrics as Record<string, unknown>;
            if (out.creator_follower_count == null && rm.subscribers_count != null) out.creator_follower_count = Number(rm.subscribers_count);
            if (out.creator_follower_count == null && rm.followers_count != null) out.creator_follower_count = Number(rm.followers_count);
        }

        // Common top-level aliases used by some APIs
        if (out.creator_id == null && payload.id != null) out.creator_id = String(payload.id);
        if (out.creator_name == null && payload.name != null) out.creator_name = String(payload.name);
        if (out.creator_username == null && (payload.username != null || payload.handle != null)) {
            out.creator_username = String((payload.username ?? payload.handle) as string | number);
        }
        if (out.creator_profile_deep_link == null && payload.profile_url != null) {
            out.creator_profile_deep_link = String(payload.profile_url);
        }
        if (out.creator_avatar_url == null && payload.avatar_url != null) {
            out.creator_avatar_url = String(payload.avatar_url);
        }
        if (out.creator_follower_count == null && (payload.followers != null || payload.followers_count != null)) {
            const followersValue = (payload.followers ?? payload.followers_count) as string | number;
            out.creator_follower_count = Number(followersValue);
        }

        if (payload.title != null && out.creator_name == null && typeof payload.authors === "undefined") {
            out.creator_name = String(payload.title);
        }

        return out;
    }

    /**
     * Normalize MLDC API payload to video shape (caption, description, timestamp, thumbnails,
     * like_count, comment_count, view_count, etc.). video_id from getVideoIdFromUrl(url).
     */
    protected normalizeApiPayloadToVideoShape(payload: Record<string, unknown>, url: string): Record<string, unknown> {
        const out: Record<string, unknown> = { ...payload };
        const videoId = this.getVideoIdFromUrl(url);
        if (videoId) out.video_id = videoId;
        if (payload.title != null) out.caption = String(payload.title);
        if (payload.content != null && typeof payload.content === "string") {
            out.description = payload.content;
            if (out.caption == null || (out.caption as string).length === 0) out.caption = payload.content;
        }
        const publishDate = payload.publish_date;
        if (publishDate != null) {
            if (typeof publishDate === "number") out.timestamp = publishDate;
            else if (typeof publishDate === "string") {
                const parsed = Date.parse(publishDate);
                if (!Number.isNaN(parsed)) out.timestamp = Math.floor(parsed / 1000);
            }
        }
        const attachments = payload.attachments;
        if (attachments != null && typeof attachments === "object") {
            const photos = (attachments as Record<string, unknown>).photos;
            if (Array.isArray(photos) && photos.length > 0) {
                const urls = photos.filter((p): p is string => typeof p === "string");
                if (urls.length > 0) out.thumbnails = urls;
            } else if (Array.isArray(attachments) && attachments.length > 0) {
                const urls: string[] = [];
                for (const a of attachments as unknown[]) {
                    if (typeof a === "string") urls.push(a);
                    else if (a != null && typeof a === "object") {
                        const o = a as Record<string, unknown>;
                        if (typeof o.url === "string") urls.push(o.url);
                        else if (typeof o.thumbnail_url === "string") urls.push(o.thumbnail_url);
                        else if (typeof o.thumbnail === "string") urls.push(o.thumbnail);
                    }
                }
                if (urls.length > 0) out.thumbnails = urls;
            }
        }
        const engagements = payload.engagements;
        if (engagements != null && typeof engagements === "object") {
            const eng = engagements as Record<string, unknown>;
            if (eng.likes != null) out.like_count = Number(eng.likes);
            if (eng.like_count != null) out.like_count = Number(eng.like_count);
            if (eng.likes_count != null) out.like_count = Number(eng.likes_count);
            if (eng.comments != null) out.comment_count = Number(eng.comments);
            if (eng.comment_count != null) out.comment_count = Number(eng.comment_count);
            if (eng.comments_count != null) out.comment_count = Number(eng.comments_count);
            if (eng.views != null) out.view_count = Number(eng.views);
            if (eng.view_count != null) out.view_count = Number(eng.view_count);
            if (eng.views_count != null) out.view_count = Number(eng.views_count);
            if (eng.shares != null) out.share_count = Number(eng.shares);
            if (eng.shares_count != null) out.share_count = Number(eng.shares_count);
            if (eng.love_count != null) out.reaction_love_count = Number(eng.love_count);
            if (eng.haha_count != null) out.reaction_haha_count = Number(eng.haha_count);
            if (eng.wow_count != null) out.reaction_wow_count = Number(eng.wow_count);
            if (eng.sad_count != null) out.reaction_sad_count = Number(eng.sad_count);
            if (eng.angry_count != null) out.reaction_angry_count = Number(eng.angry_count);
        }

        const reachMetrics = payload.reach_metrics;
        if (reachMetrics != null && typeof reachMetrics === "object") {
            const rm = reachMetrics as Record<string, unknown>;
            if (rm.views != null && out.view_count == null) out.view_count = Number(rm.views);
            if (rm.view_count != null && out.view_count == null) out.view_count = Number(rm.view_count);
            if (rm.views_count != null && out.view_count == null) out.view_count = Number(rm.views_count);
            if (rm.impressions != null && out.view_count == null) out.view_count = Number(rm.impressions);
        }

        if (typeof payload.comments === "number") out.comment_count = Number(payload.comments);
        if (Array.isArray(payload.comments) && out.comment_count == null) {
            out.comment_count = (payload.comments as unknown[]).length;
        }

        const virality = payload.virality;
        if (virality != null && typeof virality === "object") {
            const v = virality as Record<string, unknown>;
            if (v.views != null && out.view_count == null) out.view_count = Number(v.views);
            if (v.view_count != null && out.view_count == null) out.view_count = Number(v.view_count);
        }

        // Common top-level aliases (fallbacks when engagements/reach_metrics are missing)
        if (out.like_count == null) {
            if (payload.like_count != null) out.like_count = Number(payload.like_count);
            else if (payload.likes_count != null) out.like_count = Number(payload.likes_count);
            else if (payload.likes != null) out.like_count = Number(payload.likes);
        }
        if (out.comment_count == null) {
            if (payload.comment_count != null) out.comment_count = Number(payload.comment_count);
            else if (payload.comments_count != null) out.comment_count = Number(payload.comments_count);
            else if (payload.comments != null && typeof payload.comments === "number") {
                out.comment_count = Number(payload.comments);
            }
        }
        if (out.view_count == null) {
            if (payload.view_count != null) out.view_count = Number(payload.view_count);
            else if (payload.views_count != null) out.view_count = Number(payload.views_count);
            else if (payload.views != null) out.view_count = Number(payload.views);
            else if (payload.impressions != null) out.view_count = Number(payload.impressions);
        }
        if (out.share_count == null) {
            if (payload.share_count != null) out.share_count = Number(payload.share_count);
            else if (payload.shares_count != null) out.share_count = Number(payload.shares_count);
            else if (payload.shares != null) out.share_count = Number(payload.shares);
        }

        // Facebook-specific fallbacks for view-like metrics
        if (out.view_count == null) {
            if (payload.post_views != null) out.view_count = Number(payload.post_views);
            else if (payload.total_video_views_unique != null) out.view_count = Number(payload.total_video_views_unique);
            else if (payload.total_video_complete_views != null) out.view_count = Number(payload.total_video_complete_views);
            else if (payload.total_video_10s_views != null) out.view_count = Number(payload.total_video_10s_views);
            else if (payload.total_video_30s_views != null) out.view_count = Number(payload.total_video_30s_views);
            else if (payload.total_video_60s_excludes_shorter_views != null) {
                out.view_count = Number(payload.total_video_60s_excludes_shorter_views);
            }
        }

        if (out.isShort === undefined && url.includes("/shorts/")) out.isShort = true;
        return out;
    }

    protected async scrapeAndPoll(url: string): Promise<any> {
        const logAgent = this.logger;
        
        try {
            logAgent.log(`Initiating scrape for: ${url}`, "info");
            
            const scrapePayload = {
                urls: [url],
            };

            const scrapeResponse = await this.makeApiRequest("/v1/social-media/scrape", scrapePayload);
            
            if (!scrapeResponse || !scrapeResponse.job_id) {
                logAgent.log("Scrape response missing job_id", "warn");
                return null;
            }

            const jobId = scrapeResponse.job_id;
            logAgent.log(`Scrape job initiated with job_id: ${jobId}`, "info");

            const resultsPathBase = this.apiConfig.resultsPath ?? "/v1/social-media/results";
            const resultsPath = resultsPathBase.includes("{job_id}") ? resultsPathBase.replace(/\{job_id\}/g, jobId) : `${resultsPathBase}/${jobId}`;
            const resultsUrl = `${this.apiConfig.baseUrl}${resultsPath}`;
            logAgent.log(`Results endpoint: GET ${resultsUrl}`, "debug");

            for (let attempt = 1; attempt <= this.apiConfig.maxPollAttempts; attempt++) {
                await new Promise(resolve => setTimeout(resolve, this.apiConfig.pollInterval));

                logAgent.log(`Polling results (attempt ${attempt}/${this.apiConfig.maxPollAttempts}) for job_id: ${jobId}`, "debug");

                try {
                    const resultsResponse = await this.makeApiRequest(resultsPath, null, {
                        method: "GET",
                    });

                    if (attempt === 1 && resultsResponse) {
                        const keys = Object.keys(resultsResponse);
                        const preview = keys.length ? JSON.stringify(keys) : "empty";
                        logAgent.log(`Results response keys (first poll): ${preview}, status=${(resultsResponse as any).status}`, "debug");
                    }

                    if (resultsResponse && resultsResponse.status === "failed") {
                        logAgent.log(`Job failed: ${(resultsResponse as any).error || "Unknown error"}`, "error");
                        return null;
                    }

                    const hasResults = resultsResponse && "results" in resultsResponse && (resultsResponse as any).results != null;
                    const resultsPayload = hasResults ? (resultsResponse as any).results : null;
                    const hasData = Array.isArray(resultsPayload)
                        ? resultsPayload.length > 0
                        : typeof resultsPayload === "object" && resultsPayload !== null && Object.keys(resultsPayload).length > 0;

                    if (hasResults && hasData) {
                        logAgent.log(`Results ready for job_id: ${jobId}`, "info");
                        return Array.isArray(resultsPayload) ? resultsPayload[0] : resultsPayload;
                    }

                    if (resultsResponse && (resultsResponse as any).status === "completed" && (resultsResponse as any).data) {
                        logAgent.log(`Results ready for job_id: ${jobId} (data field)`, "info");
                        return (resultsResponse as any).data;
                    }

                    if (resultsResponse && (resultsResponse as any).status === "processing") {
                        logAgent.log(`Job still processing (attempt ${attempt}/${this.apiConfig.maxPollAttempts})`, "debug");
                        continue;
                    }

                    if (resultsResponse && attempt === 1) {
                        logAgent.log(`Results not ready: status=${(resultsResponse as any).status}, hasResults=${hasResults}, hasData=${hasData}`, "debug");
                    }
                } catch (error) {
                    const errMsg = error instanceof Error ? error.message : String(error);
                    logAgent.log(`Error polling results: ${errMsg}`, "warn");
                    if (errMsg.includes("status 404")) {
                        logAgent.log(`Results endpoint returned 404 Not Found. Check apiConfig.resultsPath or ask API provider for the correct URL (e.g. GET ${resultsUrl})`, "error");
                        return null;
                    }
                    if (attempt < this.apiConfig.maxPollAttempts) {
                        continue;
                    }
                }
            }

            logAgent.log(`Max polling attempts reached for job_id: ${jobId}`, "warn");
            return null;

        } catch (error) {
            logAgent.log(`Failed to scrape and poll: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }

    protected mapApiResponseToCreatorMetadata(apiResponse: any, url: string, platform: string): CreatorMetadata {
        const metadata: CreatorMetadata = {
            platform,
            url,
            extractedAt: Date.now(),
        };

        // Prefer explicit creator_* fields
        if (apiResponse.creator_id != null) metadata.creator_id = String(apiResponse.creator_id);
        if (apiResponse.creator_name != null) metadata.creator_name = apiResponse.creator_name;
        if (apiResponse.creator_username != null) metadata.creator_username = apiResponse.creator_username;
        if (apiResponse.creator_avatar_url != null) metadata.creator_avatar_url = apiResponse.creator_avatar_url;
        if (apiResponse.creator_avatar_url_100 != null) metadata.creator_avatar_url_100 = apiResponse.creator_avatar_url_100;
        if (apiResponse.creator_avatar_large_url != null) metadata.creator_avatar_large_url = apiResponse.creator_avatar_large_url;
        if (apiResponse.creator_bio != null) metadata.creator_bio = apiResponse.creator_bio;
        if (apiResponse.creator_follower_count !== undefined) metadata.creator_follower_count = Number(apiResponse.creator_follower_count);
        if (apiResponse.creator_following_count !== undefined) metadata.creator_following_count = Number(apiResponse.creator_following_count);
        if (apiResponse.creator_likes_count !== undefined) metadata.creator_likes_count = Number(apiResponse.creator_likes_count);
        if (apiResponse.creator_video_count !== undefined) metadata.creator_video_count = Number(apiResponse.creator_video_count);
        if (apiResponse.creator_open_id != null) metadata.creator_open_id = apiResponse.creator_open_id;
        if (apiResponse.creator_union_id != null) metadata.creator_union_id = apiResponse.creator_union_id;
        if (apiResponse.creator_profile_deep_link != null) metadata.creator_profile_deep_link = apiResponse.creator_profile_deep_link;
        if (apiResponse.creator_verified !== undefined) metadata.creator_verified = Boolean(apiResponse.creator_verified);

        // Fallback aliases when creator_* fields are not present
        if (!metadata.creator_id && apiResponse.id != null) metadata.creator_id = String(apiResponse.id);
        if (!metadata.creator_name && (apiResponse.name != null || apiResponse.title != null)) {
            metadata.creator_name = apiResponse.name ?? apiResponse.title;
        }
        if (!metadata.creator_username && (apiResponse.username != null || apiResponse.handle != null)) {
            metadata.creator_username = apiResponse.username ?? apiResponse.handle;
        }
        if (!metadata.creator_avatar_url && apiResponse.avatar_url != null) {
            metadata.creator_avatar_url = apiResponse.avatar_url;
        }
        if (!metadata.creator_profile_deep_link && apiResponse.profile_url != null) {
            metadata.creator_profile_deep_link = apiResponse.profile_url;
        }
        if (metadata.creator_follower_count == null && (apiResponse.followers != null || apiResponse.followers_count != null)) {
            const followersValue = apiResponse.followers ?? apiResponse.followers_count;
            metadata.creator_follower_count = Number(followersValue);
        }

        return metadata;
    }

    protected mapApiResponseToVideoMetadata(apiResponse: any, url: string, platform: string): VideoMetadata {
        const metadata: VideoMetadata = {
            platform,
            url,
            extractedAt: Date.now(),
        };

        // Core identifiers
        if (apiResponse.video_id != null) metadata.video_id = String(apiResponse.video_id);
        if (!metadata.video_id && apiResponse.id != null) metadata.video_id = String(apiResponse.id);
        if (apiResponse.shortcode != null) metadata.shortcode = apiResponse.shortcode;

        // Engagement counts (generic)
        if (apiResponse.like_count !== undefined) metadata.like_count = Number(apiResponse.like_count);
        else if (apiResponse.likes_count !== undefined) metadata.like_count = Number(apiResponse.likes_count);
        else if (apiResponse.likes !== undefined) metadata.like_count = Number(apiResponse.likes);

        if (apiResponse.comment_count !== undefined) metadata.comment_count = Number(apiResponse.comment_count);
        else if (apiResponse.comments_count !== undefined) metadata.comment_count = Number(apiResponse.comments_count);
        else if (apiResponse.comments !== undefined && typeof apiResponse.comments === "number") {
            metadata.comment_count = Number(apiResponse.comments);
        }

        if (apiResponse.view_count !== undefined) metadata.view_count = Number(apiResponse.view_count);
        else if (apiResponse.views_count !== undefined) metadata.view_count = Number(apiResponse.views_count);
        else if (apiResponse.views !== undefined) metadata.view_count = Number(apiResponse.views);
        else if (apiResponse.impressions !== undefined) metadata.view_count = Number(apiResponse.impressions);

        if (apiResponse.share_count !== undefined) metadata.share_count = Number(apiResponse.share_count);
        else if (apiResponse.shares_count !== undefined) metadata.share_count = Number(apiResponse.shares_count);
        else if (apiResponse.shares !== undefined) metadata.share_count = Number(apiResponse.shares);

        if (apiResponse.save_count !== undefined) metadata.save_count = Number(apiResponse.save_count);
        if (apiResponse.play_count !== undefined) metadata.play_count = Number(apiResponse.play_count);
        if (apiResponse.reach !== undefined) metadata.reach = Number(apiResponse.reach);

        if (apiResponse.timestamp !== undefined) metadata.timestamp = Number(apiResponse.timestamp);

        // Textual fields
        if (apiResponse.caption) metadata.caption = apiResponse.caption;
        else if (apiResponse.title && !metadata.caption) metadata.caption = apiResponse.title;

        if (apiResponse.description) metadata.description = apiResponse.description;

        // Collections
        if (apiResponse.thumbnails) {
            metadata.thumbnails = Array.isArray(apiResponse.thumbnails) ? apiResponse.thumbnails : [];
        }
        if (apiResponse.hashtags) {
            metadata.hashtags = Array.isArray(apiResponse.hashtags) ? apiResponse.hashtags : [];
        }
        if (apiResponse.mentions) {
            metadata.mentions = Array.isArray(apiResponse.mentions) ? apiResponse.mentions : [];
        }

        // Timing and channel info
        if (apiResponse.duration !== undefined) metadata.duration = Number(apiResponse.duration);
        if (apiResponse.channel_id != null) metadata.channel_id = String(apiResponse.channel_id);
        if (apiResponse.channel_name != null) metadata.channel_name = apiResponse.channel_name;

        // YouTube-specific / generic video flags
        if (apiResponse.definition) metadata.definition = apiResponse.definition;
        if (apiResponse.concurrentViewers !== undefined) metadata.concurrentViewers = Number(apiResponse.concurrentViewers);
        if (apiResponse.embeddable !== undefined) metadata.embeddable = Boolean(apiResponse.embeddable);
        if (apiResponse.dimension) metadata.dimension = apiResponse.dimension;
        if (apiResponse.projection) metadata.projection = apiResponse.projection;
        if (apiResponse.madeForKids !== undefined) metadata.madeForKids = Boolean(apiResponse.madeForKids);
        if (apiResponse.isShort !== undefined) metadata.isShort = Boolean(apiResponse.isShort);
        if (apiResponse.isLive !== undefined) metadata.isLive = Boolean(apiResponse.isLive);
        if (apiResponse.isUpcoming !== undefined) metadata.isUpcoming = Boolean(apiResponse.isUpcoming);
        if (apiResponse.hasCaptions !== undefined) metadata.hasCaptions = Boolean(apiResponse.hasCaptions);
        if (apiResponse.isUnlisted !== undefined) metadata.isUnlisted = Boolean(apiResponse.isUnlisted);
        if (apiResponse.isAgeRestricted !== undefined) metadata.isAgeRestricted = Boolean(apiResponse.isAgeRestricted);
        if (apiResponse.category) metadata.category = apiResponse.category;
        if (apiResponse.defaultLanguage) metadata.defaultLanguage = apiResponse.defaultLanguage;

        // Facebook-specific fields
        if (apiResponse.updated_time !== undefined) metadata.updated_time = Number(apiResponse.updated_time);
        if (apiResponse.content_category) metadata.content_category = apiResponse.content_category;
        if (apiResponse.embed_html) metadata.embed_html = apiResponse.embed_html;
        if (apiResponse.icon) metadata.icon = apiResponse.icon;
        if (apiResponse.is_crosspost_video !== undefined) metadata.is_crosspost_video = Boolean(apiResponse.is_crosspost_video);
        if (apiResponse.is_crossposting_eligible !== undefined) metadata.is_crossposting_eligible = Boolean(apiResponse.is_crossposting_eligible);
        if (apiResponse.is_episode !== undefined) metadata.is_episode = Boolean(apiResponse.is_episode);
        if (apiResponse.is_instagram_eligible !== undefined) metadata.is_instagram_eligible = Boolean(apiResponse.is_instagram_eligible);
        if (apiResponse.live_status) metadata.live_status = apiResponse.live_status;
        if (apiResponse.post_views !== undefined) metadata.post_views = Number(apiResponse.post_views);
        if (apiResponse.premiere_living_room_status) metadata.premiere_living_room_status = apiResponse.premiere_living_room_status;
        if (apiResponse.privacy) metadata.privacy = typeof apiResponse.privacy === "string" ? apiResponse.privacy : JSON.stringify(apiResponse.privacy);
        if (apiResponse.published !== undefined) metadata.published = Boolean(apiResponse.published);
        if (apiResponse.status) metadata.status = typeof apiResponse.status === "string" ? apiResponse.status : JSON.stringify(apiResponse.status);
        if (apiResponse.universal_video_id) metadata.universal_video_id = apiResponse.universal_video_id;
        if (apiResponse.total_video_views_unique !== undefined) metadata.total_video_views_unique = Number(apiResponse.total_video_views_unique);
        if (apiResponse.total_video_avg_time_watched !== undefined) metadata.total_video_avg_time_watched = Number(apiResponse.total_video_avg_time_watched);
        if (apiResponse.total_video_complete_views !== undefined) metadata.total_video_complete_views = Number(apiResponse.total_video_complete_views);
        if (apiResponse.total_video_10s_views !== undefined) metadata.total_video_10s_views = Number(apiResponse.total_video_10s_views);
        if (apiResponse.total_video_30s_views !== undefined) metadata.total_video_30s_views = Number(apiResponse.total_video_30s_views);
        if (apiResponse.total_video_60s_excludes_shorter_views !== undefined) {
            metadata.total_video_60s_excludes_shorter_views = Number(apiResponse.total_video_60s_excludes_shorter_views);
        }
        if (apiResponse.reaction_love_count !== undefined) metadata.reaction_love_count = Number(apiResponse.reaction_love_count);
        if (apiResponse.reaction_wow_count !== undefined) metadata.reaction_wow_count = Number(apiResponse.reaction_wow_count);
        if (apiResponse.reaction_haha_count !== undefined) metadata.reaction_haha_count = Number(apiResponse.reaction_haha_count);
        if (apiResponse.reaction_sad_count !== undefined) metadata.reaction_sad_count = Number(apiResponse.reaction_sad_count);
        if (apiResponse.reaction_angry_count !== undefined) metadata.reaction_angry_count = Number(apiResponse.reaction_angry_count);

        // Twitter/X-specific fields
        if (apiResponse.context_annotations) metadata.context_annotations = apiResponse.context_annotations;
        if (apiResponse.conversation_id) metadata.conversation_id = apiResponse.conversation_id;
        if (apiResponse.edit_controls) metadata.edit_controls = apiResponse.edit_controls;
        if (apiResponse.edit_history_tweet_ids) metadata.edit_history_tweet_ids = apiResponse.edit_history_tweet_ids;
        if (apiResponse.entities_hashtags) metadata.entities_hashtags = apiResponse.entities_hashtags;
        if (apiResponse.entities_mentions) metadata.entities_mentions = apiResponse.entities_mentions;
        if (apiResponse.entities_urls) metadata.entities_urls = apiResponse.entities_urls;
        if (apiResponse.entities_cashtags) metadata.entities_cashtags = apiResponse.entities_cashtags;
        if (apiResponse.geo) metadata.geo = apiResponse.geo;
        if (apiResponse.in_reply_to_user_id) metadata.in_reply_to_user_id = apiResponse.in_reply_to_user_id;
        if (apiResponse.reply_settings) metadata.reply_settings = apiResponse.reply_settings;
        if (apiResponse.source) metadata.source = apiResponse.source;
        if (apiResponse.withheld) metadata.withheld = apiResponse.withheld;
        if (apiResponse.reply_count !== undefined) metadata.reply_count = Number(apiResponse.reply_count);
        if (apiResponse.quote_count !== undefined) metadata.quote_count = Number(apiResponse.quote_count);
        if (apiResponse.bookmark_count !== undefined) metadata.bookmark_count = Number(apiResponse.bookmark_count);
        if (apiResponse.impression_count !== undefined) metadata.impression_count = Number(apiResponse.impression_count);
        if (apiResponse.media_key) metadata.media_key = apiResponse.media_key;
        if (apiResponse.tweet_language) metadata.tweet_language = apiResponse.tweet_language;
        if (apiResponse.possibly_sensitive !== undefined) metadata.possibly_sensitive = Boolean(apiResponse.possibly_sensitive);
        if (apiResponse.creator_created_at !== undefined) metadata.creator_created_at = Number(apiResponse.creator_created_at);
        if (apiResponse.creator_description) metadata.creator_description = apiResponse.creator_description;
        if (apiResponse.creator_location) metadata.creator_location = apiResponse.creator_location;
        if (apiResponse.creator_profile_image_url) metadata.creator_profile_image_url = apiResponse.creator_profile_image_url;
        if (apiResponse.creator_protected !== undefined) metadata.creator_protected = Boolean(apiResponse.creator_protected);
        if (apiResponse.creator_following_count !== undefined) metadata.creator_following_count = Number(apiResponse.creator_following_count);
        if (apiResponse.creator_tweet_count !== undefined) metadata.creator_tweet_count = Number(apiResponse.creator_tweet_count);
        if (apiResponse.creator_listed_count !== undefined) metadata.creator_listed_count = Number(apiResponse.creator_listed_count);
        if (apiResponse.creator_verified !== undefined) metadata.creator_verified = Boolean(apiResponse.creator_verified);
        if (apiResponse.creator_verified_type) metadata.creator_verified_type = apiResponse.creator_verified_type;
        if (apiResponse.place_full_name) metadata.place_full_name = apiResponse.place_full_name;
        if (apiResponse.place_country) metadata.place_country = apiResponse.place_country;
        if (apiResponse.place_geo) metadata.place_geo = apiResponse.place_geo;

        // Reddit-specific fields
        if (apiResponse.upvote_ratio !== undefined) metadata.upvote_ratio = Number(apiResponse.upvote_ratio);
        if (apiResponse.is_self !== undefined) metadata.is_self = Boolean(apiResponse.is_self);
        if (apiResponse.is_gallery !== undefined) metadata.is_gallery = Boolean(apiResponse.is_gallery);
        if (apiResponse.spoiler !== undefined) metadata.spoiler = Boolean(apiResponse.spoiler);
        if (apiResponse.locked !== undefined) metadata.locked = Boolean(apiResponse.locked);
        if (apiResponse.stickied !== undefined) metadata.stickied = Boolean(apiResponse.stickied);
        if (apiResponse.over_18 !== undefined) metadata.over_18 = Boolean(apiResponse.over_18);
        if (apiResponse.link_flair_text) metadata.link_flair_text = apiResponse.link_flair_text;
        if (apiResponse.link_flair_css_class) metadata.link_flair_css_class = apiResponse.link_flair_css_class;
        if (apiResponse.domain) metadata.domain = apiResponse.domain;
        if (apiResponse.selftext_html) metadata.selftext_html = apiResponse.selftext_html;
        if (apiResponse.author_fullname) metadata.author_fullname = apiResponse.author_fullname;
        if (apiResponse.subreddit_id) metadata.subreddit_id = apiResponse.subreddit_id;
        if (apiResponse.thumbnail_height !== undefined) metadata.thumbnail_height = Number(apiResponse.thumbnail_height);
        if (apiResponse.thumbnail_width !== undefined) metadata.thumbnail_width = Number(apiResponse.thumbnail_width);

        // Twitch-specific fields (basic + gap fields)
        if (apiResponse.title) metadata.title = apiResponse.title;
        if (apiResponse.description) metadata.description = apiResponse.description;
        if (apiResponse.created_at) metadata.created_at = apiResponse.created_at;
        if (apiResponse.language) metadata.language = apiResponse.language;
        if (apiResponse.thumbnail_url) metadata.thumbnail_url = apiResponse.thumbnail_url;
        if (apiResponse.user_id) metadata.user_id = apiResponse.user_id;
        if (apiResponse.user_login) metadata.user_login = apiResponse.user_login;
        if (apiResponse.user_name) metadata.user_name = apiResponse.user_name;
        if (apiResponse.viewer_count !== undefined) metadata.viewer_count = Number(apiResponse.viewer_count);
        if (apiResponse.started_at) metadata.started_at = apiResponse.started_at;
        if (apiResponse.stream_id) metadata.stream_id = apiResponse.stream_id;
        if (apiResponse.published_at) metadata.published_at = apiResponse.published_at;
        if (apiResponse.muted_segments) metadata.muted_segments = apiResponse.muted_segments;
        if (apiResponse.vod_type) metadata.vod_type = apiResponse.vod_type;
        if (apiResponse.embed_url) metadata.embed_url = apiResponse.embed_url;
        if (apiResponse.source_video_id) metadata.source_video_id = apiResponse.source_video_id;
        if (apiResponse.vod_offset !== undefined) metadata.vod_offset = Number(apiResponse.vod_offset);
        if (apiResponse.is_featured !== undefined) metadata.is_featured = Boolean(apiResponse.is_featured);
        if (apiResponse.clip_creator_id) metadata.clip_creator_id = apiResponse.clip_creator_id;
        if (apiResponse.game_id) metadata.game_id = apiResponse.game_id;
        if (apiResponse.game_name) metadata.game_name = apiResponse.game_name;
        if (apiResponse.is_mature !== undefined) metadata.is_mature = Boolean(apiResponse.is_mature);
        if (apiResponse.tags) metadata.tags = Array.isArray(apiResponse.tags) ? apiResponse.tags : [];
        if (apiResponse.content_classification_labels) {
            metadata.content_classification_labels = Array.isArray(apiResponse.content_classification_labels)
                ? apiResponse.content_classification_labels
                : [];
        }
        if (apiResponse.is_branded_content !== undefined) metadata.is_branded_content = Boolean(apiResponse.is_branded_content);
        if (apiResponse.twitch_content_type) metadata.twitch_content_type = apiResponse.twitch_content_type;

        // TikTok-specific fields
        if (apiResponse.embed_link) metadata.embed_link = apiResponse.embed_link;
        if (apiResponse.playlist_id) metadata.playlist_id = apiResponse.playlist_id;
        if (apiResponse.voice_to_text) metadata.voice_to_text = apiResponse.voice_to_text;
        if (apiResponse.region_code) metadata.region_code = apiResponse.region_code;

        return metadata;
    }
}
