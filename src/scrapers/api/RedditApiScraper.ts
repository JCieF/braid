import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata, CreatorMetadataScraperConfig } from "../../types/index.js";
import { ApiScraperAdapter } from "../ApiScraperAdapter.js";
import { Logger } from "../../helpers/StringBuilder.js";

export class RedditApiScraper extends ApiScraperAdapter {
    async getCreatorProfileUrl(videoUrl: string): Promise<string | null> {
        try {
            const match = videoUrl.match(/reddit\.com\/user\/([^\/\?]+)/);
            if (match) {
                return `https://www.reddit.com/user/${match[1]}`;
            }
            
            const postMatch = videoUrl.match(/reddit\.com\/r\/([^\/]+)\/comments\/([^\/]+)/);
            if (postMatch) {
                return null;
            }
            
            return null;
        } catch {
            return null;
        }
    }

    protected getVideoIdFromUrl(url: string): string | null {
        const match = url.match(/reddit\.com\/r\/[^/]+\/comments\/([a-z0-9]+)/i);
        return match ? match[1] : null;
    }

    protected async extractMetadataFromApi(url: string): Promise<CreatorMetadata | null> {
        const logAgent = this.logger;

        try {
            logAgent.log(`Extracting Reddit metadata via API for: ${url}`, "info");

            const apiData = await this.scrapeAndPoll(url);

            if (!apiData) {
                logAgent.log("API response missing data", "warn");
                return null;
            }

            const hasNestedData = apiData && apiData.data != null && typeof apiData.data === "object";
            const payload = hasNestedData ? apiData.data : apiData;
            if (!payload || typeof payload !== "object") {
                logAgent.log("API response has no mappable payload (creator)", "warn");
                return null;
            }
            const status = hasNestedData ? apiData.scrape_status : (payload as Record<string, unknown>).scrape_status;
            if (status === "Queued" || status === "Processing") {
                logAgent.log(`Scrape job not completed (status: ${status}), no creator metadata available`, "warn");
                return null;
            }
            logAgent.log(`Creator payload from: ${hasNestedData ? "data" : "top-level"}, keys: ${JSON.stringify(Object.keys(payload))}`, "debug");
            if (payload.authors != null) logAgent.log(`Creator authors: ${JSON.stringify((payload as Record<string, unknown>).authors)}`, "debug");
            if (payload.reach_metrics != null) logAgent.log(`Creator reach_metrics: ${JSON.stringify((payload as Record<string, unknown>).reach_metrics)}`, "debug");
            const normalized = this.normalizeApiPayloadToCreatorShape(payload as Record<string, unknown>);
            logAgent.log(`Normalized creator data: ${JSON.stringify(normalized)}`, "debug");
            const metadata = this.mapApiResponseToCreatorMetadata(normalized, url, "reddit");
            logAgent.log("Successfully extracted Reddit metadata via API", "info");

            return metadata;
        } catch (error) {
            logAgent.log(`Failed to extract Reddit metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }

    protected async extractVideoMetadataFromApi(url: string): Promise<VideoMetadata | null> {
        const logAgent = this.logger;

        try {
            logAgent.log(`Extracting Reddit video metadata via API for: ${url}`, "info");

            const apiData = await this.scrapeAndPoll(url);

            if (!apiData) {
                return null;
            }

            const hasNestedData = apiData && apiData.data != null && typeof apiData.data === "object";
            const payload = hasNestedData ? apiData.data : apiData;
            if (!payload || typeof payload !== "object") {
                logAgent.log("API response has no mappable payload (video)", "warn");
                return null;
            }
            const status = hasNestedData ? apiData.scrape_status : (payload as Record<string, unknown>).scrape_status;
            if (status === "Queued" || status === "Processing") {
                logAgent.log(`Scrape job not completed (status: ${status}), no video metadata available`, "warn");
                return null;
            }
            logAgent.log(`Video payload from: ${hasNestedData ? "data" : "top-level"}, keys: ${JSON.stringify(Object.keys(payload))}`, "debug");
            if (payload.engagements != null) logAgent.log(`Video engagements: ${JSON.stringify((payload as Record<string, unknown>).engagements)}`, "debug");
            if (payload.reach_metrics != null) logAgent.log(`Video reach_metrics: ${JSON.stringify((payload as Record<string, unknown>).reach_metrics)}`, "debug");
            if (payload.virality != null) logAgent.log(`Video virality: ${JSON.stringify((payload as Record<string, unknown>).virality)}`, "debug");
            const normalized = this.normalizeApiPayloadToVideoShape(payload as Record<string, unknown>, url);
            logAgent.log(`Normalized video data: ${JSON.stringify(normalized)}`, "debug");
            const metadata = this.mapApiResponseToVideoMetadata(normalized, url, "reddit");
            logAgent.log("Successfully extracted Reddit video metadata via API", "info");
            logAgent.log(`Metadata: ${JSON.stringify(metadata)}`, "debug");

            return metadata;
        } catch (error) {
            logAgent.log(`Failed to extract Reddit video metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }
}
