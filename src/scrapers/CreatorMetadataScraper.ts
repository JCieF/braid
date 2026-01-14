import { Page } from "playwright";
import { LogAgent } from "../helpers/StringBuilder.js";
import { CreatorMetadata, VideoMetadata, PlatformType, CreatorMetadataScraperConfig } from "../types/index.js";
import { BaseHelper } from "../helpers/BaseHelper.js";
import { Logger } from "../helpers/StringBuilder.js";

export abstract class CreatorMetadataScraper extends BaseHelper {
    protected config: CreatorMetadataScraperConfig;

    constructor(logger: Logger, config: CreatorMetadataScraperConfig = {}) {
        super(logger);
        this.config = {
            timeout: 30000,
            retries: 3,
            ...config,
        };
    }

    static detectPlatform(url: string): PlatformType {
        const urlLower = url.toLowerCase();
        
        if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
            return "youtube";
        } else if (urlLower.includes("tiktok.com")) {
            return "tiktok";
        } else if (urlLower.includes("facebook.com") || urlLower.includes("fb.com")) {
            return "facebook";
        } else if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) {
            return "twitter";
        } else if (urlLower.includes("instagram.com")) {
            return "instagram";
        } else if (urlLower.includes("reddit.com")) {
            return "reddit";
        } else if (urlLower.includes("twitch.tv")) {
            return "twitch";
        }
        
        return "unknown";
    }

    abstract extractMetadata(page: Page, videoUrl: string): Promise<CreatorMetadata | null>;

    abstract getCreatorProfileUrl(videoUrl: string): Promise<string | null>;

    async extractVideoMetadata(page: Page, videoUrl: string): Promise<VideoMetadata | null> {
        return null;
    }

    protected async getElementText(page: Page, selector: string): Promise<string | null> {
        try {
            const element = await page.locator(selector).first();
            if (await element.isVisible({ timeout: 5000 })) {
                return await element.textContent();
            }
        } catch (error) {
            this.logger.log(`Could not extract text from ${selector}: ${error}`, "debug");
        }
        return null;
    }

    protected async getElementAttribute(
        page: Page,
        selector: string,
        attribute: string
    ): Promise<string | null> {
        try {
            const element = await page.locator(selector).first();
            if (await element.isVisible({ timeout: 5000 })) {
                return await element.getAttribute(attribute);
            }
        } catch (error) {
            this.logger.log(
                `Could not extract ${attribute} from ${selector}: ${error}`,
                "debug"
            );
        }
        return null;
    }

    protected parseCount(text: string | null): number | undefined {
        if (!text) return undefined;
        
        const cleaned = text.replace(/,/g, "").trim();
        const match = cleaned.match(/^([\d.]+)([KMBkmb])?$/);
        if (match) {
            let num = parseFloat(match[1]);
            const suffix = match[2]?.toUpperCase();
            
            if (suffix === "K") num *= 1000;
            else if (suffix === "M") num *= 1000000;
            else if (suffix === "B") num *= 1000000000;
            
            return Math.floor(num);
        }
        
        const numbers = cleaned.match(/[\d.]+/);
        if (numbers) {
            return Math.floor(parseFloat(numbers[0]));
        }
        
        return undefined;
    }

    protected async waitForElement(
        page: Page,
        selector: string,
        timeout: number = 10000
    ): Promise<boolean> {
        try {
            await page.waitForSelector(selector, { timeout });
            return true;
        } catch {
            return false;
        }
    }

    protected cleanText(text: string | null): string {
        if (!text) return "";
        return text.trim().replace(/\s+/g, " ");
    }
}

