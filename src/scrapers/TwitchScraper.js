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
exports.TwitchScraper = void 0;
var CreatorMetadataScraper_js_1 = require("./CreatorMetadataScraper.js");
var TwitchScraper = /** @class */ (function (_super) {
    __extends(TwitchScraper, _super);
    function TwitchScraper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TwitchScraper.prototype.getCreatorProfileUrl = function (videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var match;
            return __generator(this, function (_a) {
                try {
                    match = videoUrl.match(/twitch\.tv\/([^\/\?]+)/);
                    if (match && match[1] !== "videos") {
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
    TwitchScraper.prototype.extractMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var profileUrl, link, metadata, usernameMatch, nameSelectors, _i, nameSelectors_1, selector, name_1, bioSelectors, _a, bioSelectors_1, selector, bio, followerSelectors, _b, followerSelectors_1, selector, followerText, avatarSelectors, _c, avatarSelectors_1, selector, avatar, verifiedSelectors, _d, verifiedSelectors_1, selector, verified, error_1;
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
                        error_1 = _e.sent();
                        this.logger.log("Failed to extract Twitch metadata: ".concat(error_1), "error");
                        return [2 /*return*/, null];
                    case 30: return [2 /*return*/];
                }
            });
        });
    };
    return TwitchScraper;
}(CreatorMetadataScraper_js_1.CreatorMetadataScraper));
exports.TwitchScraper = TwitchScraper;
