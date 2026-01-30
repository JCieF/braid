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

    protected async extractMetadataFromApi(url: string): Promise<CreatorMetadata | null> {
        const logAgent = this.logger;
        
        try {
            logAgent.log(`Extracting Reddit metadata via API for: ${url}`, "info");

            const apiData = await this.scrapeAndPoll(url);
            
            if (!apiData) {
                logAgent.log("API response missing data", "warn");
                return null;
            }

            const metadata = this.mapApiResponseToCreatorMetadata(apiData, url, "reddit");
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

            const metadata = this.mapApiResponseToVideoMetadata(apiData, url, "reddit");
            logAgent.log("Successfully extracted Reddit video metadata via API", "info");
            
            return metadata;
        } catch (error) {
            logAgent.log(`Failed to extract Reddit video metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }
}
