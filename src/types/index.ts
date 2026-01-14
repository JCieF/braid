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
    creator_bio?: string;
    creator_follower_count?: number;
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
}

/**
 * Combined metadata result containing both creator and video metadata
 */
export interface ExtendedMetadata {
    creator?: CreatorMetadata;
    video?: VideoMetadata;
}
