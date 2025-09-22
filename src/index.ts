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

// Main exports - Primary classes users will interact with
export { VideoDownloader } from "./VideoDownloader.js";
export { M3U8Processor } from "./utils/M3U8Processor.js";

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

// Default export for convenience
export default VideoDownloader;

async function getInfo(e: any, url: string) {
    // No scraper yet. Just return a dummy response.
    if (!url.startsWith("https://jav.guru")) return;

    e.stopPropagation();

    return {
        ok: true,
        data: {
            id: url,
            title: url,
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

export function main({ events }: { events: any }) {
    events.on("extendr:getInfo", getInfo, -10);
    events.on("extendr:download", download, -10);
}
