import { CreatorMetadataManager } from "../src/scrapers/CreatorMetadataManager";
import { Logger } from "../src/helpers/StringBuilder";
import { performance } from "perf_hooks";
import * as fs from "fs";

interface BenchmarkResult {
    platform: string;
    url: string;
    iteration: number;
    success: boolean;
    totalTime: number;
    memoryUsage: number;
    error?: string;
}

interface PlatformStats {
    platform: string;
    totalRuns: number;
    successCount: number;
    successRate: number;
    avgTotalTime: number;
    avgMemoryUsage: number;
    minTime: number;
    maxTime: number;
    timeRange: number;
    stdDeviation: number;
    coefficientOfVariation: number;
    errors: string[];
}

const mockInvokeEvent = {
    sender: {
        send: (id: string, data: any) => {
            // Silent for benchmarking
        },
    },
};

class ScraperBenchmark {
    private results: BenchmarkResult[] = [];
    private logger: Logger;

    constructor() {
        this.logger = new Logger("benchmark", mockInvokeEvent);
    }

    async benchmarkScraper(
        platform: string,
        url: string,
        iterations: number = 3,
        browserType: "chromium" | "firefox" | "brave" = "chromium"
    ): Promise<BenchmarkResult[]> {
        const platformResults: BenchmarkResult[] = [];

        for (let i = 0; i < iterations; i++) {
            console.log(`\n[${platform}] Iteration ${i + 1}/${iterations} - ${url}`);
            
            const startTime = performance.now();
            const startMemory = process.memoryUsage().heapUsed;
            
            let success = false;
            let error: string | undefined;

            try {
                const scraperMode = process.env.SCRAPER_MODE as "local" | "api" | undefined;
                const apiBaseUrl = process.env.ML_API_BASE_URL || "https://ondemand-scraper-api.media-meter.in";
                const useApi = scraperMode === "api";

                const managerConfig: {
                    browserType: "chromium" | "firefox" | "brave";
                    browserConfig: { headless: boolean; viewport: { width: number; height: number } };
                    scraperMode?: "api";
                    platformOverrides?: Record<string, "api">;
                    apiConfig?: { baseUrl: string; enabled: boolean };
                } = {
                    browserType: browserType,
                    browserConfig: {
                        headless: true,
                        viewport: { width: 1920, height: 1080 },
                    },
                };
                if (useApi) {
                    managerConfig.scraperMode = "api";
                    managerConfig.platformOverrides = {
                        youtube: "api",
                        facebook: "api",
                        twitter: "api",
                        reddit: "api",
                    };
                    managerConfig.apiConfig = {
                        baseUrl: apiBaseUrl,
                        enabled: true,
                    };
                }

                const manager = new CreatorMetadataManager(this.logger, managerConfig);

                const metadata = await manager.extractExtendedMetadata(url);

                if (metadata) {
                    success = true;
                } else {
                    error = "No metadata returned";
                }
            } catch (err) {
                error = err instanceof Error ? err.message : String(err);
            }

            const totalTime = performance.now() - startTime;
            const endMemory = process.memoryUsage().heapUsed;
            const memoryUsage = (endMemory - startMemory) / 1024 / 1024;

            const result: BenchmarkResult = {
                platform,
                url,
                iteration: i + 1,
                success,
                totalTime,
                memoryUsage,
                error,
            };

            platformResults.push(result);
            this.results.push(result);

            console.log(`  Success: ${success}, Time: ${totalTime.toFixed(2)}ms, Memory: ${memoryUsage.toFixed(2)}MB`);
            if (error) {
                console.log(`  Error: ${error}`);
            }
        }

        return platformResults;
    }

    private getUrlLabel(url: string): string {
        if (url.includes("/shorts/")) return "Shorts";
        if (url.includes("watch?v=") || url.includes("/watch/")) return "Watch";
        if (url.includes("/reel/")) return "Reel";
        if (url.includes("/status/")) return "Status";
        if (url.includes("/comments/")) return "Post";
        if (url.includes("/video/")) return "Video";
        try {
            const u = new URL(url);
            return u.pathname.split("/").filter(Boolean).pop() || url.slice(0, 40);
        } catch {
            return url.slice(0, 40);
        }
    }

    calculateStats(platform: string, url?: string): PlatformStats {
        const platformResults = url
            ? this.results.filter(r => r.platform === platform && r.url === url)
            : this.results.filter(r => r.platform === platform);
        const successCount = platformResults.filter(r => r.success).length;
        const totalRuns = platformResults.length;

        const times = platformResults.map(r => r.totalTime);
        const memoryUsages = platformResults.map(r => r.memoryUsage);

        const avgTime = times.reduce((a, b) => a + b, 0) / totalRuns;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);
        const timeRange = maxTime - minTime;

        // Calculate standard deviation
        const variance = times.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / totalRuns;
        const stdDeviation = Math.sqrt(variance);

        // Coefficient of variation (std dev / mean * 100) - shows relative consistency
        const coefficientOfVariation = (stdDeviation / avgTime) * 100;

        return {
            platform,
            totalRuns,
            successCount,
            successRate: (successCount / totalRuns) * 100,
            avgTotalTime: avgTime,
            avgMemoryUsage: memoryUsages.reduce((a, b) => a + b, 0) / totalRuns,
            minTime,
            maxTime,
            timeRange,
            stdDeviation,
            coefficientOfVariation,
            errors: platformResults.filter(r => r.error).map(r => r.error!),
        };
    }

    private formatSeconds(ms: number): string {
        return `${(ms / 1000).toFixed(2)}s`;
    }

    printResults(): void {
        console.log("\n" + "=".repeat(80));
        console.log("BENCHMARK RESULTS");
        console.log("=".repeat(80));

        const platforms = [...new Set(this.results.map(r => r.platform))];

        for (const platform of platforms) {
            const urlsInPlatform = [...new Set(this.results.filter(r => r.platform === platform).map(r => r.url))];

            for (const url of urlsInPlatform) {
                const stats = this.calculateStats(platform, url);
                const label = this.getUrlLabel(url);
                console.log(`\n[${platform.toUpperCase()}] ${label}`);
                console.log(`  URL: ${url}`);
                console.log(`  Success Rate: ${stats.successRate.toFixed(1)}% (${stats.successCount}/${stats.totalRuns})`);
                console.log(`  Average Total Time: ${this.formatSeconds(stats.avgTotalTime)}`);
                console.log(`  Average Memory Usage: ${stats.avgMemoryUsage.toFixed(2)}MB`);
                console.log(`  Time Range: ${this.formatSeconds(stats.minTime)} - ${this.formatSeconds(stats.maxTime)} (Spread: ${this.formatSeconds(stats.timeRange)})`);
                console.log(`  Standard Deviation: ${this.formatSeconds(stats.stdDeviation)}`);
                console.log(`  Consistency: ${stats.coefficientOfVariation.toFixed(1)}% (lower = more consistent)`);
                if (stats.errors.length > 0) {
                    console.log(`  Errors: ${stats.errors.length}`);
                    stats.errors.forEach(err => console.log(`    - ${err}`));
                }
            }
        }

        console.log("\n" + "=".repeat(80));
    }

    exportJSON(filename: string): void {
        const platforms = [...new Set(this.results.map(r => r.platform))];
        const summary = platforms.map(p => this.calculateStats(p));
        
        const output = {
            timestamp: new Date().toISOString(),
            summary,
            detailedResults: this.results,
        };

        fs.writeFileSync(filename, JSON.stringify(output, null, 2));
        console.log(`\nResults exported to ${filename}`);
    }

    exportCSV(filename: string): void {
        const headers = ["Platform", "URL", "Iteration", "Success", "Total Time (ms)", "Memory (MB)", "Error"];
        const rows = this.results.map(r => [
            r.platform,
            r.url,
            r.iteration.toString(),
            r.success.toString(),
            r.totalTime.toFixed(2),
            r.memoryUsage.toFixed(2),
            r.error || "",
        ]);

        const csv = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
        ].join("\n");

        fs.writeFileSync(filename, csv);
        console.log(`\nCSV exported to ${filename}`);
    }
}

async function runBenchmarks() {
    const benchmark = new ScraperBenchmark();

    const testUrls: Record<string, string[]> = {
        youtube: [
            "https://www.youtube.com/shorts/jvp9EYIuq3Q",
            "https://www.youtube.com/watch?v=kPa7bsKwL-c",
        ],
        facebook: [
            "https://www.facebook.com/reel/4402969013312976",
        ],
        twitter: [
            "https://twitter.com/user/status/1234567890",
        ],
        reddit: [
            "https://www.reddit.com/r/videos/comments/example/",
        ],
        tiktok: [
            "https://www.tiktok.com/@username/video/1234567890",
        ],
        twitch: [
            "https://www.twitch.tv/videos/1234567890",
        ],
    };

    const iterations = parseInt(process.env.ITERATIONS || "3");
    const browserType = (process.env.BROWSER || "chromium") as "chromium" | "firefox" | "brave";
    const platforms = process.env.PLATFORMS ? process.env.PLATFORMS.split(",") : Object.keys(testUrls);
    const scraperMode = process.env.SCRAPER_MODE;

    console.log(`Running benchmarks: ${iterations} iterations per URL, Browser: ${browserType}`);
    console.log(`Platforms: ${platforms.join(", ")}`);
    if (scraperMode === "api") {
        console.log("Scraper mode: API (YouTube, Facebook, Twitter, Reddit use ML/DC API)");
    }
    console.log("");

    for (const platform of platforms) {
        const urls = testUrls[platform];
        if (!urls) {
            console.log(`Skipping ${platform} - no test URLs configured`);
            continue;
        }

        for (const url of urls) {
            await benchmark.benchmarkScraper(platform, url, iterations, browserType);
        }
    }

    benchmark.printResults();
    
    if (process.env.EXPORT_JSON) {
        benchmark.exportJSON(process.env.EXPORT_JSON);
    }
    
    if (process.env.EXPORT_CSV) {
        benchmark.exportCSV(process.env.EXPORT_CSV);
    }
}

if (require.main === module) {
    runBenchmarks().catch(console.error);
}

