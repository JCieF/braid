import { CreatorMetadataManager } from "../../src/scrapers/CreatorMetadataManager.js";
import { Logger } from "../../src/helpers/StringBuilder.js";

const mockInvokeEvent = {
    sender: {
        send: (id: string, data: any) => {
            if (data.data) {
                console.log(`[${id}] ${data.data}`);
            }
        },
    },
};

async function testInstagram() {
    console.log("=== Instagram Scraper Test ===\n");
    
    const logger = new Logger("test-instagram", mockInvokeEvent);
    const testUrl = process.argv[2] || "https://www.instagram.com/instagram/";
    const browserType = process.env.BROWSER === "firefox" ? "firefox" : "chromium";
    
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

    if (browserType === "firefox") {
        console.log("Firefox browser will open for Instagram testing.");
        console.log("When the browser opens:");
        console.log("  1. Navigate to instagram.com if needed");
        console.log("  2. Log in to your account");
        console.log("  3. Wait for the scraper to continue\n");
    }

    console.log(`Testing: ${testUrl}\n`);

    try {
        const extendedMetadata = await manager.extractExtendedMetadata(testUrl);

        if (extendedMetadata) {
            const creator = extendedMetadata.creator;
            const video = extendedMetadata.video;

            if (creator) {
                console.log("\n[CREATOR METADATA]");
                console.log("Platform:", creator.platform);
                console.log("Creator Name:", creator.creator_name || "N/A");
                console.log("Username:", creator.creator_username || "N/A");
                console.log("Avatar URL:", creator.creator_avatar_url || "N/A");
                console.log("Bio:", creator.creator_bio ? creator.creator_bio.substring(0, 100) + "..." : "N/A");
                console.log("Followers:", creator.creator_follower_count || "N/A");
                console.log("Verified:", creator.creator_verified || false);
            }

            if (video) {
                console.log("\n[VIDEO METADATA]");
                console.log("Video ID:", video.video_id || "N/A");
                console.log("Like Count:", video.like_count || "N/A");
                console.log("Comment Count:", video.comment_count || "N/A");
                console.log("View Count:", video.view_count || "N/A");
                console.log("Share Count:", video.share_count || "N/A");
                console.log("Save Count:", video.save_count || "N/A");
                console.log("Caption:", video.caption ? video.caption.substring(0, 100) + "..." : "N/A");
                console.log("Hashtags:", video.hashtags ? video.hashtags.join(", ") : "N/A");
                console.log("Mentions:", video.mentions ? video.mentions.join(", ") : "N/A");
                console.log("Is Video:", video.is_video !== undefined ? video.is_video : "N/A");
                console.log("Timestamp:", video.timestamp ? new Date(video.timestamp * 1000).toISOString() : "N/A");
                console.log("Requires Login:", video.requiresLogin || false);
            }

            console.log("\n=== Instagram Test: SUCCESS ===");
        } else {
            console.log("\n=== Instagram Test: FAILED (No metadata) ===");
            process.exit(1);
        }
    } catch (error) {
        console.error("\n=== Instagram Test: ERROR ===");
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

testInstagram().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});

