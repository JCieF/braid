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
var YouTubeScraper = /** @class */ (function (_super) {
    __extends(YouTubeScraper, _super);
    function YouTubeScraper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YouTubeScraper.prototype.getCreatorProfileUrl = function (videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, null];
                }
                catch (_b) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    YouTubeScraper.prototype.extractMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var channelUrl, channelSelectors, _i, channelSelectors_1, selector, link, _a, _b, metadata, channelIdMatch, nameSelectors, _c, nameSelectors_1, selector, name_1, handleSelectors, _d, handleSelectors_1, selector, handle, subscriberSelectors, _e, subscriberSelectors_1, selector, subText, parsed, _f, subData, _g, avatarContainer, _h, avatarSelectors, _j, avatarSelectors_1, selector, element, avatar, _k, avatar, _l, bioSelectors, _m, bioSelectors_1, selector, bio, cleanedBio, verifiedSelectors, _o, verifiedSelectors_1, selector, verified, ariaLabel, _p, allVerified, _q, error_1;
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0:
                        _r.trys.push([0, 72, , 73]);
                        this.logger.log("Extracting YouTube creator metadata...", "info");
                        return [4 /*yield*/, page.goto(videoUrl, { waitUntil: "domcontentloaded" })];
                    case 1:
                        _r.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 2:
                        _r.sent();
                        channelUrl = null;
                        channelSelectors = [
                            'a[href*="/channel/"]',
                            'a[href*="/c/"]',
                            'a[href*="/user/"]',
                            'a[href*="/@"]',
                            'ytd-channel-name a',
                            '#channel-name a',
                            '#owner-sub-count a',
                            '.ytd-channel-name a'
                        ];
                        _i = 0, channelSelectors_1 = channelSelectors;
                        _r.label = 3;
                    case 3:
                        if (!(_i < channelSelectors_1.length)) return [3 /*break*/, 6];
                        selector = channelSelectors_1[_i];
                        return [4 /*yield*/, this.getElementAttribute(page, selector, "href")];
                    case 4:
                        link = _r.sent();
                        if (link && (link.includes("/channel/") || link.includes("/c/") || link.includes("/user/") || link.includes("/@"))) {
                            channelUrl = link.startsWith("http") ? link : "https://www.youtube.com".concat(link);
                            return [3 /*break*/, 6];
                        }
                        _r.label = 5;
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
                        _r.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 8:
                        _r.sent();
                        _r.label = 9;
                    case 9:
                        _r.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, page.waitForSelector('ytd-channel-avatar, #avatar', { timeout: 5000 })];
                    case 10:
                        _r.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        _a = _r.sent();
                        return [3 /*break*/, 12];
                    case 12:
                        _r.trys.push([12, 14, , 15]);
                        return [4 /*yield*/, page.waitForLoadState("networkidle", { timeout: 5000 })];
                    case 13:
                        _r.sent();
                        return [3 /*break*/, 15];
                    case 14:
                        _b = _r.sent();
                        return [3 /*break*/, 15];
                    case 15:
                        metadata = {
                            platform: "youtube",
                            url: channelUrl,
                            extractedAt: Date.now(),
                        };
                        channelIdMatch = channelUrl.match(/\/(channel|c|user|@)([^\/\?]+)/);
                        if (channelIdMatch) {
                            metadata.creator_id = channelIdMatch[2];
                            if (channelIdMatch[1] === "@") {
                                metadata.creator_username = channelIdMatch[2];
                            }
                        }
                        nameSelectors = [
                            "#channel-name",
                            "ytd-channel-name #text",
                            ".ytd-channel-name #text",
                            "h1.ytd-channel-name",
                            "#text-container",
                            "ytd-channel-name",
                            '[id="channel-name"]',
                            '[class*="channel-name"]',
                            "ytd-channel-name a",
                            "#channel-name-container"
                        ];
                        _c = 0, nameSelectors_1 = nameSelectors;
                        _r.label = 16;
                    case 16:
                        if (!(_c < nameSelectors_1.length)) return [3 /*break*/, 19];
                        selector = nameSelectors_1[_c];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 17:
                        name_1 = _r.sent();
                        if (name_1 && name_1.length > 0 && !name_1.includes("Subscribe") && !name_1.includes("subscribers")) {
                            metadata.creator_name = this.cleanText(name_1);
                            return [3 /*break*/, 19];
                        }
                        _r.label = 18;
                    case 18:
                        _c++;
                        return [3 /*break*/, 16];
                    case 19:
                        handleSelectors = [
                            "#channel-handle",
                            "yt-formatted-string#channel-handle",
                            "#handle-text",
                            '[id="channel-handle"]',
                            '[class*="handle"]',
                            "ytd-channel-name #channel-handle"
                        ];
                        _d = 0, handleSelectors_1 = handleSelectors;
                        _r.label = 20;
                    case 20:
                        if (!(_d < handleSelectors_1.length)) return [3 /*break*/, 23];
                        selector = handleSelectors_1[_d];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 21:
                        handle = _r.sent();
                        if (handle && handle.startsWith("@")) {
                            metadata.creator_username = this.cleanText(handle).replace("@", "");
                            return [3 /*break*/, 23];
                        }
                        _r.label = 22;
                    case 22:
                        _d++;
                        return [3 /*break*/, 20];
                    case 23:
                        subscriberSelectors = [
                            "#subscriber-count",
                            "yt-formatted-string#subscriber-count",
                            "#sub-count",
                            '#owner-sub-count',
                            '[id="subscriber-count"]',
                            '[class*="subscriber"]',
                            "yt-formatted-string#subscriber-count",
                            "ytd-c4-tabbed-header-renderer #subscriber-count",
                            "#channel-header-container #subscriber-count"
                        ];
                        _e = 0, subscriberSelectors_1 = subscriberSelectors;
                        _r.label = 24;
                    case 24:
                        if (!(_e < subscriberSelectors_1.length)) return [3 /*break*/, 29];
                        selector = subscriberSelectors_1[_e];
                        _r.label = 25;
                    case 25:
                        _r.trys.push([25, 27, , 28]);
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 26:
                        subText = _r.sent();
                        if (subText) {
                            parsed = this.parseCount(subText);
                            if (parsed) {
                                metadata.creator_follower_count = parsed;
                                return [3 /*break*/, 29];
                            }
                        }
                        return [3 /*break*/, 28];
                    case 27:
                        _f = _r.sent();
                        return [3 /*break*/, 28];
                    case 28:
                        _e++;
                        return [3 /*break*/, 24];
                    case 29:
                        if (!!metadata.creator_follower_count) return [3 /*break*/, 33];
                        _r.label = 30;
                    case 30:
                        _r.trys.push([30, 32, , 33]);
                        return [4 /*yield*/, page.evaluate(function () {
                                var allText = document.body.innerText || document.body.textContent || '';
                                var subscriberMatch = allText.match(/([\d.,]+[KMB]?)\s*subscriber/i);
                                if (subscriberMatch) {
                                    return subscriberMatch[1];
                                }
                                var elements = document.querySelectorAll('yt-formatted-string, span, div, p');
                                for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                                    var el = elements_1[_i];
                                    var text = (el.textContent || '').trim();
                                    if (text && (text.toLowerCase().includes('subscriber')) && /[\d.,]+[KMB]?/.test(text)) {
                                        var match = text.match(/([\d.,]+[KMB]?)/);
                                        if (match) {
                                            return match[1];
                                        }
                                    }
                                }
                                return null;
                            })];
                    case 31:
                        subData = _r.sent();
                        if (subData) {
                            metadata.creator_follower_count = this.parseCount(subData);
                        }
                        return [3 /*break*/, 33];
                    case 32:
                        _g = _r.sent();
                        return [3 /*break*/, 33];
                    case 33: return [4 /*yield*/, this.delay(2000)];
                    case 34:
                        _r.sent();
                        _r.label = 35;
                    case 35:
                        _r.trys.push([35, 40, , 41]);
                        avatarContainer = page.locator('ytd-channel-avatar').first();
                        return [4 /*yield*/, avatarContainer.isVisible({ timeout: 3000 }).catch(function () { return false; })];
                    case 36:
                        if (!_r.sent()) return [3 /*break*/, 39];
                        return [4 /*yield*/, avatarContainer.scrollIntoViewIfNeeded()];
                    case 37:
                        _r.sent();
                        return [4 /*yield*/, this.delay(1000)];
                    case 38:
                        _r.sent();
                        _r.label = 39;
                    case 39: return [3 /*break*/, 41];
                    case 40:
                        _h = _r.sent();
                        return [3 /*break*/, 41];
                    case 41:
                        avatarSelectors = [
                            "ytd-channel-avatar img",
                            "ytd-channel-avatar #img",
                            "#avatar img",
                            "#avatar #img",
                            "yt-img-shadow#avatar img",
                            "yt-img-shadow#avatar #img",
                            "#channel-header-container #avatar img",
                            "ytd-c4-tabbed-header-renderer ytd-channel-avatar img",
                            "ytd-c4-tabbed-header-renderer img"
                        ];
                        _j = 0, avatarSelectors_1 = avatarSelectors;
                        _r.label = 42;
                    case 42:
                        if (!(_j < avatarSelectors_1.length)) return [3 /*break*/, 49];
                        selector = avatarSelectors_1[_j];
                        _r.label = 43;
                    case 43:
                        _r.trys.push([43, 47, , 48]);
                        element = page.locator(selector).first();
                        return [4 /*yield*/, element.isVisible({ timeout: 2000 }).catch(function () { return false; })];
                    case 44:
                        if (!_r.sent()) return [3 /*break*/, 46];
                        return [4 /*yield*/, element.getAttribute("src")];
                    case 45:
                        avatar = _r.sent();
                        if (avatar && (avatar.includes("ytimg.com") || avatar.includes("googleusercontent.com"))) {
                            if (!avatar.includes('featured_channel') && !avatar.includes('banner') && !avatar.includes('default') && !avatar.includes('hqdefault')) {
                                metadata.creator_avatar_url = avatar;
                                return [3 /*break*/, 49];
                            }
                        }
                        _r.label = 46;
                    case 46: return [3 /*break*/, 48];
                    case 47:
                        _k = _r.sent();
                        return [3 /*break*/, 48];
                    case 48:
                        _j++;
                        return [3 /*break*/, 42];
                    case 49:
                        if (!(!metadata.creator_avatar_url || metadata.creator_avatar_url.includes('featured_channel'))) return [3 /*break*/, 54];
                        _r.label = 50;
                    case 50:
                        _r.trys.push([50, 53, , 54]);
                        return [4 /*yield*/, this.delay(1000)];
                    case 51:
                        _r.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                var avatarContainer = document.querySelector('ytd-channel-avatar');
                                if (avatarContainer) {
                                    var img = avatarContainer.querySelector('img');
                                    if (img) {
                                        var src = img.src || img.currentSrc || img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-thumb');
                                        if (!src) {
                                            var ytImgShadow = avatarContainer.querySelector('yt-img-shadow');
                                            if (ytImgShadow) {
                                                var shadowImg = ytImgShadow.querySelector('img');
                                                if (shadowImg) {
                                                    src = shadowImg.src || shadowImg.currentSrc || shadowImg.getAttribute('src') || shadowImg.getAttribute('data-src');
                                                }
                                            }
                                        }
                                        if (src) {
                                            if (src.startsWith('//')) {
                                                src = 'https:' + src;
                                            }
                                            if ((src.includes('ytimg.com') || src.includes('googleusercontent.com'))) {
                                                if (!src.includes('featured_channel') && !src.includes('banner') && !src.includes('default') && !src.includes('hqdefault') && !src.includes('mqdefault') && !src.includes('sddefault')) {
                                                    return src;
                                                }
                                            }
                                        }
                                    }
                                }
                                var avatarEl = document.querySelector('#avatar');
                                if (avatarEl) {
                                    var img = avatarEl.querySelector('img');
                                    if (img) {
                                        var src = img.src || img.getAttribute('src') || img.getAttribute('data-src');
                                        if (src) {
                                            if (src.startsWith('//')) {
                                                src = 'https:' + src;
                                            }
                                            if ((src.includes('ytimg.com') || src.includes('googleusercontent.com')) && !src.includes('featured_channel') && !src.includes('banner') && !src.includes('default')) {
                                                return src;
                                            }
                                        }
                                    }
                                }
                                var images = document.querySelectorAll('img');
                                var channelImages = [];
                                for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
                                    var img = images_1[_i];
                                    var src = img.src || img.getAttribute('src') || img.getAttribute('data-src');
                                    if (src) {
                                        if (src.startsWith('//')) {
                                            src = 'https:' + src;
                                        }
                                        if ((src.includes('ytimg.com') || src.includes('googleusercontent.com'))) {
                                            if (src.includes('channel') || src.includes('avatar')) {
                                                if (!src.includes('featured_channel') && !src.includes('banner') && !src.includes('default') && !src.includes('hqdefault') && !src.includes('mqdefault')) {
                                                    channelImages.push(src);
                                                }
                                            }
                                        }
                                    }
                                }
                                if (channelImages.length > 0) {
                                    return channelImages[0];
                                }
                                return null;
                            })];
                    case 52:
                        avatar = _r.sent();
                        if (avatar) {
                            metadata.creator_avatar_url = avatar;
                        }
                        return [3 /*break*/, 54];
                    case 53:
                        _l = _r.sent();
                        return [3 /*break*/, 54];
                    case 54:
                        bioSelectors = [
                            "#description",
                            "#channel-description",
                            "yt-formatted-string#description",
                            '[id="description"]',
                            '[class*="description"]',
                            "ytd-channel-about-metadata-renderer",
                            "#channel-description-container"
                        ];
                        _m = 0, bioSelectors_1 = bioSelectors;
                        _r.label = 55;
                    case 55:
                        if (!(_m < bioSelectors_1.length)) return [3 /*break*/, 58];
                        selector = bioSelectors_1[_m];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 56:
                        bio = _r.sent();
                        if (bio && bio.length > 20) {
                            cleanedBio = this.cleanText(bio);
                            cleanedBio = cleanedBio.replace(/\.\.\.more/gi, "").replace(/\.\.\./g, "").replace(/\s+/g, " ").trim();
                            if (cleanedBio.length > 20) {
                                metadata.creator_bio = cleanedBio.substring(0, 500);
                                return [3 /*break*/, 58];
                            }
                        }
                        _r.label = 57;
                    case 57:
                        _m++;
                        return [3 /*break*/, 55];
                    case 58:
                        verifiedSelectors = [
                            '#badge',
                            'yt-icon#badge',
                            '[aria-label*="Verified"]',
                            '[aria-label*="verified"]',
                            '.ytd-badge-supported-renderer',
                            '[class*="badge"]'
                        ];
                        _o = 0, verifiedSelectors_1 = verifiedSelectors;
                        _r.label = 59;
                    case 59:
                        if (!(_o < verifiedSelectors_1.length)) return [3 /*break*/, 66];
                        selector = verifiedSelectors_1[_o];
                        _r.label = 60;
                    case 60:
                        _r.trys.push([60, 64, , 65]);
                        verified = page.locator(selector).first();
                        return [4 /*yield*/, verified.isVisible({ timeout: 2000 }).catch(function () { return false; })];
                    case 61:
                        if (!_r.sent()) return [3 /*break*/, 63];
                        return [4 /*yield*/, verified.getAttribute("aria-label").catch(function () { return null; })];
                    case 62:
                        ariaLabel = _r.sent();
                        if (ariaLabel && ariaLabel.toLowerCase().includes("verified")) {
                            metadata.creator_verified = true;
                            return [3 /*break*/, 66];
                        }
                        _r.label = 63;
                    case 63: return [3 /*break*/, 65];
                    case 64:
                        _p = _r.sent();
                        return [3 /*break*/, 65];
                    case 65:
                        _o++;
                        return [3 /*break*/, 59];
                    case 66:
                        if (!!metadata.creator_verified) return [3 /*break*/, 71];
                        _r.label = 67;
                    case 67:
                        _r.trys.push([67, 70, , 71]);
                        return [4 /*yield*/, page.locator('[aria-label*="Verified"], [aria-label*="verified"]').first()];
                    case 68:
                        allVerified = _r.sent();
                        return [4 /*yield*/, allVerified.isVisible({ timeout: 1000 }).catch(function () { return false; })];
                    case 69:
                        if (_r.sent()) {
                            metadata.creator_verified = true;
                        }
                        return [3 /*break*/, 71];
                    case 70:
                        _q = _r.sent();
                        return [3 /*break*/, 71];
                    case 71:
                        this.logger.log("Successfully extracted YouTube creator metadata", "info");
                        return [2 /*return*/, metadata];
                    case 72:
                        error_1 = _r.sent();
                        this.logger.log("Failed to extract YouTube metadata: ".concat(error_1), "error");
                        return [2 /*return*/, null];
                    case 73: return [2 /*return*/];
                }
            });
        });
    };
    YouTubeScraper.prototype.extractVideoMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var videoIdMatch, videoId, metadata, embeddedData, domData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        this.logger.log("Extracting YouTube video metadata...", "info");
                        return [4 /*yield*/, page.goto(videoUrl, { waitUntil: "networkidle" })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 2:
                        _a.sent();
                        videoIdMatch = videoUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
                        videoId = videoIdMatch ? videoIdMatch[1] : null;
                        metadata = {
                            platform: "youtube",
                            url: videoUrl,
                            extractedAt: Date.now(),
                        };
                        if (videoId) {
                            metadata.video_id = videoId;
                        }
                        return [4 /*yield*/, this.extractFromEmbeddedJSON(page)];
                    case 3:
                        embeddedData = _a.sent();
                        if (embeddedData) {
                            if (embeddedData.like_count !== undefined)
                                metadata.like_count = embeddedData.like_count;
                            if (embeddedData.comment_count !== undefined)
                                metadata.comment_count = embeddedData.comment_count;
                            if (embeddedData.view_count !== undefined)
                                metadata.view_count = embeddedData.view_count;
                            if (embeddedData.timestamp !== undefined)
                                metadata.timestamp = embeddedData.timestamp;
                            if (embeddedData.caption)
                                metadata.caption = embeddedData.caption;
                            if (embeddedData.hashtags)
                                metadata.hashtags = embeddedData.hashtags;
                            if (embeddedData.location)
                                metadata.location = embeddedData.location;
                            if (embeddedData.music_title)
                                metadata.music_title = embeddedData.music_title;
                            if (embeddedData.music_artist)
                                metadata.music_artist = embeddedData.music_artist;
                            if (embeddedData.is_video !== undefined)
                                metadata.is_video = embeddedData.is_video;
                            if (embeddedData.share_count !== undefined)
                                metadata.share_count = embeddedData.share_count;
                        }
                        return [4 /*yield*/, this.extractFromDOM(page)];
                    case 4:
                        domData = _a.sent();
                        if (domData) {
                            if (domData.like_count !== undefined && !metadata.like_count)
                                metadata.like_count = domData.like_count;
                            if (domData.comment_count !== undefined && !metadata.comment_count)
                                metadata.comment_count = domData.comment_count;
                            if (domData.view_count !== undefined && !metadata.view_count)
                                metadata.view_count = domData.view_count;
                            if (domData.caption && !metadata.caption)
                                metadata.caption = domData.caption;
                            if (domData.hashtags && !metadata.hashtags)
                                metadata.hashtags = domData.hashtags;
                            if (domData.share_count !== undefined && !metadata.share_count)
                                metadata.share_count = domData.share_count;
                        }
                        this.logger.log("Successfully extracted YouTube video metadata", "info");
                        return [2 /*return*/, metadata];
                    case 5:
                        error_2 = _a.sent();
                        this.logger.log("Failed to extract YouTube video metadata: ".concat(error_2), "error");
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    YouTubeScraper.prototype.extractFromEmbeddedJSON = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, page.evaluate(function () {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24;
                                var result = {};
                                if (window.ytInitialData) {
                                    var ytData = window.ytInitialData;
                                    var videoDetails = (_f = (_e = (_d = (_c = (_b = (_a = ytData === null || ytData === void 0 ? void 0 : ytData.contents) === null || _a === void 0 ? void 0 : _a.twoColumnWatchNextResults) === null || _b === void 0 ? void 0 : _b.results) === null || _c === void 0 ? void 0 : _c.results) === null || _d === void 0 ? void 0 : _d.contents) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.videoPrimaryInfoRenderer;
                                    var secondaryInfo = (_m = (_l = (_k = (_j = (_h = (_g = ytData === null || ytData === void 0 ? void 0 : ytData.contents) === null || _g === void 0 ? void 0 : _g.twoColumnWatchNextResults) === null || _h === void 0 ? void 0 : _h.results) === null || _j === void 0 ? void 0 : _j.results) === null || _k === void 0 ? void 0 : _k.contents) === null || _l === void 0 ? void 0 : _l[1]) === null || _m === void 0 ? void 0 : _m.videoSecondaryInfoRenderer;
                                    if (videoDetails) {
                                        var likeButton = (_s = (_r = (_q = (_p = (_o = videoDetails === null || videoDetails === void 0 ? void 0 : videoDetails.videoActions) === null || _o === void 0 ? void 0 : _o.menuRenderer) === null || _p === void 0 ? void 0 : _p.topLevelButtons) === null || _q === void 0 ? void 0 : _q[0]) === null || _r === void 0 ? void 0 : _r.segmentedLikeDislikeButtonRenderer) === null || _s === void 0 ? void 0 : _s.likeButton;
                                        if ((_w = (_v = (_u = (_t = likeButton === null || likeButton === void 0 ? void 0 : likeButton.toggleButtonRenderer) === null || _t === void 0 ? void 0 : _t.defaultText) === null || _u === void 0 ? void 0 : _u.accessibility) === null || _v === void 0 ? void 0 : _v.accessibilityData) === null || _w === void 0 ? void 0 : _w.label) {
                                            var likeText = likeButton.toggleButtonRenderer.defaultText.accessibility.accessibilityData.label;
                                            var likeMatch = likeText.match(/([\d.,]+[KMB]?)/);
                                            if (likeMatch) {
                                                var num = parseFloat(likeMatch[1].replace(/,/g, ''));
                                                if (likeText.includes('K') || likeText.includes('k'))
                                                    num *= 1000;
                                                else if (likeText.includes('M') || likeText.includes('m'))
                                                    num *= 1000000;
                                                else if (likeText.includes('B') || likeText.includes('b'))
                                                    num *= 1000000000;
                                                result.like_count = Math.floor(num);
                                            }
                                        }
                                        var viewCount = (_z = (_y = (_x = videoDetails === null || videoDetails === void 0 ? void 0 : videoDetails.viewCount) === null || _x === void 0 ? void 0 : _x.videoViewCountRenderer) === null || _y === void 0 ? void 0 : _y.viewCount) === null || _z === void 0 ? void 0 : _z.simpleText;
                                        if (viewCount) {
                                            var viewMatch = viewCount.match(/([\d.,]+[KMB]?)/);
                                            if (viewMatch) {
                                                var num = parseFloat(viewMatch[1].replace(/,/g, ''));
                                                if (viewCount.includes('K') || viewCount.includes('k'))
                                                    num *= 1000;
                                                else if (viewCount.includes('M') || viewCount.includes('m'))
                                                    num *= 1000000;
                                                else if (viewCount.includes('B') || viewCount.includes('b'))
                                                    num *= 1000000000;
                                                result.view_count = Math.floor(num);
                                            }
                                        }
                                        var publishedTime = (_0 = videoDetails === null || videoDetails === void 0 ? void 0 : videoDetails.dateText) === null || _0 === void 0 ? void 0 : _0.simpleText;
                                        if (publishedTime) {
                                            var dateMatch = publishedTime.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                                            if (dateMatch) {
                                                var date = new Date("".concat(dateMatch[3], "-").concat(dateMatch[1], "-").concat(dateMatch[2]));
                                                result.timestamp = Math.floor(date.getTime() / 1000);
                                            }
                                        }
                                    }
                                    if ((_5 = (_4 = (_3 = (_2 = (_1 = secondaryInfo === null || secondaryInfo === void 0 ? void 0 : secondaryInfo.owner) === null || _1 === void 0 ? void 0 : _1.videoOwnerRenderer) === null || _2 === void 0 ? void 0 : _2.title) === null || _3 === void 0 ? void 0 : _3.runs) === null || _4 === void 0 ? void 0 : _4[0]) === null || _5 === void 0 ? void 0 : _5.text) {
                                        var channelName = secondaryInfo.owner.videoOwnerRenderer.title.runs[0].text;
                                    }
                                    var description = (_6 = secondaryInfo === null || secondaryInfo === void 0 ? void 0 : secondaryInfo.attributedDescription) === null || _6 === void 0 ? void 0 : _6.content;
                                    if (description) {
                                        result.caption = description;
                                        var hashtags = description.match(/#\w+/g);
                                        if (hashtags) {
                                            result.hashtags = hashtags.map(function (h) { return h.substring(1); });
                                        }
                                    }
                                }
                                if (window.ytInitialPlayerResponse) {
                                    var playerData = window.ytInitialPlayerResponse;
                                    var videoDetails = playerData === null || playerData === void 0 ? void 0 : playerData.videoDetails;
                                    if (videoDetails) {
                                        if (!result.view_count && videoDetails.viewCount) {
                                            result.view_count = parseInt(videoDetails.viewCount);
                                        }
                                        if (!result.caption && videoDetails.shortDescription) {
                                            result.caption = videoDetails.shortDescription;
                                        }
                                        if (videoDetails.lengthSeconds) {
                                            result.is_video = true;
                                        }
                                    }
                                    var microformat = (_7 = playerData === null || playerData === void 0 ? void 0 : playerData.microformat) === null || _7 === void 0 ? void 0 : _7.playerMicroformatRenderer;
                                    if (microformat) {
                                        if (!result.timestamp && microformat.publishDate) {
                                            var date = new Date(microformat.publishDate);
                                            result.timestamp = Math.floor(date.getTime() / 1000);
                                        }
                                        if (microformat.uploadDate) {
                                            var date = new Date(microformat.uploadDate);
                                            if (!result.timestamp) {
                                                result.timestamp = Math.floor(date.getTime() / 1000);
                                            }
                                        }
                                    }
                                    var captions = (_9 = (_8 = playerData === null || playerData === void 0 ? void 0 : playerData.captions) === null || _8 === void 0 ? void 0 : _8.playerCaptionsTracklistRenderer) === null || _9 === void 0 ? void 0 : _9.captionTracks;
                                    if (captions && captions.length > 0) {
                                        result.is_video = true;
                                    }
                                }
                                var scripts = document.querySelectorAll('script');
                                for (var _i = 0, scripts_1 = scripts; _i < scripts_1.length; _i++) {
                                    var script = scripts_1[_i];
                                    var content = script.textContent || '';
                                    if (content.includes('ytInitialData') || content.includes('ytInitialPlayerResponse')) {
                                        try {
                                            if (content.includes('var ytInitialData = ')) {
                                                var match = content.match(/var ytInitialData = ({.+?});/);
                                                if (match) {
                                                    var json = JSON.parse(match[1]);
                                                    var videoDetails = (_15 = (_14 = (_13 = (_12 = (_11 = (_10 = json === null || json === void 0 ? void 0 : json.contents) === null || _10 === void 0 ? void 0 : _10.twoColumnWatchNextResults) === null || _11 === void 0 ? void 0 : _11.results) === null || _12 === void 0 ? void 0 : _12.results) === null || _13 === void 0 ? void 0 : _13.contents) === null || _14 === void 0 ? void 0 : _14[0]) === null || _15 === void 0 ? void 0 : _15.videoPrimaryInfoRenderer;
                                                    if (videoDetails && !result.like_count) {
                                                        var likeButton = (_20 = (_19 = (_18 = (_17 = (_16 = videoDetails === null || videoDetails === void 0 ? void 0 : videoDetails.videoActions) === null || _16 === void 0 ? void 0 : _16.menuRenderer) === null || _17 === void 0 ? void 0 : _17.topLevelButtons) === null || _18 === void 0 ? void 0 : _18[0]) === null || _19 === void 0 ? void 0 : _19.segmentedLikeDislikeButtonRenderer) === null || _20 === void 0 ? void 0 : _20.likeButton;
                                                        if ((_24 = (_23 = (_22 = (_21 = likeButton === null || likeButton === void 0 ? void 0 : likeButton.toggleButtonRenderer) === null || _21 === void 0 ? void 0 : _21.defaultText) === null || _22 === void 0 ? void 0 : _22.accessibility) === null || _23 === void 0 ? void 0 : _23.accessibilityData) === null || _24 === void 0 ? void 0 : _24.label) {
                                                            var likeText = likeButton.toggleButtonRenderer.defaultText.accessibility.accessibilityData.label;
                                                            var likeMatch = likeText.match(/([\d.,]+[KMB]?)/);
                                                            if (likeMatch) {
                                                                var num = parseFloat(likeMatch[1].replace(/,/g, ''));
                                                                if (likeText.includes('K') || likeText.includes('k'))
                                                                    num *= 1000;
                                                                else if (likeText.includes('M') || likeText.includes('m'))
                                                                    num *= 1000000;
                                                                else if (likeText.includes('B') || likeText.includes('b'))
                                                                    num *= 1000000000;
                                                                result.like_count = Math.floor(num);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        catch (e) {
                                            continue;
                                        }
                                    }
                                }
                                return result;
                            })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_3 = _a.sent();
                        this.logger.log("Failed to extract from embedded JSON: ".concat(error_3), "debug");
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    YouTubeScraper.prototype.extractFromDOM = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, page.evaluate(function () {
                                var result = {};
                                var likeSelectors = [
                                    'ytd-toggle-button-renderer[aria-label*="like"]',
                                    'button[aria-label*="like"]',
                                    '#top-level-buttons-computed button[aria-label*="like"]',
                                    'yt-formatted-string[id="text"][aria-label*="like"]'
                                ];
                                for (var _i = 0, likeSelectors_1 = likeSelectors; _i < likeSelectors_1.length; _i++) {
                                    var selector = likeSelectors_1[_i];
                                    var elements = document.querySelectorAll(selector);
                                    for (var _a = 0, elements_2 = elements; _a < elements_2.length; _a++) {
                                        var el = elements_2[_a];
                                        var ariaLabel = el.getAttribute('aria-label') || '';
                                        var text = (el.textContent || '').trim();
                                        if (ariaLabel.includes('like') || text.includes('like')) {
                                            var match = (ariaLabel || text).match(/([\d.,]+[KMB]?)\s*likes?/i);
                                            if (match) {
                                                var num = parseFloat(match[1].replace(/,/g, ''));
                                                if (match[1].includes('K') || match[1].includes('k'))
                                                    num *= 1000;
                                                else if (match[1].includes('M') || match[1].includes('m'))
                                                    num *= 1000000;
                                                else if (match[1].includes('B') || match[1].includes('b'))
                                                    num *= 1000000000;
                                                result.like_count = Math.floor(num);
                                                break;
                                            }
                                        }
                                    }
                                    if (result.like_count)
                                        break;
                                }
                                var commentSelectors = [
                                    'ytd-comments-header-renderer #count',
                                    'h2#count',
                                    '[id="count"]',
                                    'yt-formatted-string[id="count"]'
                                ];
                                for (var _b = 0, commentSelectors_1 = commentSelectors; _b < commentSelectors_1.length; _b++) {
                                    var selector = commentSelectors_1[_b];
                                    var el = document.querySelector(selector);
                                    if (el) {
                                        var text = (el.textContent || '').trim();
                                        var match = text.match(/([\d.,]+[KMB]?)/);
                                        if (match) {
                                            var num = parseFloat(match[1].replace(/,/g, ''));
                                            if (text.includes('K') || text.includes('k'))
                                                num *= 1000;
                                            else if (text.includes('M') || text.includes('m'))
                                                num *= 1000000;
                                            else if (text.includes('B') || text.includes('b'))
                                                num *= 1000000000;
                                            result.comment_count = Math.floor(num);
                                            break;
                                        }
                                    }
                                }
                                var viewSelectors = [
                                    '#count',
                                    'ytd-video-view-count-renderer',
                                    '.view-count',
                                    'span.view-count'
                                ];
                                for (var _c = 0, viewSelectors_1 = viewSelectors; _c < viewSelectors_1.length; _c++) {
                                    var selector = viewSelectors_1[_c];
                                    var el = document.querySelector(selector);
                                    if (el) {
                                        var text = (el.textContent || '').trim();
                                        if (text.includes('view') || text.includes('views')) {
                                            var match = text.match(/([\d.,]+[KMB]?)/);
                                            if (match) {
                                                var num = parseFloat(match[1].replace(/,/g, ''));
                                                if (text.includes('K') || text.includes('k'))
                                                    num *= 1000;
                                                else if (text.includes('M') || text.includes('m'))
                                                    num *= 1000000;
                                                else if (text.includes('B') || text.includes('b'))
                                                    num *= 1000000000;
                                                result.view_count = Math.floor(num);
                                                break;
                                            }
                                        }
                                    }
                                }
                                var descriptionEl = document.querySelector('#description');
                                if (descriptionEl) {
                                    var description = descriptionEl.textContent || '';
                                    if (description.length > 0) {
                                        result.caption = description.trim();
                                        var hashtags = description.match(/#\w+/g);
                                        if (hashtags) {
                                            result.hashtags = hashtags.map(function (h) { return h.substring(1); });
                                        }
                                    }
                                }
                                var shareButton = document.querySelector('button[aria-label*="Share"]');
                                if (shareButton) {
                                    var shareText = shareButton.getAttribute('aria-label') || '';
                                    var shareMatch = shareText.match(/([\d.,]+[KMB]?)\s*shares?/i);
                                    if (shareMatch) {
                                        var num = parseFloat(shareMatch[1].replace(/,/g, ''));
                                        if (shareMatch[1].includes('K') || shareMatch[1].includes('k'))
                                            num *= 1000;
                                        else if (shareMatch[1].includes('M') || shareMatch[1].includes('m'))
                                            num *= 1000000;
                                        else if (shareMatch[1].includes('B') || shareMatch[1].includes('b'))
                                            num *= 1000000000;
                                        result.share_count = Math.floor(num);
                                    }
                                }
                                var videoElement = document.querySelector('video');
                                if (videoElement) {
                                    result.is_video = true;
                                }
                                return result;
                            })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_4 = _a.sent();
                        this.logger.log("Failed to extract from DOM: ".concat(error_4), "debug");
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return YouTubeScraper;
}(CreatorMetadataScraper_js_1.CreatorMetadataScraper));
exports.YouTubeScraper = YouTubeScraper;
