import { Page } from "playwright";
import { CreatorMetadata } from "../types/index.js";
import { CreatorMetadataScraper } from "./CreatorMetadataScraper.js";
import { Logger } from "../helpers/StringBuilder.js";

export class TwitterScraper extends CreatorMetadataScraper {
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

    async extractMetadata(page: Page, videoUrl: string): Promise<CreatorMetadata | null> {
        try {
            this.logger.log("Extracting Twitter/X creator metadata...", "info");

            const profileUrl = await this.getCreatorProfileUrl(videoUrl);
            if (!profileUrl) {
                this.logger.log("Could not determine Twitter profile URL", "warn");
                return null;
            }

            await page.goto(profileUrl, { waitUntil: "domcontentloaded" });
            await this.delay(3000);

            const metadata: CreatorMetadata = {
                platform: "twitter",
                url: profileUrl,
                extractedAt: Date.now(),
            };

            const usernameMatch = profileUrl.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
            if (usernameMatch) {
                metadata.creator_username = usernameMatch[1];
            }

            const nameSelectors = [
                '[data-testid="UserName"]',
                'h1[data-testid="UserName"]',
                '[data-testid="User-Names"] span',
                'h1'
            ];

            for (const selector of nameSelectors) {
                const name = await this.getElementText(page, selector);
                if (name && !name.startsWith("@")) {
                    metadata.creator_name = this.cleanText(name);
                    break;
                }
            }

            const bioSelectors = [
                '[data-testid="UserDescription"]',
                '[data-testid="UserBio"]',
                '.user-description'
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
                'a[href*="/followers"]',
                '[href*="/followers"] span'
            ];

            for (const selector of followerSelectors) {
                const followerText = await this.getElementText(page, selector);
                if (followerText) {
                    metadata.creator_follower_count = this.parseCount(followerText);
                    break;
                }
            }

            const avatarSelectors = [
                '[data-testid="UserAvatar-Container-"] img',
                'img[alt*="Avatar"]',
                '[data-testid="primaryColumn"] img[src*="pbs.twimg.com"]'
            ];

            for (const selector of avatarSelectors) {
                const avatar = await this.getElementAttribute(page, selector, "src");
                if (avatar && avatar.includes("pbs.twimg.com")) {
                    metadata.creator_avatar_url = avatar;
                    break;
                }
            }

            const verifiedSelectors = [
                '[data-testid="icon-verified"]',
                '[aria-label*="Verified account"]',
                'svg[data-testid="icon-verified"]'
            ];

            for (const selector of verifiedSelectors) {
                const verified = await page.locator(selector).first();
                if (await verified.isVisible({ timeout: 2000 }).catch(() => false)) {
                    metadata.creator_verified = true;
                    break;
                }
            }

            this.logger.log("Successfully extracted Twitter/X creator metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract Twitter metadata: ${error}`, "error");
            return null;
        }
    }
}

