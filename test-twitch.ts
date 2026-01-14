import { chromium } from "playwright";
import { TwitchScraper } from "./src/scrapers/TwitchScraper.js";
import { Logger } from "./src/helpers/StringBuilder.js";

const mockInvokeEvent = {
    sender: {
        send: (id: string, data: any) => {
            // Silent logging for tests
        }
    }
};

async function testTwitchScraper() {
    const logger = new Logger("test-twitch", mockInvokeEvent);
    const scraper = new TwitchScraper(logger);

    const testUrls = [
        // Live stream (change to an active streamer)
        "https://www.twitch.tv/shroud",
        // VOD example
        "https://www.twitch.tv/videos/2336789123",
        // Clip example
        "https://www.twitch.tv/shroud/clip/SomeClipSlug",
    ];

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        for (const url of testUrls) {
            console.log(`\n${"=".repeat(60)}`);
            console.log(`Testing URL: ${url}`);
            console.log("=".repeat(60));

            console.log("\n--- Video Metadata (yt-dlp gaps) ---");
            const videoMetadata = await scraper.extractVideoMetadata(page, url);
            if (videoMetadata) {
                console.log(JSON.stringify(videoMetadata, null, 2));
            } else {
                console.log("No video metadata extracted");
            }

            console.log("\n--- Creator Metadata ---");
            const creatorMetadata = await scraper.extractMetadata(page, url);
            if (creatorMetadata) {
                console.log(JSON.stringify(creatorMetadata, null, 2));
            } else {
                console.log("No creator metadata extracted");
            }
        }
    } catch (error) {
        console.error("Test error:", error);
    } finally {
        await browser.close();
    }
}

// Run with a specific URL from command line (or use default)
async function testSingleUrl() {
    const url = process.argv[2] || "https://www.twitch.tv/videos/2643291721";

    const logger = new Logger("test-twitch", mockInvokeEvent);
    const scraper = new TwitchScraper(logger);

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log(`\nTesting URL: ${url}\n`);

        console.log("--- Video Metadata ---");
        const videoMetadata = await scraper.extractVideoMetadata(page, url);
        if (videoMetadata) {
            console.log(JSON.stringify(videoMetadata, null, 2));
            
            // Highlight the yt-dlp gap fields
            console.log("\n--- ---");
            const gapFields = [
                "stream_id", "published_at", "muted_segments", "vod_type",
                "embed_url", "source_video_id", "vod_offset", "is_featured", "clip_creator_id",
                "game_id", "game_name", "is_mature", "tags",
                "content_classification_labels", "is_branded_content"
            ];
            for (const field of gapFields) {
                const value = (videoMetadata as any)[field];
                if (value !== undefined) {
                    console.log(`  ${field}: ${JSON.stringify(value)}`);
                }
            }
        } else {
            console.log("No video metadata extracted");
        }

        console.log("\n--- Creator Metadata ---");
        const creatorMetadata = await scraper.extractMetadata(page, url);
        if (creatorMetadata) {
            console.log(JSON.stringify(creatorMetadata, null, 2));
        } else {
            console.log("No creator metadata extracted");
        }

    } catch (error) {
        console.error("Test error:", error);
    } finally {
        await browser.close();
    }
}

testSingleUrl();
