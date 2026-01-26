import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata, ExtendedMetadata, PlatformType, CreatorMetadataScraperConfig, BrowserType } from "../types/index.js";
import { CreatorMetadataScraper } from "./CreatorMetadataScraper.js";
import { YouTubeScraper } from "./YouTubeScraper.js";
import { TikTokScraper } from "./TikTokScraper.js";
import { TwitterScraper } from "./TwitterScraper.js";
import { InstagramScraper } from "./InstagramScraper.js";
import { RedditScraper } from "./RedditScraper.js";
import { FacebookScraper } from "./FacebookScraper.js";
import { TwitchScraper } from "./TwitchScraper.js";
import { Logger } from "../helpers/StringBuilder.js";
import { ChromiumBrowser } from "../browsers/ChromiumBrowser.js";
import { FirefoxBrowser } from "../browsers/FirefoxBrowser.js";
import { BraveBrowser } from "../browsers/BraveBrowser.js";

export class CreatorMetadataManager {
    private logger: Logger;
    private config: CreatorMetadataScraperConfig;

    constructor(logger: Logger, config: CreatorMetadataScraperConfig = {}) {
        this.logger = logger;
        this.config = config;
    }

    private getScraperForPlatform(platform: PlatformType): CreatorMetadataScraper | null {
        const logAgent = this.logger.agent("CreatorMetadataManager");

        switch (platform) {
            case "youtube":
                return new YouTubeScraper(this.logger, this.config);
            case "tiktok":
                return new TikTokScraper(this.logger, this.config);
            case "twitter":
                return new TwitterScraper(this.logger, this.config);
            case "instagram":
                return new InstagramScraper(this.logger, this.config);
            case "reddit":
                return new RedditScraper(this.logger, this.config);
            case "facebook":
                return new FacebookScraper(this.logger, this.config);
            case "twitch":
                return new TwitchScraper(this.logger, this.config);
            default:
                logAgent.log(`No scraper available for platform: ${platform}`, "warn");
                return null;
        }
    }

    async extractMetadata(videoUrl: string): Promise<CreatorMetadata | null> {
        const logAgent = this.logger.agent("CreatorMetadataManager");
        let browserInstance: any = null;
        let page: Page | null = null;

        try {
            const platform = CreatorMetadataScraper.detectPlatform(videoUrl);
            logAgent.log(`Detected platform: ${platform}`, "info");

            if (platform === "unknown") {
                logAgent.log(`Unknown platform for URL: ${videoUrl}`, "warn");
                return null;
            }

            const scraper = this.getScraperForPlatform(platform);
            if (!scraper) {
                return null;
            }

            const browserType: BrowserType = this.config.browserType || "chromium";

            if (browserType === "chromium") {
                browserInstance = new ChromiumBrowser(this.logger);
            } else if (browserType === "firefox") {
                browserInstance = new FirefoxBrowser(this.logger);
            } else if (browserType === "brave") {
                browserInstance = new BraveBrowser(this.logger);
            } else {
                browserInstance = new ChromiumBrowser(this.logger);
            }

            await browserInstance.launch({
                headless: this.config.browserConfig?.headless ?? true,
                viewport: this.config.browserConfig?.viewport ?? { width: 1920, height: 1080 },
                ignoreHTTPSErrors: this.config.browserConfig?.ignoreHTTPSErrors ?? true,
                javaScriptEnabled: this.config.browserConfig?.javaScriptEnabled ?? true,
            });

            page = await browserInstance.getPage();
            if (!page) {
                logAgent.log("Failed to get browser page", "error");
                return null;
            }
            const metadata = await scraper.extractMetadata(page, videoUrl);

            return metadata;

        } catch (error) {
            logAgent.log(`Error extracting metadata: ${error}`, "error");
            return null;
        } finally {
            if (page) {
                try {
                    await page.close();
                } catch (error) {
                    // Ignore cleanup errors
                }
            }
            if (browserInstance) {
                try {
                    await browserInstance.close();
                } catch (error) {
                    // Ignore cleanup errors
                }
            }
        }
    }

    async extractMetadataFromPage(page: Page, videoUrl: string): Promise<CreatorMetadata | null> {
        const logAgent = this.logger.agent("CreatorMetadataManager");

        try {
            const platform = CreatorMetadataScraper.detectPlatform(videoUrl);
            logAgent.log(`Detected platform: ${platform}`, "info");

            if (platform === "unknown") {
                logAgent.log(`Unknown platform for URL: ${videoUrl}`, "warn");
                return null;
            }

            const scraper = this.getScraperForPlatform(platform);
            if (!scraper) {
                return null;
            }

            const metadata = await scraper.extractMetadata(page, videoUrl);

            return metadata;

        } catch (error) {
            logAgent.log(`Error extracting metadata: ${error}`, "error");
            return null;
        }
    }

    async extractExtendedMetadata(videoUrl: string): Promise<ExtendedMetadata | null> {
        const logAgent = this.logger.agent("CreatorMetadataManager");
        let browserInstance: any = null;
        let page: Page | null = null;

        try {
            const platform = CreatorMetadataScraper.detectPlatform(videoUrl);
            logAgent.log(`Detected platform: ${platform}`, "info");

            if (platform === "unknown") {
                logAgent.log(`Unknown platform for URL: ${videoUrl}`, "warn");
                return null;
            }

            const scraper = this.getScraperForPlatform(platform);
            if (!scraper) {
                return null;
            }

            const browserType: BrowserType = this.config.browserType || "chromium";

            if (browserType === "chromium") {
                browserInstance = new ChromiumBrowser(this.logger);
            } else if (browserType === "firefox") {
                browserInstance = new FirefoxBrowser(this.logger);
            } else if (browserType === "brave") {
                browserInstance = new BraveBrowser(this.logger);
            } else {
                browserInstance = new ChromiumBrowser(this.logger);
            }

            await browserInstance.launch({
                headless: this.config.browserConfig?.headless ?? true,
                viewport: this.config.browserConfig?.viewport ?? { width: 1920, height: 1080 },
                ignoreHTTPSErrors: this.config.browserConfig?.ignoreHTTPSErrors ?? true,
                javaScriptEnabled: this.config.browserConfig?.javaScriptEnabled ?? true,
            });

            page = await browserInstance.getPage();
            if (!page) {
                logAgent.log("Failed to get browser page", "error");
                return null;
            }
            
            const creatorMetadata = await scraper.extractMetadata(page, videoUrl);
            const videoMetadata = await scraper.extractVideoMetadata(page, videoUrl);

            const result: ExtendedMetadata = {};
            if (creatorMetadata) result.creator = creatorMetadata;
            if (videoMetadata) result.video = videoMetadata;

            return Object.keys(result).length > 0 ? result : null;

        } catch (error) {
            logAgent.log(`Error extracting extended metadata: ${error}`, "error");
            return null;
        } finally {
            if (page) {
                try {
                    await page.close();
                } catch (error) {
                    // Ignore cleanup errors
                }
            }
            if (browserInstance) {
                try {
                    await browserInstance.close();
                } catch (error) {
                    // Ignore cleanup errors
                }
            }
        }
    }

    async extractExtendedMetadataFromPage(page: Page, videoUrl: string): Promise<ExtendedMetadata | null> {
        const logAgent = this.logger.agent("CreatorMetadataManager");

        try {
            const platform = CreatorMetadataScraper.detectPlatform(videoUrl);
            logAgent.log(`Detected platform: ${platform}`, "info");

            if (platform === "unknown") {
                logAgent.log(`Unknown platform for URL: ${videoUrl}`, "warn");
                return null;
            }

            const scraper = this.getScraperForPlatform(platform);
            if (!scraper) {
                return null;
            }

            const creatorMetadata = await scraper.extractMetadata(page, videoUrl);
            const videoMetadata = await scraper.extractVideoMetadata(page, videoUrl);

            const result: ExtendedMetadata = {};
            if (creatorMetadata) result.creator = creatorMetadata;
            if (videoMetadata) result.video = videoMetadata;
            
            if (creatorMetadata && videoMetadata && (videoMetadata as any).creator_fields) {
                const creatorFields = (videoMetadata as any).creator_fields;
                if (creatorFields.creator_open_id) creatorMetadata.creator_open_id = creatorFields.creator_open_id;
                if (creatorFields.creator_union_id) creatorMetadata.creator_union_id = creatorFields.creator_union_id;
                if (creatorFields.creator_avatar_url_100) creatorMetadata.creator_avatar_url_100 = creatorFields.creator_avatar_url_100;
                if (creatorFields.creator_avatar_large_url) creatorMetadata.creator_avatar_large_url = creatorFields.creator_avatar_large_url;
                if (creatorFields.creator_profile_deep_link) creatorMetadata.creator_profile_deep_link = creatorFields.creator_profile_deep_link;
                if (creatorFields.creator_following_count !== undefined) creatorMetadata.creator_following_count = creatorFields.creator_following_count;
                if (creatorFields.creator_likes_count !== undefined) creatorMetadata.creator_likes_count = creatorFields.creator_likes_count;
                if (creatorFields.creator_video_count !== undefined) creatorMetadata.creator_video_count = creatorFields.creator_video_count;
            }

            return Object.keys(result).length > 0 ? result : null;

        } catch (error) {
            logAgent.log(`Error extracting extended metadata: ${error}`, "error");
            return null;
        }
    }
}

