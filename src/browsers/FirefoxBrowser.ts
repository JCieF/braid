import { firefox, Browser, BrowserContext, Page } from "playwright";
import { BrowserConfig } from "../types/index.js";
import { LogAgent, Logger } from "../helpers/StringBuilder.js";

export class FirefoxBrowser {
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;
    private logger: LogAgent;
    private config: BrowserConfig = {};

    constructor(logger: Logger) {
        this.logger = logger.agent("FirefoxBrowser");
    }

    async launch(config: BrowserConfig = {}): Promise<void> {
        this.config = config;
        try {
            this.browser = await firefox.launch({
                headless: config.headless ?? true,
                // Use minimal args - custom args were causing context closure issues
                args: [],
            });

            this.context = await this.browser.newContext({
                viewport: config.viewport ?? { width: 1920, height: 1080 },
                userAgent:
                    config.userAgent ??
                    "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0",
                ignoreHTTPSErrors: config.ignoreHTTPSErrors ?? true,
                javaScriptEnabled: config.javaScriptEnabled ?? true,
                // Firefox-specific settings
                permissions: [],
                extraHTTPHeaders: {
                    "Accept-Language": "en-US,en;q=0.9",
                },
            });

            this.logger.log(
                "Firefox browser launched with enhanced privacy settings",
                "info"
            );
        } catch (error) {
            this.logger.log(
                `Failed to launch Firefox browser: ${error}`,
                "error"
            );
            throw error;
        }
    }

    async getPage(url?: string): Promise<Page> {
        if (!this.context) {
            throw new Error(
                "Browser context not initialized. Call launch() first."
            );
        }

        const page = await this.context.newPage();

        // Enable request interception if image blocking is enabled
        if (this.config.disableImages) {
            await page.route("**/*", (route) => {
                const request = route.request();
                const resourceType = request.resourceType();

                // Block image requests
                if (resourceType === "image") {
                    this.logger.log(
                        `Blocked image request: ${request.url()}`,
                        "debug"
                    );
                    route.abort();
                } else {
                    route.continue();
                }
            });
            this.logger.log("Image loading disabled for this page", "info");
        }

        // Set up request/response logging
        page.on("request", (request) => this.logRequest(request));
        page.on("response", (response) => this.logResponse(response));

        if (url) {
            try {
                this.logger.log(`Navigating to: ${url}`, "info");
                await page.goto(url, {
                    waitUntil: "domcontentloaded",
                    timeout: 30000,
                });
                this.logger.log("Page loaded successfully", "info");

                // Wait for dynamic content
                await page.waitForTimeout(3000);
            } catch (error) {
                this.logger.log(
                    `Page load timeout, but continuing anyway: ${error}`,
                    "warn"
                );
            }
        }

        return page;
    }

    private logRequest(request: any): void {
        const url = request.url();
        if (this.isVideoRelatedUrl(url)) {
            this.logger.log(`REQUEST: ${request.method()} ${url}`, "info");
        }
    }

    private logResponse(response: any): void {
        const url = response.url();
        if (this.isVideoRelatedUrl(url)) {
            this.logger.log(`RESPONSE: ${response.status()} ${url}`, "info");
        }
    }

    private isVideoRelatedUrl(url: string): boolean {
        // Block ALL sacdnssedge domains completely
        if (
            url.includes("sacdnssedge") ||
            url.includes("tscprts.com") ||
            url.includes("mnaspm.com") ||
            url.includes("tsyndicate.com")
        ) {
            return false;
        }

        return url.includes(".m3u8");
    }

    async close(): Promise<void> {
        try {
            if (this.browser) {
                await this.browser.close();
                this.logger.log("Firefox browser closed", "info");
            }
        } catch (error) {
            this.logger.log(`Error closing Firefox browser: ${error}`, "warn");
        }
    }
}
