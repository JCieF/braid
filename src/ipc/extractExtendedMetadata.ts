import { extractExtendedMetadata, type ExtractExtendedMetadataArgs } from '../handlers/extractExtendedMetadata.js';

export async function ipcExtractExtendedMetadata(e: any, args: ExtractExtendedMetadataArgs) {
    try {
        // Create a mock event object for IPC calls
        const mockEvent = {
            stopPropagation: () => {},
            invokeEvent: null,
        };
        const result = await extractExtendedMetadata(mockEvent, args);
        return result;
    } catch (error: any) {
        console.error('[Braid] IPC Error extracting extended metadata:', error);
        return {
            ok: false,
            error: error.message || String(error),
        };
    }
}

