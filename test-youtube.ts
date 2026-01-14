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

async function testYouTube() {
    console.log("=== YouTube Scraper Test ===\n");
    
    const logger = new Logger("test-youtube", mockInvokeEvent);
    const testUrl = process.argv[2] || "https://www.youtube.com/watch?v=kPa7bsKwL-c&list=RDkPa7bsKwL-c&start_radio=1";
    
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
                console.log("Avatar URL:", creator.creator_avatar_url || "N/A");
                console.log("Verified:", creator.creator_verified ?? "N/A");
            }

            if (video) {
                console.log("\n[VIDEO METADATA]");
                console.log("Video ID:", video.video_id || "N/A");
                console.log("Mentions:", video.mentions ? video.mentions.join(", ") : "N/A");
                const ytVideo = video as any;
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

