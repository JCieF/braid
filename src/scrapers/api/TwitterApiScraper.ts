import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata, CreatorMetadataScraperConfig } from "../../types/index.js";
import { ApiScraperAdapter } from "../ApiScraperAdapter.js";
import { Logger } from "../../helpers/StringBuilder.js";

export class TwitterApiScraper extends ApiScraperAdapter {
    async getCreatorProfileUrl(videoUrl: string): Promise<string | null> {
        try {
            const match = videoUrl.match(/(?:twitter\.com|x\.com)\/([^\/]+)/);
            if (match) {
                const domain = videoUrl.includes("x.com") ? "x.com" : "twitter.com";
                return `https://${domain}/${match[1]}`;
            }
            return null;
        } catch {
            return null;
        }
    }

    protected async extractMetadataFromApi(url: string): Promise<CreatorMetadata | null> {
        const logAgent = this.logger;
        
        try {
            logAgent.log(`Extracting Twitter/X metadata via API for: ${url}`, "info");

            const apiData = await this.scrapeAndPoll(url);
            
            if (!apiData) {
                logAgent.log("API response missing data", "warn");
                return null;
            }

            const metadata = this.mapApiResponseToCreatorMetadata(apiData, url, "twitter");
            logAgent.log("Successfully extracted Twitter/X metadata via API", "info");
            
            return metadata;
        } catch (error) {
            logAgent.log(`Failed to extract Twitter/X metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }

    protected async extractVideoMetadataFromApi(url: string): Promise<VideoMetadata | null> {
        const logAgent = this.logger;
        
        try {
            logAgent.log(`Extracting Twitter/X video metadata via API for: ${url}`, "info");

            const apiData = await this.scrapeAndPoll(url);
            
            if (!apiData) {
                return null;
            }

            const metadata = this.mapApiResponseToVideoMetadata(apiData, url, "twitter");
            logAgent.log("Successfully extracted Twitter/X video metadata via API", "info");
            
            return metadata;
        } catch (error) {
            logAgent.log(`Failed to extract Twitter/X video metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }
}
