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
        if (payload.title != null && out.creator_name == null && typeof payload.authors === "undefined") out.creator_name = String(payload.title);
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
        }
        const reachMetrics = payload.reach_metrics;
        if (reachMetrics != null && typeof reachMetrics === "object") {
            const rm = reachMetrics as Record<string, unknown>;
            if (rm.views != null && out.view_count == null) out.view_count = Number(rm.views);
            if (rm.view_count != null && out.view_count == null) out.view_count = Number(rm.view_count);
            if (rm.views_count != null && out.view_count == null) out.view_count = Number(rm.views_count);
            if (rm.impressions != null && out.view_count == null) out.view_count = Number(rm.impressions);
        }
        if (typeof payload.comments === "number") out.comment_count = payload.comment_count;
        if (Array.isArray(payload.comments) && out.comment_count == null) out.comment_count = (payload.comments as unknown[]).length;
        const virality = payload.virality;
        if (virality != null && typeof virality === "object") {
            const v = virality as Record<string, unknown>;
            if (v.views != null && out.view_count == null) out.view_count = Number(v.views);
            if (v.view_count != null && out.view_count == null) out.view_count = Number(v.view_count);
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

        if (apiResponse.creator_id) metadata.creator_id = String(apiResponse.creator_id);
        if (apiResponse.creator_name) metadata.creator_name = apiResponse.creator_name;
        if (apiResponse.creator_username) metadata.creator_username = apiResponse.creator_username;
        if (apiResponse.creator_avatar_url) metadata.creator_avatar_url = apiResponse.creator_avatar_url;
        if (apiResponse.creator_avatar_url_100) metadata.creator_avatar_url_100 = apiResponse.creator_avatar_url_100;
        if (apiResponse.creator_avatar_large_url) metadata.creator_avatar_large_url = apiResponse.creator_avatar_large_url;
        if (apiResponse.creator_bio) metadata.creator_bio = apiResponse.creator_bio;
        if (apiResponse.creator_follower_count !== undefined) metadata.creator_follower_count = Number(apiResponse.creator_follower_count);
        if (apiResponse.creator_following_count !== undefined) metadata.creator_following_count = Number(apiResponse.creator_following_count);
        if (apiResponse.creator_likes_count !== undefined) metadata.creator_likes_count = Number(apiResponse.creator_likes_count);
        if (apiResponse.creator_video_count !== undefined) metadata.creator_video_count = Number(apiResponse.creator_video_count);
        if (apiResponse.creator_open_id) metadata.creator_open_id = apiResponse.creator_open_id;
        if (apiResponse.creator_union_id) metadata.creator_union_id = apiResponse.creator_union_id;
        if (apiResponse.creator_profile_deep_link) metadata.creator_profile_deep_link = apiResponse.creator_profile_deep_link;
        if (apiResponse.creator_verified !== undefined) metadata.creator_verified = Boolean(apiResponse.creator_verified);

        return metadata;
    }

    protected mapApiResponseToVideoMetadata(apiResponse: any, url: string, platform: string): VideoMetadata {
        const metadata: VideoMetadata = {
            platform,
            url,
            extractedAt: Date.now(),
        };

        if (apiResponse.video_id) metadata.video_id = String(apiResponse.video_id);
        if (apiResponse.shortcode) metadata.shortcode = apiResponse.shortcode;
        if (apiResponse.like_count !== undefined) metadata.like_count = Number(apiResponse.like_count);
        if (apiResponse.comment_count !== undefined) metadata.comment_count = Number(apiResponse.comment_count);
        if (apiResponse.view_count !== undefined) metadata.view_count = Number(apiResponse.view_count);
        if (apiResponse.share_count !== undefined) metadata.share_count = Number(apiResponse.share_count);
        if (apiResponse.save_count !== undefined) metadata.save_count = Number(apiResponse.save_count);
        if (apiResponse.play_count !== undefined) metadata.play_count = Number(apiResponse.play_count);
        if (apiResponse.reach !== undefined) metadata.reach = Number(apiResponse.reach);
        if (apiResponse.timestamp !== undefined) metadata.timestamp = Number(apiResponse.timestamp);
        if (apiResponse.caption) metadata.caption = apiResponse.caption;
        if (apiResponse.description) metadata.description = apiResponse.description;
        if (apiResponse.thumbnails) metadata.thumbnails = Array.isArray(apiResponse.thumbnails) ? apiResponse.thumbnails : [];
        if (apiResponse.hashtags) metadata.hashtags = Array.isArray(apiResponse.hashtags) ? apiResponse.hashtags : [];
        if (apiResponse.mentions) metadata.mentions = Array.isArray(apiResponse.mentions) ? apiResponse.mentions : [];
        if (apiResponse.duration !== undefined) metadata.duration = Number(apiResponse.duration);
        if (apiResponse.channel_id) metadata.channel_id = String(apiResponse.channel_id);
        if (apiResponse.channel_name) metadata.channel_name = apiResponse.channel_name;
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

        return metadata;
    }
}
