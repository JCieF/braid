import { chromium, Browser, BrowserContext, Page } from "playwright";
import { BrowserConfig } from "../types/index.js";
import { LogAgent, Logger } from "../helpers/StringBuilder.js";

export class ChromiumBrowser {
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;
    private logger: LogAgent;

    constructor(logger: Logger) {
        this.logger = logger.agent("ChromiumBrowser");
    }

    async launch(config: BrowserConfig = {}): Promise<void> {
        try {
            const launchOptions: any = {
                headless: config.headless ?? true,
                args: [
                    "--no-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-web-security",
                    "--allow-running-insecure-content",
                    "--disable-features=VizDisplayCompositor",
                    "--block-new-web-contents",
                    "--disable-popup-blocking=false",
                    "--disable-background-networking",
                    "--disable-background-timer-throttling",
                    "--disable-renderer-backgrounding",
                    "--disable-backgrounding-occluded-windows",
                    "--enable-logging",
                    "--log-level=0",
                    "--enable-network-service-logging",
                ],
            };

            if (config.userDataDir) {
                launchOptions.userDataDir = config.userDataDir;
            }

            this.browser = await chromium.launch(launchOptions);

            this.context = await this.browser.newContext({
                viewport: config.viewport ?? { width: 1920, height: 1080 },
                userAgent:
                    config.userAgent ??
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                ignoreHTTPSErrors: config.ignoreHTTPSErrors ?? true,
                javaScriptEnabled: config.javaScriptEnabled ?? true,
            });

            this.logger.log("Chromium browser launched", "info");
        } catch (error) {
            this.logger.log(
                `Failed to launch Chromium browser: ${error}`,
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
        const patterns = ["m3u8", "mp4", "ts", "stream"];
        return patterns.some((pattern) => url.toLowerCase().includes(pattern));
    }

    async close(): Promise<void> {
        try {
            if (this.browser) {
                await this.browser.close();
                this.logger.log("Chromium browser closed", "info");
            }
        } catch (error) {
            this.logger.log(`Error closing Chromium browser: ${error}`, "warn");
        }
    }
}
