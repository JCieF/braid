import { Request, Response } from "playwright";
import { VideoCandidate } from "../types/index.js";
import { LogAgent, Logger } from "../helpers/StringBuilder.js";

export class RequestHandler {
    private logger: LogAgent;
    private videoCandidates: VideoCandidate[] = [];
    private allVideoRequests: string[] = [];
    private capturedHeaders: Record<string, string> = {};

    constructor(logger: Logger) {
        this.logger = logger.agent("RequestHandler");
    }

    async handleRequest(request: Request): Promise<void> {
        const url = request.url();
        const urlLower = url.toLowerCase();

        // Only process video-related URLs from allowed domains
        if (this.isVideoRelatedUrl(urlLower)) {
            this.capturedHeaders = {
                "User-Agent": request.headers()["user-agent"] || "",
                Referer: request.headers()["referer"] || "",
                Origin: request.headers()["origin"] || "",
                Cookie: request.headers()["cookie"] || "",
                Accept: request.headers()["accept"] || "*/*",
                "Accept-Language":
                    request.headers()["accept-language"] || "en-US,en;q=0.9",
            };

            this.allVideoRequests.push(url);
            this.logger.log(
                `Video-related request: ${request.method()} ${url}`,
                "info"
            );

            // Look for M3U8 streams (only from allowed domains)
            if (urlLower.includes(".m3u8")) {
                this.logger.log(`M3U8 detected: ${url}`, "info");

                const candidate: VideoCandidate = {
                    url,
                    headers: { ...this.capturedHeaders },
                    timestamp: Date.now(),
                    domain: this.extractDomain(url),
                    source: "request_handler",
                };

                // Avoid duplicates
                if (!this.videoCandidates.some((c) => c.url === url)) {
                    this.videoCandidates.push(candidate);
                    this.logger.log(`Added M3U8 candidate: ${url}`, "info");
                }
            }
        }

        // Direct video files are handled above in the isVideoRelatedUrl check
    }

    async handleResponse(response: Response): Promise<void> {
        const url = response.url();
        const urlLower = url.toLowerCase();

        if (this.isVideoRelatedUrl(urlLower)) {
            this.logger.log(
                `Video response: ${response.status()} ${url}`,
                "info"
            );

            // Special handling for M3U8 responses
            if (urlLower.includes(".m3u8")) {
                const candidate: VideoCandidate = {
                    url,
                    headers: this.capturedHeaders,
                    timestamp: Date.now(),
                    domain: this.extractDomain(url),
                    source: "response_handler",
                    status: response.status(),
                };

                if (!this.videoCandidates.some((c) => c.url === url)) {
                    this.videoCandidates.push(candidate);
                }
            }
        }
    }

    private isVideoRelatedUrl(url: string): boolean {
        // Block ALL sacdnssedge and growcdnssedge domains completely - even M3U8 files
        if (url.includes("sacdnssedge") || url.includes("growcdnssedge")) {
            return false;
        }

        // Block ad networks
        if (
            url.includes("tscprts.com") ||
            url.includes("mnaspm.com") ||
            url.includes("tsyndicate.com")
        ) {
            return false;
        }

        // Only allow M3U8 from completely different domains
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

    getAllVideoRequests(): string[] {
        return [...this.allVideoRequests];
    }

    getCapturedHeaders(): Record<string, string> {
        return { ...this.capturedHeaders };
    }

    clearCandidates(): void {
        this.videoCandidates = [];
        this.allVideoRequests = [];
    }
}
