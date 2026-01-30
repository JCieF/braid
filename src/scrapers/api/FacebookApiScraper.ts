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
            logAgent.log(`Creator payload from: ${hasNestedData ? "data" : "top-level"}, keys: ${JSON.stringify(Object.keys(payload))}`, "debug");
            const metadata = this.mapApiResponseToCreatorMetadata(payload, url, "facebook");
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
            logAgent.log(`Video payload from: ${hasNestedData ? "data" : "top-level"}, keys: ${JSON.stringify(Object.keys(payload))}`, "debug");
            const metadata = this.mapApiResponseToVideoMetadata(payload, url, "facebook");
            logAgent.log("Successfully extracted Facebook video metadata via API", "info");
            
            return metadata;
        } catch (error) {
            logAgent.log(`Failed to extract Facebook video metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }
}
