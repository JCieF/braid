# Local YouTube Scraper vs API Scraper – Metadata Comparison

## Creator metadata

| Field | Local (YouTubeScraper) | API (YouTubeApiScraper) |
|-------|------------------------|-------------------------|
| creator_name | No (not extracted) | Yes (from authors) |
| creator_username | No (not extracted) | Yes (from authors) |
| creator_follower_count | No (not extracted) | Yes (when API returns reach_metrics/organic_traffic) |
| creator_avatar_url | Yes (from channel page) | Yes (when API returns author.avatar_url) |
| creator_verified | Yes (from channel page) | Yes (when API returns it) |
| creator_id, creator_profile_deep_link | No | Yes (when API returns author object) |

**Summary (creator):** Local only extracts avatar and verified from the channel page. The API provides name, username, and follower count that the local scraper does not. Avatar and verified are filled by the API only if the external API includes them in the response.

## Video metadata

| Field | Local (YouTubeScraper) | API (YouTubeApiScraper) |
|-------|------------------------|-------------------------|
| video_id | Yes | Yes |
| caption | Yes (title, or title + description) | Yes (title; content as description) |
| description | Yes (merged into caption locally) | Yes (from content) |
| view_count, like_count, comment_count | Yes | Yes |
| share_count | No (not in local extract) | Yes (when API returns it) |
| timestamp | Yes | Yes (from publish_date) |
| thumbnails | Yes | Yes (from attachments when present) |
| hashtags/tags | Yes | Yes (when API returns hashtags) |
| mentions | Yes (@mentions from description) | Yes (when API returns mentions) |
| duration | Yes | No (API payload does not include it) |
| channel_id, channel_name | Yes | No (we could map from authors if API sent channel id/name) |
| definition | Yes | No |
| concurrentViewers | Yes (live) | No |
| embeddable, dimension, projection | Yes | No |
| madeForKids | Yes | No |
| isShort, isLive, isUpcoming | Yes | isShort from URL (/shorts/); isLive/isUpcoming only if API sends them |
| hasCaptions, isUnlisted, isAgeRestricted | Yes | No |
| category, defaultLanguage | Yes | No |

**Summary (video):** The API returns a generic social-media shape (title, content, authors, publish_date, attachments, engagements, reach_metrics, etc.). The local scraper reads YouTube’s own embed/page JSON and gets many YouTube-specific fields (duration, channel_id, madeForKids, isShort, embeddable, hasCaptions, category, etc.). We map everything the API provides; we also set isShort from the URL when it contains /shorts/. The adapter passes through duration, channel_id, channel_name, definition, embeddable, madeForKids, isLive, hasCaptions, category, etc., so if the external API ever returns those keys they will appear in VideoMetadata. Today the ondemand-scraper-api does not return them, so those fields are only populated by the local scraper.

## Conclusion

We do **not** get the same metadata: the API path gives a smaller, platform-agnostic set; the local scraper gives more YouTube-specific fields from the page. Use API for consistency and no browser; use local when you need duration, channel_id, madeForKids, isShort, embeddable, hasCaptions, category, etc.
