/**
 * Braid Video Downloader - A powerful TypeScript library for downloading videos from web pages
 *
 * @example
 * ```typescript
 * import { VideoDownloader, M3U8Processor } from 'braid-video-downloader';
 *
 * // Download video from a web page
 * const downloader = new VideoDownloader({
 *   browserType: 'chromium',
 *   url: 'https://example.com/video-page',
 *   downloadConfig: { outputDir: 'downloads' }
 * });
 * await downloader.start();
 *
 * // Process M3U8 stream directly
 * const processor = new M3U8Processor({ outputDir: 'downloads' });
 * await processor.processM3U8('https://example.com/stream.m3u8', {});
 * ```
 */

import path = require("path");
import { Logger } from "./helpers/StringBuilder.js";
import { VideoDownloader } from "./VideoDownloader.js";
import { extractMetadata } from "./handlers/extractMetadata.js";
import { extractExtendedMetadata } from "./handlers/extractExtendedMetadata.js";
import { detectPlatform } from "./handlers/detectPlatform.js";
import { ipcExtractMetadata } from "./ipc/extractMetadata.js";
import { ipcExtractExtendedMetadata } from "./ipc/extractExtendedMetadata.js";
import { ipcDetectPlatform } from "./ipc/detectPlatform.js";

// Main exports - Primary classes users will interact with
export { VideoDownloader } from "./VideoDownloader.js";
export { M3U8Processor } from "./utils/M3U8Processor.js";
export { TitleScraper } from "./utils/TitleScraper.js";

// Browser implementations
export { FirefoxBrowser } from "./browsers/FirefoxBrowser.js";
export { BraveBrowser } from "./browsers/BraveBrowser.js";
export { ChromiumBrowser } from "./browsers/ChromiumBrowser.js";

// Specialized handlers for different scenarios
export { RouteHandler } from "./handlers/RouteHandler.js";
export { RequestHandler } from "./handlers/RequestHandler.js";
export { StreamButtonHandler } from "./handlers/StreamButtonHandler.js";
export { PopupHandler } from "./handlers/PopupHandler.js";
export { PlayButtonHandler } from "./handlers/PlayButtonHandler.js";

// Utility classes for advanced usage
export { IFrameMonitor } from "./utils/IFrameMonitor.js";
export { AdBlocker } from "./utils/AdBlocker.js";
export { NetworkMonitor } from "./utils/NetworkMonitor.js";
export { StreamHandler } from "./utils/StreamHandler.js";

// Helper classes for browser automation
export { BaseHelper } from "./helpers/BaseHelper.js";
export { BrowserHelper } from "./helpers/BrowserHelper.js";
export { DownloadHelper } from "./helpers/DownloadHelper.js";
export { PageHelper } from "./helpers/PageHelper.js";

// Type definitions for TypeScript users
export * from "./types/index.js";

// Creator metadata scrapers (for data yt-dlp cannot extract)
export { CreatorMetadataManager } from "./scrapers/CreatorMetadataManager.js";
export { CreatorMetadataScraper } from "./scrapers/CreatorMetadataScraper.js";
export { YouTubeScraper } from "./scrapers/YouTubeScraper.js";
export { TikTokScraper } from "./scrapers/TikTokScraper.js";
export { TwitterScraper } from "./scrapers/TwitterScraper.js";
export { InstagramScraper } from "./scrapers/InstagramScraper.js";
export { RedditScraper } from "./scrapers/RedditScraper.js";
export { FacebookScraper } from "./scrapers/FacebookScraper.js";
export { TwitchScraper } from "./scrapers/TwitchScraper.js";

// Handler exports for extendr integration
export { extractMetadata } from "./handlers/extractMetadata.js";
export { extractExtendedMetadata } from "./handlers/extractExtendedMetadata.js";
export { detectPlatform } from "./handlers/detectPlatform.js";

// IPC handler exports
export { ipcExtractMetadata } from "./ipc/extractMetadata.js";
export { ipcExtractExtendedMetadata } from "./ipc/extractExtendedMetadata.js";
export { ipcDetectPlatform } from "./ipc/detectPlatform.js";

// Default export for convenience
export default VideoDownloader;

async function getInfo(e: any, url: string) {
    // Lightweight title scraper - just extracts title info without downloading
    if (!url.startsWith("https://jav.guru")) return;

    e.stopPropagation();

    try {
        // Create a simple logger for this operation
        const simpleLogger = new Logger("getInfo", e.invokeEvent);
        const logAgent = simpleLogger.agent("TitleScraper");
        
        // Create just the TitleScraper for lightweight title extraction
        const { TitleScraper } = await import("./utils/TitleScraper.js");
        const { FirefoxBrowser } = await import("./browsers/FirefoxBrowser.js");
        
        const titleScraper = new TitleScraper(logAgent);
        
        // Launch a minimal browser session just for title extraction
        const browser = new FirefoxBrowser(simpleLogger);
        await browser.launch({
            headless: true,
            viewport: { width: 1920, height: 1080 },
            ignoreHTTPSErrors: true,
            javaScriptEnabled: true,
        });
        
        const page = await browser.getPage(url); // getPage() handles navigation and waiting
        
        // Extract title information
        const titleInfo = await titleScraper.extractTitleInfo(page);
        
        // Close browser
        await browser.close();

        return {
            ok: true,
            data: {
                id: titleInfo?.code || url,
                title: titleInfo?.title || url,
                titleInfo: titleInfo || undefined,
                formats: [
                    {
                        format_id: "detected-stream",
                        url: url, // The actual stream URL will be detected during download
                        ext: "mp4",
                        protocol: "https",
                        http_headers: {
                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.5",
                            "Sec-Fetch-Mode": "navigate",
                        },
                        format: "Stream (detected during download)",
                    },
                ],
            },
        };

    } catch (error) {
        console.error("Error in getInfo:", error);
        
        // Fallback to dummy response
        return {
            ok: false,
            data: {
                id: url,
                title: url,
                error: error instanceof Error ? error.message : String(error),
                formats: [
                    {
                        format_id: "mp4-720p",
                        url,
                        ext: "mp4",
                        protocol: "https",
                        http_headers: {
                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.5",
                            "Sec-Fetch-Mode": "navigate",
                        },
                        format: "720p MP4",
                    },
                ],
            },
        };
    }
}

async function downloadInternal(
    downloadId: string,
    url: string,
    outputFilepath: string,
    invokeEvent: any
) {
    // Set up process completion detection WITHOUT interfering with the main stream
    let processCompletionHandled = false;
    let completeLog = new Logger(downloadId, invokeEvent); // Collect all logs here

    function handleProcessCompletion(
        code: number,
        signal: string,
        eventType: string
    ) {
        if (processCompletionHandled) return; // Prevent duplicate handling
        processCompletionHandled = true;

        const completionMessage = `Process '${downloadId}' ${eventType} with code: ${code}, signal: ${signal}`;

        // completion message to complete log
        completeLog.append(completionMessage);

        // Send completion with complete log after a small delay to ensure all other logs are processed first
        setTimeout(() => {
            invokeEvent.sender.send(downloadId, {
                type: "completion",
                data: {
                    log: completionMessage,
                    completeLog: completeLog.toString(),
                    exitCode: code,
                    signal: signal,
                    controllerId: downloadId,
                },
            });
        }, 100); // Small delay to ensure stream logs are processed first
    }

    const videoDownloader = new VideoDownloader({
        completeLog,
        downloadId,
        invokeEvent,
        url,
        browserType: "firefox",
        downloadConfig: {
            outputFilepath,
        },
        browserConfig: {
            headless: false,
            disableImages: true,
        },
    });

    const video = await videoDownloader.main();

    if (!video) {
        handleProcessCompletion(1, "failed", "failed");
        return;
    }

    handleProcessCompletion(0, "closed", "closed");
}

async function download(e: any, downloadId: string, args: any) {
    // https://jav.guru/741640/start-402-ended-up-having-a-one-night-stand-after-drinks-with-a-colleague-i-dislike-his-cock-fits-so-perfectly-deep-in-the-pussy-that-had-the-best-climax-of-my-life-honjo-suzu/
    const { url, outputFilepath } = args;

    if (!url.startsWith("https://jav.guru")) return;

    e.stopPropagation();

    const { invokeEvent } = e;

    downloadInternal(
        downloadId,
        url,
        path.normalize(outputFilepath),
        invokeEvent
    );

    return { downloadId, controllerId: downloadId };
}

export function main({ events, channels, electron: { ipcMain } }: any) {
    const extensionPath = __dirname;
    const extensionRoot = extensionPath.replace(/[\\/]dist$/, '');
    
    console.log(`[Braid] Extension path: ${extensionPath}`);
    console.log(`[Braid] Extension root: ${extensionRoot}`);

    // Register channels for scraper functionality
    const extractMetadataId = channels.register("extendr:extractMetadata");
    const extractExtendedMetadataId = channels.register("extendr:extractExtendedMetadata");
    const detectPlatformId = channels.register("extendr:detectPlatform");
    
    // Register existing channels
    const getInfoId = channels.register("extendr:getInfo");
    const downloadId = channels.register("extendr:download");

    // Register event handlers
    events.on(extractMetadataId, extractMetadata, -10);
    events.on(extractExtendedMetadataId, extractExtendedMetadata, -10);
    events.on(detectPlatformId, detectPlatform, -10);
    events.on(getInfoId, getInfo, -10);
    events.on(downloadId, download, -10);

    // Register IPC handlers
    ipcMain.handle(extractMetadataId, ipcExtractMetadata);
    ipcMain.handle(extractExtendedMetadataId, ipcExtractExtendedMetadata);
    ipcMain.handle(detectPlatformId, ipcDetectPlatform);

    console.log('[Braid] Extension initialized successfully');
}
