import { extractMetadata, type ExtractMetadataArgs } from '../handlers/extractMetadata.js';

export async function ipcExtractMetadata(e: any, args: ExtractMetadataArgs) {
    try {
        // Create a mock event object for IPC calls
        const mockEvent = {
            stopPropagation: () => {},
            invokeEvent: null,
        };
        const result = await extractMetadata(mockEvent, args);
        return result;
    } catch (error: any) {
        console.error('[Braid] IPC Error extracting metadata:', error);
        return {
            ok: false,
            error: error.message || String(error),
        };
    }
}

