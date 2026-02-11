import { CreatorMetadataManager } from "../../src/scrapers/CreatorMetadataManager";
import { Logger } from "../../src/helpers/StringBuilder";

interface TestResult {
    url: string;
    platform: string;
    success: boolean;
    metadata: any;
    error?: string;
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

async function testScraper() {
    const logger = new Logger("test-scraper", mockInvokeEvent);
    
    const browserType = process.env.BROWSER === "firefox" ? "firefox" : "chromium";
    const testUrls: string[] = process.env.INSTAGRAM_ONLY === "true" 
        ? ["https://www.instagram.com/instagram/"]
        : [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.instagram.com/instagram/",
            "https://www.reddit.com/r/ChikaPH/comments/1popgpv/dustin_yus_fanservice_is_extreme_in_its_showtime/",
        ];
    
    const browserConfig: any = {
        headless: false,
        viewport: { width: 1920, height: 1080 },
    };
    
    if (process.env.FIREFOX_PROFILE) {
        browserConfig.firefoxUserDataDir = process.env.FIREFOX_PROFILE;
    }
    
    const manager = new CreatorMetadataManager(logger, {
        browserType: browserType as any,
        browserConfig: browserConfig,
    });
    
    if (browserType === "firefox" && testUrls.some(url => url.includes("instagram"))) {
        console.log("\n⚠️  Firefox browser will open for Instagram testing.");
        console.log("   When the browser opens:");
        console.log("   1. Navigate to instagram.com if needed");
        console.log("   2. Log in to your account");
        console.log("   3. Wait 10 seconds for the scraper to continue\n");
        console.log("   (The scraper will wait 10 seconds for you to log in)\n");
    }

    const results: TestResult[] = [];

    for (const url of testUrls) {
        console.log(`\nTesting: ${url}`);
        console.log("---");

        try {
            const extendedMetadata = await manager.extractExtendedMetadata(url);

            if (extendedMetadata) {
                const creator = extendedMetadata.creator;
                const video = extendedMetadata.video;

                results.push({
                    url,
                    platform: creator?.platform || video?.platform || "unknown",
                    success: true,
                    metadata: {
                        creator: creator ? {
                            creator_name: creator.creator_name,
                            creator_username: creator.creator_username,
                            creator_avatar_url: creator.creator_avatar_url,
                            creator_bio: creator.creator_bio,
                            creator_follower_count: creator.creator_follower_count,
                            creator_verified: creator.creator_verified,
                        } : null,
                        video: video ? {
                            video_id: video.video_id,
                            like_count: video.like_count,
                            comment_count: video.comment_count,
                            view_count: video.view_count,
                            share_count: video.share_count,
                            save_count: video.save_count,
                            caption: video.caption ? video.caption.substring(0, 100) + "..." : null,
                            hashtags: video.hashtags,
                            mentions: video.mentions,
                            timestamp: video.timestamp,
                            is_video: video.is_video,
                            requiresLogin: video.requiresLogin,
                            // YouTube-specific fields
                            embeddable: (video as any).embeddable,
                            dimension: (video as any).dimension,
                            projection: (video as any).projection,
                            madeForKids: (video as any).madeForKids,
                            isShort: (video as any).isShort,
                            isLive: (video as any).isLive,
                            isUpcoming: (video as any).isUpcoming,
                            hasCaptions: (video as any).hasCaptions,
                            isUnlisted: (video as any).isUnlisted,
                            isAgeRestricted: (video as any).isAgeRestricted,
                            category: (video as any).category,
                            defaultLanguage: (video as any).defaultLanguage,
                        } : null,
                    },
                });

                const platform = creator?.platform || video?.platform || "unknown";
                
                if (creator) {
                    console.log("\n[CREATOR METADATA]");
                    console.log("Platform:", creator.platform);
                    
                    if (platform === "youtube") {
                        // YouTube: only avatar_url and verified are unique (yt-dlp gets the rest)
                        console.log("Avatar URL:", creator.creator_avatar_url || "N/A");
                        console.log("Verified:", creator.creator_verified ?? "N/A");
                    } else {
                        // Other platforms: show all fields
                        console.log("Creator Name:", creator.creator_name || "N/A");
                        console.log("Username:", creator.creator_username || "N/A");
                        console.log("Avatar URL:", creator.creator_avatar_url || "N/A");
                        console.log("Bio:", creator.creator_bio ? creator.creator_bio.substring(0, 100) + "..." : "N/A");
                        console.log("Followers:", creator.creator_follower_count || "N/A");
                        console.log("Verified:", creator.creator_verified ?? false);
                    }
                }

                if (video) {
                    console.log("\n[VIDEO METADATA]");
                    console.log("Video ID:", video.video_id || "N/A");
                    
                    if (platform === "youtube") {
                        // YouTube: only show fields yt-dlp cannot fully get
                        const ytVideo = video as any;
                        console.log("Mentions:", video.mentions ? video.mentions.join(", ") : "N/A");
                        console.log("Embeddable:", ytVideo.embeddable ?? "N/A");
                        console.log("Dimension:", ytVideo.dimension || "N/A");
                        console.log("Projection:", ytVideo.projection || "N/A");
                        console.log("Made For Kids:", ytVideo.madeForKids ?? "N/A");
                        console.log("Is Short:", ytVideo.isShort ?? "N/A");
                        console.log("Is Live:", ytVideo.isLive ?? "N/A");
                        console.log("Is Upcoming:", ytVideo.isUpcoming ?? "N/A");
                        console.log("Has Captions:", ytVideo.hasCaptions ?? "N/A");
                        console.log("Is Unlisted:", ytVideo.isUnlisted ?? "N/A");
                        console.log("Is Age Restricted:", ytVideo.isAgeRestricted ?? "N/A");
                        console.log("Category:", ytVideo.category || "N/A");
                        console.log("Default Language:", ytVideo.defaultLanguage || "N/A");
                    } else {
                        // Other platforms: show all fields
                        console.log("Like Count:", video.like_count || "N/A");
                        console.log("Comment Count:", video.comment_count || "N/A");
                        console.log("View Count:", video.view_count || "N/A");
                        console.log("Share Count:", video.share_count || "N/A");
                        console.log("Save Count (Awards):", video.save_count || "N/A");
                        console.log("Caption:", video.caption ? video.caption.substring(0, 100) + "..." : "N/A");
                        console.log("Hashtags:", video.hashtags ? video.hashtags.join(", ") : "N/A");
                        console.log("Mentions:", video.mentions ? video.mentions.join(", ") : "N/A");
                        console.log("Is Video:", video.is_video !== undefined ? video.is_video : "N/A");
                        console.log("Timestamp:", video.timestamp ? new Date(video.timestamp * 1000).toISOString() : "N/A");
                        console.log("Requires Login:", video.requiresLogin || false);
                    }
                }
            } else {
                results.push({
                    url,
                    platform: "unknown",
                    success: false,
                    metadata: null,
                    error: "No metadata extracted",
                });
                console.log("Failed: No metadata extracted");
            }
        } catch (error) {
            results.push({
                url,
                platform: "unknown",
                success: false,
                metadata: null,
                error: error instanceof Error ? error.message : String(error),
            });
            console.log("Error:", error instanceof Error ? error.message : String(error));
        }
    }

    console.log("\n=== Test Summary ===");
    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;
    console.log(`Total: ${results.length}`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);

    return results;
}

testScraper()
    .then((results) => {
        const allSuccess = results.every((r) => r.success);
        if (!allSuccess) {
            console.error("Some tests failed");
        }
    })
    .catch((error) => {
        console.error("Fatal error:", error);
    });
