import { Page } from "playwright";
import { VideoCandidate } from "../types/index.js";
import { LogAgent, Logger } from "../helpers/StringBuilder.js";

export class NetworkMonitor {
    private logger: LogAgent;
    private capturedHeaders: Record<string, string> = {};
    private videoCandidates: VideoCandidate[] = [];

    constructor(logger: Logger) {
        this.logger = logger.agent("NetworkMonitor");
    }

    setupComprehensiveMonitoring(page: Page): void {
        this.logger.log(
            "Setting up comprehensive network monitoring...",
            "info"
        );

        // Track all requests and responses like a real browser
        page.on("request", (request) => {
            const url = request.url().toLowerCase();

            // Log important requests that indicate proper page loading
            if (this.isImportantRequest(url)) {
                this.logger.log(
                    `BROWSER-LIKE REQUEST: ${request.method()} ${request.url()}`,
                    "info"
                );

                // Store headers for video-related requests
                if (this.isVideoRelatedUrl(url)) {
                    this.capturedHeaders = {
                        "User-Agent": request.headers()["user-agent"] || "",
                        Referer: request.headers()["referer"] || "",
                        Origin:
                            request.headers()["origin"] || "https://jav.guru",
                        Cookie: request.headers()["cookie"] || "",
                        Accept: request.headers()["accept"] || "*/*",
                        "Accept-Language":
                            request.headers()["accept-language"] ||
                            "en-US,en;q=0.9",
                    };
                }
            }
        });

        page.on("response", (response) => {
            const url = response.url().toLowerCase();

            // Log successful responses for important resources
            if (response.status() === 200 && this.isImportantRequest(url)) {
                this.logger.log(
                    `SUCCESSFUL RESPONSE: ${response.status()} ${response.url()}`,
                    "info"
                );

                // Special handling for M3U8 responses
                if (url.includes(".m3u8")) {
                    this.logger.log(
                        `M3U8 RESPONSE DETECTED: ${response.url()}`,
                        "info"
                    );

                    const candidate: VideoCandidate = {
                        url: response.url(),
                        headers: { ...this.capturedHeaders },
                        timestamp: Date.now(),
                        domain: this.extractDomain(response.url()),
                        source: "comprehensive_monitoring",
                        status: response.status(),
                    };

                    // Avoid duplicates
                    if (
                        !this.videoCandidates.some(
                            (c) => c.url === response.url()
                        )
                    ) {
                        this.videoCandidates.push(candidate);
                    }
                }
            }
        });

        this.logger.log(
            "Comprehensive network monitoring setup complete",
            "info"
        );
    }

    private isImportantRequest(url: string): boolean {
        // Block ALL sacdnssedge and growcdnssedge domains completely
        if (
            url.includes("sacdnssedge") ||
            url.includes("growcdnssedge") ||
            url.includes("tscprts.com") ||
            url.includes("mnaspm.com") ||
            url.includes("tsyndicate.com")
        ) {
            return false;
        }

        // Only log jwplayer and M3U8 from clean domains
        return url.includes("jwplayer") || url.includes(".m3u8");
    }

    private isVideoRelatedUrl(url: string): boolean {
        // Block ALL sacdnssedge and growcdnssedge domains completely
        if (
            url.includes("sacdnssedge") ||
            url.includes("growcdnssedge") ||
            url.includes("tscprts.com") ||
            url.includes("mnaspm.com") ||
            url.includes("tsyndicate.com")
        ) {
            return false;
        }

        return url.includes(".m3u8");
    }

    private extractDomain(url: string): string {
        try {
            return new URL(url).hostname;
        } catch {
            return "";
        }
    }

    getVideoCandidates(): VideoCandidate[] {
        return [...this.videoCandidates];
    }

    getCapturedHeaders(): Record<string, string> {
        return { ...this.capturedHeaders };
    }

    clearCandidates(): void {
        this.videoCandidates = [];
    }
}
