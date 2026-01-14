# Creator Metadata Scrapers

This module provides web scraping capabilities to extract metadata that yt-dlp cannot obtain. It extracts two types of metadata:

## Creator Metadata
- `creator_avatar_url` - Profile picture
- `creator_bio` - Creator biography/description
- `creator_follower_count` - Number of followers/subscribers
- `creator_verified` - Verified status

## Video/Post Metadata
- `like_count` - Number of likes (may require login)
- `comment_count` - Number of comments (may require login)
- `view_count` - Number of views
- `share_count` - Number of shares
- `caption` - Post/video caption
- `hashtags` - Extracted hashtags from caption
- `mentions` - Extracted @mentions from caption
- `location` - Location information
- `music_title` / `music_artist` - Music/audio information
- `is_carousel` - Whether post is a carousel
- `timestamp` - Post creation timestamp

## Supported Platforms

- YouTube
- TikTok
- Twitter/X
- Instagram
- Reddit
- Facebook
- Twitch

## Usage

### Basic Usage

```typescript
import { CreatorMetadataManager } from 'braid';
import { Logger } from './helpers/StringBuilder.js';

// Create a logger (required)
const logger = new Logger("metadata-extraction", invokeEvent);

// Create manager
const manager = new CreatorMetadataManager(logger, {
    browserType: 'chromium', // or 'firefox', 'brave'
    browserConfig: {
        headless: true,
        viewport: { width: 1920, height: 1080 }
    }
});

// Extract creator metadata from a video URL
const creatorMetadata = await manager.extractMetadata('https://www.youtube.com/watch?v=VIDEO_ID');

if (creatorMetadata) {
    console.log('Creator Name:', creatorMetadata.creator_name);
    console.log('Avatar URL:', creatorMetadata.creator_avatar_url);
    console.log('Bio:', creatorMetadata.creator_bio);
    console.log('Followers:', creatorMetadata.creator_follower_count);
    console.log('Verified:', creatorMetadata.creator_verified);
}

// Extract both creator AND video metadata
const extendedMetadata = await manager.extractExtendedMetadata('https://www.instagram.com/p/POST_ID/');

if (extendedMetadata) {
    if (extendedMetadata.creator) {
        console.log('Creator:', extendedMetadata.creator.creator_name);
    }
    if (extendedMetadata.video) {
        console.log('Likes:', extendedMetadata.video.like_count);
        console.log('Comments:', extendedMetadata.video.comment_count);
        console.log('Requires Login:', extendedMetadata.video.requiresLogin);
    }
}
```

### Using with Existing Browser Session

If you already have a browser page open (e.g., from VideoDownloader), you can reuse it:

```typescript
import { CreatorMetadataManager } from 'braid';
import { Page } from 'playwright';

// Assuming you have a page from an existing browser session
const manager = new CreatorMetadataManager(logger);
const metadata = await manager.extractMetadataFromPage(page, videoUrl);
```

### Platform-Specific Scrapers

You can also use platform-specific scrapers directly:

```typescript
import { YouTubeScraper, TikTokScraper } from 'braid';

const youtubeScraper = new YouTubeScraper(logger);
const metadata = await youtubeScraper.extractMetadata(page, videoUrl);
```

## Integration with yt-dlp

This scraper is designed to complement yt-dlp. Use yt-dlp for basic video metadata, then use this scraper for creator metadata:

```typescript
// 1. Get basic metadata from yt-dlp
const ytDlpInfo = await ytDlp.extractInfo(videoUrl);

// 2. Get creator metadata from web scraper
const creatorMetadata = await manager.extractMetadata(videoUrl);

// 3. Combine the results
const completeMetadata = {
    ...ytDlpInfo,
    creator: creatorMetadata
};
```

## Login Requirements

### What Can Be Extracted WITHOUT Login

**Instagram:**
- Basic video/post information (shortcode, ID, caption)
- Hashtags and mentions from caption
- Location (if public)
- Media type (photo/video/carousel)
- Some view counts (when available in DOM)
- Creator username and basic profile info (limited)

**YouTube:**
- Most creator metadata (name, avatar, bio, subscriber count)
- Video metadata available via yt-dlp

**Other Platforms:**
- Varies by platform and content privacy settings

### What REQUIRES Login

**Instagram:**
- `like_count` - Explicitly requires logged-in session
- `comment_count` - Explicitly requires logged-in session
- Full profile data (bio, follower count, profile picture) - Often gated
- Media Insights (plays, reach, saved, shares) - Requires API access
- Private account data

**General:**
- Engagement metrics on private/restricted content
- Detailed analytics and insights
- Cross-platform data

### Detection

The scraper attempts to extract data from multiple sources:
1. Embedded JSON data (`window._sharedData`, GraphQL responses)
2. DOM elements (visible text, aria-labels)
3. JSON-LD structured data

If `like_count` or `comment_count` cannot be extracted, the `requiresLogin` flag will be set to `true` in the `VideoMetadata` object.

## Notes

- **Rate Limiting**: Be respectful of platform rate limits. Consider adding delays between requests.
- **Anti-Scraping**: Some platforms (especially Facebook, Instagram) have strict anti-scraping measures. You may need to:
  - Use headless: false for debugging
  - Add delays
  - Use rotating user agents
  - Handle CAPTCHAs (not implemented)
  - **Login Support**: For reliable extraction of engagement metrics, consider implementing login support (cookies/session management)
- **Selector Updates**: Platform HTML structures change frequently. Selectors may need updates.
- **Error Handling**: All scrapers return `null` on failure. Always check for null results.
- **Data Availability**: Instagram frequently changes their data structure. The scraper tries multiple extraction methods but may fail if Instagram updates their frontend.

## Architecture

- `CreatorMetadataScraper` - Base class with common functionality
- Platform-specific scrapers (YouTubeScraper, TikTokScraper, etc.)
- `CreatorMetadataManager` - Factory/manager that auto-selects the right scraper

## Extending

To add support for a new platform:

1. Create a new scraper class extending `CreatorMetadataScraper`
2. Implement `extractMetadata()` and `getCreatorProfileUrl()` methods
3. Optionally implement `extractVideoMetadata()` for video/post-specific metadata
4. Add the platform to `CreatorMetadataScraper.detectPlatform()`
5. Register it in `CreatorMetadataManager.getScraperForPlatform()`

### Example: Adding Video Metadata Extraction

```typescript
export class MyPlatformScraper extends CreatorMetadataScraper {
    // ... existing methods ...

    async extractVideoMetadata(page: Page, videoUrl: string): Promise<VideoMetadata | null> {
        try {
            await page.goto(videoUrl, { waitUntil: "networkidle" });
            
            const metadata: VideoMetadata = {
                platform: "myplatform",
                url: videoUrl,
                extractedAt: Date.now(),
            };

            // Extract from embedded JSON
            const jsonData = await page.evaluate(() => {
                // Extract from window._sharedData or similar
                return (window as any)._sharedData?.post?.likes || null;
            });

            if (jsonData) {
                metadata.like_count = jsonData;
            }

            // Extract from DOM as fallback
            const likeText = await this.getElementText(page, '[data-likes]');
            if (likeText) {
                metadata.like_count = this.parseCount(likeText);
            }

            return metadata;
        } catch (error) {
            this.logger.log(`Failed to extract video metadata: ${error}`, "error");
            return null;
        }
    }
}
```

