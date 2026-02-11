import { CreatorMetadataManager } from "../../src/scrapers/CreatorMetadataManager";
import { Logger } from "../../src/helpers/StringBuilder";

const mockInvokeEvent = {
    sender: {
        send: (id: string, data: any) => {
            if (data.data) {
                console.log(`[${id}] ${data.data}`);
            }
        },
    },
};

async function testFacebook() {
    console.log("=== Facebook Scraper Test ===\n");
    
    const logger = new Logger("test-facebook", mockInvokeEvent);
    const testUrl = process.argv[2] || "https://www.facebook.com/reel/4402969013312976";
    
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
                console.log("Platform:", creator.platform);
                console.log("Creator Name:", creator.creator_name || "N/A");
                console.log("Username:", creator.creator_username || "N/A");
                console.log("Avatar URL:", creator.creator_avatar_url || "N/A");
                console.log("Bio:", creator.creator_bio ? creator.creator_bio.substring(0, 100) + "..." : "N/A");
                console.log("Followers:", creator.creator_follower_count || "N/A");
                console.log("Verified:", creator.creator_verified || false);
            }

            if (video) {
                console.log("\n[VIDEO METADATA - Fields yt-dlp CANNOT get]");
                console.log("Video ID:", video.video_id || "N/A");
                console.log("Updated Time:", video.updated_time ? new Date(video.updated_time * 1000).toISOString() : "N/A");
                console.log("Content Category:", video.content_category || "N/A");
                console.log("Embed HTML:", video.embed_html ? (video.embed_html.substring(0, 100) + "...") : "N/A");
                console.log("Embeddable:", video.embeddable !== undefined ? video.embeddable : "N/A");
                console.log("Icon:", video.icon || "N/A");
                console.log("Is Crosspost Video:", video.is_crosspost_video !== undefined ? video.is_crosspost_video : "N/A");
                console.log("Is Crossposting Eligible:", video.is_crossposting_eligible !== undefined ? video.is_crossposting_eligible : "N/A");
                console.log("Is Episode:", video.is_episode !== undefined ? video.is_episode : "N/A");
                console.log("Is Instagram Eligible:", video.is_instagram_eligible !== undefined ? video.is_instagram_eligible : "N/A");
                console.log("Live Status:", video.live_status || "N/A");
                console.log("Post Views:", video.post_views ?? "N/A");
                console.log("Premiere Living Room Status:", video.premiere_living_room_status || "N/A");
                console.log("Privacy:", video.privacy || "N/A");
                console.log("Published:", video.published !== undefined ? video.published : "N/A");
                console.log("Status:", video.status || "N/A");
                console.log("Universal Video ID:", video.universal_video_id || "N/A");
                console.log("Total Video Views Unique:", video.total_video_views_unique ?? "N/A");
                console.log("Total Video Avg Time Watched (ms):", video.total_video_avg_time_watched ?? "N/A");
                console.log("Total Video Complete Views:", video.total_video_complete_views ?? "N/A");
                console.log("Total Video 10s Views:", video.total_video_10s_views ?? "N/A");
                console.log("Total Video 30s Views:", video.total_video_30s_views ?? "N/A");
                console.log("Total Video 60s Views (excludes short):", video.total_video_60s_excludes_shorter_views ?? "N/A");
                console.log("Reaction LOVE Count:", video.reaction_love_count ?? "N/A");
                console.log("Reaction WOW Count:", video.reaction_wow_count ?? "N/A");
                console.log("Reaction HAHA Count:", video.reaction_haha_count ?? "N/A");
                console.log("Reaction SAD Count:", video.reaction_sad_count ?? "N/A");
                console.log("Reaction ANGRY Count:", video.reaction_angry_count ?? "N/A");
                console.log("Location:", video.location || "N/A");
                console.log("Hashtags:", video.hashtags ? video.hashtags.join(", ") : "N/A");
                console.log("Caption:", video.caption ? video.caption.substring(0, 100) + "..." : "N/A");
                
                console.log("\n[VIDEO METADATA - Fields yt-dlp CAN get (for reference)]");
                console.log("Like Count:", video.like_count ?? "N/A");
                console.log("Comment Count:", video.comment_count ?? "N/A");
                console.log("View Count:", video.view_count ?? "N/A");
                console.log("Share Count:", video.share_count ?? "N/A");
                console.log("Timestamp:", video.timestamp ? new Date(video.timestamp * 1000).toISOString() : "N/A");
            }

            console.log("\n=== Facebook Test: SUCCESS ===");
        } else {
            console.log("\n=== Facebook Test: FAILED (No metadata) ===");
            process.exit(1);
        }
    } catch (error) {
        console.error("\n=== Facebook Test: ERROR ===");
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

testFacebook().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});

