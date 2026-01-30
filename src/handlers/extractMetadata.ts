import { CreatorMetadataManager } from '../scrapers/CreatorMetadataManager.js';
import { Logger } from '../helpers/StringBuilder.js';
import type { BrowserType } from '../types/index.js';

export interface ExtractMetadataArgs {
    url: string;
    browserType?: BrowserType;
    headless?: boolean;
    viewport?: {
        width: number;
        height: number;
    };
    firefoxUserDataDir?: string;
    apiConfig?: {
        baseUrl?: string;
        timeout?: number;
        retries?: number;
        enabled?: boolean;
    };
    scraperMode?: 'local' | 'api' | 'hybrid';
    platformOverrides?: Record<string, 'local' | 'api' | 'hybrid'>;
}

export async function extractMetadata(e: any, args: ExtractMetadataArgs) {
    e.stopPropagation();

    try {
        const { url, browserType = 'chromium', headless = true, viewport, firefoxUserDataDir } = args;

        if (!url) {
            return { ok: false, error: 'URL is required' };
        }

        // Create logger - use invokeEvent from event if available, otherwise create mock
        const invokeEvent = e.invokeEvent || {
            sender: {
                send: (id: string, data: any) => {
                    if (data.data) {
                        console.log(`[${id}] ${data.data}`);
                    }
                },
            },
        };

        const logger = new Logger('extractMetadata', invokeEvent);
        const logAgent = logger.agent('ExtractMetadataHandler');

        logAgent.log(`Extracting metadata for URL: ${url}`, 'info');
        logAgent.log(`Using browser: ${browserType}, headless: ${headless}`, 'info');

        const browserConfig: any = {
            headless,
            viewport: viewport || { width: 1920, height: 1080 },
            ignoreHTTPSErrors: true,
            javaScriptEnabled: true,
        };

        if (firefoxUserDataDir) {
            browserConfig.firefoxUserDataDir = firefoxUserDataDir;
        }

        const manager = new CreatorMetadataManager(logger, {
            browserType,
            browserConfig,
            apiConfig: args.apiConfig,
            scraperMode: args.scraperMode,
            platformOverrides: args.platformOverrides,
        });

        const metadata = await manager.extractMetadata(url);

        if (metadata) {
            logAgent.log('Successfully extracted metadata', 'info');
            return { ok: true, data: metadata };
        } else {
            logAgent.log('No metadata extracted', 'warn');
            return { ok: false, error: 'No metadata could be extracted from the URL' };
        }
    } catch (error) {
        console.error('[Braid] Error extracting metadata:', error);
        return {
            ok: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

