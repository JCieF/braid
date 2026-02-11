import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata, CreatorMetadataScraperConfig } from "../../types/index.js";
import { ApiScraperAdapter } from "../ApiScraperAdapter.js";
import { Logger } from "../../helpers/StringBuilder.js";

export class YouTubeApiScraper extends ApiScraperAdapter {
    async getCreatorProfileUrl(videoUrl: string): Promise<string | null> {
        try {
            const channelMatch = videoUrl.match(/youtube\.com\/channel\/([^\/\?]+)/);
            if (channelMatch) {
                return `https://www.youtube.com/channel/${channelMatch[1]}`;
            }
            const handleMatch = videoUrl.match(/youtube\.com\/@([^\/\?]+)/);
            if (handleMatch) {
                return `https://www.youtube.com/@${handleMatch[1]}`;
            }
            return null;
        } catch {
            return null;
        }
    }

    protected getVideoIdFromUrl(url: string): string | null {
        const match = url.match(/(?:v=|\/watch\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    }

    protected async extractMetadataFromApi(url: string): Promise<CreatorMetadata | null> {
        const logAgent = this.logger;

        try {
            logAgent.log(`Extracting YouTube metadata via API for: ${url}`, "info");

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
            logAgent.log(`Creator payload from: ${hasNestedData ? "data" : "top-level"}, keys: ${JSON.stringify(Object.keys(payload))}`, "debug");
            if (payload.authors != null) logAgent.log(`Creator authors sample: ${JSON.stringify((payload as Record<string, unknown>).authors)}`, "debug");
            const normalized = this.normalizeApiPayloadToCreatorShape(payload as Record<string, unknown>);
            const metadata = this.mapApiResponseToCreatorMetadata(normalized, url, "youtube");
            logAgent.log("Successfully extracted YouTube metadata via API", "info");

            return metadata;
        } catch (error) {
            logAgent.log(`Failed to extract YouTube metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }

    protected async extractVideoMetadataFromApi(url: string): Promise<VideoMetadata | null> {
        const logAgent = this.logger;

        try {
            logAgent.log(`Extracting YouTube video metadata via API for: ${url}`, "info");

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
            logAgent.log(`Video payload from: ${hasNestedData ? "data" : "top-level"}, keys: ${JSON.stringify(Object.keys(payload))}`, "debug");
            if (payload.engagements != null || payload.reach_metrics != null) logAgent.log(`Video engagements: ${JSON.stringify((payload as Record<string, unknown>).engagements)}, reach_metrics: ${JSON.stringify((payload as Record<string, unknown>).reach_metrics)}`, "debug");
            const normalized = this.normalizeApiPayloadToVideoShape(payload as Record<string, unknown>, url);
            const metadata = this.mapApiResponseToVideoMetadata(normalized, url, "youtube");
            logAgent.log("Successfully extracted YouTube video metadata via API", "info");

            return metadata;
        } catch (error) {
            logAgent.log(`Failed to extract YouTube video metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }
}
