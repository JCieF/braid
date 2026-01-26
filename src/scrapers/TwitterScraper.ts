import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata } from "../types/index.js";
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

            const followingSelectors = [
                '[data-testid="following"]',
                'a[href*="/following"]',
                '[href*="/following"] span'
            ];

            for (const selector of followingSelectors) {
                const followingText = await this.getElementText(page, selector);
                if (followingText) {
                    metadata.creator_following_count = this.parseCount(followingText);
                    break;
                }
            }

            const tweetCountSelectors = [
                '[data-testid="tweetCount"]',
                'a[href*="/statuses"]',
                '[href*="/statuses"] span'
            ];

            for (const selector of tweetCountSelectors) {
                const tweetCountText = await this.getElementText(page, selector);
                if (tweetCountText) {
                    metadata.creator_tweet_count = this.parseCount(tweetCountText);
                    break;
                }
            }

            const locationSelectors = [
                '[data-testid="UserLocation"]',
                '[data-testid="UserProfileHeader_Items"] span',
                '.user-location'
            ];

            for (const selector of locationSelectors) {
                const location = await this.getElementText(page, selector);
                if (location && location.length > 2 && !location.includes('·')) {
                    metadata.creator_location = this.cleanText(location);
                    break;
                }
            }

            const joinedDateSelectors = [
                '[data-testid="UserJoinDate"]',
                '[data-testid="UserProfileHeader_Items"] time'
            ];

            for (const selector of joinedDateSelectors) {
                const dateElement = await page.locator(selector).first();
                if (await dateElement.isVisible({ timeout: 2000 }).catch(() => false)) {
                    const dateText = await dateElement.getAttribute('datetime') || await dateElement.textContent();
                    if (dateText) {
                        const date = new Date(dateText);
                        if (!isNaN(date.getTime())) {
                            metadata.creator_created_at = Math.floor(date.getTime() / 1000);
                            break;
                        }
                    }
                }
            }

            this.logger.log("Successfully extracted Twitter/X creator metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract Twitter metadata: ${error}`, "error");
            return null;
        }
    }

    async extractVideoMetadata(page: Page, videoUrl: string): Promise<VideoMetadata | null> {
        try {
            this.logger.log("Extracting Twitter/X video metadata...", "info");

            const apiResponses: any[] = [];
            
            const responseHandler = async (response: any) => {
                try {
                    const url = response.url();
                    if (url.includes('api.x.com/graphql') || url.includes('api.twitter.com/graphql') || url.includes('/graphql/')) {
                        try {
                            const json = await response.json().catch(() => null);
                            if (json) {
                                this.logger.log(`Captured GraphQL response: ${url.substring(0, 100)}...`, "debug");
                                apiResponses.push(json);
                            }
                        } catch (e) {
                            // Ignore JSON parse errors
                        }
                    }
                } catch (e) {
                    // Ignore response errors
                }
            };
            
            page.on('response', responseHandler);

            await page.goto(videoUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
            
            try {
                await page.waitForResponse((response) => {
                    const url = response.url();
                    return url.includes('api.x.com/graphql') && 
                           (url.includes('TweetResultByRestId') || url.includes('TweetDetail'));
                }, { timeout: 15000 });
            } catch (e) {
                this.logger.log("GraphQL response may not have loaded, continuing anyway", "debug");
            }
            
            await this.delay(5000);

            const metadata: VideoMetadata = {
                platform: "twitter",
                url: videoUrl,
                extractedAt: Date.now(),
            };

            const tweetIdMatch = videoUrl.match(/(?:twitter\.com|x\.com)\/[^\/]+\/status\/(\d+)/);
            if (tweetIdMatch) {
                metadata.video_id = tweetIdMatch[1];
            }

            await this.delay(3000);

            this.logger.log(`Captured ${apiResponses.length} GraphQL API responses`, "debug");
            
            for (const apiResponse of apiResponses) {
                try {
                    const extracted = this.extractFromGraphQLResponse(apiResponse, tweetIdMatch?.[1]);
                    if (extracted && Object.keys(extracted).length > 0) {
                        const extractedKeys = Object.keys(extracted);
                        this.logger.log(`Extracted ${extractedKeys.length} fields from GraphQL: ${extractedKeys.join(", ")}`, "debug");
                        Object.assign(metadata, extracted);
                    }
                } catch (e) {
                    this.logger.log(`Error extracting from GraphQL response: ${e}`, "debug");
                }
            }

            const embeddedData = await this.extractFromEmbeddedJSON(page);
            if (embeddedData) {
                if (embeddedData.like_count !== undefined) metadata.like_count = embeddedData.like_count;
                if (embeddedData.comment_count !== undefined) metadata.comment_count = embeddedData.comment_count;
                if (embeddedData.view_count !== undefined) metadata.view_count = embeddedData.view_count;
                if (embeddedData.share_count !== undefined) metadata.share_count = embeddedData.share_count;
                if (embeddedData.timestamp !== undefined) metadata.timestamp = embeddedData.timestamp;
                if (embeddedData.caption) metadata.caption = embeddedData.caption;
                if (embeddedData.hashtags) metadata.hashtags = embeddedData.hashtags;
                if (embeddedData.mentions) metadata.mentions = embeddedData.mentions;
                if (embeddedData.is_video !== undefined) metadata.is_video = embeddedData.is_video;
                
                // Twitter-specific fields that yt-dlp can't get
                if (embeddedData.context_annotations) metadata.context_annotations = embeddedData.context_annotations;
                if (embeddedData.conversation_id) metadata.conversation_id = embeddedData.conversation_id;
                if (embeddedData.edit_controls) metadata.edit_controls = embeddedData.edit_controls;
                if (embeddedData.edit_history_tweet_ids) metadata.edit_history_tweet_ids = embeddedData.edit_history_tweet_ids;
                if (embeddedData.entities_hashtags) metadata.entities_hashtags = embeddedData.entities_hashtags;
                if (embeddedData.entities_mentions) metadata.entities_mentions = embeddedData.entities_mentions;
                if (embeddedData.entities_urls) metadata.entities_urls = embeddedData.entities_urls;
                if (embeddedData.entities_cashtags) metadata.entities_cashtags = embeddedData.entities_cashtags;
                if (embeddedData.geo) metadata.geo = embeddedData.geo;
                if (embeddedData.in_reply_to_user_id) metadata.in_reply_to_user_id = embeddedData.in_reply_to_user_id;
                if (embeddedData.reply_settings) metadata.reply_settings = embeddedData.reply_settings;
                if (embeddedData.source) metadata.source = embeddedData.source;
                if (embeddedData.withheld) metadata.withheld = embeddedData.withheld;
                if (embeddedData.reply_count !== undefined) metadata.reply_count = embeddedData.reply_count;
                if (embeddedData.quote_count !== undefined) metadata.quote_count = embeddedData.quote_count;
                if (embeddedData.bookmark_count !== undefined) metadata.bookmark_count = embeddedData.bookmark_count;
                if (embeddedData.impression_count !== undefined) metadata.impression_count = embeddedData.impression_count;
                if (embeddedData.media_key) metadata.media_key = embeddedData.media_key;
                if (embeddedData.tweet_language) metadata.tweet_language = embeddedData.tweet_language;
                if (embeddedData.possibly_sensitive !== undefined) metadata.possibly_sensitive = embeddedData.possibly_sensitive;
                if (embeddedData.creator_created_at !== undefined) metadata.creator_created_at = embeddedData.creator_created_at;
                if (embeddedData.creator_description) metadata.creator_description = embeddedData.creator_description;
                if (embeddedData.creator_location) metadata.creator_location = embeddedData.creator_location;
                if (embeddedData.creator_profile_image_url) metadata.creator_profile_image_url = embeddedData.creator_profile_image_url;
                if (embeddedData.creator_protected !== undefined) metadata.creator_protected = embeddedData.creator_protected;
                if (embeddedData.creator_following_count !== undefined) metadata.creator_following_count = embeddedData.creator_following_count;
                if (embeddedData.creator_tweet_count !== undefined) metadata.creator_tweet_count = embeddedData.creator_tweet_count;
                if (embeddedData.creator_listed_count !== undefined) metadata.creator_listed_count = embeddedData.creator_listed_count;
                if (embeddedData.creator_verified !== undefined) metadata.creator_verified = embeddedData.creator_verified;
                if (embeddedData.creator_verified_type) metadata.creator_verified_type = embeddedData.creator_verified_type;
                if (embeddedData.place_full_name) metadata.place_full_name = embeddedData.place_full_name;
                if (embeddedData.place_country) metadata.place_country = embeddedData.place_country;
                if (embeddedData.place_geo) metadata.place_geo = embeddedData.place_geo;
            }

            const domData = await this.extractFromDOM(page);
            if (domData) {
                if (domData.like_count !== undefined && !metadata.like_count) metadata.like_count = domData.like_count;
                if (domData.comment_count !== undefined && !metadata.comment_count) metadata.comment_count = domData.comment_count;
                if (domData.view_count !== undefined && !metadata.view_count) metadata.view_count = domData.view_count;
                if (domData.share_count !== undefined && !metadata.share_count) metadata.share_count = domData.share_count;
                if (domData.caption && !metadata.caption) metadata.caption = domData.caption;
                if (domData.hashtags && !metadata.hashtags) metadata.hashtags = domData.hashtags;
                if (domData.mentions && !metadata.mentions) metadata.mentions = domData.mentions;
                
                // Twitter-specific fields that yt-dlp can't get
                if (domData.reply_count !== undefined && !metadata.reply_count) metadata.reply_count = domData.reply_count;
                if (domData.quote_count !== undefined && !metadata.quote_count) metadata.quote_count = domData.quote_count;
                if (domData.bookmark_count !== undefined && !metadata.bookmark_count) metadata.bookmark_count = domData.bookmark_count;
                if (domData.impression_count !== undefined && !metadata.impression_count) metadata.impression_count = domData.impression_count;
                if (domData.conversation_id && !metadata.conversation_id) metadata.conversation_id = domData.conversation_id;
                if (domData.in_reply_to_user_id && !metadata.in_reply_to_user_id) metadata.in_reply_to_user_id = domData.in_reply_to_user_id;
                if (domData.source && !metadata.source) metadata.source = domData.source;
                if (domData.tweet_language && !metadata.tweet_language) metadata.tweet_language = domData.tweet_language;
                if (domData.possibly_sensitive !== undefined && metadata.possibly_sensitive === undefined) metadata.possibly_sensitive = domData.possibly_sensitive;
            }

            page.off('response', responseHandler);

            this.logger.log("Successfully extracted Twitter/X video metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract Twitter video metadata: ${error}`, "error");
            return null;
        }
    }

    private extractFromGraphQLResponse(response: any, tweetId?: string): Partial<VideoMetadata> | null {
        try {
            const result: any = {};
            
            function extractTweetData(obj: any, path: string = ""): void {
                if (!obj || typeof obj !== 'object') return;
                
                if (Array.isArray(obj)) {
                    for (const item of obj) {
                        extractTweetData(item, path);
                    }
                    return;
                }

                for (const key in obj) {
                    const value = obj[key];
                    
                    if (key === 'legacy' && value && typeof value === 'object') {
                        if (value.conversation_id_str && !result.conversation_id) {
                            result.conversation_id = value.conversation_id_str;
                        }
                        if (value.in_reply_to_user_id_str && !result.in_reply_to_user_id) {
                            result.in_reply_to_user_id = value.in_reply_to_user_id_str;
                        }
                        if (value.source && !result.source) {
                            result.source = value.source;
                        }
                        if (value.lang && !result.tweet_language) {
                            result.tweet_language = value.lang;
                        }
                        if (value.possibly_sensitive !== undefined && result.possibly_sensitive === undefined) {
                            result.possibly_sensitive = Boolean(value.possibly_sensitive);
                        }
                        if (value.reply_settings && !result.reply_settings) {
                            result.reply_settings = value.reply_settings;
                        }
                        if (value.entities && value.entities.hashtags && Array.isArray(value.entities.hashtags) && !result.entities_hashtags) {
                            result.entities_hashtags = value.entities.hashtags;
                        }
                        if (value.entities && value.entities.user_mentions && Array.isArray(value.entities.user_mentions) && !result.entities_mentions) {
                            result.entities_mentions = value.entities.user_mentions;
                        }
                        if (value.entities && value.entities.urls && Array.isArray(value.entities.urls) && !result.entities_urls) {
                            result.entities_urls = value.entities.urls;
                        }
                        if (value.entities && value.entities.symbols && Array.isArray(value.entities.symbols) && !result.entities_cashtags) {
                            result.entities_cashtags = value.entities.symbols;
                        }
                        if (value.geo && !result.geo) {
                            result.geo = value.geo;
                        }
                        if (value.edit_control && !result.edit_controls) {
                            result.edit_controls = {
                                edits_remaining: value.edit_control.edits_remaining,
                                is_edit_eligible: value.edit_control.is_edit_eligible,
                                editable_until: value.edit_control.editable_until
                            };
                        }
                        if (value.edit_control && value.edit_control.edit_tweet_ids && Array.isArray(value.edit_control.edit_tweet_ids) && !result.edit_history_tweet_ids) {
                            result.edit_history_tweet_ids = value.edit_control.edit_tweet_ids;
                        }
                        if (value.context_annotations && Array.isArray(value.context_annotations) && !result.context_annotations) {
                            result.context_annotations = value.context_annotations;
                        }
                        if (value.withheld && !result.withheld) {
                            result.withheld = value.withheld;
                        }
                        if (value.public_metrics && typeof value.public_metrics === 'object') {
                            if (value.public_metrics.reply_count !== undefined && result.reply_count === undefined) {
                                result.reply_count = Number(value.public_metrics.reply_count) || 0;
                            }
                            if (value.public_metrics.quote_count !== undefined && result.quote_count === undefined) {
                                result.quote_count = Number(value.public_metrics.quote_count) || 0;
                            }
                            if (value.public_metrics.bookmark_count !== undefined && result.bookmark_count === undefined) {
                                result.bookmark_count = Number(value.public_metrics.bookmark_count) || 0;
                            }
                            if (value.public_metrics.impression_count !== undefined && result.impression_count === undefined) {
                                result.impression_count = Number(value.public_metrics.impression_count) || 0;
                            }
                        }
                    } else if (key === 'public_metrics' && value && typeof value === 'object') {
                        if (value.reply_count !== undefined && result.reply_count === undefined) {
                            result.reply_count = Number(value.reply_count) || 0;
                        }
                        if (value.quote_count !== undefined && result.quote_count === undefined) {
                            result.quote_count = Number(value.quote_count) || 0;
                        }
                        if (value.bookmark_count !== undefined && result.bookmark_count === undefined) {
                            result.bookmark_count = Number(value.bookmark_count) || 0;
                        }
                        if (value.impression_count !== undefined && result.impression_count === undefined) {
                            result.impression_count = Number(value.impression_count) || 0;
                        }
                    } else if (key === 'media_key' && value && !result.media_key) {
                        result.media_key = String(value);
                    } else if (key === 'media' && Array.isArray(value)) {
                        for (const mediaItem of value) {
                            if (mediaItem.media_key && !result.media_key) {
                                result.media_key = String(mediaItem.media_key);
                            }
                        }
                    } else if (key === 'user' && value && typeof value === 'object') {
                        if (value.legacy) {
                            const userLegacy = value.legacy;
                            if (userLegacy.created_at && !result.creator_created_at) {
                                const date = new Date(userLegacy.created_at);
                                if (!isNaN(date.getTime())) {
                                    result.creator_created_at = Math.floor(date.getTime() / 1000);
                                }
                            }
                            if (userLegacy.description && !result.creator_description) {
                                result.creator_description = userLegacy.description;
                            }
                            if (userLegacy.location && !result.creator_location) {
                                result.creator_location = userLegacy.location;
                            }
                            if (userLegacy.profile_image_url_https && !result.creator_profile_image_url) {
                                result.creator_profile_image_url = userLegacy.profile_image_url_https;
                            }
                            if (userLegacy.protected !== undefined && result.creator_protected === undefined) {
                                result.creator_protected = Boolean(userLegacy.protected);
                            }
                        if (userLegacy.friends_count !== undefined && result.creator_following_count === undefined) {
                            result.creator_following_count = Number(userLegacy.friends_count) || 0;
                        }
                        if (userLegacy.statuses_count !== undefined && result.creator_tweet_count === undefined) {
                            result.creator_tweet_count = Number(userLegacy.statuses_count) || 0;
                        }
                        if (userLegacy.listed_count !== undefined && result.creator_listed_count === undefined) {
                            result.creator_listed_count = Number(userLegacy.listed_count) || 0;
                        }
                    }
                    if (value.verified !== undefined && result.creator_verified === undefined) {
                        result.creator_verified = Boolean(value.verified);
                    }
                    if (value.verified_type && !result.creator_verified_type) {
                        result.creator_verified_type = String(value.verified_type);
                    }
                    if (value.is_blue_verified !== undefined && result.creator_verified === undefined) {
                        result.creator_verified = Boolean(value.is_blue_verified);
                    }
                    if (value.affiliates_highlighted_label && !result.creator_verified_type) {
                        result.creator_verified_type = String(value.affiliates_highlighted_label.label?.userLabelType || '');
                    }
                    } else if (key === 'place' && value && typeof value === 'object') {
                        if (value.full_name && !result.place_full_name) {
                            result.place_full_name = value.full_name;
                        }
                        if (value.country && !result.place_country) {
                            result.place_country = value.country;
                        }
                        if (value.geo && !result.place_geo) {
                            result.place_geo = value.geo;
                        }
                    } else if (key === 'edit_control' && value && typeof value === 'object' && !result.edit_controls) {
                        result.edit_controls = {
                            edits_remaining: value.edits_remaining,
                            is_edit_eligible: value.is_edit_eligible,
                            editable_until: value.editable_until
                        };
                        if (value.edit_tweet_ids && Array.isArray(value.edit_tweet_ids) && !result.edit_history_tweet_ids) {
                            result.edit_history_tweet_ids = value.edit_tweet_ids;
                        }
                    } else if (key === 'context_annotations' && Array.isArray(value) && !result.context_annotations) {
                        result.context_annotations = value;
                    } else if (key === 'withheld' && value && !result.withheld) {
                        result.withheld = value;
                    }
                    
                    if (typeof value === 'object' && value !== null) {
                        extractTweetData(value, path ? `${path}.${key}` : key);
                    }
                }
            }
            
            if (response.data) {
                extractTweetData(response.data);
                
                if (response.data.tweetResult) {
                    if (response.data.tweetResult.result) {
                        extractTweetData(response.data.tweetResult.result);
                        if (response.data.tweetResult.result.legacy) {
                            extractTweetData(response.data.tweetResult.result.legacy);
                        }
                        if (response.data.tweetResult.result.core) {
                            extractTweetData(response.data.tweetResult.result.core);
                        }
                        if (response.data.tweetResult.result.user_results) {
                            extractTweetData(response.data.tweetResult.result.user_results);
                            if (response.data.tweetResult.result.user_results.result) {
                                extractTweetData(response.data.tweetResult.result.user_results.result);
                            }
                        }
                    }
                    if (response.data.tweetResult.result?.quoted_status_result) {
                        extractTweetData(response.data.tweetResult.result.quoted_status_result);
                    }
                }
                if (response.data.user) {
                    extractTweetData(response.data.user);
                }
                if (response.data.user_result && response.data.user_result.result) {
                    extractTweetData(response.data.user_result.result);
                    if (response.data.user_result.result.legacy) {
                        extractTweetData(response.data.user_result.result.legacy);
                    }
                }
            }
            if (response.result) {
                extractTweetData(response.result);
                if (response.result.legacy) {
                    extractTweetData(response.result.legacy);
                }
            }
            if (response.instructions && Array.isArray(response.instructions)) {
                for (const instruction of response.instructions) {
                    if (instruction.entries && Array.isArray(instruction.entries)) {
                        for (const entry of instruction.entries) {
                            if (entry.content && entry.content.itemContent && entry.content.itemContent.tweet_results) {
                                const tweetResult = entry.content.itemContent.tweet_results.result;
                                if (tweetResult) {
                                    extractTweetData(tweetResult);
                                    if (tweetResult.legacy) {
                                        extractTweetData(tweetResult.legacy);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            extractTweetData(response);
            
            return Object.keys(result).length > 0 ? result : null;
        } catch (error) {
            return null;
        }
    }

    private async extractFromEmbeddedJSON(page: Page): Promise<Partial<VideoMetadata> | null> {
        try {
            const data = await page.evaluate(() => {
                const result: any = {};

                function extractTweetData(obj: any, path: string = ""): void {
                    if (!obj || typeof obj !== 'object') return;
                    
                    if (Array.isArray(obj)) {
                        for (const item of obj) {
                            extractTweetData(item, path);
                        }
                        return;
                    }

                    for (const key in obj) {
                        const value = obj[key];
                        const currentPath = path ? `${path}.${key}` : key;

                        if (key === 'conversation_id' || key === 'conversationId') {
                            if (value && !result.conversation_id) {
                                result.conversation_id = String(value);
                            }
                        } else if (key === 'edit_controls' || key === 'editControls') {
                            if (value && typeof value === 'object' && !result.edit_controls) {
                                result.edit_controls = {
                                    edits_remaining: value.edits_remaining || value.editsRemaining,
                                    is_edit_eligible: value.is_edit_eligible || value.isEditEligible,
                                    editable_until: value.editable_until || value.editableUntil
                                };
                            }
                        } else if (key === 'edit_history_tweet_ids' || key === 'editHistoryTweetIds') {
                            if (Array.isArray(value) && !result.edit_history_tweet_ids) {
                                result.edit_history_tweet_ids = value.map(id => String(id));
                            }
                        } else if (key === 'entities' && value && typeof value === 'object') {
                            if (value.hashtags && Array.isArray(value.hashtags) && !result.entities_hashtags) {
                                result.entities_hashtags = value.hashtags;
                            }
                            if (value.user_mentions && Array.isArray(value.user_mentions) && !result.entities_mentions) {
                                result.entities_mentions = value.user_mentions;
                            } else if (value.mentions && Array.isArray(value.mentions) && !result.entities_mentions) {
                                result.entities_mentions = value.mentions;
                            }
                            if (value.urls && Array.isArray(value.urls) && !result.entities_urls) {
                                result.entities_urls = value.urls;
                            }
                            if (value.symbols && Array.isArray(value.symbols) && !result.entities_cashtags) {
                                result.entities_cashtags = value.symbols;
                            }
                        } else if (key === 'context_annotations' || key === 'contextAnnotations') {
                            if (Array.isArray(value) && !result.context_annotations) {
                                result.context_annotations = value;
                            }
                        } else if (key === 'geo' && value && typeof value === 'object') {
                            if (!result.geo) {
                                result.geo = {
                                    place_id: value.place_id || value.placeId,
                                    coordinates: value.coordinates
                                };
                            }
                        } else if (key === 'in_reply_to_user_id' || key === 'inReplyToUserId') {
                            if (value && !result.in_reply_to_user_id) {
                                result.in_reply_to_user_id = String(value);
                            }
                        } else if (key === 'reply_settings' || key === 'replySettings') {
                            if (value && !result.reply_settings) {
                                result.reply_settings = String(value);
                            }
                        } else if (key === 'source') {
                            if (value && !result.source) {
                                result.source = String(value);
                            }
                        } else if (key === 'withheld' && value && typeof value === 'object') {
                            if (!result.withheld) {
                                result.withheld = {
                                    copyright: value.copyright,
                                    country_codes: value.country_codes || value.countryCodes,
                                    scope: value.scope
                                };
                            }
                        } else if (key === 'public_metrics' || key === 'publicMetrics') {
                            if (value && typeof value === 'object') {
                                if (value.reply_count !== undefined && result.reply_count === undefined) {
                                    result.reply_count = Number(value.reply_count || value.replyCount) || 0;
                                }
                                if (value.quote_count !== undefined && result.quote_count === undefined) {
                                    result.quote_count = Number(value.quote_count || value.quoteCount) || 0;
                                }
                                if (value.bookmark_count !== undefined && result.bookmark_count === undefined) {
                                    result.bookmark_count = Number(value.bookmark_count || value.bookmarkCount) || 0;
                                }
                                if (value.impression_count !== undefined && result.impression_count === undefined) {
                                    result.impression_count = Number(value.impression_count || value.impressionCount) || 0;
                                }
                            }
                        } else if (key === 'lang' || key === 'language') {
                            if (value && !result.tweet_language) {
                                result.tweet_language = String(value);
                            }
                        } else if (key === 'possibly_sensitive' || key === 'possiblySensitive') {
                            if (value !== undefined && result.possibly_sensitive === undefined) {
                                result.possibly_sensitive = Boolean(value);
                            }
                        } else if (key === 'media_key' || key === 'mediaKey') {
                            if (value && !result.media_key) {
                                result.media_key = String(value);
                            }
                        }

                        if (typeof value === 'object' && value !== null) {
                            extractTweetData(value, currentPath);
                        }
                    }
                }

                const scripts = document.querySelectorAll('script[type="application/ld+json"]');
                for (const script of scripts) {
                    try {
                        const json = JSON.parse(script.textContent || '{}');
                        if (json['@type'] === 'SocialMediaPosting' || json['@type'] === 'Article') {
                            if (json.interactionStatistic) {
                                for (const stat of json.interactionStatistic) {
                                    if (stat['@type'] === 'LikeAction') {
                                        result.like_count = parseInt(stat.userInteractionCount) || result.like_count;
                                    } else if (stat['@type'] === 'CommentAction') {
                                        result.comment_count = parseInt(stat.userInteractionCount) || result.comment_count;
                                    } else if (stat['@type'] === 'ShareAction') {
                                        result.share_count = parseInt(stat.userInteractionCount) || result.share_count;
                                    }
                                }
                            }
                            if (json.datePublished) {
                                const date = new Date(json.datePublished);
                                result.timestamp = Math.floor(date.getTime() / 1000);
                            }
                            if (json.text || json.headline) {
                                result.caption = json.text || json.headline;
                            }
                        }
                        extractTweetData(json);
                    } catch (e) {
                        continue;
                    }
                }

                const allScripts = document.querySelectorAll('script:not([src])');
                for (const script of allScripts) {
                    const text = script.textContent || '';
                    if (text.length < 100 || text.length > 500000) continue;
                    
                    const searchTerms = [
                        'conversation_id', 'edit_controls', 'context_annotations',
                        'entities', 'public_metrics', 'reply_count', 'quote_count',
                        'bookmark_count', 'impression_count'
                    ];
                    
                    const hasRelevantData = searchTerms.some(term => text.includes(term));
                    if (!hasRelevantData) continue;

                    try {
                        const jsonMatches = text.match(/\{[\s\S]{100,500000}\}/g);
                        if (jsonMatches) {
                            for (const match of jsonMatches) {
                                try {
                                    const json = JSON.parse(match);
                                    extractTweetData(json);
                                } catch (e) {
                                    continue;
                                }
                            }
                        }
                    } catch (e) {
                        continue;
                    }
                }

                try {
                    const win = window;
                    try {
                        if ('__INITIAL_STATE__' in win) {
                            const descriptor = Object.getOwnPropertyDescriptor(win, '__INITIAL_STATE__');
                            if (descriptor && descriptor.value) {
                                extractTweetData(descriptor.value);
                            } else {
                                try {
                                    const value = (win as any).__INITIAL_STATE__;
                                    if (value) extractTweetData(value);
                                } catch (e) {}
                            }
                        }
                    } catch (e) {}
                    
                    try {
                        if ('__NEXT_DATA__' in win) {
                            const descriptor = Object.getOwnPropertyDescriptor(win, '__NEXT_DATA__');
                            if (descriptor && descriptor.value) {
                                extractTweetData(descriptor.value);
                            } else {
                                try {
                                    const value = (win as any).__NEXT_DATA__;
                                    if (value) extractTweetData(value);
                                } catch (e) {}
                            }
                        }
                    } catch (e) {}
                } catch (e) {
                    // Ignore window access errors
                }

                const metaTags = document.querySelectorAll('meta[property], meta[name]');
                for (const meta of metaTags) {
                    const property = meta.getAttribute("property") || meta.getAttribute("name") || "";
                    const content = meta.getAttribute("content") || "";
                    
                    if (property.includes("twitter:description") && !result.caption) {
                        result.caption = content;
                    }
                    if (property.includes("twitter:lang") && !result.tweet_language) {
                        result.tweet_language = content;
                    }
                }

                return result;
            });

            if (data.caption) {
                const hashtags = (data.caption.match(/#\w+/g) || []).map((h: string) => h.substring(1));
                if (hashtags.length > 0) {
                    data.hashtags = hashtags;
                }
                
                const mentions = (data.caption.match(/@\w+/g) || []).map((m: string) => m.substring(1));
                if (mentions.length > 0) {
                    data.mentions = mentions;
                }
            }

            return data;
        } catch (error) {
            this.logger.log(`Failed to extract from embedded JSON: ${error}`, "debug");
            return null;
        }
    }

    private async extractFromDOM(page: Page): Promise<Partial<VideoMetadata> | null> {
        try {
            const data = await page.evaluate(() => {
                const result: any = {};

                const article = document.querySelector('article[data-testid="tweet"]');
                if (!article) {
                    return result;
                }

                const likeButtons = article.querySelectorAll('[data-testid="like"], [aria-label*="like" i]');
                for (const el of likeButtons) {
                    const ariaLabel = el.getAttribute('aria-label') || '';
                    const match = ariaLabel.match(/([\d.,]+[KMB]?)\s*likes?/i);
                    if (match) {
                        const count = match[1].replace(/,/g, '');
                        let num = parseFloat(count);
                        if (count.includes('K') || count.includes('k')) num *= 1000;
                        else if (count.includes('M') || count.includes('m')) num *= 1000000;
                        else if (count.includes('B') || count.includes('b')) num *= 1000000000;
                        result.like_count = Math.floor(num);
                        break;
                    }
                }

                const replyButtons = article.querySelectorAll('[data-testid="reply"], [aria-label*="reply" i], [aria-label*="comment" i]');
                for (const el of replyButtons) {
                    const ariaLabel = el.getAttribute('aria-label') || '';
                    const replyMatch = ariaLabel.match(/([\d.,]+[KMB]?)\s*replies?/i);
                    if (replyMatch) {
                        const count = replyMatch[1].replace(/,/g, '');
                        let num = parseFloat(count);
                        if (count.includes('K') || count.includes('k')) num *= 1000;
                        else if (count.includes('M') || count.includes('m')) num *= 1000000;
                        else if (count.includes('B') || count.includes('b')) num *= 1000000000;
                        result.reply_count = Math.floor(num);
                    }
                    const commentMatch = ariaLabel.match(/([\d.,]+[KMB]?)\s*comments?/i);
                    if (commentMatch) {
                        const count = commentMatch[1].replace(/,/g, '');
                        let num = parseFloat(count);
                        if (count.includes('K') || count.includes('k')) num *= 1000;
                        else if (count.includes('M') || count.includes('m')) num *= 1000000;
                        else if (count.includes('B') || count.includes('b')) num *= 1000000000;
                        result.comment_count = Math.floor(num);
                    }
                    if (result.reply_count || result.comment_count) break;
                }

                const retweetButtons = article.querySelectorAll('[data-testid="retweet"], [aria-label*="repost" i]');
                for (const el of retweetButtons) {
                    const ariaLabel = el.getAttribute('aria-label') || '';
                    const match = ariaLabel.match(/([\d.,]+[KMB]?)\s*(reposts?|retweets?)/i);
                    if (match) {
                        const count = match[1].replace(/,/g, '');
                        let num = parseFloat(count);
                        if (count.includes('K') || count.includes('k')) num *= 1000;
                        else if (count.includes('M') || count.includes('m')) num *= 1000000;
                        else if (count.includes('B') || count.includes('b')) num *= 1000000000;
                        result.share_count = Math.floor(num);
                        break;
                    }
                }

                const quoteButtons = article.querySelectorAll('[data-testid="app-text-transition-container"], [aria-label*="quote" i]');
                for (const el of quoteButtons) {
                    const ariaLabel = el.getAttribute('aria-label') || '';
                    const match = ariaLabel.match(/([\d.,]+[KMB]?)\s*quotes?/i);
                    if (match) {
                        const count = match[1].replace(/,/g, '');
                        let num = parseFloat(count);
                        if (count.includes('K') || count.includes('k')) num *= 1000;
                        else if (count.includes('M') || count.includes('m')) num *= 1000000;
                        else if (count.includes('B') || count.includes('b')) num *= 1000000000;
                        result.quote_count = Math.floor(num);
                        break;
                    }
                }

                const bookmarkButtons = article.querySelectorAll('[data-testid="bookmark"], [aria-label*="bookmark" i]');
                for (const el of bookmarkButtons) {
                    const ariaLabel = el.getAttribute('aria-label') || '';
                    const match = ariaLabel.match(/([\d.,]+[KMB]?)\s*bookmarks?/i);
                    if (match) {
                        const count = match[1].replace(/,/g, '');
                        let num = parseFloat(count);
                        if (count.includes('K') || count.includes('k')) num *= 1000;
                        else if (count.includes('M') || count.includes('m')) num *= 1000000;
                        else if (count.includes('B') || count.includes('b')) num *= 1000000000;
                        result.bookmark_count = Math.floor(num);
                        break;
                    }
                }

                const viewElements = article.querySelectorAll('span');
                for (const el of viewElements) {
                    const text = el.textContent || '';
                    if (text.match(/^[\d.,]+[KMB]?\s*views?$/i)) {
                        const match = text.match(/([\d.,]+[KMB]?)/);
                        if (match) {
                            const count = match[1].replace(/,/g, '');
                            let num = parseFloat(count);
                            if (count.includes('K') || count.includes('k')) num *= 1000;
                            else if (count.includes('M') || count.includes('m')) num *= 1000000;
                            else if (count.includes('B') || count.includes('b')) num *= 1000000000;
                            result.view_count = Math.floor(num);
                            break;
                        }
                    }
                }

                const textSelectors = [
                    '[data-testid="tweetText"]',
                    'div[lang]',
                    'span[lang]'
                ];

                for (const selector of textSelectors) {
                    const textEl = article.querySelector(selector);
                    if (textEl) {
                        const text = textEl.textContent || '';
                        if (text.length > 0 && text.length < 5000) {
                            result.caption = text.trim();
                            
                            const hashtags = text.match(/#\w+/g);
                            if (hashtags && hashtags.length > 0) {
                                result.hashtags = hashtags.map(h => h.substring(1));
                            }
                            
                            const mentions = text.match(/@\w+/g);
                            if (mentions && mentions.length > 0) {
                                result.mentions = mentions.map(m => m.substring(1));
                            }
                            break;
                        }
                    }
                }

                const videoElement = article.querySelector('video');
                if (videoElement) {
                    result.is_video = true;
                }

                const timeElement = article.querySelector('time');
                if (timeElement) {
                    const datetime = timeElement.getAttribute('datetime');
                    if (datetime) {
                        const date = new Date(datetime);
                        result.timestamp = Math.floor(date.getTime() / 1000);
                    }
                }

                const langElement = article.querySelector('[lang]');
                if (langElement) {
                    const lang = langElement.getAttribute('lang');
                    if (lang && !result.tweet_language) {
                        result.tweet_language = lang;
                    }
                }

                const replyLink = article.querySelector('a[href*="/status/"]');
                if (replyLink) {
                    const href = replyLink.getAttribute('href') || '';
                    const replyMatch = href.match(/\/status\/(\d+)/);
                    if (replyMatch && replyMatch[1] !== result.video_id) {
                        result.in_reply_to_user_id = replyMatch[1];
                    }
                }

                const sourceElement = article.querySelector('[data-testid="sourceLabel"]');
                if (sourceElement) {
                    const sourceText = sourceElement.textContent || '';
                    if (sourceText && !result.source) {
                        result.source = sourceText.trim();
                    }
                }

                const sensitiveWarning = article.querySelector('[data-testid="sensitiveMediaWarning"]');
                if (sensitiveWarning) {
                    result.possibly_sensitive = true;
                }

                const conversationLink = article.querySelector('a[href*="/status/"]');
                if (conversationLink) {
                    const href = conversationLink.getAttribute('href') || '';
                    const conversationMatch = href.match(/\/status\/(\d+)/);
                    if (conversationMatch) {
                        result.conversation_id = conversationMatch[1];
                    }
                }

                return result;
            });

            return data;
        } catch (error) {
            this.logger.log(`Failed to extract from DOM: ${error}`, "debug");
            return null;
        }
    }
}

