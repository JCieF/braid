import * as fs from "fs";
import * as path from "path";
import { BaseHelper } from "./BaseHelper.js";
import { DownloadConfig } from "../types/index.js";
import { Logger } from "./StringBuilder.js";
import { DEFAULT_OUTPUT_DIR } from "./Constants.js";

export class DownloadHelper extends BaseHelper {
    private config: DownloadConfig;

    constructor(logger: Logger, config: DownloadConfig = {}) {
        super(logger);
        this.config = {
            outputFilepath: config.outputFilepath || DEFAULT_OUTPUT_DIR,
            maxWorkers: config.maxWorkers || 4,
            timeout: config.timeout || 30000,
            retries: config.retries || 3,
        };
    }

    get outputFilename() {
        return path.basename(this.config.outputFilepath || DEFAULT_OUTPUT_DIR);
    }

    get outputDirpath() {
        return path.dirname(this.config.outputFilepath || DEFAULT_OUTPUT_DIR);
    }

    ensureDownloadDirectory(): void {
        const outputDir = this.outputDirpath;

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            this.logger.log(`Created download directory: ${outputDir}`, "info");
        }
    }

    generateOutputFilename(
        prefix: string = "pokemon_video",
        extension: string = "mp4"
    ): string {
        const timestamp = this.generateTimestamp();
        return `${prefix}_${timestamp}.${extension}`;
    }

    getOutputPath(filename: string): string {
        this.ensureDownloadDirectory();

        return this.config.outputFilepath || DEFAULT_OUTPUT_DIR;
    }

    fileExists(filepath: string): boolean {
        return fs.existsSync(filepath);
    }

    getFileSize(filepath: string): number {
        try {
            const stats = fs.statSync(filepath);
            return stats.size;
        } catch {
            return 0;
        }
    }

    deleteFile(filepath: string): boolean {
        try {
            fs.unlinkSync(filepath);
            this.logger.log(`Deleted file: ${filepath}`, "info");
            return true;
        } catch (error) {
            this.logger.log(
                `Failed to delete file ${filepath}: ${error}`,
                "error"
            );
            return false;
        }
    }

    moveFile(source: string, destination: string): boolean {
        try {
            fs.renameSync(source, destination);
            this.logger.log(
                `Moved file from ${source} to ${destination}`,
                "info"
            );
            return true;
        } catch (error) {
            this.logger.log(
                `Failed to move file from ${source} to ${destination}: ${error}`,
                "error"
            );
            return false;
        }
    }

    copyFile(source: string, destination: string): boolean {
        try {
            fs.copyFileSync(source, destination);
            this.logger.log(
                `Copied file from ${source} to ${destination}`,
                "info"
            );
            return true;
        } catch (error) {
            this.logger.log(
                `Failed to copy file from ${source} to ${destination}: ${error}`,
                "error"
            );
            return false;
        }
    }

    listDownloadedFiles(): string[] {
        try {
            this.ensureDownloadDirectory();
            return fs.readdirSync(this.config.outputFilepath!);
        } catch (error) {
            this.logger.log(
                `Failed to list downloaded files: ${error}`,
                "error"
            );
            return [];
        }
    }

    getDownloadStats(): { count: number; totalSize: number } {
        const files = this.listDownloadedFiles();
        let totalSize = 0;

        for (const file of files) {
            const filepath = path.join(this.config.outputFilepath!, file);
            totalSize += this.getFileSize(filepath);
        }

        return {
            count: files.length,
            totalSize,
        };
    }

    formatFileSize(bytes: number): string {
        const units = ["B", "KB", "MB", "GB", "TB"];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    cleanupIncompleteFiles(): void {
        try {
            const files = this.listDownloadedFiles();

            for (const file of files) {
                const filepath = path.join(this.config.outputFilepath!, file);
                const size = this.getFileSize(filepath);

                // Delete files smaller than 1MB as they're likely incomplete
                if (size < 1024 * 1024) {
                    this.logger.log(
                        `Deleting incomplete file: ${file} (${this.formatFileSize(
                            size
                        )})`,
                        "warn"
                    );
                    this.deleteFile(filepath);
                }
            }
        } catch (error) {
            this.logger.log(
                `Failed to cleanup incomplete files: ${error}`,
                "error"
            );
        }
    }

    getConfig(): DownloadConfig {
        return { ...this.config };
    }

    updateConfig(newConfig: Partial<DownloadConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.logger.log("Download configuration updated", "info");
    }
}
