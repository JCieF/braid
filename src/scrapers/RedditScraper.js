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
exports.RedditScraper = void 0;
var CreatorMetadataScraper_js_1 = require("./CreatorMetadataScraper.js");
var RedditScraper = /** @class */ (function (_super) {
    __extends(RedditScraper, _super);
    function RedditScraper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RedditScraper.prototype.getCreatorProfileUrl = function (videoUrl) {
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
    RedditScraper.prototype.extractMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var username, usernameSelectors, _i, usernameSelectors_1, selector, link, match, profileUrl, metadata, karmaSelectors, karmaText, karmaMatch, bioSelectors, _a, bioSelectors_1, selector, bio, avatarSelectors, _b, avatarSelectors_1, selector, avatar, verifiedSelectors, _c, verifiedSelectors_1, selector, verified, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 23, , 24]);
                        this.logger.log("Extracting Reddit creator metadata...", "info");
                        return [4 /*yield*/, page.goto(videoUrl, { waitUntil: "domcontentloaded" })];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 2:
                        _d.sent();
                        username = null;
                        usernameSelectors = [
                            'a[href^="/user/"]',
                            'a[href^="/u/"]',
                            '[data-testid="post_author_link"]',
                            'a.author'
                        ];
                        _i = 0, usernameSelectors_1 = usernameSelectors;
                        _d.label = 3;
                    case 3:
                        if (!(_i < usernameSelectors_1.length)) return [3 /*break*/, 6];
                        selector = usernameSelectors_1[_i];
                        return [4 /*yield*/, this.getElementAttribute(page, selector, "href")];
                    case 4:
                        link = _d.sent();
                        if (link) {
                            match = link.match(/\/(?:u|user)\/([^\/\?]+)/);
                            if (match) {
                                username = match[1];
                                return [3 /*break*/, 6];
                            }
                        }
                        _d.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (!username) {
                            this.logger.log("Could not find Reddit username", "warn");
                            return [2 /*return*/, null];
                        }
                        profileUrl = "https://www.reddit.com/user/".concat(username, "/");
                        return [4 /*yield*/, page.goto(profileUrl, { waitUntil: "domcontentloaded" })];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 8:
                        _d.sent();
                        metadata = {
                            platform: "reddit",
                            url: profileUrl,
                            creator_username: username,
                            extractedAt: Date.now(),
                        };
                        metadata.creator_name = username;
                        karmaSelectors = [
                            '[data-testid="karma"]',
                            '.karma',
                            'span[title*="karma"]'
                        ];
                        return [4 /*yield*/, page.evaluate(function () {
                                var elements = document.querySelectorAll('*');
                                for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                                    var el = elements_1[_i];
                                    var text = el.textContent || "";
                                    if (text.includes("karma") || text.includes("Karma")) {
                                        return text;
                                    }
                                }
                                return null;
                            })];
                    case 9:
                        karmaText = _d.sent();
                        if (karmaText) {
                            karmaMatch = karmaText.match(/([\d,]+)/);
                            if (karmaMatch) {
                                metadata.creator_follower_count = this.parseCount(karmaMatch[1]);
                            }
                        }
                        bioSelectors = [
                            '[data-testid="user-about"]',
                            '.user-about',
                            'p[data-testid="user-bio"]'
                        ];
                        _a = 0, bioSelectors_1 = bioSelectors;
                        _d.label = 10;
                    case 10:
                        if (!(_a < bioSelectors_1.length)) return [3 /*break*/, 13];
                        selector = bioSelectors_1[_a];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 11:
                        bio = _d.sent();
                        if (bio && bio.length > 5) {
                            metadata.creator_bio = this.cleanText(bio);
                            return [3 /*break*/, 13];
                        }
                        _d.label = 12;
                    case 12:
                        _a++;
                        return [3 /*break*/, 10];
                    case 13:
                        avatarSelectors = [
                            'img[alt*="avatar"]',
                            'img[alt*="snoo"]',
                            '[data-testid="user-avatar"] img'
                        ];
                        _b = 0, avatarSelectors_1 = avatarSelectors;
                        _d.label = 14;
                    case 14:
                        if (!(_b < avatarSelectors_1.length)) return [3 /*break*/, 17];
                        selector = avatarSelectors_1[_b];
                        return [4 /*yield*/, this.getElementAttribute(page, selector, "src")];
                    case 15:
                        avatar = _d.sent();
                        if (avatar) {
                            metadata.creator_avatar_url = avatar;
                            return [3 /*break*/, 17];
                        }
                        _d.label = 16;
                    case 16:
                        _b++;
                        return [3 /*break*/, 14];
                    case 17:
                        verifiedSelectors = [
                            '[data-testid="mod-badge"]',
                            '[data-testid="admin-badge"]'
                        ];
                        _c = 0, verifiedSelectors_1 = verifiedSelectors;
                        _d.label = 18;
                    case 18:
                        if (!(_c < verifiedSelectors_1.length)) return [3 /*break*/, 22];
                        selector = verifiedSelectors_1[_c];
                        return [4 /*yield*/, page.locator(selector).first()];
                    case 19:
                        verified = _d.sent();
                        return [4 /*yield*/, verified.isVisible({ timeout: 2000 }).catch(function () { return false; })];
                    case 20:
                        if (_d.sent()) {
                            metadata.creator_verified = true;
                            return [3 /*break*/, 22];
                        }
                        _d.label = 21;
                    case 21:
                        _c++;
                        return [3 /*break*/, 18];
                    case 22:
                        this.logger.log("Successfully extracted Reddit creator metadata", "info");
                        return [2 /*return*/, metadata];
                    case 23:
                        error_1 = _d.sent();
                        this.logger.log("Failed to extract Reddit metadata: ".concat(error_1), "error");
                        return [2 /*return*/, null];
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    return RedditScraper;
}(CreatorMetadataScraper_js_1.CreatorMetadataScraper));
exports.RedditScraper = RedditScraper;
