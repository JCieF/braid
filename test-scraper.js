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
var CreatorMetadataManager_js_1 = require("./src/scrapers/CreatorMetadataManager.js");
var StringBuilder_js_1 = require("./src/helpers/StringBuilder.js");
var mockInvokeEvent = {
    sender: {
        send: function (id, data) {
            if (data.data) {
                console.log("[".concat(id, "] ").concat(data.data));
            }
        },
    },
};
function testScraper() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, browserType, testUrls, browserConfig, manager, results, _i, testUrls_1, url, extendedMetadata, creator, video, error_1, successCount, failCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = new StringBuilder_js_1.Logger("test-scraper", mockInvokeEvent);
                    browserType = process.env.BROWSER === "firefox" ? "firefox" : "chromium";
                    testUrls = process.env.INSTAGRAM_ONLY === "true"
                        ? ["https://www.instagram.com/instagram/"]
                        : [
                            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            "https://www.instagram.com/instagram/",
                        ];
                    browserConfig = {
                        headless: false,
                        viewport: { width: 1920, height: 1080 },
                    };
                    if (process.env.FIREFOX_PROFILE) {
                        browserConfig.firefoxUserDataDir = process.env.FIREFOX_PROFILE;
                    }
                    manager = new CreatorMetadataManager_js_1.CreatorMetadataManager(logger, {
                        browserType: browserType,
                        browserConfig: browserConfig,
                    });
                    if (browserType === "firefox" && testUrls.some(function (url) { return url.includes("instagram"); })) {
                        console.log("\n⚠️  Firefox browser will open for Instagram testing.");
                        console.log("   When the browser opens:");
                        console.log("   1. Navigate to instagram.com if needed");
                        console.log("   2. Log in to your account");
                        console.log("   3. Wait 10 seconds for the scraper to continue\n");
                        console.log("   (The scraper will wait 10 seconds for you to log in)\n");
                    }
                    results = [];
                    _i = 0, testUrls_1 = testUrls;
                    _a.label = 1;
                case 1:
                    if (!(_i < testUrls_1.length)) return [3 /*break*/, 6];
                    url = testUrls_1[_i];
                    console.log("\nTesting: ".concat(url));
                    console.log("---");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, manager.extractExtendedMetadata(url)];
                case 3:
                    extendedMetadata = _a.sent();
                    if (extendedMetadata) {
                        creator = extendedMetadata.creator;
                        video = extendedMetadata.video;
                        results.push({
                            url: url,
                            platform: (creator === null || creator === void 0 ? void 0 : creator.platform) || (video === null || video === void 0 ? void 0 : video.platform) || "unknown",
                            success: true,
                            metadata: {
                                creator: creator ? {
                                    creator_name: creator.creator_name,
                                    creator_username: creator.creator_username,
                                    creator_avatar_url: creator.creator_avatar_url,
                                    creator_bio: creator.creator_bio,
                                    creator_follower_count: creator.creator_follower_count,
                                    creator_verified: creator.creator_verified,
                                } : null,
                                video: video ? {
                                    video_id: video.video_id,
                                    like_count: video.like_count,
                                    comment_count: video.comment_count,
                                    view_count: video.view_count,
                                    share_count: video.share_count,
                                    caption: video.caption ? video.caption.substring(0, 100) + "..." : null,
                                    hashtags: video.hashtags,
                                    timestamp: video.timestamp,
                                    requiresLogin: video.requiresLogin,
                                } : null,
                            },
                        });
                        if (creator) {
                            console.log("\n[CREATOR METADATA]");
                            console.log("Platform:", creator.platform);
                            console.log("Creator Name:", creator.creator_name || "N/A");
                            console.log("Username:", creator.creator_username || "N/A");
                            console.log("Avatar URL:", creator.creator_avatar_url || "N/A");
                            console.log("Bio:", creator.creator_bio ? creator.creator_bio.substring(0, 100) + "..." : "N/A");
                            console.log("Followers:", creator.creator_follower_count || "N/A");
                            console.log("Verified:", creator.creator_verified || false);
                        }
                        if (video) {
                            console.log("\n[VIDEO METADATA]");
                            console.log("Video ID:", video.video_id || "N/A");
                            console.log("Like Count:", video.like_count || "N/A");
                            console.log("Comment Count:", video.comment_count || "N/A");
                            console.log("View Count:", video.view_count || "N/A");
                            console.log("Share Count:", video.share_count || "N/A");
                            console.log("Caption:", video.caption ? video.caption.substring(0, 100) + "..." : "N/A");
                            console.log("Hashtags:", video.hashtags ? video.hashtags.join(", ") : "N/A");
                            console.log("Timestamp:", video.timestamp ? new Date(video.timestamp * 1000).toISOString() : "N/A");
                            console.log("Requires Login:", video.requiresLogin || false);
                        }
                    }
                    else {
                        results.push({
                            url: url,
                            platform: "unknown",
                            success: false,
                            metadata: null,
                            error: "No metadata extracted",
                        });
                        console.log("Failed: No metadata extracted");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    results.push({
                        url: url,
                        platform: "unknown",
                        success: false,
                        metadata: null,
                        error: error_1 instanceof Error ? error_1.message : String(error_1),
                    });
                    console.log("Error:", error_1 instanceof Error ? error_1.message : String(error_1));
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log("\n=== Test Summary ===");
                    successCount = results.filter(function (r) { return r.success; }).length;
                    failCount = results.filter(function (r) { return !r.success; }).length;
                    console.log("Total: ".concat(results.length));
                    console.log("Success: ".concat(successCount));
                    console.log("Failed: ".concat(failCount));
                    return [2 /*return*/, results];
            }
        });
    });
}
testScraper()
    .then(function (results) {
    var allSuccess = results.every(function (r) { return r.success; });
    if (!allSuccess) {
        console.error("Some tests failed");
    }
})
    .catch(function (error) {
    console.error("Fatal error:", error);
});
