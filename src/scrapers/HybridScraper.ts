import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata } from "../types/index.js";
import { CreatorMetadataScraper } from "./CreatorMetadataScraper.js";
import { Logger } from "../helpers/StringBuilder.js";

export class HybridScraper extends CreatorMetadataScraper {
    private apiScraper: CreatorMetadataScraper | null;
    private localScraper: CreatorMetadataScraper;
    private logAgent: any;

    constructor(
        apiScraper: CreatorMetadataScraper | null,
        localScraper: CreatorMetadataScraper,
        logger: Logger
    ) {
        super(logger, {});
        this.apiScraper = apiScraper;
        this.localScraper = localScraper;
        this.logAgent = logger.agent("HybridScraper");
    }

    async extractMetadata(page: Page, videoUrl: string): Promise<CreatorMetadata | null> {
        if (this.apiScraper) {
            try {
                this.logAgent.log(`Attempting API scraper for ${videoUrl}`, "info");
                const metadata = await this.apiScraper.extractMetadata(page, videoUrl);
                if (metadata) {
                    this.logAgent.log(`API scraper succeeded for ${videoUrl}`, "info");
                    return metadata;
                }
                this.logAgent.log(`API scraper returned no metadata, falling back to local scraper`, "warn");
            } catch (error) {
                this.logAgent.log(`API scraper failed: ${error instanceof Error ? error.message : String(error)}, falling back to local scraper`, "warn");
            }
        } else {
            this.logAgent.log(`API scraper not available, using local scraper only`, "info");
        }

        try {
            this.logAgent.log(`Using local scraper for ${videoUrl}`, "info");
            const metadata = await this.localScraper.extractMetadata(page, videoUrl);
            if (metadata) {
                this.logAgent.log(`Local scraper succeeded for ${videoUrl}`, "info");
            } else {
                this.logAgent.log(`Local scraper returned no metadata for ${videoUrl}`, "warn");
            }
            return metadata;
        } catch (error) {
            this.logAgent.log(`Local scraper failed: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }

    async extractVideoMetadata(page: Page, videoUrl: string): Promise<VideoMetadata | null> {
        if (this.apiScraper) {
            try {
                this.logAgent.log(`Attempting API scraper for video metadata: ${videoUrl}`, "info");
                const metadata = await this.apiScraper.extractVideoMetadata(page, videoUrl);
                if (metadata) {
                    this.logAgent.log(`API scraper succeeded for video metadata: ${videoUrl}`, "info");
                    return metadata;
                }
                this.logAgent.log(`API scraper returned no video metadata, falling back to local scraper`, "warn");
            } catch (error) {
                this.logAgent.log(`API scraper failed for video metadata: ${error instanceof Error ? error.message : String(error)}, falling back to local scraper`, "warn");
            }
        }

        try {
            this.logAgent.log(`Using local scraper for video metadata: ${videoUrl}`, "info");
            const metadata = await this.localScraper.extractVideoMetadata(page, videoUrl);
            if (metadata) {
                this.logAgent.log(`Local scraper succeeded for video metadata: ${videoUrl}`, "info");
            }
            return metadata;
        } catch (error) {
            this.logAgent.log(`Local scraper failed for video metadata: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }

    async getCreatorProfileUrl(videoUrl: string): Promise<string | null> {
        if (this.apiScraper) {
            try {
                const url = await this.apiScraper.getCreatorProfileUrl(videoUrl);
                if (url) return url;
            } catch (error) {
                this.logAgent.log(`API scraper failed to get creator profile URL: ${error instanceof Error ? error.message : String(error)}`, "debug");
            }
        }

        try {
            return await this.localScraper.getCreatorProfileUrl(videoUrl);
        } catch (error) {
            this.logAgent.log(`Local scraper failed to get creator profile URL: ${error instanceof Error ? error.message : String(error)}`, "error");
            return null;
        }
    }
}
