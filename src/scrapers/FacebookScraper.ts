import { Page } from "playwright";
import { CreatorMetadata } from "../types/index.js";
import { CreatorMetadataScraper } from "./CreatorMetadataScraper.js";
import { Logger } from "../helpers/StringBuilder.js";

export class FacebookScraper extends CreatorMetadataScraper {
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

    async extractMetadata(page: Page, videoUrl: string): Promise<CreatorMetadata | null> {
        try {
            this.logger.log("Extracting Facebook creator metadata...", "info");

            await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
            await this.delay(3000);

            let profileUrl: string | null = null;
            const links = await page.locator('a[href*="facebook.com"]').all();
            for (const link of links) {
                const href = await link.getAttribute("href");
                if (href && !href.includes("/watch") && !href.includes("/videos") && href.match(/facebook\.com\/[^\/]+$/)) {
                    profileUrl = href;
                    break;
                }
            }

            if (!profileUrl) {
                this.logger.log("Could not find Facebook profile URL", "warn");
                return null;
            }

            await page.goto(profileUrl, { waitUntil: "domcontentloaded" });
            await this.delay(3000);

            const metadata: CreatorMetadata = {
                platform: "facebook",
                url: profileUrl,
                extractedAt: Date.now(),
            };

            const nameSelectors = [
                'h1',
                '[data-testid="profile-name"]',
                'header h1'
            ];

            for (const selector of nameSelectors) {
                const name = await this.getElementText(page, selector);
                if (name && name.length > 0) {
                    metadata.creator_name = this.cleanText(name);
                    break;
                }
            }

            const bioSelectors = [
                '[data-testid="profile-bio"]',
                '.profile-bio',
                'div[data-testid="profile-info"]'
            ];

            for (const selector of bioSelectors) {
                const bio = await this.getElementText(page, selector);
                if (bio && bio.length > 5) {
                    metadata.creator_bio = this.cleanText(bio);
                    break;
                }
            }

            const followerSelectors = [
                '[data-testid="followers"]',
                'a[href*="/followers"]'
            ];

            for (const selector of followerSelectors) {
                const followerText = await this.getElementText(page, selector);
                if (followerText) {
                    metadata.creator_follower_count = this.parseCount(followerText);
                    break;
                }
            }

            const avatarSelectors = [
                'img[alt*="profile picture"]',
                'img[alt*="Profile picture"]',
                '[data-testid="profile-picture"] img'
            ];

            for (const selector of avatarSelectors) {
                const avatar = await this.getElementAttribute(page, selector, "src");
                if (avatar) {
                    metadata.creator_avatar_url = avatar;
                    break;
                }
            }

            const verifiedSelectors = [
                '[aria-label*="Verified"]',
                '[data-testid="verified-badge"]'
            ];

            for (const selector of verifiedSelectors) {
                const verified = await page.locator(selector).first();
                if (await verified.isVisible({ timeout: 2000 }).catch(() => false)) {
                    metadata.creator_verified = true;
                    break;
                }
            }

            this.logger.log("Successfully extracted Facebook creator metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract Facebook metadata: ${error}`, "error");
            return null;
        }
    }
}

