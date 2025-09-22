import { Page } from "playwright";
import { LogAgent, Logger } from "../helpers/StringBuilder.js";

export class StreamButtonHandler {
    private logger: LogAgent;

    constructor(logger: Logger) {
        this.logger = logger.agent("StreamButtonHandler");
    }

    async tryStreamButtonsSequentially(page: Page): Promise<boolean> {
        this.logger.log("Trying stream buttons sequentially...", "info");

        // Define stream button selectors in order of preference
        const streamButtonSelectors = [
            'a[data-localize="iozdmrmvqd"]', // STREAM TV
            'a[data-localize="vsomupazip"]', // STREAM ST
            'a[data-localize="mppucpwmlr"]', // STREAM SB
            'a[data-localize="fnxaxpqtvb"]', // STREAM EA
            'a[data-localize="zvaqabbhei"]', // STREAM LU
            'a[data-localize="ctslwegyea"]', // STREAM JK
            "a.wp-btn-iframe__shortcode", // Generic fallback
        ];

        for (let i = 0; i < streamButtonSelectors.length; i++) {
            const selector = streamButtonSelectors[i];

            try {
                this.logger.log(
                    `Trying stream button ${i + 1}/${
                        streamButtonSelectors.length
                    }: ${selector}`,
                    "info"
                );

                // Check if button exists
                const elements = page.locator(selector);
                const count = await elements.count();

                if (count === 0) {
                    this.logger.log(
                        `No buttons found with selector: ${selector}`,
                        "info"
                    );
                    continue;
                }

                // Try each button with this selector
                for (let j = 0; j < count; j++) {
                    try {
                        // Check if page is still active
                        if (page.isClosed()) {
                            this.logger.log(
                                "Page is closed, stopping button attempts",
                                "warn"
                            );
                            return false;
                        }

                        const button = elements.nth(j);
                        const isVisible = await button.isVisible();

                        if (!isVisible) {
                            continue;
                        }

                        const buttonText = (await button.textContent()) || "";
                        const dataLocalize =
                            (await button.getAttribute("data-localize")) || "";

                        this.logger.log(
                            `Clicking button: ${buttonText} (${dataLocalize})`,
                            "info"
                        );

                        // Click the button with human-like behavior
                        try {
                            // Wait longer to mimic human reading/decision time
                            await page.waitForTimeout(2000);

                            // Scroll button into view (human-like behavior)
                            await button.scrollIntoViewIfNeeded();
                            await page.waitForTimeout(500);

                            // Hover over button first (human-like behavior)
                            try {
                                await button.hover({ timeout: 3000 });
                                await page.waitForTimeout(800);
                            } catch {
                                // Hover not critical
                            }

                            // Click with longer timeout
                            this.logger.log(
                                `Clicking button: ${buttonText} with human-like behavior`,
                                "info"
                            );
                            await button.click({ timeout: 10000 });

                            // Wait for click to register and page to respond
                            await page.waitForTimeout(1500);

                            return true; // Successfully clicked a button
                        } catch (clickError) {
                            this.logger.log(
                                `Failed to click button ${buttonText}: ${clickError}`,
                                "warn"
                            );
                            continue;
                        }
                    } catch (error) {
                        this.logger.log(
                            `Failed to click button ${
                                j + 1
                            } with selector ${selector}: ${error}`,
                            "warn"
                        );
                        continue;
                    }
                }
            } catch (error) {
                this.logger.log(
                    `Error with selector ${selector}: ${error}`,
                    "warn"
                );
                continue;
            }
        }

        return false;
    }

    async clickSpecificStreamButton(
        page: Page,
        selector: string
    ): Promise<boolean> {
        try {
            this.logger.log(
                `Attempting to click specific stream button: ${selector}`,
                "info"
            );

            const elements = page.locator(selector);
            const count = await elements.count();

            if (count === 0) {
                this.logger.log(
                    `No button found with selector: ${selector}`,
                    "info"
                );
                return false;
            }

            const button = elements.first();
            const isVisible = await button.isVisible();

            if (!isVisible) {
                this.logger.log(`Button not visible: ${selector}`, "info");
                return false;
            }

            const buttonText = (await button.textContent()) || "";
            this.logger.log(`Clicking specific button: ${buttonText}`, "info");

            // Human-like clicking behavior
            await page.waitForTimeout(1000);
            await button.scrollIntoViewIfNeeded();
            await page.waitForTimeout(300);

            try {
                await button.hover({ timeout: 2000 });
                await page.waitForTimeout(500);
            } catch {
                // Hover not critical
            }

            await button.click({ timeout: 5000 });
            await page.waitForTimeout(1000);

            this.logger.log(
                `Successfully clicked button: ${buttonText}`,
                "info"
            );
            return true;
        } catch (error) {
            this.logger.log(
                `Failed to click specific stream button ${selector}: ${error}`,
                "error"
            );
            return false;
        }
    }

    async findAvailableStreamButtons(page: Page): Promise<string[]> {
        const streamButtonSelectors = [
            'a[data-localize="iozdmrmvqd"]', // STREAM TV
            'a[data-localize="vsomupazip"]', // STREAM ST
            'a[data-localize="mppucpwmlr"]', // STREAM SB
            'a[data-localize="fnxaxpqtvb"]', // STREAM EA
            'a[data-localize="zvaqabbhei"]', // STREAM LU
            'a[data-localize="ctslwegyea"]', // STREAM JK
            "a.wp-btn-iframe__shortcode", // Generic fallback
        ];

        const availableButtons: string[] = [];

        for (const selector of streamButtonSelectors) {
            try {
                const elements = page.locator(selector);
                const count = await elements.count();

                if (count > 0) {
                    const isVisible = await elements.first().isVisible();
                    if (isVisible) {
                        availableButtons.push(selector);
                        const buttonText =
                            (await elements.first().textContent()) || "";
                        this.logger.log(
                            `Found available stream button: ${buttonText} (${selector})`,
                            "info"
                        );
                    }
                }
            } catch (error) {
                this.logger.log(
                    `Error checking selector ${selector}: ${error}`,
                    "debug"
                );
            }
        }

        this.logger.log(
            `Found ${availableButtons.length} available stream buttons`,
            "info"
        );
        return availableButtons;
    }
}
