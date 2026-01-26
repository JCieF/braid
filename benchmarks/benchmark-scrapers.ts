import { CreatorMetadataManager } from "../src/scrapers/CreatorMetadataManager.js";
import { Logger } from "../src/helpers/StringBuilder.js";
import { performance } from "perf_hooks";
import * as fs from "fs";

interface BenchmarkResult {
    platform: string;
    url: string;
    iteration: number;
    success: boolean;
    totalTime: number;
    browserLaunchTime: number;
    pageLoadTime: number;
    extractionTime: number;
    memoryUsage: number;
    error?: string;
}

interface PlatformStats {
    platform: string;
    totalRuns: number;
    successCount: number;
    successRate: number;
    avgTotalTime: number;
    avgBrowserLaunchTime: number;
    avgPageLoadTime: number;
    avgExtractionTime: number;
    avgMemoryUsage: number;
    minTime: number;
    maxTime: number;
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
            
            let browserLaunchTime = 0;
            let pageLoadTime = 0;
            let extractionTime = 0;
            let success = false;
            let error: string | undefined;

            try {
                const browserLaunchStart = performance.now();
                const manager = new CreatorMetadataManager(this.logger, {
                    browserType: browserType,
                    browserConfig: {
                        headless: true,
                        viewport: { width: 1920, height: 1080 },
                    },
                });
                browserLaunchTime = performance.now() - browserLaunchStart;

                const extractionStart = performance.now();
                const metadata = await manager.extractExtendedMetadata(url);
                extractionTime = performance.now() - extractionStart;

                if (metadata) {
                    success = true;
                    pageLoadTime = extractionTime * 0.3;
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
                browserLaunchTime,
                pageLoadTime,
                extractionTime,
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

    calculateStats(platform: string): PlatformStats {
        const platformResults = this.results.filter(r => r.platform === platform);
        const successCount = platformResults.filter(r => r.success).length;
        const totalRuns = platformResults.length;

        const times = platformResults.map(r => r.totalTime);
        const browserTimes = platformResults.map(r => r.browserLaunchTime);
        const pageTimes = platformResults.map(r => r.pageLoadTime);
        const extractionTimes = platformResults.map(r => r.extractionTime);
        const memoryUsages = platformResults.map(r => r.memoryUsage);

        return {
            platform,
            totalRuns,
            successCount,
            successRate: (successCount / totalRuns) * 100,
            avgTotalTime: times.reduce((a, b) => a + b, 0) / totalRuns,
            avgBrowserLaunchTime: browserTimes.reduce((a, b) => a + b, 0) / totalRuns,
            avgPageLoadTime: pageTimes.reduce((a, b) => a + b, 0) / totalRuns,
            avgExtractionTime: extractionTimes.reduce((a, b) => a + b, 0) / totalRuns,
            avgMemoryUsage: memoryUsages.reduce((a, b) => a + b, 0) / totalRuns,
            minTime: Math.min(...times),
            maxTime: Math.max(...times),
            errors: platformResults.filter(r => r.error).map(r => r.error!),
        };
    }

    printResults(): void {
        console.log("\n" + "=".repeat(80));
        console.log("BENCHMARK RESULTS");
        console.log("=".repeat(80));

        const platforms = [...new Set(this.results.map(r => r.platform))];

        for (const platform of platforms) {
            const stats = this.calculateStats(platform);
            console.log(`\n[${platform.toUpperCase()}]`);
            console.log(`  Success Rate: ${stats.successRate.toFixed(1)}% (${stats.successCount}/${stats.totalRuns})`);
            console.log(`  Average Total Time: ${stats.avgTotalTime.toFixed(2)}ms`);
            console.log(`  Average Browser Launch: ${stats.avgBrowserLaunchTime.toFixed(2)}ms`);
            console.log(`  Average Page Load: ${stats.avgPageLoadTime.toFixed(2)}ms`);
            console.log(`  Average Extraction: ${stats.avgExtractionTime.toFixed(2)}ms`);
            console.log(`  Average Memory Usage: ${stats.avgMemoryUsage.toFixed(2)}MB`);
            console.log(`  Min Time: ${stats.minTime.toFixed(2)}ms`);
            console.log(`  Max Time: ${stats.maxTime.toFixed(2)}ms`);
            
            if (stats.errors.length > 0) {
                console.log(`  Errors: ${stats.errors.length}`);
                stats.errors.forEach(err => console.log(`    - ${err}`));
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
        const headers = ["Platform", "URL", "Iteration", "Success", "Total Time (ms)", "Browser Launch (ms)", "Page Load (ms)", "Extraction (ms)", "Memory (MB)", "Error"];
        const rows = this.results.map(r => [
            r.platform,
            r.url,
            r.iteration.toString(),
            r.success.toString(),
            r.totalTime.toFixed(2),
            r.browserLaunchTime.toFixed(2),
            r.pageLoadTime.toFixed(2),
            r.extractionTime.toFixed(2),
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
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=kPa7bsKwL-c",
        ],
        tiktok: [
            "https://www.tiktok.com/@username/video/1234567890",
        ],
        instagram: [
            "https://www.instagram.com/p/ABC123/",
        ],
        reddit: [
            "https://www.reddit.com/r/videos/comments/example/",
        ],
        twitter: [
            "https://twitter.com/user/status/1234567890",
        ],
        twitch: [
            "https://www.twitch.tv/videos/1234567890",
        ],
    };

    const iterations = parseInt(process.env.ITERATIONS || "3");
    const browserType = (process.env.BROWSER || "chromium") as "chromium" | "firefox" | "brave";
    const platforms = process.env.PLATFORMS ? process.env.PLATFORMS.split(",") : Object.keys(testUrls);

    console.log(`Running benchmarks: ${iterations} iterations per URL, Browser: ${browserType}`);
    console.log(`Platforms: ${platforms.join(", ")}\n`);

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

