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

async function testTwitter() {
    console.log("=== Twitter/X Scraper Test ===\n");
    
    const logger = new Logger("test-twitter", mockInvokeEvent);
    const testUrl = process.argv[2] || "https://x.com/billieeilish/status/1679491991611277312?lang=en";
    
    const manager = new CreatorMetadataManager(logger, {
        browserType: "chromium",
        browserConfig: {
            headless: true,
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
                console.log("\n[VIDEO METADATA - Fields yt-dlp CAN get (for reference)]");
                console.log("Video ID:", video.video_id || "N/A");
                console.log("Like Count:", video.like_count ?? "N/A");
                console.log("Comment Count:", video.comment_count ?? "N/A");
                console.log("View Count:", video.view_count ?? "N/A");
                console.log("Share Count:", video.share_count ?? "N/A");
                console.log("Caption:", video.caption ? video.caption.substring(0, 100) + "..." : "N/A");
                console.log("Hashtags:", video.hashtags ? video.hashtags.join(", ") : "N/A");
                console.log("Mentions:", video.mentions ? video.mentions.join(", ") : "N/A");
                console.log("Is Video:", video.is_video !== undefined ? video.is_video : "N/A");
                console.log("Timestamp:", video.timestamp ? new Date(video.timestamp * 1000).toISOString() : "N/A");

                console.log("\n[VIDEO METADATA - Fields yt-dlp CANNOT get]");
                console.log("Conversation ID:", video.conversation_id || "N/A");
                console.log("Reply Count:", video.reply_count ?? "N/A");
                console.log("Quote Count:", video.quote_count ?? "N/A");
                console.log("Bookmark Count:", video.bookmark_count ?? "N/A");
                console.log("Impression Count:", video.impression_count ?? "N/A");
                console.log("In Reply To User ID:", video.in_reply_to_user_id || "N/A");
                console.log("Reply Settings:", video.reply_settings || "N/A");
                console.log("Source:", video.source || "N/A");
                console.log("Tweet Language:", video.tweet_language || "N/A");
                console.log("Possibly Sensitive:", video.possibly_sensitive !== undefined ? video.possibly_sensitive : "N/A");
                console.log("Media Key:", video.media_key || "N/A");
                console.log("Context Annotations:", video.context_annotations ? `${video.context_annotations.length} items` : "N/A");
                console.log("Edit Controls:", video.edit_controls ? JSON.stringify(video.edit_controls) : "N/A");
                console.log("Edit History Tweet IDs:", video.edit_history_tweet_ids ? video.edit_history_tweet_ids.join(", ") : "N/A");
                console.log("Entities Hashtags:", video.entities_hashtags ? `${video.entities_hashtags.length} items` : "N/A");
                console.log("Entities Mentions:", video.entities_mentions ? `${video.entities_mentions.length} items` : "N/A");
                console.log("Entities URLs:", video.entities_urls ? `${video.entities_urls.length} items` : "N/A");
                console.log("Entities Cashtags:", video.entities_cashtags ? `${video.entities_cashtags.length} items` : "N/A");
                console.log("Geo:", video.geo ? JSON.stringify(video.geo) : "N/A");
                console.log("Withheld:", video.withheld ? JSON.stringify(video.withheld) : "N/A");

                console.log("\n[CREATOR METADATA - Fields yt-dlp CANNOT get]");
                console.log("Creator Created At:", video.creator_created_at ? new Date(video.creator_created_at * 1000).toISOString() : "N/A");
                console.log("Creator Description:", video.creator_description || "N/A");
                console.log("Creator Location:", video.creator_location || "N/A");
                console.log("Creator Profile Image URL:", video.creator_profile_image_url || "N/A");
                console.log("Creator Protected:", video.creator_protected !== undefined ? video.creator_protected : "N/A");
                console.log("Creator Following Count:", video.creator_following_count ?? "N/A");
                console.log("Creator Tweet Count:", video.creator_tweet_count ?? "N/A");
                console.log("Creator Listed Count:", video.creator_listed_count ?? "N/A");
                console.log("Creator Verified:", video.creator_verified !== undefined ? video.creator_verified : "N/A");
                console.log("Creator Verified Type:", video.creator_verified_type || "N/A");
                console.log("Place Full Name:", video.place_full_name || "N/A");
                console.log("Place Country:", video.place_country || "N/A");
                console.log("Place Geo:", video.place_geo ? JSON.stringify(video.place_geo) : "N/A");
            }

            console.log("\n=== Twitter/X Test: SUCCESS ===");
        } else {
            console.log("\n=== Twitter/X Test: FAILED (No metadata) ===");
            process.exit(1);
        }
    } catch (error) {
        console.error("\n=== Twitter/X Test: ERROR ===");
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

testTwitter().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});

