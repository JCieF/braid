import { detectPlatform, type DetectPlatformArgs } from '../handlers/detectPlatform.js';

export async function ipcDetectPlatform(e: any, args: DetectPlatformArgs) {
    try {
        // Create a mock event object for IPC calls
        const mockEvent = {
            stopPropagation: () => {},
            invokeEvent: null,
        };
        const result = await detectPlatform(mockEvent, args);
        return result;
    } catch (error: any) {
        console.error('[Braid] IPC Error detecting platform:', error);
        return {
            ok: false,
            error: error.message || String(error),
        };
    }
}

