import { Page } from "playwright";
import { FirefoxBrowser } from "./browsers/FirefoxBrowser.js";
import { BraveBrowser } from "./browsers/BraveBrowser.js";
import { ChromiumBrowser } from "./browsers/ChromiumBrowser.js";
import { RouteHandler } from "./handlers/RouteHandler.js";
import { RequestHandler } from "./handlers/RequestHandler.js";
import { StreamButtonHandler } from "./handlers/StreamButtonHandler.js";
import { PopupHandler } from "./handlers/PopupHandler.js";
import { PlayButtonHandler } from "./handlers/PlayButtonHandler.js";
import { M3U8Processor } from "./utils/M3U8Processor.js";
import { IFrameMonitor } from "./utils/IFrameMonitor.js";
import { NetworkMonitor } from "./utils/NetworkMonitor.js";
import { StreamHandler } from "./utils/StreamHandler.js";
import { BrowserHelper } from "./helpers/BrowserHelper.js";
import { PageHelper } from "./helpers/PageHelper.js";
import {
    VideoDownloaderConfig,
    VideoCandidate,
    BrowserType,
} from "./types/index.js";
import { LogAgent, Logger } from "./helpers/StringBuilder.js";

export class VideoDownloader {
    private config: VideoDownloaderConfig;
    private browser: FirefoxBrowser | BraveBrowser | ChromiumBrowser | null =
        null;
    private page: Page | null = null;

    // Core components
    private routeHandler: RouteHandler;
    private requestHandler: RequestHandler;
    private streamButtonHandler: StreamButtonHandler;
    private popupHandler: PopupHandler;
    private playButtonHandler: PlayButtonHandler;
    private m3u8Processor: M3U8Processor;
    private iframeMonitor: IFrameMonitor;
    private networkMonitor: NetworkMonitor;
    private streamHandler: StreamHandler;

    // Helpers
    private browserHelper: BrowserHelper;
    private pageHelper: PageHelper;

    // State
    private videoCandidates: VideoCandidate[] = [];
    private allVideoRequests: string[] = [];
    private capturedHeaders: Record<string, string> = {};
    private directUrlFound: boolean = false;

    private completeLog: Logger;
    private logAgent: LogAgent;

    constructor(config: VideoDownloaderConfig) {
        console.log("RRR", config);

        this.config = config;

        // Initialize components
        this.routeHandler = new RouteHandler(config.completeLog);
        this.requestHandler = new RequestHandler(config.completeLog);
        this.streamButtonHandler = new StreamButtonHandler(config.completeLog);
        this.popupHandler = new PopupHandler(config.completeLog);
        this.playButtonHandler = new PlayButtonHandler(config.completeLog);
        this.m3u8Processor = new M3U8Processor(
            config.completeLog,
            config.downloadConfig
        );
        this.iframeMonitor = new IFrameMonitor(config.completeLog);
        this.networkMonitor = new NetworkMonitor(config.completeLog);
        this.streamHandler = new StreamHandler(config.completeLog);

        // Initialize helpers
        this.browserHelper = new BrowserHelper(config.completeLog);
        this.pageHelper = new PageHelper(config.completeLog);

        this.completeLog = config.completeLog;
        this.logAgent = this.completeLog.agent("VideoDownloader");
    }

    log(text: string, type: string) {
        this.logAgent.log(text, type);
    }

    async main(): Promise<boolean> {
        const browserType = await this.browserHelper.selectBestBrowser(
            this.config.browserType
        );

        this.log(
            `Starting downloader with ${browserType.toUpperCase()}`,
            "info"
        );

        try {
            await this.initializeBrowser(browserType);

            if (!this.page) {
                throw new Error("Failed to initialize page");
            }

            await this.setupComprehensiveMonitoring();
            await this.page.route("**/*", (route, request) =>
                this.routeHandler.handleRoute(route, request)
            );

            await this.iframeMonitor.setupMonitoring(
                this.page,
                this.requestHandler
            );

            this.log("Waiting for page to fully load...", "debug");
            await this.pageHelper.waitForJWPlayerInitialization(this.page);

            this.log("Handling popups and modals...", "debug");
            await this.popupHandler.closePopups(this.page);

            await this.popupHandler.waitAndClosePopups(this.page, 3000);

            this.log("Starting stream button handling...", "debug");
            const success = await this.tryStreamButtonsWithMonitoring();

            if (success) {
                this.log("Download completed successfully", "info");
                this.playButtonHandler.markDownloadCompleted();
                return true;
            } else {
                this.log("No video streams found", "warn");
                await this.pageHelper.takeScreenshot(
                    this.page,
                    "no_streams_found.png"
                );
                return false;
            }
        } catch (error) {
            this.log(`Error during execution: ${error}`, "error");
            if (this.page) {
                await this.pageHelper.takeScreenshot(this.page, "error.png");
            }
            return false;
        } finally {
            await this.cleanup();
        }
    }

    private async initializeBrowser(browserType: BrowserType): Promise<void> {
        if (browserType === "firefox") {
            this.browser = new FirefoxBrowser(this.config.completeLog);
        } else if (browserType === "brave") {
            this.browser = new BraveBrowser(this.config.completeLog);
        } else {
            this.browser = new ChromiumBrowser(this.config.completeLog);
        }

        await this.browser.launch(this.config.browserConfig);
        this.page = await this.browser.getPage(this.config.url);
    }

    private async setupComprehensiveMonitoring(): Promise<void> {
        if (!this.page) return;

        this.log("Setting up comprehensive monitoring...", "debug");

        this.networkMonitor.setupComprehensiveMonitoring(this.page);

        this.page.on("request", async (request) => {
            await this.requestHandler.handleRequest(request);
        });

        this.page.on("response", async (response) => {
            await this.requestHandler.handleResponse(response);
        });
    }

    private async tryStreamButtonsWithMonitoring(): Promise<boolean> {
        if (!this.page) return false;

        this.log("Trying stream buttons with monitoring...", "debug");

        const availableButtons =
            await this.streamButtonHandler.findAvailableStreamButtons(
                this.page
            );

        if (availableButtons.length === 0) {
            this.log("No stream buttons found on page", "warn");
            return false;
        }

        this.log(`Found ${availableButtons.length} stream buttons`, "info");

        for (const selector of availableButtons) {
            try {
                this.log(`Trying stream button: ${selector}`, "debug");

                this.videoCandidates = [];

                const buttonClicked =
                    await this.streamButtonHandler.clickSpecificStreamButton(
                        this.page,
                        selector
                    );

                if (!buttonClicked) {
                    this.log(
                        `Failed to click button with selector: ${selector}`,
                        "warn"
                    );
                    continue;
                }

                this.log("Waiting for iframe to load...", "debug");
                await this.page.waitForTimeout(3000);

                await this.popupHandler.closePopups(this.page);

                if (await this.isAdRedirect()) {
                    this.log(
                        "Ad redirect detected - attempting to click through ad...",
                        "debug"
                    );

                    let adClickedThrough = false;
                    for (let attempt = 1; attempt <= 3; attempt++) {
                        this.log(
                            `Ad click-through attempt ${attempt}/3`,
                            "info"
                        );

                        adClickedThrough = await this.clickThroughAd();
                        if (adClickedThrough) {
                            this.log(
                                "Clicked through ad, waiting for video iframe...",
                                "info"
                            );

                            await this.popupHandler.closePopups(this.page);

                            await this.page.waitForTimeout(5000);

                            const videoIframeNow =
                                await this.checkForVideoIframe();
                            if (videoIframeNow) {
                                this.log(
                                    "Video iframe found after ad click-through!",
                                    "info"
                                );

                                break;
                            } else {
                                this.log(
                                    `No video iframe after attempt ${attempt}, trying again...`,
                                    "warn"
                                );

                                adClickedThrough = false;
                            }
                        } else {
                            this.log(
                                `Ad click-through attempt ${attempt} failed`,
                                "warn"
                            );

                            await this.page.waitForTimeout(2000);
                        }
                    }

                    if (!adClickedThrough) {
                        this.log(
                            "Could not click through ad after 3 attempts",
                            "warn"
                        );
                    }
                }

                const existingVideoIframes = this.page
                    .frames()
                    .filter((frame) => {
                        const url = frame.url();
                        return (
                            (url.includes("turbovidhls.com") ||
                                url.includes("turboviplay.com") ||
                                url.includes("jwplayer") ||
                                url.includes("/player/") ||
                                url.includes("/video/") ||
                                url.includes("streamtape") ||
                                url.includes("mixdrop") ||
                                url.includes("doodstream") ||
                                url.includes("upstream")) &&
                            !url.includes("searcho") &&
                            !url.includes("/ads/")
                        );
                    });

                let videoIframeFound = existingVideoIframes.length > 0;

                if (videoIframeFound) {
                    this.log(
                        `Video iframe already present: ${existingVideoIframes[0].url()}`,
                        "info"
                    );
                } else {
                    this.log(
                        "Waiting for video iframe to appear (may take 30 seconds after ad click-through)...",
                        "info"
                    );

                    videoIframeFound = await this.waitForVideoIframe(30000);

                    if (!videoIframeFound) {
                        this.log(
                            "No video iframe found after 30 seconds",
                            "warn"
                        );

                        const networkCandidates =
                            this.networkMonitor.getVideoCandidates();
                        const requestCandidates =
                            this.requestHandler.getVideoCandidates();
                        const allCandidates = [
                            ...networkCandidates,
                            ...requestCandidates,
                        ];

                        if (allCandidates.length > 0) {
                            this.log(
                                `Found ${allCandidates.length} M3U8 candidates from network monitoring - processing them`,
                                "info"
                            );

                            for (const candidate of allCandidates) {
                                if (
                                    !this.videoCandidates.some(
                                        (c) => c.url === candidate.url
                                    )
                                ) {
                                    this.videoCandidates.push(candidate);
                                }
                            }

                            const downloadSuccess = await this.processResults();
                            if (downloadSuccess) {
                                this.log(
                                    `SUCCESS! Downloaded video using M3U8 candidates from button: ${selector}`,
                                    "info"
                                );
                                this.playButtonHandler.markDownloadCompleted();
                                return true;
                            }
                        }

                        this.log(
                            "No video iframe and no M3U8 candidates - trying next stream button",
                            "warn"
                        );
                        continue;
                    }
                }

                this.log(
                    "Looking for play buttons in video iframes...",
                    "info"
                );
                let playButtonClicked = false;

                for (let attempt = 1; attempt <= 3; attempt++) {
                    this.log(`Play button attempt ${attempt}/3...`, "info");
                    playButtonClicked =
                        await this.tryClickPlayButtonInIframes();

                    if (playButtonClicked) {
                        this.log(
                            "Play button clicked - monitoring for streams...",
                            "info"
                        );
                        break;
                    } else {
                        this.log(
                            `Play button attempt ${attempt} failed, waiting 2s...`,
                            "warn"
                        );
                        await this.page.waitForTimeout(2000);
                    }
                }

                if (!playButtonClicked) {
                    this.log(
                        "No play button found after 3 attempts - still monitoring...",
                        "warn"
                    );
                }

                const networkCandidates =
                    this.networkMonitor.getVideoCandidates();
                const requestCandidates =
                    this.requestHandler.getVideoCandidates();
                const initialCandidates = [
                    ...networkCandidates,
                    ...requestCandidates,
                ];

                if (initialCandidates.length > 0) {
                    this.log(
                        `Found ${initialCandidates.length} video candidates from initial page load - processing immediately`,
                        "info"
                    );

                    for (const candidate of initialCandidates) {
                        if (
                            !this.videoCandidates.some(
                                (c) => c.url === candidate.url
                            )
                        ) {
                            this.videoCandidates.push(candidate);
                        }
                    }

                    const sortedCandidates = initialCandidates.sort((a, b) => {
                        const aHasQuality =
                            a.url.includes("720") || a.url.includes("1080");
                        const bHasQuality =
                            b.url.includes("720") || b.url.includes("1080");
                        if (aHasQuality && !bHasQuality) return -1;
                        if (!aHasQuality && bHasQuality) return 1;
                        return 0;
                    });

                    for (const candidate of sortedCandidates) {
                        this.log(
                            `IMMEDIATE PROCESSING: ${candidate.url}`,
                            "info"
                        );

                        let success = false;
                        if (candidate.url.includes(".m3u8")) {
                            success = await this.processM3U8Directly(
                                candidate.url,
                                candidate.headers
                            );
                        } else if (
                            candidate.url.endsWith(".mp4") ||
                            candidate.url.endsWith(".mkv")
                        ) {
                            success = await this.downloadDirectVideo(
                                candidate.url,
                                candidate.headers
                            );
                        }

                        if (success) {
                            this.log(
                                `SUCCESS! Downloaded video immediately using: ${candidate.url}`,
                                "info"
                            );
                            this.playButtonHandler.markDownloadCompleted();
                            return true;
                        } else {
                            this.log(
                                `Immediate processing failed for: ${candidate.url}`,
                                "warn"
                            );
                        }
                    }

                    this.log(
                        "Immediate processing failed for all candidates, falling back to monitoring...",
                        "warn"
                    );
                }

                const result = await this.monitorForVideoStreams(selector, 60);

                if (result.success) {
                    if (this.directUrlFound) {
                        this.log(
                            `SUCCESS! Direct video URL found with button: ${selector}`,
                            "info"
                        );
                        return true;
                    }

                    // If results were already processed during monitoring, return success
                    if (result.processed) {
                        this.log(
                            `SUCCESS! Downloaded video using button: ${selector} (processed during monitoring)`,
                            "info"
                        );
                        this.playButtonHandler.markDownloadCompleted();
                        return true;
                    }

                    this.log(
                        `Found video streams with button: ${selector}`,
                        "info"
                    );

                    const downloadSuccess = await this.processResults();

                    if (downloadSuccess) {
                        this.log(
                            `SUCCESS! Downloaded video using button: ${selector}`,
                            "info"
                        );
                        this.playButtonHandler.markDownloadCompleted();
                        return true;
                    } else {
                        this.log(
                            `Button ${selector} found streams but all contained ads - trying next button`,
                            "warn"
                        );
                        continue;
                    }
                } else {
                    this.log(
                        `Button ${selector} did not find any video streams - trying next button`,
                        "warn"
                    );
                    continue;
                }
            } catch (error) {
                this.log(
                    `Error with button ${selector}: ${error} - trying next button`,
                    "warn"
                );
                continue;
            }
        }

        this.log(
            `All ${availableButtons.length} stream buttons failed - no video found`,
            "error"
        );
        return false;
    }

    private async tryClickPlayButtonInIframes(): Promise<boolean> {
        if (!this.page) return false;

        const frames = this.page.frames();
        let playButtonClicked = false;

        for (const frame of frames) {
            if (frame === this.page.mainFrame()) continue;

            try {
                const frameUrl = frame.url();
                if (
                    !frameUrl ||
                    frameUrl === "about:blank" ||
                    frameUrl.includes("searcho")
                )
                    continue;

                this.log(
                    `Checking iframe for play button: ${frameUrl}`,
                    "info"
                );

                // Wait for iframe to fully load
                await this.page.waitForTimeout(1000);

                const playButtonSelectors = [
                    // Exact match from screenshot - highest priority
                    'div.playbutton[onclick="start_player()"]',
                    "div.playbutton",
                    ".playbutton",
                    '[onclick="start_player()"]',
                    '[onclick*="start_player"]',
                    'div[onclick*="start_player"]',

                    // Common video player patterns
                    ".jw-display-icon-container",
                    ".jw-icon-play",
                    ".jwplayer .jw-display-icon-container",
                    ".vjs-big-play-button",
                    ".video-js .vjs-big-play-button",

                    // Generic play buttons
                    'button[data-action="play"]',
                    ".video-play-button",
                    ".play-btn",
                    ".play-button",
                    "button.play",
                    'button[aria-label*="play" i]',
                    'button[title*="play" i]',
                    '[role="button"][aria-label*="play" i]',
                    'div[class*="play" i][role="button"]',
                    'button[class*="play" i]',
                    ".video-overlay-play-button",
                    ".plyr__control--overlaid",

                    // More generic selectors
                    'div[style*="cursor: pointer"][class*="play"]',
                    'span[class*="play"]',
                    ".fa-play",
                    ".icon-play",
                    '[data-toggle="play"]',

                    // Last resort - any clickable element in video context
                    "video + *[onclick]",
                    ".video-container [onclick]",
                    ".player-container [onclick]",
                ];

                for (const selector of playButtonSelectors) {
                    try {
                        const buttons = frame.locator(selector);
                        const count = await buttons.count();

                        for (let i = 0; i < count; i++) {
                            try {
                                const button = buttons.nth(i);
                                const isVisible = await button.isVisible({
                                    timeout: 1000,
                                });

                                if (isVisible) {
                                    this.log(
                                        `Found play button: ${selector} in ${frameUrl}`,
                                        "info"
                                    );

                                    try {
                                        this.log(
                                            `Attempting to click play button with ${selector}`,
                                            "info"
                                        );

                                        // Strategy 1: Execute start_player function if it exists
                                        await button.evaluate((el) => {
                                            try {
                                                if (
                                                    typeof (window as any)
                                                        .start_player ===
                                                    "function"
                                                ) {
                                                    (
                                                        window as any
                                                    ).start_player();
                                                    console.log(
                                                        "start_player() function executed"
                                                    );
                                                    return true;
                                                }
                                            } catch (e) {
                                                console.log(
                                                    "start_player() not available:",
                                                    e
                                                );
                                            }
                                            return false;
                                        });

                                        await frame.waitForTimeout(500);

                                        // Strategy 2: Direct JavaScript click
                                        await button.evaluate((el) => {
                                            if (el && "click" in el) {
                                                (el as any).click();
                                                console.log(
                                                    "Direct JS click executed"
                                                );
                                            }
                                        });

                                        await frame.waitForTimeout(500);

                                        // Strategy 3: onclick handler execution
                                        await button.evaluate((el) => {
                                            if (el && el.onclick) {
                                                try {
                                                    const event =
                                                        new PointerEvent(
                                                            "click",
                                                            { bubbles: true }
                                                        );
                                                    el.onclick(event);
                                                    console.log(
                                                        "onclick handler executed"
                                                    );
                                                } catch (e) {
                                                    console.log(
                                                        "onclick failed:",
                                                        e
                                                    );
                                                }
                                            }
                                        });

                                        await frame.waitForTimeout(500);

                                        // Strategy 4: Force click with position
                                        try {
                                            await button.click({
                                                force: true,
                                                timeout: 3000,
                                            });
                                            console.log("Force click executed");
                                        } catch (forceError) {
                                            // Continue with other strategies
                                        }

                                        // Strategy 5: Dispatch comprehensive events
                                        await button.evaluate((el) => {
                                            const events = [
                                                "mousedown",
                                                "mouseup",
                                                "click",
                                                "touchstart",
                                                "touchend",
                                            ];
                                            events.forEach((eventType) => {
                                                try {
                                                    let event;
                                                    if (
                                                        eventType.startsWith(
                                                            "touch"
                                                        )
                                                    ) {
                                                        event = new TouchEvent(
                                                            eventType,
                                                            {
                                                                bubbles: true,
                                                                cancelable:
                                                                    true,
                                                            }
                                                        );
                                                    } else {
                                                        event = new MouseEvent(
                                                            eventType,
                                                            {
                                                                bubbles: true,
                                                                cancelable:
                                                                    true,
                                                            }
                                                        );
                                                    }
                                                    el.dispatchEvent(event);
                                                } catch (e) {
                                                    console.log(
                                                        `Event ${eventType} failed:`,
                                                        e
                                                    );
                                                }
                                            });
                                            console.log(
                                                "All mouse/touch events dispatched"
                                            );
                                        });

                                        this.log(
                                            `Play button click attempts completed for ${selector}`,
                                            "info"
                                        );
                                        playButtonClicked = true;

                                        // Wait a bit to see if video starts
                                        await this.page.waitForTimeout(2000);

                                        // Check if we can detect video playback starting
                                        try {
                                            const hasPlayingVideo = await frame
                                                .locator(
                                                    "video[autoplay], video:not([paused]), .jwplayer.jw-state-playing"
                                                )
                                                .count();
                                            if (hasPlayingVideo > 0) {
                                                this.log(
                                                    `Video playback detected!`,
                                                    "info"
                                                );
                                                return true;
                                            }
                                        } catch (videoCheckError) {
                                            // Continue anyway
                                        }
                                    } catch (clickError) {
                                        this.log(
                                            `All click strategies failed for ${selector}: ${clickError}`,
                                            "warn"
                                        );
                                        continue;
                                    }
                                }
                            } catch (elementError) {
                                continue;
                            }
                        }
                    } catch (selectorError) {
                        continue;
                    }
                }
            } catch (frameError) {
                this.log(
                    `Error checking iframe ${frame.url()}: ${frameError}`,
                    "warn"
                );
                continue;
            }
        }

        if (playButtonClicked) {
            this.log(`Play button interaction completed`, "info");
            return true;
        }

        this.log(`No play buttons found or clicked successfully`, "warn");
        return false;
    }

    private async isAdRedirect(): Promise<boolean> {
        if (!this.page) return false;

        const frames = this.page.frames();
        for (const frame of frames) {
            const url = frame.url();

            // Check for known ad domains/patterns
            if (
                url.includes("searcho") ||
                url.includes("/ads/") ||
                url.includes("redirect") ||
                url.includes("popup") ||
                url.includes("promo")
            ) {
                this.log(`Ad detected: ${url}`, "info");
                return true;
            }
        }

        return false;
    }

    private async checkForVideoIframe(): Promise<boolean> {
        if (!this.page) return false;

        const frames = this.page.frames();
        for (const frame of frames) {
            const url = frame.url();

            // Look for video hosting domains
            if (
                (url.includes("turbovidhls.com") ||
                    url.includes("turboviplay.com") ||
                    url.includes("jwplayer") ||
                    url.includes("/player/") ||
                    url.includes("/video/") ||
                    url.includes("streamtape") ||
                    url.includes("mixdrop") ||
                    url.includes("doodstream") ||
                    url.includes("upstream")) &&
                !url.includes("searcho") &&
                !url.includes("/ads/")
            ) {
                this.log(`🎬 Video iframe detected: ${url}`, "info");
                return true;
            }
        }

        return false;
    }

    private async clickThroughAd(): Promise<boolean> {
        if (!this.page) return false;

        const frames = this.page.frames();
        for (const frame of frames) {
            const url = frame.url();

            // Look for ad iframes that need to be clicked through
            if (
                url.includes("searcho") ||
                url.includes("/ads/") ||
                url.includes("redirect")
            ) {
                this.log(
                    `Attempting to click through ad iframe: ${url}`,
                    "info"
                );

                try {
                    // Wait a bit for ad to fully load
                    await this.page.waitForTimeout(1000);

                    // Try different strategies for ad click-through
                    const clickSelectors = [
                        // Look for specific turbo/video links first
                        'a[href*="turbo"]',
                        'a[href*="video"]',
                        'a[href*="play"]',
                        'a[href*="stream"]',
                        // Look for skip/continue buttons
                        ".skip-ad",
                        ".skip-button",
                        '[data-action="skip"]',
                        ".continue",
                        ".proceed",
                        // General clickable elements
                        "button:not([disabled])",
                        'a[href]:not([href="#"])',
                        "[onclick]",
                        ".btn:not(.disabled)",
                        ".button:not(.disabled)",
                        '[role="button"]',
                        // Last resort - any clickable element
                        "*[onclick]",
                        'div[style*="cursor: pointer"]',
                    ];

                    let clickedSuccessfully = false;

                    for (const selector of clickSelectors) {
                        try {
                            const elements = frame.locator(selector);
                            const count = await elements.count();

                            if (count > 0) {
                                for (let i = 0; i < Math.min(count, 3); i++) {
                                    try {
                                        const element = elements.nth(i);
                                        const isVisible =
                                            await element.isVisible({
                                                timeout: 1000,
                                            });

                                        if (isVisible) {
                                            this.log(
                                                `Clicking ${selector} in ad iframe`,
                                                "info"
                                            );

                                            // Try multiple click strategies
                                            try {
                                                // Strategy 1: Regular click
                                                await element.click({
                                                    force: true,
                                                    timeout: 3000,
                                                });
                                                this.log(
                                                    `Regular click succeeded on ${selector}`,
                                                    "info"
                                                );
                                            } catch {
                                                try {
                                                    // Strategy 2: JavaScript click
                                                    await element.evaluate(
                                                        (el) => {
                                                            if (
                                                                el &&
                                                                "click" in el
                                                            ) {
                                                                (
                                                                    el as any
                                                                ).click();
                                                            }
                                                        }
                                                    );
                                                    this.log(
                                                        `JavaScript click succeeded on ${selector}`,
                                                        "info"
                                                    );
                                                } catch {
                                                    // Strategy 3: Dispatch click event
                                                    await element.evaluate(
                                                        (el) => {
                                                            const event =
                                                                new MouseEvent(
                                                                    "click",
                                                                    {
                                                                        bubbles:
                                                                            true,
                                                                        cancelable:
                                                                            true,
                                                                    }
                                                                );
                                                            el.dispatchEvent(
                                                                event
                                                            );
                                                        }
                                                    );
                                                    this.log(
                                                        `Event dispatch succeeded on ${selector}`,
                                                        "info"
                                                    );
                                                }
                                            }

                                            await this.page.waitForTimeout(
                                                2000
                                            );
                                            clickedSuccessfully = true;
                                            break;
                                        }
                                    } catch (elementError) {
                                        continue;
                                    }
                                }

                                if (clickedSuccessfully) break;
                            }
                        } catch (selectorError) {
                            continue;
                        }
                    }

                    // If no specific elements worked, try clicking different areas of the iframe
                    if (!clickedSuccessfully) {
                        this.log(
                            `No specific elements found, trying to click iframe areas directly`,
                            "info"
                        );

                        try {
                            const iframeSelector = `iframe[src*="${
                                new URL(url).hostname
                            }"]`;
                            const iframeElement = this.page
                                .locator(iframeSelector)
                                .first();

                            if (await iframeElement.isVisible()) {
                                // Get iframe dimensions
                                const box = await iframeElement.boundingBox();
                                if (box) {
                                    // Try clicking different strategic positions
                                    const clickPositions = [
                                        { x: box.width / 2, y: box.height / 2 }, // Center (where play button usually is)
                                        {
                                            x: box.width * 0.3,
                                            y: box.height * 0.3,
                                        }, // Upper left area
                                        {
                                            x: box.width * 0.7,
                                            y: box.height * 0.3,
                                        }, // Upper right area
                                        {
                                            x: box.width * 0.5,
                                            y: box.height * 0.7,
                                        }, // Lower center
                                    ];

                                    for (const position of clickPositions) {
                                        try {
                                            this.log(
                                                `Clicking iframe at position (${Math.round(
                                                    position.x
                                                )}, ${Math.round(position.y)})`,
                                                "info"
                                            );

                                            await iframeElement.click({
                                                position: position,
                                                force: true,
                                                timeout: 2000,
                                            });

                                            await this.page.waitForTimeout(
                                                2000
                                            );
                                            clickedSuccessfully = true;
                                            this.log(
                                                `Iframe position click succeeded`,
                                                "info"
                                            );
                                            break;
                                        } catch (positionClickError) {
                                            this.log(
                                                `Position click failed: ${positionClickError}`,
                                                "warn"
                                            );
                                            continue;
                                        }
                                    }
                                } else {
                                    // Fallback to default center click
                                    await iframeElement.click({
                                        position: { x: 200, y: 150 },
                                        force: true,
                                        timeout: 3000,
                                    });
                                    clickedSuccessfully = true;
                                    this.log(
                                        `Fallback iframe click succeeded`,
                                        "info"
                                    );
                                }

                                if (clickedSuccessfully) {
                                    await this.page.waitForTimeout(3000);
                                }
                            }
                        } catch (iframeClickError) {
                            this.log(
                                `Iframe area click failed: ${iframeClickError}`,
                                "warn"
                            );
                        }
                    }

                    if (clickedSuccessfully) {
                        this.log(
                            `Ad click-through completed, checking for video iframe...`,
                            "info"
                        );
                        return true;
                    }
                } catch (error) {
                    this.log(`Failed to click through ad: ${error}`, "warn");
                }
            }
        }

        this.log(`Could not click through ad`, "warn");
        return false;
    }

    private async waitForVideoIframe(
        timeoutMs: number = 10000
    ): Promise<boolean> {
        if (!this.page) return false;

        const startTime = Date.now();
        const endTime = startTime + timeoutMs;

        while (Date.now() < endTime) {
            const frames = this.page.frames();
            for (const frame of frames) {
                const url = frame.url();

                // Look for video hosting domains (expanded list)
                if (
                    (url.includes("turbovidhls.com") ||
                        url.includes("turboviplay.com") ||
                        url.includes("jwplayer") ||
                        url.includes("/player/") ||
                        url.includes("/video/") ||
                        url.includes("streamtape") ||
                        url.includes("mixdrop") ||
                        url.includes("doodstream") ||
                        url.includes("upstream")) &&
                    !url.includes("searcho") && // Exclude ad domains
                    !url.includes("/ads/")
                ) {
                    this.log(`🎬 Video iframe found: ${url}`, "info");

                    // Wait a bit for iframe content to load
                    await this.page.waitForTimeout(2000);

                    // Try to verify the iframe has video content
                    try {
                        const hasVideoElements = await frame
                            .locator(
                                'video, .video-player, .jwplayer, [class*="player"]'
                            )
                            .count();
                        if (hasVideoElements > 0) {
                            this.log(
                                `Video elements detected in iframe`,
                                "info"
                            );
                            return true;
                        }
                    } catch (error) {
                        // Continue anyway, might still be loading
                    }

                    return true;
                }
            }

            const elapsed = Date.now() - startTime;
            if (elapsed % 3000 === 0) {
                // Log every 3 seconds
                this.log(
                    `Still waiting for video iframe... ${
                        elapsed / 1000
                    }s elapsed`,
                    "info"
                );

                // Log current iframe URLs for debugging
                const currentFrames = this.page.frames();
                for (const frame of currentFrames) {
                    const url = frame.url();
                    if (
                        url &&
                        url !== "about:blank" &&
                        !url.includes("searcho")
                    ) {
                        this.log(`Current iframe: ${url}`, "info");
                    }
                }
            }

            await this.page.waitForTimeout(1000);
        }

        this.log(
            `Video iframe not found after ${timeoutMs / 1000} seconds`,
            "warn"
        );
        return false;
    }

    private async clickButtonWithHumanBehavior(
        button: any,
        buttonText: string
    ): Promise<void> {
        // Wait longer to mimic human reading/decision time
        await this.page!.waitForTimeout(2000);

        // Scroll button into view
        await button.scrollIntoViewIfNeeded();
        await this.page!.waitForTimeout(500);

        // Hover over button first
        try {
            await button.hover({ timeout: 3000 });
            await this.page!.waitForTimeout(800);
        } catch {
            // Hover not critical
        }

        // Click with longer timeout
        this.log(
            `Clicking button: ${buttonText} with human-like behavior`,
            "info"
        );
        await button.click({ timeout: 10000 });

        // Wait for click to register
        await this.page!.waitForTimeout(1500);
    }

    private async monitorForVideoStreams(
        buttonName: string,
        timeout: number = 180
    ): Promise<{ success: boolean; processed: boolean }> {
        this.log(
            `Monitoring for video streams after clicking ${buttonName}...`,
            "info"
        );

        const startTime = Date.now();
        let framesBeforeCount = this.page!.frames().length;
        let playButtonClicked = false;
        let downloadStarted = false;

        // Set up download monitoring
        const downloadPromise = this.setupDownloadMonitoring();

        while (Date.now() - startTime < timeout * 1000) {
            // Check if play button handler suggests stopping
            if (!this.playButtonHandler.shouldContinueNavigation()) {
                this.log(
                    "Play button handler suggests stopping navigation",
                    "info"
                );
                break;
            }

            // Check if download started
            if (downloadStarted) {
                this.log(
                    "Download detected, waiting for completion...",
                    "info"
                );
                const downloadSuccess = await downloadPromise;
                if (downloadSuccess) {
                    this.log("Download completed successfully!", "info");
                    return { success: true, processed: true };
                }
            }

            // Try to click play buttons if we haven't found streams yet
            if (
                !playButtonClicked &&
                this.videoCandidates.length === 0 &&
                !this.directUrlFound
            ) {
                const elapsed = (Date.now() - startTime) / 1000;
                if (elapsed > 5) {
                    this.log(
                        "Trying play buttons during monitoring...",
                        "info"
                    );
                    const playSuccess =
                        await this.tryClickPlayButtonInIframes();
                    if (playSuccess) {
                        this.log("Play button clicked successfully", "info");
                        playButtonClicked = true;
                        // Give more time for streams to appear after play button click
                        await this.page!.waitForTimeout(3000);
                    } else {
                        // Fallback to old play button handler
                        await this.playButtonHandler.handlePlayButtons(
                            this.page!,
                            1
                        );
                        playButtonClicked = true;
                    }
                }
            }

            // Check if direct URL was found
            if (this.directUrlFound) {
                this.log(
                    "DIRECT URL FOUND - STOPPING ALL M3U8 PROCESSING!",
                    "info"
                );
                return { success: true, processed: false };
            }

            await this.page!.waitForTimeout(2000);

            // Update iframe monitoring for new frames
            const framesAfterCount = this.page!.frames().length;
            if (framesAfterCount > framesBeforeCount) {
                this.log(
                    `New iframe(s) detected: ${
                        framesAfterCount - framesBeforeCount
                    }`,
                    "info"
                );
                await this.iframeMonitor.setupMonitoring(
                    this.page!,
                    this.requestHandler
                );
                await this.iframeMonitor.waitForIframeContentLoad(this.page!);
                framesBeforeCount = framesAfterCount;

                // Try clicking play buttons in new iframes
                if (playButtonClicked) {
                    this.log(
                        "🎮 Trying play buttons in new iframes...",
                        "info"
                    );
                    await this.tryClickPlayButtonInIframes();
                }
            }

            // Extract video URLs directly from DOM
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed > 3) {
                const domVideos = await this.pageHelper.extractVideoUrlsFromDOM(
                    this.page!
                );
                if (domVideos.length > 0) {
                    this.log(
                        "FOUND VIDEO URL IN DOM - Processing immediately!",
                        "info"
                    );

                    // Convert DOM videos to candidates
                    for (const video of domVideos) {
                        const candidate: VideoCandidate = {
                            url: video.url,
                            headers: this.capturedHeaders,
                            timestamp: Date.now(),
                            domain: this.extractDomain(video.url),
                            source: `dom_extraction_${video.frame}`,
                            type: video.type,
                        };

                        if (
                            !this.videoCandidates.some(
                                (c) => c.url === video.url
                            )
                        ) {
                            this.videoCandidates.push(candidate);
                        }
                    }

                    // If we found direct video URLs, try to download them immediately
                    for (const video of domVideos) {
                        if (
                            video.type === "direct" &&
                            (video.url.endsWith(".mp4") ||
                                video.url.endsWith(".mkv") ||
                                video.url.endsWith(".avi"))
                        ) {
                            this.log(
                                "Attempting direct download of: ${video.url}",
                                "info"
                            );
                            const directSuccess =
                                await this.downloadDirectVideo(video.url);
                            if (directSuccess) {
                                return { success: true, processed: true };
                            }
                        } else if (
                            video.type === "m3u8" ||
                            video.url.includes(".m3u8")
                        ) {
                            this.log(
                                "Attempting M3U8 processing of: ${video.url}",
                                "info"
                            );
                            const m3u8Success = await this.processM3U8Directly(
                                video.url
                            );
                            if (m3u8Success) {
                                return { success: true, processed: true };
                            }
                        }
                    }

                    return { success: true, processed: false };
                }
            }

            // Check if we found M3U8 candidates
            const networkCandidates = this.networkMonitor.getVideoCandidates();
            const requestCandidates = this.requestHandler.getVideoCandidates();

            this.videoCandidates = [
                ...this.videoCandidates,
                ...networkCandidates.filter(
                    (nc) =>
                        !this.videoCandidates.some((vc) => vc.url === nc.url)
                ),
                ...requestCandidates.filter(
                    (rc) =>
                        !this.videoCandidates.some((vc) => vc.url === rc.url)
                ),
            ];

            if (this.videoCandidates.length > 0) {
                this.log(
                    `Found ${this.videoCandidates.length} video candidates!`,
                    "info"
                );

                // Wait a bit more if we just found candidates after play button click
                if (playButtonClicked && elapsed < 20) {
                    this.log(
                        "Found candidates after play button click, collecting more sources...",
                        "info"
                    );
                    continue;
                }

                // Process the candidates immediately and stop monitoring if successful
                this.log("Processing video candidates...", "info");
                const downloadSuccess = await this.processResults();
                if (downloadSuccess) {
                    this.log(
                        "Download started successfully! Stopping monitoring.",
                        "info"
                    );
                    return { success: true, processed: true };
                } else {
                    this.log(
                        "Failed to start download with current candidates, continuing monitoring...",
                        "warn"
                    );
                    // Clear failed candidates and continue monitoring
                    this.videoCandidates = [];
                }
            }

            // Show progress
            this.log(`Monitoring... ${elapsed.toFixed(1)}s elapsed`, "info");
        }

        this.log(`No video streams found after ${timeout}s monitoring`, "info");
        return { success: false, processed: false };
    }

    private async processResults(): Promise<boolean> {
        try {
            // Combine all candidates
            const allCandidates = [
                ...this.videoCandidates,
                ...this.networkMonitor.getVideoCandidates(),
                ...this.requestHandler.getVideoCandidates(),
            ];

            // Remove duplicates
            const uniqueCandidates = allCandidates.filter(
                (candidate, index, array) =>
                    array.findIndex((c) => c.url === candidate.url) === index
            );

            if (uniqueCandidates.length === 0) {
                this.log("No video candidates found to process", "warn");
                return false;
            }

            this.log(
                `Processing ${uniqueCandidates.length} unique video candidates`,
                "info"
            );

            // Try direct processing first for known video formats
            for (const candidate of uniqueCandidates) {
                try {
                    if (
                        candidate.url.endsWith(".mp4") ||
                        candidate.url.endsWith(".mkv") ||
                        candidate.url.endsWith(".avi")
                    ) {
                        this.log(
                            `Trying direct download for: ${candidate.url}`,
                            "info"
                        );
                        const directSuccess = await this.downloadDirectVideo(
                            candidate.url,
                            candidate.headers
                        );
                        if (directSuccess) {
                            return true;
                        }
                    } else if (
                        candidate.url.includes(".m3u8") ||
                        candidate.type === "m3u8"
                    ) {
                        this.log(
                            `Trying M3U8 processing for: ${candidate.url}`,
                            "info"
                        );
                        const m3u8Success = await this.processM3U8Directly(
                            candidate.url,
                            candidate.headers
                        );
                        if (m3u8Success) {
                            return true;
                        }
                    }
                } catch (error) {
                    this.log(
                        `Failed to process candidate ${candidate.url}: ${error}`,
                        "warn"
                    );
                    continue;
                }
            }

            // Fallback to stream handler for complex processing
            this.log(
                "Falling back to stream handler for complex processing",
                "info"
            );
            return await this.streamHandler.processResults(uniqueCandidates);
        } catch (error) {
            this.log(`Error in processResults: ${error}`, "error");
            return false;
        }
    }

    private extractDomain(url: string): string {
        try {
            return new URL(url).hostname;
        } catch {
            return "";
        }
    }

    private async cleanup(): Promise<void> {
        try {
            if (this.browser) {
                console.log("VideoDownloader: Cleaning up browser...");
                await this.browser.close();
                console.log("VideoDownloader: Browser cleanup completed");
            }
        } catch (error) {
            this.log(`Error during cleanup: ${error}`, "warn");
            console.error(
                "VideoDownloader: Cleanup error:",
                error instanceof Error ? error.message : String(error)
            );
        }

        // Also cleanup M3U8 processor if needed
        try {
            // The M3U8Processor handles its own cleanup internally
            this.log("VideoDownloader cleanup completed", "info");
        } catch (error) {
            this.log(`Error during M3U8 cleanup: ${error}`, "warn");
        }
    }

    // Public cleanup method for external use
    public async forceCleanup(): Promise<void> {
        await this.cleanup();
    }

    // Public methods for external use
    public getVideoCandidates(): VideoCandidate[] {
        return [...this.videoCandidates];
    }

    public getAllVideoRequests(): string[] {
        return [...this.allVideoRequests];
    }

    public isDirectUrlFound(): boolean {
        return this.directUrlFound;
    }

    public setDirectUrlFound(found: boolean): void {
        this.directUrlFound = found;
    }

    // Download monitoring setup
    private async setupDownloadMonitoring(): Promise<boolean> {
        if (!this.page) return false;

        return new Promise((resolve) => {
            let downloadDetected = false;

            // Monitor for download events in browser context
            this.page!.context().on("page", async (newPage) => {
                try {
                    const url = newPage.url();
                    if (
                        url.includes("download") ||
                        url.includes(".mp4") ||
                        url.includes(".mkv")
                    ) {
                        this.log(`Download page detected: ${url}`, "info");
                        downloadDetected = true;
                        resolve(true);
                    }
                } catch (error) {
                    // Continue monitoring
                }
            });

            // Monitor for response headers indicating downloads
            this.page!.on("response", async (response) => {
                try {
                    const headers = response.headers();
                    const contentDisposition = headers["content-disposition"];
                    const contentType = headers["content-type"];

                    if (
                        contentDisposition &&
                        contentDisposition.includes("attachment")
                    ) {
                        this.log(
                            `Download response detected: ${response.url()}`,
                            "info"
                        );
                        downloadDetected = true;
                        resolve(true);
                    }

                    if (
                        contentType &&
                        (contentType.includes("video/") ||
                            contentType.includes("application/octet-stream"))
                    ) {
                        const url = response.url();
                        if (
                            url.includes(".mp4") ||
                            url.includes(".mkv") ||
                            url.includes(".avi")
                        ) {
                            this.log(
                                `Video file response detected: ${url}`,
                                "info"
                            );
                            downloadDetected = true;
                            resolve(true);
                        }
                    }
                } catch (error) {
                    // Continue monitoring
                }
            });

            // Set timeout for download monitoring
            setTimeout(() => {
                if (!downloadDetected) {
                    resolve(false);
                }
            }, 30000); // 30 second timeout
        });
    }

    // Direct M3U8 processing methods for easier access
    public async processM3U8Directly(
        m3u8Url: string,
        headers: Record<string, string> = {}
    ): Promise<boolean> {
        this.log(`Processing M3U8 directly: ${m3u8Url}`, "info");

        try {
            // Use captured headers if no headers provided, and add browser context headers
            const finalHeaders =
                Object.keys(headers).length > 0
                    ? headers
                    : this.capturedHeaders;

            // Add additional headers that match the browser session - using EXACT Python headers
            const enhancedHeaders = {
                ...finalHeaders,
                Referer: this.config.url, // Use the original page URL as referer
                Origin: this.extractDomain(this.config.url),
                // Use EXACT same User-Agent as Python script
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                DNT: "1",
                Connection: "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Cache-Control": "max-age=0",
            };

            // First attempt with M3U8Processor (pass browser page for session context)
            let success = await this.m3u8Processor.processM3U8(
                m3u8Url,
                enhancedHeaders,
                this.page
            );

            // If that fails, try using the browser to fetch the M3U8 content
            if (!success && this.page) {
                this.log(
                    "M3U8Processor failed, trying browser-based approach...",
                    "info"
                );
                success = await this.procesM3U8WithBrowser(m3u8Url);
            }

            // If browser approach fails, try direct TypeScript approach
            if (!success) {
                this.log(
                    "Browser-based approach failed, trying TypeScript M3U8 processor...",
                    "info"
                );
                success = await this.m3u8Processor.processM3U8(
                    m3u8Url,
                    this.capturedHeaders
                );
            }

            if (success) {
                this.log(
                    "Direct M3U8 processing completed successfully",
                    "info"
                );
                this.playButtonHandler.markDownloadCompleted();
            } else {
                this.log(
                    "Direct M3U8 processing failed with all methods",
                    "error"
                );
            }

            return success;
        } catch (error) {
            this.log(`Error in direct M3U8 processing: ${error}`, "error");
            return false;
        }
    }

    private async procesM3U8WithBrowser(m3u8Url: string): Promise<boolean> {
        if (!this.page) return false;

        try {
            this.log(
                `Trying browser-based M3U8 processing: ${m3u8Url}`,
                "info"
            );

            // Use the browser to fetch the M3U8 content (this uses the same session/cookies)
            const response = await this.page.evaluate(async (url) => {
                try {
                    const response = await fetch(url, {
                        method: "GET",
                        credentials: "include", // Include cookies
                        headers: {
                            // Use EXACT same headers as Python script for consistency
                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.9",
                            "Accept-Encoding": "gzip, deflate, br",
                            DNT: "1",
                            Connection: "keep-alive",
                            "Upgrade-Insecure-Requests": "1",
                            "Sec-Fetch-Dest": "document",
                            "Sec-Fetch-Mode": "navigate",
                            "Sec-Fetch-Site": "none",
                            "Sec-Fetch-User": "?1",
                            "Cache-Control": "max-age=0",
                        },
                    });

                    if (!response.ok) {
                        throw new Error(
                            `HTTP ${response.status}: ${response.statusText}`
                        );
                    }

                    const text = await response.text();
                    return {
                        success: true,
                        content: text,
                        status: response.status,
                    };
                } catch (error) {
                    return {
                        success: false,
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    };
                }
            }, m3u8Url);

            if (response.success && response.content) {
                this.log(
                    `Successfully fetched M3U8 content via browser (${response.content.length} chars)`,
                    "info"
                );

                // Process the M3U8 content directly using Python-style approach
                return await this.processPythonStyleM3U8(
                    m3u8Url,
                    response.content
                );
            } else {
                this.log(
                    `Browser-based M3U8 fetch failed: ${response.error}`,
                    "warn"
                );
                return false;
            }
        } catch (error) {
            this.log(
                `Error in browser-based M3U8 processing: ${error}`,
                "error"
            );
            return false;
        }
    }

    private async processPythonStyleM3U8(
        baseUrl: string,
        m3u8Content: string
    ): Promise<boolean> {
        try {
            this.log(`Processing M3U8 with Python-style approach`, "info");

            // Parse M3U8 content manually (like Python version)
            const lines = m3u8Content
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line);
            const segments: string[] = [];
            let isPlaylist = false;

            // Check if this is a master playlist
            for (const line of lines) {
                if (line.startsWith("#EXT-X-STREAM-INF:")) {
                    isPlaylist = true;
                    break;
                }
            }

            if (isPlaylist) {
                this.log(
                    `Master playlist detected, selecting best quality`,
                    "info"
                );

                // Find the best quality variant
                let bestBandwidth = 0;
                let bestVariantUrl = "";

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.startsWith("#EXT-X-STREAM-INF:")) {
                        const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
                        const bandwidth = bandwidthMatch
                            ? parseInt(bandwidthMatch[1])
                            : 0;

                        if (bandwidth > bestBandwidth && i + 1 < lines.length) {
                            const nextLine = lines[i + 1];
                            if (!nextLine.startsWith("#")) {
                                bestBandwidth = bandwidth;
                                bestVariantUrl = nextLine;
                            }
                        }
                    }
                }

                if (bestVariantUrl) {
                    const fullVariantUrl = this.resolveUrl(
                        bestVariantUrl,
                        baseUrl
                    );
                    this.log(
                        `Selected best quality variant: ${fullVariantUrl}`,
                        "info"
                    );

                    // Fetch the variant playlist using browser
                    const variantResponse = await this.page!.evaluate(
                        async (url) => {
                            try {
                                const response = await fetch(url, {
                                    method: "GET",
                                    credentials: "include",
                                    headers: {
                                        // Use EXACT same headers as Python script for consistency
                                        "User-Agent":
                                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                                        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                                        "Accept-Language": "en-US,en;q=0.9",
                                        "Accept-Encoding": "gzip, deflate, br",
                                        DNT: "1",
                                        Connection: "keep-alive",
                                        "Upgrade-Insecure-Requests": "1",
                                        "Sec-Fetch-Dest": "document",
                                        "Sec-Fetch-Mode": "navigate",
                                        "Sec-Fetch-Site": "none",
                                        "Sec-Fetch-User": "?1",
                                        "Cache-Control": "max-age=0",
                                    },
                                });

                                if (!response.ok) {
                                    throw new Error(
                                        `HTTP ${response.status}: ${response.statusText}`
                                    );
                                }

                                const text = await response.text();
                                return { success: true, content: text };
                            } catch (error) {
                                return {
                                    success: false,
                                    error:
                                        error instanceof Error
                                            ? error.message
                                            : String(error),
                                };
                            }
                        },
                        fullVariantUrl
                    );

                    if (variantResponse.success && variantResponse.content) {
                        return await this.processPythonStyleM3U8(
                            fullVariantUrl,
                            variantResponse.content
                        );
                    } else {
                        this.log(
                            `Failed to fetch variant playlist: ${variantResponse.error}`,
                            "error"
                        );
                        return false;
                    }
                }
            } else {
                // Extract segments from the playlist
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.startsWith("#EXTINF:") && i + 1 < lines.length) {
                        const nextLine = lines[i + 1];
                        if (!nextLine.startsWith("#")) {
                            const segmentUrl = this.resolveUrl(
                                nextLine,
                                baseUrl
                            );
                            segments.push(segmentUrl);
                        }
                    }
                }

                if (segments.length === 0) {
                    this.log(`No segments found in M3U8 playlist`, "error");
                    return false;
                }

                this.log(
                    `Found ${segments.length} segments to download`,
                    "info"
                );

                // Use TypeScript M3U8 processor for actual downloading
                return await this.m3u8Processor.processM3U8(
                    baseUrl,
                    this.capturedHeaders,
                    this.page
                );
            }

            return false;
        } catch (error) {
            this.log(`Error in TypeScript M3U8 processing: ${error}`, "error");
            return false;
        }
    }

    private resolveUrl(url: string, baseUrl: string): string {
        if (url.startsWith("http")) {
            return url;
        }

        try {
            return new URL(url, baseUrl).toString();
        } catch {
            // Fallback for malformed URLs
            const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
            return base + url;
        }
    }

    public async downloadDirectVideo(
        videoUrl: string,
        headers: Record<string, string> = {}
    ): Promise<boolean> {
        this.log(`Downloading direct video: ${videoUrl}`, "info");

        try {
            // Use captured headers if no headers provided
            const finalHeaders =
                Object.keys(headers).length > 0
                    ? headers
                    : this.capturedHeaders;

            const success = await this.m3u8Processor.downloadDirectVideo(
                videoUrl,
                finalHeaders
            );

            if (success) {
                this.log(
                    "Direct video download completed successfully",
                    "info"
                );
                this.playButtonHandler.markDownloadCompleted();
                this.directUrlFound = true;
            } else {
                this.log("Direct video download failed", "error");
            }

            return success;
        } catch (error) {
            this.log(`Error in direct video download: ${error}`, "error");
            return false;
        }
    }

    public async handlePopupsManually(): Promise<void> {
        if (!this.page) {
            this.log("No page available for popup handling", "warn");
            return;
        }

        this.log("Manual popup handling requested", "info");

        try {
            await this.popupHandler.closePopups(this.page);
            this.log("Manual popup handling completed", "info");
        } catch (error) {
            this.log(`Error in manual popup handling: ${error}`, "error");
        }
    }

    public async closeSpecificPopup(selector: string): Promise<boolean> {
        if (!this.page) {
            this.log("No page available for popup handling", "warn");
            return false;
        }

        this.log(`Closing specific popup: ${selector}`, "info");

        try {
            return await this.popupHandler.closeSpecificPopup(
                this.page,
                selector
            );
        } catch (error) {
            this.log(`Error closing specific popup: ${error}`, "error");
            return false;
        }
    }
}
