import { CreatorMetadataScraper } from '../scrapers/CreatorMetadataScraper.js';
import type { PlatformType } from '../types/index.js';

export interface DetectPlatformArgs {
    url: string;
}

export async function detectPlatform(e: any, args: DetectPlatformArgs) {
    e.stopPropagation();

    try {
        const { url } = args;

        if (!url) {
            return { ok: false, error: 'URL is required' };
        }

        const platform = CreatorMetadataScraper.detectPlatform(url);

        return {
            ok: true,
            data: {
                platform,
                url,
            },
        };
    } catch (error) {
        console.error('[Braid] Error detecting platform:', error);
        return {
            ok: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

