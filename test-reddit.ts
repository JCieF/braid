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

async function testReddit() {
    console.log("=== Reddit Scraper Test ===\n");
    
    const logger = new Logger("test-reddit", mockInvokeEvent);
    const testUrl = process.argv[2] || "https://www.reddit.com/r/ChikaPH/comments/1popgpv/dustin_yus_fanservice_is_extreme_in_its_showtime/";
    
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
                console.log("\n[VIDEO METADATA - yt-dlp compatible]");
                console.log("Video ID:", video.video_id || "N/A");
                console.log("Like Count:", video.like_count ?? "N/A");
                console.log("Comment Count:", video.comment_count ?? "N/A");
                console.log("View Count:", video.view_count ?? "N/A");
                console.log("Save Count (Awards):", video.save_count ?? "N/A");
                console.log("Caption:", video.caption ? video.caption.substring(0, 100) + "..." : "N/A");
                console.log("Hashtags:", video.hashtags ? video.hashtags.join(", ") : "N/A");
                console.log("Mentions:", video.mentions ? video.mentions.join(", ") : "N/A");
                console.log("Is Video:", video.is_video !== undefined ? video.is_video : "N/A");
                console.log("Timestamp:", video.timestamp ? new Date(video.timestamp * 1000).toISOString() : "N/A");
                
                console.log("\n[REDDIT-SPECIFIC - Fields yt-dlp CANNOT get]");
                console.log("Upvote Ratio:", video.upvote_ratio !== undefined ? video.upvote_ratio : "N/A");
                console.log("Is Self Post:", video.is_self !== undefined ? video.is_self : "N/A");
                console.log("Is Gallery:", video.is_gallery !== undefined ? video.is_gallery : "N/A");
                console.log("Spoiler:", video.spoiler !== undefined ? video.spoiler : "N/A");
                console.log("Locked:", video.locked !== undefined ? video.locked : "N/A");
                console.log("Stickied:", video.stickied !== undefined ? video.stickied : "N/A");
                console.log("Over 18 (NSFW):", video.over_18 !== undefined ? video.over_18 : "N/A");
                console.log("Link Flair:", video.link_flair_text || "N/A");
                console.log("Domain:", video.domain || "N/A");
                console.log("Author Fullname:", video.author_fullname || "N/A");
                console.log("Subreddit ID:", video.subreddit_id || "N/A");
                console.log("Has Selftext HTML:", video.selftext_html ? "Yes" : "No");
                console.log("Thumbnail Dimensions:", video.thumbnail_width && video.thumbnail_height ? `${video.thumbnail_width}x${video.thumbnail_height}` : "N/A");
            }

            console.log("\n=== Reddit Test: SUCCESS ===");
        } else {
            console.log("\n=== Reddit Test: FAILED (No metadata) ===");
            process.exit(1);
        }
    } catch (error) {
        console.error("\n=== Reddit Test: ERROR ===");
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

testReddit().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});

