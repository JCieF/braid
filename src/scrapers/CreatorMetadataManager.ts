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
import { HybridScraper } from "./HybridScraper.js";
import { FacebookApiScraper } from "./api/FacebookApiScraper.js";
import { TwitterApiScraper } from "./api/TwitterApiScraper.js";
import { InstagramApiScraper } from "./api/InstagramApiScraper.js";
import { RedditApiScraper } from "./api/RedditApiScraper.js";
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

    private getScraperMode(platform: PlatformType): 'local' | 'api' | 'hybrid' {
        const logAgent = this.logger.agent("CreatorMetadataManager");
        const importantPlatforms: PlatformType[] = ['youtube', 'tiktok', 'twitch'];
        const localOnlyPlatforms: PlatformType[] = ['instagram'];
        
        console.log(`[DEBUG] getScraperMode called - platform: ${platform}, config.scraperMode: ${this.config.scraperMode}`);
        logAgent.log(`getScraperMode - platform: ${platform}, config.scraperMode: ${this.config.scraperMode}`, "info");
        logAgent.log(`Determining scraper mode for platform: ${platform}`, "debug");
        logAgent.log(`Config scraperMode: ${this.config.scraperMode}, platformOverrides: ${JSON.stringify(this.config.platformOverrides)}`, "debug");
        
        if (importantPlatforms.includes(platform) || localOnlyPlatforms.includes(platform)) {
            console.log(`[DEBUG] Platform ${platform} is in important/localOnly list, using local mode`);
            logAgent.log(`Platform ${platform} is in important/localOnly list, using local mode`, "debug");
            return 'local';
        }
        
        if (this.config.platformOverrides?.[platform]) {
            console.log(`[DEBUG] Platform override found for ${platform}: ${this.config.platformOverrides[platform]}`);
            logAgent.log(`Platform override found for ${platform}: ${this.config.platformOverrides[platform]}`, "debug");
            return this.config.platformOverrides[platform];
        }
        
        const mode = this.config.scraperMode || 'hybrid';
        console.log(`[DEBUG] Using config scraperMode: ${mode}`);
        logAgent.log(`Using config scraperMode: ${mode}`, "debug");
        return mode;
    }

    private getLocalScraper(platform: PlatformType): CreatorMetadataScraper | null {
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
                logAgent.log(`No local scraper available for platform: ${platform}`, "warn");
                return null;
        }
    }

    private getApiScraper(platform: PlatformType): CreatorMetadataScraper | null {
        const logAgent = this.logger.agent("CreatorMetadataManager");

        const apiEnabled = this.config.apiConfig?.enabled !== false;
        const hasBaseUrl = this.config.apiConfig?.baseUrl || process.env.ML_API_BASE_URL;

        console.log(`[DEBUG] getApiScraper - platform: ${platform}, apiEnabled: ${apiEnabled}, hasBaseUrl: ${!!hasBaseUrl}, baseUrl: ${this.config.apiConfig?.baseUrl || process.env.ML_API_BASE_URL}`);
        logAgent.log(`getApiScraper - platform: ${platform}, apiEnabled: ${apiEnabled}, hasBaseUrl: ${!!hasBaseUrl}, baseUrl: ${this.config.apiConfig?.baseUrl || process.env.ML_API_BASE_URL}`, "info");
        logAgent.log(`API scraper check for ${platform} - enabled: ${apiEnabled}, hasBaseUrl: ${!!hasBaseUrl}`, "info");
        logAgent.log(`API config: ${JSON.stringify(this.config.apiConfig)}`, "debug");

        if (!apiEnabled && !hasBaseUrl) {
            console.log(`[DEBUG] API scraper disabled or no base URL configured`);
            logAgent.log("API scraper disabled or no base URL configured", "warn");
            return null;
        }

        switch (platform) {
            case "facebook":
                console.log(`[DEBUG] Creating FacebookApiScraper`);
                return new FacebookApiScraper(this.logger, this.config);
            case "twitter":
                console.log(`[DEBUG] Creating TwitterApiScraper`);
                return new TwitterApiScraper(this.logger, this.config);
            case "reddit":
                console.log(`[DEBUG] Creating RedditApiScraper`);
                return new RedditApiScraper(this.logger, this.config);
            case "youtube":
                return null;
            default:
                console.log(`[DEBUG] No API scraper available for platform: ${platform}`);
                logAgent.log(`No API scraper available for platform: ${platform}`, "debug");
                return null;
        }
    }

    private getScraperForPlatform(platform: PlatformType): CreatorMetadataScraper | null {
        const logAgent = this.logger.agent("CreatorMetadataManager");
        process.stderr.write(`[DEBUG] getScraperForPlatform called - platform: ${platform}, config.scraperMode: ${this.config.scraperMode}\n`);
        console.log(`[DEBUG] getScraperForPlatform called - platform: ${platform}, config.scraperMode: ${this.config.scraperMode}`);
        const mode = this.getScraperMode(platform);
        process.stderr.write(`[DEBUG] getScraperMode returned: ${mode}\n`);
        console.log(`[DEBUG] getScraperMode returned: ${mode}`);

        if (this.config.scraperMode === 'api' && mode !== 'api') {
            const errorMsg = `SCRAPER MODE MISMATCH: config.scraperMode=${this.config.scraperMode}, but getScraperMode returned=${mode} for platform=${platform}`;
            console.error(`[ERROR] ${errorMsg}`);
            throw new Error(errorMsg);
        }

        logAgent.log(`getScraperForPlatform called - platform: ${platform}, mode: ${mode}, config.scraperMode: ${this.config.scraperMode}`, "info");
        logAgent.log(`Using scraper mode: ${mode} for platform: ${platform}`, "info");
        console.log(`[DEBUG] Using scraper mode: ${mode} for platform: ${platform}`);

        if (mode === 'local') {
            const scraper = this.getLocalScraper(platform);
            console.log(`[DEBUG] Selected local scraper: ${scraper?.constructor.name || 'null'}`);
            logAgent.log(`Selected local scraper: ${scraper?.constructor.name || 'null'}`, "info");
            return scraper;
        } else if (mode === 'api') {
            process.stderr.write(`[DEBUG] Mode is 'api', calling getApiScraper for ${platform}\n`);
            console.log(`[DEBUG] Mode is 'api', calling getApiScraper for ${platform}`);
            const apiScraper = this.getApiScraper(platform);
            process.stderr.write(`[DEBUG] getApiScraper returned: ${apiScraper?.constructor.name || 'null'}\n`);
            console.log(`[DEBUG] getApiScraper returned: ${apiScraper?.constructor.name || 'null'}`);
            if (!apiScraper) {
                logAgent.log(`API scraper not available for ${platform}, returning null (no local fallback in API mode)`, "warn");
                return null;
            }
            process.stderr.write(`[DEBUG] Selected API scraper: ${apiScraper.constructor.name}\n`);
            console.log(`[DEBUG] Selected API scraper: ${apiScraper.constructor.name}`);
            logAgent.log(`Selected API scraper: ${apiScraper.constructor.name}`, "info");
            return apiScraper;
        } else if (mode === 'hybrid') {
            const apiScraper = this.getApiScraper(platform);
            const localScraper = this.getLocalScraper(platform);
            
            if (!localScraper) {
                logAgent.log(`Local scraper not available for ${platform}`, "warn");
                return apiScraper;
            }
            
            if (!apiScraper) {
                logAgent.log(`API scraper not available for ${platform}, using local only`, "info");
                return localScraper;
            }
            
            logAgent.log(`Selected hybrid scraper (API: ${apiScraper.constructor.name}, Local: ${localScraper.constructor.name})`, "info");
            return new HybridScraper(apiScraper, localScraper, this.logger);
        }

        logAgent.log(`No scraper available for platform: ${platform}`, "warn");
        return null;
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

        logAgent.log(`extractExtendedMetadata called - scraperMode: ${this.config.scraperMode}, apiConfig: ${JSON.stringify(this.config.apiConfig)}`, "info");

        try {
            const platform = CreatorMetadataScraper.detectPlatform(videoUrl);
            logAgent.log(`Detected platform: ${platform}`, "info");

            if (platform === "unknown") {
                logAgent.log(`Unknown platform for URL: ${videoUrl}`, "warn");
                return null;
            }

            const scraper = this.getScraperForPlatform(platform);
            process.stderr.write(`[DEBUG] getScraperForPlatform returned: ${scraper?.constructor.name || 'null'}\n`);
            console.log(`[DEBUG] getScraperForPlatform returned: ${scraper?.constructor.name || 'null'}`);
            if (!scraper) {
                process.stderr.write(`[DEBUG] No scraper returned, returning null\n`);
                console.log(`[DEBUG] No scraper returned, returning null`);
                return null;
            }

            const scraperClassName = scraper.constructor.name;
            const isApiScraper = scraperClassName.includes("ApiScraper") && !(scraper instanceof HybridScraper);
            process.stderr.write(`[DEBUG] Scraper class: ${scraperClassName}, isApiScraper: ${isApiScraper}, config.scraperMode: ${this.config.scraperMode}\n`);
            console.log(`[DEBUG] Scraper class: ${scraperClassName}, isApiScraper: ${isApiScraper}`);
            logAgent.log(`Scraper class: ${scraperClassName}, isApiScraper: ${isApiScraper}`, "info");
            logAgent.log(`Selected scraper type: ${scraperClassName}, config.scraperMode: ${this.config.scraperMode}`, "info");

            if (this.config.scraperMode === 'api' && !isApiScraper) {
                const errorMsg = `ERROR: scraperMode is 'api' but selected scraper is ${scraperClassName} (not an API scraper)`;
                process.stderr.write(`[ERROR] ${errorMsg}\n`);
                throw new Error(errorMsg);
            }

            if (isApiScraper) {
                logAgent.log("Using API scraper - skipping browser launch", "info");
                const creatorMetadata = await scraper.extractMetadata(page as any, videoUrl);
                const videoMetadata = await scraper.extractVideoMetadata(page as any, videoUrl);

                const result: ExtendedMetadata = {};
                if (creatorMetadata) result.creator = creatorMetadata;
                if (videoMetadata) result.video = videoMetadata;

                return Object.keys(result).length > 0 ? result : null;
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

