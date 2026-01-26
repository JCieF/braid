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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchScraper = void 0;
var CreatorMetadataScraper_js_1 = require("./CreatorMetadataScraper.js");
/**
 * Twitch scraper focused on extracting metadata that yt-dlp cannot get.
 * Uses GraphQL response interception for reliable data extraction.
 *
 * Fields yt-dlp CANNOT get (what this scraper extracts):
 *
 * VOD:
 * - stream_id: Original stream ID
 * - published_at: Publish vs create time
 * - muted_segments: Muted section info
 *
 * Clip:
 * - embed_url: Embed URL
 * - source_video_id: Source VOD ID
 * - game_id: Game/category ID
 * - vod_offset: Offset in source VOD
 * - is_featured: Featured status
 * - clip_creator_id: Clip creator ID
 *
 * Stream:
 * - game_id: Game categorization
 * - game_name: (partial)
 * - is_mature: (partial)
 *
 * Channel:
 * - content_classification_labels: Content labels
 * - is_branded_content: Sponsored content flag
 */
var TwitchScraper = /** @class */ (function (_super) {
    __extends(TwitchScraper, _super);
    function TwitchScraper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TwitchScraper.prototype.detectContentType = function (url) {
        if (url.includes("/videos/"))
            return "vod";
        if (url.includes("/clip/") || url.includes("clips.twitch.tv"))
            return "clip";
        var match = url.match(/twitch\.tv\/([^\/\?]+)/);
        if (match && match[1] !== "videos" && match[1] !== "directory") {
            if (!url.includes("/clip") && !url.includes("/videos")) {
                return "stream";
            }
        }
        return "channel";
    };
    TwitchScraper.prototype.extractVideoId = function (url) {
        var vodMatch = url.match(/\/videos\/(\d+)/);
        if (vodMatch)
            return vodMatch[1];
        return null;
    };
    TwitchScraper.prototype.extractClipSlug = function (url) {
        var clipMatch = url.match(/\/clip\/([^\/\?]+)/);
        if (clipMatch)
            return clipMatch[1];
        var clipsMatch = url.match(/clips\.twitch\.tv\/([^\/\?]+)/);
        if (clipsMatch)
            return clipsMatch[1];
        return null;
    };
    TwitchScraper.prototype.getCreatorProfileUrl = function (videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var match;
            return __generator(this, function (_a) {
                try {
                    match = videoUrl.match(/twitch\.tv\/([^\/\?]+)/);
                    if (match && match[1] !== "videos" && match[1] !== "clip" && match[1] !== "directory") {
                        return [2 /*return*/, "https://www.twitch.tv/".concat(match[1])];
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
    TwitchScraper.prototype.extractVideoMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var contentType, gqlData_1, responseHandler, metadata, _a, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 12, , 13]);
                        contentType = this.detectContentType(videoUrl);
                        this.logger.log("Extracting Twitch ".concat(contentType, " metadata via GraphQL..."), "info");
                        gqlData_1 = new Map();
                        responseHandler = function (response) { return __awaiter(_this, void 0, void 0, function () {
                            var reqUrl, json, responses, _i, responses_1, resp, opName, e_1;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        reqUrl = response.url();
                                        if (!(reqUrl.includes("gql.twitch.tv") || reqUrl.includes("/gql"))) return [3 /*break*/, 4];
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, response.json()];
                                    case 2:
                                        json = _b.sent();
                                        responses = Array.isArray(json) ? json : [json];
                                        for (_i = 0, responses_1 = responses; _i < responses_1.length; _i++) {
                                            resp = responses_1[_i];
                                            opName = (_a = resp === null || resp === void 0 ? void 0 : resp.extensions) === null || _a === void 0 ? void 0 : _a.operationName;
                                            if (opName && (resp === null || resp === void 0 ? void 0 : resp.data)) {
                                                gqlData_1.set(opName, resp.data);
                                            }
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_1 = _b.sent();
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); };
                        page.on("response", responseHandler);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 4, 5]);
                        return [4 /*yield*/, page.goto(videoUrl, { waitUntil: "domcontentloaded", timeout: 60000 })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.delay(8000)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        page.off("response", responseHandler);
                        return [7 /*endfinally*/];
                    case 5:
                        metadata = {
                            platform: "twitch",
                            url: videoUrl,
                            extractedAt: Date.now(),
                            twitch_content_type: contentType,
                        };
                        _a = contentType;
                        switch (_a) {
                            case "vod": return [3 /*break*/, 6];
                            case "clip": return [3 /*break*/, 7];
                            case "stream": return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 11];
                    case 6:
                        this.extractVodFromGql(gqlData_1, videoUrl, metadata);
                        return [3 /*break*/, 11];
                    case 7: return [4 /*yield*/, this.extractClipFromGql(gqlData_1, page, videoUrl, metadata)];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, this.extractStreamFromGql(gqlData_1, page, metadata)];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 11:
                        this.extractChannelFromGql(gqlData_1, metadata);
                        this.logger.log("Successfully extracted Twitch ".concat(contentType, " metadata"), "info");
                        return [2 /*return*/, metadata];
                    case 12:
                        error_1 = _b.sent();
                        this.logger.log("Failed to extract Twitch video metadata: ".concat(error_1), "error");
                        return [2 /*return*/, null];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    TwitchScraper.prototype.extractVodFromGql = function (gqlData, url, metadata) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        var videoId = this.extractVideoId(url);
        if (videoId) {
            metadata.video_id = videoId;
        }
        // VideoMetadata operation - contains all basic video info
        var videoMetadata = gqlData.get("VideoMetadata");
        if (videoMetadata === null || videoMetadata === void 0 ? void 0 : videoMetadata.video) {
            var video = videoMetadata.video;
            // Basic fields yt-dlp can get
            if (video.id)
                metadata.video_id = video.id;
            if (video.title)
                metadata.title = video.title;
            if (video.description !== undefined && video.description !== null)
                metadata.description = video.description;
            if (video.createdAt)
                metadata.created_at = video.createdAt;
            if (video.publishedAt)
                metadata.published_at = video.publishedAt;
            if (video.viewCount !== undefined)
                metadata.view_count = video.viewCount;
            if (video.lengthSeconds !== undefined)
                metadata.duration = video.lengthSeconds;
            if (video.language)
                metadata.language = video.language;
            if (video.previewThumbnailURL)
                metadata.thumbnail_url = video.previewThumbnailURL;
            // Owner/user info
            if (video.owner) {
                if (video.owner.id)
                    metadata.user_id = video.owner.id;
                if (video.owner.login)
                    metadata.user_login = video.owner.login;
                if (video.owner.displayName)
                    metadata.user_name = video.owner.displayName;
            }
            // Game info (gap fields)
            if ((_a = video.game) === null || _a === void 0 ? void 0 : _a.id)
                metadata.game_id = video.game.id;
            if ((_b = video.game) === null || _b === void 0 ? void 0 : _b.name)
                metadata.game_name = video.game.name;
        }
        // NielsenContentMetadata - backup for basic fields
        var nielsenData = gqlData.get("NielsenContentMetadata");
        if (nielsenData === null || nielsenData === void 0 ? void 0 : nielsenData.video) {
            var video = nielsenData.video;
            if (!metadata.video_id && video.id)
                metadata.video_id = video.id;
            if (!metadata.title && video.title)
                metadata.title = video.title;
            if (!metadata.created_at && video.createdAt)
                metadata.created_at = video.createdAt;
            if (!metadata.published_at && video.createdAt)
                metadata.published_at = video.createdAt;
            if (!metadata.game_id && ((_c = video.game) === null || _c === void 0 ? void 0 : _c.id))
                metadata.game_id = video.game.id;
            if (!metadata.game_name && ((_d = video.game) === null || _d === void 0 ? void 0 : _d.displayName))
                metadata.game_name = video.game.displayName;
            if (video.owner) {
                if (!metadata.user_id && video.owner.id)
                    metadata.user_id = video.owner.id;
                if (!metadata.user_login && video.owner.login)
                    metadata.user_login = video.owner.login;
            }
        }
        // AdRequestHandling - isMature, broadcastType, and backup for basic fields
        var adData = gqlData.get("AdRequestHandling");
        if (adData === null || adData === void 0 ? void 0 : adData.video) {
            // Basic fields backup
            if (!metadata.video_id && adData.video.id)
                metadata.video_id = adData.video.id;
            if (!metadata.title && adData.video.title)
                metadata.title = adData.video.title;
            if (adData.video.lengthSeconds !== undefined && metadata.duration === undefined) {
                metadata.duration = adData.video.lengthSeconds;
            }
            if (adData.video.owner) {
                if (!metadata.user_id && adData.video.owner.id)
                    metadata.user_id = adData.video.owner.id;
                if (!metadata.user_login && adData.video.owner.login)
                    metadata.user_login = adData.video.owner.login;
                if (!metadata.user_name && adData.video.owner.displayName)
                    metadata.user_name = adData.video.owner.displayName;
            }
            if (adData.video.game) {
                if (!metadata.game_id && adData.video.game.id)
                    metadata.game_id = adData.video.game.id;
                if (!metadata.game_name && adData.video.game.name)
                    metadata.game_name = adData.video.game.name;
            }
            // Gap fields
            if (((_f = (_e = adData.video.owner) === null || _e === void 0 ? void 0 : _e.broadcastSettings) === null || _f === void 0 ? void 0 : _f.isMature) !== undefined) {
                metadata.is_mature = adData.video.owner.broadcastSettings.isMature;
            }
            if (adData.video.broadcastType) {
                metadata.vod_type = adData.video.broadcastType;
            }
        }
        // ChannelVideoCore - backup for user info
        var channelVideo = gqlData.get("ChannelVideoCore");
        if ((_g = channelVideo === null || channelVideo === void 0 ? void 0 : channelVideo.video) === null || _g === void 0 ? void 0 : _g.owner) {
            if (!metadata.user_id && channelVideo.video.owner.id)
                metadata.user_id = channelVideo.video.owner.id;
            if (!metadata.user_login && channelVideo.video.owner.login)
                metadata.user_login = channelVideo.video.owner.login;
            if (!metadata.user_name && channelVideo.video.owner.displayName)
                metadata.user_name = channelVideo.video.owner.displayName;
        }
        // VideoPlayer_VODSeekbarPreviewVideo - contains seekPreviewsURL with broadcast ID
        var seekbarPreviewData = gqlData.get("VideoPlayer_VODSeekbarPreviewVideo");
        if ((_h = seekbarPreviewData === null || seekbarPreviewData === void 0 ? void 0 : seekbarPreviewData.video) === null || _h === void 0 ? void 0 : _h.seekPreviewsURL) {
            var seekUrl = seekbarPreviewData.video.seekPreviewsURL;
            // Pattern: {hash}_{username}_{broadcastID}_{timestamp}/storyboards/...
            var broadcastMatch = seekUrl.match(/_(\d{12,})_\d+\/storyboards/);
            if (broadcastMatch) {
                metadata.stream_id = broadcastMatch[1];
            }
        }
        // VideoPlayer_MutedSegmentsAlertOverlay - muted segments
        var mutedData = gqlData.get("VideoPlayer_MutedSegmentsAlertOverlay");
        if ((_l = (_k = (_j = mutedData === null || mutedData === void 0 ? void 0 : mutedData.video) === null || _j === void 0 ? void 0 : _j.muteInfo) === null || _k === void 0 ? void 0 : _k.mutedSegmentConnection) === null || _l === void 0 ? void 0 : _l.nodes) {
            var nodes = mutedData.video.muteInfo.mutedSegmentConnection.nodes;
            if (nodes.length > 0) {
                metadata.muted_segments = nodes.map(function (n) { return ({
                    offset: n.offset,
                    duration: n.duration
                }); });
            }
        }
        // VideoPlayer_VODSeekbar - backup for muted segments
        var seekbarData = gqlData.get("VideoPlayer_VODSeekbar");
        if (!metadata.muted_segments && ((_p = (_o = (_m = seekbarData === null || seekbarData === void 0 ? void 0 : seekbarData.video) === null || _m === void 0 ? void 0 : _m.muteInfo) === null || _o === void 0 ? void 0 : _o.mutedSegmentConnection) === null || _p === void 0 ? void 0 : _p.nodes)) {
            var nodes = seekbarData.video.muteInfo.mutedSegmentConnection.nodes;
            if (nodes.length > 0) {
                metadata.muted_segments = nodes.map(function (n) { return ({
                    offset: n.offset,
                    duration: n.duration
                }); });
            }
        }
        // ContentPolicyPropertiesQuery - branded content
        var policyData = gqlData.get("ContentPolicyPropertiesQuery");
        if (((_r = (_q = policyData === null || policyData === void 0 ? void 0 : policyData.video) === null || _q === void 0 ? void 0 : _q.contentPolicyProperties) === null || _r === void 0 ? void 0 : _r.hasBrandedContent) !== undefined) {
            metadata.is_branded_content = policyData.video.contentPolicyProperties.hasBrandedContent;
        }
        // ContentClassificationContext - content labels
        var classificationData = gqlData.get("ContentClassificationContext");
        if ((_s = classificationData === null || classificationData === void 0 ? void 0 : classificationData.video) === null || _s === void 0 ? void 0 : _s.contentClassificationLabels) {
            var labels = classificationData.video.contentClassificationLabels;
            if (labels.length > 0) {
                metadata.content_classification_labels = labels;
            }
        }
        // WatchTrackQuery - backup for broadcastType and view count
        var watchData = gqlData.get("WatchTrackQuery");
        if (watchData === null || watchData === void 0 ? void 0 : watchData.video) {
            if (!metadata.vod_type && watchData.video.broadcastType) {
                metadata.vod_type = watchData.video.broadcastType;
            }
            if (metadata.view_count === undefined && watchData.video.viewCount !== undefined) {
                metadata.view_count = watchData.video.viewCount;
            }
        }
        // PlayerTrackingContextQuery - another backup for broadcastType
        var playerTracking = gqlData.get("PlayerTrackingContextQuery");
        if (playerTracking === null || playerTracking === void 0 ? void 0 : playerTracking.video) {
            if (!metadata.vod_type && playerTracking.video.broadcastType) {
                metadata.vod_type = playerTracking.video.broadcastType;
            }
            if (metadata.view_count === undefined && playerTracking.video.viewCount !== undefined) {
                metadata.view_count = playerTracking.video.viewCount;
            }
        }
    };
    TwitchScraper.prototype.extractClipFromGql = function (gqlData, page, url, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var clipSlug, chatClip, clip, clipCore, clip, feedClip, clip, trackingData, clip, classificationData, labels, shelvesData, _i, _a, edge, _b, _c, item, clipData;
            var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        clipSlug = this.extractClipSlug(url);
                        if (clipSlug) {
                            metadata.video_id = clipSlug;
                            metadata.embed_url = "https://clips.twitch.tv/embed?clip=".concat(clipSlug);
                        }
                        chatClip = gqlData.get("ChatClip");
                        if (chatClip === null || chatClip === void 0 ? void 0 : chatClip.clip) {
                            clip = chatClip.clip;
                            if (clip.videoOffsetSeconds !== undefined)
                                metadata.vod_offset = clip.videoOffsetSeconds;
                            if ((_d = clip.video) === null || _d === void 0 ? void 0 : _d.id)
                                metadata.source_video_id = clip.video.id;
                        }
                        clipCore = gqlData.get("ChannelClipCore");
                        if (clipCore === null || clipCore === void 0 ? void 0 : clipCore.clip) {
                            clip = clipCore.clip;
                            if (clip.isFeatured !== undefined)
                                metadata.is_featured = clip.isFeatured;
                            if (clip.videoOffsetSeconds !== undefined && metadata.vod_offset === undefined) {
                                metadata.vod_offset = clip.videoOffsetSeconds;
                            }
                            // Broadcaster info
                            if (clip.broadcaster) {
                                if (!metadata.user_id && clip.broadcaster.id)
                                    metadata.user_id = clip.broadcaster.id;
                                if (!metadata.user_login && clip.broadcaster.login)
                                    metadata.user_login = clip.broadcaster.login;
                                if (!metadata.user_name && clip.broadcaster.displayName)
                                    metadata.user_name = clip.broadcaster.displayName;
                            }
                        }
                        feedClip = gqlData.get("FeedInteractionHook_GetClipBySlug");
                        if (feedClip === null || feedClip === void 0 ? void 0 : feedClip.clip) {
                            clip = feedClip.clip;
                            // Basic fields yt-dlp can get
                            if (clip.id)
                                metadata.video_id = clip.id;
                            if (clip.slug)
                                metadata.video_id = clip.slug; // Use slug as video_id for clips
                            if (clip.title)
                                metadata.title = clip.title;
                            if (clip.viewCount !== undefined)
                                metadata.view_count = clip.viewCount;
                            if (clip.createdAt)
                                metadata.created_at = clip.createdAt;
                            if (clip.durationSeconds !== undefined)
                                metadata.duration = clip.durationSeconds;
                            if (clip.language)
                                metadata.language = clip.language;
                            if (clip.thumbnailURL)
                                metadata.thumbnail_url = clip.thumbnailURL;
                            // Broadcaster info
                            if (clip.broadcaster) {
                                if (!metadata.user_id && clip.broadcaster.id)
                                    metadata.user_id = clip.broadcaster.id;
                                if (!metadata.user_login && clip.broadcaster.login)
                                    metadata.user_login = clip.broadcaster.login;
                                if (!metadata.user_name && clip.broadcaster.displayName)
                                    metadata.user_name = clip.broadcaster.displayName;
                            }
                            // Game info (gap fields)
                            if ((_e = clip.game) === null || _e === void 0 ? void 0 : _e.id)
                                metadata.game_id = clip.game.id;
                            if ((_f = clip.game) === null || _f === void 0 ? void 0 : _f.name)
                                metadata.game_name = clip.game.name;
                        }
                        trackingData = gqlData.get("PlayerTrackingContextQuery");
                        if (trackingData === null || trackingData === void 0 ? void 0 : trackingData.clip) {
                            clip = trackingData.clip;
                            if (!metadata.game_id && ((_g = clip.game) === null || _g === void 0 ? void 0 : _g.id))
                                metadata.game_id = clip.game.id;
                            if (!metadata.game_name && ((_h = clip.game) === null || _h === void 0 ? void 0 : _h.name))
                                metadata.game_name = clip.game.name;
                        }
                        classificationData = gqlData.get("ContentClassificationContext");
                        if ((_j = classificationData === null || classificationData === void 0 ? void 0 : classificationData.clip) === null || _j === void 0 ? void 0 : _j.contentClassificationLabels) {
                            labels = classificationData.clip.contentClassificationLabels;
                            if (labels.length > 0) {
                                metadata.content_classification_labels = labels.map(function (l) {
                                    return l.localizedName || l.id || l;
                                });
                            }
                        }
                        shelvesData = gqlData.get("ChannelVideoShelvesQuery");
                        if ((_l = (_k = shelvesData === null || shelvesData === void 0 ? void 0 : shelvesData.user) === null || _k === void 0 ? void 0 : _k.videoShelves) === null || _l === void 0 ? void 0 : _l.edges) {
                            for (_i = 0, _a = shelvesData.user.videoShelves.edges; _i < _a.length; _i++) {
                                edge = _a[_i];
                                if ((_m = edge === null || edge === void 0 ? void 0 : edge.node) === null || _m === void 0 ? void 0 : _m.items) {
                                    for (_b = 0, _c = edge.node.items; _b < _c.length; _b++) {
                                        item = _c[_b];
                                        if (item.slug === clipSlug || item.id === clipSlug) {
                                            if (metadata.is_featured === undefined && item.isFeatured !== undefined) {
                                                metadata.is_featured = item.isFeatured;
                                            }
                                            if (!metadata.clip_creator_id && ((_o = item.curator) === null || _o === void 0 ? void 0 : _o.id)) {
                                                metadata.clip_creator_id = item.curator.id;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (!!metadata.clip_creator_id) return [3 /*break*/, 2];
                        return [4 /*yield*/, page.evaluate(function () {
                                var scripts = document.querySelectorAll('script');
                                for (var _i = 0, scripts_1 = scripts; _i < scripts_1.length; _i++) {
                                    var script = scripts_1[_i];
                                    var content = script.textContent || "";
                                    var curatorMatch = content.match(/"curator"\s*:\s*\{[^}]*"id"\s*:\s*"(\d+)"/);
                                    if (curatorMatch) {
                                        return { clip_creator_id: curatorMatch[1] };
                                    }
                                }
                                return {};
                            })];
                    case 1:
                        clipData = _p.sent();
                        if (clipData.clip_creator_id)
                            metadata.clip_creator_id = clipData.clip_creator_id;
                        _p.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    TwitchScraper.prototype.extractStreamFromGql = function (gqlData, page, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var watchData, game, adData, channelShell, videoMetadata, useViewCount, streamMetadata, user, ffzData, game, tags;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        watchData = gqlData.get("WatchTrackQuery");
                        if ((_b = (_a = watchData === null || watchData === void 0 ? void 0 : watchData.user) === null || _a === void 0 ? void 0 : _a.lastBroadcast) === null || _b === void 0 ? void 0 : _b.game) {
                            game = watchData.user.lastBroadcast.game;
                            if (game.id)
                                metadata.game_id = game.id;
                            if (game.name)
                                metadata.game_name = game.name;
                        }
                        adData = gqlData.get("AdRequestHandling");
                        if (((_e = (_d = (_c = adData === null || adData === void 0 ? void 0 : adData.video) === null || _c === void 0 ? void 0 : _c.owner) === null || _d === void 0 ? void 0 : _d.broadcastSettings) === null || _e === void 0 ? void 0 : _e.isMature) !== undefined) {
                            metadata.is_mature = adData.video.owner.broadcastSettings.isMature;
                        }
                        channelShell = gqlData.get("ChannelShell");
                        if (((_g = (_f = channelShell === null || channelShell === void 0 ? void 0 : channelShell.userOrError) === null || _f === void 0 ? void 0 : _f.broadcastSettings) === null || _g === void 0 ? void 0 : _g.isMature) !== undefined) {
                            metadata.is_mature = channelShell.userOrError.broadcastSettings.isMature;
                        }
                        videoMetadata = gqlData.get("VideoMetadata");
                        if (((_j = (_h = videoMetadata === null || videoMetadata === void 0 ? void 0 : videoMetadata.user) === null || _h === void 0 ? void 0 : _h.broadcastSettings) === null || _j === void 0 ? void 0 : _j.isMature) !== undefined && metadata.is_mature === undefined) {
                            metadata.is_mature = videoMetadata.user.broadcastSettings.isMature;
                        }
                        useViewCount = gqlData.get("UseViewCount");
                        if (useViewCount === null || useViewCount === void 0 ? void 0 : useViewCount.user) {
                            if (useViewCount.user.id)
                                metadata.user_id = useViewCount.user.id;
                            if (useViewCount.user.login)
                                metadata.user_login = useViewCount.user.login;
                            if (useViewCount.user.stream) {
                                if (useViewCount.user.stream.id)
                                    metadata.video_id = useViewCount.user.stream.id;
                                if (useViewCount.user.stream.viewersCount !== undefined)
                                    metadata.viewer_count = useViewCount.user.stream.viewersCount;
                                if (useViewCount.user.stream.game) {
                                    if (!metadata.game_id && useViewCount.user.stream.game.id)
                                        metadata.game_id = useViewCount.user.stream.game.id;
                                    if (!metadata.game_name && useViewCount.user.stream.game.name)
                                        metadata.game_name = useViewCount.user.stream.game.name;
                                }
                            }
                        }
                        // VideoMetadata - stream title and basic info
                        if (videoMetadata === null || videoMetadata === void 0 ? void 0 : videoMetadata.user) {
                            if (!metadata.user_id && videoMetadata.user.id)
                                metadata.user_id = videoMetadata.user.id;
                            if (!metadata.user_login && videoMetadata.user.login)
                                metadata.user_login = videoMetadata.user.login;
                            if (videoMetadata.user.stream) {
                                if (!metadata.video_id && videoMetadata.user.stream.id)
                                    metadata.video_id = videoMetadata.user.stream.id;
                                if (metadata.viewer_count === undefined && videoMetadata.user.stream.viewersCount !== undefined) {
                                    metadata.viewer_count = videoMetadata.user.stream.viewersCount;
                                }
                            }
                            if (videoMetadata.user.lastBroadcast) {
                                if (videoMetadata.user.lastBroadcast.startedAt)
                                    metadata.started_at = videoMetadata.user.lastBroadcast.startedAt;
                            }
                        }
                        // ChannelShell - stream title and broadcaster info
                        if (channelShell === null || channelShell === void 0 ? void 0 : channelShell.userOrError) {
                            if (!metadata.user_id && channelShell.userOrError.id)
                                metadata.user_id = channelShell.userOrError.id;
                            if (!metadata.user_login && channelShell.userOrError.login)
                                metadata.user_login = channelShell.userOrError.login;
                            if (!metadata.user_name && channelShell.userOrError.displayName)
                                metadata.user_name = channelShell.userOrError.displayName;
                            if ((_k = channelShell.userOrError.broadcastSettings) === null || _k === void 0 ? void 0 : _k.title)
                                metadata.title = channelShell.userOrError.broadcastSettings.title;
                        }
                        streamMetadata = gqlData.get("StreamMetadata");
                        if (streamMetadata === null || streamMetadata === void 0 ? void 0 : streamMetadata.user) {
                            user = streamMetadata.user;
                            if (((_l = user.broadcastSettings) === null || _l === void 0 ? void 0 : _l.isMature) !== undefined) {
                                metadata.is_mature = user.broadcastSettings.isMature;
                            }
                            if ((_m = user.stream) === null || _m === void 0 ? void 0 : _m.game) {
                                if (!metadata.game_id && user.stream.game.id)
                                    metadata.game_id = user.stream.game.id;
                                if (!metadata.game_name && user.stream.game.name)
                                    metadata.game_name = user.stream.game.name;
                            }
                        }
                        ffzData = gqlData.get("FFZ_StreamTagList");
                        if ((_p = (_o = ffzData === null || ffzData === void 0 ? void 0 : ffzData.user) === null || _o === void 0 ? void 0 : _o.stream) === null || _p === void 0 ? void 0 : _p.game) {
                            game = ffzData.user.stream.game;
                            if (!metadata.game_id && game.id)
                                metadata.game_id = game.id;
                            if (!metadata.game_name && game.name)
                                metadata.game_name = game.name;
                        }
                        return [4 /*yield*/, page.evaluate(function () {
                                var _a, _b, _c;
                                var tagElements = [];
                                // Method 1: Look for Twitch tag links (common pattern: /directory/tags/...)
                                var tagLinks = document.querySelectorAll('a[href*="/directory/tags/"]');
                                for (var _i = 0, tagLinks_1 = tagLinks; _i < tagLinks_1.length; _i++) {
                                    var link = tagLinks_1[_i];
                                    var text = (_a = link.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                                    var href = link.getAttribute('href') || '';
                                    // Extract tag name from URL or text
                                    var urlMatch = href.match(/\/tags\/([^\/\?]+)/);
                                    if (urlMatch) {
                                        var tagName = decodeURIComponent(urlMatch[1].replace(/-/g, ' '));
                                        if (tagName && tagName.length > 0 && tagName.length < 100) {
                                            tagElements.push(tagName);
                                        }
                                    }
                                    else if (text && text.length > 0 && text.length < 100 && !text.toLowerCase().includes('tag')) {
                                        tagElements.push(text);
                                    }
                                }
                                // Method 2: Look for tag elements with data attributes
                                var tagElementsWithData = document.querySelectorAll('[data-a-target*="tag"], [data-test-selector*="tag"]');
                                for (var _d = 0, tagElementsWithData_1 = tagElementsWithData; _d < tagElementsWithData_1.length; _d++) {
                                    var elem = tagElementsWithData_1[_d];
                                    var text = (_b = elem.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                                    if (text && text.length > 0 && text.length < 100) {
                                        tagElements.push(text);
                                    }
                                }
                                // Method 3: Look for tag chips/buttons in stream info panels
                                var streamInfo = document.querySelector('[data-a-target="stream-info"], .stream-info, [class*="StreamInfo"]');
                                if (streamInfo) {
                                    var infoTags = streamInfo.querySelectorAll('a, button, span[class*="tag"], div[class*="tag"]');
                                    for (var _e = 0, infoTags_1 = infoTags; _e < infoTags_1.length; _e++) {
                                        var tag = infoTags_1[_e];
                                        var text = (_c = tag.textContent) === null || _c === void 0 ? void 0 : _c.trim();
                                        if (text && text.length > 0 && text.length < 100 && !text.toLowerCase().includes('tag')) {
                                            tagElements.push(text);
                                        }
                                    }
                                }
                                // Method 4: Search script tags for tag arrays in JSON
                                var scripts = document.querySelectorAll('script');
                                for (var _f = 0, scripts_2 = scripts; _f < scripts_2.length; _f++) {
                                    var script = scripts_2[_f];
                                    var content = script.textContent || "";
                                    // Look for tags array patterns
                                    var patterns = [
                                        /"tags"\s*:\s*\[(.*?)\]/,
                                        /"streamTags"\s*:\s*\[(.*?)\]/,
                                        /tags:\s*\[(.*?)\]/,
                                    ];
                                    for (var _g = 0, patterns_1 = patterns; _g < patterns_1.length; _g++) {
                                        var pattern = patterns_1[_g];
                                        var match = content.match(pattern);
                                        if (match) {
                                            try {
                                                // Try to parse as JSON array
                                                var jsonStr = "[".concat(match[1], "]");
                                                var tagArray = JSON.parse(jsonStr);
                                                for (var _h = 0, tagArray_1 = tagArray; _h < tagArray_1.length; _h++) {
                                                    var tag = tagArray_1[_h];
                                                    if (typeof tag === 'string' && tag.length > 0) {
                                                        tagElements.push(tag);
                                                    }
                                                    else if ((tag === null || tag === void 0 ? void 0 : tag.name) && typeof tag.name === 'string') {
                                                        tagElements.push(tag.name);
                                                    }
                                                    else if ((tag === null || tag === void 0 ? void 0 : tag.localizedName) && typeof tag.localizedName === 'string') {
                                                        tagElements.push(tag.localizedName);
                                                    }
                                                }
                                            }
                                            catch (e) {
                                                // Try extracting quoted strings
                                                var stringMatches = match[1].match(/"([^"]+)"/g);
                                                if (stringMatches) {
                                                    for (var _j = 0, stringMatches_1 = stringMatches; _j < stringMatches_1.length; _j++) {
                                                        var strMatch = stringMatches_1[_j];
                                                        var tag = strMatch.replace(/"/g, '');
                                                        if (tag.length > 0 && tag.length < 100) {
                                                            tagElements.push(tag);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                // Remove duplicates, filter out common false positives, and return
                                var filtered = __spreadArray([], new Set(tagElements), true).filter(function (tag) {
                                    var lower = tag.toLowerCase();
                                    return tag.length > 0 &&
                                        tag.length < 100 &&
                                        !lower.includes('tag') &&
                                        !lower.includes('tags') &&
                                        !lower.includes('viewer') &&
                                        !lower.includes('follow');
                                });
                                return filtered;
                            })];
                    case 1:
                        tags = _q.sent();
                        if (tags && tags.length > 0) {
                            metadata.tags = tags;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TwitchScraper.prototype.extractChannelFromGql = function (gqlData, metadata) {
        var _a, _b, _c;
        // ContentClassificationContext - content labels
        var classificationData = gqlData.get("ContentClassificationContext");
        if (((_a = classificationData === null || classificationData === void 0 ? void 0 : classificationData.video) === null || _a === void 0 ? void 0 : _a.contentClassificationLabels) && !metadata.content_classification_labels) {
            var labels = classificationData.video.contentClassificationLabels;
            if (labels.length > 0) {
                metadata.content_classification_labels = labels;
            }
        }
        // ContentPolicyPropertiesQuery - branded content
        var policyData = gqlData.get("ContentPolicyPropertiesQuery");
        if (((_c = (_b = policyData === null || policyData === void 0 ? void 0 : policyData.video) === null || _b === void 0 ? void 0 : _b.contentPolicyProperties) === null || _c === void 0 ? void 0 : _c.hasBrandedContent) !== undefined && metadata.is_branded_content === undefined) {
            metadata.is_branded_content = policyData.video.contentPolicyProperties.hasBrandedContent;
        }
    };
    TwitchScraper.prototype.extractMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var profileUrl, link, metadata, usernameMatch, nameSelectors, _i, nameSelectors_1, selector, name_1, bioSelectors, _a, bioSelectors_1, selector, bio, followerSelectors, _b, followerSelectors_1, selector, followerText, avatarSelectors, _c, avatarSelectors_1, selector, avatar, verifiedSelectors, _d, verifiedSelectors_1, selector, verified, error_2;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 29, , 30]);
                        this.logger.log("Extracting Twitch creator metadata...", "info");
                        return [4 /*yield*/, this.getCreatorProfileUrl(videoUrl)];
                    case 1:
                        profileUrl = _e.sent();
                        if (!!profileUrl) return [3 /*break*/, 5];
                        return [4 /*yield*/, page.goto(videoUrl, { waitUntil: "domcontentloaded" })];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, this.getElementAttribute(page, 'a[href*="/"]', "href")];
                    case 4:
                        link = _e.sent();
                        if (link && link.includes("twitch.tv/") && !link.includes("/videos/")) {
                            profileUrl = link.startsWith("http") ? link : "https://www.twitch.tv".concat(link);
                        }
                        _e.label = 5;
                    case 5:
                        if (!profileUrl) {
                            this.logger.log("Could not find Twitch profile URL", "warn");
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, page.goto(profileUrl, { waitUntil: "domcontentloaded" })];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 7:
                        _e.sent();
                        metadata = {
                            platform: "twitch",
                            url: profileUrl,
                            extractedAt: Date.now(),
                        };
                        usernameMatch = profileUrl.match(/twitch\.tv\/([^\/\?]+)/);
                        if (usernameMatch) {
                            metadata.creator_username = usernameMatch[1];
                        }
                        nameSelectors = [
                            'h2[data-a-target="user-channel-header-item"]',
                            'h2',
                            '[data-a-target="user-display-name"]'
                        ];
                        _i = 0, nameSelectors_1 = nameSelectors;
                        _e.label = 8;
                    case 8:
                        if (!(_i < nameSelectors_1.length)) return [3 /*break*/, 11];
                        selector = nameSelectors_1[_i];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 9:
                        name_1 = _e.sent();
                        if (name_1 && name_1.length > 0) {
                            metadata.creator_name = this.cleanText(name_1);
                            return [3 /*break*/, 11];
                        }
                        _e.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 8];
                    case 11:
                        bioSelectors = [
                            '[data-a-target="user-channel-description"]',
                            '.channel-info-content',
                            '[data-a-target="user-channel-description-text"]'
                        ];
                        _a = 0, bioSelectors_1 = bioSelectors;
                        _e.label = 12;
                    case 12:
                        if (!(_a < bioSelectors_1.length)) return [3 /*break*/, 15];
                        selector = bioSelectors_1[_a];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 13:
                        bio = _e.sent();
                        if (bio && bio.length > 5) {
                            metadata.creator_bio = this.cleanText(bio);
                            return [3 /*break*/, 15];
                        }
                        _e.label = 14;
                    case 14:
                        _a++;
                        return [3 /*break*/, 12];
                    case 15:
                        followerSelectors = [
                            '[data-a-target="follow-count"]',
                            'a[href*="/followers"]',
                            '[data-a-target="user-channel-header-item"]'
                        ];
                        _b = 0, followerSelectors_1 = followerSelectors;
                        _e.label = 16;
                    case 16:
                        if (!(_b < followerSelectors_1.length)) return [3 /*break*/, 19];
                        selector = followerSelectors_1[_b];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 17:
                        followerText = _e.sent();
                        if (followerText && (followerText.includes("followers") || followerText.includes("Follower"))) {
                            metadata.creator_follower_count = this.parseCount(followerText);
                            return [3 /*break*/, 19];
                        }
                        _e.label = 18;
                    case 18:
                        _b++;
                        return [3 /*break*/, 16];
                    case 19:
                        avatarSelectors = [
                            'img[alt*="avatar"]',
                            '[data-a-target="user-avatar"] img',
                            'img[src*="static-cdn.jtvnw.net"]'
                        ];
                        _c = 0, avatarSelectors_1 = avatarSelectors;
                        _e.label = 20;
                    case 20:
                        if (!(_c < avatarSelectors_1.length)) return [3 /*break*/, 23];
                        selector = avatarSelectors_1[_c];
                        return [4 /*yield*/, this.getElementAttribute(page, selector, "src")];
                    case 21:
                        avatar = _e.sent();
                        if (avatar && avatar.includes("static-cdn.jtvnw.net")) {
                            metadata.creator_avatar_url = avatar;
                            return [3 /*break*/, 23];
                        }
                        _e.label = 22;
                    case 22:
                        _c++;
                        return [3 /*break*/, 20];
                    case 23:
                        verifiedSelectors = [
                            '[data-a-target="verified-badge"]',
                            '[aria-label*="Verified"]',
                            '.verified-badge'
                        ];
                        _d = 0, verifiedSelectors_1 = verifiedSelectors;
                        _e.label = 24;
                    case 24:
                        if (!(_d < verifiedSelectors_1.length)) return [3 /*break*/, 28];
                        selector = verifiedSelectors_1[_d];
                        return [4 /*yield*/, page.locator(selector).first()];
                    case 25:
                        verified = _e.sent();
                        return [4 /*yield*/, verified.isVisible({ timeout: 2000 }).catch(function () { return false; })];
                    case 26:
                        if (_e.sent()) {
                            metadata.creator_verified = true;
                            return [3 /*break*/, 28];
                        }
                        _e.label = 27;
                    case 27:
                        _d++;
                        return [3 /*break*/, 24];
                    case 28:
                        this.logger.log("Successfully extracted Twitch creator metadata", "info");
                        return [2 /*return*/, metadata];
                    case 29:
                        error_2 = _e.sent();
                        this.logger.log("Failed to extract Twitch metadata: ".concat(error_2), "error");
                        return [2 /*return*/, null];
                    case 30: return [2 /*return*/];
                }
            });
        });
    };
    return TwitchScraper;
}(CreatorMetadataScraper_js_1.CreatorMetadataScraper));
exports.TwitchScraper = TwitchScraper;
