import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata, CreatorMetadataScraperConfig } from "../../types/index.js";
import { ApiScraperAdapter } from "../ApiScraperAdapter.js";
import { Logger } from "../../helpers/StringBuilder.js";

export class InstagramApiScraper extends ApiScraperAdapter {
    async getCreatorProfileUrl(videoUrl: string): Promise<string | null> {
        try {
            const match = videoUrl.match(/instagram\.com\/([^\/\?]+)/);
            if (match && !match[1].includes("p/") && !match[1].includes("reel/")) {
                return `https://www.instagram.com/${match[1]}/`;
            }
            if (match && (match[1].includes("p/") || match[1].includes("reel/"))) {
                const postMatch = videoUrl.match(/instagram\.com\/(p|reel)\/([^\/\?]+)/);
                if (postMatch) {
                    return null;
                }
            }
            return null;
        } catch {
            return null;
        }
    }

    protected async extractMetadataFromApi(url: string): Promise<CreatorMetadata | null> {
        const logAgent = this.logger;
        
        try {
            logAgent.log(`Extracting Instagram metadata via API for: ${url}`, "info");

            const payload = {
                platform: "instagram",
                url: url,
            };

            const response = await this.makeApiRequest("/scrape", payload);
            
            if (!response || !response.data) {
                logAgent.log("API response missing data", "warn");
                return null;
            }

            const metadata = this.mapApiResponseToCreatorMetadata(response.data, url, "instagram");
            logAgent.log("Successfully extracted Instagram metadata via API", "info");
            
            return metadata;
        } catch (error) {
            logAgent.log(`Failed to extract Instagram metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }

    protected async extractVideoMetadataFromApi(url: string): Promise<VideoMetadata | null> {
        const logAgent = this.logger;
        
        try {
            logAgent.log(`Extracting Instagram video metadata via API for: ${url}`, "info");

            const payload = {
                platform: "instagram",
                url: url,
                includeVideoMetadata: true,
            };

            const response = await this.makeApiRequest("/scrape", payload);
            
            if (!response || !response.data) {
                return null;
            }

            const metadata = this.mapApiResponseToVideoMetadata(response.data, url, "instagram");
            logAgent.log("Successfully extracted Instagram video metadata via API", "info");
            
            return metadata;
        } catch (error) {
            logAgent.log(`Failed to extract Instagram video metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }
}
