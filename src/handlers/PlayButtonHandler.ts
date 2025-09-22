import { Page } from "playwright";
import { LogAgent, Logger } from "../helpers/StringBuilder.js";

export class PlayButtonHandler {
    private logger: LogAgent;
    private downloadCompleted: boolean = false;
    private shouldTerminate: boolean = false;

    constructor(logger: Logger) {
        this.logger = logger.agent("PlayButtonHandler");
    }

    async handlePlayButtons(
        page: Page,
        maxAttempts: number = 2
    ): Promise<void> {
        this.logger.log("Starting automatic play button handling...", "info");

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            this.logger.log(
                `Play button attempt ${attempt}/${maxAttempts}`,
                "info"
            );

            // Try main page first
            let clicked = await this.tryClickPlayButton(page);

            // If not found in main page, try iframes
            if (!clicked) {
                clicked = await this.tryClickPlayButtonInIframes(page);
            }

            if (clicked) {
                this.logger.log(
                    "Play button clicked! Waiting for video streams to load...",
                    "info"
                );
                // Wait longer for video initialization
                await page.waitForTimeout(12000);

                // Try clicking additional play buttons if needed
                this.logger.log(
                    "Checking if additional play button clicks needed...",
                    "info"
                );
                const additionalClick =
                    (await this.tryClickPlayButton(page, true)) ||
                    (await this.tryClickPlayButtonInIframes(page, true));
                if (additionalClick) {
                    this.logger.log("Additional play button clicked!", "info");
                    await page.waitForTimeout(8000);
                }

                break;
            } else {
                await page.waitForTimeout(2000);
            }
        }
    }

    private async tryClickPlayButton(
        page: Page,
        quickCheck: boolean = false
    ): Promise<boolean> {
        const playButtonSelectors = [
            // Specific selectors from the actual page (highest priority)
            "div.playbutton",
            ".playbutton",
            '[onclick*="start_player"]',
            '[onclick="start_player()"]',
            'div[onclick*="start_player"]',
            // Other common selectors
            '[onclick*="start_player" i]',
            // Common play button selectors
            ".jw-display-icon-container",
            ".jw-display-icon-play",
            ".jwplayer .jw-icon-play",
            ".video-js .vjs-big-play-button",
            ".plyr__control--overlaid",
            '[aria-label*="play" i]',
            '[title*="play" i]',
            'button[class*="play"]',
            ".play-button",
            ".play-btn",
            "#play-button",
            // SVG play buttons
            'svg[class*="play"]',
            // Generic play indicators
            '[data-role="play"]',
            '[onclick*="play"]',
            // Video elements that might be clickable
            "#vplayer",
            ".video-container",
        ];

        if (quickCheck) {
            this.logger.log(
                "Quick check for additional play buttons...",
                "info"
            );
            // For quick check, only try the most common selectors
            playButtonSelectors.splice(8);
        } else {
            this.logger.log("Looking for play button...", "info");
        }

        // Try play button in main frame first
        for (const selector of playButtonSelectors) {
            try {
                const elements = page.locator(selector);
                const count = await elements.count();

                if (count > 0) {
                    for (let i = 0; i < count; i++) {
                        try {
                            const button = elements.nth(i);
                            const isVisible = await button.isVisible();

                            if (isVisible) {
                                this.logger.log(
                                    `Clicking play button with selector: ${selector}`,
                                    "info"
                                );
                                await button.click({ timeout: 3000 });
                                await page.waitForTimeout(3000);
                                return true;
                            }
                        } catch (error) {
                            this.logger.log(
                                `Failed to click play button ${i}: ${error}`,
                                "debug"
                            );
                        }
                    }
                }
            } catch (error) {
                this.logger.log(
                    `Error with play button selector ${selector}: ${error}`,
                    "debug"
                );
            }
        }

        // Try play button in iframes
        const frames = page.frames();
        for (const frame of frames) {
            if (frame !== page.mainFrame()) {
                try {
                    for (const selector of playButtonSelectors) {
                        try {
                            const elements = frame.locator(selector);
                            const count = await elements.count();

                            if (count > 0) {
                                for (let i = 0; i < count; i++) {
                                    try {
                                        const button = elements.nth(i);
                                        const isVisible =
                                            await button.isVisible();

                                        if (isVisible) {
                                            this.logger.log(
                                                `Clicking play button in iframe with selector: ${selector}`,
                                                "info"
                                            );
                                            await button.click({
                                                timeout: 3000,
                                            });
                                            await page.waitForTimeout(3000);
                                            return true;
                                        }
                                    } catch (error) {
                                        this.logger.log(
                                            `Failed to click iframe play button ${i}: ${error}`,
                                            "debug"
                                        );
                                    }
                                }
                            }
                        } catch (error) {
                            this.logger.log(
                                `Error with iframe play button selector ${selector}: ${error}`,
                                "debug"
                            );
                        }
                    }
                } catch (error) {
                    this.logger.log(
                        `Error accessing iframe for play button: ${error}`,
                        "debug"
                    );
                }
            }
        }

        this.logger.log("No play button found or clicked", "info");
        return false;
    }

    private async tryClickPlayButtonInIframes(
        page: Page,
        quickCheck: boolean = false
    ): Promise<boolean> {
        this.logger.log("Looking for play button in iframes...", "info");

        const frames = page.frames();

        for (const frame of frames) {
            if (frame === page.mainFrame()) continue; // Skip main frame

            try {
                const frameUrl = frame.url();
                if (!frameUrl || frameUrl === "about:blank") continue;

                this.logger.log(
                    `Checking iframe for play button: ${frameUrl}`,
                    "info"
                );

                // Use the same selectors as main page
                const playButtonSelectors = [
                    "div.playbutton",
                    ".playbutton",
                    '[onclick*="start_player"]',
                    '[onclick="start_player()"]',
                    'div[onclick*="start_player"]',
                    'button[data-action="play"]',
                    ".video-play-button",
                    ".play-btn",
                    ".play-button",
                    "button.play",
                    ".jw-display-icon-container",
                    ".jw-icon-play",
                    ".vjs-big-play-button",
                    'button[aria-label*="play" i]',
                    'button[title*="play" i]',
                    '[role="button"][aria-label*="play" i]',
                    'div[class*="play" i][role="button"]',
                    'button[class*="play" i]',
                    ".video-overlay-play-button",
                    ".plyr__control--overlaid",
                ];

                for (const selector of playButtonSelectors) {
                    try {
                        const button = frame.locator(selector).first();
                        const isVisible = await button.isVisible({
                            timeout: quickCheck ? 1000 : 3000,
                        });

                        if (isVisible) {
                            this.logger.log(
                                `Found play button in iframe with selector: ${selector}`,
                                "info"
                            );

                            try {
                                // Scroll into view if needed
                                await button.scrollIntoViewIfNeeded({
                                    timeout: 2000,
                                });
                                await frame.waitForTimeout(500);

                                // Click the button
                                await button.click({ timeout: 5000 });
                                this.logger.log(
                                    `Successfully clicked play button in iframe: ${frameUrl}`,
                                    "info"
                                );

                                // Wait for video to start
                                await frame.waitForTimeout(3000);
                                return true;
                            } catch (clickError) {
                                this.logger.log(
                                    `Failed to click play button in iframe: ${clickError}`,
                                    "warn"
                                );
                                continue;
                            }
                        }
                    } catch (selectorError) {
                        // Selector not found, continue to next
                        continue;
                    }
                }
            } catch (frameError) {
                this.logger.log(
                    `Error checking iframe ${frame.url()}: ${frameError}`,
                    "warn"
                );
                continue;
            }
        }

        this.logger.log("No play button found in any iframe", "info");
        return false;
    }

    shouldContinueNavigation(): boolean {
        return !this.downloadCompleted && !this.shouldTerminate;
    }

    markDownloadCompleted(): void {
        this.downloadCompleted = true;
        this.shouldTerminate = true;
        this.logger.log("Download marked as completed", "info");
    }

    shouldTerminateScript(): boolean {
        return this.shouldTerminate;
    }

    reset(): void {
        this.downloadCompleted = false;
        this.shouldTerminate = false;
    }
}
