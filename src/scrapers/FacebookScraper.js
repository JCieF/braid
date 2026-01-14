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
exports.FacebookScraper = void 0;
var CreatorMetadataScraper_js_1 = require("./CreatorMetadataScraper.js");
var FacebookScraper = /** @class */ (function (_super) {
    __extends(FacebookScraper, _super);
    function FacebookScraper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FacebookScraper.prototype.getCreatorProfileUrl = function (videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var match;
            return __generator(this, function (_a) {
                try {
                    match = videoUrl.match(/facebook\.com\/([^\/\?]+)/);
                    if (match && !match[1].includes("watch")) {
                        return [2 /*return*/, "https://www.facebook.com/".concat(match[1])];
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
    FacebookScraper.prototype.extractMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var profileUrl, links, _i, links_1, link, href, metadata, nameSelectors, _a, nameSelectors_1, selector, name_1, bioSelectors, _b, bioSelectors_1, selector, bio, followerSelectors, _c, followerSelectors_1, selector, followerText, avatarSelectors, _d, avatarSelectors_1, selector, avatar, verifiedSelectors, _e, verifiedSelectors_1, selector, verified, error_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 31, , 32]);
                        this.logger.log("Extracting Facebook creator metadata...", "info");
                        return [4 /*yield*/, page.goto(videoUrl, { waitUntil: "domcontentloaded" })];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 2:
                        _f.sent();
                        profileUrl = null;
                        return [4 /*yield*/, page.locator('a[href*="facebook.com"]').all()];
                    case 3:
                        links = _f.sent();
                        _i = 0, links_1 = links;
                        _f.label = 4;
                    case 4:
                        if (!(_i < links_1.length)) return [3 /*break*/, 7];
                        link = links_1[_i];
                        return [4 /*yield*/, link.getAttribute("href")];
                    case 5:
                        href = _f.sent();
                        if (href && !href.includes("/watch") && !href.includes("/videos") && href.match(/facebook\.com\/[^\/]+$/)) {
                            profileUrl = href;
                            return [3 /*break*/, 7];
                        }
                        _f.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        if (!profileUrl) {
                            this.logger.log("Could not find Facebook profile URL", "warn");
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, page.goto(profileUrl, { waitUntil: "domcontentloaded" })];
                    case 8:
                        _f.sent();
                        return [4 /*yield*/, this.delay(3000)];
                    case 9:
                        _f.sent();
                        metadata = {
                            platform: "facebook",
                            url: profileUrl,
                            extractedAt: Date.now(),
                        };
                        nameSelectors = [
                            'h1',
                            '[data-testid="profile-name"]',
                            'header h1'
                        ];
                        _a = 0, nameSelectors_1 = nameSelectors;
                        _f.label = 10;
                    case 10:
                        if (!(_a < nameSelectors_1.length)) return [3 /*break*/, 13];
                        selector = nameSelectors_1[_a];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 11:
                        name_1 = _f.sent();
                        if (name_1 && name_1.length > 0) {
                            metadata.creator_name = this.cleanText(name_1);
                            return [3 /*break*/, 13];
                        }
                        _f.label = 12;
                    case 12:
                        _a++;
                        return [3 /*break*/, 10];
                    case 13:
                        bioSelectors = [
                            '[data-testid="profile-bio"]',
                            '.profile-bio',
                            'div[data-testid="profile-info"]'
                        ];
                        _b = 0, bioSelectors_1 = bioSelectors;
                        _f.label = 14;
                    case 14:
                        if (!(_b < bioSelectors_1.length)) return [3 /*break*/, 17];
                        selector = bioSelectors_1[_b];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 15:
                        bio = _f.sent();
                        if (bio && bio.length > 5) {
                            metadata.creator_bio = this.cleanText(bio);
                            return [3 /*break*/, 17];
                        }
                        _f.label = 16;
                    case 16:
                        _b++;
                        return [3 /*break*/, 14];
                    case 17:
                        followerSelectors = [
                            '[data-testid="followers"]',
                            'a[href*="/followers"]'
                        ];
                        _c = 0, followerSelectors_1 = followerSelectors;
                        _f.label = 18;
                    case 18:
                        if (!(_c < followerSelectors_1.length)) return [3 /*break*/, 21];
                        selector = followerSelectors_1[_c];
                        return [4 /*yield*/, this.getElementText(page, selector)];
                    case 19:
                        followerText = _f.sent();
                        if (followerText) {
                            metadata.creator_follower_count = this.parseCount(followerText);
                            return [3 /*break*/, 21];
                        }
                        _f.label = 20;
                    case 20:
                        _c++;
                        return [3 /*break*/, 18];
                    case 21:
                        avatarSelectors = [
                            'img[alt*="profile picture"]',
                            'img[alt*="Profile picture"]',
                            '[data-testid="profile-picture"] img'
                        ];
                        _d = 0, avatarSelectors_1 = avatarSelectors;
                        _f.label = 22;
                    case 22:
                        if (!(_d < avatarSelectors_1.length)) return [3 /*break*/, 25];
                        selector = avatarSelectors_1[_d];
                        return [4 /*yield*/, this.getElementAttribute(page, selector, "src")];
                    case 23:
                        avatar = _f.sent();
                        if (avatar) {
                            metadata.creator_avatar_url = avatar;
                            return [3 /*break*/, 25];
                        }
                        _f.label = 24;
                    case 24:
                        _d++;
                        return [3 /*break*/, 22];
                    case 25:
                        verifiedSelectors = [
                            '[aria-label*="Verified"]',
                            '[data-testid="verified-badge"]'
                        ];
                        _e = 0, verifiedSelectors_1 = verifiedSelectors;
                        _f.label = 26;
                    case 26:
                        if (!(_e < verifiedSelectors_1.length)) return [3 /*break*/, 30];
                        selector = verifiedSelectors_1[_e];
                        return [4 /*yield*/, page.locator(selector).first()];
                    case 27:
                        verified = _f.sent();
                        return [4 /*yield*/, verified.isVisible({ timeout: 2000 }).catch(function () { return false; })];
                    case 28:
                        if (_f.sent()) {
                            metadata.creator_verified = true;
                            return [3 /*break*/, 30];
                        }
                        _f.label = 29;
                    case 29:
                        _e++;
                        return [3 /*break*/, 26];
                    case 30:
                        this.logger.log("Successfully extracted Facebook creator metadata", "info");
                        return [2 /*return*/, metadata];
                    case 31:
                        error_1 = _f.sent();
                        this.logger.log("Failed to extract Facebook metadata: ".concat(error_1), "error");
                        return [2 /*return*/, null];
                    case 32: return [2 /*return*/];
                }
            });
        });
    };
    return FacebookScraper;
}(CreatorMetadataScraper_js_1.CreatorMetadataScraper));
exports.FacebookScraper = FacebookScraper;
