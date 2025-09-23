import { Page } from "playwright";
import { LogAgent } from "../helpers/StringBuilder.js";

export interface TitleInfo {
    title: string;
    originalTitle?: string;
    code?: string;
    actress?: string[];
    studio?: string;
    releaseDate?: string;
    duration?: string;
    genre?: string[];
    description?: string;
    coverImage?: string;
    url: string;
    extractedAt: number;
}

export class TitleScraper {
    private logger: LogAgent;

    constructor(logger: LogAgent) {
        this.logger = logger;
    }

    /**
     * Extract title information from a JAV page
     */
    async extractTitleInfo(page: Page): Promise<TitleInfo | null> {
        try {
            this.logger.log("Extracting title information from page...", "info");
            
            const url = page.url();
            this.logger.log(`Extracting from URL: ${url}`, "debug");

            // Check all frames (main page and iframes)
            const allFrames = [
                page.mainFrame(),
                ...page.frames().filter((f: any) => f !== page.mainFrame()),
            ];

            for (let frameIndex = 0; frameIndex < allFrames.length; frameIndex++) {
                const frame = allFrames[frameIndex];
                const frameName = frameIndex === 0 ? "main" : `iframe-${frameIndex}`;

                try {
                    this.logger.log(`Checking ${frameName} frame for title info...`, "debug");
                    
                    const titleInfo = await frame.evaluate(() => {
                        // Helper function to clean text
                        const cleanText = (text: string | null): string => {
                            if (!text) return '';
                            return text.trim().replace(/\s+/g, ' ');
                        };

                        // Helper function to extract text from element
                        const getElementText = (selector: string): string => {
                            const element = document.querySelector(selector);
                            return element ? cleanText(element.textContent) : '';
                        };

                        // Helper function to extract attribute from element
                        const getElementAttribute = (selector: string, attribute: string): string => {
                            const element = document.querySelector(selector);
                            return element ? cleanText(element.getAttribute(attribute)) : '';
                        };

                        // Helper function to extract multiple elements text
                        const getMultipleElementsText = (selector: string): string[] => {
                            const elements = document.querySelectorAll(selector);
                            return Array.from(elements).map(el => cleanText(el.textContent)).filter(text => text.length > 0);
                        };

                        const result: any = {};

                        // Try different title selectors (common patterns for JAV sites)
                        const titleSelectors = [
                            'h1.title',
                            'h1',
                            '.title h1',
                            '.video-title',
                            '.post-title',
                            '.entry-title',
                            'title',
                            '.movie-title',
                            '.video-info h1',
                            '.content-title',
                            '.post-content h1',
                            'h1.entry-title'
                        ];

                        for (const selector of titleSelectors) {
                            const title = getElementText(selector);
                            if (title && title.length > 5) { // Reasonable title length
                                result.title = title;
                                break;
                            }
                        }

                        // Extract JAV code (like SSIS-123, IPX-456, etc.)
                        const codeSelectors = [
                            '.video-code',
                            '.movie-code',
                            '.code',
                            '[class*="code"]',
                            '[id*="code"]'
                        ];

                        for (const selector of codeSelectors) {
                            const code = getElementText(selector);
                            if (code && /^[A-Z]{2,5}-?\d{3,4}$/i.test(code)) {
                                result.code = code.toUpperCase();
                                break;
                            }
                        }

                        // If no code found in dedicated elements, try to extract from title
                        if (!result.code && result.title) {
                            const codeMatch = result.title.match(/\[([A-Z]{2,5}-?\d{3,4})\]/i) || 
                                            result.title.match(/([A-Z]{2,5}-?\d{3,4})/i);
                            if (codeMatch) {
                                result.code = codeMatch[1].toUpperCase();
                            }
                        }

                        // Extract actress names
                        const actressSelectors = [
                            '.actress',
                            '.performer',
                            '.star',
                            '.model',
                            '.girls',
                            '[class*="actress"]',
                            '[class*="performer"]',
                            '.video-info .actress',
                            '.cast',
                            '.tags a[href*="actress"]',
                            '.tags a[href*="performer"]'
                        ];

                        for (const selector of actressSelectors) {
                            const actresses = getMultipleElementsText(selector);
                            if (actresses.length > 0) {
                                result.actress = actresses;
                                break;
                            }
                        }

                        // Extract studio/maker
                        const studioSelectors = [
                            '.studio',
                            '.maker',
                            '.label',
                            '.publisher',
                            '[class*="studio"]',
                            '[class*="maker"]',
                            '.tags a[href*="studio"]'
                        ];

                        for (const selector of studioSelectors) {
                            const studio = getElementText(selector);
                            if (studio && studio.length > 1) {
                                result.studio = studio;
                                break;
                            }
                        }

                        // Extract release date
                        const dateSelectors = [
                            '.release-date',
                            '.date',
                            '.published',
                            '[class*="date"]',
                            'time',
                            '.post-date'
                        ];

                        for (const selector of dateSelectors) {
                            const date = getElementText(selector) || getElementAttribute(selector, 'datetime');
                            if (date && /\d{4}/.test(date)) { // Contains a year
                                result.releaseDate = date;
                                break;
                            }
                        }

                        // Extract duration
                        const durationSelectors = [
                            '.duration',
                            '.runtime',
                            '.length',
                            '[class*="duration"]',
                            '[class*="runtime"]'
                        ];

                        for (const selector of durationSelectors) {
                            const duration = getElementText(selector);
                            if (duration && /\d+/.test(duration)) {
                                result.duration = duration;
                                break;
                            }
                        }

                        // Extract genres/tags
                        const genreSelectors = [
                            '.genre',
                            '.tag',
                            '.category',
                            '.tags a',
                            '.genres a',
                            '.categories a',
                            '[class*="genre"]',
                            '[class*="tag"]',
                            '.post-tags a'
                        ];

                        for (const selector of genreSelectors) {
                            const genres = getMultipleElementsText(selector);
                            if (genres.length > 0) {
                                result.genre = genres;
                                break;
                            }
                        }

                        // Extract description
                        const descriptionSelectors = [
                            '.description',
                            '.summary',
                            '.plot',
                            '.synopsis',
                            '.content',
                            '[class*="description"]',
                            '[class*="summary"]',
                            '.post-content p',
                            '.entry-content p'
                        ];

                        for (const selector of descriptionSelectors) {
                            const description = getElementText(selector);
                            if (description && description.length > 20) { // Reasonable description length
                                result.description = description;
                                break;
                            }
                        }

                        // Extract cover image
                        const imageSelectors = [
                            '.cover img',
                            '.poster img',
                            '.thumbnail img',
                            '.video-thumb img',
                            'img[class*="cover"]',
                            'img[class*="poster"]',
                            'img[class*="thumb"]',
                            '.post-thumbnail img',
                            '.featured-image img'
                        ];

                        for (const selector of imageSelectors) {
                            const coverImage = getElementAttribute(selector, 'src') || getElementAttribute(selector, 'data-src');
                            if (coverImage && coverImage.startsWith('http')) {
                                result.coverImage = coverImage;
                                break;
                            }
                        }

                        // Return null if no meaningful data was found
                        if (!result.title && !result.code) {
                            return null;
                        }

                        return result;
                    });

                    if (titleInfo) {
                        const finalTitleInfo: TitleInfo = {
                            title: titleInfo.title || 'Unknown Title',
                            originalTitle: titleInfo.originalTitle,
                            code: titleInfo.code,
                            actress: titleInfo.actress,
                            studio: titleInfo.studio,
                            releaseDate: titleInfo.releaseDate,
                            duration: titleInfo.duration,
                            genre: titleInfo.genre,
                            description: titleInfo.description,
                            coverImage: titleInfo.coverImage,
                            url: url,
                            extractedAt: Date.now()
                        };

                        this.logger.log(`Successfully extracted title info from ${frameName} frame`, "info");
                        this.logger.log(`Title: ${finalTitleInfo.title}`, "debug");
                        if (finalTitleInfo.code) this.logger.log(`Code: ${finalTitleInfo.code}`, "debug");
                        if (finalTitleInfo.actress) this.logger.log(`Actress: ${finalTitleInfo.actress.join(', ')}`, "debug");

                        return finalTitleInfo;
                    }

                } catch (error) {
                    this.logger.log(`Error extracting from ${frameName} frame: ${error}`, "debug");
                    continue;
                }
            }

            this.logger.log("No title information found in any frame", "warn");
            return null;

        } catch (error) {
            this.logger.log(`Failed to extract title info: ${error}`, "error");
            return null;
        }
    }

    /**
     * Format title info for display
     */
    formatTitleInfo(titleInfo: TitleInfo): string {
        const lines: string[] = [];
        
        lines.push(`Title: ${titleInfo.title}`);
        if (titleInfo.code) lines.push(`🏷️  Code: ${titleInfo.code}`);
        if (titleInfo.actress && titleInfo.actress.length > 0) {
            lines.push(`Actress: ${titleInfo.actress.join(', ')}`);
        }
        if (titleInfo.studio) lines.push(`🏢 Studio: ${titleInfo.studio}`);
        if (titleInfo.releaseDate) lines.push(`📅 Release: ${titleInfo.releaseDate}`);
        if (titleInfo.duration) lines.push(`⏱️  Duration: ${titleInfo.duration}`);
        if (titleInfo.genre && titleInfo.genre.length > 0) {
            lines.push(`Genres: ${titleInfo.genre.join(', ')}`);
        }
        if (titleInfo.description) {
            const shortDesc = titleInfo.description.length > 100 
                ? titleInfo.description.substring(0, 100) + '...' 
                : titleInfo.description;
            lines.push(`Description: ${shortDesc}`);
        }
        lines.push(`🔗 URL: ${titleInfo.url}`);
        
        return lines.join('\n');
    }
}
