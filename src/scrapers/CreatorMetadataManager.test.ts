import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Page } from "playwright";
import { CreatorMetadataManager } from "./CreatorMetadataManager.js";
import { Logger } from "../helpers/StringBuilder.js";
import { CreatorMetadataScraper } from "./CreatorMetadataScraper.js";
import { CreatorMetadata, PlatformType } from "../types/index.js";

describe("CreatorMetadataManager", () => {
  let mockLogger: Logger;
  let mockInvokeEvent: any;

  beforeEach(() => {
    mockInvokeEvent = {
      sender: {
        send: vi.fn(),
      },
    };
    mockLogger = new Logger("test", mockInvokeEvent);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getScraperForPlatform", () => {
    it("should return scraper for supported platforms", () => {
      const manager = new CreatorMetadataManager(mockLogger);
      const platforms: PlatformType[] = [
        "youtube",
        "tiktok",
        "twitter",
        "instagram",
        "reddit",
        "facebook",
        "twitch",
      ];

      platforms.forEach((platform) => {
        const scraper = (manager as any).getScraperForPlatform(platform);
        expect(scraper).not.toBeNull();
        expect(scraper).toBeInstanceOf(Object);
      });
    });

    it("should return null for unknown platform", () => {
      const manager = new CreatorMetadataManager(mockLogger);
      const scraper = (manager as any).getScraperForPlatform("unknown" as PlatformType);
      expect(scraper).toBeNull();
    });
  });

  describe("extractMetadataFromPage", () => {
    it("should return null for unknown platform URL", async () => {
      const manager = new CreatorMetadataManager(mockLogger);
      const mockPage = {} as Page;

      const result = await manager.extractMetadataFromPage(
        mockPage,
        "https://unknown-platform.com/video"
      );

      expect(result).toBeNull();
    });

    it("should call scraper extractMetadata for known platform", async () => {
      const manager = new CreatorMetadataManager(mockLogger);
      const mockPage = {} as Page;
      const mockMetadata: CreatorMetadata = {
        platform: "youtube",
        creator_name: "Test Creator",
        extractedAt: Date.now(),
        url: "https://youtube.com/watch?v=test",
      };

      const mockScraper = {
        extractMetadata: vi.fn().mockResolvedValue(mockMetadata),
      };

      vi.spyOn(CreatorMetadataScraper, "detectPlatform").mockReturnValue("youtube");
      vi.spyOn(manager as any, "getScraperForPlatform").mockReturnValue(mockScraper);

      const result = await manager.extractMetadataFromPage(
        mockPage,
        "https://youtube.com/watch?v=test"
      );

      expect(result).toEqual(mockMetadata);
      expect(mockScraper.extractMetadata).toHaveBeenCalledWith(mockPage, "https://youtube.com/watch?v=test");
    });

    it("should handle errors gracefully", async () => {
      const manager = new CreatorMetadataManager(mockLogger);
      const mockPage = {} as Page;

      vi.spyOn(CreatorMetadataScraper, "detectPlatform").mockReturnValue("youtube");
      vi.spyOn(manager as any, "getScraperForPlatform").mockReturnValue({
        extractMetadata: vi.fn().mockRejectedValue(new Error("Test error")),
      });

      const result = await manager.extractMetadataFromPage(
        mockPage,
        "https://youtube.com/watch?v=test"
      );

      expect(result).toBeNull();
    });
  });

  describe("extractExtendedMetadataFromPage", () => {
    it("should return combined creator and video metadata", async () => {
      const manager = new CreatorMetadataManager(mockLogger);
      const mockPage = {} as Page;
      const mockCreatorMetadata: CreatorMetadata = {
        platform: "youtube",
        creator_name: "Test Creator",
        extractedAt: Date.now(),
        url: "https://youtube.com/watch?v=test",
      };
      const mockVideoMetadata = {
        platform: "youtube",
        video_id: "test123",
        view_count: 1000,
        extractedAt: Date.now(),
        url: "https://youtube.com/watch?v=test",
      };

      const mockScraper = {
        extractMetadata: vi.fn().mockResolvedValue(mockCreatorMetadata),
        extractVideoMetadata: vi.fn().mockResolvedValue(mockVideoMetadata),
      };

      vi.spyOn(CreatorMetadataScraper, "detectPlatform").mockReturnValue("youtube");
      vi.spyOn(manager as any, "getScraperForPlatform").mockReturnValue(mockScraper);

      const result = await manager.extractExtendedMetadataFromPage(
        mockPage,
        "https://youtube.com/watch?v=test"
      );

      expect(result).toEqual({
        creator: mockCreatorMetadata,
        video: mockVideoMetadata,
      });
    });

    it("should return null if no metadata extracted", async () => {
      const manager = new CreatorMetadataManager(mockLogger);
      const mockPage = {} as Page;

      const mockScraper = {
        extractMetadata: vi.fn().mockResolvedValue(null),
        extractVideoMetadata: vi.fn().mockResolvedValue(null),
      };

      vi.spyOn(CreatorMetadataScraper, "detectPlatform").mockReturnValue("youtube");
      vi.spyOn(manager as any, "getScraperForPlatform").mockReturnValue(mockScraper);

      const result = await manager.extractExtendedMetadataFromPage(
        mockPage,
        "https://youtube.com/watch?v=test"
      );

      expect(result).toBeNull();
    });
  });

  describe("platform detection", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("should detect YouTube URLs", () => {
      const youtubeUrls = [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://youtu.be/dQw4w9WgXcQ",
        "http://youtube.com/watch?v=test",
      ];

      youtubeUrls.forEach((url) => {
        const platform = CreatorMetadataScraper.detectPlatform(url);
        expect(platform).toBe("youtube");
      });
    });

    it("should detect TikTok URLs", () => {
      const platform = CreatorMetadataScraper.detectPlatform("https://www.tiktok.com/@user/video/123");
      expect(platform).toBe("tiktok");
    });

    it("should detect Instagram URLs", () => {
      const platform = CreatorMetadataScraper.detectPlatform("https://www.instagram.com/p/ABC123/");
      expect(platform).toBe("instagram");
    });

    it("should detect Twitter/X URLs", () => {
      const twitterUrls = [
        "https://twitter.com/user/status/123",
        "https://x.com/user/status/123",
      ];

      twitterUrls.forEach((url) => {
        const platform = CreatorMetadataScraper.detectPlatform(url);
        expect(platform).toBe("twitter");
      });
    });
  });
});
