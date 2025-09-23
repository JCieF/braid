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
