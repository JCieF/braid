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

async function testYouTube() {
    console.log("=== YouTube Scraper Test ===\n");
    
    const logger = new Logger("test-youtube", mockInvokeEvent);
    //Regular video, uncomment to test
    const testUrl = process.argv[2] || "https://www.youtube.com/watch?v=kPa7bsKwL-c&list=RDkPa7bsKwL-c&start_radio=1";
    //Kid video, uncomment to test
    //const testUrl = process.argv[2] || "https://www.youtube.com/watch?v=e_04ZrNroTo&list=RDe_04ZrNroTo&start_radio=1";
    //Shorts video, uncomment to test
    //const testUrl = process.argv[2] || "https://www.youtube.com/shorts/jvp9EYIuq3Q";
    
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
                console.log("Avatar URL:", creator.creator_avatar_url || "N/A");
                console.log("Verified:", creator.creator_verified ?? "N/A");
            }

            if (video) {
                console.log("\n[VIDEO METADATA]");
                const ytVideo = video as any;
                
                // Fields that yt-dlp can get (now also extracted by scraper)
                console.log("\n---Fields that yt-dlp can also get ---");
                console.log("Video ID:", video.video_id || "N/A");
                // Title is stored in caption, description might be appended after newlines
                const captionParts = video.caption ? video.caption.split('\n\n') : [];
                console.log("Title:", captionParts[0] ? captionParts[0].substring(0, 80) + "..." : "N/A");
                console.log("Description:", captionParts[1] ? captionParts[1].substring(0, 150) + "..." : (captionParts[0] && captionParts[0].length > 80 ? captionParts[0].substring(80, 230) + "..." : "N/A"));
                console.log("View Count:", video.view_count || "N/A");
                console.log("Like Count:", video.like_count || "N/A");
                console.log("Comment Count:", video.comment_count || "N/A");
                console.log("Timestamp:", video.timestamp ? new Date(video.timestamp * 1000).toISOString() : "N/A");
                console.log("Hashtags:", video.hashtags ? video.hashtags.join(", ") : "N/A");
                console.log("Duration:", ytVideo.duration ? `${Math.floor(ytVideo.duration / 60)}:${String(ytVideo.duration % 60).padStart(2, '0')}` : "N/A");
                console.log("Channel ID:", ytVideo.channel_id || "N/A");
                console.log("Channel Name:", ytVideo.channel_name || "N/A");
                console.log("Definition:", ytVideo.definition || "N/A");
                console.log("Thumbnails:", ytVideo.thumbnails ? `${ytVideo.thumbnails.length} thumbnails` : "N/A");
                if (ytVideo.isLive) {
                    console.log("Concurrent Viewers:", ytVideo.concurrentViewers || "N/A");
                }
                
                // Fields that yt-dlp cannot get (scraper-only)
                console.log("\n--- Scraper-Only Fields ---");
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
            }

            console.log("\n=== YouTube Test: SUCCESS ===");
        } else {
            console.log("\n=== YouTube Test: FAILED (No metadata) ===");
            process.exit(1);
        }
    } catch (error) {
        console.error("\n=== YouTube Test: ERROR ===");
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

testYouTube().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});

