import { test, expect } from "@playwright/test";
import { CreatorMetadataManager } from "../../src/scrapers/CreatorMetadataManager";
import { Logger } from "../../src/helpers/StringBuilder";

test.describe("CreatorMetadataManager Integration Tests", () => {
  let logger: Logger;
  let manager: CreatorMetadataManager;

  test.beforeEach(() => {
    const mockInvokeEvent = {
      sender: {
        send: (id: string, data: any) => {
          if (process.env.DEBUG) {
            console.log(`[${id}] ${data.data}`);
          }
        },
      },
    };
    logger = new Logger("integration-test", mockInvokeEvent);
    manager = new CreatorMetadataManager(logger, {
      browserType: "chromium",
      browserConfig: {
        headless: true,
        viewport: { width: 1920, height: 1080 },
      },
    });
  });

  test("should extract metadata from YouTube URL", async () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const metadata = await manager.extractMetadata(url);

    expect(metadata).not.toBeNull();
    expect(metadata?.platform).toBe("youtube");
    expect(metadata?.url).toBe(url);
    expect(metadata?.extractedAt).toBeGreaterThan(0);
  });

  test("should return null for invalid URL", async () => {
    const url = "https://invalid-platform.com/video";
    const metadata = await manager.extractMetadata(url);

    expect(metadata).toBeNull();
  });

  test("should extract extended metadata with video info", async () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const extendedMetadata = await manager.extractExtendedMetadata(url);

    expect(extendedMetadata).not.toBeNull();
    if (extendedMetadata) {
      expect(extendedMetadata.creator).toBeDefined();
      expect(extendedMetadata.creator?.platform).toBe("youtube");
    }
  });

  test.skip("should extract metadata from Instagram URL", async () => {
    const url = "https://www.instagram.com/instagram/";
    const metadata = await manager.extractMetadata(url);

    expect(metadata).not.toBeNull();
    expect(metadata?.platform).toBe("instagram");
  });

  test.skip("should extract metadata from TikTok URL", async () => {
    const url = "https://www.tiktok.com/@user/video/123";
    const metadata = await manager.extractMetadata(url);

    expect(metadata).not.toBeNull();
    expect(metadata?.platform).toBe("tiktok");
  });
});
