"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.YouTubeScraper = void 0;
var CreatorMetadataScraper_js_1 = require("./CreatorMetadataScraper.js");
/**
 * YouTube scraper focused on extracting metadata that yt-dlp cannot get.
 *
 * Fields yt-dlp CANNOT get (what this scraper extracts):
 * - creator_avatar_url: Channel profile image
 * - creator_verified: Verification badge status
 * - mentions: @mentions parsed from description
 * - embeddable: Whether video can be embedded
 * - dimension: 2d or 3d
 * - projection: 360 or rectangular
 * - madeForKids: Kids content flag
 * - isShort: YouTube Shorts detection
 */
var YouTubeScraper = /** @class */ (function (_super) {
    __extends(YouTubeScraper, _super);
    function YouTubeScraper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YouTubeScraper.prototype.getCreatorProfileUrl = function (videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null];
            });
        });
    };
    YouTubeScraper.prototype.extractMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var channelUrl, channelSelectors, _i, channelSelectors_1, selector, link, _a, metadata, _b, _c, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 15, , 16]);
                        this.logger.log("Extracting YouTube creator metadata (avatar, verified)...", "info");
                        return [4 /*yield*/, page.goto(videoUrl, { waitUntil: "domcontentloaded" })];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 2:
                        _d.sent();
                        channelUrl = null;
                        channelSelectors = [
                            'a[href*="/channel/"]',
                            'a[href*="/c/"]',
                            'a[href*="/user/"]',
                            'a[href*="/@"]',
                            'ytd-channel-name a',
                            '#channel-name a',
                        ];
                        _i = 0, channelSelectors_1 = channelSelectors;
                        _d.label = 3;
                    case 3:
                        if (!(_i < channelSelectors_1.length)) return [3 /*break*/, 6];
                        selector = channelSelectors_1[_i];
                        return [4 /*yield*/, this.getElementAttribute(page, selector, "href")];
                    case 4:
                        link = _d.sent();
                        if (link && (link.includes("/channel/") || link.includes("/c/") || link.includes("/user/") || link.includes("/@"))) {
                            channelUrl = link.startsWith("http") ? link : "https://www.youtube.com".concat(link);
                            return [3 /*break*/, 6];
                        }
                        _d.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (!channelUrl) {
                            this.logger.log("Could not find channel URL", "warn");
                            return [2 /*return*/, null];
                        }
                        this.logger.log("Found channel URL: ".concat(channelUrl), "debug");
                        return [4 /*yield*/, page.goto(channelUrl, { waitUntil: "networkidle" })];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9:
                        _d.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, page.waitForSelector('ytd-channel-avatar, #avatar', { timeout: 5000 })];
                    case 10:
                        _d.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        _a = _d.sent();
                        return [3 /*break*/, 12];
                    case 12:
                        metadata = {
                            platform: "youtube",
                            url: channelUrl,
                            extractedAt: Date.now(),
                        };
                        // Extract avatar URL (yt-dlp cannot get this)
                        _b = metadata;
                        return [4 /*yield*/, this.extractAvatarUrl(page)];
                    case 13:
                        // Extract avatar URL (yt-dlp cannot get this)
                        _b.creator_avatar_url = _d.sent();
                        // Extract verified status (yt-dlp cannot get this)
                        _c = metadata;
                        return [4 /*yield*/, this.extractVerifiedStatus(page)];
                    case 14:
                        // Extract verified status (yt-dlp cannot get this)
                        _c.creator_verified = _d.sent();
                        this.logger.log("Successfully extracted YouTube creator metadata", "info");
                        return [2 /*return*/, metadata];
                    case 15:
                        error_1 = _d.sent();
                        this.logger.log("Failed to extract YouTube metadata: ".concat(error_1), "error");
                        return [2 /*return*/, null];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    YouTubeScraper.prototype.extractVideoMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, videoIdMatch, isShortUrl, metadata, embeddedData, domData, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 16, , 17]);
                        this.logger.log("Extracting YouTube video metadata (all fields for fallback)...", "info");
                        return [4 /*yield*/, page.goto(videoUrl, { waitUntil: "networkidle" })];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, page.waitForSelector('ytd-video-primary-info-renderer, #top-level-buttons-computed', { timeout: 5000 })];
                    case 4:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        _a = _c.sent();
                        return [3 /*break*/, 6];
                    case 6: return [4 /*yield*/, this.delay(2000)];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8:
                        _c.trys.push([8, 11, , 12]);
                        return [4 /*yield*/, page.evaluate(function () {
                                var commentsSection = document.querySelector('ytd-comments-header-renderer, #comments');
                                if (commentsSection) {
                                    commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            })];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, this.delay(2000)];
                    case 10:
                        _c.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        _b = _c.sent();
                        return [3 /*break*/, 12];
                    case 12:
                        videoIdMatch = videoUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
                        isShortUrl = videoUrl.includes("/shorts/");
                        metadata = {
                            platform: "youtube",
                            url: videoUrl,
                            extractedAt: Date.now(),
                        };
                        if (videoIdMatch) {
                            metadata.video_id = videoIdMatch[1];
                        }
                        return [4 /*yield*/, this.extractYouTubeSpecificData(page)];
                    case 13:
                        embeddedData = _c.sent();
                        if (!embeddedData) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.extractFromDOM(page)];
                    case 14:
                        domData = _c.sent();
                        if (domData) {
                            if (!embeddedData.like_count && domData.like_count) {
                                embeddedData.like_count = domData.like_count;
                            }
                            if (!embeddedData.comment_count && domData.comment_count) {
                                embeddedData.comment_count = domData.comment_count;
                            }
                        }
                        _c.label = 15;
                    case 15:
                        if (embeddedData) {
                            // Fields that yt-dlp can get (for fallback/redundancy)
                            // Store title and description - prefer full description from ytInitialData
                            if (embeddedData.title) {
                                metadata.caption = embeddedData.title;
                            }
                            // Store full description (from ytInitialData is longer than shortDescription from videoDetails)
                            if (embeddedData.description) {
                                // If we have title, store description in a way we can access it
                                // For now, if no title, use description as caption
                                if (!metadata.caption) {
                                    metadata.caption = embeddedData.description;
                                }
                                else {
                                    // Title exists, append description to caption or store separately
                                    // Since VideoMetadata doesn't have separate description field, append to caption
                                    metadata.caption = "".concat(metadata.caption, "\n\n").concat(embeddedData.description);
                                }
                            }
                            if (embeddedData.view_count !== undefined)
                                metadata.view_count = embeddedData.view_count;
                            if (embeddedData.like_count !== undefined)
                                metadata.like_count = embeddedData.like_count;
                            if (embeddedData.comment_count !== undefined)
                                metadata.comment_count = embeddedData.comment_count;
                            if (embeddedData.timestamp !== undefined)
                                metadata.timestamp = embeddedData.timestamp;
                            if (embeddedData.tags)
                                metadata.hashtags = embeddedData.tags;
                            if (embeddedData.duration !== undefined)
                                metadata.duration = embeddedData.duration;
                            if (embeddedData.channel_id)
                                metadata.channel_id = embeddedData.channel_id;
                            if (embeddedData.channel_name)
                                metadata.channel_name = embeddedData.channel_name;
                            if (embeddedData.thumbnails && embeddedData.thumbnails.length > 0)
                                metadata.thumbnails = embeddedData.thumbnails;
                            if (embeddedData.definition)
                                metadata.definition = embeddedData.definition;
                            if (embeddedData.concurrentViewers !== undefined)
                                metadata.concurrentViewers = embeddedData.concurrentViewers;
                            // Fields that yt-dlp cannot get
                            if (embeddedData.mentions)
                                metadata.mentions = embeddedData.mentions;
                            if (embeddedData.embeddable !== undefined)
                                metadata.embeddable = embeddedData.embeddable;
                            if (embeddedData.dimension)
                                metadata.dimension = embeddedData.dimension;
                            if (embeddedData.projection)
                                metadata.projection = embeddedData.projection;
                            if (embeddedData.madeForKids !== undefined)
                                metadata.madeForKids = embeddedData.madeForKids;
                            if (embeddedData.isShort !== undefined)
                                metadata.isShort = embeddedData.isShort;
                            if (embeddedData.isLive !== undefined)
                                metadata.isLive = embeddedData.isLive;
                            if (embeddedData.isUpcoming !== undefined)
                                metadata.isUpcoming = embeddedData.isUpcoming;
                            if (embeddedData.hasCaptions !== undefined)
                                metadata.hasCaptions = embeddedData.hasCaptions;
                            if (embeddedData.isUnlisted !== undefined)
                                metadata.isUnlisted = embeddedData.isUnlisted;
                            if (embeddedData.isAgeRestricted !== undefined)
                                metadata.isAgeRestricted = embeddedData.isAgeRestricted;
                            if (embeddedData.category)
                                metadata.category = embeddedData.category;
                            if (embeddedData.defaultLanguage)
                                metadata.defaultLanguage = embeddedData.defaultLanguage;
                        }
                        // URL-based short detection as fallback
                        if (metadata.isShort === undefined && isShortUrl) {
                            metadata.isShort = true;
                        }
                        this.logger.log("Successfully extracted YouTube video metadata", "info");
                        return [2 /*return*/, metadata];
                    case 16:
                        error_2 = _c.sent();
                        this.logger.log("Failed to extract YouTube video metadata: ".concat(error_2), "error");
                        return [2 /*return*/, null];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    YouTubeScraper.prototype.extractFromDOM = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, page.evaluate(function () {
                                var result = {};
                                // Try to extract like count from DOM
                                var likeSelectors = [
                                    'ytd-toggle-button-renderer[aria-label*="like"]',
                                    'button[aria-label*="like"]',
                                    '#top-level-buttons-computed button[aria-label*="like"]',
                                ];
                                for (var _i = 0, likeSelectors_1 = likeSelectors; _i < likeSelectors_1.length; _i++) {
                                    var selector = likeSelectors_1[_i];
                                    try {
                                        var elements = document.querySelectorAll(selector);
                                        for (var _a = 0, elements_1 = elements; _a < elements_1.length; _a++) {
                                            var el = elements_1[_a];
                                            var ariaLabel = el.getAttribute('aria-label') || '';
                                            if (ariaLabel && ariaLabel.toLowerCase().includes('like') &&
                                                !ariaLabel.toLowerCase().includes('view') &&
                                                /[\d.,]+[KMB]?/.test(ariaLabel)) {
                                                var match = ariaLabel.match(/([\d.,]+[KMB]?)/);
                                                if (match) {
                                                    var num = parseFloat(match[1].replace(/,/g, ''));
                                                    var matchText = match[1];
                                                    if (matchText.includes('K') || matchText.includes('k'))
                                                        num *= 1000;
                                                    else if (matchText.includes('M') || matchText.includes('m'))
                                                        num *= 1000000;
                                                    else if (matchText.includes('B') || matchText.includes('b'))
                                                        num *= 1000000000;
                                                    if (num < 1000000000 && num > 0) {
                                                        result.like_count = Math.floor(num);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        if (result.like_count)
                                            break;
                                    }
                                    catch (e) {
                                        continue;
                                    }
                                }
                                // Try to extract comment count from DOM
                                var commentSelectors = [
                                    'ytd-comments-header-renderer #count',
                                    'h2#count',
                                    'yt-formatted-string[id="count"]',
                                    'ytd-comments-header-renderer yt-formatted-string',
                                    '#count-text',
                                    '[aria-label*="comment"]',
                                    'ytd-comments-header-renderer span',
                                ];
                                for (var _b = 0, commentSelectors_1 = commentSelectors; _b < commentSelectors_1.length; _b++) {
                                    var selector = commentSelectors_1[_b];
                                    try {
                                        var elements = document.querySelectorAll(selector);
                                        for (var _c = 0, elements_2 = elements; _c < elements_2.length; _c++) {
                                            var el = elements_2[_c];
                                            var text = (el.textContent || '').trim();
                                            if (text && /^[\d.,]+[KMB]?\s*(comment|comments)?$/i.test(text)) {
                                                var match = text.match(/([\d.,]+[KMB]?)/);
                                                if (match) {
                                                    var num = parseFloat(match[1].replace(/,/g, ''));
                                                    var matchText = match[1];
                                                    if (matchText.includes('K') || matchText.includes('k'))
                                                        num *= 1000;
                                                    else if (matchText.includes('M') || matchText.includes('m'))
                                                        num *= 1000000;
                                                    else if (matchText.includes('B') || matchText.includes('b'))
                                                        num *= 1000000000;
                                                    // Sanity check: comment count shouldn't exceed 100 million
                                                    if (num > 0 && num < 100000000) {
                                                        result.comment_count = Math.floor(num);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        if (result.comment_count)
                                            break;
                                    }
                                    catch (e) {
                                        continue;
                                    }
                                }
                                return result;
                            })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_3 = _a.sent();
                        this.logger.log("Failed to extract from DOM: ".concat(error_3), "debug");
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    YouTubeScraper.prototype.extractAvatarUrl = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var avatar, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.delay(2000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                var _a, _b;
                                // Method 1: ytd-channel-avatar container
                                var avatarContainer = document.querySelector('ytd-channel-avatar');
                                if (avatarContainer) {
                                    var img = avatarContainer.querySelector('img');
                                    if (img) {
                                        var src = img.src || img.currentSrc;
                                        if (src && (src.includes('ggpht.com') || src.includes('ytimg.com') || src.includes('googleusercontent.com'))) {
                                            return src;
                                        }
                                    }
                                }
                                // Method 2: #avatar element
                                var avatarEl = document.querySelector('#avatar img');
                                if (avatarEl) {
                                    var img = avatarEl;
                                    var src = img.src || img.currentSrc;
                                    if (src && (src.includes('ggpht.com') || src.includes('ytimg.com') || src.includes('googleusercontent.com'))) {
                                        return src;
                                    }
                                }
                                // Method 3: Search all images for channel avatar pattern
                                var images = document.querySelectorAll('img');
                                for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
                                    var img = images_1[_i];
                                    var src = img.src || img.currentSrc;
                                    if (src && src.includes('ggpht.com') && src.includes('=s')) {
                                        // Check if it's likely an avatar (usually has =s followed by dimensions)
                                        if (!src.includes('banner') && !src.includes('hqdefault') && !src.includes('mqdefault')) {
                                            return src;
                                        }
                                    }
                                }
                                // Method 4: Look in ytInitialData for channel avatar
                                if (window.ytInitialData) {
                                    var ytData = window.ytInitialData;
                                    var header = (_a = ytData === null || ytData === void 0 ? void 0 : ytData.header) === null || _a === void 0 ? void 0 : _a.c4TabbedHeaderRenderer;
                                    if ((_b = header === null || header === void 0 ? void 0 : header.avatar) === null || _b === void 0 ? void 0 : _b.thumbnails) {
                                        var thumbnails = header.avatar.thumbnails;
                                        if (thumbnails.length > 0) {
                                            // Get the largest thumbnail
                                            var largest = thumbnails[thumbnails.length - 1];
                                            return largest.url;
                                        }
                                    }
                                }
                                return null;
                            })];
                    case 2:
                        avatar = _a.sent();
                        if (avatar && this.isValidAvatarUrl(avatar)) {
                            this.logger.log("Found avatar URL: ".concat(avatar.substring(0, 60), "..."), "info");
                            return [2 /*return*/, avatar];
                        }
                        this.logger.log("Could not find avatar URL on channel page", "warn");
                        return [2 /*return*/, undefined];
                    case 3:
                        error_4 = _a.sent();
                        this.logger.log("Error extracting avatar: ".concat(error_4), "warn");
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    YouTubeScraper.prototype.isValidAvatarUrl = function (url) {
        if (!url)
            return false;
        var isYouTubeImage = url.includes('ytimg.com') ||
            url.includes('googleusercontent.com') ||
            url.includes('ggpht.com');
        var isNotBanner = !url.includes('featured_channel') &&
            !url.includes('banner') &&
            !url.includes('hqdefault') &&
            !url.includes('mqdefault') &&
            !url.includes('sddefault');
        return isYouTubeImage && isNotBanner;
    };
    YouTubeScraper.prototype.extractVerifiedStatus = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var verifiedSelectors, _i, verifiedSelectors_1, selector, verified, ariaLabel, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, , 10]);
                        verifiedSelectors = [
                            '[aria-label*="Verified"]',
                            '[aria-label*="verified"]',
                            '#badge',
                            'yt-icon#badge',
                        ];
                        _i = 0, verifiedSelectors_1 = verifiedSelectors;
                        _c.label = 1;
                    case 1:
                        if (!(_i < verifiedSelectors_1.length)) return [3 /*break*/, 8];
                        selector = verifiedSelectors_1[_i];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 6, , 7]);
                        verified = page.locator(selector).first();
                        return [4 /*yield*/, verified.isVisible({ timeout: 2000 }).catch(function () { return false; })];
                    case 3:
                        if (!_c.sent()) return [3 /*break*/, 5];
                        return [4 /*yield*/, verified.getAttribute("aria-label").catch(function () { return null; })];
                    case 4:
                        ariaLabel = _c.sent();
                        if (ariaLabel && ariaLabel.toLowerCase().includes("verified")) {
                            return [2 /*return*/, true];
                        }
                        _c.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        _a = _c.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8: return [2 /*return*/, false];
                    case 9:
                        _b = _c.sent();
                        return [2 /*return*/, false];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    YouTubeScraper.prototype.extractYouTubeSpecificData = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var hasData, data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, page.evaluate(function () {
                                return !!window.ytInitialPlayerResponse || !!window.ytInitialData;
                            })];
                    case 1:
                        hasData = _a.sent();
                        if (!!hasData) return [3 /*break*/, 3];
                        this.logger.log("YouTube data not loaded yet, waiting...", "warn");
                        return [4 /*yield*/, this.delay(3000)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, page.evaluate(function () {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57;
                            var result = {};
                            // Extract from ytInitialPlayerResponse
                            if (window.ytInitialPlayerResponse) {
                                var playerData = window.ytInitialPlayerResponse;
                                // Embeddable status
                                if (((_a = playerData === null || playerData === void 0 ? void 0 : playerData.playabilityStatus) === null || _a === void 0 ? void 0 : _a.playableInEmbed) !== undefined) {
                                    result.embeddable = playerData.playabilityStatus.playableInEmbed;
                                }
                                // Age restriction
                                var playabilityStatus = playerData === null || playerData === void 0 ? void 0 : playerData.playabilityStatus;
                                if (playabilityStatus) {
                                    if (((_b = playabilityStatus.reason) === null || _b === void 0 ? void 0 : _b.includes('age')) ||
                                        ((_c = playabilityStatus.messages) === null || _c === void 0 ? void 0 : _c.some(function (m) { return m.toLowerCase().includes('age'); }))) {
                                        result.isAgeRestricted = true;
                                    }
                                    else {
                                        result.isAgeRestricted = false;
                                    }
                                }
                                // Dimension (2d/3d), projection (360/rectangular), and definition (HD/SD)
                                var streamingData = playerData === null || playerData === void 0 ? void 0 : playerData.streamingData;
                                if (streamingData === null || streamingData === void 0 ? void 0 : streamingData.adaptiveFormats) {
                                    var highestQuality = 0;
                                    for (var _i = 0, _58 = streamingData.adaptiveFormats; _i < _58.length; _i++) {
                                        var format = _58[_i];
                                        if (format.projectionType) {
                                            result.projection = format.projectionType === 'RECTANGULAR' ? 'rectangular' : '360';
                                        }
                                        if (format.stereoLayout) {
                                            result.dimension = '3d';
                                        }
                                        // Check for definition (HD/SD) - look for height >= 720 for HD
                                        if (format.height && format.height >= 720) {
                                            result.definition = 'hd';
                                            highestQuality = Math.max(highestQuality, format.height);
                                        }
                                    }
                                    // If we found HD, keep it; otherwise check if any format exists
                                    if (!result.definition && streamingData.adaptiveFormats.length > 0) {
                                        // Check if any format has height < 720, then it's SD
                                        var hasLowQuality = streamingData.adaptiveFormats.some(function (f) { return f.height && f.height < 720; });
                                        if (hasLowQuality) {
                                            result.definition = 'sd';
                                        }
                                    }
                                }
                                if (!result.dimension) {
                                    result.dimension = '2d';
                                }
                                // Check videoDetails
                                var videoDetails = playerData === null || playerData === void 0 ? void 0 : playerData.videoDetails;
                                if (videoDetails) {
                                    if (videoDetails.isShortFormVideo !== undefined) {
                                        result.isShort = videoDetails.isShortFormVideo;
                                    }
                                    if (videoDetails.isLiveContent !== undefined) {
                                        result.isLive = videoDetails.isLiveContent;
                                    }
                                    if (videoDetails.isUpcoming !== undefined) {
                                        result.isUpcoming = videoDetails.isUpcoming;
                                    }
                                    // Extract concurrent viewers for live streams
                                    if (result.isLive) {
                                        // Try videoDetails.concurrentViewers first
                                        if (videoDetails.concurrentViewers) {
                                            var viewersStr = String(videoDetails.concurrentViewers);
                                            if (viewersStr.includes(',') || viewersStr.includes('.')) {
                                                var num = parseFloat(viewersStr.replace(/,/g, ''));
                                                if (viewersStr.includes('K') || viewersStr.includes('k'))
                                                    num *= 1000;
                                                else if (viewersStr.includes('M') || viewersStr.includes('m'))
                                                    num *= 1000000;
                                                result.concurrentViewers = Math.floor(num);
                                            }
                                            else {
                                                result.concurrentViewers = parseInt(viewersStr) || 0;
                                            }
                                        }
                                        // Also check videoDetails.concurrentViewerCount (alternative field name)
                                        if (!result.concurrentViewers && videoDetails.concurrentViewerCount) {
                                            var viewersStr = String(videoDetails.concurrentViewerCount);
                                            if (viewersStr.includes(',') || viewersStr.includes('.')) {
                                                var num = parseFloat(viewersStr.replace(/,/g, ''));
                                                if (viewersStr.includes('K') || viewersStr.includes('k'))
                                                    num *= 1000;
                                                else if (viewersStr.includes('M') || viewersStr.includes('m'))
                                                    num *= 1000000;
                                                result.concurrentViewers = Math.floor(num);
                                            }
                                            else {
                                                result.concurrentViewers = parseInt(viewersStr) || 0;
                                            }
                                        }
                                    }
                                    // Check video length for Shorts (usually <= 60 seconds)
                                    if (result.isShort === undefined && videoDetails.lengthSeconds) {
                                        var length_1 = parseInt(videoDetails.lengthSeconds);
                                        if (length_1 > 0 && length_1 <= 60) {
                                            // Could be a Short, but not definitive
                                            // We'll rely on other indicators
                                        }
                                    }
                                    if (videoDetails.title) {
                                        result.title = videoDetails.title;
                                    }
                                    if (videoDetails.shortDescription) {
                                        result.description = videoDetails.shortDescription;
                                    }
                                    if (videoDetails.viewCount) {
                                        var viewCountStr = String(videoDetails.viewCount);
                                        // Handle formatted numbers like "1,503,533,943" or "1.5B"
                                        if (viewCountStr.includes(',') || viewCountStr.includes('.')) {
                                            var num = parseFloat(viewCountStr.replace(/,/g, ''));
                                            if (viewCountStr.includes('K') || viewCountStr.includes('k'))
                                                num *= 1000;
                                            else if (viewCountStr.includes('M') || viewCountStr.includes('m'))
                                                num *= 1000000;
                                            else if (viewCountStr.includes('B') || viewCountStr.includes('b'))
                                                num *= 1000000000;
                                            result.view_count = Math.floor(num);
                                        }
                                        else {
                                            result.view_count = parseInt(viewCountStr) || 0;
                                        }
                                    }
                                    if (videoDetails.lengthSeconds) {
                                        result.duration = parseInt(videoDetails.lengthSeconds) || 0;
                                    }
                                    if (videoDetails.channelId) {
                                        result.channel_id = videoDetails.channelId;
                                    }
                                    if (videoDetails.author) {
                                        result.channel_name = videoDetails.author;
                                    }
                                    if (((_d = videoDetails.thumbnail) === null || _d === void 0 ? void 0 : _d.thumbnails) && videoDetails.thumbnail.thumbnails.length > 0) {
                                        result.thumbnails = videoDetails.thumbnail.thumbnails.map(function (t) { return t.url; });
                                    }
                                    if (videoDetails.keywords && videoDetails.keywords.length > 0) {
                                        result.tags = videoDetails.keywords;
                                    }
                                }
                                // Microformat data
                                var microformat = (_e = playerData === null || playerData === void 0 ? void 0 : playerData.microformat) === null || _e === void 0 ? void 0 : _e.playerMicroformatRenderer;
                                if (microformat) {
                                    if (microformat.category) {
                                        result.category = microformat.category;
                                    }
                                    // Priority 1: defaultAudioLanguage (most reliable - actual video audio language)
                                    if (microformat.defaultAudioLanguage) {
                                        result.defaultLanguage = microformat.defaultAudioLanguage;
                                    }
                                    // Priority 2: videoDetails.defaultAudioLanguage
                                    if (!result.defaultLanguage && (videoDetails === null || videoDetails === void 0 ? void 0 : videoDetails.defaultAudioLanguage)) {
                                        result.defaultLanguage = videoDetails.defaultAudioLanguage;
                                    }
                                    // Priority 3: Look for original/primary caption track (not first one, which might be user's language)
                                    // Only use caption tracks if defaultAudioLanguage is not available
                                    // And be very careful - caption tracks can be in any language, including user's interface language
                                    if (!result.defaultLanguage && ((_g = (_f = playerData === null || playerData === void 0 ? void 0 : playerData.captions) === null || _f === void 0 ? void 0 : _f.playerCaptionsTracklistRenderer) === null || _g === void 0 ? void 0 : _g.captionTracks)) {
                                        var tracks = playerData.captions.playerCaptionsTracklistRenderer.captionTracks;
                                        // Look for track marked as original or primary (not auto-generated)
                                        var originalTrack = tracks.find(function (t) {
                                            var _a, _b;
                                            return ((_b = (_a = t.name) === null || _a === void 0 ? void 0 : _a.simpleText) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('original')) ||
                                                (t.kind !== 'asr' && t.isTranslatable === false);
                                        });
                                        if (originalTrack && originalTrack.languageCode) {
                                            result.defaultLanguage = originalTrack.languageCode;
                                        }
                                        else {
                                            // Try to find English track first (most common video language)
                                            var englishTrack = tracks.find(function (t) {
                                                return t.languageCode && (t.languageCode.startsWith('en') || t.languageCode === 'en');
                                            });
                                            if (englishTrack && englishTrack.languageCode) {
                                                result.defaultLanguage = englishTrack.languageCode;
                                            }
                                            else {
                                                // Only use first track if it's not auto-generated (ASR) and matches common video languages
                                                // Avoid using user's interface language (zh-*, etc. unless it's a common video language)
                                                var firstTrack = tracks[0];
                                                if (firstTrack && firstTrack.languageCode && firstTrack.kind !== 'asr') {
                                                    var langCode = firstTrack.languageCode.split('-')[0];
                                                    // Common video languages - prefer these over interface language
                                                    var commonVideoLanguages = ['en', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'it', 'nl', 'pl', 'tr', 'vi', 'ar', 'hi', 'th', 'id', 'ms', 'tl', 'zh'];
                                                    // Only use if it's a common video language (zh is included but we prefer en)
                                                    if (commonVideoLanguages.includes(langCode) && langCode !== 'zh') {
                                                        result.defaultLanguage = firstTrack.languageCode;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    // Don't use microformat.language - it's usually the user's interface language, not video language
                                    // If we still don't have a language, leave it undefined rather than using wrong data
                                    if (microformat.isUnlisted !== undefined) {
                                        result.isUnlisted = microformat.isUnlisted;
                                    }
                                    if (microformat.liveBroadcastDetails) {
                                        result.isLive = microformat.liveBroadcastDetails.isLiveNow || false;
                                        // Check for upcoming/scheduled streams
                                        if (microformat.liveBroadcastDetails.startTimestamp) {
                                            var startTime = parseInt(microformat.liveBroadcastDetails.startTimestamp);
                                            var now = Math.floor(Date.now() / 1000);
                                            if (startTime > now) {
                                                result.isUpcoming = true;
                                            }
                                        }
                                    }
                                    // Timestamp from publishDate or uploadDate
                                    if (microformat.publishDate) {
                                        var date = new Date(microformat.publishDate);
                                        result.timestamp = Math.floor(date.getTime() / 1000);
                                    }
                                    else if (microformat.uploadDate) {
                                        var date = new Date(microformat.uploadDate);
                                        result.timestamp = Math.floor(date.getTime() / 1000);
                                    }
                                }
                                // Made for kids - check multiple locations
                                // Location 1: videoDetails
                                if (((_h = playerData === null || playerData === void 0 ? void 0 : playerData.videoDetails) === null || _h === void 0 ? void 0 : _h.isMadeForKids) !== undefined) {
                                    result.madeForKids = playerData.videoDetails.isMadeForKids;
                                }
                                // Location 2: playabilityStatus
                                if (result.madeForKids === undefined && ((_j = playerData === null || playerData === void 0 ? void 0 : playerData.playabilityStatus) === null || _j === void 0 ? void 0 : _j.madeForKids) !== undefined) {
                                    result.madeForKids = playerData.playabilityStatus.madeForKids;
                                }
                                // Location 3: microformat
                                if (result.madeForKids === undefined && (microformat === null || microformat === void 0 ? void 0 : microformat.isMadeForKids) !== undefined) {
                                    result.madeForKids = microformat.isMadeForKids;
                                }
                                // Location 4: Check if comments are disabled (kids videos have no comments)
                                // This is a heuristic, not definitive
                                // Location 5: Check videoDetails for kids content indicators
                                if (result.madeForKids === undefined && videoDetails) {
                                    // Some videos have explicit kids content flags
                                    if (videoDetails.isKidsContent !== undefined) {
                                        result.madeForKids = videoDetails.isKidsContent;
                                    }
                                }
                                // Captions
                                var captions = (_l = (_k = playerData === null || playerData === void 0 ? void 0 : playerData.captions) === null || _k === void 0 ? void 0 : _k.playerCaptionsTracklistRenderer) === null || _l === void 0 ? void 0 : _l.captionTracks;
                                result.hasCaptions = captions && captions.length > 0;
                            }
                            // Extract from ytInitialData
                            if (window.ytInitialData) {
                                var ytData = window.ytInitialData;
                                // Made for kids from ytInitialData (multiple checks)
                                if (result.madeForKids === undefined) {
                                    // Check 1: Direct flag in response context
                                    var responseContext = ytData === null || ytData === void 0 ? void 0 : ytData.responseContext;
                                    if (((_m = responseContext === null || responseContext === void 0 ? void 0 : responseContext.mainAppWebResponseContext) === null || _m === void 0 ? void 0 : _m.madeForKids) !== undefined) {
                                        result.madeForKids = responseContext.mainAppWebResponseContext.madeForKids;
                                    }
                                    // Check 2: Comments section - kids videos have comments disabled
                                    var contents_3 = (_r = (_q = (_p = (_o = ytData === null || ytData === void 0 ? void 0 : ytData.contents) === null || _o === void 0 ? void 0 : _o.twoColumnWatchNextResults) === null || _p === void 0 ? void 0 : _p.results) === null || _q === void 0 ? void 0 : _q.results) === null || _r === void 0 ? void 0 : _r.contents;
                                    if (contents_3) {
                                        var hasCommentsSection = false;
                                        for (var _59 = 0, contents_1 = contents_3; _59 < contents_1.length; _59++) {
                                            var content = contents_1[_59];
                                            if (((_s = content === null || content === void 0 ? void 0 : content.itemSectionRenderer) === null || _s === void 0 ? void 0 : _s.sectionIdentifier) === 'comment-item-section') {
                                                hasCommentsSection = true;
                                                break;
                                            }
                                        }
                                        // If no comments section at all, might be kids content
                                        // But we need more evidence, so just use as supporting info
                                    }
                                    // Check 3: Badge labels
                                    var videoDetails = (_t = contents_3 === null || contents_3 === void 0 ? void 0 : contents_3[0]) === null || _t === void 0 ? void 0 : _t.videoPrimaryInfoRenderer;
                                    if (videoDetails === null || videoDetails === void 0 ? void 0 : videoDetails.badges) {
                                        for (var _60 = 0, _61 = videoDetails.badges; _60 < _61.length; _60++) {
                                            var badge = _61[_60];
                                            var label = ((_v = (_u = badge === null || badge === void 0 ? void 0 : badge.metadataBadgeRenderer) === null || _u === void 0 ? void 0 : _u.label) === null || _v === void 0 ? void 0 : _v.toLowerCase()) || '';
                                            if (label.includes('kids') || label.includes('children')) {
                                                result.madeForKids = true;
                                                break;
                                            }
                                        }
                                    }
                                    // Check 4: Look for "Made for kids" text in page
                                    var pageText = ((_w = document.body) === null || _w === void 0 ? void 0 : _w.innerText) || '';
                                    if (pageText.includes('Made for kids') || pageText.includes('Made for Kids')) {
                                        result.madeForKids = true;
                                    }
                                    // Check 5: ytcfg config
                                    if (window.ytcfg) {
                                        var ytcfg = window.ytcfg;
                                        var data_1 = ytcfg.data_ || ((_x = ytcfg.d) === null || _x === void 0 ? void 0 : _x.call(ytcfg)) || {};
                                        if (((_y = data_1.PLAYER_VARS) === null || _y === void 0 ? void 0 : _y.madeForKids) !== undefined) {
                                            result.madeForKids = data_1.PLAYER_VARS.madeForKids;
                                        }
                                    }
                                    // Check 6: If still undefined, default to false (most videos are not for kids)
                                    if (result.madeForKids === undefined) {
                                        result.madeForKids = false;
                                    }
                                }
                                // Extract like_count and comment_count from ytInitialData
                                var contents = (_2 = (_1 = (_0 = (_z = ytData === null || ytData === void 0 ? void 0 : ytData.contents) === null || _z === void 0 ? void 0 : _z.twoColumnWatchNextResults) === null || _0 === void 0 ? void 0 : _0.results) === null || _1 === void 0 ? void 0 : _1.results) === null || _2 === void 0 ? void 0 : _2.contents;
                                if (contents) {
                                    // Like count from videoPrimaryInfoRenderer
                                    var videoPrimaryInfo = (_3 = contents[0]) === null || _3 === void 0 ? void 0 : _3.videoPrimaryInfoRenderer;
                                    if (videoPrimaryInfo) {
                                        // Try multiple paths for like button
                                        var topLevelButtons = (_5 = (_4 = videoPrimaryInfo === null || videoPrimaryInfo === void 0 ? void 0 : videoPrimaryInfo.videoActions) === null || _4 === void 0 ? void 0 : _4.menuRenderer) === null || _5 === void 0 ? void 0 : _5.topLevelButtons;
                                        if (topLevelButtons) {
                                            for (var _62 = 0, topLevelButtons_1 = topLevelButtons; _62 < topLevelButtons_1.length; _62++) {
                                                var button = topLevelButtons_1[_62];
                                                if (button === null || button === void 0 ? void 0 : button.segmentedLikeDislikeButtonRenderer) {
                                                    var likeButton = button.segmentedLikeDislikeButtonRenderer.likeButton;
                                                    if (likeButton === null || likeButton === void 0 ? void 0 : likeButton.toggleButtonRenderer) {
                                                        var likeText = ((_8 = (_7 = (_6 = likeButton.toggleButtonRenderer.defaultText) === null || _6 === void 0 ? void 0 : _6.accessibility) === null || _7 === void 0 ? void 0 : _7.accessibilityData) === null || _8 === void 0 ? void 0 : _8.label) ||
                                                            ((_9 = likeButton.toggleButtonRenderer.defaultText) === null || _9 === void 0 ? void 0 : _9.simpleText) ||
                                                            ((_12 = (_11 = (_10 = likeButton.toggleButtonRenderer.toggledText) === null || _10 === void 0 ? void 0 : _10.accessibility) === null || _11 === void 0 ? void 0 : _11.accessibilityData) === null || _12 === void 0 ? void 0 : _12.label) ||
                                                            ((_13 = likeButton.toggleButtonRenderer.toggledText) === null || _13 === void 0 ? void 0 : _13.simpleText) ||
                                                            ((_16 = (_15 = (_14 = likeButton.toggleButtonRenderer.defaultText) === null || _14 === void 0 ? void 0 : _14.runs) === null || _15 === void 0 ? void 0 : _15[0]) === null || _16 === void 0 ? void 0 : _16.text) ||
                                                            '';
                                                        if (likeText && !likeText.toLowerCase().includes('view') && !likeText.toLowerCase().includes('like this')) {
                                                            var likeMatch = likeText.match(/([\d.,]+[KMB]?)/);
                                                            if (likeMatch) {
                                                                var num = parseFloat(likeMatch[1].replace(/,/g, ''));
                                                                var matchText = likeMatch[1];
                                                                if (matchText.includes('K') || matchText.includes('k'))
                                                                    num *= 1000;
                                                                else if (matchText.includes('M') || matchText.includes('m'))
                                                                    num *= 1000000;
                                                                else if (matchText.includes('B') || matchText.includes('b'))
                                                                    num *= 1000000000;
                                                                if (num < 1000000000 && num > 0) {
                                                                    result.like_count = Math.floor(num);
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    // Comment count from commentsEntryPointHeaderRenderer - try multiple locations
                                    for (var _63 = 0, contents_2 = contents; _63 < contents_2.length; _63++) {
                                        var content = contents_2[_63];
                                        if ((_19 = (_18 = (_17 = content === null || content === void 0 ? void 0 : content.itemSectionRenderer) === null || _17 === void 0 ? void 0 : _17.contents) === null || _18 === void 0 ? void 0 : _18[0]) === null || _19 === void 0 ? void 0 : _19.commentsEntryPointHeaderRenderer) {
                                            var commentHeader = content.itemSectionRenderer.contents[0].commentsEntryPointHeaderRenderer;
                                            var commentCount = ((_20 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _20 === void 0 ? void 0 : _20.simpleText) ||
                                                ((_23 = (_22 = (_21 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _21 === void 0 ? void 0 : _21.runs) === null || _22 === void 0 ? void 0 : _22[0]) === null || _23 === void 0 ? void 0 : _23.text) ||
                                                ((_26 = (_25 = (_24 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.contentRenderer) === null || _24 === void 0 ? void 0 : _24.commentsEntryPointHeaderRenderer) === null || _25 === void 0 ? void 0 : _25.commentCount) === null || _26 === void 0 ? void 0 : _26.simpleText) ||
                                                ((_29 = (_28 = (_27 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _27 === void 0 ? void 0 : _27.accessibility) === null || _28 === void 0 ? void 0 : _28.accessibilityData) === null || _29 === void 0 ? void 0 : _29.label);
                                            if (commentCount) {
                                                var match = commentCount.match(/([\d.,]+[KMB]?)/);
                                                if (match) {
                                                    var num = parseFloat(match[1].replace(/,/g, ''));
                                                    var matchText = match[1];
                                                    if (matchText.includes('K') || matchText.includes('k'))
                                                        num *= 1000;
                                                    else if (matchText.includes('M') || matchText.includes('m'))
                                                        num *= 1000000;
                                                    else if (matchText.includes('B') || matchText.includes('b'))
                                                        num *= 1000000000;
                                                    // Sanity check: comment count shouldn't exceed 100 million (very rare)
                                                    if (num > 0 && num < 100000000) {
                                                        result.comment_count = Math.floor(num);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        // Also check for comment count in other renderers
                                        if (content === null || content === void 0 ? void 0 : content.commentsEntryPointHeaderRenderer) {
                                            var commentHeader = content.commentsEntryPointHeaderRenderer;
                                            var commentCount = ((_30 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _30 === void 0 ? void 0 : _30.simpleText) ||
                                                ((_33 = (_32 = (_31 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _31 === void 0 ? void 0 : _31.runs) === null || _32 === void 0 ? void 0 : _32[0]) === null || _33 === void 0 ? void 0 : _33.text);
                                            if (commentCount && !result.comment_count) {
                                                var match = commentCount.match(/([\d.,]+[KMB]?)/);
                                                if (match) {
                                                    var num = parseFloat(match[1].replace(/,/g, ''));
                                                    var matchText = match[1];
                                                    if (matchText.includes('K') || matchText.includes('k'))
                                                        num *= 1000;
                                                    else if (matchText.includes('M') || matchText.includes('m'))
                                                        num *= 1000000;
                                                    else if (matchText.includes('B') || matchText.includes('b'))
                                                        num *= 1000000000;
                                                    // Sanity check: comment count shouldn't exceed 100 million (very rare)
                                                    if (num > 0 && num < 100000000) {
                                                        result.comment_count = Math.floor(num);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        // Check all itemSectionRenderer contents for comment headers
                                        if ((_34 = content === null || content === void 0 ? void 0 : content.itemSectionRenderer) === null || _34 === void 0 ? void 0 : _34.contents) {
                                            for (var _64 = 0, _65 = content.itemSectionRenderer.contents; _64 < _65.length; _64++) {
                                                var item = _65[_64];
                                                if (item === null || item === void 0 ? void 0 : item.commentsEntryPointHeaderRenderer) {
                                                    var commentHeader = item.commentsEntryPointHeaderRenderer;
                                                    var commentCount = ((_35 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _35 === void 0 ? void 0 : _35.simpleText) ||
                                                        ((_38 = (_37 = (_36 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _36 === void 0 ? void 0 : _36.runs) === null || _37 === void 0 ? void 0 : _37[0]) === null || _38 === void 0 ? void 0 : _38.text);
                                                    if (commentCount && !result.comment_count) {
                                                        var match = commentCount.match(/([\d.,]+[KMB]?)/);
                                                        if (match) {
                                                            var num = parseFloat(match[1].replace(/,/g, ''));
                                                            var matchText = match[1];
                                                            if (matchText.includes('K') || matchText.includes('k'))
                                                                num *= 1000;
                                                            else if (matchText.includes('M') || matchText.includes('m'))
                                                                num *= 1000000;
                                                            else if (matchText.includes('B') || matchText.includes('b'))
                                                                num *= 1000000000;
                                                            // Sanity check: comment count shouldn't exceed 100 million
                                                            if (num > 0 && num < 100000000) {
                                                                result.comment_count = Math.floor(num);
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    // Try searching specific known locations for comment count
                                    if (!result.comment_count) {
                                        try {
                                            // Check responseContext
                                            var responseContext = ytData === null || ytData === void 0 ? void 0 : ytData.responseContext;
                                            if (responseContext) {
                                                var visitorData = responseContext === null || responseContext === void 0 ? void 0 : responseContext.visitorData;
                                                // Comment count might be in various response contexts
                                            }
                                            // Check onResponseReceivedActions
                                            var onResponseReceived = ytData === null || ytData === void 0 ? void 0 : ytData.onResponseReceivedActions;
                                            if (onResponseReceived && Array.isArray(onResponseReceived)) {
                                                for (var _66 = 0, onResponseReceived_1 = onResponseReceived; _66 < onResponseReceived_1.length; _66++) {
                                                    var action = onResponseReceived_1[_66];
                                                    if ((_39 = action === null || action === void 0 ? void 0 : action.reloadContinuationItemsCommand) === null || _39 === void 0 ? void 0 : _39.continuationItems) {
                                                        var items = action.reloadContinuationItemsCommand.continuationItems;
                                                        for (var _67 = 0, items_1 = items; _67 < items_1.length; _67++) {
                                                            var item = items_1[_67];
                                                            if ((_40 = item === null || item === void 0 ? void 0 : item.commentsEntryPointHeaderRenderer) === null || _40 === void 0 ? void 0 : _40.commentCount) {
                                                                var commentCount = item.commentsEntryPointHeaderRenderer.commentCount.simpleText ||
                                                                    ((_42 = (_41 = item.commentsEntryPointHeaderRenderer.commentCount.runs) === null || _41 === void 0 ? void 0 : _41[0]) === null || _42 === void 0 ? void 0 : _42.text);
                                                                if (commentCount) {
                                                                    var match = commentCount.match(/([\d.,]+[KMB]?)/);
                                                                    if (match) {
                                                                        var num = parseFloat(match[1].replace(/,/g, ''));
                                                                        var matchText = match[1];
                                                                        if (matchText.includes('K') || matchText.includes('k'))
                                                                            num *= 1000;
                                                                        else if (matchText.includes('M') || matchText.includes('m'))
                                                                            num *= 1000000;
                                                                        else if (matchText.includes('B') || matchText.includes('b'))
                                                                            num *= 1000000000;
                                                                        // Sanity check: comment count shouldn't exceed 100 million
                                                                        if (num > 0 && num < 100000000) {
                                                                            result.comment_count = Math.floor(num);
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        catch (e) {
                                            // Silently fail - comment count extraction is optional
                                        }
                                    }
                                }
                                // Extract concurrent viewers from ytInitialData for live streams
                                if (result.isLive && !result.concurrentViewers) {
                                    var videoPrimaryInfo = (_43 = contents === null || contents === void 0 ? void 0 : contents[0]) === null || _43 === void 0 ? void 0 : _43.videoPrimaryInfoRenderer;
                                    if (videoPrimaryInfo) {
                                        // Check for viewer count in live stream indicators
                                        var viewCount = ((_46 = (_45 = (_44 = videoPrimaryInfo === null || videoPrimaryInfo === void 0 ? void 0 : videoPrimaryInfo.viewCount) === null || _44 === void 0 ? void 0 : _44.videoViewCountRenderer) === null || _45 === void 0 ? void 0 : _45.viewCount) === null || _46 === void 0 ? void 0 : _46.simpleText) ||
                                            ((_48 = (_47 = videoPrimaryInfo === null || videoPrimaryInfo === void 0 ? void 0 : videoPrimaryInfo.viewCount) === null || _47 === void 0 ? void 0 : _47.videoViewCountRenderer) === null || _48 === void 0 ? void 0 : _48.originalViewCount);
                                        if (viewCount && (viewCount.includes('watching') || viewCount.includes('viewers'))) {
                                            var match = viewCount.match(/([\d.,]+[KMB]?)/);
                                            if (match) {
                                                var num = parseFloat(match[1].replace(/,/g, ''));
                                                var matchText = match[1];
                                                if (matchText.includes('K') || matchText.includes('k'))
                                                    num *= 1000;
                                                else if (matchText.includes('M') || matchText.includes('m'))
                                                    num *= 1000000;
                                                if (num > 0 && num < 100000000) {
                                                    result.concurrentViewers = Math.floor(num);
                                                }
                                            }
                                        }
                                    }
                                }
                                // Extract full description and mentions from ytInitialData (longer than shortDescription)
                                var secondaryInfo = (_54 = (_53 = (_52 = (_51 = (_50 = (_49 = ytData === null || ytData === void 0 ? void 0 : ytData.contents) === null || _49 === void 0 ? void 0 : _49.twoColumnWatchNextResults) === null || _50 === void 0 ? void 0 : _50.results) === null || _51 === void 0 ? void 0 : _51.results) === null || _52 === void 0 ? void 0 : _52.contents) === null || _53 === void 0 ? void 0 : _53[1]) === null || _54 === void 0 ? void 0 : _54.videoSecondaryInfoRenderer;
                                var description = (_55 = secondaryInfo === null || secondaryInfo === void 0 ? void 0 : secondaryInfo.attributedDescription) === null || _55 === void 0 ? void 0 : _55.content;
                                if (description) {
                                    // Store full description (prefer this over shortDescription)
                                    result.description = description;
                                    var mentions = description.match(/@[\w.]+/g);
                                    if (mentions) {
                                        result.mentions = mentions.map(function (m) { return m.substring(1); });
                                    }
                                }
                                // Alternative description source
                                if (!result.mentions) {
                                    var playerResponse = window.ytInitialPlayerResponse;
                                    var shortDesc = (_56 = playerResponse === null || playerResponse === void 0 ? void 0 : playerResponse.videoDetails) === null || _56 === void 0 ? void 0 : _56.shortDescription;
                                    if (shortDesc) {
                                        var mentions = shortDesc.match(/@[\w.]+/g);
                                        if (mentions) {
                                            result.mentions = mentions.map(function (m) { return m.substring(1); });
                                        }
                                    }
                                }
                                // Shorts detection from page type
                                var pageType = ytData === null || ytData === void 0 ? void 0 : ytData.page;
                                if (pageType === 'shorts') {
                                    result.isShort = true;
                                }
                                // Check engagement panels for shorts indicator
                                var engagementPanels = ytData === null || ytData === void 0 ? void 0 : ytData.engagementPanels;
                                if (engagementPanels) {
                                    for (var _68 = 0, engagementPanels_1 = engagementPanels; _68 < engagementPanels_1.length; _68++) {
                                        var panel = engagementPanels_1[_68];
                                        if (((_57 = panel === null || panel === void 0 ? void 0 : panel.engagementPanelSectionListRenderer) === null || _57 === void 0 ? void 0 : _57.panelIdentifier) === 'shorts-info-panel') {
                                            result.isShort = true;
                                            break;
                                        }
                                    }
                                }
                                // Default isShort to false if still undefined
                                if (result.isShort === undefined) {
                                    result.isShort = false;
                                }
                                // Default isUpcoming to false if still undefined
                                if (result.isUpcoming === undefined) {
                                    result.isUpcoming = false;
                                }
                            }
                            return result;
                        })];
                    case 4:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 5:
                        error_5 = _a.sent();
                        this.logger.log("Failed to extract YouTube-specific data: ".concat(error_5), "error");
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return YouTubeScraper;
}(CreatorMetadataScraper_js_1.CreatorMetadataScraper));
exports.YouTubeScraper = YouTubeScraper;
