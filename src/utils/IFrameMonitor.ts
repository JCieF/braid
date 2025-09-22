import { Page, Frame } from "playwright";
import { RequestHandler } from "../handlers/RequestHandler.js";
import { LogAgent, Logger } from "../helpers/StringBuilder.js";

export class IFrameMonitor {
    private logger: LogAgent;
    private monitoredFrames: Set<string> = new Set();

    constructor(logger: Logger) {
        this.logger = logger.agent("IFrameMonitor");
    }

    async setupMonitoring(
        page: Page,
        requestHandler: RequestHandler
    ): Promise<void> {
        this.logger.log("Setting up iframe monitoring...", "info");

        // Monitor existing frames
        await this.monitorExistingFrames(page, requestHandler);

        // Monitor new frames as they are created
        page.on("frameattached", async (frame) => {
            this.logger.log(`New iframe attached: ${frame.url()}`, "info");
            await this.monitorFrame(frame, requestHandler);
        });

        // Monitor frame navigation
        page.on("framenavigated", async (frame) => {
            if (frame !== page.mainFrame()) {
                this.logger.log(`Iframe navigated: ${frame.url()}`, "info");
                await this.monitorFrame(frame, requestHandler);
            }
        });

        this.logger.log("Iframe monitoring setup complete", "info");
    }

    private async monitorExistingFrames(
        page: Page,
        requestHandler: RequestHandler
    ): Promise<void> {
        const frames = page.frames();

        for (const frame of frames) {
            if (frame !== page.mainFrame()) {
                await this.monitorFrame(frame, requestHandler);
            }
        }
    }

    private async monitorFrame(
        frame: Frame,
        requestHandler: RequestHandler
    ): Promise<void> {
        const frameUrl = frame.url();

        if (!frameUrl || this.monitoredFrames.has(frameUrl)) {
            return;
        }

        this.monitoredFrames.add(frameUrl);

        if (this.isVideoRelatedFrame(frameUrl)) {
            this.logger.log(`Monitoring video iframe: ${frameUrl}`, "info");

            // Note: Frame doesn't have 'on' method in Playwright
            // Request/response monitoring is handled at the page level
            // This is just for content analysis

            // Analyze the frame content
            await this.analyzeFrameContent(frame);
        }
    }

    private isVideoRelatedFrame(url: string): boolean {
        const videoIndicators = [
            "embed",
            "player",
            "/e/",
            "/t/",
            "/v/",
            "javplaya.com",
            "streamhihi.com",
            "maxstream.org",
            "emturbovid.com",
            "streamtape.com",
            "vidhide.com",
            "turbovidhls.com",
            "turboviplay.com",
        ];

        const urlLower = url.toLowerCase();
        return videoIndicators.some((indicator) =>
            urlLower.includes(indicator)
        );
    }

    private async analyzeFrameContent(frame: Frame): Promise<void> {
        try {
            this.logger.log(`Analyzing iframe content: ${frame.url()}`, "info");

            // Wait for frame to load
            await frame.waitForLoadState("domcontentloaded", { timeout: 5000 });

            // Look for video elements
            const videoElements = await frame.evaluate(() => {
                const videos: any[] = [];

                // Check video tags
                document.querySelectorAll("video").forEach((video) => {
                    if (
                        video.src &&
                        video.src.length > 0 &&
                        !video.src.startsWith("blob:")
                    ) {
                        videos.push({
                            type: "video_src",
                            url: video.src,
                            element: "video",
                        });
                    }
                    if (
                        video.currentSrc &&
                        video.currentSrc.length > 0 &&
                        !video.currentSrc.startsWith("blob:")
                    ) {
                        videos.push({
                            type: "video_currentSrc",
                            url: video.currentSrc,
                            element: "video",
                        });
                    }
                });

                // Check for JWPlayer
                if (typeof (window as any).jwplayer !== "undefined") {
                    try {
                        const instances = (window as any)
                            .jwplayer()
                            .getContainer();
                        if (instances) {
                            const playlist = (window as any)
                                .jwplayer()
                                .getPlaylist();
                            if (playlist && playlist.length > 0) {
                                playlist.forEach((item: any) => {
                                    if (item.file) {
                                        videos.push({
                                            type: "jwplayer_file",
                                            url: item.file,
                                            element: "jwplayer",
                                        });
                                    }
                                    if (item.sources) {
                                        item.sources.forEach((source: any) => {
                                            if (source.file) {
                                                videos.push({
                                                    type: "jwplayer_source",
                                                    url: source.file,
                                                    element: "jwplayer",
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    } catch (e) {
                        this.logger.log(`JWPlayer check failed: ${e}`, "info");
                    }
                }

                // Check source elements
                document.querySelectorAll("source").forEach((source) => {
                    if (source.src && source.src.length > 0) {
                        videos.push({
                            type: "source_src",
                            url: source.src,
                            element: "source",
                        });
                    }
                });

                return videos;
            });

            if (videoElements.length > 0) {
                this.logger.log(
                    `Found ${videoElements.length} video elements in iframe`,
                    "info"
                );

                for (const element of videoElements) {
                    this.logger.log(
                        `${element.type} (${element.element}): ${element.url}`,
                        "info"
                    );
                }
            }
        } catch (error) {
            this.logger.log(`Error analyzing iframe content: ${error}`, "info");
        }
    }

    async waitForIframeContentLoad(page: Page): Promise<void> {
        this.logger.log("Waiting for iframe content to fully load...", "info");

        const frames = page.frames();

        for (const frame of frames) {
            if (frame !== page.mainFrame() && frame.url()) {
                try {
                    // Wait for iframe to be ready
                    await frame.waitForLoadState("domcontentloaded", {
                        timeout: 5000,
                    });

                    // Check if iframe has video player elements
                    const hasVideoElements = await frame.evaluate(() => {
                        const videoElements = document.querySelectorAll(
                            'video, .jwplayer, [id*="player"], [class*="player"]'
                        );
                        return videoElements.length > 0;
                    });

                    if (hasVideoElements) {
                        this.logger.log(
                            `Video player elements found in iframe: ${frame.url()}`,
                            "info"
                        );
                        // Wait additional time for video player initialization
                        await page.waitForTimeout(3000);
                    }
                } catch (error) {
                    this.logger.log(
                        `Could not check iframe content: ${error}`,
                        "debug"
                    );
                }
            }
        }
    }

    getMonitoredFrames(): string[] {
        return Array.from(this.monitoredFrames);
    }

    clearMonitoredFrames(): void {
        this.monitoredFrames.clear();
    }
}
