"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatorMetadataManager = void 0;
var CreatorMetadataScraper_js_1 = require("./CreatorMetadataScraper.js");
var YouTubeScraper_js_1 = require("./YouTubeScraper.js");
var TikTokScraper_js_1 = require("./TikTokScraper.js");
var TwitterScraper_js_1 = require("./TwitterScraper.js");
var InstagramScraper_js_1 = require("./InstagramScraper.js");
var RedditScraper_js_1 = require("./RedditScraper.js");
var FacebookScraper_js_1 = require("./FacebookScraper.js");
var TwitchScraper_js_1 = require("./TwitchScraper.js");
var ChromiumBrowser_js_1 = require("../browsers/ChromiumBrowser.js");
var FirefoxBrowser_js_1 = require("../browsers/FirefoxBrowser.js");
var BraveBrowser_js_1 = require("../browsers/BraveBrowser.js");
var CreatorMetadataManager = /** @class */ (function () {
    function CreatorMetadataManager(logger, config) {
        if (config === void 0) { config = {}; }
        this.logger = logger;
        this.config = config;
    }
    CreatorMetadataManager.prototype.getScraperForPlatform = function (platform) {
        var logAgent = this.logger.agent("CreatorMetadataManager");
        switch (platform) {
            case "youtube":
                return new YouTubeScraper_js_1.YouTubeScraper(this.logger, this.config);
            case "tiktok":
                return new TikTokScraper_js_1.TikTokScraper(this.logger, this.config);
            case "twitter":
                return new TwitterScraper_js_1.TwitterScraper(this.logger, this.config);
            case "instagram":
                return new InstagramScraper_js_1.InstagramScraper(this.logger, this.config);
            case "reddit":
                return new RedditScraper_js_1.RedditScraper(this.logger, this.config);
            case "facebook":
                return new FacebookScraper_js_1.FacebookScraper(this.logger, this.config);
            case "twitch":
                return new TwitchScraper_js_1.TwitchScraper(this.logger, this.config);
            default:
                logAgent.log("No scraper available for platform: ".concat(platform), "warn");
                return null;
        }
    };
    CreatorMetadataManager.prototype.extractMetadata = function (videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var logAgent, browserInstance, page, platform, scraper, browserType, metadata, error_1, error_2, error_3;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        logAgent = this.logger.agent("CreatorMetadataManager");
                        browserInstance = null;
                        page = null;
                        _j.label = 1;
                    case 1:
                        _j.trys.push([1, 5, 6, 15]);
                        platform = CreatorMetadataScraper_js_1.CreatorMetadataScraper.detectPlatform(videoUrl);
                        logAgent.log("Detected platform: ".concat(platform), "info");
                        if (platform === "unknown") {
                            logAgent.log("Unknown platform for URL: ".concat(videoUrl), "warn");
                            return [2 /*return*/, null];
                        }
                        scraper = this.getScraperForPlatform(platform);
                        if (!scraper) {
                            return [2 /*return*/, null];
                        }
                        browserType = this.config.browserType || "chromium";
                        if (browserType === "chromium") {
                            browserInstance = new ChromiumBrowser_js_1.ChromiumBrowser(this.logger);
                        }
                        else if (browserType === "firefox") {
                            browserInstance = new FirefoxBrowser_js_1.FirefoxBrowser(this.logger);
                        }
                        else if (browserType === "brave") {
                            browserInstance = new BraveBrowser_js_1.BraveBrowser(this.logger);
                        }
                        else {
                            browserInstance = new ChromiumBrowser_js_1.ChromiumBrowser(this.logger);
                        }
                        return [4 /*yield*/, browserInstance.launch({
                                headless: (_b = (_a = this.config.browserConfig) === null || _a === void 0 ? void 0 : _a.headless) !== null && _b !== void 0 ? _b : true,
                                viewport: (_d = (_c = this.config.browserConfig) === null || _c === void 0 ? void 0 : _c.viewport) !== null && _d !== void 0 ? _d : { width: 1920, height: 1080 },
                                ignoreHTTPSErrors: (_f = (_e = this.config.browserConfig) === null || _e === void 0 ? void 0 : _e.ignoreHTTPSErrors) !== null && _f !== void 0 ? _f : true,
                                javaScriptEnabled: (_h = (_g = this.config.browserConfig) === null || _g === void 0 ? void 0 : _g.javaScriptEnabled) !== null && _h !== void 0 ? _h : true,
                            })];
                    case 2:
                        _j.sent();
                        return [4 /*yield*/, browserInstance.getPage()];
                    case 3:
                        page = _j.sent();
                        if (!page) {
                            logAgent.log("Failed to get browser page", "error");
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, scraper.extractMetadata(page, videoUrl)];
                    case 4:
                        metadata = _j.sent();
                        return [2 /*return*/, metadata];
                    case 5:
                        error_1 = _j.sent();
                        logAgent.log("Error extracting metadata: ".concat(error_1), "error");
                        return [2 /*return*/, null];
                    case 6:
                        if (!page) return [3 /*break*/, 10];
                        _j.label = 7;
                    case 7:
                        _j.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, page.close()];
                    case 8:
                        _j.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        error_2 = _j.sent();
                        return [3 /*break*/, 10];
                    case 10:
                        if (!browserInstance) return [3 /*break*/, 14];
                        _j.label = 11;
                    case 11:
                        _j.trys.push([11, 13, , 14]);
                        return [4 /*yield*/, browserInstance.close()];
                    case 12:
                        _j.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        error_3 = _j.sent();
                        return [3 /*break*/, 14];
                    case 14: return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    CreatorMetadataManager.prototype.extractMetadataFromPage = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var logAgent, platform, scraper, metadata, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logAgent = this.logger.agent("CreatorMetadataManager");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        platform = CreatorMetadataScraper_js_1.CreatorMetadataScraper.detectPlatform(videoUrl);
                        logAgent.log("Detected platform: ".concat(platform), "info");
                        if (platform === "unknown") {
                            logAgent.log("Unknown platform for URL: ".concat(videoUrl), "warn");
                            return [2 /*return*/, null];
                        }
                        scraper = this.getScraperForPlatform(platform);
                        if (!scraper) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, scraper.extractMetadata(page, videoUrl)];
                    case 2:
                        metadata = _a.sent();
                        return [2 /*return*/, metadata];
                    case 3:
                        error_4 = _a.sent();
                        logAgent.log("Error extracting metadata: ".concat(error_4), "error");
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CreatorMetadataManager.prototype.extractExtendedMetadata = function (videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var logAgent, browserInstance, page, platform, scraper, browserType, creatorMetadata, videoMetadata, result, error_5, error_6, error_7;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        logAgent = this.logger.agent("CreatorMetadataManager");
                        browserInstance = null;
                        page = null;
                        _j.label = 1;
                    case 1:
                        _j.trys.push([1, 6, 7, 16]);
                        platform = CreatorMetadataScraper_js_1.CreatorMetadataScraper.detectPlatform(videoUrl);
                        logAgent.log("Detected platform: ".concat(platform), "info");
                        if (platform === "unknown") {
                            logAgent.log("Unknown platform for URL: ".concat(videoUrl), "warn");
                            return [2 /*return*/, null];
                        }
                        scraper = this.getScraperForPlatform(platform);
                        if (!scraper) {
                            return [2 /*return*/, null];
                        }
                        browserType = this.config.browserType || "chromium";
                        if (browserType === "chromium") {
                            browserInstance = new ChromiumBrowser_js_1.ChromiumBrowser(this.logger);
                        }
                        else if (browserType === "firefox") {
                            browserInstance = new FirefoxBrowser_js_1.FirefoxBrowser(this.logger);
                        }
                        else if (browserType === "brave") {
                            browserInstance = new BraveBrowser_js_1.BraveBrowser(this.logger);
                        }
                        else {
                            browserInstance = new ChromiumBrowser_js_1.ChromiumBrowser(this.logger);
                        }
                        return [4 /*yield*/, browserInstance.launch({
                                headless: (_b = (_a = this.config.browserConfig) === null || _a === void 0 ? void 0 : _a.headless) !== null && _b !== void 0 ? _b : true,
                                viewport: (_d = (_c = this.config.browserConfig) === null || _c === void 0 ? void 0 : _c.viewport) !== null && _d !== void 0 ? _d : { width: 1920, height: 1080 },
                                ignoreHTTPSErrors: (_f = (_e = this.config.browserConfig) === null || _e === void 0 ? void 0 : _e.ignoreHTTPSErrors) !== null && _f !== void 0 ? _f : true,
                                javaScriptEnabled: (_h = (_g = this.config.browserConfig) === null || _g === void 0 ? void 0 : _g.javaScriptEnabled) !== null && _h !== void 0 ? _h : true,
                            })];
                    case 2:
                        _j.sent();
                        return [4 /*yield*/, browserInstance.getPage()];
                    case 3:
                        page = _j.sent();
                        if (!page) {
                            logAgent.log("Failed to get browser page", "error");
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, scraper.extractMetadata(page, videoUrl)];
                    case 4:
                        creatorMetadata = _j.sent();
                        return [4 /*yield*/, scraper.extractVideoMetadata(page, videoUrl)];
                    case 5:
                        videoMetadata = _j.sent();
                        result = {};
                        if (creatorMetadata)
                            result.creator = creatorMetadata;
                        if (videoMetadata)
                            result.video = videoMetadata;
                        return [2 /*return*/, Object.keys(result).length > 0 ? result : null];
                    case 6:
                        error_5 = _j.sent();
                        logAgent.log("Error extracting extended metadata: ".concat(error_5), "error");
                        return [2 /*return*/, null];
                    case 7:
                        if (!page) return [3 /*break*/, 11];
                        _j.label = 8;
                    case 8:
                        _j.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, page.close()];
                    case 9:
                        _j.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_6 = _j.sent();
                        return [3 /*break*/, 11];
                    case 11:
                        if (!browserInstance) return [3 /*break*/, 15];
                        _j.label = 12;
                    case 12:
                        _j.trys.push([12, 14, , 15]);
                        return [4 /*yield*/, browserInstance.close()];
                    case 13:
                        _j.sent();
                        return [3 /*break*/, 15];
                    case 14:
                        error_7 = _j.sent();
                        return [3 /*break*/, 15];
                    case 15: return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    CreatorMetadataManager.prototype.extractExtendedMetadataFromPage = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var logAgent, platform, scraper, creatorMetadata, videoMetadata, result, creatorFields, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logAgent = this.logger.agent("CreatorMetadataManager");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        platform = CreatorMetadataScraper_js_1.CreatorMetadataScraper.detectPlatform(videoUrl);
                        logAgent.log("Detected platform: ".concat(platform), "info");
                        if (platform === "unknown") {
                            logAgent.log("Unknown platform for URL: ".concat(videoUrl), "warn");
                            return [2 /*return*/, null];
                        }
                        scraper = this.getScraperForPlatform(platform);
                        if (!scraper) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, scraper.extractMetadata(page, videoUrl)];
                    case 2:
                        creatorMetadata = _a.sent();
                        return [4 /*yield*/, scraper.extractVideoMetadata(page, videoUrl)];
                    case 3:
                        videoMetadata = _a.sent();
                        result = {};
                        if (creatorMetadata)
                            result.creator = creatorMetadata;
                        if (videoMetadata)
                            result.video = videoMetadata;
                        if (creatorMetadata && videoMetadata && videoMetadata.creator_fields) {
                            creatorFields = videoMetadata.creator_fields;
                            if (creatorFields.creator_open_id)
                                creatorMetadata.creator_open_id = creatorFields.creator_open_id;
                            if (creatorFields.creator_union_id)
                                creatorMetadata.creator_union_id = creatorFields.creator_union_id;
                            if (creatorFields.creator_avatar_url_100)
                                creatorMetadata.creator_avatar_url_100 = creatorFields.creator_avatar_url_100;
                            if (creatorFields.creator_avatar_large_url)
                                creatorMetadata.creator_avatar_large_url = creatorFields.creator_avatar_large_url;
                            if (creatorFields.creator_profile_deep_link)
                                creatorMetadata.creator_profile_deep_link = creatorFields.creator_profile_deep_link;
                            if (creatorFields.creator_following_count !== undefined)
                                creatorMetadata.creator_following_count = creatorFields.creator_following_count;
                            if (creatorFields.creator_likes_count !== undefined)
                                creatorMetadata.creator_likes_count = creatorFields.creator_likes_count;
                            if (creatorFields.creator_video_count !== undefined)
                                creatorMetadata.creator_video_count = creatorFields.creator_video_count;
                        }
                        return [2 /*return*/, Object.keys(result).length > 0 ? result : null];
                    case 4:
                        error_8 = _a.sent();
                        logAgent.log("Error extracting extended metadata: ".concat(error_8), "error");
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return CreatorMetadataManager;
}());
exports.CreatorMetadataManager = CreatorMetadataManager;
