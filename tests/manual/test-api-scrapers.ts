import { CreatorMetadataManager } from "../../src/scrapers/CreatorMetadataManager";
import { RedditApiScraper } from "../../src/scrapers/api/RedditApiScraper";
import { Logger } from "../../src/helpers/StringBuilder";
import { BrowserType } from "../../src/types/index";
import type { RedditScrapeResult } from "../../src/types/index";

interface TestResult {
    url: string;
    platform: string;
    mode: string;
    success: boolean;
    usedApi: boolean;
    usedLocal: boolean;
    metadata: any;
    error?: string;
    duration: number;
}

const mockInvokeEvent = {
    sender: {
        send: (id: string, data: any) => {
            if (data.data) {
                console.log(`[${id}] ${data.data}`);
            }
        },
    },
};

function displayRedditResult(result: RedditScrapeResult) {
    console.log("\n[REDDIT FULL RESULT]");
    console.log("  url:", result.url);
    if (result._id) console.log("  _id:", result._id);
    console.log("  scrape_status:", result.scrape_status);
    const d = result.data;
    console.log("\n  [data]");
    if (d.title != null) console.log("    title:", d.title);
    if (d.content != null && d.content !== "") console.log("    content:", d.content.slice(0, 200) + (d.content.length > 200 ? "..." : ""));
    if (d.authors != null) console.log("    authors:", Array.isArray(d.authors) ? d.authors.join(", ") : d.authors);
    if (d.publish_date != null) console.log("    publish_date:", d.publish_date);
    if (d.attachments != null) {
        const a = d.attachments;
        console.log("    attachments:");
        if (a.photos?.length) console.log("      photos:", a.photos.length);
        if (a.embedded_link?.length) console.log("      embedded_link:", a.embedded_link);
        if (a.video?.length) console.log("      video:", a.video);
        if (a.gif?.length) console.log("      gif:", a.gif.length);
        if (a.music?.length) console.log("      music:", a.music.length);
    }
    if (d.organic_traffic != null) console.log("    organic_traffic:", JSON.stringify(d.organic_traffic));
    if (d.engagements != null) {
        console.log("    engagements:", JSON.stringify(d.engagements));
    }
    if (d.reach_metrics != null) {
        console.log("    reach_metrics:", JSON.stringify(d.reach_metrics));
    }
    if (d.comments != null) {
        console.log("    comments: count =", d.comments.length);
        d.comments.slice(0, 3).forEach((c, i) => {
            const contentPreview = (c.content ?? "").slice(0, 60);
            console.log(`      [${i}] author: ${c.author}, content: ${contentPreview}${(c.content ?? "").length > 60 ? "..." : ""}`);
        });
        if (d.comments.length > 3) console.log("      ... and", d.comments.length - 3, "more");
    }
    if (d.virality != null) console.log("    virality:", JSON.stringify(d.virality));
    if (result.videoMetadata) {
        const v = result.videoMetadata;
        console.log("\n  [videoMetadata]");
        console.log("    video_id:", v.video_id);
        console.log("    title:", v.title);
        console.log("    caption:", v.caption);
        console.log("    like_count:", v.like_count);
        console.log("    comment_count:", v.comment_count);
        console.log("    view_count:", v.view_count);
        console.log("    share_count:", v.share_count);
        console.log("    timestamp:", v.timestamp);
    }
}

async function testApiScrapers() {
    console.log("=== API Scrapers Test ===\n");
    
    const logger = new Logger("test-api-scrapers", mockInvokeEvent);
    
    const apiBaseUrl = process.env.ML_API_BASE_URL || "https://ondemand-scraper-api.media-meter.in";
    const testMode = process.env.TEST_MODE || "hybrid";
    const platformFilter = process.env.PLATFORM;
    const jobId = process.env.SCRAPER_JOB_ID || process.env.ML_SCRAPER_JOB_ID;
    
    console.log(`API Base URL: ${apiBaseUrl}`);
    console.log(`Test Mode: ${testMode}`);
    console.log(`Platform Filter: ${platformFilter || "all"}`);
    if (jobId) console.log(`Job ID (poll only): ${jobId}`);
    console.log("");
    
    const testUrls: Record<string, string[]> = {
        facebook: [
            "https://www.facebook.com/reel/4402969013312976",
        ],
        twitter: [
            "https://x.com/AKEndfield/status/2019969369565196529",
        ],
        reddit: [
            "https://www.reddit.com/r/ValorantCompetitive/comments/1qybnj9/zynx_hits_superhuman_borderline_impossible/",
        ],
        youtube: [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        ],
        instagram: [
            "https://www.instagram.com/lewishamilton/reel/DT5siczDI-O/",
        ],
    };
    
    const platforms = platformFilter 
        ? [platformFilter.toLowerCase()]
        : Object.keys(testUrls);
    
    const results: TestResult[] = [];
    
    for (const platform of platforms) {
        const urls = testUrls[platform];
        if (!urls) {
            console.log(`Skipping ${platform} - no test URLs configured`);
            continue;
        }
        
        for (const url of urls) {
            console.log(`\n${"=".repeat(60)}`);
            console.log(`Testing: ${platform.toUpperCase()} - ${testMode.toUpperCase()} mode`);
            console.log(`URL: ${url}`);
            console.log("=".repeat(60));
            
            const startTime = Date.now();
            
            try {
                const config: {
                    browserType: BrowserType;
                    browserConfig: { headless: boolean; viewport: { width: number; height: number } };
                    apiConfig: { baseUrl: string; enabled: boolean; timeout: number; retries: number; jobId?: string };
                    scraperMode: 'local' | 'api' | 'hybrid';
                    platformOverrides?: Record<string, 'local' | 'api' | 'hybrid'>;
                } = {
                    browserType: "chromium",
                    browserConfig: {
                        headless: true,
                        viewport: { width: 1920, height: 1080 },
                    },
                    apiConfig: {
                        baseUrl: apiBaseUrl,
                        enabled: true,
                        timeout: 30000,
                        retries: 3,
                        ...(jobId ? { jobId } : {}),
                    },
                    scraperMode: testMode as 'local' | 'api' | 'hybrid',
                };
                if (testMode === 'api') {
                    config.platformOverrides = {
                        youtube: 'api',
                        facebook: 'api',
                        twitter: 'api',
                        reddit: 'api',
                        instagram: 'api',
                    };
                }
                if (testMode === 'hybrid') {
                    config.platformOverrides = {
                        youtube: 'hybrid',
                        facebook: 'hybrid',
                        twitter: 'hybrid',
                        reddit: 'hybrid',
                        instagram: 'hybrid',
                    };
                }

                console.log(`[TEST] Creating manager with config:`, JSON.stringify(config, null, 2));
                const manager = new CreatorMetadataManager(logger as any, config);
                
                const extendedMetadata = await manager.extractExtendedMetadata(url);
                const duration = Date.now() - startTime;
                
                if (extendedMetadata) {
                    const creator = extendedMetadata.creator;
                    const video = extendedMetadata.video;
                    
                    const usedApi = testMode === 'api' || testMode === 'hybrid';
                    const usedLocal = testMode === 'local' || (testMode === 'hybrid' && !extendedMetadata);
                    
                    results.push({
                        url,
                        platform: creator?.platform || video?.platform || platform,
                        mode: testMode,
                        success: true,
                        usedApi,
                        usedLocal,
                        metadata: {
                            creator: creator ? {
                                creator_name: creator.creator_name,
                                creator_username: creator.creator_username,
                                creator_avatar_url: creator.creator_avatar_url,
                                creator_follower_count: creator.creator_follower_count,
                            } : null,
                            video: video ? {
                                video_id: video.video_id,
                                like_count: video.like_count,
                                comment_count: video.comment_count,
                                view_count: video.view_count,
                            } : null,
                        },
                        duration,
                    });
                    
                    console.log("\n[RESULT]");
                    console.log("Status: SUCCESS");
                    console.log(`Duration: ${duration}ms`);
                    console.log(`Mode: ${testMode}`);
                    console.log(`Used API: ${usedApi}`);
                    console.log(`Used Local: ${usedLocal}`);

                    const has = (v: unknown): boolean =>
                        v !== undefined && v !== null && (typeof v !== "string" || v.length > 0) &&
                        (typeof v !== "object" || !Array.isArray(v) || v.length > 0);
                    const fmt = (v: unknown): string => {
                        if (!has(v)) return "";
                        if (typeof v === "string" && v.length > 80) return v.slice(0, 77) + "...";
                        return String(v);
                    };
                    const line = (label: string, value: unknown, formatter?: (x: unknown) => string): void => {
                        const v = formatter ? formatter(value) : (has(value) ? String(value) : "");
                        if (v !== "") console.log(`  ${label}:`, v);
                    };

                    if (creator) {
                        console.log("\n[CREATOR METADATA]");
                        line("creator_id", creator.creator_id);
                        line("Name", creator.creator_name);
                        line("Username", creator.creator_username);
                        line("Followers", creator.creator_follower_count);
                        line("Following", creator.creator_following_count);
                        line("Bio", creator.creator_bio, fmt);
                        if (creator.creator_avatar_url) console.log("  Avatar URL: (set)");
                        line("Profile link", creator.creator_profile_deep_link);
                        if (creator.creator_verified !== undefined) console.log("  Verified:", creator.creator_verified);
                    }

                    if (video) {
                        console.log("\n[VIDEO METADATA]");
                        line("video_id", video.video_id);
                        line("shortcode", video.shortcode);
                        line("Likes", video.like_count);
                        line("Comments", video.comment_count);
                        line("Views", video.view_count);
                        line("Shares", video.share_count);
                        line("Save count", video.save_count);
                        line("Play count", video.play_count);
                        if (video.timestamp) console.log("  Timestamp:", new Date(video.timestamp * 1000).toISOString());
                        line("Caption", video.caption, fmt);
                        line("Description", video.description, fmt);
                        if (Array.isArray(video.hashtags) && video.hashtags.length > 0) console.log("  Hashtags:", video.hashtags.join(", "));
                        if (Array.isArray(video.mentions) && video.mentions.length > 0) console.log("  Mentions:", video.mentions.join(", "));
                        if (Array.isArray(video.thumbnails) && video.thumbnails.length > 0) console.log("  Thumbnails:", video.thumbnails.length);
                        line("Duration (s)", video.duration);
                        if (video.reaction_love_count !== undefined || video.reaction_haha_count !== undefined ||
                            video.reaction_wow_count !== undefined || video.reaction_sad_count !== undefined ||
                            video.reaction_angry_count !== undefined) {
                            console.log("  Reactions - Love:", video.reaction_love_count ?? 0, "Haha:", video.reaction_haha_count ?? 0,
                                "Wow:", video.reaction_wow_count ?? 0, "Sad:", video.reaction_sad_count ?? 0, "Angry:", video.reaction_angry_count ?? 0);
                        }
                        if (video.updated_time !== undefined) console.log("  updated_time:", video.updated_time);
                        if (video.total_video_views_unique !== undefined) console.log("  total_video_views_unique:", video.total_video_views_unique);
                        if (video.live_status) console.log("  live_status:", video.live_status);
                        if (video.content_category) console.log("  content_category:", video.content_category);
                    }

                    if (platform === "reddit") {
                        const redditScraper = new RedditApiScraper(logger, config);
                        const redditResult = await redditScraper.getRedditPostResult(url);
                        if (redditResult) displayRedditResult(redditResult);
                    }
                } else {
                    results.push({
                        url,
                        platform,
                        mode: testMode,
                        success: false,
                        usedApi: testMode === 'api' || testMode === 'hybrid',
                        usedLocal: testMode === 'local' || testMode === 'hybrid',
                        metadata: null,
                        error: "No metadata extracted",
                        duration: Date.now() - startTime,
                    });
                    
                    console.log("\n[RESULT]");
                    console.log("Status: FAILED");
                    console.log("Error: No metadata extracted");
                }
            } catch (error) {
                results.push({
                    url,
                    platform,
                    mode: testMode,
                    success: false,
                    usedApi: testMode === 'api' || testMode === 'hybrid',
                    usedLocal: testMode === 'local' || testMode === 'hybrid',
                    metadata: null,
                    error: error instanceof Error ? error.message : String(error),
                    duration: Date.now() - startTime,
                });
                
                console.log("\n[RESULT]");
                console.log("Status: ERROR");
                console.log("Error:", error instanceof Error ? error.message : String(error));
            }
        }
    }
    
    console.log("\n\n=== Test Summary ===");
    console.log(`Total Tests: ${results.length}`);
    console.log(`Successful: ${results.filter(r => r.success).length}`);
    console.log(`Failed: ${results.filter(r => !r.success).length}`);
    console.log(`\nAverage Duration: ${Math.round(results.reduce((sum, r) => sum + r.duration, 0) / results.length)}ms`);
    
    console.log("\n[By Mode]");
    const byMode = results.reduce((acc, r) => {
        acc[r.mode] = acc[r.mode] || { total: 0, success: 0 };
        acc[r.mode].total++;
        if (r.success) acc[r.mode].success++;
        return acc;
    }, {} as Record<string, { total: number; success: number }>);
    
    for (const [mode, stats] of Object.entries(byMode)) {
        console.log(`  ${mode}: ${stats.success}/${stats.total} (${Math.round(stats.success / stats.total * 100)}%)`);
    }
    
    console.log("\n[By Platform]");
    const byPlatform = results.reduce((acc, r) => {
        acc[r.platform] = acc[r.platform] || { total: 0, success: 0 };
        acc[r.platform].total++;
        if (r.success) acc[r.platform].success++;
        return acc;
    }, {} as Record<string, { total: number; success: number }>);
    
    for (const [platform, stats] of Object.entries(byPlatform)) {
        console.log(`  ${platform}: ${stats.success}/${stats.total} (${Math.round(stats.success / stats.total * 100)}%)`);
    }
    
    return results;
}

testApiScrapers()
    .then((results) => {
        const allSuccess = results.every((r) => r.success);
        if (!allSuccess) {
            console.error("\n⚠️  Some tests failed");
            process.exit(1);
        } else {
            console.log("\n✅ All tests passed");
        }
    })
    .catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
