import { Page } from "playwright";
import { CreatorMetadata, VideoMetadata } from "../types/index.js";
import { CreatorMetadataScraper } from "./CreatorMetadataScraper.js";
import { Logger } from "../helpers/StringBuilder.js";

export class InstagramScraper extends CreatorMetadataScraper {
    async getCreatorProfileUrl(videoUrl: string): Promise<string | null> {
        try {
            return null;
        } catch {
            return null;
        }
    }

    async extractMetadata(page: Page, videoUrl: string): Promise<CreatorMetadata | null> {
        try {
            this.logger.log("Extracting Instagram creator metadata...", "info");

            await page.goto(videoUrl, { waitUntil: "networkidle" });
            await this.delay(3000);

            let username: string | null = null;
            let profileUrl: string | null = null;

            const urlMatch = videoUrl.match(/instagram\.com\/([^\/\?]+)/);
            if (urlMatch && !urlMatch[1].includes('p/') && !urlMatch[1].includes('reel/')) {
                username = urlMatch[1];
                profileUrl = `https://www.instagram.com/${username}/`;
            } else {
                const usernameFromLink = await page.evaluate(() => {
                    const links = document.querySelectorAll('a[href^="/"]');
                    for (const link of links) {
                        const href = link.getAttribute('href');
                        if (href && href.match(/^\/[^\/]+\/$/) && !href.includes('/p/') && !href.includes('/reel/') && !href.includes('/stories/')) {
                            return href.replace(/\//g, '');
                        }
                    }
                    return null;
                });

                if (usernameFromLink) {
                    username = usernameFromLink;
                    profileUrl = `https://www.instagram.com/${username}/`;
                } else {
                    const postUsername = await page.evaluate(() => {
                        const header = document.querySelector('header');
                        if (header) {
                            const link = header.querySelector('a[href^="/"]');
                            if (link) {
                                const href = link.getAttribute('href');
                                if (href && !href.includes('/p/') && !href.includes('/reel/')) {
                                    return href.replace(/\//g, '');
                                }
                            }
                        }
                        return null;
                    });

                    if (postUsername) {
                        username = postUsername;
                        profileUrl = `https://www.instagram.com/${username}/`;
                    }
                }
            }

            if (!username || !profileUrl) {
                this.logger.log("Could not find Instagram username", "warn");
                return null;
            }

            this.logger.log(`Found username: ${username}`, "debug");
            
            if (!page.url().includes('instagram.com')) {
                this.logger.log("Waiting for manual login if needed...", "info");
                await this.delay(10000);
            }
            
            await page.goto(profileUrl, { waitUntil: "networkidle" });
            await this.delay(5000);
            
            try {
                await page.waitForSelector('header, main, article', { timeout: 5000 });
            } catch {
                // Continue if timeout
            }
            
            const pageContent = await page.evaluate(() => {
                return document.body.innerText || document.body.textContent || '';
            });
            
            if (pageContent.includes('Log in') || pageContent.includes('Sign up')) {
                this.logger.log("Instagram may require login to view profile details", "warn");
            }

            const metadata: CreatorMetadata = {
                platform: "instagram",
                url: profileUrl,
                creator_username: username,
                creator_id: username,
                extractedAt: Date.now(),
            };

            const nameData = await page.evaluate(() => {
                const header = document.querySelector('header');
                if (header) {
                    const h2 = header.querySelector('h2');
                    if (h2) {
                        const text = h2.textContent || '';
                        if (text && !text.includes('Sign up') && !text.includes('Log in')) {
                            return text;
                        }
                    }
                    const spans = header.querySelectorAll('span');
                    for (const span of spans) {
                        const text = span.textContent || '';
                        if (text && text.length > 0 && text.length < 100 && !text.includes('followers') && !text.includes('following') && !text.includes('posts') && !text.includes('Sign up') && !text.includes('Log in')) {
                            return text;
                        }
                    }
                }
                return null;
            });

            if (nameData) {
                metadata.creator_name = this.cleanText(nameData);
            }

            const bioData = await page.evaluate(() => {
                const header = document.querySelector('header');
                if (header) {
                    const sections = header.querySelectorAll('section, div');
                    for (const section of sections) {
                        const spans = section.querySelectorAll('span');
                        for (const span of spans) {
                            const text = span.textContent || '';
                            if (text && text.length > 20 && !text.includes('followers') && !text.includes('following') && !text.includes('posts') && !text.includes('Sign up') && !text.includes('Log in')) {
                                return text;
                            }
                        }
                    }
                }
                return null;
            });

            if (bioData) {
                metadata.creator_bio = this.cleanText(bioData);
            }

            const followerData = await page.evaluate(() => {
                const links = document.querySelectorAll('a');
                for (const link of links) {
                    const href = link.getAttribute('href');
                    const text = (link.textContent || '').trim();
                    if (href && (href.includes('/followers/') || href.includes('followers')) && /[\d.,]+[KMB]?/.test(text)) {
                        return text;
                    }
                }
                
                const header = document.querySelector('header');
                if (header) {
                    const allText = header.textContent || '';
                    const followerMatch = allText.match(/([\d.,]+[KMB]?)\s*followers?/i);
                    if (followerMatch) {
                        return followerMatch[1] + ' followers';
                    }
                }
                return null;
            });

            if (followerData) {
                metadata.creator_follower_count = this.parseCount(followerData);
            }

            const avatarData = await page.evaluate(() => {
                const header = document.querySelector('header');
                if (header) {
                    const images = header.querySelectorAll('img');
                    for (const img of images) {
                        const src = img.src || img.getAttribute('src');
                        const alt = img.getAttribute('alt') || '';
                        if (src && (src.includes('instagram.com') || src.includes('fbcdn.net')) && (alt.includes('profile') || alt.includes('Profile'))) {
                            return src;
                        }
                    }
                }
                
                const profileImages = document.querySelectorAll('img[alt*="profile"], img[alt*="Profile"]');
                for (const img of profileImages) {
                    const imgElement = img as HTMLImageElement;
                    const src = imgElement.src || img.getAttribute('src');
                    if (src && (src.includes('instagram.com') || src.includes('fbcdn.net'))) {
                        return src;
                    }
                }
                return null;
            });

            if (avatarData) {
                metadata.creator_avatar_url = avatarData;
            }

            const verifiedSelectors = [
                '[aria-label*="Verified"]',
                '[aria-label*="verified"]',
                'svg[aria-label*="Verified"]',
                'svg[aria-label*="verified"]',
                '[title*="Verified"]'
            ];

            for (const selector of verifiedSelectors) {
                try {
                    const verified = page.locator(selector).first();
                    if (await verified.isVisible({ timeout: 2000 }).catch(() => false)) {
                        metadata.creator_verified = true;
                        break;
                    }
                } catch {
                    continue;
                }
            }

            if (!metadata.creator_verified) {
                try {
                    const verified = await page.evaluate(() => {
                        const elements = document.querySelectorAll('*');
                        for (const el of elements) {
                            const ariaLabel = el.getAttribute('aria-label');
                            const title = el.getAttribute('title');
                            if ((ariaLabel && ariaLabel.toLowerCase().includes('verified')) || 
                                (title && title.toLowerCase().includes('verified'))) {
                                return true;
                            }
                        }
                        return false;
                    });
                    if (verified) {
                        metadata.creator_verified = true;
                    }
                } catch {
                    // Ignore
                }
            }

            this.logger.log("Successfully extracted Instagram creator metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract Instagram metadata: ${error}`, "error");
            return null;
        }
    }

    async extractVideoMetadata(page: Page, videoUrl: string): Promise<VideoMetadata | null> {
        try {
            this.logger.log("Extracting Instagram video metadata...", "info");

            await page.goto(videoUrl, { waitUntil: "networkidle" });
            await this.delay(3000);

            const metadata: VideoMetadata = {
                platform: "instagram",
                url: videoUrl,
                extractedAt: Date.now(),
            };

            const shortcodeMatch = videoUrl.match(/instagram\.com\/(?:p|reel)\/([^\/\?]+)/);
            if (shortcodeMatch) {
                metadata.shortcode = shortcodeMatch[1];
                metadata.video_id = shortcodeMatch[1];
            }

            const embeddedData = await this.extractFromEmbeddedJSON(page);
            if (embeddedData) {
                if (embeddedData.like_count !== undefined) metadata.like_count = embeddedData.like_count;
                if (embeddedData.comment_count !== undefined) metadata.comment_count = embeddedData.comment_count;
                if (embeddedData.view_count !== undefined) metadata.view_count = embeddedData.view_count;
                if (embeddedData.play_count !== undefined) metadata.play_count = embeddedData.play_count;
                if (embeddedData.timestamp !== undefined) metadata.timestamp = embeddedData.timestamp;
                if (embeddedData.caption) metadata.caption = embeddedData.caption;
                if (embeddedData.hashtags) metadata.hashtags = embeddedData.hashtags;
                if (embeddedData.mentions) metadata.mentions = embeddedData.mentions;
                if (embeddedData.location) metadata.location = embeddedData.location;
                if (embeddedData.music_title) metadata.music_title = embeddedData.music_title;
                if (embeddedData.music_artist) metadata.music_artist = embeddedData.music_artist;
                if (embeddedData.is_carousel !== undefined) metadata.is_carousel = embeddedData.is_carousel;
                if (embeddedData.carousel_media_count !== undefined) metadata.carousel_media_count = embeddedData.carousel_media_count;
                if (embeddedData.is_video !== undefined) metadata.is_video = embeddedData.is_video;
                if (embeddedData.is_photo !== undefined) metadata.is_photo = embeddedData.is_photo;
                if (embeddedData.requiresLogin !== undefined) metadata.requiresLogin = embeddedData.requiresLogin;
            }

            const domData = await this.extractFromDOM(page);
            if (domData) {
                if (domData.like_count !== undefined && !metadata.like_count) metadata.like_count = domData.like_count;
                if (domData.comment_count !== undefined && !metadata.comment_count) metadata.comment_count = domData.comment_count;
                if (domData.view_count !== undefined && !metadata.view_count) metadata.view_count = domData.view_count;
                if (domData.caption && !metadata.caption) metadata.caption = domData.caption;
                if (domData.hashtags && !metadata.hashtags) metadata.hashtags = domData.hashtags;
                if (domData.mentions && !metadata.mentions) metadata.mentions = domData.mentions;
            }

            if (metadata.like_count === undefined && metadata.comment_count === undefined) {
                metadata.requiresLogin = true;
                this.logger.log("Like/comment counts not available - may require login", "warn");
            }

            this.logger.log("Successfully extracted Instagram video metadata", "info");
            return metadata;

        } catch (error) {
            this.logger.log(`Failed to extract Instagram video metadata: ${error}`, "error");
            return null;
        }
    }

    private async extractFromEmbeddedJSON(page: Page): Promise<Partial<VideoMetadata> | null> {
        try {
            const data = await page.evaluate(() => {
                const result: any = {};

                if ((window as any)._sharedData) {
                    const sharedData = (window as any)._sharedData;
                    if (sharedData.entry_data?.PostPage?.[0]?.graphql?.shortcode_media) {
                        const media = sharedData.entry_data.PostPage[0].graphql.shortcode_media;
                        result.like_count = media.edge_media_preview_like?.count;
                        result.comment_count = media.edge_media_to_comment?.count;
                        result.view_count = media.video_view_count;
                        result.play_count = media.video_play_count;
                        result.timestamp = media.taken_at_timestamp;
                        result.caption = media.edge_media_to_caption?.edges?.[0]?.node?.text;
                        result.is_carousel = media.__typename === "GraphSidecar";
                        result.is_video = media.__typename === "GraphVideo";
                        result.is_photo = media.__typename === "GraphImage";
                        
                        if (media.edge_media_to_caption?.edges?.[0]?.node?.text) {
                            const caption = media.edge_media_to_caption.edges[0].node.text;
                            result.hashtags = (caption.match(/#\w+/g) || []).map((h: string) => h.substring(1));
                            result.mentions = (caption.match(/@\w+/g) || []).map((m: string) => m.substring(1));
                        }
                        
                        if (media.location) {
                            result.location = media.location.name;
                            if (media.location.lat && media.location.lng) {
                                result.location_latitude = media.location.lat;
                                result.location_longitude = media.location.lng;
                            }
                        }
                    }
                }

                const scripts = document.querySelectorAll('script[type="application/ld+json"]');
                for (const script of scripts) {
                    try {
                        const json = JSON.parse(script.textContent || '{}');
                        if (json['@type'] === 'VideoObject' || json['@type'] === 'ImageObject') {
                            if (json.interactionStatistic) {
                                for (const stat of json.interactionStatistic) {
                                    if (stat['@type'] === 'LikeAction') {
                                        result.like_count = parseInt(stat.userInteractionCount) || result.like_count;
                                    } else if (stat['@type'] === 'CommentAction') {
                                        result.comment_count = parseInt(stat.userInteractionCount) || result.comment_count;
                                    }
                                }
                            }
                            if (json.caption) result.caption = json.caption;
                        }
                    } catch (e) {
                        continue;
                    }
                }

                const graphqlScripts = document.querySelectorAll('script');
                for (const script of graphqlScripts) {
                    const content = script.textContent || '';
                    if (content.includes('shortcode_media') || content.includes('GraphImage') || content.includes('GraphVideo')) {
                        try {
                            const match = content.match(/window\.__additionalDataLoaded\([^,]+,\s*({.+?})\)/);
                            if (match) {
                                const json = JSON.parse(match[1]);
                                if (json.graphql?.shortcode_media) {
                                    const media = json.graphql.shortcode_media;
                                    if (!result.like_count) result.like_count = media.edge_media_preview_like?.count;
                                    if (!result.comment_count) result.comment_count = media.edge_media_to_comment?.count;
                                    if (!result.view_count) result.view_count = media.video_view_count;
                                    if (!result.caption) result.caption = media.edge_media_to_caption?.edges?.[0]?.node?.text;
                                }
                            }
                        } catch (e) {
                            continue;
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

                const likeButtons = document.querySelectorAll('button, span, a');
                for (const el of likeButtons) {
                    const text = (el.textContent || '').trim();
                    const ariaLabel = el.getAttribute('aria-label') || '';
                    
                    if (ariaLabel.includes('like') || ariaLabel.includes('Like')) {
                        const match = ariaLabel.match(/([\d.,]+[KMB]?)\s*likes?/i) || text.match(/([\d.,]+[KMB]?)/);
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
                }

                const commentButtons = document.querySelectorAll('button, span, a');
                for (const el of commentButtons) {
                    const text = (el.textContent || '').trim();
                    const ariaLabel = el.getAttribute('aria-label') || '';
                    
                    if (ariaLabel.includes('comment') || ariaLabel.includes('Comment')) {
                        const match = ariaLabel.match(/([\d.,]+[KMB]?)\s*comments?/i) || text.match(/([\d.,]+[KMB]?)/);
                        if (match) {
                            const count = match[1].replace(/,/g, '');
                            let num = parseFloat(count);
                            if (count.includes('K') || count.includes('k')) num *= 1000;
                            else if (count.includes('M') || count.includes('m')) num *= 1000000;
                            else if (count.includes('B') || count.includes('b')) num *= 1000000000;
                            result.comment_count = Math.floor(num);
                            break;
                        }
                    }
                }

                const viewElements = document.querySelectorAll('span, div');
                for (const el of viewElements) {
                    const text = (el.textContent || '').trim();
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

                const article = document.querySelector('article');
                if (article) {
                    const spans = article.querySelectorAll('span');
                    for (const span of spans) {
                        const text = span.textContent || '';
                        if (text.length > 20 && text.length < 2000 && !text.includes('Like') && !text.includes('Comment') && !text.includes('Share')) {
                            if (!result.caption) {
                                result.caption = text.trim();
                            }
                            
                            const hashtags = text.match(/#\w+/g);
                            if (hashtags && hashtags.length > 0) {
                                result.hashtags = hashtags.map(h => h.substring(1));
                            }
                            
                            const mentions = text.match(/@\w+/g);
                            if (mentions && mentions.length > 0) {
                                result.mentions = mentions.map(m => m.substring(1));
                            }
                        }
                    }
                }

                const carouselIndicators = document.querySelectorAll('[role="button"][aria-label*="carousel"], [aria-label*="Carousel"]');
                if (carouselIndicators.length > 0) {
                    result.is_carousel = true;
                    result.carousel_media_count = carouselIndicators.length;
                }

                const videoElement = document.querySelector('video');
                if (videoElement) {
                    result.is_video = true;
                } else {
                    const images = document.querySelectorAll('article img');
                    if (images.length > 0) {
                        result.is_photo = true;
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

