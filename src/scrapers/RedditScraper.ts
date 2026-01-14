import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata } from "../types/index.js";
import { CreatorMetadataScraper } from "./CreatorMetadataScraper.js";
import { Logger } from "../helpers/StringBuilder.js";

export class RedditScraper extends CreatorMetadataScraper {
    async getCreatorProfileUrl(videoUrl: string): Promise<string | null> {
        try {
            return null;
        } catch {
            return null;
        }
    }

    async extractMetadata(page: Page, videoUrl: string): Promise<CreatorMetadata | null> {
        try {
            this.logger.log("Extracting Reddit creator metadata...", "info");

            await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
            await this.delay(3000);

            let username: string | null = null;
            const usernameSelectors = [
                'a[href^="/user/"]',
                'a[href^="/u/"]',
                '[data-testid="post_author_link"]',
                'a.author'
            ];

            for (const selector of usernameSelectors) {
                const link = await this.getElementAttribute(page, selector, "href");
                if (link) {
                    const match = link.match(/\/(?:u|user)\/([^\/\?]+)/);
                    if (match) {
                        username = match[1];
                        break;
                    }
                }
            }

            if (!username) {
                this.logger.log("Could not find Reddit username", "warn");
                return null;
            }

            const profileUrl = `https://www.reddit.com/user/${username}/`;
            await page.goto(profileUrl, { waitUntil: "domcontentloaded" });
            await this.delay(3000);

            const metadata: CreatorMetadata = {
                platform: "reddit",
                url: profileUrl,
                creator_username: username,
                extractedAt: Date.now(),
            };

            metadata.creator_name = username;

            const karmaSelectors = [
                '[data-testid="karma"]',
                '.karma',
                'span[title*="karma"]'
            ];

            const karmaText = await page.evaluate(() => {
                const elements = document.querySelectorAll('*');
                for (const el of elements) {
                    const text = el.textContent || "";
                    if (text.includes("karma") || text.includes("Karma")) {
                        return text;
                    }
                }
                return null;
            });

            if (karmaText) {
                const karmaMatch = karmaText.match(/([\d,]+)/);
                if (karmaMatch) {
                    metadata.creator_follower_count = this.parseCount(karmaMatch[1]);
                }
            }

            const bioSelectors = [
                '[data-testid="user-about"]',
                '.user-about',
                'p[data-testid="user-bio"]'
            ];

            for (const selector of bioSelectors) {
                const bio = await this.getElementText(page, selector);
                if (bio && bio.length > 5) {
                    metadata.creator_bio = this.cleanText(bio);
                    break;
                }
            }

            const avatarSelectors = [
                'img[alt*="avatar"]',
                'img[alt*="snoo"]',
                '[data-testid="user-avatar"] img'
            ];

            for (const selector of avatarSelectors) {
                const avatar = await this.getElementAttribute(page, selector, "src");
                if (avatar) {
                    metadata.creator_avatar_url = avatar;
                    break;
                }
            }

            const verifiedSelectors = [
                '[data-testid="mod-badge"]',
                '[data-testid="admin-badge"]'
            ];

            for (const selector of verifiedSelectors) {
                const verified = await page.locator(selector).first();
                if (await verified.isVisible({ timeout: 2000 }).catch(() => false)) {
                    metadata.creator_verified = true;
                    break;
                }
            }

            this.logger.log("Successfully extracted Reddit creator metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract Reddit metadata: ${error}`, "error");
            return null;
        }
    }

    async extractVideoMetadata(page: Page, videoUrl: string): Promise<VideoMetadata | null> {
        try {
            this.logger.log("Extracting Reddit video metadata...", "info");

            await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
            await this.delay(5000);

            try {
                await page.waitForSelector('shreddit-post, [data-testid="post-container"], article, faceplate-number', { timeout: 5000 });
            } catch (e) {
                this.logger.log("Post container selector not found, continuing anyway", "debug");
            }

            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight / 2);
            });
            await this.delay(2000);
            
            await page.evaluate(() => {
                window.scrollTo(0, 0);
            });
            await this.delay(1000);

            const postIdMatch = videoUrl.match(/\/comments\/([a-z0-9]+)/);
            const postId = postIdMatch ? postIdMatch[1] : null;

            this.logger.log(`Extracted post ID: ${postId || "N/A"}`, "debug");

            const metadata: VideoMetadata = {
                platform: "reddit",
                url: videoUrl,
                extractedAt: Date.now(),
            };

            if (postId) {
                metadata.video_id = postId;
            }

            this.logger.log("Attempting to fetch from Reddit JSON API...", "debug");
            const apiData = await this.fetchFromRedditAPI(page, videoUrl);
            if (apiData) {
                this.logger.log(`Reddit API data: ${JSON.stringify(apiData)}`, "debug");
                if (apiData.like_count !== undefined) metadata.like_count = apiData.like_count;
                if (apiData.comment_count !== undefined) metadata.comment_count = apiData.comment_count;
                if (apiData.view_count !== undefined) metadata.view_count = apiData.view_count;
                if (apiData.timestamp !== undefined) metadata.timestamp = apiData.timestamp;
                if (apiData.caption) metadata.caption = apiData.caption;
                if (apiData.is_video !== undefined) metadata.is_video = apiData.is_video;
                if (apiData.save_count !== undefined) metadata.save_count = apiData.save_count;
                if (apiData.upvote_ratio !== undefined) metadata.upvote_ratio = apiData.upvote_ratio;
                if (apiData.is_self !== undefined) metadata.is_self = apiData.is_self;
                if (apiData.is_gallery !== undefined) metadata.is_gallery = apiData.is_gallery;
                if (apiData.spoiler !== undefined) metadata.spoiler = apiData.spoiler;
                if (apiData.locked !== undefined) metadata.locked = apiData.locked;
                if (apiData.stickied !== undefined) metadata.stickied = apiData.stickied;
                if (apiData.over_18 !== undefined) metadata.over_18 = apiData.over_18;
                if (apiData.link_flair_text) metadata.link_flair_text = apiData.link_flair_text;
                if (apiData.link_flair_css_class) metadata.link_flair_css_class = apiData.link_flair_css_class;
                if (apiData.domain) metadata.domain = apiData.domain;
                if (apiData.selftext_html) metadata.selftext_html = apiData.selftext_html;
                if (apiData.author_fullname) metadata.author_fullname = apiData.author_fullname;
                if (apiData.subreddit_id) metadata.subreddit_id = apiData.subreddit_id;
                if (apiData.thumbnail_height) metadata.thumbnail_height = apiData.thumbnail_height;
                if (apiData.thumbnail_width) metadata.thumbnail_width = apiData.thumbnail_width;
            } else {
                this.logger.log("No data from Reddit API, falling back to embedded JSON...", "debug");
            }

            this.logger.log("Attempting to extract from embedded JSON...", "debug");
            const embeddedData = await this.extractFromEmbeddedJSON(page);
            if (embeddedData) {
                this.logger.log(`Embedded JSON extracted: ${JSON.stringify(embeddedData)}`, "debug");
                if (embeddedData.like_count !== undefined) {
                    metadata.like_count = embeddedData.like_count;
                    this.logger.log(`Like count from JSON: ${embeddedData.like_count}`, "debug");
                }
                if (embeddedData.comment_count !== undefined) {
                    metadata.comment_count = embeddedData.comment_count;
                    this.logger.log(`Comment count from JSON: ${embeddedData.comment_count}`, "debug");
                }
                if (embeddedData.view_count !== undefined) {
                    metadata.view_count = embeddedData.view_count;
                    this.logger.log(`View count from JSON: ${embeddedData.view_count}`, "debug");
                }
                if (embeddedData.timestamp !== undefined) {
                    metadata.timestamp = embeddedData.timestamp;
                    this.logger.log(`Timestamp from JSON: ${new Date(embeddedData.timestamp * 1000).toISOString()}`, "debug");
                }
                if (embeddedData.caption) {
                    metadata.caption = embeddedData.caption;
                    this.logger.log(`Caption from JSON: ${embeddedData.caption.substring(0, 50)}...`, "debug");
                }
                if (embeddedData.hashtags) {
                    metadata.hashtags = embeddedData.hashtags;
                    this.logger.log(`Hashtags from JSON: ${embeddedData.hashtags.join(", ")}`, "debug");
                }
                if (embeddedData.mentions) {
                    metadata.mentions = embeddedData.mentions;
                    this.logger.log(`Mentions from JSON: ${embeddedData.mentions.join(", ")}`, "debug");
                }
                if (embeddedData.is_video !== undefined) {
                    metadata.is_video = embeddedData.is_video;
                    this.logger.log(`Is video from JSON: ${embeddedData.is_video}`, "debug");
                }
                if (embeddedData.save_count !== undefined) {
                    metadata.save_count = embeddedData.save_count;
                    this.logger.log(`Save count (awards) from JSON: ${embeddedData.save_count}`, "debug");
                }
                if (embeddedData.upvote_ratio !== undefined) metadata.upvote_ratio = embeddedData.upvote_ratio;
                if (embeddedData.is_self !== undefined) metadata.is_self = embeddedData.is_self;
                if (embeddedData.is_gallery !== undefined) metadata.is_gallery = embeddedData.is_gallery;
                if (embeddedData.spoiler !== undefined) metadata.spoiler = embeddedData.spoiler;
                if (embeddedData.locked !== undefined) metadata.locked = embeddedData.locked;
                if (embeddedData.stickied !== undefined) metadata.stickied = embeddedData.stickied;
                if (embeddedData.over_18 !== undefined) metadata.over_18 = embeddedData.over_18;
                if (embeddedData.link_flair_text) metadata.link_flair_text = embeddedData.link_flair_text;
                if (embeddedData.link_flair_css_class) metadata.link_flair_css_class = embeddedData.link_flair_css_class;
                if (embeddedData.domain) metadata.domain = embeddedData.domain;
                if (embeddedData.selftext_html) metadata.selftext_html = embeddedData.selftext_html;
                if (embeddedData.author_fullname) metadata.author_fullname = embeddedData.author_fullname;
            } else {
                this.logger.log("No data found in embedded JSON", "debug");
            }

            this.logger.log("Attempting to extract from DOM...", "debug");
            const domData = await this.extractFromDOM(page);
            if (domData) {
                this.logger.log(`DOM extracted: ${JSON.stringify(domData)}`, "debug");
                if (domData.like_count !== undefined && !metadata.like_count) {
                    metadata.like_count = domData.like_count;
                    this.logger.log(`Like count from DOM: ${domData.like_count}`, "debug");
                }
                if (domData.comment_count !== undefined && !metadata.comment_count) {
                    metadata.comment_count = domData.comment_count;
                    this.logger.log(`Comment count from DOM: ${domData.comment_count}`, "debug");
                }
                if (domData.view_count !== undefined && !metadata.view_count) {
                    metadata.view_count = domData.view_count;
                    this.logger.log(`View count from DOM: ${domData.view_count}`, "debug");
                }
                if (domData.caption && !metadata.caption) {
                    metadata.caption = domData.caption;
                    this.logger.log(`Caption from DOM: ${domData.caption.substring(0, 50)}...`, "debug");
                }
                if (domData.hashtags && !metadata.hashtags) {
                    metadata.hashtags = domData.hashtags;
                    this.logger.log(`Hashtags from DOM: ${domData.hashtags.join(", ")}`, "debug");
                }
                if (domData.mentions && !metadata.mentions) {
                    metadata.mentions = domData.mentions;
                    this.logger.log(`Mentions from DOM: ${domData.mentions.join(", ")}`, "debug");
                }
                if (domData.timestamp !== undefined && !metadata.timestamp) {
                    metadata.timestamp = domData.timestamp;
                    this.logger.log(`Timestamp from DOM: ${new Date(domData.timestamp * 1000).toISOString()}`, "debug");
                }
                if (domData.is_video !== undefined) {
                    metadata.is_video = domData.is_video;
                    this.logger.log(`Is video from DOM: ${domData.is_video}`, "debug");
                }
                if (domData.save_count !== undefined && !metadata.save_count) {
                    metadata.save_count = domData.save_count;
                    this.logger.log(`Save count (awards) from DOM: ${domData.save_count}`, "debug");
                }
                if (domData.upvote_ratio !== undefined && metadata.upvote_ratio === undefined) metadata.upvote_ratio = domData.upvote_ratio;
                if (domData.is_self !== undefined && metadata.is_self === undefined) metadata.is_self = domData.is_self;
                if (domData.is_gallery !== undefined && metadata.is_gallery === undefined) metadata.is_gallery = domData.is_gallery;
                if (domData.spoiler !== undefined && metadata.spoiler === undefined) metadata.spoiler = domData.spoiler;
                if (domData.locked !== undefined && metadata.locked === undefined) metadata.locked = domData.locked;
                if (domData.stickied !== undefined && metadata.stickied === undefined) metadata.stickied = domData.stickied;
                if (domData.over_18 !== undefined && metadata.over_18 === undefined) metadata.over_18 = domData.over_18;
                if (domData.link_flair_text && !metadata.link_flair_text) metadata.link_flair_text = domData.link_flair_text;
                if (domData.link_flair_css_class && !metadata.link_flair_css_class) metadata.link_flair_css_class = domData.link_flair_css_class;
                if (domData.domain && !metadata.domain) metadata.domain = domData.domain;
                if (domData.selftext_html && !metadata.selftext_html) metadata.selftext_html = domData.selftext_html;
                if (domData.author_fullname && !metadata.author_fullname) metadata.author_fullname = domData.author_fullname;
                if (domData.subreddit_id && !metadata.subreddit_id) metadata.subreddit_id = domData.subreddit_id;
            } else {
                this.logger.log("No data found in DOM", "debug");
            }

            const subredditMatch = videoUrl.match(/\/r\/([^\/]+)/);
            if (subredditMatch) {
                const subreddit = subredditMatch[1];
                metadata.mentions = metadata.mentions || [];
                if (!metadata.mentions.includes(`r/${subreddit}`)) {
                    metadata.mentions.unshift(`r/${subreddit}`);
                }
                this.logger.log(`Subreddit: r/${subreddit}`, "debug");
            }

            if (metadata.caption) {
                const userMentions = metadata.caption.match(/u\/[\w-]+/g);
                if (userMentions) {
                    metadata.mentions = metadata.mentions || [];
                    for (const mention of userMentions) {
                        if (!metadata.mentions.includes(mention)) {
                            metadata.mentions.push(mention);
                        }
                    }
                    this.logger.log(`User mentions from caption: ${userMentions.join(", ")}`, "debug");
                }
            }

            this.logger.log("=== REDDIT VIDEO METADATA EXTRACTION RESULTS ===", "info");
            this.logger.log(`Post ID: ${metadata.video_id || "N/A"}`, "info");
            this.logger.log(`Like Count (Upvotes): ${metadata.like_count ?? "N/A"}`, "info");
            this.logger.log(`Comment Count: ${metadata.comment_count ?? "N/A"}`, "info");
            this.logger.log(`View Count: ${metadata.view_count ?? "N/A"}`, "info");
            this.logger.log(`Save Count (Awards): ${metadata.save_count ?? "N/A"}`, "info");
            this.logger.log(`Caption: ${metadata.caption ? metadata.caption.substring(0, 80) + "..." : "N/A"}`, "info");
            this.logger.log(`Hashtags: ${metadata.hashtags ? metadata.hashtags.join(", ") : "N/A"}`, "info");
            this.logger.log(`Mentions: ${metadata.mentions ? metadata.mentions.join(", ") : "N/A"}`, "info");
            this.logger.log(`Is Video: ${metadata.is_video !== undefined ? metadata.is_video : "N/A"}`, "info");
            this.logger.log(`Timestamp: ${metadata.timestamp ? new Date(metadata.timestamp * 1000).toISOString() : "N/A"}`, "info");
            this.logger.log("--- Fields yt-dlp CANNOT get ---", "info");
            this.logger.log(`Upvote Ratio: ${metadata.upvote_ratio !== undefined ? metadata.upvote_ratio : "N/A"}`, "info");
            this.logger.log(`Is Self Post: ${metadata.is_self !== undefined ? metadata.is_self : "N/A"}`, "info");
            this.logger.log(`Is Gallery: ${metadata.is_gallery !== undefined ? metadata.is_gallery : "N/A"}`, "info");
            this.logger.log(`Spoiler: ${metadata.spoiler !== undefined ? metadata.spoiler : "N/A"}`, "info");
            this.logger.log(`Locked: ${metadata.locked !== undefined ? metadata.locked : "N/A"}`, "info");
            this.logger.log(`Stickied: ${metadata.stickied !== undefined ? metadata.stickied : "N/A"}`, "info");
            this.logger.log(`Over 18 (NSFW): ${metadata.over_18 !== undefined ? metadata.over_18 : "N/A"}`, "info");
            this.logger.log(`Link Flair: ${metadata.link_flair_text || "N/A"}`, "info");
            this.logger.log(`Domain: ${metadata.domain || "N/A"}`, "info");
            this.logger.log(`Author Fullname: ${metadata.author_fullname || "N/A"}`, "info");
            this.logger.log(`Subreddit ID: ${metadata.subreddit_id || "N/A"}`, "info");
            this.logger.log(`Has Selftext HTML: ${metadata.selftext_html ? "Yes" : "No"}`, "info");
            this.logger.log("=== END REDDIT METADATA ===", "info");
            this.logger.log("Successfully extracted Reddit video metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract Reddit video metadata: ${error}`, "error");
            return null;
        }
    }

    private async fetchFromRedditAPI(page: Page, videoUrl: string): Promise<Partial<VideoMetadata> | null> {
        try {
            const jsonUrl = videoUrl.replace(/\/$/, '') + '.json';
            const response = await page.evaluate(async (url) => {
                try {
                    const res = await fetch(url, {
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    });
                    if (!res.ok) return null;
                    return await res.json();
                } catch {
                    return null;
                }
            }, jsonUrl);

            if (!response || !Array.isArray(response) || response.length === 0) {
                return null;
            }

            const postData = response[0]?.data?.children?.[0]?.data;
            if (!postData) return null;

            const result: any = {};
            
            if (postData.ups !== undefined) result.like_count = postData.ups;
            if (postData.score !== undefined && !result.like_count) result.like_count = postData.score;
            if (postData.num_comments !== undefined) result.comment_count = postData.num_comments;
            if (postData.view_count !== undefined) result.view_count = postData.view_count;
            if (postData.title) result.caption = postData.title;
            if (postData.created_utc) result.timestamp = Math.floor(postData.created_utc);
            if (postData.is_video !== undefined) result.is_video = postData.is_video;
            if (postData.total_awards_received !== undefined) result.save_count = postData.total_awards_received;
            
            if (postData.upvote_ratio !== undefined) result.upvote_ratio = postData.upvote_ratio;
            if (postData.is_self !== undefined) result.is_self = postData.is_self;
            if (postData.is_gallery !== undefined) result.is_gallery = postData.is_gallery;
            if (postData.spoiler !== undefined) result.spoiler = postData.spoiler;
            if (postData.locked !== undefined) result.locked = postData.locked;
            if (postData.stickied !== undefined) result.stickied = postData.stickied;
            if (postData.over_18 !== undefined) result.over_18 = postData.over_18;
            if (postData.link_flair_text) result.link_flair_text = postData.link_flair_text;
            if (postData.link_flair_css_class) result.link_flair_css_class = postData.link_flair_css_class;
            if (postData.domain) result.domain = postData.domain;
            if (postData.selftext_html) result.selftext_html = postData.selftext_html;
            if (postData.author_fullname) result.author_fullname = postData.author_fullname;
            if (postData.subreddit_id) result.subreddit_id = postData.subreddit_id;
            if (postData.thumbnail_height) result.thumbnail_height = postData.thumbnail_height;
            if (postData.thumbnail_width) result.thumbnail_width = postData.thumbnail_width;

            return result;
        } catch (error) {
            this.logger.log(`Failed to fetch from Reddit API: ${error}`, "debug");
            return null;
        }
    }

    private async extractFromEmbeddedJSON(page: Page): Promise<Partial<VideoMetadata> | null> {
        try {
            const data = await page.evaluate(() => {
                const result: any = {};

                if ((window as any).__r) {
                    const redditData = (window as any).__r;
                    if (redditData?.data?.posts?.models) {
                        const post = Object.values(redditData.data.posts.models)[0] as any;
                        if (post) {
                            result.like_count = post.ups || post.score;
                            result.comment_count = post.numComments || post.num_comments || post.commentCount;
                            result.view_count = post.viewCount || post.view_count || post.views;
                            result.caption = post.title || post.titleText;
                            if (post.created || post.createdUTC) {
                                result.timestamp = post.created || post.createdUTC;
                            }
                            if (post.isVideo || post.media?.isVideo) {
                                result.is_video = true;
                            }
                            if (post.awards) {
                                result.save_count = post.awards.totalAwardsReceived || post.awards.total_awards_received || post.totalAwardsReceived;
                            }
                            if (post.selftext) {
                                result.caption = (result.caption || "") + " " + post.selftext;
                            }
                            if (post.upvoteRatio !== undefined) result.upvote_ratio = post.upvoteRatio;
                            if (post.isSelf !== undefined) result.is_self = post.isSelf;
                            if (post.isGallery !== undefined) result.is_gallery = post.isGallery;
                            if (post.spoiler !== undefined) result.spoiler = post.spoiler;
                            if (post.locked !== undefined) result.locked = post.locked;
                            if (post.stickied !== undefined) result.stickied = post.stickied;
                            if (post.over18 !== undefined) result.over_18 = post.over18;
                            if (post.linkFlairText) result.link_flair_text = post.linkFlairText;
                            if (post.linkFlairCssClass) result.link_flair_css_class = post.linkFlairCssClass;
                            if (post.domain) result.domain = post.domain;
                            if (post.selftextHtml) result.selftext_html = post.selftextHtml;
                            if (post.authorFullname) result.author_fullname = post.authorFullname;
                        }
                    }
                }

                const scripts = document.querySelectorAll('script[type="application/json"], script[id*="data"], script');
                for (const script of scripts) {
                    const content = script.textContent || '';
                    if (content.includes('"ups"') || content.includes('"score"') || content.includes('"numComments"')) {
                        try {
                            const json = JSON.parse(content);
                            const findPostData = (obj: any): any => {
                                if (!obj || typeof obj !== 'object') return null;
                                if (obj.ups !== undefined || obj.score !== undefined || obj.numComments !== undefined) {
                                    return obj;
                                }
                                for (const key in obj) {
                                    const found = findPostData(obj[key]);
                                    if (found) return found;
                                }
                                return null;
                            };
                            const post = findPostData(json);
                            if (post) {
                                if (!result.like_count) result.like_count = post.ups || post.score;
                                if (!result.comment_count) result.comment_count = post.numComments || post.num_comments || post.commentCount;
                                if (!result.view_count) result.view_count = post.viewCount || post.view_count || post.views;
                                if (!result.caption) result.caption = post.title || post.titleText;
                                if (!result.timestamp && (post.created || post.createdUTC)) {
                                    result.timestamp = post.created || post.createdUTC;
                                }
                                if ((post.isVideo || post.media?.isVideo) && !result.is_video) {
                                    result.is_video = true;
                                }
                                if (post.awards && !result.save_count) {
                                    result.save_count = post.awards.totalAwardsReceived || post.awards.total_awards_received || post.totalAwardsReceived;
                                }
                                if (post.upvote_ratio !== undefined && !result.upvote_ratio) result.upvote_ratio = post.upvote_ratio;
                                if (post.is_self !== undefined && result.is_self === undefined) result.is_self = post.is_self;
                                if (post.is_gallery !== undefined && result.is_gallery === undefined) result.is_gallery = post.is_gallery;
                                if (post.spoiler !== undefined && result.spoiler === undefined) result.spoiler = post.spoiler;
                                if (post.locked !== undefined && result.locked === undefined) result.locked = post.locked;
                                if (post.stickied !== undefined && result.stickied === undefined) result.stickied = post.stickied;
                                if (post.over_18 !== undefined && result.over_18 === undefined) result.over_18 = post.over_18;
                                if (post.link_flair_text && !result.link_flair_text) result.link_flair_text = post.link_flair_text;
                                if (post.link_flair_css_class && !result.link_flair_css_class) result.link_flair_css_class = post.link_flair_css_class;
                                if (post.domain && !result.domain) result.domain = post.domain;
                                if (post.selftext_html && !result.selftext_html) result.selftext_html = post.selftext_html;
                                if (post.author_fullname && !result.author_fullname) result.author_fullname = post.author_fullname;
                            }
                        } catch (e) {
                            // Try window.__r pattern
                            if (content.includes('window.__r = ')) {
                                try {
                                    const match = content.match(/window\.__r\s*=\s*({.+?});/s);
                                    if (match) {
                                        const json = JSON.parse(match[1]);
                                        const posts = json?.data?.posts?.models;
                                        if (posts) {
                                            const post = Object.values(posts)[0] as any;
                                            if (post) {
                                                if (!result.like_count) result.like_count = post.ups || post.score;
                                                if (!result.comment_count) result.comment_count = post.numComments || post.num_comments || post.commentCount;
                                                if (!result.view_count) result.view_count = post.viewCount || post.view_count || post.views;
                                                if (!result.caption) result.caption = post.title || post.titleText;
                                                if (!result.timestamp && (post.created || post.createdUTC)) {
                                                    result.timestamp = post.created || post.createdUTC;
                                                }
                                                if ((post.isVideo || post.media?.isVideo) && !result.is_video) {
                                                    result.is_video = true;
                                                }
                                                if (post.awards && !result.save_count) {
                                                    result.save_count = post.awards.totalAwardsReceived || post.awards.total_awards_received || post.totalAwardsReceived;
                                                }
                                                if (post.upvoteRatio !== undefined && !result.upvote_ratio) result.upvote_ratio = post.upvoteRatio;
                                                if (post.isSelf !== undefined && result.is_self === undefined) result.is_self = post.isSelf;
                                                if (post.isGallery !== undefined && result.is_gallery === undefined) result.is_gallery = post.isGallery;
                                                if (post.spoiler !== undefined && result.spoiler === undefined) result.spoiler = post.spoiler;
                                                if (post.locked !== undefined && result.locked === undefined) result.locked = post.locked;
                                                if (post.stickied !== undefined && result.stickied === undefined) result.stickied = post.stickied;
                                                if (post.over18 !== undefined && result.over_18 === undefined) result.over_18 = post.over18;
                                                if (post.linkFlairText && !result.link_flair_text) result.link_flair_text = post.linkFlairText;
                                                if (post.linkFlairCssClass && !result.link_flair_css_class) result.link_flair_css_class = post.linkFlairCssClass;
                                                if (post.domain && !result.domain) result.domain = post.domain;
                                                if (post.selftextHtml && !result.selftext_html) result.selftext_html = post.selftextHtml;
                                                if (post.authorFullname && !result.author_fullname) result.author_fullname = post.authorFullname;
                                            }
                                        }
                                    }
                                } catch (e2) {
                                    continue;
                                }
                            } else {
                                continue;
                            }
                        }
                    }
                }

                return result;
            });

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

                const scoreSelectors = [
                    '[data-testid="vote-arrows"] + span',
                    '[data-click-id="upvote"] + span',
                    'button[aria-label*="upvote"] + span',
                    '[class*="vote"] [class*="score"]',
                    '[data-testid="post-score"]',
                    'faceplate-number[number]',
                    '[data-testid="vote-arrows"] faceplate-number',
                    'shreddit-post faceplate-number',
                    '[slot="score"]',
                    'span[slot="score"]'
                ];

                for (const selector of scoreSelectors) {
                    const elements = document.querySelectorAll(selector);
                    for (const el of elements) {
                        const text = (el.textContent || '').trim();
                        const numberAttr = el.getAttribute('number');
                        
                        if (numberAttr) {
                            const num = parseInt(numberAttr);
                            if (num > 0 && num < 100000000) {
                                result.like_count = num;
                                break;
                            }
                        }
                        
                        if (text && /^[\d,]+[KMB]?$/.test(text)) {
                            let num = parseFloat(text.replace(/,/g, '').replace(/[KMB]/i, ''));
                            if (text.includes('K') || text.includes('k')) num *= 1000;
                            else if (text.includes('M') || text.includes('m')) num *= 1000000;
                            else if (text.includes('B') || text.includes('b')) num *= 1000000000;
                            if (num > 0 && num < 100000000) {
                                result.like_count = Math.floor(num);
                                break;
                            }
                        }
                    }
                    if (result.like_count) break;
                }

                if (!result.like_count) {
                    const upvoteSelectors = [
                        '[data-testid="vote-arrows"]',
                        'button[aria-label*="upvote"]',
                        '[aria-label*="upvote"]',
                        'button[aria-label*="Upvote"]',
                        '.vote-button',
                        '[data-click-id="upvote"]'
                    ];

                    for (const selector of upvoteSelectors) {
                        const elements = document.querySelectorAll(selector);
                        for (const el of elements) {
                            const parent = el.closest('[data-testid="post-container"], article, [class*="Post"], shreddit-post');
                            if (parent) {
                                const scoreEl = parent.querySelector('faceplate-number[number], [slot="score"], span[slot="score"]');
                                if (scoreEl) {
                                    const numberAttr = scoreEl.getAttribute('number');
                                    if (numberAttr) {
                                        const num = parseInt(numberAttr);
                                        if (num > 0 && num < 100000000) {
                                            result.like_count = num;
                                            break;
                                        }
                                    }
                                }
                                const scoreText = parent.textContent || '';
                                const scoreMatch = scoreText.match(/([\d,]+[KMB]?)\s*(?:upvotes?|points?|karma)/i);
                                if (scoreMatch) {
                                    let num = parseFloat(scoreMatch[1].replace(/,/g, '').replace(/[KMB]/i, ''));
                                    if (scoreMatch[1].includes('K') || scoreMatch[1].includes('k')) num *= 1000;
                                    else if (scoreMatch[1].includes('M') || scoreMatch[1].includes('m')) num *= 1000000;
                                    else if (scoreMatch[1].includes('B') || scoreMatch[1].includes('b')) num *= 1000000000;
                                    if (num > 0 && num < 100000000) {
                                        result.like_count = Math.floor(num);
                                        break;
                                    }
                                }
                            }
                        }
                        if (result.like_count) break;
                    }
                }

                const commentSelectors = [
                    'shreddit-post a[href*="comments"] faceplate-number[number]',
                    'a[href*="/comments/"] faceplate-number[number]',
                    'a[href*="/comments/"]',
                    'button[aria-label*="comment"]',
                    '[data-testid="comment-count"]',
                    '[slot="comment-count"]'
                ];

                for (const selector of commentSelectors) {
                    const elements = document.querySelectorAll(selector);
                    for (const el of elements) {
                        const isCommentLink = el.tagName === 'A' && el.getAttribute('href')?.includes('/comments/');
                        const hasCommentText = el.textContent?.toLowerCase().includes('comment') || 
                                             el.getAttribute('aria-label')?.toLowerCase().includes('comment');
                        
                        if (!isCommentLink && !hasCommentText) continue;
                        
                        const numberEl = el.querySelector('faceplate-number[number]') || 
                                       (el.tagName === 'FACEPLATE-NUMBER' ? el : null);
                        
                        if (numberEl) {
                            const numberAttr = numberEl.getAttribute('number');
                            if (numberAttr) {
                                const num = parseInt(numberAttr);
                                if (num >= 0 && num < 10000000 && num !== result.like_count) {
                                    result.comment_count = num;
                                    break;
                                }
                            }
                        }
                        
                        const text = (el.textContent || '').trim();
                        const ariaLabel = el.getAttribute('aria-label') || '';
                        const searchText = text || ariaLabel;
                        
                        if (searchText && (searchText.toLowerCase().includes('comment') || /^[\d,]+[KMB]?\s*(comment|comments)?$/i.test(searchText))) {
                            const match = searchText.match(/([\d,]+[KMB]?)/);
                            if (match) {
                                let num = parseFloat(match[1].replace(/,/g, '').replace(/[KMB]/i, ''));
                                const matchText = match[1];
                                if (matchText.includes('K') || matchText.includes('k')) num *= 1000;
                                else if (matchText.includes('M') || matchText.includes('m')) num *= 1000000;
                                else if (matchText.includes('B') || matchText.includes('b')) num *= 1000000000;
                                const finalNum = Math.floor(num);
                                if (finalNum >= 0 && finalNum < 10000000 && finalNum !== result.like_count) {
                                    result.comment_count = finalNum;
                                    break;
                                }
                            }
                        }
                    }
                    if (result.comment_count !== undefined) break;
                }
                
                if (!result.comment_count) {
                    const postContainer = document.querySelector('shreddit-post, [data-testid="post-container"], article');
                    if (postContainer) {
                        const commentButton = postContainer.querySelector('a[href*="/comments/"][href*="#"]') || 
                                            postContainer.querySelector('button[aria-label*="comment"]') ||
                                            postContainer.querySelector('a[href*="/comments/"]');
                        
                        if (commentButton) {
                            const faceplateNumber = commentButton.querySelector('faceplate-number[number]') || 
                                                   commentButton.closest('div')?.querySelector('faceplate-number[number]');
                            
                            if (faceplateNumber) {
                                const numberAttr = faceplateNumber.getAttribute('number');
                                if (numberAttr) {
                                    const num = parseInt(numberAttr);
                                    if (num >= 0 && num < 10000000 && num !== result.like_count) {
                                        result.comment_count = num;
                                    }
                                }
                            }
                            
                            if (!result.comment_count) {
                                const text = commentButton.textContent || '';
                                const match = text.match(/([\d,]+[KMB]?)\s*(?:comment|comments)?/i);
                                if (match) {
                                    let num = parseFloat(match[1].replace(/,/g, '').replace(/[KMB]/i, ''));
                                    if (match[1].includes('K') || match[1].includes('k')) num *= 1000;
                                    else if (match[1].includes('M') || match[1].includes('m')) num *= 1000000;
                                    else if (match[1].includes('B') || match[1].includes('b')) num *= 1000000000;
                                    const finalNum = Math.floor(num);
                                    if (finalNum >= 0 && finalNum < 10000000 && finalNum !== result.like_count) {
                                        result.comment_count = finalNum;
                                    }
                                }
                            }
                        }
                    }
                }
                
                if (!result.comment_count) {
                    const voteSection = document.querySelector('[data-testid="vote-arrows"], [data-click-id="upvote"]')?.closest('div')?.parentElement;
                    if (voteSection) {
                        const commentButton = voteSection.querySelector('a[href*="/comments/"]:not([href*="/comment/"])');
                        if (commentButton) {
                            const faceplate = commentButton.querySelector('faceplate-number[number]') || 
                                             commentButton.parentElement?.querySelector('faceplate-number[number]');
                            if (faceplate) {
                                const num = parseInt(faceplate.getAttribute('number') || '0');
                                if (num > 0 && num < 10000000 && num !== result.like_count) {
                                    result.comment_count = num;
                                }
                            }
                            
                            if (!result.comment_count) {
                                const text = commentButton.textContent || '';
                                const match = text.match(/([\d,]+[KMB]?)/);
                                if (match) {
                                    let num = parseFloat(match[1].replace(/,/g, '').replace(/[KMB]/i, ''));
                                    if (match[1].includes('K') || match[1].includes('k')) num *= 1000;
                                    else if (match[1].includes('M') || match[1].includes('m')) num *= 1000000;
                                    else if (match[1].includes('B') || match[1].includes('b')) num *= 1000000000;
                                    const finalNum = Math.floor(num);
                                    if (finalNum > 0 && finalNum < 10000000 && finalNum !== result.like_count) {
                                        result.comment_count = finalNum;
                                    }
                                }
                            }
                        }
                    }
                }
                
                if (!result.comment_count) {
                    const firstFaceplate = document.querySelector('faceplate-number[number]');
                    if (firstFaceplate) {
                        const firstNum = parseInt(firstFaceplate.getAttribute('number') || '0');
                        const allFaceplates = Array.from(document.querySelectorAll('faceplate-number[number]'));
                        for (const fp of allFaceplates) {
                            const num = parseInt(fp.getAttribute('number') || '0');
                            if (num > 0 && num < 10000000 && num !== result.like_count && num !== firstNum) {
                                const nearbyText = fp.parentElement?.textContent?.toLowerCase() || '';
                                if (nearbyText.includes('comment') || nearbyText.match(/\d+\s*(comment|comments)/)) {
                                    result.comment_count = num;
                                    break;
                                }
                            }
                        }
                    }
                }

                const viewSelectors = [
                    '[data-testid="view-count"]',
                    'span[title*="view"]',
                    '[aria-label*="view"]'
                ];

                for (const selector of viewSelectors) {
                    const el = document.querySelector(selector);
                    if (el) {
                        const text = (el.textContent || '').trim();
                        const title = el.getAttribute('title') || '';
                        const searchText = text || title;
                        
                        if (searchText && searchText.toLowerCase().includes('view')) {
                            const match = searchText.match(/([\d,]+[KMB]?)/);
                            if (match) {
                                let num = parseFloat(match[1].replace(/,/g, '').replace(/[KMB]/i, ''));
                                const matchText = match[1];
                                if (matchText.includes('K') || matchText.includes('k')) num *= 1000;
                                else if (matchText.includes('M') || matchText.includes('m')) num *= 1000000;
                                else if (matchText.includes('B') || matchText.includes('b')) num *= 1000000000;
                                result.view_count = Math.floor(num);
                                break;
                            }
                        }
                    }
                }

                const titleSelectors = [
                    '[data-testid="post-content"] h1',
                    'h1[data-testid="post-title"]',
                    'h1',
                    '[data-click-id="body"] h1',
                    'article h1'
                ];

                for (const selector of titleSelectors) {
                    const el = document.querySelector(selector);
                    if (el) {
                        const text = (el.textContent || '').trim();
                        if (text && text.length > 0) {
                            result.caption = text;
                            const hashtags = text.match(/#\w+/g);
                            if (hashtags) {
                                result.hashtags = hashtags.map((h: string) => h.substring(1));
                            }
                            break;
                        }
                    }
                }

                const timeSelectors = [
                    '[data-testid="post-timestamp"]',
                    'time',
                    '[title*="ago"]',
                    '[aria-label*="ago"]'
                ];

                for (const selector of timeSelectors) {
                    const el = document.querySelector(selector);
                    if (el) {
                        const datetime = el.getAttribute('datetime') || el.getAttribute('title') || '';
                        if (datetime) {
                            const date = new Date(datetime);
                            if (!isNaN(date.getTime())) {
                                result.timestamp = Math.floor(date.getTime() / 1000);
                                break;
                            }
                        }
                        
                        const text = (el.textContent || '').trim();
                        if (text && text.includes('ago')) {
                            const now = Date.now();
                            const hoursAgo = text.match(/(\d+)\s*hour/i);
                            const daysAgo = text.match(/(\d+)\s*day/i);
                            const monthsAgo = text.match(/(\d+)\s*month/i);
                            const yearsAgo = text.match(/(\d+)\s*year/i);
                            
                            let timestamp = now;
                            if (yearsAgo) timestamp -= parseInt(yearsAgo[1]) * 365 * 24 * 60 * 60 * 1000;
                            else if (monthsAgo) timestamp -= parseInt(monthsAgo[1]) * 30 * 24 * 60 * 60 * 1000;
                            else if (daysAgo) timestamp -= parseInt(daysAgo[1]) * 24 * 60 * 60 * 1000;
                            else if (hoursAgo) timestamp -= parseInt(hoursAgo[1]) * 60 * 60 * 1000;
                            
                            result.timestamp = Math.floor(timestamp / 1000);
                            break;
                        }
                    }
                }

                const shredditPost = document.querySelector('shreddit-post');
                if (shredditPost) {
                    const postType = shredditPost.getAttribute('post-type');
                    const contentHref = shredditPost.getAttribute('content-href') || '';
                    const isVideoPost = postType === 'video' || 
                                       contentHref.includes('v.redd.it') ||
                                       shredditPost.querySelector('shreddit-player, shreddit-player-2') !== null;
                    const isImagePost = postType === 'image' || 
                                       shredditPost.querySelector('shreddit-aspect-ratio img, gallery-carousel') !== null;
                    const isGallery = postType === 'gallery' || shredditPost.querySelector('gallery-carousel') !== null;
                    
                    if (isVideoPost) {
                        result.is_video = true;
                    } else if (isImagePost || isGallery) {
                        result.is_video = false;
                    }
                    
                    if (isGallery) result.is_gallery = true;
                    if (postType === 'self' || postType === 'text') result.is_self = true;
                    else if (postType === 'link' || postType === 'video' || postType === 'image') result.is_self = false;
                    
                    const hasSpoiler = shredditPost.hasAttribute('spoiler') || 
                                      shredditPost.getAttribute('is-spoiler') === 'true' ||
                                      shredditPost.querySelector('[slot="spoiler-tag"]') !== null;
                    result.spoiler = hasSpoiler;
                    
                    const isLocked = shredditPost.hasAttribute('locked') || 
                                    shredditPost.getAttribute('is-locked') === 'true' ||
                                    shredditPost.querySelector('[data-testid="locked-badge"]') !== null;
                    result.locked = isLocked;
                    
                    const isStickied = shredditPost.hasAttribute('stickied') || 
                                      shredditPost.getAttribute('is-stickied') === 'true' ||
                                      shredditPost.getAttribute('pinned') === 'true';
                    result.stickied = isStickied;
                    
                    const isNsfw = shredditPost.hasAttribute('nsfw') || 
                                  shredditPost.hasAttribute('over-18') ||
                                  shredditPost.getAttribute('is-nsfw') === 'true' ||
                                  shredditPost.querySelector('[slot="nsfw-tag"], [data-testid="nsfw-badge"]') !== null;
                    result.over_18 = isNsfw;
                    
                    const flairEl = shredditPost.querySelector('flair-tag, [slot="flair"], shreddit-post-flair, [data-testid="post-flair"]');
                    if (flairEl) {
                        result.link_flair_text = flairEl.textContent?.trim() || undefined;
                    }
                    const flairAttr = shredditPost.getAttribute('link-flair-text') || shredditPost.getAttribute('flair');
                    if (flairAttr && !result.link_flair_text) {
                        result.link_flair_text = flairAttr;
                    }
                    
                    if (contentHref) {
                        try {
                            const url = new URL(contentHref);
                            result.domain = url.hostname;
                        } catch {
                            const domainMatch = contentHref.match(/https?:\/\/([^\/]+)/);
                            if (domainMatch) result.domain = domainMatch[1];
                        }
                    }
                    
                    const authorId = shredditPost.getAttribute('author-id');
                    if (authorId) result.author_fullname = authorId;
                    
                    const subredditId = shredditPost.getAttribute('subreddit-id');
                    if (subredditId) result.subreddit_id = subredditId;
                    
                    const scoreAttr = shredditPost.getAttribute('score');
                    const upvoteRatioAttr = shredditPost.getAttribute('upvote-ratio');
                    if (upvoteRatioAttr && !result.upvote_ratio) {
                        result.upvote_ratio = parseFloat(upvoteRatioAttr);
                    }
                }
                
                if (result.is_video === undefined) {
                    const videoElement = document.querySelector('video, [data-testid="video-player"], vreddit-player, shreddit-player');
                    if (videoElement) {
                        result.is_video = true;
                    } else {
                        const postContainer = document.querySelector('shreddit-post, [data-testid="post-container"], article');
                        if (postContainer) {
                            const hasVideo = postContainer.querySelector('video, vreddit-player, [data-testid="video-player"], shreddit-player');
                            if (hasVideo) {
                                result.is_video = true;
                            } else {
                                const hasImage = postContainer.querySelector('img[src*="redd.it"], img[src*="preview"], gallery-carousel');
                                if (hasImage) {
                                    result.is_video = false;
                                }
                            }
                        }
                    }
                }

                const awardSelectors = [
                    '[data-testid="award-count"]',
                    '[aria-label*="award"]',
                    '[title*="award"]'
                ];

                for (const selector of awardSelectors) {
                    const el = document.querySelector(selector);
                    if (el) {
                        const text = (el.textContent || '').trim();
                        const title = el.getAttribute('title') || '';
                        const searchText = text || title;
                        
                        if (searchText && searchText.toLowerCase().includes('award')) {
                            const match = searchText.match(/([\d,]+)/);
                            if (match) {
                                result.save_count = parseInt(match[1].replace(/,/g, ''));
                                break;
                            }
                        }
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

