import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { spawn, execSync } from "child_process";
import { LogAgent, Logger } from "../helpers/StringBuilder.js";
import { M3U8ProcessorConfig } from "../types/index.js";
import * as cliProgress from "cli-progress";
import { DEFAULT_OUTPUT_DIR } from "../helpers/Constants.js";
// FFmpeg path resolution
let ffmpegStatic: string | null = null;

async function loadFFmpegStatic(): Promise<string | null> {
    if (ffmpegStatic !== null) {
        return ffmpegStatic;
    }

    try {
        // Use dynamic import for ES modules
        const ffmpegModule = await import("ffmpeg-static");
        ffmpegStatic = (ffmpegModule.default ||
            ffmpegModule) as unknown as string;
        return ffmpegStatic;
    } catch (error) {
        // Try require as fallback for CommonJS compatibility
        try {
            // Use __filename for CommonJS compatibility instead of import.meta.url
            const { createRequire } = await import("module");
            let requireFn: NodeJS.Require;

            // Check if we're in an ES module environment
            if (typeof __filename !== "undefined") {
                // CommonJS environment
                requireFn = require;
            } else {
                // ES module environment - create require from current file URL
                // Use a more compatible approach to get the current module URL
                const moduleUrl = new URL(
                    "file://" + process.cwd() + "/package.json"
                );
                requireFn = createRequire(moduleUrl);
            }

            ffmpegStatic = requireFn("ffmpeg-static");
            return ffmpegStatic;
        } catch (requireError) {
            console.warn(
                "Warning: ffmpeg-static could not be loaded. Using system ffmpeg as fallback."
            );
            return null;
        }
    }
}

// Direct TypeScript port of Python m3u8_downloader.py
interface Segment {
    uri: string;
    duration?: number;
}

interface Playlist {
    segments: Segment[];
    playlists?: PlaylistInfo[];
}

interface PlaylistInfo {
    uri: string;
    streamInfo: {
        bandwidth?: number;
        resolution?: string;
        codecs?: string;
    };
}

// Simple curl-based downloader - more reliable than custom HTTP implementation
class SimpleDownloader {
    private defaultHeaders: Record<string, string> = {};

    constructor(
        config: {
            headers?: Record<string, string>;
        } = {}
    ) {
        this.defaultHeaders = config.headers || {};
    }

    get defaults() {
        return {
            headers: {
                common: this.defaultHeaders,
            },
        };
    }

    /**
     * Download file using curl - much more reliable than custom HTTP implementation
     */
    async downloadFile(
        url: string,
        outputPath: string,
        headers?: Record<string, string>
    ): Promise<boolean> {
        try {
            const allHeaders = { ...this.defaultHeaders, ...headers };

            // Build curl arguments array (avoid shell parsing issues)
            const curlArgs = [
                "-L", // Follow redirects
                "--fail", // Fail on HTTP errors
                "--silent", // Silent mode
                "--show-error", // Show errors
                "--max-time",
                "60", // 60 second timeout
                "--retry",
                "3", // Retry 3 times
                "--retry-delay",
                "2", // 2 second delay between retries
            ];

            // Add headers (properly escaped)
            for (const [key, value] of Object.entries(allHeaders)) {
                if (value) {
                    curlArgs.push("-H", `${key}: ${value}`);
                }
            }

            // Add URL and output
            curlArgs.push("-o", outputPath, url);

            // Silent mode - don't log to avoid interfering with progress bar

            // Execute curl using spawn (avoids shell parsing issues)
            const result = await new Promise<{
                success: boolean;
                error?: string;
            }>((resolve) => {
                const curlProcess = spawn("curl", curlArgs, {
                    stdio: "pipe",
                });

                let errorOutput = "";

                curlProcess.stderr?.on("data", (data) => {
                    errorOutput += data.toString();
                });

                curlProcess.on("close", (code) => {
                    if (code === 0) {
                        resolve({ success: true });
                    } else {
                        resolve({
                            success: false,
                            error: `Exit code ${code}: ${errorOutput}`,
                        });
                    }
                });

                curlProcess.on("error", (error) => {
                    resolve({ success: false, error: error.message });
                });

                // Set timeout
                setTimeout(() => {
                    curlProcess.kill();
                    resolve({
                        success: false,
                        error: "Timeout after 90 seconds",
                    });
                }, 90000);
            });

            if (!result.success) {
                // Don't log curl errors to avoid interfering with progress bar
                return false;
            }

            // Check if file was created and has content
            if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
                // Don't log individual successes to avoid interfering with progress bar
                return true;
            } else {
                // Don't log individual failures to avoid interfering with progress bar
                return false;
            }
        } catch (error: any) {
            // Don't log curl errors to avoid interfering with progress bar
            return false;
        }
    }

    /**
     * Download text content using curl
     */
    async downloadText(
        url: string,
        headers?: Record<string, string>
    ): Promise<string | null> {
        try {
            const tempFile = path.join(
                os.tmpdir(),
                `temp_download_${Date.now()}.txt`
            );

            if (await this.downloadFile(url, tempFile, headers)) {
                const content = fs.readFileSync(tempFile, "utf8");
                fs.unlinkSync(tempFile); // Clean up temp file
                return content;
            }

            return null;
        } catch (error) {
            this.logger?.log(`Text download failed: ${error}`, "error");
            return null;
        }
    }

    private logger?: LogAgent;

    setLogger(logger: Logger) {
        this.logger = logger.agent("SimpleDownloader");
    }
}

export class M3U8Processor {
    private logger: LogAgent;
    private downloader: SimpleDownloader;
    private tempDir: string | null = null;
    private segmentFiles: string[] = [];
    private config: M3U8ProcessorConfig;
    private progressBar: cliProgress.SingleBar | null = null;
    private progressUpdateLock: boolean = false;
    private completedSegments: number = 0;
    private totalSegments: number = 0;
    private downloadStartTime: number = 0;

    constructor(logger: Logger, config: M3U8ProcessorConfig = {}) {
        this.logger = logger.agent("M3U8Processor");
        this.config = {
            outputFilepath: config.outputFilepath || DEFAULT_OUTPUT_DIR,
            maxWorkers: config.maxWorkers || 4,
            timeout: config.timeout || 30000, // Python default timeout
            retries: config.retries || 3,
            ffmpegPath: config.ffmpegPath, // Will be set in initializeFFmpeg
            segmentTimeout: config.segmentTimeout || 30000,
        };

        // Initialize FFmpeg path asynchronously
        this.initializeFFmpeg();

        // Create simple curl-based downloader with EXACT same headers as Python script
        this.downloader = new SimpleDownloader({
            // EXACT headers from working Python script (lines 26-38 in m3u8_downloader.py)
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                DNT: "1",
                Connection: "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Cache-Control": "max-age=0",
            },
        });

        // Set logger for downloader
        this.downloader.setLogger(this.logger.logger);
    }

    get outputFilename() {
        return path.basename(this.config.outputFilepath || DEFAULT_OUTPUT_DIR);
    }

    get outputDirpath() {
        return path.dirname(this.config.outputFilepath || DEFAULT_OUTPUT_DIR);
    }

    private async initializeFFmpeg(): Promise<void> {
        if (!this.config.ffmpegPath) {
            const bundledFFmpeg = await loadFFmpegStatic();
            this.config.ffmpegPath = bundledFFmpeg || "ffmpeg";

            if (bundledFFmpeg) {
                this.logger.log(
                    "Using bundled FFmpeg from ffmpeg-static",
                    "info"
                );
            } else {
                this.logger.log("Using system FFmpeg as fallback", "warn");
            }
        }
    }

    /**
     * Configure downloader headers - EXACT equivalent of Python session.headers.update()
     */
    private configureDownloaderHeaders(
        headers: Record<string, string>,
        m3u8Url?: string
    ): void {
        // Start with EXACT Python session headers (lines 26-38 in m3u8_downloader.py)
        this.downloader.defaults.headers.common = {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            DNT: "1",
            Connection: "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Cache-Control": "max-age=0",
        };

        // Add any custom headers from browser context (like Python custom_headers logic)
        if (headers["Referer"]) {
            this.downloader.defaults.headers.common["Referer"] =
                headers["Referer"];
        } else if (m3u8Url) {
            // If no referer provided, use the M3U8 domain as referer (common requirement)
            try {
                const url = new URL(m3u8Url);
                this.downloader.defaults.headers.common[
                    "Referer"
                ] = `${url.protocol}//${url.host}/`;
            } catch (e) {
                // Ignore URL parsing errors
            }
        }

        if (headers["Origin"]) {
            this.downloader.defaults.headers.common["Origin"] =
                headers["Origin"];
        } else if (m3u8Url) {
            // If no origin provided, use the M3U8 domain as origin (common requirement)
            try {
                const url = new URL(m3u8Url);
                this.downloader.defaults.headers.common[
                    "Origin"
                ] = `${url.protocol}//${url.host}`;
            } catch (e) {
                // Ignore URL parsing errors
            }
        }

        // Add any other captured headers that might be important
        for (const [key, value] of Object.entries(headers)) {
            if (value && !["Referer", "Origin"].includes(key)) {
                // Only add non-conflicting headers
                if (
                    ![
                        "User-Agent",
                        "Accept",
                        "Accept-Language",
                        "Accept-Encoding",
                        "DNT",
                        "Connection",
                        "Upgrade-Insecure-Requests",
                        "Sec-Fetch-Dest",
                        "Sec-Fetch-Mode",
                        "Sec-Fetch-Site",
                        "Sec-Fetch-User",
                        "Cache-Control",
                    ].includes(key)
                ) {
                    this.downloader.defaults.headers.common[key] = value;
                }
            }
        }
    }

    /**
     * Parse M3U8 playlist - Download file locally then parse it
     */
    private async parsePlaylist(
        m3u8Url: string,
        browserPage?: any
    ): Promise<Playlist | null> {
        try {
            this.logger.log(`Downloading M3U8 playlist: ${m3u8Url}`, "info");

            // Download M3U8 content using curl (much more reliable)
            const playlistContent = await this.downloader.downloadText(m3u8Url);

            if (!playlistContent) {
                this.logger.log("Failed to download M3U8 playlist", "error");
                return null;
            }

            this.logger.log(
                `M3U8 content downloaded: ${playlistContent.length} characters`,
                "info"
            );

            // Log first few lines of playlist for debugging
            const firstLines = playlistContent
                .split("\n")
                .slice(0, 5)
                .join("\n");
            this.logger.log(`Playlist preview:\n${firstLines}`, "debug");

            return this.parseM3U8Content(playlistContent, m3u8Url);
        } catch (error: any) {
            this.logger.log(
                `Error parsing playlist: ${error.message || error}`,
                "error"
            );
            return null;
        }
    }

    private extractOrigin(url: string): string {
        try {
            const urlObj = new URL(url);
            return `${urlObj.protocol}//${urlObj.host}`;
        } catch {
            return "";
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Parse M3U8 content - EXACT replication of Python m3u8.loads() behavior
     */
    private parseM3U8Content(content: string, baseUrl: string): Playlist {
        const lines = content
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line);
        const playlist: Playlist = { segments: [], playlists: [] };

        // First pass - determine if this is a master playlist or media playlist
        let isMasterPlaylist = false;
        for (const line of lines) {
            if (line.startsWith("#EXT-X-STREAM-INF:")) {
                isMasterPlaylist = true;
                break;
            }
        }

        if (isMasterPlaylist) {
            // Parse master playlist exactly like Python m3u8 library
            this.logger.log(
                "Parsing master playlist (multiple quality streams)",
                "info"
            );
            let i = 0;
            while (i < lines.length) {
                const line = lines[i];

                if (line.startsWith("#EXT-X-STREAM-INF:")) {
                    const streamInfo = this.parseStreamInfo(line);
                    const nextLine = lines[i + 1];
                    if (nextLine && !nextLine.startsWith("#")) {
                        playlist.playlists = playlist.playlists || [];
                        playlist.playlists.push({
                            uri: nextLine,
                            streamInfo,
                        });
                    }
                    i += 2;
                } else {
                    i++;
                }
            }

            this.logger.log(
                `Found ${playlist.playlists?.length || 0} quality variants`,
                "info"
            );
        } else {
            // Parse media playlist exactly like Python m3u8 library
            this.logger.log("Parsing media playlist (video segments)", "info");
            let i = 0;
            while (i < lines.length) {
                const line = lines[i];

                if (line.startsWith("#EXTINF:")) {
                    const duration = this.extractDuration(line);
                    const nextLine = lines[i + 1];
                    if (nextLine && !nextLine.startsWith("#")) {
                        playlist.segments.push({
                            uri: nextLine,
                            duration,
                        });
                    }
                    i += 2;
                } else {
                    i++;
                }
            }

            this.logger.log(
                `Found ${playlist.segments.length} video segments`,
                "info"
            );
        }

        return playlist;
    }

    /**
     * Parse stream info from EXT-X-STREAM-INF line
     */
    private parseStreamInfo(line: string): {
        bandwidth?: number;
        resolution?: string;
        codecs?: string;
    } {
        const streamInfo: any = {};

        const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
        if (bandwidthMatch) {
            streamInfo.bandwidth = parseInt(bandwidthMatch[1]);
        }

        const resolutionMatch = line.match(/RESOLUTION=([^,\s]+)/);
        if (resolutionMatch) {
            streamInfo.resolution = resolutionMatch[1];
        }

        const codecsMatch = line.match(/CODECS="([^"]+)"/);
        if (codecsMatch) {
            streamInfo.codecs = codecsMatch[1];
        }

        return streamInfo;
    }

    /**
     * Extract duration from EXTINF line
     */
    private extractDuration(line: string): number | undefined {
        const match = line.match(/#EXTINF:([\d.]+)/);
        return match ? parseFloat(match[1]) : undefined;
    }

    /**
     * Select best quality stream - EXACT copy of Python _select_quality method
     */
    private selectBestQuality(
        masterPlaylist: Playlist,
        baseUrl: string
    ): string | null {
        if (
            !masterPlaylist.playlists ||
            masterPlaylist.playlists.length === 0
        ) {
            this.logger.log(
                "No quality variants found in master playlist",
                "error"
            );
            return null;
        }

        // Extract available qualities exactly like Python
        const qualities: Array<{
            url: string;
            resolution: string;
            bandwidth: number;
            playlist: PlaylistInfo;
        }> = [];

        for (const playlist of masterPlaylist.playlists) {
            const resolution = playlist.streamInfo.resolution;
            const bandwidth = playlist.streamInfo.bandwidth || 0;

            if (resolution) {
                // Parse resolution like Python (width x height)
                const [width, height] = resolution.split("x").map(Number);
                qualities.push({
                    url: playlist.uri,
                    resolution: `${width}x${height}`,
                    bandwidth: bandwidth,
                    playlist: playlist,
                });
            }
        }

        // Sort by resolution (height) exactly like Python
        qualities.sort((a, b) => {
            const heightA = parseInt(a.resolution.split("x")[1]);
            const heightB = parseInt(b.resolution.split("x")[1]);
            return heightB - heightA; // Descending order (best first)
        });

        this.logger.log("Available qualities:", "info");
        qualities.forEach((q, i) => {
            this.logger.log(
                `${i + 1}. ${q.resolution} (${q.bandwidth} bps)`,
                "info"
            );
        });

        // Auto-select best quality (like Python quality_preference='best')
        const selected = qualities[0];
        this.logger.log(`Selected quality: ${selected.resolution}`, "info");

        return this.resolveUrl(selected.url, baseUrl);
    }

    /**
     * Initialize progress tracking with single updating line
     */
    private initializeProgressBar(totalSegments: number): void {
        // Stop any existing progress bar first
        this.stopProgressBar();

        // Initialize the progress display
        this.updateProgressDisplay(0, totalSegments, "0.0", "0.0");
    }

    /**
     * Update progress display with single overwriting line
     */
    private updateProgressDisplay(
        completed: number,
        total: number,
        speed: string,
        percentage: string
    ): void {
        // Create a visual progress bar
        // const barWidth = 40;
        // const filledWidth = Math.round((completed / total) * barWidth);
        // const emptyWidth = barWidth - filledWidth;
        // const bar = "█".repeat(filledWidth) + "░".repeat(emptyWidth);

        // Calculate ETA
        const speedNum = parseFloat(speed);
        const remainingSegments = total - completed;
        const etaSeconds =
            speedNum > 0 ? Math.round(remainingSegments / speedNum) : 0;
        // const eta = etaSeconds > 0 ? `${etaSeconds}s` : "N/A";

        // Create the progress line with padding to clear previous content
        // const progressLine = `Downloading |${bar}| ${percentage}% || ${completed}/${total} segments || ETA: ${eta} || Speed: ${speed} seg/s`;
        // const paddedLine = progressLine.padEnd(120, " "); // Pad to 120 chars to clear any leftover text

        // // Clear line and write new content
        // process.stdout.write(`\r${paddedLine}\r${progressLine}`);

        // // Add newline only when complete
        // if (completed === total) {
        //     process.stdout.write("\n");
        // }

        // Calculate actual progress data
        const elapsed = (Date.now() - this.downloadStartTime) / 1000;

        // Estimate bytes (assuming ~500KB average per segment)
        const avgSegmentSize = 500 * 1024; // 500KB
        const estimatedTotalBytes = total * avgSegmentSize;
        const estimatedDownloadedBytes = completed * avgSegmentSize;

        // Format helpers
        const formatBytes = (bytes: number): string => {
            const mb = bytes / (1024 * 1024);
            return mb >= 1
                ? `${mb.toFixed(2)}MiB`
                : `${(bytes / 1024).toFixed(2)}KiB`;
        };

        const formatTime = (seconds: number): string => {
            const hours = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            return `${hours.toString().padStart(2, "0")}:${mins
                .toString()
                .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        };

        const speedBytesPerSec = speedNum * avgSegmentSize;
        const progressData = {
            status: completed === total ? "finished" : "downloading",
            downloaded_bytes: estimatedDownloadedBytes,
            total_bytes: estimatedTotalBytes,
            tmpfilename: `segment_${completed
                .toString()
                .padStart(5, "0")}.ts.part`,
            filename: `video_segments_${total}_total.mp4`,
            eta: etaSeconds,
            speed: speedBytesPerSec,
            elapsed: elapsed,
            ctx_id: null,
            _eta_str: etaSeconds > 0 ? formatTime(etaSeconds) : "N/A",
            _speed_str:
                speedBytesPerSec > 0
                    ? `${(speedBytesPerSec / (1024 * 1024)).toFixed(2)}MiB/s`
                    : "N/A",
            _percent_str: percentage + "%",
            _total_bytes_str: formatBytes(estimatedTotalBytes),
            _total_bytes_estimate_str: formatBytes(estimatedTotalBytes),
            _downloaded_bytes_str: formatBytes(estimatedDownloadedBytes),
            _elapsed_str: formatTime(elapsed),
            _default_template: `${percentage}% of ${formatBytes(
                estimatedTotalBytes
            )} at ${
                speedBytesPerSec > 0
                    ? (speedBytesPerSec / (1024 * 1024)).toFixed(2) + "MiB/s"
                    : "N/A"
            } ETA ${etaSeconds > 0 ? formatTime(etaSeconds) : "N/A"}`,
        };

        const payload = JSON.stringify(progressData);

        this.logger.logger.append(payload);
        this.logger.logger.invokeEvent.sender.send(
            this.logger.logger.downloadId,
            {
                data: {
                    log: payload,
                    value: progressData,
                },
                completeLog: this.logger.logger.toString(),
            }
        );
    }

    /**
     * Increment completed segments counter and log progress periodically
     */
    private incrementProgress(): void {
        if (this.progressUpdateLock) {
            return;
        }

        this.progressUpdateLock = true;

        try {
            this.completedSegments++;
            const elapsed = (Date.now() - this.downloadStartTime) / 1000;
            const speed =
                elapsed > 0
                    ? (this.completedSegments / elapsed).toFixed(1)
                    : "0.0";
            const percentage = (
                (this.completedSegments / this.totalSegments) *
                100
            ).toFixed(1);

            // Update progress bar that overwrites itself
            this.updateProgressDisplay(
                this.completedSegments,
                this.totalSegments,
                speed,
                percentage
            );
        } catch (error) {
            this.logger.log(`Progress update error: ${error}`, "debug");
        } finally {
            this.progressUpdateLock = false;
        }
    }

    /**
     * Update progress bar with current status (thread-safe with simple locking)
     */
    private updateProgressBar(
        current: number,
        total: number,
        speed?: string
    ): void {
        if (this.progressUpdateLock || !this.progressBar) {
            return; // Skip if already updating or no progress bar
        }

        if (this.progressBar && !this.progressBar.isActive) {
            return; // Don't update if progress bar is stopped
        }

        this.progressUpdateLock = true;

        try {
            if (this.progressBar) {
                this.progressBar.update(current, {
                    speed: speed || "N/A",
                });
            }
        } catch (error) {
            // Ignore progress bar update errors to prevent crashes
            this.logger.log(`Progress bar update error: ${error}`, "debug");
        } finally {
            this.progressUpdateLock = false;
        }
    }

    /**
     * Stop and cleanup progress tracking (safe)
     */
    private stopProgressBar(): void {
        // No visual progress bar to stop, just reset counters
        this.progressBar = null;
        this.progressUpdateLock = false;
    }

    /**
     * Download video segments using curl - Much more reliable than custom HTTP
     */
    private async downloadSegments(
        playlist: Playlist,
        baseUrl: string,
        maxWorkers: number,
        progressCallback?: (current: number, total: number) => void
    ): Promise<boolean> {
        if (!playlist.segments || playlist.segments.length === 0) {
            this.logger.log("No segments found in playlist", "error");
            return false;
        }

        // Create temporary directory exactly like Python with unique identifier
        const uniqueId = `${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`;
        this.tempDir = fs.mkdtempSync(
            path.join(os.tmpdir(), `m3u8_download_${uniqueId}_`)
        );

        // Initialize progress tracking
        this.totalSegments = playlist.segments.length;
        this.completedSegments = 0;
        this.downloadStartTime = Date.now();

        this.logger.log(
            `Starting download of ${this.totalSegments} segments...`,
            "info"
        );

        // Initialize progress bar
        this.initializeProgressBar(this.totalSegments);

        let successCount = 0;

        // Download function for a single segment using curl with 10x retry
        const downloadSegment = async (
            segment: Segment,
            index: number
        ): Promise<boolean> => {
            const maxRetries = 10;
            const segmentUrl = this.resolveUrl(segment.uri, baseUrl);
            const segmentFile = path.join(
                this.tempDir!,
                `segment_${index.toString().padStart(5, "0")}.ts`
            );

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    // Don't log individual downloads to avoid interfering with progress bar

                    // Use curl to download segment
                    const success = await this.downloader.downloadFile(
                        segmentUrl,
                        segmentFile
                    );

                    if (success) {
                        this.segmentFiles.push(segmentFile);
                        successCount++;

                        // Update progress bar atomically
                        this.incrementProgress();

                        // Progress callback like Python tqdm
                        if (progressCallback) {
                            progressCallback(successCount, this.totalSegments);
                        }

                        return true;
                    } else {
                        if (attempt < maxRetries) {
                            const delay = Math.min(attempt * 300, 3000); // Progressive delays: 300ms, 600ms, 900ms... max 3s
                            await new Promise((resolve) =>
                                setTimeout(resolve, delay)
                            );
                        }
                    }
                } catch (error) {
                    // Don't log retry attempts to avoid interfering with progress bar

                    if (attempt < maxRetries) {
                        const delay = Math.min(attempt * 300, 3000); // Progressive delays: 300ms, 600ms, 900ms... max 3s
                        await new Promise((resolve) =>
                            setTimeout(resolve, delay)
                        );
                    }
                }
            }

            // Don't log final failure to avoid interfering with progress bar
            return false;
        };

        // Use Promise.all with concurrency limit exactly like Python ThreadPoolExecutor
        const semaphore = Array(maxWorkers).fill(0);
        const downloadPromises = playlist.segments.map((segment, index) => {
            return new Promise<boolean>((resolve) => {
                const execute = async () => {
                    const result = await downloadSegment(segment, index);
                    resolve(result);
                };

                // Wait for available worker slot
                const waitForSlot = () => {
                    const availableIndex = semaphore.findIndex(
                        (slot) => slot === 0
                    );
                    if (availableIndex !== -1) {
                        semaphore[availableIndex] = 1;
                        execute().finally(() => {
                            semaphore[availableIndex] = 0;
                        });
                    } else {
                        setTimeout(waitForSlot, 10);
                    }
                };

                waitForSlot();
            });
        });

        // Wait for all downloads like Python
        await Promise.all(downloadPromises);

        // Stop progress bar and show summary
        this.stopProgressBar();

        const totalTime = (Date.now() - this.downloadStartTime) / 1000;
        const avgSpeed =
            totalTime > 0 ? (successCount / totalTime).toFixed(1) : "N/A";

        // Clear the progress line and show completion message
        process.stdout.write("\r" + " ".repeat(100) + "\r"); // Clear the line
        this.logger.log(
            `Download completed: ${successCount}/${
                this.totalSegments
            } segments successful in ${totalTime.toFixed(
                1
            )}s (avg: ${avgSpeed} seg/s)`,
            "info"
        );

        if (successCount === 0) {
            this.logger.log(
                "No segments were downloaded successfully",
                "error"
            );
            return false;
        }

        // Accept partial success like Python (at least 80% of segments)
        const successRate = successCount / this.totalSegments;
        if (successRate < 0.8) {
            this.logger.log(
                `Partial success: ${(successRate * 100).toFixed(
                    1
                )}% - will try curl fallback`,
                "warn"
            );
            return false; // Force fallback to curl method
        } else {
            this.logger.log(
                `Successfully downloaded ${successCount} segments via direct HTTP`,
                "info"
            );
            return true;
        }

        return successCount > 0; // Return true if we got at least some segments
    }

    /**
     * Convert downloaded segments to MP4 - equivalent of Python _convert_to_mp4
     */
    private async convertToMp4(): Promise<boolean> {
        if (this.segmentFiles.length === 0) {
            this.logger.log("No segments to convert", "error");
            return false;
        }

        this.logger.log(
            `Converting ${this.segmentFiles.length} segments to MP4: ${this.outputFilename}`,
            "info"
        );

        try {
            // Ensure output directory exists
            const outputDir = this.outputDirpath;

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Create concatenation file for ffmpeg
            const concatFile = path.join(this.tempDir!, "concat.txt");
            const sortedSegments = this.segmentFiles.sort();
            const concatContent = sortedSegments
                .map((file) => `file '${file}'`)
                .join("\n");
            fs.writeFileSync(concatFile, concatContent);

            // Use ffmpeg to concatenate and convert
            const ffmpegArgs = [
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                concatFile,
                "-c:v",
                "copy", // Copy video codec
                "-c:a",
                "copy", // Copy audio codec
                "-f",
                "mp4",
                "-y", // Overwrite output
                this.config.outputFilepath || DEFAULT_OUTPUT_DIR,
            ];

            const success = await this.runFFmpeg(ffmpegArgs);

            if (success) {
                this.logger.log("Conversion completed successfully", "info");
                return true;
            } else {
                // Try alternative conversion method
                return await this.convertAlternative(this.outputFilename);
            }
        } catch (error) {
            this.logger.log(`Error during conversion: ${error}`, "error");
            return await this.convertAlternative(this.outputFilename);
        }
    }

    /**
     * Alternative conversion method - equivalent of Python _convert_alternative
     */
    private async convertAlternative(outputFilename: string): Promise<boolean> {
        try {
            this.logger.log("Trying alternative conversion method...", "info");

            const concatFile = path.join(this.tempDir!, "concat.txt");
            const sortedSegments = this.segmentFiles.sort();
            const concatContent = sortedSegments
                .map((file) => `file '${file}'`)
                .join("\n");
            fs.writeFileSync(concatFile, concatContent);

            const ffmpegArgs = [
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                concatFile,
                "-c:v",
                "libx264", // Use h264 codec
                "-c:a",
                "aac", // Use AAC audio codec
                "-f",
                "mp4",
                "-y", // Overwrite output
                outputFilename,
            ];

            const success = await this.runFFmpeg(ffmpegArgs);

            if (success) {
                this.logger.log(
                    "Alternative conversion completed successfully",
                    "info"
                );
                return true;
            } else {
                this.logger.log("Alternative conversion also failed", "error");
                return false;
            }
        } catch (error) {
            this.logger.log(
                `Alternative conversion also failed: ${error}`,
                "error"
            );
            return false;
        }
    }

    /**
     * Run FFmpeg with given arguments
     */
    private async runFFmpeg(args: string[]): Promise<boolean> {
        return new Promise((resolve) => {
            const ffmpeg = spawn(this.config.ffmpegPath || "ffmpeg", args);

            let hasError = false;

            ffmpeg.stderr?.on("data", (data) => {
                const output = data.toString();
                if (output.includes("error") || output.includes("Error")) {
                    this.logger.log(`FFmpeg error: ${output}`, "error");
                    hasError = true;
                }
            });

            ffmpeg.on("close", (code) => {
                if (code === 0 && !hasError) {
                    resolve(true);
                } else {
                    this.logger.log(
                        `FFmpeg failed with code: ${code}`,
                        "error"
                    );
                    resolve(false);
                }
            });

            ffmpeg.on("error", (error) => {
                this.logger.log(`FFmpeg process error: ${error}`, "error");
                resolve(false);
            });
        });
    }

    /**
     * Clean up temporary files - equivalent of Python _cleanup
     */
    private cleanup(): void {
        // Stop progress bar if still running
        this.stopProgressBar();

        if (this.tempDir && fs.existsSync(this.tempDir)) {
            try {
                fs.rmSync(this.tempDir, { recursive: true, force: true });
            } catch (error) {
                this.logger.log(
                    `Failed to cleanup temp directory: ${error}`,
                    "warn"
                );
            }
        }
        this.segmentFiles = [];
    }

    /**
     * Resolve URL relative to base URL
     */
    private resolveUrl(url: string, baseUrl: string): string {
        if (url.startsWith("http")) {
            return url;
        }

        try {
            return new URL(url, baseUrl).toString();
        } catch {
            // Fallback for malformed URLs
            const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
            return base + url;
        }
    }

    // Hybrid approach: Use browser session + TypeScript processing
    async processM3U8(
        m3u8Url: string,
        headers: Record<string, string>,
        browserPage?: any
    ): Promise<boolean> {
        try {
            // Ensure FFmpeg is initialized before processing
            await this.initializeFFmpeg();

            const outputDir = path.dirname(
                this.config.outputFilepath || DEFAULT_OUTPUT_DIR
            );
            const outputFilename = path.basename(
                this.config.outputFilepath || DEFAULT_OUTPUT_DIR
            );

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const fullPath = path.join(outputDir, outputFilename);

            this.logger.log(`Processing M3U8: ${m3u8Url}`, "info");
            this.logger.log(`Output: ${fullPath}`, "info");

            // Configure downloader with headers (including M3U8 URL for Referer/Origin) - exactly like Python
            this.configureDownloaderHeaders(headers, m3u8Url);

            // Step 1: Parse M3U8 playlist - try browser first if available, then direct HTTP
            this.logger.log(`Fetching M3U8 playlist from: ${m3u8Url}`, "info");
            let playlist = null;

            if (browserPage) {
                // Try browser approach first (works better with CDN restrictions)
                playlist = await this.parsePlaylistWithBrowser(
                    m3u8Url,
                    browserPage
                );
                if (playlist) {
                    this.logger.log(
                        "Successfully parsed M3U8 playlist via browser",
                        "info"
                    );
                } else {
                    this.logger.log(
                        "Browser M3U8 fetch failed, trying direct HTTP...",
                        "debug"
                    );
                }
            }

            if (!playlist) {
                // Fallback to direct HTTP (like Python)
                playlist = await this.parsePlaylist(m3u8Url);
                if (!playlist) {
                    this.logger.log(
                        "Failed to parse M3U8 playlist with both browser and direct HTTP",
                        "error"
                    );
                    return false;
                }
            }

            // Step 2: Handle master playlist if needed
            let finalPlaylist = playlist;
            if (playlist.playlists && playlist.playlists.length > 0) {
                this.logger.log(
                    "This appears to be a master playlist with multiple qualities",
                    "debug"
                );
                const selectedUrl = this.selectBestQuality(playlist, m3u8Url);

                if (!selectedUrl) {
                    return false;
                }

                this.logger.log(
                    `Selected quality URL: ${selectedUrl}`,
                    "debug"
                );
                const selectedPlaylist = await this.parsePlaylist(selectedUrl);
                if (!selectedPlaylist) {
                    return false;
                }
                finalPlaylist = selectedPlaylist;
            }

            const segmentSuccess = await this.downloadSegments(
                finalPlaylist,
                m3u8Url,
                this.config.maxWorkers || 4
            );
            if (!segmentSuccess) {
                this.logger.log("Failed to download segments", "error");
                return false;
            }

            // Step 4: Convert to MP4
            if (!(await this.convertToMp4())) {
                return false;
            }

            this.logger.log(
                `Download completed successfully: ${fullPath}`,
                "info"
            );
            return true;
        } catch (error) {
            this.logger.log(`M3U8 processing failed: ${error}`, "error");
            return false;
        } finally {
            this.cleanup();
        }
    }

    async downloadDirectVideo(
        videoUrl: string,
        headers: Record<string, string>
    ): Promise<boolean> {
        try {
            this.logger.log(`Downloading direct video: ${videoUrl}`, "info");

            const outputFilename = path.basename(
                this.config.outputFilepath || DEFAULT_OUTPUT_DIR
            );
            const outputDir = path.dirname(
                this.config.outputFilepath || DEFAULT_OUTPUT_DIR
            );
            const outputPath = path.join(outputDir, outputFilename);

            // Ensure downloads directory exists
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Build ffmpeg command with headers
            const ffmpegHeaders: string[] = [];
            for (const [key, value] of Object.entries(headers)) {
                if (value) {
                    ffmpegHeaders.push("-headers", `${key}: ${value}`);
                }
            }

            const ffmpegArgs = [
                "-y", // Overwrite output files
                "-loglevel",
                "info",
                ...ffmpegHeaders,
                "-i",
                videoUrl,
                "-c",
                "copy", // Copy without re-encoding
                "-f",
                "mp4",
                outputPath,
            ];

            const success = await this.runFFmpeg(ffmpegArgs);

            if (success) {
                this.logger.log(
                    `Direct video download successful: ${outputPath}`,
                    "info"
                );
                return true;
            } else {
                this.logger.log("Direct video download failed", "error");
                return false;
            }
        } catch (error) {
            this.logger.log(
                `Error downloading direct video: ${error}`,
                "error"
            );
            return false;
        }
    }

    // Browser-based methods that use the browser's session context

    private async parsePlaylistWithBrowser(
        url: string,
        browserPage: any
    ): Promise<Playlist | null> {
        try {
            this.logger.log(`Extracting M3U8 from browser: ${url}`, "debug");

            const response = await browserPage.evaluate((m3u8Url: string) => {
                return fetch(m3u8Url, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        Accept: "*/*",
                        "Accept-Language": "en-US,en;q=0.9",
                        "Cache-Control": "no-cache",
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(
                                `HTTP ${response.status}: ${response.statusText}`
                            );
                        }
                        return response.text();
                    })
                    .then((text) => ({ success: true, content: text }))
                    .catch((error) => ({
                        success: false,
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    }));
            }, url);

            if (!response.success) {
                this.logger.log(
                    `Browser M3U8 fetch failed: ${response.error}`,
                    "error"
                );
                return null;
            }

            return this.parseM3U8Content(response.content, url);
        } catch (error) {
            this.logger.log(
                `Error in browser M3U8 extraction: ${error}`,
                "error"
            );
            return null;
        }
    }

    private async downloadSegmentsWithBrowser(
        playlist: Playlist,
        baseUrl: string,
        browserPage: any,
        sessionHeaders?: Record<string, string>
    ): Promise<boolean> {
        if (!playlist.segments || playlist.segments.length === 0) {
            this.logger.log("No segments found in playlist", "error");
            return false;
        }

        if (!this.tempDir) {
            const uniqueId = `${Date.now()}_${Math.random()
                .toString(36)
                .substring(2, 9)}`;
            this.tempDir = fs.mkdtempSync(
                path.join(os.tmpdir(), `m3u8_download_${uniqueId}_`)
            );
        }

        this.totalSegments = playlist.segments.length;
        this.completedSegments = 0;
        this.downloadStartTime = Date.now();

        this.logger.log(
            `Starting browser download of ${this.totalSegments} segments...`,
            "info"
        );
        this.initializeProgressBar(this.totalSegments);

        let successCount = 0;
        const startTime = Date.now();

        // Simplified download function
        const downloadSegment = async (
            segment: Segment,
            index: number
        ): Promise<boolean> => {
            const segmentUrl = this.resolveUrl(segment.uri, baseUrl);

            try {
                const segmentData = await browserPage.evaluate(
                    (params: {
                        url: string;
                        headers: Record<string, string>;
                    }) => {
                        return fetch(params.url, {
                            method: "GET",
                            credentials: "include",
                            headers: params.headers,
                        })
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(
                                        `HTTP ${response.status}: ${response.statusText}`
                                    );
                                }
                                return response.arrayBuffer();
                            })
                            .then((arrayBuffer) => ({
                                success: true,
                                data: Array.from(new Uint8Array(arrayBuffer)),
                            }))
                            .catch((error) => ({
                                success: false,
                                error:
                                    error instanceof Error
                                        ? error.message
                                        : String(error),
                            }));
                    },
                    {
                        url: segmentUrl,
                        headers: sessionHeaders || {
                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                            Accept: "*/*",
                        },
                    }
                );

                if (segmentData.success) {
                    const segmentFile = path.join(
                        this.tempDir!,
                        `segment_${index.toString().padStart(5, "0")}.ts`
                    );
                    fs.writeFileSync(
                        segmentFile,
                        Buffer.from(segmentData.data)
                    );
                    this.segmentFiles.push(segmentFile);
                    successCount++;
                    this.incrementProgress();
                    return true;
                }
            } catch (error) {
                this.logger.log(
                    `Segment ${index + 1} failed: ${error}`,
                    "debug"
                );
            }
            return false;
        };

        // Download with concurrency limit
        const maxWorkers = 4;
        const semaphore = Array(maxWorkers).fill(0);
        const downloadPromises = playlist.segments.map((segment, index) => {
            return new Promise<boolean>((resolve) => {
                const execute = async () => {
                    const result = await downloadSegment(segment, index);
                    resolve(result);
                };

                const waitForSlot = () => {
                    const availableIndex = semaphore.findIndex(
                        (slot) => slot === 0
                    );
                    if (availableIndex !== -1) {
                        semaphore[availableIndex] = 1;
                        execute().finally(() => {
                            semaphore[availableIndex] = 0;
                        });
                    } else {
                        setTimeout(waitForSlot, 10);
                    }
                };

                waitForSlot();
            });
        });

        await Promise.all(downloadPromises);
        this.stopProgressBar();

        const totalTime = (Date.now() - startTime) / 1000;
        const successRate = successCount / this.totalSegments;

        this.logger.log(
            `Browser download: ${successCount}/${
                this.totalSegments
            } segments (${(successRate * 100).toFixed(
                1
            )}%) in ${totalTime.toFixed(1)}s`,
            "info"
        );

        return successRate >= 0.8;
    }
}
