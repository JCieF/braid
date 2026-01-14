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
exports.InstagramScraper = void 0;
var CreatorMetadataScraper_js_1 = require("./CreatorMetadataScraper.js");
var InstagramScraper = /** @class */ (function (_super) {
    __extends(InstagramScraper, _super);
    function InstagramScraper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InstagramScraper.prototype.getCreatorProfileUrl = function (videoUrl) {
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
    InstagramScraper.prototype.extractMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var username, profileUrl, urlMatch, usernameFromLink, postUsername, _a, pageContent, metadata, nameData, bioData, followerData, avatarData, verifiedSelectors, _i, verifiedSelectors_1, selector, verified, _b, verified, _c, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 31, , 32]);
                        this.logger.log("Extracting Instagram creator metadata...", "info");
                        return [4 /*yield*/, page.goto(videoUrl, { waitUntil: "networkidle" })];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 2:
                        _d.sent();
                        username = null;
                        profileUrl = null;
                        urlMatch = videoUrl.match(/instagram\.com\/([^\/\?]+)/);
                        if (!(urlMatch && !urlMatch[1].includes('p/') && !urlMatch[1].includes('reel/'))) return [3 /*break*/, 3];
                        username = urlMatch[1];
                        profileUrl = "https://www.instagram.com/".concat(username, "/");
                        return [3 /*break*/, 7];
                    case 3: return [4 /*yield*/, page.evaluate(function () {
                            var links = document.querySelectorAll('a[href^="/"]');
                            for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
                                var link = links_1[_i];
                                var href = link.getAttribute('href');
                                if (href && href.match(/^\/[^\/]+\/$/) && !href.includes('/p/') && !href.includes('/reel/') && !href.includes('/stories/')) {
                                    return href.replace(/\//g, '');
                                }
                            }
                            return null;
                        })];
                    case 4:
                        usernameFromLink = _d.sent();
                        if (!usernameFromLink) return [3 /*break*/, 5];
                        username = usernameFromLink;
                        profileUrl = "https://www.instagram.com/".concat(username, "/");
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, page.evaluate(function () {
                            var header = document.querySelector('header');
                            if (header) {
                                var link = header.querySelector('a[href^="/"]');
                                if (link) {
                                    var href = link.getAttribute('href');
                                    if (href && !href.includes('/p/') && !href.includes('/reel/')) {
                                        return href.replace(/\//g, '');
                                    }
                                }
                            }
                            return null;
                        })];
                    case 6:
                        postUsername = _d.sent();
                        if (postUsername) {
                            username = postUsername;
                            profileUrl = "https://www.instagram.com/".concat(username, "/");
                        }
                        _d.label = 7;
                    case 7:
                        if (!username || !profileUrl) {
                            this.logger.log("Could not find Instagram username", "warn");
                            return [2 /*return*/, null];
                        }
                        this.logger.log("Found username: ".concat(username), "debug");
                        if (!!page.url().includes('instagram.com')) return [3 /*break*/, 9];
                        this.logger.log("Waiting for manual login if needed...", "info");
                        return [4 /*yield*/, this.delay(10000)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [4 /*yield*/, page.goto(profileUrl, { waitUntil: "networkidle" })];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, this.delay(5000)];
                    case 11:
                        _d.sent();
                        _d.label = 12;
                    case 12:
                        _d.trys.push([12, 14, , 15]);
                        return [4 /*yield*/, page.waitForSelector('header, main, article', { timeout: 5000 })];
                    case 13:
                        _d.sent();
                        return [3 /*break*/, 15];
                    case 14:
                        _a = _d.sent();
                        return [3 /*break*/, 15];
                    case 15: return [4 /*yield*/, page.evaluate(function () {
                            return document.body.innerText || document.body.textContent || '';
                        })];
                    case 16:
                        pageContent = _d.sent();
                        if (pageContent.includes('Log in') || pageContent.includes('Sign up')) {
                            this.logger.log("Instagram may require login to view profile details", "warn");
                        }
                        metadata = {
                            platform: "instagram",
                            url: profileUrl,
                            creator_username: username,
                            creator_id: username,
                            extractedAt: Date.now(),
                        };
                        return [4 /*yield*/, page.evaluate(function () {
                                var header = document.querySelector('header');
                                if (header) {
                                    var h2 = header.querySelector('h2');
                                    if (h2) {
                                        var text = h2.textContent || '';
                                        if (text && !text.includes('Sign up') && !text.includes('Log in')) {
                                            return text;
                                        }
                                    }
                                    var spans = header.querySelectorAll('span');
                                    for (var _i = 0, spans_1 = spans; _i < spans_1.length; _i++) {
                                        var span = spans_1[_i];
                                        var text = span.textContent || '';
                                        if (text && text.length > 0 && text.length < 100 && !text.includes('followers') && !text.includes('following') && !text.includes('posts') && !text.includes('Sign up') && !text.includes('Log in')) {
                                            return text;
                                        }
                                    }
                                }
                                return null;
                            })];
                    case 17:
                        nameData = _d.sent();
                        if (nameData) {
                            metadata.creator_name = this.cleanText(nameData);
                        }
                        return [4 /*yield*/, page.evaluate(function () {
                                var header = document.querySelector('header');
                                if (header) {
                                    var sections = header.querySelectorAll('section, div');
                                    for (var _i = 0, sections_1 = sections; _i < sections_1.length; _i++) {
                                        var section = sections_1[_i];
                                        var spans = section.querySelectorAll('span');
                                        for (var _a = 0, spans_2 = spans; _a < spans_2.length; _a++) {
                                            var span = spans_2[_a];
                                            var text = span.textContent || '';
                                            if (text && text.length > 20 && !text.includes('followers') && !text.includes('following') && !text.includes('posts') && !text.includes('Sign up') && !text.includes('Log in')) {
                                                return text;
                                            }
                                        }
                                    }
                                }
                                return null;
                            })];
                    case 18:
                        bioData = _d.sent();
                        if (bioData) {
                            metadata.creator_bio = this.cleanText(bioData);
                        }
                        return [4 /*yield*/, page.evaluate(function () {
                                var links = document.querySelectorAll('a');
                                for (var _i = 0, links_2 = links; _i < links_2.length; _i++) {
                                    var link = links_2[_i];
                                    var href = link.getAttribute('href');
                                    var text = (link.textContent || '').trim();
                                    if (href && (href.includes('/followers/') || href.includes('followers')) && /[\d.,]+[KMB]?/.test(text)) {
                                        return text;
                                    }
                                }
                                var header = document.querySelector('header');
                                if (header) {
                                    var allText = header.textContent || '';
                                    var followerMatch = allText.match(/([\d.,]+[KMB]?)\s*followers?/i);
                                    if (followerMatch) {
                                        return followerMatch[1] + ' followers';
                                    }
                                }
                                return null;
                            })];
                    case 19:
                        followerData = _d.sent();
                        if (followerData) {
                            metadata.creator_follower_count = this.parseCount(followerData);
                        }
                        return [4 /*yield*/, page.evaluate(function () {
                                var header = document.querySelector('header');
                                if (header) {
                                    var images = header.querySelectorAll('img');
                                    for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
                                        var img = images_1[_i];
                                        var src = img.src || img.getAttribute('src');
                                        var alt = img.getAttribute('alt') || '';
                                        if (src && (src.includes('instagram.com') || src.includes('fbcdn.net')) && (alt.includes('profile') || alt.includes('Profile'))) {
                                            return src;
                                        }
                                    }
                                }
                                var profileImages = document.querySelectorAll('img[alt*="profile"], img[alt*="Profile"]');
                                for (var _a = 0, profileImages_1 = profileImages; _a < profileImages_1.length; _a++) {
                                    var img = profileImages_1[_a];
                                    var imgElement = img;
                                    var src = imgElement.src || img.getAttribute('src');
                                    if (src && (src.includes('instagram.com') || src.includes('fbcdn.net'))) {
                                        return src;
                                    }
                                }
                                return null;
                            })];
                    case 20:
                        avatarData = _d.sent();
                        if (avatarData) {
                            metadata.creator_avatar_url = avatarData;
                        }
                        verifiedSelectors = [
                            '[aria-label*="Verified"]',
                            '[aria-label*="verified"]',
                            'svg[aria-label*="Verified"]',
                            'svg[aria-label*="verified"]',
                            '[title*="Verified"]'
                        ];
                        _i = 0, verifiedSelectors_1 = verifiedSelectors;
                        _d.label = 21;
                    case 21:
                        if (!(_i < verifiedSelectors_1.length)) return [3 /*break*/, 26];
                        selector = verifiedSelectors_1[_i];
                        _d.label = 22;
                    case 22:
                        _d.trys.push([22, 24, , 25]);
                        verified = page.locator(selector).first();
                        return [4 /*yield*/, verified.isVisible({ timeout: 2000 }).catch(function () { return false; })];
                    case 23:
                        if (_d.sent()) {
                            metadata.creator_verified = true;
                            return [3 /*break*/, 26];
                        }
                        return [3 /*break*/, 25];
                    case 24:
                        _b = _d.sent();
                        return [3 /*break*/, 25];
                    case 25:
                        _i++;
                        return [3 /*break*/, 21];
                    case 26:
                        if (!!metadata.creator_verified) return [3 /*break*/, 30];
                        _d.label = 27;
                    case 27:
                        _d.trys.push([27, 29, , 30]);
                        return [4 /*yield*/, page.evaluate(function () {
                                var elements = document.querySelectorAll('*');
                                for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                                    var el = elements_1[_i];
                                    var ariaLabel = el.getAttribute('aria-label');
                                    var title = el.getAttribute('title');
                                    if ((ariaLabel && ariaLabel.toLowerCase().includes('verified')) ||
                                        (title && title.toLowerCase().includes('verified'))) {
                                        return true;
                                    }
                                }
                                return false;
                            })];
                    case 28:
                        verified = _d.sent();
                        if (verified) {
                            metadata.creator_verified = true;
                        }
                        return [3 /*break*/, 30];
                    case 29:
                        _c = _d.sent();
                        return [3 /*break*/, 30];
                    case 30:
                        this.logger.log("Successfully extracted Instagram creator metadata", "info");
                        return [2 /*return*/, metadata];
                    case 31:
                        error_1 = _d.sent();
                        this.logger.log("Failed to extract Instagram metadata: ".concat(error_1), "error");
                        return [2 /*return*/, null];
                    case 32: return [2 /*return*/];
                }
            });
        });
    };
    InstagramScraper.prototype.extractVideoMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, shortcodeMatch, embeddedData, domData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        this.logger.log("Extracting Instagram video metadata...", "info");
                        return [4 /*yield*/, page.goto(videoUrl, { waitUntil: "networkidle" })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 2:
                        _a.sent();
                        metadata = {
                            platform: "instagram",
                            url: videoUrl,
                            extractedAt: Date.now(),
                        };
                        shortcodeMatch = videoUrl.match(/instagram\.com\/(?:p|reel)\/([^\/\?]+)/);
                        if (shortcodeMatch) {
                            metadata.shortcode = shortcodeMatch[1];
                            metadata.video_id = shortcodeMatch[1];
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
                            if (embeddedData.play_count !== undefined)
                                metadata.play_count = embeddedData.play_count;
                            if (embeddedData.timestamp !== undefined)
                                metadata.timestamp = embeddedData.timestamp;
                            if (embeddedData.caption)
                                metadata.caption = embeddedData.caption;
                            if (embeddedData.hashtags)
                                metadata.hashtags = embeddedData.hashtags;
                            if (embeddedData.mentions)
                                metadata.mentions = embeddedData.mentions;
                            if (embeddedData.location)
                                metadata.location = embeddedData.location;
                            if (embeddedData.music_title)
                                metadata.music_title = embeddedData.music_title;
                            if (embeddedData.music_artist)
                                metadata.music_artist = embeddedData.music_artist;
                            if (embeddedData.is_carousel !== undefined)
                                metadata.is_carousel = embeddedData.is_carousel;
                            if (embeddedData.carousel_media_count !== undefined)
                                metadata.carousel_media_count = embeddedData.carousel_media_count;
                            if (embeddedData.is_video !== undefined)
                                metadata.is_video = embeddedData.is_video;
                            if (embeddedData.is_photo !== undefined)
                                metadata.is_photo = embeddedData.is_photo;
                            if (embeddedData.requiresLogin !== undefined)
                                metadata.requiresLogin = embeddedData.requiresLogin;
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
                            if (domData.mentions && !metadata.mentions)
                                metadata.mentions = domData.mentions;
                        }
                        if (metadata.like_count === undefined && metadata.comment_count === undefined) {
                            metadata.requiresLogin = true;
                            this.logger.log("Like/comment counts not available - may require login", "warn");
                        }
                        this.logger.log("Successfully extracted Instagram video metadata", "info");
                        return [2 /*return*/, metadata];
                    case 5:
                        error_2 = _a.sent();
                        this.logger.log("Failed to extract Instagram video metadata: ".concat(error_2), "error");
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    InstagramScraper.prototype.extractFromEmbeddedJSON = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, page.evaluate(function () {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
                                var result = {};
                                if (window._sharedData) {
                                    var sharedData = window._sharedData;
                                    if ((_d = (_c = (_b = (_a = sharedData.entry_data) === null || _a === void 0 ? void 0 : _a.PostPage) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.graphql) === null || _d === void 0 ? void 0 : _d.shortcode_media) {
                                        var media = sharedData.entry_data.PostPage[0].graphql.shortcode_media;
                                        result.like_count = (_e = media.edge_media_preview_like) === null || _e === void 0 ? void 0 : _e.count;
                                        result.comment_count = (_f = media.edge_media_to_comment) === null || _f === void 0 ? void 0 : _f.count;
                                        result.view_count = media.video_view_count;
                                        result.play_count = media.video_play_count;
                                        result.timestamp = media.taken_at_timestamp;
                                        result.caption = (_k = (_j = (_h = (_g = media.edge_media_to_caption) === null || _g === void 0 ? void 0 : _g.edges) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.node) === null || _k === void 0 ? void 0 : _k.text;
                                        result.is_carousel = media.__typename === "GraphSidecar";
                                        result.is_video = media.__typename === "GraphVideo";
                                        result.is_photo = media.__typename === "GraphImage";
                                        if ((_p = (_o = (_m = (_l = media.edge_media_to_caption) === null || _l === void 0 ? void 0 : _l.edges) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.node) === null || _p === void 0 ? void 0 : _p.text) {
                                            var caption = media.edge_media_to_caption.edges[0].node.text;
                                            result.hashtags = (caption.match(/#\w+/g) || []).map(function (h) { return h.substring(1); });
                                            result.mentions = (caption.match(/@\w+/g) || []).map(function (m) { return m.substring(1); });
                                        }
                                        if (media.location) {
                                            result.location = media.location.name;
                                            if (media.location.lat && media.location.lng) {
                                                result.location_latitude = media.location.lat;
                                                result.location_longitude = media.location.lng;
                                            }
                                        }
                                    }
                                }
                                var scripts = document.querySelectorAll('script[type="application/ld+json"]');
                                for (var _i = 0, scripts_1 = scripts; _i < scripts_1.length; _i++) {
                                    var script = scripts_1[_i];
                                    try {
                                        var json = JSON.parse(script.textContent || '{}');
                                        if (json['@type'] === 'VideoObject' || json['@type'] === 'ImageObject') {
                                            if (json.interactionStatistic) {
                                                for (var _x = 0, _y = json.interactionStatistic; _x < _y.length; _x++) {
                                                    var stat = _y[_x];
                                                    if (stat['@type'] === 'LikeAction') {
                                                        result.like_count = parseInt(stat.userInteractionCount) || result.like_count;
                                                    }
                                                    else if (stat['@type'] === 'CommentAction') {
                                                        result.comment_count = parseInt(stat.userInteractionCount) || result.comment_count;
                                                    }
                                                }
                                            }
                                            if (json.caption)
                                                result.caption = json.caption;
                                        }
                                    }
                                    catch (e) {
                                        continue;
                                    }
                                }
                                var graphqlScripts = document.querySelectorAll('script');
                                for (var _z = 0, graphqlScripts_1 = graphqlScripts; _z < graphqlScripts_1.length; _z++) {
                                    var script = graphqlScripts_1[_z];
                                    var content = script.textContent || '';
                                    if (content.includes('shortcode_media') || content.includes('GraphImage') || content.includes('GraphVideo')) {
                                        try {
                                            var match = content.match(/window\.__additionalDataLoaded\([^,]+,\s*({.+?})\)/);
                                            if (match) {
                                                var json = JSON.parse(match[1]);
                                                if ((_q = json.graphql) === null || _q === void 0 ? void 0 : _q.shortcode_media) {
                                                    var media = json.graphql.shortcode_media;
                                                    if (!result.like_count)
                                                        result.like_count = (_r = media.edge_media_preview_like) === null || _r === void 0 ? void 0 : _r.count;
                                                    if (!result.comment_count)
                                                        result.comment_count = (_s = media.edge_media_to_comment) === null || _s === void 0 ? void 0 : _s.count;
                                                    if (!result.view_count)
                                                        result.view_count = media.video_view_count;
                                                    if (!result.caption)
                                                        result.caption = (_w = (_v = (_u = (_t = media.edge_media_to_caption) === null || _t === void 0 ? void 0 : _t.edges) === null || _u === void 0 ? void 0 : _u[0]) === null || _v === void 0 ? void 0 : _v.node) === null || _w === void 0 ? void 0 : _w.text;
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
    InstagramScraper.prototype.extractFromDOM = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, page.evaluate(function () {
                                var result = {};
                                var likeButtons = document.querySelectorAll('button, span, a');
                                for (var _i = 0, likeButtons_1 = likeButtons; _i < likeButtons_1.length; _i++) {
                                    var el = likeButtons_1[_i];
                                    var text = (el.textContent || '').trim();
                                    var ariaLabel = el.getAttribute('aria-label') || '';
                                    if (ariaLabel.includes('like') || ariaLabel.includes('Like')) {
                                        var match = ariaLabel.match(/([\d.,]+[KMB]?)\s*likes?/i) || text.match(/([\d.,]+[KMB]?)/);
                                        if (match) {
                                            var count = match[1].replace(/,/g, '');
                                            var num = parseFloat(count);
                                            if (count.includes('K') || count.includes('k'))
                                                num *= 1000;
                                            else if (count.includes('M') || count.includes('m'))
                                                num *= 1000000;
                                            else if (count.includes('B') || count.includes('b'))
                                                num *= 1000000000;
                                            result.like_count = Math.floor(num);
                                            break;
                                        }
                                    }
                                }
                                var commentButtons = document.querySelectorAll('button, span, a');
                                for (var _a = 0, commentButtons_1 = commentButtons; _a < commentButtons_1.length; _a++) {
                                    var el = commentButtons_1[_a];
                                    var text = (el.textContent || '').trim();
                                    var ariaLabel = el.getAttribute('aria-label') || '';
                                    if (ariaLabel.includes('comment') || ariaLabel.includes('Comment')) {
                                        var match = ariaLabel.match(/([\d.,]+[KMB]?)\s*comments?/i) || text.match(/([\d.,]+[KMB]?)/);
                                        if (match) {
                                            var count = match[1].replace(/,/g, '');
                                            var num = parseFloat(count);
                                            if (count.includes('K') || count.includes('k'))
                                                num *= 1000;
                                            else if (count.includes('M') || count.includes('m'))
                                                num *= 1000000;
                                            else if (count.includes('B') || count.includes('b'))
                                                num *= 1000000000;
                                            result.comment_count = Math.floor(num);
                                            break;
                                        }
                                    }
                                }
                                var viewElements = document.querySelectorAll('span, div');
                                for (var _b = 0, viewElements_1 = viewElements; _b < viewElements_1.length; _b++) {
                                    var el = viewElements_1[_b];
                                    var text = (el.textContent || '').trim();
                                    if (text.match(/^[\d.,]+[KMB]?\s*views?$/i)) {
                                        var match = text.match(/([\d.,]+[KMB]?)/);
                                        if (match) {
                                            var count = match[1].replace(/,/g, '');
                                            var num = parseFloat(count);
                                            if (count.includes('K') || count.includes('k'))
                                                num *= 1000;
                                            else if (count.includes('M') || count.includes('m'))
                                                num *= 1000000;
                                            else if (count.includes('B') || count.includes('b'))
                                                num *= 1000000000;
                                            result.view_count = Math.floor(num);
                                            break;
                                        }
                                    }
                                }
                                var article = document.querySelector('article');
                                if (article) {
                                    var spans = article.querySelectorAll('span');
                                    for (var _c = 0, spans_3 = spans; _c < spans_3.length; _c++) {
                                        var span = spans_3[_c];
                                        var text = span.textContent || '';
                                        if (text.length > 20 && text.length < 2000 && !text.includes('Like') && !text.includes('Comment') && !text.includes('Share')) {
                                            if (!result.caption) {
                                                result.caption = text.trim();
                                            }
                                            var hashtags = text.match(/#\w+/g);
                                            if (hashtags && hashtags.length > 0) {
                                                result.hashtags = hashtags.map(function (h) { return h.substring(1); });
                                            }
                                            var mentions = text.match(/@\w+/g);
                                            if (mentions && mentions.length > 0) {
                                                result.mentions = mentions.map(function (m) { return m.substring(1); });
                                            }
                                        }
                                    }
                                }
                                var carouselIndicators = document.querySelectorAll('[role="button"][aria-label*="carousel"], [aria-label*="Carousel"]');
                                if (carouselIndicators.length > 0) {
                                    result.is_carousel = true;
                                    result.carousel_media_count = carouselIndicators.length;
                                }
                                var videoElement = document.querySelector('video');
                                if (videoElement) {
                                    result.is_video = true;
                                }
                                else {
                                    var images = document.querySelectorAll('article img');
                                    if (images.length > 0) {
                                        result.is_photo = true;
                                    }
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
    return InstagramScraper;
}(CreatorMetadataScraper_js_1.CreatorMetadataScraper));
exports.InstagramScraper = InstagramScraper;
