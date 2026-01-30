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

            for (let attempt = 1; attempt <= this.apiConfig.maxPollAttempts; attempt++) {
                await new Promise(resolve => setTimeout(resolve, this.apiConfig.pollInterval));

                logAgent.log(`Polling results (attempt ${attempt}/${this.apiConfig.maxPollAttempts}) for job_id: ${jobId}`, "debug");

                try {
                    const resultsResponse = await this.makeApiRequest("/v1/social-media/results", null, {
                        method: "POST",
                        queryParams: { job_id: jobId },
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
                    logAgent.log(`Error polling results: ${error instanceof Error ? error.message : String(error)}`, "warn");
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
        if (apiResponse.hashtags) metadata.hashtags = Array.isArray(apiResponse.hashtags) ? apiResponse.hashtags : [];
        if (apiResponse.mentions) metadata.mentions = Array.isArray(apiResponse.mentions) ? apiResponse.mentions : [];

        return metadata;
    }
}
