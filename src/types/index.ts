import { Logger } from "../helpers/StringBuilder";

export interface VideoCandidate {
    url: string;
    headers: Record<string, string>;
    timestamp: number;
    domain: string;
    source: string;
    type?: string;
    status?: number;
}

export interface BrowserConfig {
    headless?: boolean;
    viewport?: {
        width: number;
        height: number;
    };
    userAgent?: string;
    ignoreHTTPSErrors?: boolean;
    javaScriptEnabled?: boolean;
    disableImages?: boolean;
    firefoxUserDataDir?: string;
    userDataDir?: string;
}

export interface DownloadConfig {
    outputFilepath?: string;
    maxWorkers?: number;
    timeout?: number;
    retries?: number;
}

export interface M3U8ProcessorConfig extends DownloadConfig {
    ffmpegPath?: string;
    segmentTimeout?: number;
}

export interface StreamInfo {
    url: string;
    duration?: number;
    bandwidth?: number;
    resolution?: string;
    codecs?: string;
}

export interface PlaylistInfo {
    isLive: boolean;
    streams: StreamInfo[];
    totalDuration?: number;
    segmentCount?: number;
}

export type BrowserType = "firefox" | "chromium" | "brave";

export type LogLevel = "error" | "warn" | "info" | "debug";

export interface LoggerConfig {
    level: LogLevel;
    format?: string;
    filename?: string;
}

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

export interface VideoDownloaderConfig {
    completeLog: Logger;
    downloadId: string;
    invokeEvent: any;
    browserType: BrowserType;
    url: string;
    downloadConfig?: DownloadConfig;
    browserConfig?: BrowserConfig;
    loggerConfig?: LoggerConfig;
}

/**
 * Creator metadata that cannot be extracted by yt-dlp
 * These fields require web scraping or API access
 */
export interface CreatorMetadata {
    creator_id?: string;
    creator_name?: string;
    creator_username?: string;
    creator_avatar_url?: string;
    creator_avatar_url_100?: string;
    creator_avatar_large_url?: string;
    creator_bio?: string;
    creator_follower_count?: number;
    creator_following_count?: number;
    creator_likes_count?: number;
    creator_video_count?: number;
    creator_open_id?: string;
    creator_union_id?: string;
    creator_profile_deep_link?: string;
    creator_verified?: boolean;
    platform: string;
    extractedAt: number;
    url: string;
}

/**
 * Video/Post metadata that cannot be extracted by yt-dlp
 * These fields require web scraping or API access
 * Platform-specific fields that yt-dlp doesn't support
 */
export interface VideoMetadata {
    video_id?: string;
    shortcode?: string;
    like_count?: number;
    comment_count?: number;
    view_count?: number;
    share_count?: number;
    save_count?: number;
    play_count?: number;
    reach?: number;
    timestamp?: number;
    location?: string;
    location_latitude?: number;
    location_longitude?: number;
    music_id?: string;
    music_title?: string;
    music_artist?: string;
    effect_ids?: string[];
    is_carousel?: boolean;
    carousel_media_count?: number;
    is_video?: boolean;
    is_photo?: boolean;
    caption?: string;
    hashtags?: string[];
    mentions?: string[];
    tagged_users?: string[];
    archived?: boolean;
    platform: string;
    extractedAt: number;
    url: string;
    requiresLogin?: boolean;
    // YouTube-specific fields that yt-dlp cannot fully extract
    embeddable?: boolean;
    dimension?: string;
    projection?: string;
    madeForKids?: boolean;
    isShort?: boolean;
    isLive?: boolean;
    isUpcoming?: boolean;
    hasCaptions?: boolean;
    isUnlisted?: boolean;
    isAgeRestricted?: boolean;
    category?: string;
    defaultLanguage?: string;
    // YouTube fields that yt-dlp can get (for fallback)
    duration?: number;
    channel_id?: string;
    channel_name?: string;
    thumbnails?: string[];
    definition?: string;
    concurrentViewers?: number;
    
    // Reddit-specific fields that yt-dlp cannot extract
    upvote_ratio?: number;
    is_self?: boolean;
    is_gallery?: boolean;
    spoiler?: boolean;
    locked?: boolean;
    stickied?: boolean;
    over_18?: boolean;
    link_flair_text?: string;
    link_flair_css_class?: string;
    domain?: string;
    selftext_html?: string;
    author_fullname?: string;
    subreddit_id?: string;
    thumbnail_height?: number;
    thumbnail_width?: number;

    // Twitch-specific fields
    // Basic fields (yt-dlp can get, but we extract for completeness)
    title?: string;
    description?: string;
    created_at?: string;
    language?: string;
    thumbnail_url?: string;
    user_id?: string;
    user_login?: string;
    user_name?: string;
    viewer_count?: number; // For streams
    started_at?: string; // For streams
    // Gap fields (yt-dlp cannot extract)
    stream_id?: string;
    published_at?: string;
    muted_segments?: Array<{ offset: number; duration: number }>;
    vod_type?: string; // "ARCHIVE", "HIGHLIGHT", or "UPLOAD"
    embed_url?: string;
    source_video_id?: string;
    vod_offset?: number;
    is_featured?: boolean;
    clip_creator_id?: string;
    game_id?: string;
    game_name?: string;
    is_mature?: boolean;
    tags?: string[]; // Stream tags
    content_classification_labels?: string[];
    is_branded_content?: boolean;
    // Content type detection
    twitch_content_type?: "vod" | "clip" | "stream" | "channel";

    // TikTok-specific fields that yt-dlp cannot extract
    embed_link?: string; // Embed URL (yt-dlp can't get)
    playlist_id?: string; // Playlist ID (Research API only)
    voice_to_text?: string; // Transcript (Research API only)
    region_code?: string; // Regional data (Research API only)

    // Facebook-specific fields that yt-dlp cannot extract
    updated_time?: number; // Last update timestamp
    content_category?: string; // Video category
    embed_html?: string; // Embed iframe code
    icon?: string; // Video type icon URL
    is_crosspost_video?: boolean; // Crossposted from another page
    is_crossposting_eligible?: boolean; // Can be crossposted
    is_episode?: boolean; // Part of a series
    is_instagram_eligible?: boolean; // Can be shared to IG
    live_status?: string; // LIVE, VOD, etc.
    post_views?: number; // Views not aggregated with crossposts
    premiere_living_room_status?: string; // Premiere status
    privacy?: string; // Privacy settings
    published?: boolean; // Is published
    status?: string; // Upload/processing status
    universal_video_id?: string; // Cross-platform ID
    total_video_views_unique?: number; // Unique viewers
    total_video_avg_time_watched?: number; // Average watch time (ms)
    total_video_complete_views?: number; // 95%+ completion views
    total_video_10s_views?: number; // 10s+ views
    total_video_30s_views?: number; // 30s+ views
    total_video_60s_excludes_shorter_views?: number; // 60s views (excludes short)
    reaction_love_count?: number; // LOVE reactions
    reaction_wow_count?: number; // WOW reactions
    reaction_haha_count?: number; // HAHA reactions
    reaction_sad_count?: number; // SAD reactions
    reaction_angry_count?: number; // ANGRY reactions

    // Twitter/X-specific fields that yt-dlp cannot extract
    context_annotations?: any[]; // AI-detected topics/entities
    conversation_id?: string; // Thread ID
    edit_controls?: {
        edits_remaining?: number;
        is_edit_eligible?: boolean;
        editable_until?: string;
    };
    edit_history_tweet_ids?: string[]; // Previous versions
    entities_hashtags?: Array<{ text: string; indices?: [number, number] }>; // Parsed hashtags with indices
    entities_mentions?: Array<{ username: string; id?: string; indices?: [number, number] }>; // Parsed @mentions
    entities_urls?: Array<{ url: string; expanded_url?: string; display_url?: string; indices?: [number, number] }>; // Expanded URLs
    entities_cashtags?: Array<{ text: string; indices?: [number, number] }>; // Stock ticker symbols
    geo?: {
        place_id?: string;
        coordinates?: { type: string; coordinates: number[] };
    }; // Place/geolocation data
    in_reply_to_user_id?: string; // Reply context
    reply_settings?: string; // everyone, mentionedUsers, following
    source?: string; // App used to post
    withheld?: {
        copyright?: boolean;
        country_codes?: string[];
        scope?: string;
    }; // Withholding info by country
    reply_count?: number; // Reply count (yt-dlp doesn't extract)
    quote_count?: number; // Quote tweets count
    bookmark_count?: number; // Bookmark count
    impression_count?: number; // Views/impressions
    media_key?: string; // Internal media identifier
    tweet_language?: string; // BCP47 language tag
    possibly_sensitive?: boolean; // Sensitive content flag
    creator_created_at?: number; // Account creation date (timestamp)
    creator_description?: string; // User bio
    creator_location?: string; // User-defined location
    creator_profile_image_url?: string; // Profile picture URL
    creator_protected?: boolean; // Protected account status
    creator_following_count?: number; // Following count
    creator_tweet_count?: number; // Total tweets
    creator_listed_count?: number; // Listed count
    creator_verified?: boolean; // Legacy verification
    creator_verified_type?: string; // blue, business, government, none
    place_full_name?: string; // Place full name
    place_country?: string; // Place country
    place_geo?: any; // Place GeoJSON coordinates
}

/**
 * Platform type for metadata scraping
 */
export type PlatformType = "youtube" | "tiktok" | "facebook" | "twitter" | "instagram" | "reddit" | "twitch" | "unknown";

/**
 * Configuration for creator metadata scraping
 */
export interface CreatorMetadataScraperConfig {
    browserType?: BrowserType;
    browserConfig?: BrowserConfig;
    timeout?: number;
    retries?: number;
    apiConfig?: {
        baseUrl?: string;
        timeout?: number;
        retries?: number;
        enabled?: boolean;
        resultsPath?: string;
    };
    scraperMode?: 'local' | 'api' | 'hybrid';
    platformOverrides?: Record<PlatformType, 'local' | 'api' | 'hybrid'>;
}

/**
 * Combined metadata result containing both creator and video metadata
 */
export interface ExtendedMetadata {
    creator?: CreatorMetadata;
    video?: VideoMetadata;
}

/** Reddit API scraper result types – full structure for displaying all scraped data */

export interface RedditEngagements {
    views_count?: number;
    comments_count?: number;
    shares_count?: number;
    quotes_count?: number;
    likes_count?: number;
    dislikes_count?: number;
    love_count?: number;
    haha_count?: number;
    wow_count?: number;
    sad_count?: number;
    angry_count?: number;
    care_count?: number;
}

export interface RedditReachMetrics {
    followers_count?: number;
    page_likes?: number;
    subscribers_count?: number;
}

export interface RedditCommentEngagements {
    likes_count?: number;
    dislikes_count?: number;
    love_count?: number;
    haha_count?: number;
    wow_count?: number;
    sad_count?: number;
    angry_count?: number;
    care_count?: number;
}

export interface RedditComment {
    _id?: string;
    comment_url?: string;
    author?: string;
    content?: string;
    date_published?: string;
    engagements?: RedditCommentEngagements;
}

export interface RedditAttachments {
    photos?: string[];
    embedded_link?: string[];
    video?: string[];
    gif?: string[];
    music?: string[];
}

export interface RedditPostData {
    title?: string;
    content?: string;
    authors?: string | string[];
    publish_date?: string;
    attachments?: RedditAttachments;
    organic_traffic?: Record<string, unknown> | null;
    engagements?: RedditEngagements;
    reach_metrics?: RedditReachMetrics;
    comments?: RedditComment[];
    virality?: Record<string, unknown> | null;
}

/** Full Reddit scrape result: raw API payload + optional normalized video metadata for display */
export interface RedditScrapeResult {
    url: string;
    _id?: string;
    scrape_status: string;
    data: RedditPostData;
    videoMetadata?: VideoMetadata;
}
