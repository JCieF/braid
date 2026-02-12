import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata, CreatorMetadataScraperConfig } from "../../types/index.js";
import { ApiScraperAdapter } from "../ApiScraperAdapter.js";
import { Logger } from "../../helpers/StringBuilder.js";

export class FacebookApiScraper extends ApiScraperAdapter {
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

    protected getVideoIdFromUrl(url: string): string | null {
        const reelMatch = url.match(/facebook\.com\/reel\/(\d+)/);
        if (reelMatch) return reelMatch[1];
        const watchMatch = url.match(/[\?&]v=(\d+)/);
        if (watchMatch) return watchMatch[1];
        return null;
    }

    protected async extractMetadataFromApi(url: string): Promise<CreatorMetadata | null> {
        const logAgent = this.logger;

        try {
            logAgent.log(`Extracting Facebook metadata via API for: ${url}`, "info");

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
            const status = (payload as Record<string, unknown>).scrape_status;
            if (status === "Queued" || status === "Processing") {
                logAgent.log(`Scrape job not completed (status: ${status}), no creator metadata available`, "warn");
                return null;
            }
            logAgent.log(`Creator payload from: ${hasNestedData ? "data" : "top-level"}, keys: ${JSON.stringify(Object.keys(payload))}`, "debug");
            if (payload.authors != null) logAgent.log(`Creator authors: ${JSON.stringify((payload as Record<string, unknown>).authors)}`, "debug");
            if (payload.reach_metrics != null) logAgent.log(`Creator reach_metrics: ${JSON.stringify((payload as Record<string, unknown>).reach_metrics)}`, "debug");
            if (payload.organic_traffic != null) logAgent.log(`Creator organic_traffic: ${JSON.stringify((payload as Record<string, unknown>).organic_traffic)}`, "debug");
            const normalized = this.normalizeApiPayloadToCreatorShape(payload as Record<string, unknown>);
            logAgent.log(`Normalized creator data: ${JSON.stringify(normalized)}`, "debug");
            const metadata = this.mapApiResponseToCreatorMetadata(normalized, url, "facebook");
            logAgent.log("Successfully extracted Facebook metadata via API", "info");

            return metadata;
        } catch (error) {
            logAgent.log(`Failed to extract Facebook metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }

    protected async extractVideoMetadataFromApi(url: string): Promise<VideoMetadata | null> {
        const logAgent = this.logger;

        try {
            logAgent.log(`Extracting Facebook video metadata via API for: ${url}`, "info");

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
            const status = (payload as Record<string, unknown>).scrape_status;
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
            const metadata = this.mapApiResponseToVideoMetadata(normalized, url, "facebook");
            logAgent.log("Successfully extracted Facebook video metadata via API", "info");

            return metadata;
        } catch (error) {
            logAgent.log(`Failed to extract Facebook video metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }
}
