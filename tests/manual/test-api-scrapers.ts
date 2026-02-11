import { CreatorMetadataManager } from "../../src/scrapers/CreatorMetadataManager";
import { Logger } from "../../src/helpers/StringBuilder";
import { BrowserType } from "../../src/types/index";

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

async function testApiScrapers() {
    console.log("=== API Scrapers Test ===\n");
    
    const logger = new Logger("test-api-scrapers", mockInvokeEvent);
    
    const apiBaseUrl = process.env.ML_API_BASE_URL || "https://ondemand-scraper-api.media-meter.in";
    const testMode = process.env.TEST_MODE || "hybrid";
    const platformFilter = process.env.PLATFORM;
    
    console.log(`API Base URL: ${apiBaseUrl}`);
    console.log(`Test Mode: ${testMode}`);
    console.log(`Platform Filter: ${platformFilter || "all"}\n`);
    
    const testUrls: Record<string, string[]> = {
        facebook: [
            "https://www.facebook.com/reel/4402969013312976",
            "https://www.facebook.com/watch?v=1234567890",
        ],
        twitter: [
            "https://twitter.com/user/status/1234567890",
            "https://x.com/user/status/1234567890",
        ],
        reddit: [
            "https://www.reddit.com/r/videos/comments/example/",
            "https://www.reddit.com/user/example",
        ],
        youtube: [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        ],
        instagram: [
            "https://www.instagram.com/p/ABC123/",
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
                    apiConfig: { baseUrl: string; enabled: boolean; timeout: number; retries: number };
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
                    },
                    scraperMode: testMode as 'local' | 'api' | 'hybrid',
                };
                if (testMode === 'api') {
                    config.platformOverrides = {
                        youtube: 'api',
                        facebook: 'api',
                        twitter: 'api',
                        reddit: 'api',
                    };
                }
                if (testMode === 'hybrid') {
                    config.platformOverrides = {
                        youtube: 'hybrid',
                        facebook: 'hybrid',
                        twitter: 'hybrid',
                        reddit: 'hybrid',
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
                    
                    if (creator) {
                        console.log("\n[CREATOR METADATA]");
                        console.log("Name:", creator.creator_name ?? "N/A");
                        console.log("Username:", creator.creator_username ?? "N/A");
                        const followers = creator.creator_follower_count;
                        console.log("Followers:", followers !== undefined && followers !== null ? followers : "N/A");
                    }
                    
                    if (video) {
                        console.log("\n[VIDEO METADATA]");
                        console.log("Video ID:", video.video_id ?? "N/A");
                        const likes = video.like_count;
                        const comments = video.comment_count;
                        const views = video.view_count;
                        console.log("Likes:", likes !== undefined && likes !== null ? likes : "N/A");
                        console.log("Comments:", comments !== undefined && comments !== null ? comments : "N/A");
                        console.log("Views:", views !== undefined && views !== null ? views : "N/A");
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
