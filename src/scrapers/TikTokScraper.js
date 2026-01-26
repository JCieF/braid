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
exports.TikTokScraper = void 0;
var CreatorMetadataScraper_js_1 = require("./CreatorMetadataScraper.js");
var TikTokScraper = /** @class */ (function (_super) {
    __extends(TikTokScraper, _super);
    function TikTokScraper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TikTokScraper.prototype.getCreatorProfileUrl = function (videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var match;
            return __generator(this, function (_a) {
                try {
                    match = videoUrl.match(/tiktok\.com\/@([^\/]+)/);
                    if (match) {
                        return [2 /*return*/, "https://www.tiktok.com/@".concat(match[1])];
                    }
                    return [2 /*return*/, null];
                }
                catch (_b) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    TikTokScraper.prototype.extractMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var profileUrl, metadata, usernameMatch, nameSelectors, _i, nameSelectors_1, selector, name_1, followerSelectors, _a, followerSelectors_1, selector, followerText, bioSelectors, _b, bioSelectors_1, selector, bio, avatarSelectors, _c, avatarSelectors_1, selector, avatar, avatar100, avatarLarge, verifiedSelectors, _d, verifiedSelectors_1, selector, verified, verifiedInPage, e_1, error_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 29, , 30]);
                        this.logger.log("Extracting TikTok creator metadata...", "info");
                        return [4 /*yield*/, this.getCreatorProfileUrl(videoUrl)];
                    case 1:
                        profileUrl = _e.sent();
                        if (!profileUrl) {
                            this.logger.log("Could not determine TikTok profile URL", "warn");
                            return [2 /*return*/, null];
                        }
                        metadata = {
                            platform: "tiktok",
                            url: profileUrl,
                            extractedAt: Date.now(),
                        };
                        usernameMatch = profileUrl.match(/@([^\/\?]+)/);
                        if (usernameMatch) {
                            metadata.creator_username = usernameMatch[1];
                            metadata.creator_profile_deep_link = profileUrl;
                        }
                        return [4 /*yield*/, page.goto(profileUrl, { waitUntil: "domcontentloaded" })];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 3:
                        _e.sent();
                        nameSelectors = [
                            '[data-e2e="user-title"]',
                            'h1[data-e2e="user-title"]',
                            '.user-title',
                            'h1'
                        ];
                        _i = 0, nameSelectors_1 = nameSelectors;
                        _e.label = 4;
                    case 4:
                        if (!(_i < nameSelectors_1.length)) return [3 /*break*/, 7];
                        selector = nameSelectors_1[_i];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 5:
                        name_1 = _e.sent();
                        if (name_1 && !name_1.includes("@")) {
                            metadata.creator_name = this.cleanText(name_1);
                            return [3 /*break*/, 7];
                        }
                        _e.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        followerSelectors = [
                            '[data-e2e="followers-count"]',
                            '[data-e2e="followers"]',
                            '.followers-count',
                            'strong[title*="followers"]'
                        ];
                        _a = 0, followerSelectors_1 = followerSelectors;
                        _e.label = 8;
                    case 8:
                        if (!(_a < followerSelectors_1.length)) return [3 /*break*/, 11];
                        selector = followerSelectors_1[_a];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 9:
                        followerText = _e.sent();
                        if (followerText) {
                            metadata.creator_follower_count = this.parseCount(followerText);
                            return [3 /*break*/, 11];
                        }
                        _e.label = 10;
                    case 10:
                        _a++;
                        return [3 /*break*/, 8];
                    case 11:
                        bioSelectors = [
                            '[data-e2e="user-bio"]',
                            '.user-bio',
                            '[data-e2e="user-desc"]'
                        ];
                        _b = 0, bioSelectors_1 = bioSelectors;
                        _e.label = 12;
                    case 12:
                        if (!(_b < bioSelectors_1.length)) return [3 /*break*/, 15];
                        selector = bioSelectors_1[_b];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 13:
                        bio = _e.sent();
                        if (bio && bio.length > 5) {
                            metadata.creator_bio = this.cleanText(bio);
                            return [3 /*break*/, 15];
                        }
                        _e.label = 14;
                    case 14:
                        _b++;
                        return [3 /*break*/, 12];
                    case 15:
                        avatarSelectors = [
                            '[data-e2e="user-avatar"] img',
                            '.avatar img',
                            'img[alt*="avatar"]',
                            'img[data-e2e="user-avatar"]'
                        ];
                        _c = 0, avatarSelectors_1 = avatarSelectors;
                        _e.label = 16;
                    case 16:
                        if (!(_c < avatarSelectors_1.length)) return [3 /*break*/, 19];
                        selector = avatarSelectors_1[_c];
                        return [4 /*yield*/, this.getElementAttribute(page, selector, "src")];
                    case 17:
                        avatar = _e.sent();
                        if (avatar) {
                            metadata.creator_avatar_url = avatar;
                            if (avatar.includes("tiktokcdn.com")) {
                                avatar100 = avatar.replace(/~tplv-[^:]+:[^:]+:[^:]+/, "~tplv-tiktokx-cropcenter:100:100");
                                if (avatar100 !== avatar) {
                                    metadata.creator_avatar_url_100 = avatar100;
                                }
                                avatarLarge = avatar.replace(/~tplv-[^:]+:[^:]+:[^:]+/, "~tplv-tiktokx-cropcenter:720:720");
                                if (avatarLarge !== avatar) {
                                    metadata.creator_avatar_large_url = avatarLarge;
                                }
                            }
                            return [3 /*break*/, 19];
                        }
                        _e.label = 18;
                    case 18:
                        _c++;
                        return [3 /*break*/, 16];
                    case 19:
                        verifiedSelectors = [
                            '[data-e2e="verified-icon"]',
                            '.verified-badge',
                            '[aria-label*="Verified"]',
                            '[title*="Verified"]',
                            'svg[data-e2e="verified-icon"]',
                            '[class*="verified"]',
                            '[class*="Verified"]'
                        ];
                        metadata.creator_verified = false;
                        _d = 0, verifiedSelectors_1 = verifiedSelectors;
                        _e.label = 20;
                    case 20:
                        if (!(_d < verifiedSelectors_1.length)) return [3 /*break*/, 24];
                        selector = verifiedSelectors_1[_d];
                        return [4 /*yield*/, page.locator(selector).first()];
                    case 21:
                        verified = _e.sent();
                        return [4 /*yield*/, verified.isVisible({ timeout: 2000 }).catch(function () { return false; })];
                    case 22:
                        if (_e.sent()) {
                            metadata.creator_verified = true;
                            this.logger.log("Found verified badge with selector: ".concat(selector), "debug");
                            return [3 /*break*/, 24];
                        }
                        _e.label = 23;
                    case 23:
                        _d++;
                        return [3 /*break*/, 20];
                    case 24:
                        if (!!metadata.creator_verified) return [3 /*break*/, 28];
                        _e.label = 25;
                    case 25:
                        _e.trys.push([25, 27, , 28]);
                        return [4 /*yield*/, page.evaluate(function () {
                                var elements = document.querySelectorAll('*');
                                for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                                    var el = elements_1[_i];
                                    var ariaLabel = el.getAttribute('aria-label');
                                    var title = el.getAttribute('title');
                                    var className = el.className || '';
                                    if ((ariaLabel && ariaLabel.toLowerCase().includes('verified')) ||
                                        (title && title.toLowerCase().includes('verified')) ||
                                        (className && className.toLowerCase().includes('verified'))) {
                                        return true;
                                    }
                                }
                                return false;
                            })];
                    case 26:
                        verifiedInPage = _e.sent();
                        if (verifiedInPage) {
                            metadata.creator_verified = true;
                            this.logger.log("Found verified badge via page evaluation", "debug");
                        }
                        return [3 /*break*/, 28];
                    case 27:
                        e_1 = _e.sent();
                        this.logger.log("Error checking verified status: ".concat(e_1), "debug");
                        return [3 /*break*/, 28];
                    case 28:
                        this.logger.log("Successfully extracted TikTok creator metadata", "info");
                        return [2 /*return*/, metadata];
                    case 29:
                        error_1 = _e.sent();
                        this.logger.log("Failed to extract TikTok metadata: ".concat(error_1), "error");
                        return [2 /*return*/, null];
                    case 30: return [2 /*return*/];
                }
            });
        });
    };
    TikTokScraper.prototype.extractVideoMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var apiResponses_1, allApiResponses_1, responseHandler, e_2, metadata, videoIdMatch, videoId, embeddedData, domData, creatorFields, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 17, , 18]);
                        this.logger.log("Extracting TikTok video metadata...", "info");
                        apiResponses_1 = [];
                        allApiResponses_1 = [];
                        responseHandler = function (response) { return __awaiter(_this, void 0, void 0, function () {
                            var url, json, hasVideoData, dataKeys, e_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = response.url();
                                        if (!(url.includes("/api/") || url.includes("/aweme/") || url.includes("/post/") || url.includes("/tiktok/"))) return [3 /*break*/, 4];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, response.json()];
                                    case 2:
                                        json = _a.sent();
                                        allApiResponses_1.push({ url: url, data: json });
                                        hasVideoData = url.includes("item_list") ||
                                            url.includes("itemList") ||
                                            url.includes("/post/item_list") ||
                                            url.includes("/api/post/item_list") ||
                                            url.includes("related/item_list") ||
                                            url.includes("video") ||
                                            url.includes("post") ||
                                            url.includes("item/detail") ||
                                            url.includes("aweme/detail") ||
                                            url.includes("item/info") ||
                                            url.includes("feed") ||
                                            url.includes("aweme/v1") ||
                                            url.includes("aweme/v2") ||
                                            url.includes("item") ||
                                            (json.itemInfo || json.itemList || json.items || json.aweme_detail || json.item || json.data);
                                        if (hasVideoData) {
                                            apiResponses_1.push({ url: url, data: json });
                                            this.logger.log("Found potential video data API: ".concat(url.substring(0, 150)), "debug");
                                            dataKeys = Object.keys(json).slice(0, 10);
                                            this.logger.log("  API response keys: ".concat(dataKeys.join(", ")), "debug");
                                            if (json.itemInfo || json.itemList || json.items || json.aweme_detail || json.item) {
                                                this.logger.log("  Contains video data structure!", "info");
                                            }
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_3 = _a.sent();
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); };
                        page.on("response", responseHandler);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 13, 14]);
                        return [4 /*yield*/, page.goto(videoUrl, { waitUntil: "networkidle" })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Promise.race([
                                page.waitForResponse(function (response) {
                                    var url = response.url();
                                    return (url.includes("/api/") || url.includes("/aweme/") || url.includes("/tiktok/")) &&
                                        (url.includes("item") || url.includes("video") || url.includes("post") || url.includes("feed") || url.includes("aweme/v"));
                                }, { timeout: 15000 }).catch(function () { return null; }),
                                new Promise(function (resolve) { return setTimeout(resolve, 15000); })
                            ])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.delay(5000)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, page.waitForSelector('[data-e2e="browse-video-desc"], [data-e2e="video-desc"], [class*="desc"], h1, [class*="Description"]', { timeout: 5000 })];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        e_2 = _a.sent();
                        this.logger.log("Video description element not found, continuing anyway", "debug");
                        return [3 /*break*/, 8];
                    case 8: return [4 /*yield*/, page.evaluate(function () {
                            window.scrollTo(0, document.body.scrollHeight / 2);
                        })];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.delay(2000)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                window.scrollTo(0, 0);
                            })];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.delay(1000)];
                    case 12:
                        _a.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        page.off("response", responseHandler);
                        return [7 /*endfinally*/];
                    case 14:
                        this.logger.log("Total API responses captured: ".concat(allApiResponses_1.length), "debug");
                        metadata = {
                            platform: "tiktok",
                            url: videoUrl,
                            extractedAt: Date.now(),
                        };
                        videoIdMatch = videoUrl.match(/\/video\/(\d+)/);
                        if (videoIdMatch) {
                            metadata.video_id = videoIdMatch[1];
                        }
                        videoId = videoIdMatch === null || videoIdMatch === void 0 ? void 0 : videoIdMatch[1];
                        return [4 /*yield*/, this.extractTikTokEmbeddedData(page, videoId, apiResponses_1)];
                    case 15:
                        embeddedData = _a.sent();
                        if (embeddedData) {
                            this.logger.log("Extracted ".concat(Object.keys(embeddedData).length, " fields from embedded data"), "debug");
                            this.logger.log("Embedded data keys: ".concat(Object.keys(embeddedData).join(", ")), "debug");
                            if (embeddedData.embed_link)
                                metadata.embed_link = embeddedData.embed_link;
                            if (embeddedData.hashtags) {
                                metadata.hashtags = embeddedData.hashtags;
                                this.logger.log("Merged hashtags: ".concat(Array.isArray(embeddedData.hashtags) ? embeddedData.hashtags.join(", ") : embeddedData.hashtags), "info");
                            }
                            if (embeddedData.effect_ids) {
                                metadata.effect_ids = embeddedData.effect_ids;
                                this.logger.log("Merged effect_ids: ".concat(Array.isArray(embeddedData.effect_ids) ? embeddedData.effect_ids.join(", ") : embeddedData.effect_ids), "info");
                            }
                            if (embeddedData.playlist_id)
                                metadata.playlist_id = embeddedData.playlist_id;
                            if (embeddedData.voice_to_text)
                                metadata.voice_to_text = embeddedData.voice_to_text;
                            if (embeddedData.region_code)
                                metadata.region_code = embeddedData.region_code;
                            if (embeddedData.music_id)
                                metadata.music_id = embeddedData.music_id;
                            if (embeddedData.caption)
                                metadata.caption = embeddedData.caption;
                            if (embeddedData.timestamp !== undefined)
                                metadata.timestamp = embeddedData.timestamp;
                            if (embeddedData.like_count !== undefined)
                                metadata.like_count = embeddedData.like_count;
                            if (embeddedData.comment_count !== undefined)
                                metadata.comment_count = embeddedData.comment_count;
                            if (embeddedData.view_count !== undefined)
                                metadata.view_count = embeddedData.view_count;
                            if (embeddedData.play_count !== undefined)
                                metadata.play_count = embeddedData.play_count;
                            if (embeddedData.share_count !== undefined)
                                metadata.share_count = embeddedData.share_count;
                            if (embeddedData.duration !== undefined)
                                metadata.duration = embeddedData.duration;
                            if (embeddedData.music_title)
                                metadata.music_title = embeddedData.music_title;
                            if (embeddedData.music_artist)
                                metadata.music_artist = embeddedData.music_artist;
                            if (embeddedData.mentions)
                                metadata.mentions = embeddedData.mentions;
                            if (embeddedData.thumbnails)
                                metadata.thumbnails = embeddedData.thumbnails;
                            if (embeddedData.save_count !== undefined)
                                metadata.save_count = embeddedData.save_count;
                            if (embeddedData.location)
                                metadata.location = embeddedData.location;
                            if (embeddedData.location_latitude !== undefined)
                                metadata.location_latitude = embeddedData.location_latitude;
                            if (embeddedData.location_longitude !== undefined)
                                metadata.location_longitude = embeddedData.location_longitude;
                            if (embeddedData.is_video !== undefined)
                                metadata.is_video = embeddedData.is_video;
                            if (embeddedData.dimension)
                                metadata.dimension = embeddedData.dimension;
                        }
                        else {
                            this.logger.log("No embedded data found", "debug");
                        }
                        if (!metadata.embed_link && (videoIdMatch === null || videoIdMatch === void 0 ? void 0 : videoIdMatch[1])) {
                            metadata.embed_link = "https://www.tiktok.com/embed/v2/".concat(videoIdMatch[1]);
                        }
                        return [4 /*yield*/, this.extractTikTokDOMData(page)];
                    case 16:
                        domData = _a.sent();
                        if (domData) {
                            this.logger.log("Extracted ".concat(Object.keys(domData).length, " fields from DOM"), "debug");
                            this.logger.log("DOM data keys: ".concat(Object.keys(domData).join(", ")), "debug");
                            if (domData.embed_link && !metadata.embed_link)
                                metadata.embed_link = domData.embed_link;
                            if (domData.hashtags && !metadata.hashtags) {
                                metadata.hashtags = domData.hashtags;
                                this.logger.log("Found ".concat(domData.hashtags.length, " hashtags in DOM"), "info");
                            }
                            if (domData.music_id && !metadata.music_id) {
                                metadata.music_id = domData.music_id;
                                this.logger.log("Found music_id in DOM: ".concat(domData.music_id), "info");
                            }
                            if (domData.caption && !metadata.caption) {
                                metadata.caption = domData.caption;
                                this.logger.log("Found caption in DOM (".concat(domData.caption.length, " chars)"), "info");
                            }
                        }
                        else {
                            this.logger.log("No data extracted from DOM", "debug");
                        }
                        this.logger.log("Final metadata keys: ".concat(Object.keys(metadata).join(", ")), "debug");
                        if (metadata.effect_ids) {
                            this.logger.log("Final effect_ids: ".concat(Array.isArray(metadata.effect_ids) ? metadata.effect_ids.join(", ") : metadata.effect_ids), "info");
                        }
                        if (metadata.hashtags) {
                            this.logger.log("Final hashtags: ".concat(Array.isArray(metadata.hashtags) ? metadata.hashtags.join(", ") : metadata.hashtags), "info");
                        }
                        creatorFields = {};
                        if (embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_open_id)
                            creatorFields.creator_open_id = embeddedData.creator_open_id;
                        if (embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_union_id)
                            creatorFields.creator_union_id = embeddedData.creator_union_id;
                        if (embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_avatar_url_100)
                            creatorFields.creator_avatar_url_100 = embeddedData.creator_avatar_url_100;
                        if (embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_avatar_large_url)
                            creatorFields.creator_avatar_large_url = embeddedData.creator_avatar_large_url;
                        if (embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_profile_deep_link)
                            creatorFields.creator_profile_deep_link = embeddedData.creator_profile_deep_link;
                        if ((embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_following_count) !== undefined)
                            creatorFields.creator_following_count = embeddedData.creator_following_count;
                        if ((embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_likes_count) !== undefined)
                            creatorFields.creator_likes_count = embeddedData.creator_likes_count;
                        if ((embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_video_count) !== undefined)
                            creatorFields.creator_video_count = embeddedData.creator_video_count;
                        if (Object.keys(creatorFields).length > 0) {
                            metadata.creator_fields = creatorFields;
                            this.logger.log("Extracted ".concat(Object.keys(creatorFields).length, " creator fields from video API"), "info");
                        }
                        this.logger.log("Successfully extracted TikTok video metadata", "info");
                        return [2 /*return*/, metadata];
                    case 17:
                        error_2 = _a.sent();
                        this.logger.log("Failed to extract TikTok video metadata: ".concat(error_2), "error");
                        return [2 /*return*/, null];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    TikTokScraper.prototype.extractTikTokEmbeddedData = function (page, videoId, apiResponses) {
        return __awaiter(this, void 0, void 0, function () {
            var evalCode, response_1, _i, apiResponses_2, apiResp, dataKeys, extractVideoData, items, video, _a, _b, item, video, keywords, windowData, extractedKeys, error_3;
            var _this = this;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        _p.trys.push([0, 3, , 4]);
                        evalCode = "\n                (function(vidId) {\n                    var result = {};\n                    var debugInfo = {\n                        foundSIGI: false,\n                        foundVideo: false,\n                        videoKeys: [],\n                        sigiTopLevelKeys: [],\n                        itemModuleKeys: []\n                    };\n\n                    function findVideoInItemModule(itemModule, targetId) {\n                        if (!itemModule) return null;\n                        if (targetId) {\n                            return itemModule[targetId] || null;\n                        }\n                        var entries = Object.values(itemModule);\n                        if (entries.length > 0) {\n                            return entries[0];\n                        }\n                        return null;\n                    }\n\n                    function extractFromSIGI(sigiState, vidId, result, debugInfo) {\n                        if (!sigiState) return;\n                        debugInfo.foundSIGI = true;\n                        debugInfo.sigiTopLevelKeys = Object.keys(sigiState).slice(0, 20);\n                        \n                        var itemModule = sigiState.ItemModule || sigiState.itemModule;\n                        if (itemModule) {\n                            debugInfo.itemModuleKeys = Object.keys(itemModule).slice(0, 10);\n                        }\n                        \n                        var video = findVideoInItemModule(itemModule, vidId);\n                        \n                        if (video) {\n                            debugInfo.foundVideo = true;\n                            debugInfo.videoKeys = Object.keys(video).slice(0, 50);\n                            \n                            if (video.embedLink || video.embed_link) {\n                                result.embed_link = video.embedLink || video.embed_link;\n                            } else if (vidId) {\n                                result.embed_link = \"https://www.tiktok.com/embed/v2/\" + vidId;\n                            }\n\n                            if (video.music) {\n                                if (video.music.id) {\n                                    result.music_id = String(video.music.id);\n                                } else if (video.music.musicId) {\n                                    result.music_id = String(video.music.musicId);\n                                }\n                            }\n\n                            if (video.effectStickers && Array.isArray(video.effectStickers)) {\n                                result.effect_ids = video.effectStickers\n                                    .map(function(e) { return e.id || e.effectId || e.effect_id; })\n                                    .filter(function(id) { return id != null; })\n                                    .map(function(id) { return String(id); });\n                            }\n\n                            if (video.challengeList && Array.isArray(video.challengeList)) {\n                                result.hashtags = video.challengeList\n                                    .map(function(c) { return c.title || c.challengeName || c.name; })\n                                    .filter(function(val) { return val != null; });\n                            } else if (video.textExtra && Array.isArray(video.textExtra)) {\n                                var hashtags = video.textExtra\n                                    .filter(function(item) { return item.hashtagName || item.hashtag; })\n                                    .map(function(item) { return item.hashtagName || item.hashtag; });\n                                if (hashtags.length > 0) {\n                                    result.hashtags = hashtags;\n                                }\n                            }\n\n                            if (video.desc) {\n                                var descHashtags = (video.desc.match(/#[\\w]+/g) || [])\n                                    .map(function(h) { return h.substring(1); });\n                                if (descHashtags.length > 0) {\n                                    result.hashtags = (result.hashtags || []).concat(descHashtags);\n                                    result.hashtags = result.hashtags.filter(function(v, i, a) { return a.indexOf(v) === i; });\n                                }\n                            }\n\n                            if (video.playlistId) {\n                                result.playlist_id = String(video.playlistId);\n                            }\n\n                            if (video.regionCode) {\n                                result.region_code = video.regionCode;\n                            }\n\n                            if (video.transcription || video.voiceToText || video.voice_to_text) {\n                                result.voice_to_text = video.transcription || video.voiceToText || video.voice_to_text;\n                            }\n                        }\n                    }\n\n                    var scripts = document.querySelectorAll('script');\n                    debugInfo.scriptCount = scripts.length;\n                    var scriptIds = [];\n                    var scriptTypes = [];\n                    \n                    for (var i = 0; i < scripts.length; i++) {\n                        var script = scripts[i];\n                        var id = script.id || \"\";\n                        var type = script.getAttribute(\"type\") || \"\";\n                        if (id) scriptIds.push(id);\n                        if (type) scriptTypes.push(type);\n                    }\n                    debugInfo.scriptIds = scriptIds.slice(0, 20);\n                    debugInfo.scriptTypes = scriptTypes.slice(0, 10);\n                    \n                    for (var i = 0; i < scripts.length; i++) {\n                        var script = scripts[i];\n                        try {\n                            var text = script.textContent || \"\";\n                            var id = script.id || \"\";\n                            var type = script.getAttribute(\"type\") || \"\";\n\n                            if (id.indexOf(\"SIGI_STATE\") !== -1 || text.indexOf(\"SIGI_STATE\") !== -1 || text.indexOf(\"ItemModule\") !== -1) {\n                                var sigiState = null;\n                                \n                                if (id.indexOf(\"SIGI_STATE\") !== -1) {\n                                    try {\n                                        sigiState = JSON.parse(text);\n                                    } catch (e) {\n                                        var match = text.match(/SIGI_STATE\\s*=\\s*({.+?});/s);\n                                        if (match) {\n                                            sigiState = JSON.parse(match[1]);\n                                        }\n                                    }\n                                } else {\n                                    var match1 = text.match(/SIGI_STATE\\s*=\\s*({.+?});/s);\n                                    var match2 = text.match(/window\\[['\"]SIGI_STATE['\"]\\]\\s*=\\s*({.+?});/s);\n                                    var match3 = text.match(/<script[^>]*id=['\"]SIGI_STATE['\"][^>]*>([\\s\\S]*?)<\\/script>/);\n                                    \n                                    if (match1) {\n                                        sigiState = JSON.parse(match1[1]);\n                                    } else if (match2) {\n                                        sigiState = JSON.parse(match2[1]);\n                                    } else if (match3) {\n                                        sigiState = JSON.parse(match3[1]);\n                                    } else if (text.indexOf(\"ItemModule\") !== -1 && (type === \"application/json\" || id === \"\")) {\n                                        try {\n                                            var jsonMatch = text.match(/\\{[\\s\\S]*\"ItemModule\"[\\s\\S]*\\}/);\n                                            if (jsonMatch) {\n                                                sigiState = JSON.parse(jsonMatch[0]);\n                                            }\n                                        } catch (e) {\n                                            try {\n                                                sigiState = JSON.parse(text);\n                                            } catch (e2) {\n                                                var lines = text.split(\"\\n\");\n                                                for (var j = 0; j < lines.length; j++) {\n                                                    if (lines[j].indexOf(\"ItemModule\") !== -1) {\n                                                        try {\n                                                            var lineMatch = lines[j].match(/\\{[\\s\\S]*\\}/);\n                                                            if (lineMatch) {\n                                                                sigiState = JSON.parse(lineMatch[0]);\n                                                                break;\n                                                            }\n                                                        } catch (e3) {}\n                                                    }\n                                                }\n                                            }\n                                        }\n                                    }\n                                }\n\n                                if (sigiState) {\n                                    extractFromSIGI(sigiState, vidId, result, debugInfo);\n                                    break;\n                                }\n                            }\n\n                            if (id === \"__UNIVERSAL_DATA_FOR_REHYDRATION__\" || text.indexOf(\"__UNIVERSAL_DATA_FOR_REHYDRATION__\") !== -1) {\n                                try {\n                                    var parsed = null;\n                                    \n                                    if (id === \"__UNIVERSAL_DATA_FOR_REHYDRATION__\") {\n                                        try {\n                                            parsed = JSON.parse(text);\n                                        } catch (e) {\n                                            var match = text.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__\\s*=\\s*({.+?});/s);\n                                            if (match) {\n                                                parsed = JSON.parse(match[1]);\n                                            }\n                                        }\n                                    } else {\n                                        var match1 = text.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__\\s*=\\s*({.+?});/s);\n                                        var match2 = text.match(/window\\.__UNIVERSAL_DATA_FOR_REHYDRATION__\\s*=\\s*({.+?});/s);\n                                        var match3 = text.match(/\\{.*\"defaultScope\".*\\}/s);\n                                        \n                                        if (match1) {\n                                            parsed = JSON.parse(match1[1]);\n                                        } else if (match2) {\n                                            parsed = JSON.parse(match2[1]);\n                                        } else if (match3) {\n                                            parsed = JSON.parse(match3[0]);\n                                        } else {\n                                            try {\n                                                parsed = JSON.parse(text);\n                                            } catch (e) {}\n                                        }\n                                    }\n                                    \n                                    if (parsed) {\n                                        var state = parsed.defaultScope || parsed.__UNIVERSAL_DATA_FOR_REHYDRATION__ || parsed;\n                                        if (state && (state.ItemModule || state.itemModule || state.VideoModule || state.videoModule)) {\n                                            extractFromSIGI(state, vidId, result, debugInfo);\n                                        }\n                                    }\n                                } catch (e) {\n                                    // Ignore parsing errors\n                                }\n                            }\n                        } catch (e) {\n                            continue;\n                        }\n                    }\n                    \n                    if (!debugInfo.foundSIGI) {\n                        debugInfo.searchText = \"Searched \" + scripts.length + \" scripts, found ItemModule in: \" + \n                            Array.from(scripts).filter(function(s) { \n                                return (s.textContent || \"\").indexOf(\"ItemModule\") !== -1; \n                            }).length;\n                    }\n\n                    if (window.location.href.indexOf(\"embed\") !== -1) {\n                        var embedUrl = window.location.href;\n                        if (embedUrl.indexOf(\"/embed/\") !== -1) {\n                            result.embed_link = embedUrl;\n                        }\n                    }\n\n                    if (vidId && !result.embed_link) {\n                        result.embed_link = \"https://www.tiktok.com/embed/v2/\" + vidId;\n                    }\n\n                    if (window.__UNIVERSAL_DATA_FOR_REHYDRATION__) {\n                        try {\n                            var universalData = window.__UNIVERSAL_DATA_FOR_REHYDRATION__;\n                            var state = universalData.defaultScope || universalData;\n                            if (state && (state.ItemModule || state.itemModule || state.VideoModule || state.videoModule)) {\n                                extractFromSIGI(state, vidId, result, debugInfo);\n                            }\n                        } catch (e) {\n                            debugInfo.windowAccessError = String(e);\n                        }\n                    }\n\n                    var metaTags = document.querySelectorAll('meta[property], meta[name]');\n                    for (var i = 0; i < metaTags.length; i++) {\n                        var meta = metaTags[i];\n                        var property = meta.getAttribute(\"property\") || meta.getAttribute(\"name\") || \"\";\n                        var content = meta.getAttribute(\"content\") || \"\";\n                        \n                        if (property.indexOf(\"music\") !== -1 && content && !result.music_id) {\n                            var musicMatch = content.match(/\\/(\\d+)/);\n                            if (musicMatch) {\n                                result.music_id = musicMatch[1];\n                            }\n                        }\n                    }\n\n                    var jsonLdScripts = document.querySelectorAll('script[type=\"application/ld+json\"]');\n                    for (var i = 0; i < jsonLdScripts.length; i++) {\n                        try {\n                            var jsonLd = JSON.parse(jsonLdScripts[i].textContent || \"{}\");\n                            if (jsonLd[\"@type\"] === \"VideoObject\" || jsonLd[\"@type\"] === \"SocialMediaPosting\") {\n                                if (jsonLd.description && !result.hashtags) {\n                                    var descHashtags = (jsonLd.description.match(/#[\\w]+/g) || [])\n                                        .map(function(h) { return h.substring(1); });\n                                    if (descHashtags.length > 0) {\n                                        result.hashtags = descHashtags;\n                                    }\n                                }\n                            }\n                        } catch (e) {\n                            continue;\n                        }\n                    }\n\n                    var descSelectors = [\n                        '[data-e2e=\"browse-video-desc\"]',\n                        '[data-e2e=\"video-desc\"]',\n                        'h1[data-e2e=\"browse-video-desc\"]',\n                        '[class*=\"desc\"]',\n                        '[class*=\"Description\"]',\n                        'span[class*=\"desc\"]',\n                        'div[class*=\"desc\"]'\n                    ];\n                    \n                    var descElement = null;\n                    for (var s = 0; s < descSelectors.length; s++) {\n                        descElement = document.querySelector(descSelectors[s]);\n                        if (descElement) break;\n                    }\n                    \n                    if (!descElement) {\n                        var allSpans = document.querySelectorAll('span');\n                        for (var s = 0; s < Math.min(allSpans.length, 200); s++) {\n                            var text = allSpans[s].textContent || \"\";\n                            if (text.indexOf(\"#\") !== -1 && text.length < 500 && text.length > 5) {\n                                descElement = allSpans[s];\n                                break;\n                            }\n                        }\n                    }\n                    \n                    if (!descElement) {\n                        var allDivs = document.querySelectorAll('div');\n                        for (var d = 0; d < Math.min(allDivs.length, 200); d++) {\n                            var text = allDivs[d].textContent || \"\";\n                            if (text.indexOf(\"#\") !== -1 && text.length < 500 && text.length > 5) {\n                                var parent = allDivs[d].parentElement;\n                                if (parent && parent.textContent && parent.textContent.length < 1000) {\n                                    descElement = parent;\n                                } else {\n                                    descElement = allDivs[d];\n                                }\n                                break;\n                            }\n                        }\n                    }\n                    \n                    if (!descElement) {\n                        var bodyText = document.body.textContent || \"\";\n                        var hashtagMatches = bodyText.match(/#[\\w]+/g);\n                        if (hashtagMatches && hashtagMatches.length > 0) {\n                            var uniqueHashtags = Array.from(new Set(hashtagMatches.map(function(h) { return h.substring(1); })));\n                            var genericTags = [\"tiktok\", \"fyp\", \"foryou\", \"foryoupage\", \"viral\", \"trending\", \"trend\", \"animals\", \"animalcare\", \"beauty\", \"comedyvideos\", \"dance\", \"food\", \"gaming\", \"sports\", \"entertainment\", \"funny\", \"comedy\", \"music\", \"love\", \"like\", \"follow\", \"share\", \"comment\"];\n                            uniqueHashtags = uniqueHashtags.filter(function(tag) {\n                                return genericTags.indexOf(tag.toLowerCase()) === -1;\n                            });\n                            if (uniqueHashtags.length > 0 && uniqueHashtags.length < 50) {\n                                result.hashtags = uniqueHashtags;\n                                debugInfo.foundHashtagsInDOM = true;\n                                debugInfo.descText = \"Found in body text (filtered)\";\n                            }\n                        }\n                    }\n                    \n                    if (descElement && !result.hashtags) {\n                        var descText = descElement.textContent || \"\";\n                        var descHashtags = (descText.match(/#[\\w]+/g) || [])\n                            .map(function(h) { return h.substring(1); });\n                        if (descHashtags.length > 0) {\n                            result.hashtags = descHashtags;\n                            debugInfo.foundHashtagsInDOM = true;\n                            debugInfo.descText = descText.substring(0, 100);\n                        }\n                    }\n                    \n                    debugInfo.descElementFound = descElement !== null;\n\n                    return {\n                        data: Object.keys(result).length > 0 ? result : null,\n                        debug: debugInfo\n                    };\n                })\n            ";
                        return [4 /*yield*/, page.evaluate(evalCode + "(".concat(JSON.stringify(videoId), ")"))];
                    case 1:
                        response_1 = _p.sent();
                        if (!response_1) {
                            response_1 = { data: {} };
                        }
                        else if (!response_1.data) {
                            response_1.data = {};
                        }
                        if (apiResponses && apiResponses.length > 0) {
                            this.logger.log("Found ".concat(apiResponses.length, " potential video data API responses"), "debug");
                            for (_i = 0, apiResponses_2 = apiResponses; _i < apiResponses_2.length; _i++) {
                                apiResp = apiResponses_2[_i];
                                this.logger.log("Processing API URL: ".concat(apiResp.url.substring(0, 150)), "debug");
                                dataKeys = apiResp.data ? Object.keys(apiResp.data).slice(0, 15) : [];
                                this.logger.log("API data keys: ".concat(dataKeys.join(", ")), "debug");
                                extractVideoData = function (videoData, source) {
                                    var _a, _b, _c, _d, _e, _f, _g, _h;
                                    if (!videoData || !(response_1 === null || response_1 === void 0 ? void 0 : response_1.data))
                                        return;
                                    var videoKeys = Object.keys(videoData);
                                    _this.logger.log("".concat(source, " video keys (first 50): ").concat(videoKeys.slice(0, 50).join(", ")), "debug");
                                    if (videoKeys.length > 50) {
                                        _this.logger.log("".concat(source, " video has ").concat(videoKeys.length, " total keys (showing first 50)"), "debug");
                                    }
                                    var hasEffectStickers = videoKeys.includes('effectStickers');
                                    if (hasEffectStickers) {
                                        _this.logger.log("".concat(source, " has effectStickers key"), "debug");
                                    }
                                    if (videoData.effectStickers) {
                                        _this.logger.log("".concat(source, " effectStickers type: ").concat(Array.isArray(videoData.effectStickers) ? 'array' : typeof videoData.effectStickers, ", length: ").concat(Array.isArray(videoData.effectStickers) ? videoData.effectStickers.length : 'N/A'), "debug");
                                        if (Array.isArray(videoData.effectStickers) && videoData.effectStickers.length > 0) {
                                            _this.logger.log("".concat(source, " effectStickers sample: ").concat(JSON.stringify(videoData.effectStickers[0])), "debug");
                                        }
                                    }
                                    else {
                                        _this.logger.log("".concat(source, " no effectStickers found (checked ").concat(videoKeys.length, " keys)"), "debug");
                                    }
                                    if (videoData.desc) {
                                        _this.logger.log("".concat(source, " desc preview: ").concat(String(videoData.desc).substring(0, 100)), "debug");
                                    }
                                    if (videoData.textExtra) {
                                        _this.logger.log("".concat(source, " textExtra type: ").concat(Array.isArray(videoData.textExtra) ? 'array' : typeof videoData.textExtra, ", length: ").concat(Array.isArray(videoData.textExtra) ? videoData.textExtra.length : 'N/A'), "debug");
                                    }
                                    if (videoData.challengeList) {
                                        _this.logger.log("".concat(source, " challengeList type: ").concat(Array.isArray(videoData.challengeList) ? 'array' : typeof videoData.challengeList, ", length: ").concat(Array.isArray(videoData.challengeList) ? videoData.challengeList.length : 'N/A'), "debug");
                                    }
                                    if (!response_1.data.caption && videoData.desc) {
                                        response_1.data.caption = String(videoData.desc);
                                        _this.logger.log("Extracted caption from ".concat(source, " (").concat(response_1.data.caption.length, " chars)"), "info");
                                    }
                                    if (!response_1.data.timestamp && videoData.createTime) {
                                        var createTime = typeof videoData.createTime === 'number' ? videoData.createTime : parseInt(String(videoData.createTime));
                                        if (!isNaN(createTime)) {
                                            response_1.data.timestamp = createTime;
                                            _this.logger.log("Extracted timestamp from ".concat(source, ": ").concat(createTime), "info");
                                        }
                                    }
                                    if (videoData.stats) {
                                        if (!response_1.data.like_count && (videoData.stats.diggCount !== undefined || videoData.stats.likeCount !== undefined)) {
                                            response_1.data.like_count = videoData.stats.diggCount || videoData.stats.likeCount || 0;
                                            _this.logger.log("Extracted like_count from ".concat(source, ": ").concat(response_1.data.like_count), "info");
                                        }
                                        if (!response_1.data.comment_count && videoData.stats.commentCount !== undefined) {
                                            response_1.data.comment_count = videoData.stats.commentCount || 0;
                                            _this.logger.log("Extracted comment_count from ".concat(source, ": ").concat(response_1.data.comment_count), "info");
                                        }
                                        if (!response_1.data.view_count && (videoData.stats.playCount !== undefined || videoData.stats.viewCount !== undefined)) {
                                            response_1.data.view_count = videoData.stats.playCount || videoData.stats.viewCount || 0;
                                            _this.logger.log("Extracted view_count from ".concat(source, ": ").concat(response_1.data.view_count), "info");
                                        }
                                        if (!response_1.data.play_count && videoData.stats.playCount !== undefined) {
                                            response_1.data.play_count = videoData.stats.playCount || 0;
                                            _this.logger.log("Extracted play_count from ".concat(source, ": ").concat(response_1.data.play_count), "info");
                                        }
                                        if (!response_1.data.share_count && videoData.stats.shareCount !== undefined) {
                                            response_1.data.share_count = videoData.stats.shareCount || 0;
                                            _this.logger.log("Extracted share_count from ".concat(source, ": ").concat(response_1.data.share_count), "info");
                                        }
                                    }
                                    if (videoData.statsV2) {
                                        if (!response_1.data.like_count && (videoData.statsV2.diggCount !== undefined || videoData.statsV2.likeCount !== undefined)) {
                                            response_1.data.like_count = videoData.statsV2.diggCount || videoData.statsV2.likeCount || 0;
                                            _this.logger.log("Extracted like_count from ".concat(source, " statsV2: ").concat(response_1.data.like_count), "info");
                                        }
                                        if (!response_1.data.comment_count && videoData.statsV2.commentCount !== undefined) {
                                            response_1.data.comment_count = videoData.statsV2.commentCount || 0;
                                            _this.logger.log("Extracted comment_count from ".concat(source, " statsV2: ").concat(response_1.data.comment_count), "info");
                                        }
                                        if (!response_1.data.view_count && (videoData.statsV2.playCount !== undefined || videoData.statsV2.viewCount !== undefined)) {
                                            response_1.data.view_count = videoData.statsV2.playCount || videoData.statsV2.viewCount || 0;
                                            _this.logger.log("Extracted view_count from ".concat(source, " statsV2: ").concat(response_1.data.view_count), "info");
                                        }
                                        if (!response_1.data.share_count && videoData.statsV2.shareCount !== undefined) {
                                            response_1.data.share_count = videoData.statsV2.shareCount || 0;
                                            _this.logger.log("Extracted share_count from ".concat(source, " statsV2: ").concat(response_1.data.share_count), "info");
                                        }
                                    }
                                    if (!response_1.data.duration && ((_a = videoData.video) === null || _a === void 0 ? void 0 : _a.duration)) {
                                        var duration = typeof videoData.video.duration === 'number' ? videoData.video.duration : parseInt(String(videoData.video.duration));
                                        if (!isNaN(duration) && duration > 0) {
                                            response_1.data.duration = duration;
                                            _this.logger.log("Extracted duration from ".concat(source, ": ").concat(duration, "s"), "info");
                                        }
                                    }
                                    if (!response_1.data.music_title && ((_b = videoData.music) === null || _b === void 0 ? void 0 : _b.title)) {
                                        response_1.data.music_title = String(videoData.music.title);
                                        _this.logger.log("Extracted music_title from ".concat(source, ": ").concat(response_1.data.music_title), "info");
                                    }
                                    if (!response_1.data.music_artist && ((_c = videoData.music) === null || _c === void 0 ? void 0 : _c.authorName)) {
                                        response_1.data.music_artist = String(videoData.music.authorName);
                                        _this.logger.log("Extracted music_artist from ".concat(source, ": ").concat(response_1.data.music_artist), "info");
                                    }
                                    if (!response_1.data.music_artist && ((_d = videoData.music) === null || _d === void 0 ? void 0 : _d.author)) {
                                        response_1.data.music_artist = String(videoData.music.author);
                                        _this.logger.log("Extracted music_artist from ".concat(source, " (author): ").concat(response_1.data.music_artist), "info");
                                    }
                                    if (!response_1.data.hashtags && videoData.desc) {
                                        var descText = String(videoData.desc);
                                        var hashtags = (descText.match(/#[\w\u4e00-\u9fff]+/g) || []).map(function (h) { return h.substring(1); });
                                        if (hashtags.length > 0) {
                                            var genericTags_1 = ["fyp", "foryou", "foryoupage", "viral", "trending", "trend", "fypシ", "fypage", "fy"];
                                            var filtered = hashtags.filter(function (tag) { return !genericTags_1.includes(tag.toLowerCase()); });
                                            if (filtered.length > 0) {
                                                response_1.data.hashtags = filtered;
                                                _this.logger.log("Extracted hashtags from ".concat(source, ": ").concat(filtered.join(", ")), "info");
                                            }
                                            else if (hashtags.length > 0) {
                                                response_1.data.hashtags = hashtags;
                                                _this.logger.log("Extracted hashtags from ".concat(source, " (all generic): ").concat(hashtags.join(", ")), "debug");
                                            }
                                        }
                                    }
                                    if (!response_1.data.hashtags && videoData.textExtra && Array.isArray(videoData.textExtra)) {
                                        var hashtags = videoData.textExtra
                                            .filter(function (item) { return item.hashtagName || item.hashtag; })
                                            .map(function (item) { return item.hashtagName || item.hashtag; })
                                            .filter(Boolean);
                                        if (hashtags.length > 0) {
                                            response_1.data.hashtags = hashtags;
                                            _this.logger.log("Extracted hashtags from ".concat(source, " textExtra: ").concat(hashtags.join(", ")), "info");
                                        }
                                    }
                                    if (!response_1.data.hashtags && videoData.challengeList && Array.isArray(videoData.challengeList)) {
                                        var hashtags = videoData.challengeList
                                            .map(function (c) { return c.title || c.challengeName || c.name; })
                                            .filter(Boolean);
                                        if (hashtags.length > 0) {
                                            response_1.data.hashtags = hashtags;
                                            _this.logger.log("Extracted hashtags from ".concat(source, " challengeList: ").concat(hashtags.join(", ")), "info");
                                        }
                                    }
                                    if (!response_1.data.music_id && videoData.music) {
                                        var musicId = videoData.music.id || videoData.music.musicId || videoData.musicId || ((_e = videoData.music) === null || _e === void 0 ? void 0 : _e.idStr);
                                        if (musicId) {
                                            response_1.data.music_id = String(musicId);
                                            _this.logger.log("Extracted music_id from ".concat(source, ": ").concat(musicId), "info");
                                        }
                                    }
                                    if (!response_1.data.effect_ids && videoData.effectStickers) {
                                        _this.logger.log("".concat(source, " has effectStickers, type: ").concat(typeof videoData.effectStickers, ", isArray: ").concat(Array.isArray(videoData.effectStickers)), "debug");
                                        var effects = [];
                                        if (Array.isArray(videoData.effectStickers)) {
                                            _this.logger.log("".concat(source, " effectStickers array length: ").concat(videoData.effectStickers.length), "debug");
                                            effects = videoData.effectStickers
                                                .map(function (e) {
                                                if (typeof e === 'string')
                                                    return e;
                                                if (typeof e === 'number')
                                                    return String(e);
                                                return (e === null || e === void 0 ? void 0 : e.ID) || (e === null || e === void 0 ? void 0 : e.id) || (e === null || e === void 0 ? void 0 : e.effectId) || (e === null || e === void 0 ? void 0 : e.effect_id) || (e === null || e === void 0 ? void 0 : e.stickerId) || (e === null || e === void 0 ? void 0 : e.sticker_id);
                                            })
                                                .filter(Boolean)
                                                .map(String);
                                            _this.logger.log("".concat(source, " extracted effect IDs: ").concat(effects.join(", ")), "debug");
                                        }
                                        else if (typeof videoData.effectStickers === 'object' && videoData.effectStickers !== null) {
                                            var effectObj = videoData.effectStickers;
                                            if (effectObj.ID)
                                                effects.push(String(effectObj.ID));
                                            if (effectObj.id)
                                                effects.push(String(effectObj.id));
                                            if (effectObj.effectId)
                                                effects.push(String(effectObj.effectId));
                                        }
                                        if (effects.length > 0) {
                                            response_1.data.effect_ids = effects;
                                            _this.logger.log("Extracted effect_ids from ".concat(source, ": ").concat(effects.join(", ")), "info");
                                        }
                                        else {
                                            _this.logger.log("".concat(source, " effectStickers exists but no IDs extracted"), "debug");
                                        }
                                    }
                                    if (!response_1.data.effect_ids && videoData.effectIds && Array.isArray(videoData.effectIds)) {
                                        response_1.data.effect_ids = videoData.effectIds.map(String);
                                        _this.logger.log("Extracted effect_ids from ".concat(source, " effectIds: ").concat((_f = response_1.data.effect_ids) === null || _f === void 0 ? void 0 : _f.join(", ")), "info");
                                    }
                                    if (!response_1.data.effect_ids && videoData.stickersOnItem && Array.isArray(videoData.stickersOnItem)) {
                                        var effects = videoData.stickersOnItem
                                            .map(function (s) { return s.stickerId || s.id || s.effectId; })
                                            .filter(Boolean)
                                            .map(String);
                                        if (effects.length > 0) {
                                            response_1.data.effect_ids = effects;
                                            _this.logger.log("Extracted effect_ids from ".concat(source, " stickersOnItem: ").concat(effects.join(", ")), "info");
                                        }
                                    }
                                    if (!response_1.data.playlist_id && videoData.playlistId) {
                                        response_1.data.playlist_id = String(videoData.playlistId);
                                        _this.logger.log("Extracted playlist_id from ".concat(source, ": ").concat(response_1.data.playlist_id), "info");
                                    }
                                    if (!response_1.data.playlist_id && videoData.playlist_id) {
                                        response_1.data.playlist_id = String(videoData.playlist_id);
                                        _this.logger.log("Extracted playlist_id from ".concat(source, " (playlist_id): ").concat(response_1.data.playlist_id), "info");
                                    }
                                    if (!response_1.data.playlist_id && ((_g = videoData.music) === null || _g === void 0 ? void 0 : _g.playlistId)) {
                                        response_1.data.playlist_id = String(videoData.music.playlistId);
                                        _this.logger.log("Extracted playlist_id from ".concat(source, " (music.playlistId): ").concat(response_1.data.playlist_id), "info");
                                    }
                                    if (!response_1.data.region_code && videoData.regionCode) {
                                        response_1.data.region_code = videoData.regionCode;
                                        _this.logger.log("Extracted region_code from ".concat(source, ": ").concat(response_1.data.region_code), "info");
                                    }
                                    if (!response_1.data.region_code && videoData.region) {
                                        response_1.data.region_code = videoData.region;
                                        _this.logger.log("Extracted region_code from ".concat(source, " (region): ").concat(response_1.data.region_code), "info");
                                    }
                                    if (!response_1.data.region_code && ((_h = videoData.video) === null || _h === void 0 ? void 0 : _h.region)) {
                                        response_1.data.region_code = videoData.video.region;
                                        _this.logger.log("Extracted region_code from ".concat(source, " (video.region): ").concat(response_1.data.region_code), "info");
                                    }
                                    if (!response_1.data.voice_to_text && videoData.transcription) {
                                        response_1.data.voice_to_text = videoData.transcription;
                                        _this.logger.log("Extracted voice_to_text from ".concat(source, " (").concat(videoData.transcription.length, " chars)"), "info");
                                    }
                                    if (!response_1.data.voice_to_text && videoData.voiceToText) {
                                        response_1.data.voice_to_text = videoData.voiceToText;
                                        _this.logger.log("Extracted voice_to_text from ".concat(source, " (").concat(videoData.voiceToText.length, " chars)"), "info");
                                    }
                                    if (!response_1.data.voice_to_text && videoData.subtitleInfos && Array.isArray(videoData.subtitleInfos)) {
                                        var subtitles = videoData.subtitleInfos
                                            .map(function (s) { return s.content || s.text || s.subtitle; })
                                            .filter(Boolean)
                                            .join(" ");
                                        if (subtitles) {
                                            response_1.data.voice_to_text = subtitles;
                                            _this.logger.log("Extracted voice_to_text from ".concat(source, " subtitleInfos (").concat(subtitles.length, " chars)"), "info");
                                        }
                                    }
                                    if (videoData.textExtra && Array.isArray(videoData.textExtra)) {
                                        var mentions = videoData.textExtra
                                            .filter(function (item) { return item.userUniqueId || item.userId || item.userUniqueId || item.type === 'user'; })
                                            .map(function (item) { return item.userUniqueId || item.userId || item.userName || item.nickname; })
                                            .filter(Boolean);
                                        if (mentions.length > 0 && !response_1.data.mentions) {
                                            response_1.data.mentions = mentions;
                                            _this.logger.log("Extracted mentions from ".concat(source, ": ").concat(mentions.join(", ")), "info");
                                        }
                                    }
                                    if (videoData.video) {
                                        if (!response_1.data.is_video && videoData.video.duration !== undefined) {
                                            response_1.data.is_video = true;
                                            _this.logger.log("Extracted is_video from ".concat(source, ": true"), "info");
                                        }
                                        var thumbnails = [];
                                        if (videoData.video.cover)
                                            thumbnails.push(String(videoData.video.cover));
                                        if (videoData.video.dynamicCover)
                                            thumbnails.push(String(videoData.video.dynamicCover));
                                        if (videoData.video.originCover)
                                            thumbnails.push(String(videoData.video.originCover));
                                        if (thumbnails.length > 0 && !response_1.data.thumbnails) {
                                            response_1.data.thumbnails = thumbnails;
                                            _this.logger.log("Extracted ".concat(thumbnails.length, " thumbnail(s) from ").concat(source), "info");
                                        }
                                        if (videoData.video.width && !response_1.data.dimension) {
                                            var width = typeof videoData.video.width === 'number' ? videoData.video.width : parseInt(String(videoData.video.width));
                                            var height = videoData.video.height ? (typeof videoData.video.height === 'number' ? videoData.video.height : parseInt(String(videoData.video.height))) : null;
                                            if (!isNaN(width)) {
                                                response_1.data.dimension = height && !isNaN(height) ? "".concat(width, "x").concat(height) : "".concat(width);
                                                _this.logger.log("Extracted dimension from ".concat(source, ": ").concat(response_1.data.dimension), "info");
                                            }
                                        }
                                    }
                                    if (!response_1.data.caption && videoData.title) {
                                        response_1.data.caption = String(videoData.title);
                                        _this.logger.log("Extracted title as caption from ".concat(source), "info");
                                    }
                                    if (videoData.collected !== undefined && !response_1.data.save_count) {
                                        response_1.data.save_count = videoData.collected ? 1 : 0;
                                        _this.logger.log("Extracted save_count (collected) from ".concat(source, ": ").concat(response_1.data.save_count), "info");
                                    }
                                    if (videoData.author) {
                                        if (videoData.author.openId && !response_1.data.creator_open_id) {
                                            response_1.data.creator_open_id = String(videoData.author.openId);
                                            _this.logger.log("Extracted creator_open_id from ".concat(source, ": ").concat(response_1.data.creator_open_id), "info");
                                        }
                                        if (videoData.author.unionId && !response_1.data.creator_union_id) {
                                            response_1.data.creator_union_id = String(videoData.author.unionId);
                                            _this.logger.log("Extracted creator_union_id from ".concat(source, ": ").concat(response_1.data.creator_union_id), "info");
                                        }
                                        if (videoData.author.avatarThumb && !response_1.data.creator_avatar_url_100) {
                                            response_1.data.creator_avatar_url_100 = String(videoData.author.avatarThumb);
                                            _this.logger.log("Extracted creator_avatar_url_100 from ".concat(source), "info");
                                        }
                                        if (videoData.author.avatarMedium && !response_1.data.creator_avatar_large_url) {
                                            response_1.data.creator_avatar_large_url = String(videoData.author.avatarMedium);
                                            _this.logger.log("Extracted creator_avatar_large_url from ".concat(source), "info");
                                        }
                                        if (videoData.author.avatarLarger && !response_1.data.creator_avatar_large_url) {
                                            response_1.data.creator_avatar_large_url = String(videoData.author.avatarLarger);
                                            _this.logger.log("Extracted creator_avatar_large_url from ".concat(source, " (avatarLarger)"), "info");
                                        }
                                        if (videoData.author.uniqueId && !response_1.data.creator_profile_deep_link) {
                                            response_1.data.creator_profile_deep_link = "https://www.tiktok.com/@".concat(videoData.author.uniqueId);
                                            _this.logger.log("Extracted creator_profile_deep_link from ".concat(source, ": ").concat(response_1.data.creator_profile_deep_link), "info");
                                        }
                                        if (videoData.authorStats) {
                                            if (videoData.authorStats.followingCount !== undefined && !response_1.data.creator_following_count) {
                                                response_1.data.creator_following_count = videoData.authorStats.followingCount;
                                                _this.logger.log("Extracted creator_following_count from ".concat(source, ": ").concat(response_1.data.creator_following_count), "info");
                                            }
                                            if (videoData.authorStats.heartCount !== undefined && !response_1.data.creator_likes_count) {
                                                response_1.data.creator_likes_count = videoData.authorStats.heartCount;
                                                _this.logger.log("Extracted creator_likes_count from ".concat(source, ": ").concat(response_1.data.creator_likes_count), "info");
                                            }
                                            if (videoData.authorStats.videoCount !== undefined && !response_1.data.creator_video_count) {
                                                response_1.data.creator_video_count = videoData.authorStats.videoCount;
                                                _this.logger.log("Extracted creator_video_count from ".concat(source, ": ").concat(response_1.data.creator_video_count), "info");
                                            }
                                        }
                                        if (videoData.authorStatsV2) {
                                            if (videoData.authorStatsV2.followingCount !== undefined && !response_1.data.creator_following_count) {
                                                response_1.data.creator_following_count = videoData.authorStatsV2.followingCount;
                                                _this.logger.log("Extracted creator_following_count from ".concat(source, " (V2): ").concat(response_1.data.creator_following_count), "info");
                                            }
                                            if (videoData.authorStatsV2.heartCount !== undefined && !response_1.data.creator_likes_count) {
                                                response_1.data.creator_likes_count = videoData.authorStatsV2.heartCount;
                                                _this.logger.log("Extracted creator_likes_count from ".concat(source, " (V2): ").concat(response_1.data.creator_likes_count), "info");
                                            }
                                            if (videoData.authorStatsV2.videoCount !== undefined && !response_1.data.creator_video_count) {
                                                response_1.data.creator_video_count = videoData.authorStatsV2.videoCount;
                                                _this.logger.log("Extracted creator_video_count from ".concat(source, " (V2): ").concat(response_1.data.creator_video_count), "info");
                                            }
                                        }
                                    }
                                    if (videoData.locationInfo || videoData.location) {
                                        var location_1 = videoData.locationInfo || videoData.location;
                                        if (location_1 && !response_1.data.location) {
                                            response_1.data.location = location_1.name || location_1.address || location_1.locationName || String(location_1);
                                            _this.logger.log("Extracted location from ".concat(source, ": ").concat(response_1.data.location), "info");
                                        }
                                        if ((location_1 === null || location_1 === void 0 ? void 0 : location_1.latitude) && !response_1.data.location_latitude) {
                                            response_1.data.location_latitude = typeof location_1.latitude === 'number' ? location_1.latitude : parseFloat(String(location_1.latitude));
                                            _this.logger.log("Extracted location_latitude from ".concat(source, ": ").concat(response_1.data.location_latitude), "info");
                                        }
                                        if ((location_1 === null || location_1 === void 0 ? void 0 : location_1.longitude) && !response_1.data.location_longitude) {
                                            response_1.data.location_longitude = typeof location_1.longitude === 'number' ? location_1.longitude : parseFloat(String(location_1.longitude));
                                            _this.logger.log("Extracted location_longitude from ".concat(source, ": ").concat(response_1.data.location_longitude), "info");
                                        }
                                    }
                                };
                                if ((_c = apiResp.data) === null || _c === void 0 ? void 0 : _c.itemList) {
                                    items = apiResp.data.itemList;
                                    if (Array.isArray(items) && items.length > 0) {
                                        video = items.find(function (item) {
                                            var _a, _b, _c, _d, _e, _f;
                                            return ((_a = item.itemInfo) === null || _a === void 0 ? void 0 : _a.itemId) === videoId ||
                                                ((_c = (_b = item.itemInfo) === null || _b === void 0 ? void 0 : _b.itemStruct) === null || _c === void 0 ? void 0 : _c.id) === videoId ||
                                                item.id === videoId ||
                                                ((_f = (_e = (_d = item.itemInfo) === null || _d === void 0 ? void 0 : _d.itemStruct) === null || _e === void 0 ? void 0 : _e.video) === null || _f === void 0 ? void 0 : _f.id) === videoId;
                                        }) || items[0];
                                        if ((_d = video === null || video === void 0 ? void 0 : video.itemInfo) === null || _d === void 0 ? void 0 : _d.itemStruct) {
                                            extractVideoData(video.itemInfo.itemStruct, "itemList.itemInfo.itemStruct");
                                        }
                                        else if (video === null || video === void 0 ? void 0 : video.itemStruct) {
                                            extractVideoData(video.itemStruct, "itemList.itemStruct");
                                        }
                                        else if (video) {
                                            extractVideoData(video, "itemList item");
                                        }
                                    }
                                }
                                if (((_e = apiResp.data) === null || _e === void 0 ? void 0 : _e.itemList) && Array.isArray(apiResp.data.itemList)) {
                                    for (_a = 0, _b = apiResp.data.itemList; _a < _b.length; _a++) {
                                        item = _b[_a];
                                        if (item && (item.id === videoId || ((_f = item.itemInfo) === null || _f === void 0 ? void 0 : _f.itemId) === videoId)) {
                                            if (item.effectStickers || item.music || item.desc || item.playlistId) {
                                                extractVideoData(item, "itemList direct");
                                            }
                                            if ((_g = item.itemInfo) === null || _g === void 0 ? void 0 : _g.itemStruct) {
                                                extractVideoData(item.itemInfo.itemStruct, "itemList.itemInfo.itemStruct");
                                            }
                                            break;
                                        }
                                    }
                                }
                                if ((_j = (_h = apiResp.data) === null || _h === void 0 ? void 0 : _h.itemInfo) === null || _j === void 0 ? void 0 : _j.itemStruct) {
                                    extractVideoData(apiResp.data.itemInfo.itemStruct, "itemInfo.itemStruct");
                                }
                                if ((_k = apiResp.data) === null || _k === void 0 ? void 0 : _k.aweme_detail) {
                                    extractVideoData(apiResp.data.aweme_detail, "aweme_detail");
                                }
                                if (((_l = apiResp.data) === null || _l === void 0 ? void 0 : _l.items) && Array.isArray(apiResp.data.items)) {
                                    video = apiResp.data.items.find(function (item) { return item.id === videoId; }) || apiResp.data.items[0];
                                    if (video) {
                                        extractVideoData(video, "items array");
                                    }
                                }
                                if ((_m = apiResp.data) === null || _m === void 0 ? void 0 : _m.item) {
                                    extractVideoData(apiResp.data.item, "item");
                                }
                                if (((_o = apiResp.data) === null || _o === void 0 ? void 0 : _o.keywordsByItemId) && videoId) {
                                    keywords = apiResp.data.keywordsByItemId[videoId];
                                    if (keywords && Array.isArray(keywords) && keywords.length > 0 && (response_1 === null || response_1 === void 0 ? void 0 : response_1.data) && !response_1.data.hashtags) {
                                        response_1.data.hashtags = keywords.map(function (k) { return typeof k === 'string' ? k : k.keyword || k.name || k; }).filter(Boolean);
                                        this.logger.log("Extracted hashtags from SEO keywords: ".concat(response_1.data.hashtags.join(", ")), "debug");
                                    }
                                }
                            }
                        }
                        return [4 /*yield*/, page.evaluate(function (vidId) {
                                var result = {};
                                try {
                                    var win = window;
                                    if (win.__UNIVERSAL_DATA_FOR_REHYDRATION__) {
                                        result.hasUniversalData = true;
                                        try {
                                            var data = win.__UNIVERSAL_DATA_FOR_REHYDRATION__;
                                            var state = data.defaultScope || data;
                                            if (state && (state.ItemModule || state.itemModule)) {
                                                var itemModule = state.ItemModule || state.itemModule;
                                                var video = itemModule && itemModule[vidId] || (itemModule && Object.values(itemModule)[0]);
                                                if (video) {
                                                    result.foundVideoInUniversal = true;
                                                    result.videoKeys = Object.keys(video).slice(0, 30);
                                                    if (video.desc) {
                                                        var hashtags = (video.desc.match(/#\w+/g) || []).map(function (h) { return h.substring(1); });
                                                        if (hashtags.length > 0) {
                                                            result.hashtags = hashtags;
                                                        }
                                                    }
                                                    if (video.music && video.music.id) {
                                                        result.music_id = String(video.music.id);
                                                    }
                                                }
                                            }
                                        }
                                        catch (e) {
                                            result.universalError = String(e);
                                        }
                                    }
                                    if (win.__$UNIVERSAL_DATA$__) {
                                        result.hasUniversalDataDollar = true;
                                    }
                                    if (win.SIGI_STATE) {
                                        result.hasSIGI = true;
                                    }
                                    result.windowKeys = Object.keys(win).filter(function (k) { return k.startsWith('__') || k.includes('DATA') || k.includes('STATE'); }).slice(0, 20);
                                }
                                catch (e) {
                                    result.error = String(e);
                                }
                                return result;
                            }, videoId || "")];
                    case 2:
                        windowData = _p.sent();
                        if (windowData.foundVideoInUniversal) {
                            this.logger.log("Found video in __UNIVERSAL_DATA_FOR_REHYDRATION__", "debug");
                            if (windowData.videoKeys) {
                                this.logger.log("Video keys: ".concat(windowData.videoKeys.join(", ")), "debug");
                            }
                            if (windowData.hashtags && (response_1 === null || response_1 === void 0 ? void 0 : response_1.data)) {
                                response_1.data.hashtags = windowData.hashtags;
                                this.logger.log("Extracted hashtags from window: ".concat(windowData.hashtags.join(", ")), "debug");
                            }
                            if (windowData.music_id && (response_1 === null || response_1 === void 0 ? void 0 : response_1.data)) {
                                response_1.data.music_id = windowData.music_id;
                                this.logger.log("Extracted music_id from window: ".concat(windowData.music_id), "debug");
                            }
                        }
                        if (windowData.windowKeys && windowData.windowKeys.length > 0) {
                            this.logger.log("Window objects found: ".concat(windowData.windowKeys.join(", ")), "debug");
                        }
                        if (response_1 && response_1.debug) {
                            this.logger.log("SIGI_STATE debug - Found SIGI: ".concat(response_1.debug.foundSIGI, ", Found Video: ").concat(response_1.debug.foundVideo), "debug");
                            this.logger.log("Script count: ".concat(response_1.debug.scriptCount || 0), "debug");
                            if (response_1.debug.scriptIds && response_1.debug.scriptIds.length > 0) {
                                this.logger.log("Script IDs found: ".concat(response_1.debug.scriptIds.join(", ")), "debug");
                            }
                            if (response_1.debug.searchText) {
                                this.logger.log(response_1.debug.searchText, "debug");
                            }
                            if (response_1.debug.sigiTopLevelKeys && response_1.debug.sigiTopLevelKeys.length > 0) {
                                this.logger.log("SIGI top-level keys: ".concat(response_1.debug.sigiTopLevelKeys.join(", ")), "debug");
                            }
                            if (response_1.debug.itemModuleKeys && response_1.debug.itemModuleKeys.length > 0) {
                                this.logger.log("ItemModule keys (first 10): ".concat(response_1.debug.itemModuleKeys.join(", ")), "debug");
                            }
                            if (response_1.debug.videoKeys && response_1.debug.videoKeys.length > 0) {
                                this.logger.log("Video object keys (first 50): ".concat(response_1.debug.videoKeys.join(", ")), "debug");
                            }
                            if (response_1.debug.descElementFound !== undefined) {
                                this.logger.log("Description element found: ".concat(response_1.debug.descElementFound), "debug");
                            }
                            if (response_1.debug.foundHashtagsInDOM) {
                                this.logger.log("Found hashtags in DOM: ".concat(response_1.debug.descText), "debug");
                            }
                        }
                        if (response_1 === null || response_1 === void 0 ? void 0 : response_1.data) {
                            extractedKeys = Object.keys(response_1.data);
                            this.logger.log("Final extracted data keys: ".concat(extractedKeys.join(", ")), "debug");
                            if (response_1.data.effect_ids) {
                                this.logger.log("Effect IDs in response.data: ".concat(Array.isArray(response_1.data.effect_ids) ? response_1.data.effect_ids.join(", ") : response_1.data.effect_ids), "info");
                            }
                            if (response_1.data.hashtags) {
                                this.logger.log("Hashtags in response.data: ".concat(Array.isArray(response_1.data.hashtags) ? response_1.data.hashtags.join(", ") : response_1.data.hashtags), "info");
                            }
                        }
                        return [2 /*return*/, (response_1 === null || response_1 === void 0 ? void 0 : response_1.data) || null];
                    case 3:
                        error_3 = _p.sent();
                        this.logger.log("Failed to extract embedded TikTok data: ".concat(error_3), "debug");
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TikTokScraper.prototype.extractTikTokDOMData = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var evalCode, data, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        evalCode = "\n                (function() {\n                    var result = {};\n                    var debug = [];\n\n                    function logDebug(msg) {\n                        debug.push(msg);\n                    }\n\n                    var descSelectors = [\n                        '[data-e2e=\"browse-video-desc\"]',\n                        '[data-e2e=\"video-desc\"]',\n                        '[data-e2e=\"video-desc-text\"]',\n                        'h1[data-e2e=\"browse-video-desc\"]',\n                        '[class*=\"desc\"]',\n                        '[class*=\"Description\"]',\n                        'span[class*=\"desc\"]',\n                        'div[class*=\"desc\"]',\n                        '[class*=\"video-desc\"]',\n                        '[class*=\"VideoDesc\"]'\n                    ];\n\n                    var captionText = \"\";\n                    var descElement = null;\n                    \n                    for (var i = 0; i < descSelectors.length; i++) {\n                        var selector = descSelectors[i];\n                        descElement = document.querySelector(selector);\n                        if (descElement) {\n                            captionText = descElement.textContent || \"\";\n                            if (captionText && captionText.length > 0) {\n                                logDebug(\"Found description with selector: \" + selector + \", length: \" + captionText.length);\n                                break;\n                            }\n                        }\n                    }\n\n                    if (!captionText) {\n                        var allSpans = Array.from(document.querySelectorAll('span, div, p, h1, h2, h3, h4'));\n                        for (var j = 0; j < Math.min(allSpans.length, 200); j++) {\n                            var el = allSpans[j];\n                            var text = el.textContent || \"\";\n                            if (text.indexOf(\"#\") !== -1 && text.length > 5 && text.length < 1000) {\n                                var parent = el.closest('[class*=\"desc\"], [class*=\"video\"], [class*=\"caption\"], [data-e2e*=\"desc\"], [data-e2e*=\"video\"], [data-e2e*=\"caption\"]');\n                                if (parent) {\n                                    captionText = parent.textContent || text;\n                                    descElement = parent;\n                                    logDebug(\"Found description in parent element, length: \" + captionText.length);\n                                    break;\n                                } else if (text.length > 10 && text.length < 500) {\n                                    captionText = text;\n                                    descElement = el;\n                                    logDebug(\"Found description directly in element, length: \" + captionText.length);\n                                    break;\n                                }\n                            }\n                        }\n                    }\n                    \n                    if (!captionText) {\n                        var bodyText = document.body.textContent || \"\";\n                        var lines = bodyText.split(\"\\n\");\n                        for (var l = 0; l < lines.length; l++) {\n                            var line = lines[l].trim();\n                            if (line.indexOf(\"#\") !== -1 && line.length > 5 && line.length < 500 && line.split(\"#\").length > 1) {\n                                var hashtagCount = (line.match(/#/g) || []).length;\n                                if (hashtagCount >= 1 && hashtagCount <= 20) {\n                                    captionText = line;\n                                    logDebug(\"Found description in body text line, length: \" + captionText.length);\n                                    break;\n                                }\n                            }\n                        }\n                    }\n\n                    if (captionText) {\n                        var captionHashtags = captionText.match(/#[\\w\\u4e00-\\u9fff]+/g);\n                        if (captionHashtags && captionHashtags.length > 0) {\n                            var extracted = captionHashtags.map(function(h) { return h.substring(1); }).filter(function(h) { return h.length > 0 && h.length < 100; });\n                            var genericTags = [\"fyp\", \"foryou\", \"foryoupage\", \"viral\", \"trending\", \"trend\", \"fyp\u30B7\", \"fypage\", \"fy\", \"fyp\u30B7\u309Aviral\", \"viralvideos\", \"viralvideo\", \"trendingnow\", \"trendingvideos\"];\n                            extracted = extracted.filter(function(tag) {\n                                return genericTags.indexOf(tag.toLowerCase()) === -1;\n                            });\n                            if (extracted.length > 0) {\n                                result.hashtags = Array.from(new Set(extracted));\n                                logDebug(\"Extracted \" + result.hashtags.length + \" hashtags from description: \" + extracted.join(\", \"));\n                            } else {\n                                logDebug(\"Found hashtags in description but all were filtered as generic\");\n                            }\n                        } else {\n                            logDebug(\"Description found but no hashtags in it: \" + captionText.substring(0, 100));\n                        }\n                        result.caption = captionText.substring(0, 500);\n                    }\n                    \n                    if (!result.hashtags || result.hashtags.length === 0) {\n                        var videoContainer = document.querySelector('[class*=\"video\"], [class*=\"Video\"], [data-e2e*=\"video\"], [class*=\"player\"], [class*=\"Player\"]');\n                        if (videoContainer) {\n                            var containerText = videoContainer.textContent || \"\";\n                            var containerHashtags = containerText.match(/#[\\w\\u4e00-\\u9fff]+/g);\n                            if (containerHashtags && containerHashtags.length > 0) {\n                                var extracted = containerHashtags.map(function(h) { return h.substring(1); }).filter(function(h) { return h.length > 0 && h.length < 100; });\n                                var genericTags = [\"fyp\", \"foryou\", \"foryoupage\", \"viral\", \"trending\", \"trend\", \"fyp\u30B7\", \"fypage\", \"fy\"];\n                                extracted = extracted.filter(function(tag) {\n                                    return genericTags.indexOf(tag.toLowerCase()) === -1;\n                                });\n                                if (extracted.length > 0 && extracted.length <= 30) {\n                                    result.hashtags = Array.from(new Set(extracted));\n                                    logDebug(\"Extracted \" + result.hashtags.length + \" hashtags from video container\");\n                                }\n                            }\n                        }\n                    }\n                    \n                    if (!result.hashtags || result.hashtags.length === 0) {\n                        var mainContent = document.querySelector('[class*=\"video\"], [class*=\"Video\"], [data-e2e*=\"video\"], main, article') || document.body;\n                        var mainText = mainContent.textContent || \"\";\n                        var allHashtags = mainText.match(/#[\\w\\u4e00-\\u9fff]+/g);\n                        if (allHashtags && allHashtags.length > 0) {\n                            var extracted = allHashtags.map(function(h) { return h.substring(1); }).filter(function(h) { return h.length > 0 && h.length < 100; });\n                            var genericTags = [\"fyp\", \"foryou\", \"foryoupage\", \"viral\", \"trending\", \"trend\", \"fyp\u30B7\", \"fypage\", \"fy\", \"fyp\u30B7\u309Aviral\", \"viralvideos\", \"viralvideo\", \"trendingnow\", \"trendingvideos\", \"tiktok\", \"tiktokviral\", \"tiktoktrending\", \"explore\", \"discover\"];\n                            extracted = extracted.filter(function(tag) {\n                                return genericTags.indexOf(tag.toLowerCase()) === -1;\n                            });\n                            if (extracted.length > 0 && extracted.length <= 30) {\n                                result.hashtags = Array.from(new Set(extracted));\n                                logDebug(\"Extracted \" + result.hashtags.length + \" hashtags from main content\");\n                            }\n                        }\n                    }\n                    \n                    if (!result.hashtags || result.hashtags.length === 0) {\n                        var linkElements = document.querySelectorAll('a[href*=\"/tag/\"], a[href*=\"/challenge/\"], a[href*=\"/hashtag/\"]');\n                        var linkHashtags = [];\n                        for (var q = 0; q < Math.min(linkElements.length, 50); q++) {\n                            var link = linkElements[q];\n                            var href = link.getAttribute(\"href\") || \"\";\n                            var linkText = link.textContent || \"\";\n                            var match = href.match(/[\\/](tag|challenge|hashtag)[\\/]([^\\/\\?#]+)/i);\n                            if (match && match[2]) {\n                                linkHashtags.push(match[2].trim());\n                            } else if (linkText && linkText.indexOf(\"#\") === 0) {\n                                linkHashtags.push(linkText.substring(1).trim());\n                            }\n                        }\n                        if (linkHashtags.length > 0) {\n                            var uniqueLinkHashtags = Array.from(new Set(linkHashtags.filter(function(h) { return h.length > 0 && h.length < 100; })));\n                            if (uniqueLinkHashtags.length > 0 && uniqueLinkHashtags.length <= 30) {\n                                result.hashtags = uniqueLinkHashtags;\n                                logDebug(\"Extracted \" + result.hashtags.length + \" hashtags from link elements\");\n                            }\n                        }\n                    }\n\n                    var hashtagSelectors = [\n                        '[data-e2e=\"challenge-item\"]',\n                        '[data-e2e=\"challenge-list\"] a',\n                        '[data-e2e=\"challenge\"]',\n                        '[data-e2e*=\"challenge\"]',\n                        '[data-e2e*=\"hashtag\"]',\n                        '[data-e2e*=\"tag\"]',\n                        '.hashtag',\n                        '[href*=\"/tag/\"]',\n                        '[href*=\"/challenge/\"]',\n                        '[href*=\"/hashtag/\"]',\n                        'a[href*=\"hashtag\"]',\n                        'a[href*=\"/tag/\"]',\n                        'a[href*=\"/challenge/\"]',\n                        '[class*=\"hashtag\"]',\n                        '[class*=\"challenge\"]',\n                        '[class*=\"Tag\"]',\n                        '[class*=\"Hashtag\"]',\n                        '[class*=\"Challenge\"]',\n                        'span[class*=\"hashtag\"]',\n                        'div[class*=\"hashtag\"]',\n                        'a[class*=\"hashtag\"]'\n                    ];\n\n                    var hashtags = [];\n                    for (var k = 0; k < hashtagSelectors.length; k++) {\n                        var sel = hashtagSelectors[k];\n                        var elements = document.querySelectorAll(sel);\n                        logDebug(\"Selector \" + sel + \" found \" + elements.length + \" elements\");\n                        for (var m = 0; m < elements.length; m++) {\n                            var el = elements[m];\n                            var text = (el.textContent || \"\").trim();\n                            var href = el.getAttribute(\"href\") || \"\";\n                            \n                            if (text) {\n                                if (text.indexOf(\"#\") === 0) {\n                                    hashtags.push(text.substring(1).trim());\n                                } else if (text.length > 0 && text.length < 50 && text.indexOf(\" \") === -1 && text.indexOf(\"\\n\") === -1) {\n                                    hashtags.push(text.trim());\n                                }\n                            }\n                            \n                            if (href) {\n                                var match = href.match(/[#\\/](tag|challenge|hashtag)[\\/#]([^\\/\\?#]+)/i);\n                                if (match && match[2]) {\n                                    hashtags.push(match[2].trim());\n                                }\n                            }\n                        }\n                    }\n\n                    if (hashtags.length > 0) {\n                        var uniqueHashtags = Array.from(new Set(hashtags.filter(function(h) { return h.length > 0 && h.length < 50; })));\n                        if (result.hashtags) {\n                            result.hashtags = Array.from(new Set(result.hashtags.concat(uniqueHashtags)));\n                        } else {\n                            result.hashtags = uniqueHashtags;\n                        }\n                        logDebug(\"Total unique hashtags: \" + result.hashtags.length);\n                    }\n\n                    var musicSelectors = [\n                        '[data-e2e=\"browse-music\"]',\n                        '[data-e2e=\"music\"]',\n                        '[class*=\"music\"]',\n                        '[class*=\"Music\"]',\n                        '[class*=\"sound\"]',\n                        '[class*=\"Sound\"]',\n                        'a[href*=\"/music/\"]',\n                        'a[href*=\"/sound/\"]'\n                    ];\n\n                    for (var n = 0; n < musicSelectors.length; n++) {\n                        var musicSel = musicSelectors[n];\n                        var musicEl = document.querySelector(musicSel);\n                        if (musicEl) {\n                            var musicText = musicEl.textContent || \"\";\n                            var musicHref = musicEl.getAttribute(\"href\") || \"\";\n                            \n                            if (musicHref) {\n                                var musicMatch = musicHref.match(/[\\/](music|sound)[\\/]([^\\/\\?#]+)/i);\n                                if (musicMatch && musicMatch[2]) {\n                                    var musicIdStr = musicMatch[2];\n                                    musicIdStr = musicIdStr.replace(/^(original-sound-|som-original-)/i, \"\");\n                                    var numericMatch = musicIdStr.match(/\\d+/);\n                                    if (numericMatch) {\n                                        result.music_id = numericMatch[0];\n                                    } else {\n                                        result.music_id = musicIdStr;\n                                    }\n                                    logDebug(\"Found music ID from href: \" + result.music_id);\n                                    break;\n                                }\n                            }\n                            \n                            if (musicText && musicText.length < 100) {\n                                var dataId = musicEl.getAttribute(\"data-id\") || musicEl.getAttribute(\"data-music-id\");\n                                if (dataId) {\n                                    result.music_id = dataId;\n                                    logDebug(\"Found music ID from data attribute: \" + result.music_id);\n                                    break;\n                                }\n                            }\n                        }\n                    }\n\n                    var embedSelectors = [\n                        '[data-e2e=\"embed-button\"]',\n                        'a[href*=\"/embed/\"]',\n                        'button[aria-label*=\"embed\" i]',\n                        'button[aria-label*=\"Embed\" i]',\n                        '[class*=\"embed\"]',\n                        '[class*=\"Embed\"]'\n                    ];\n\n                    for (var p = 0; p < embedSelectors.length; p++) {\n                        var embedSel = embedSelectors[p];\n                        var embedButton = document.querySelector(embedSel);\n                        if (embedButton) {\n                            var embedHref = embedButton.getAttribute(\"href\");\n                            if (embedHref) {\n                                result.embed_link = embedHref.indexOf(\"http\") === 0 ? embedHref : \"https://www.tiktok.com\" + embedHref;\n                                logDebug(\"Found embed link: \" + result.embed_link);\n                                break;\n                            }\n                        }\n                    }\n\n                    logDebug(\"Total result keys: \" + Object.keys(result).length);\n                    logDebug(\"Has hashtags: \" + !!result.hashtags + \", Has music_id: \" + !!result.music_id + \", Has embed_link: \" + !!result.embed_link + \", Has caption: \" + !!result.caption);\n                    \n                    if (debug.length > 0) {\n                        result.debug = debug;\n                    }\n                    \n                    return result;\n                })\n            ";
                        return [4 /*yield*/, page.evaluate(evalCode + "()")];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            if (data.debug) {
                                data.debug.forEach(function (log) { return _this.logger.log("[DOM Debug] ".concat(log), "debug"); });
                                delete data.debug;
                            }
                            if (Object.keys(data).length === 0) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, data];
                        }
                        return [2 /*return*/, null];
                    case 2:
                        error_4 = _a.sent();
                        this.logger.log("Failed to extract DOM TikTok data: ".concat(error_4), "debug");
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TikTokScraper;
}(CreatorMetadataScraper_js_1.CreatorMetadataScraper));
exports.TikTokScraper = TikTokScraper;
