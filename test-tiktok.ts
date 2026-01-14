import { CreatorMetadataManager } from "./src/scrapers/CreatorMetadataManager.js";
import { Logger } from "./src/helpers/StringBuilder.js";

const mockInvokeEvent = {
    sender: {
        send: (id: string, data: any) => {
            if (data.data) {
                console.log(`[${id}] ${data.data}`);
            }
        },
    },
};

async function testTikTok() {
    console.log("=== TikTok Scraper Test ===\n");
    
    const logger = new Logger("test-tiktok", mockInvokeEvent);
    const testUrl = process.argv[2] || "https://www.tiktok.com/@coelhogigantedoisirmaos/video/7586447968316804372?is_from_webapp=1&sender_device=pc";
    
    const manager = new CreatorMetadataManager(logger, {
        browserType: "chromium",
        browserConfig: {
            headless: false,
            viewport: { width: 1920, height: 1080 },
        },
    });

    console.log(`Testing: ${testUrl}\n`);

    try {
        const extendedMetadata = await manager.extractExtendedMetadata(testUrl);

        if (extendedMetadata) {
            const creator = extendedMetadata.creator;
            const video = extendedMetadata.video;

            if (creator) {
                console.log("\n[CREATOR METADATA]");
                console.log("Username:", creator.creator_username || "false");
                console.log("Name:", creator.creator_name || "false");
                console.log("Avatar URL:", creator.creator_avatar_url || "false");
                console.log("Bio:", creator.creator_bio || "false");
                console.log("Followers:", creator.creator_follower_count || "false");
                console.log("Verified:", creator.creator_verified === true ? "true" : "false");
            }

            if (video) {
                console.log("\n[VIDEO METADATA]");
                console.log("Video ID:", video.video_id || "N/A");
                console.log("Embed Link:", video.embed_link || "N/A");
                console.log("Hashtags:", video.hashtags && Array.isArray(video.hashtags) && video.hashtags.length > 0 ? video.hashtags.join(", ") : "false");
                const effectIdsDisplay = video.effect_ids 
                    ? (Array.isArray(video.effect_ids) && video.effect_ids.length > 0 
                        ? video.effect_ids.join(", ") 
                        : String(video.effect_ids))
                    : "false";
                console.log("Effect IDs:", effectIdsDisplay);
                console.log("Music ID:", video.music_id || "false");
                console.log("Playlist ID:", video.playlist_id || "false");
                console.log("Voice to Text:", video.voice_to_text || "false");
                console.log("Region Code:", video.region_code || "false");
            }

            console.log("\n=== TikTok Test: SUCCESS ===");
        } else {
            console.log("\n=== TikTok Test: FAILED (No metadata) ===");
            process.exit(1);
        }
    } catch (error) {
        console.error("\n=== TikTok Test: ERROR ===");
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

testTikTok().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});

