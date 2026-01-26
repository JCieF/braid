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
    RedditScraper.prototype.extractVideoMetadata = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, postIdMatch, postId, metadata, apiData, embeddedData, domData, subredditMatch, subreddit, userMentions, _i, userMentions_1, mention, error_2;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 14, , 15]);
                        this.logger.log("Extracting Reddit video metadata...", "info");
                        return [4 /*yield*/, page.goto(videoUrl, { waitUntil: "domcontentloaded" })];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, this.delay(5000)];
                    case 2:
                        _e.sent();
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, page.waitForSelector('shreddit-post, [data-testid="post-container"], article, faceplate-number', { timeout: 5000 })];
                    case 4:
                        _e.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _e.sent();
                        this.logger.log("Post container selector not found, continuing anyway", "debug");
                        return [3 /*break*/, 6];
                    case 6: return [4 /*yield*/, page.evaluate(function () {
                            window.scrollTo(0, document.body.scrollHeight / 2);
                        })];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, this.delay(2000)];
                    case 8:
                        _e.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                window.scrollTo(0, 0);
                            })];
                    case 9:
                        _e.sent();
                        return [4 /*yield*/, this.delay(1000)];
                    case 10:
                        _e.sent();
                        postIdMatch = videoUrl.match(/\/comments\/([a-z0-9]+)/);
                        postId = postIdMatch ? postIdMatch[1] : null;
                        this.logger.log("Extracted post ID: ".concat(postId || "N/A"), "debug");
                        metadata = {
                            platform: "reddit",
                            url: videoUrl,
                            extractedAt: Date.now(),
                        };
                        if (postId) {
                            metadata.video_id = postId;
                        }
                        this.logger.log("Attempting to fetch from Reddit JSON API...", "debug");
                        return [4 /*yield*/, this.fetchFromRedditAPI(page, videoUrl)];
                    case 11:
                        apiData = _e.sent();
                        if (apiData) {
                            this.logger.log("Reddit API data: ".concat(JSON.stringify(apiData)), "debug");
                            if (apiData.like_count !== undefined)
                                metadata.like_count = apiData.like_count;
                            if (apiData.comment_count !== undefined)
                                metadata.comment_count = apiData.comment_count;
                            if (apiData.view_count !== undefined)
                                metadata.view_count = apiData.view_count;
                            if (apiData.timestamp !== undefined)
                                metadata.timestamp = apiData.timestamp;
                            if (apiData.caption)
                                metadata.caption = apiData.caption;
                            if (apiData.is_video !== undefined)
                                metadata.is_video = apiData.is_video;
                            if (apiData.save_count !== undefined)
                                metadata.save_count = apiData.save_count;
                            if (apiData.upvote_ratio !== undefined)
                                metadata.upvote_ratio = apiData.upvote_ratio;
                            if (apiData.is_self !== undefined)
                                metadata.is_self = apiData.is_self;
                            if (apiData.is_gallery !== undefined)
                                metadata.is_gallery = apiData.is_gallery;
                            if (apiData.spoiler !== undefined)
                                metadata.spoiler = apiData.spoiler;
                            if (apiData.locked !== undefined)
                                metadata.locked = apiData.locked;
                            if (apiData.stickied !== undefined)
                                metadata.stickied = apiData.stickied;
                            if (apiData.over_18 !== undefined)
                                metadata.over_18 = apiData.over_18;
                            if (apiData.link_flair_text)
                                metadata.link_flair_text = apiData.link_flair_text;
                            if (apiData.link_flair_css_class)
                                metadata.link_flair_css_class = apiData.link_flair_css_class;
                            if (apiData.domain)
                                metadata.domain = apiData.domain;
                            if (apiData.selftext_html)
                                metadata.selftext_html = apiData.selftext_html;
                            if (apiData.author_fullname)
                                metadata.author_fullname = apiData.author_fullname;
                            if (apiData.subreddit_id)
                                metadata.subreddit_id = apiData.subreddit_id;
                            if (apiData.thumbnail_height)
                                metadata.thumbnail_height = apiData.thumbnail_height;
                            if (apiData.thumbnail_width)
                                metadata.thumbnail_width = apiData.thumbnail_width;
                        }
                        else {
                            this.logger.log("No data from Reddit API, falling back to embedded JSON...", "debug");
                        }
                        this.logger.log("Attempting to extract from embedded JSON...", "debug");
                        return [4 /*yield*/, this.extractFromEmbeddedJSON(page)];
                    case 12:
                        embeddedData = _e.sent();
                        if (embeddedData) {
                            this.logger.log("Embedded JSON extracted: ".concat(JSON.stringify(embeddedData)), "debug");
                            if (embeddedData.like_count !== undefined) {
                                metadata.like_count = embeddedData.like_count;
                                this.logger.log("Like count from JSON: ".concat(embeddedData.like_count), "debug");
                            }
                            if (embeddedData.comment_count !== undefined) {
                                metadata.comment_count = embeddedData.comment_count;
                                this.logger.log("Comment count from JSON: ".concat(embeddedData.comment_count), "debug");
                            }
                            if (embeddedData.view_count !== undefined) {
                                metadata.view_count = embeddedData.view_count;
                                this.logger.log("View count from JSON: ".concat(embeddedData.view_count), "debug");
                            }
                            if (embeddedData.timestamp !== undefined) {
                                metadata.timestamp = embeddedData.timestamp;
                                this.logger.log("Timestamp from JSON: ".concat(new Date(embeddedData.timestamp * 1000).toISOString()), "debug");
                            }
                            if (embeddedData.caption) {
                                metadata.caption = embeddedData.caption;
                                this.logger.log("Caption from JSON: ".concat(embeddedData.caption.substring(0, 50), "..."), "debug");
                            }
                            if (embeddedData.hashtags) {
                                metadata.hashtags = embeddedData.hashtags;
                                this.logger.log("Hashtags from JSON: ".concat(embeddedData.hashtags.join(", ")), "debug");
                            }
                            if (embeddedData.mentions) {
                                metadata.mentions = embeddedData.mentions;
                                this.logger.log("Mentions from JSON: ".concat(embeddedData.mentions.join(", ")), "debug");
                            }
                            if (embeddedData.is_video !== undefined) {
                                metadata.is_video = embeddedData.is_video;
                                this.logger.log("Is video from JSON: ".concat(embeddedData.is_video), "debug");
                            }
                            if (embeddedData.save_count !== undefined) {
                                metadata.save_count = embeddedData.save_count;
                                this.logger.log("Save count (awards) from JSON: ".concat(embeddedData.save_count), "debug");
                            }
                            if (embeddedData.upvote_ratio !== undefined)
                                metadata.upvote_ratio = embeddedData.upvote_ratio;
                            if (embeddedData.is_self !== undefined)
                                metadata.is_self = embeddedData.is_self;
                            if (embeddedData.is_gallery !== undefined)
                                metadata.is_gallery = embeddedData.is_gallery;
                            if (embeddedData.spoiler !== undefined)
                                metadata.spoiler = embeddedData.spoiler;
                            if (embeddedData.locked !== undefined)
                                metadata.locked = embeddedData.locked;
                            if (embeddedData.stickied !== undefined)
                                metadata.stickied = embeddedData.stickied;
                            if (embeddedData.over_18 !== undefined)
                                metadata.over_18 = embeddedData.over_18;
                            if (embeddedData.link_flair_text)
                                metadata.link_flair_text = embeddedData.link_flair_text;
                            if (embeddedData.link_flair_css_class)
                                metadata.link_flair_css_class = embeddedData.link_flair_css_class;
                            if (embeddedData.domain)
                                metadata.domain = embeddedData.domain;
                            if (embeddedData.selftext_html)
                                metadata.selftext_html = embeddedData.selftext_html;
                            if (embeddedData.author_fullname)
                                metadata.author_fullname = embeddedData.author_fullname;
                        }
                        else {
                            this.logger.log("No data found in embedded JSON", "debug");
                        }
                        this.logger.log("Attempting to extract from DOM...", "debug");
                        return [4 /*yield*/, this.extractFromDOM(page)];
                    case 13:
                        domData = _e.sent();
                        if (domData) {
                            this.logger.log("DOM extracted: ".concat(JSON.stringify(domData)), "debug");
                            if (domData.like_count !== undefined && !metadata.like_count) {
                                metadata.like_count = domData.like_count;
                                this.logger.log("Like count from DOM: ".concat(domData.like_count), "debug");
                            }
                            if (domData.comment_count !== undefined && !metadata.comment_count) {
                                metadata.comment_count = domData.comment_count;
                                this.logger.log("Comment count from DOM: ".concat(domData.comment_count), "debug");
                            }
                            if (domData.view_count !== undefined && !metadata.view_count) {
                                metadata.view_count = domData.view_count;
                                this.logger.log("View count from DOM: ".concat(domData.view_count), "debug");
                            }
                            if (domData.caption && !metadata.caption) {
                                metadata.caption = domData.caption;
                                this.logger.log("Caption from DOM: ".concat(domData.caption.substring(0, 50), "..."), "debug");
                            }
                            if (domData.hashtags && !metadata.hashtags) {
                                metadata.hashtags = domData.hashtags;
                                this.logger.log("Hashtags from DOM: ".concat(domData.hashtags.join(", ")), "debug");
                            }
                            if (domData.mentions && !metadata.mentions) {
                                metadata.mentions = domData.mentions;
                                this.logger.log("Mentions from DOM: ".concat(domData.mentions.join(", ")), "debug");
                            }
                            if (domData.timestamp !== undefined && !metadata.timestamp) {
                                metadata.timestamp = domData.timestamp;
                                this.logger.log("Timestamp from DOM: ".concat(new Date(domData.timestamp * 1000).toISOString()), "debug");
                            }
                            if (domData.is_video !== undefined) {
                                metadata.is_video = domData.is_video;
                                this.logger.log("Is video from DOM: ".concat(domData.is_video), "debug");
                            }
                            if (domData.save_count !== undefined && !metadata.save_count) {
                                metadata.save_count = domData.save_count;
                                this.logger.log("Save count (awards) from DOM: ".concat(domData.save_count), "debug");
                            }
                            if (domData.upvote_ratio !== undefined && metadata.upvote_ratio === undefined)
                                metadata.upvote_ratio = domData.upvote_ratio;
                            if (domData.is_self !== undefined && metadata.is_self === undefined)
                                metadata.is_self = domData.is_self;
                            if (domData.is_gallery !== undefined && metadata.is_gallery === undefined)
                                metadata.is_gallery = domData.is_gallery;
                            if (domData.spoiler !== undefined && metadata.spoiler === undefined)
                                metadata.spoiler = domData.spoiler;
                            if (domData.locked !== undefined && metadata.locked === undefined)
                                metadata.locked = domData.locked;
                            if (domData.stickied !== undefined && metadata.stickied === undefined)
                                metadata.stickied = domData.stickied;
                            if (domData.over_18 !== undefined && metadata.over_18 === undefined)
                                metadata.over_18 = domData.over_18;
                            if (domData.link_flair_text && !metadata.link_flair_text)
                                metadata.link_flair_text = domData.link_flair_text;
                            if (domData.link_flair_css_class && !metadata.link_flair_css_class)
                                metadata.link_flair_css_class = domData.link_flair_css_class;
                            if (domData.domain && !metadata.domain)
                                metadata.domain = domData.domain;
                            if (domData.selftext_html && !metadata.selftext_html)
                                metadata.selftext_html = domData.selftext_html;
                            if (domData.author_fullname && !metadata.author_fullname)
                                metadata.author_fullname = domData.author_fullname;
                            if (domData.subreddit_id && !metadata.subreddit_id)
                                metadata.subreddit_id = domData.subreddit_id;
                        }
                        else {
                            this.logger.log("No data found in DOM", "debug");
                        }
                        subredditMatch = videoUrl.match(/\/r\/([^\/]+)/);
                        if (subredditMatch) {
                            subreddit = subredditMatch[1];
                            metadata.mentions = metadata.mentions || [];
                            if (!metadata.mentions.includes("r/".concat(subreddit))) {
                                metadata.mentions.unshift("r/".concat(subreddit));
                            }
                            this.logger.log("Subreddit: r/".concat(subreddit), "debug");
                        }
                        if (metadata.caption) {
                            userMentions = metadata.caption.match(/u\/[\w-]+/g);
                            if (userMentions) {
                                metadata.mentions = metadata.mentions || [];
                                for (_i = 0, userMentions_1 = userMentions; _i < userMentions_1.length; _i++) {
                                    mention = userMentions_1[_i];
                                    if (!metadata.mentions.includes(mention)) {
                                        metadata.mentions.push(mention);
                                    }
                                }
                                this.logger.log("User mentions from caption: ".concat(userMentions.join(", ")), "debug");
                            }
                        }
                        this.logger.log("=== REDDIT VIDEO METADATA EXTRACTION RESULTS ===", "info");
                        this.logger.log("Post ID: ".concat(metadata.video_id || "N/A"), "info");
                        this.logger.log("Like Count (Upvotes): ".concat((_a = metadata.like_count) !== null && _a !== void 0 ? _a : "N/A"), "info");
                        this.logger.log("Comment Count: ".concat((_b = metadata.comment_count) !== null && _b !== void 0 ? _b : "N/A"), "info");
                        this.logger.log("View Count: ".concat((_c = metadata.view_count) !== null && _c !== void 0 ? _c : "N/A"), "info");
                        this.logger.log("Save Count (Awards): ".concat((_d = metadata.save_count) !== null && _d !== void 0 ? _d : "N/A"), "info");
                        this.logger.log("Caption: ".concat(metadata.caption ? metadata.caption.substring(0, 80) + "..." : "N/A"), "info");
                        this.logger.log("Hashtags: ".concat(metadata.hashtags ? metadata.hashtags.join(", ") : "N/A"), "info");
                        this.logger.log("Mentions: ".concat(metadata.mentions ? metadata.mentions.join(", ") : "N/A"), "info");
                        this.logger.log("Is Video: ".concat(metadata.is_video !== undefined ? metadata.is_video : "N/A"), "info");
                        this.logger.log("Timestamp: ".concat(metadata.timestamp ? new Date(metadata.timestamp * 1000).toISOString() : "N/A"), "info");
                        this.logger.log("--- Fields yt-dlp CANNOT get ---", "info");
                        this.logger.log("Upvote Ratio: ".concat(metadata.upvote_ratio !== undefined ? metadata.upvote_ratio : "N/A"), "info");
                        this.logger.log("Is Self Post: ".concat(metadata.is_self !== undefined ? metadata.is_self : "N/A"), "info");
                        this.logger.log("Is Gallery: ".concat(metadata.is_gallery !== undefined ? metadata.is_gallery : "N/A"), "info");
                        this.logger.log("Spoiler: ".concat(metadata.spoiler !== undefined ? metadata.spoiler : "N/A"), "info");
                        this.logger.log("Locked: ".concat(metadata.locked !== undefined ? metadata.locked : "N/A"), "info");
                        this.logger.log("Stickied: ".concat(metadata.stickied !== undefined ? metadata.stickied : "N/A"), "info");
                        this.logger.log("Over 18 (NSFW): ".concat(metadata.over_18 !== undefined ? metadata.over_18 : "N/A"), "info");
                        this.logger.log("Link Flair: ".concat(metadata.link_flair_text || "N/A"), "info");
                        this.logger.log("Domain: ".concat(metadata.domain || "N/A"), "info");
                        this.logger.log("Author Fullname: ".concat(metadata.author_fullname || "N/A"), "info");
                        this.logger.log("Subreddit ID: ".concat(metadata.subreddit_id || "N/A"), "info");
                        this.logger.log("Has Selftext HTML: ".concat(metadata.selftext_html ? "Yes" : "No"), "info");
                        this.logger.log("=== END REDDIT METADATA ===", "info");
                        this.logger.log("Successfully extracted Reddit video metadata", "info");
                        return [2 /*return*/, metadata];
                    case 14:
                        error_2 = _e.sent();
                        this.logger.log("Failed to extract Reddit video metadata: ".concat(error_2), "error");
                        return [2 /*return*/, null];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    RedditScraper.prototype.fetchFromRedditAPI = function (page, videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonUrl, response, postData, result, error_3;
            var _this = this;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        jsonUrl = videoUrl.replace(/\/$/, '') + '.json';
                        return [4 /*yield*/, page.evaluate(function (url) { return __awaiter(_this, void 0, void 0, function () {
                                var res, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 3, , 4]);
                                            return [4 /*yield*/, fetch(url, {
                                                    headers: { 'User-Agent': 'Mozilla/5.0' }
                                                })];
                                        case 1:
                                            res = _b.sent();
                                            if (!res.ok)
                                                return [2 /*return*/, null];
                                            return [4 /*yield*/, res.json()];
                                        case 2: return [2 /*return*/, _b.sent()];
                                        case 3:
                                            _a = _b.sent();
                                            return [2 /*return*/, null];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }, jsonUrl)];
                    case 1:
                        response = _e.sent();
                        if (!response || !Array.isArray(response) || response.length === 0) {
                            return [2 /*return*/, null];
                        }
                        postData = (_d = (_c = (_b = (_a = response[0]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.children) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.data;
                        if (!postData)
                            return [2 /*return*/, null];
                        result = {};
                        if (postData.ups !== undefined)
                            result.like_count = postData.ups;
                        if (postData.score !== undefined && !result.like_count)
                            result.like_count = postData.score;
                        if (postData.num_comments !== undefined)
                            result.comment_count = postData.num_comments;
                        if (postData.view_count !== undefined)
                            result.view_count = postData.view_count;
                        if (postData.title)
                            result.caption = postData.title;
                        if (postData.created_utc)
                            result.timestamp = Math.floor(postData.created_utc);
                        if (postData.is_video !== undefined)
                            result.is_video = postData.is_video;
                        if (postData.total_awards_received !== undefined)
                            result.save_count = postData.total_awards_received;
                        if (postData.upvote_ratio !== undefined)
                            result.upvote_ratio = postData.upvote_ratio;
                        if (postData.is_self !== undefined)
                            result.is_self = postData.is_self;
                        if (postData.is_gallery !== undefined)
                            result.is_gallery = postData.is_gallery;
                        if (postData.spoiler !== undefined)
                            result.spoiler = postData.spoiler;
                        if (postData.locked !== undefined)
                            result.locked = postData.locked;
                        if (postData.stickied !== undefined)
                            result.stickied = postData.stickied;
                        if (postData.over_18 !== undefined)
                            result.over_18 = postData.over_18;
                        if (postData.link_flair_text)
                            result.link_flair_text = postData.link_flair_text;
                        if (postData.link_flair_css_class)
                            result.link_flair_css_class = postData.link_flair_css_class;
                        if (postData.domain)
                            result.domain = postData.domain;
                        if (postData.selftext_html)
                            result.selftext_html = postData.selftext_html;
                        if (postData.author_fullname)
                            result.author_fullname = postData.author_fullname;
                        if (postData.subreddit_id)
                            result.subreddit_id = postData.subreddit_id;
                        if (postData.thumbnail_height)
                            result.thumbnail_height = postData.thumbnail_height;
                        if (postData.thumbnail_width)
                            result.thumbnail_width = postData.thumbnail_width;
                        return [2 /*return*/, result];
                    case 2:
                        error_3 = _e.sent();
                        this.logger.log("Failed to fetch from Reddit API: ".concat(error_3), "debug");
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RedditScraper.prototype.extractFromEmbeddedJSON = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, page.evaluate(function () {
                                var _a, _b, _c, _d, _e, _f, _g;
                                var result = {};
                                if (window.__r) {
                                    var redditData = window.__r;
                                    if ((_b = (_a = redditData === null || redditData === void 0 ? void 0 : redditData.data) === null || _a === void 0 ? void 0 : _a.posts) === null || _b === void 0 ? void 0 : _b.models) {
                                        var post = Object.values(redditData.data.posts.models)[0];
                                        if (post) {
                                            result.like_count = post.ups || post.score;
                                            result.comment_count = post.numComments || post.num_comments || post.commentCount;
                                            result.view_count = post.viewCount || post.view_count || post.views;
                                            result.caption = post.title || post.titleText;
                                            if (post.created || post.createdUTC) {
                                                result.timestamp = post.created || post.createdUTC;
                                            }
                                            if (post.isVideo || ((_c = post.media) === null || _c === void 0 ? void 0 : _c.isVideo)) {
                                                result.is_video = true;
                                            }
                                            if (post.awards) {
                                                result.save_count = post.awards.totalAwardsReceived || post.awards.total_awards_received || post.totalAwardsReceived;
                                            }
                                            if (post.selftext) {
                                                result.caption = (result.caption || "") + " " + post.selftext;
                                            }
                                            if (post.upvoteRatio !== undefined)
                                                result.upvote_ratio = post.upvoteRatio;
                                            if (post.isSelf !== undefined)
                                                result.is_self = post.isSelf;
                                            if (post.isGallery !== undefined)
                                                result.is_gallery = post.isGallery;
                                            if (post.spoiler !== undefined)
                                                result.spoiler = post.spoiler;
                                            if (post.locked !== undefined)
                                                result.locked = post.locked;
                                            if (post.stickied !== undefined)
                                                result.stickied = post.stickied;
                                            if (post.over18 !== undefined)
                                                result.over_18 = post.over18;
                                            if (post.linkFlairText)
                                                result.link_flair_text = post.linkFlairText;
                                            if (post.linkFlairCssClass)
                                                result.link_flair_css_class = post.linkFlairCssClass;
                                            if (post.domain)
                                                result.domain = post.domain;
                                            if (post.selftextHtml)
                                                result.selftext_html = post.selftextHtml;
                                            if (post.authorFullname)
                                                result.author_fullname = post.authorFullname;
                                        }
                                    }
                                }
                                var scripts = document.querySelectorAll('script[type="application/json"], script[id*="data"], script');
                                var _loop_1 = function (script) {
                                    var content = script.textContent || '';
                                    if (content.includes('"ups"') || content.includes('"score"') || content.includes('"numComments"')) {
                                        try {
                                            var json = JSON.parse(content);
                                            var findPostData_1 = function (obj) {
                                                if (!obj || typeof obj !== 'object')
                                                    return null;
                                                if (obj.ups !== undefined || obj.score !== undefined || obj.numComments !== undefined) {
                                                    return obj;
                                                }
                                                for (var key in obj) {
                                                    var found = findPostData_1(obj[key]);
                                                    if (found)
                                                        return found;
                                                }
                                                return null;
                                            };
                                            var post = findPostData_1(json);
                                            if (post) {
                                                if (!result.like_count)
                                                    result.like_count = post.ups || post.score;
                                                if (!result.comment_count)
                                                    result.comment_count = post.numComments || post.num_comments || post.commentCount;
                                                if (!result.view_count)
                                                    result.view_count = post.viewCount || post.view_count || post.views;
                                                if (!result.caption)
                                                    result.caption = post.title || post.titleText;
                                                if (!result.timestamp && (post.created || post.createdUTC)) {
                                                    result.timestamp = post.created || post.createdUTC;
                                                }
                                                if ((post.isVideo || ((_d = post.media) === null || _d === void 0 ? void 0 : _d.isVideo)) && !result.is_video) {
                                                    result.is_video = true;
                                                }
                                                if (post.awards && !result.save_count) {
                                                    result.save_count = post.awards.totalAwardsReceived || post.awards.total_awards_received || post.totalAwardsReceived;
                                                }
                                                if (post.upvote_ratio !== undefined && !result.upvote_ratio)
                                                    result.upvote_ratio = post.upvote_ratio;
                                                if (post.is_self !== undefined && result.is_self === undefined)
                                                    result.is_self = post.is_self;
                                                if (post.is_gallery !== undefined && result.is_gallery === undefined)
                                                    result.is_gallery = post.is_gallery;
                                                if (post.spoiler !== undefined && result.spoiler === undefined)
                                                    result.spoiler = post.spoiler;
                                                if (post.locked !== undefined && result.locked === undefined)
                                                    result.locked = post.locked;
                                                if (post.stickied !== undefined && result.stickied === undefined)
                                                    result.stickied = post.stickied;
                                                if (post.over_18 !== undefined && result.over_18 === undefined)
                                                    result.over_18 = post.over_18;
                                                if (post.link_flair_text && !result.link_flair_text)
                                                    result.link_flair_text = post.link_flair_text;
                                                if (post.link_flair_css_class && !result.link_flair_css_class)
                                                    result.link_flair_css_class = post.link_flair_css_class;
                                                if (post.domain && !result.domain)
                                                    result.domain = post.domain;
                                                if (post.selftext_html && !result.selftext_html)
                                                    result.selftext_html = post.selftext_html;
                                                if (post.author_fullname && !result.author_fullname)
                                                    result.author_fullname = post.author_fullname;
                                            }
                                        }
                                        catch (e) {
                                            // Try window.__r pattern
                                            if (content.includes('window.__r = ')) {
                                                try {
                                                    var match = content.match(/window\.__r\s*=\s*({.+?});/s);
                                                    if (match) {
                                                        var json = JSON.parse(match[1]);
                                                        var posts = (_f = (_e = json === null || json === void 0 ? void 0 : json.data) === null || _e === void 0 ? void 0 : _e.posts) === null || _f === void 0 ? void 0 : _f.models;
                                                        if (posts) {
                                                            var post = Object.values(posts)[0];
                                                            if (post) {
                                                                if (!result.like_count)
                                                                    result.like_count = post.ups || post.score;
                                                                if (!result.comment_count)
                                                                    result.comment_count = post.numComments || post.num_comments || post.commentCount;
                                                                if (!result.view_count)
                                                                    result.view_count = post.viewCount || post.view_count || post.views;
                                                                if (!result.caption)
                                                                    result.caption = post.title || post.titleText;
                                                                if (!result.timestamp && (post.created || post.createdUTC)) {
                                                                    result.timestamp = post.created || post.createdUTC;
                                                                }
                                                                if ((post.isVideo || ((_g = post.media) === null || _g === void 0 ? void 0 : _g.isVideo)) && !result.is_video) {
                                                                    result.is_video = true;
                                                                }
                                                                if (post.awards && !result.save_count) {
                                                                    result.save_count = post.awards.totalAwardsReceived || post.awards.total_awards_received || post.totalAwardsReceived;
                                                                }
                                                                if (post.upvoteRatio !== undefined && !result.upvote_ratio)
                                                                    result.upvote_ratio = post.upvoteRatio;
                                                                if (post.isSelf !== undefined && result.is_self === undefined)
                                                                    result.is_self = post.isSelf;
                                                                if (post.isGallery !== undefined && result.is_gallery === undefined)
                                                                    result.is_gallery = post.isGallery;
                                                                if (post.spoiler !== undefined && result.spoiler === undefined)
                                                                    result.spoiler = post.spoiler;
                                                                if (post.locked !== undefined && result.locked === undefined)
                                                                    result.locked = post.locked;
                                                                if (post.stickied !== undefined && result.stickied === undefined)
                                                                    result.stickied = post.stickied;
                                                                if (post.over18 !== undefined && result.over_18 === undefined)
                                                                    result.over_18 = post.over18;
                                                                if (post.linkFlairText && !result.link_flair_text)
                                                                    result.link_flair_text = post.linkFlairText;
                                                                if (post.linkFlairCssClass && !result.link_flair_css_class)
                                                                    result.link_flair_css_class = post.linkFlairCssClass;
                                                                if (post.domain && !result.domain)
                                                                    result.domain = post.domain;
                                                                if (post.selftextHtml && !result.selftext_html)
                                                                    result.selftext_html = post.selftextHtml;
                                                                if (post.authorFullname && !result.author_fullname)
                                                                    result.author_fullname = post.authorFullname;
                                                            }
                                                        }
                                                    }
                                                }
                                                catch (e2) {
                                                    return "continue";
                                                }
                                            }
                                            else {
                                                return "continue";
                                            }
                                        }
                                    }
                                };
                                for (var _i = 0, scripts_1 = scripts; _i < scripts_1.length; _i++) {
                                    var script = scripts_1[_i];
                                    _loop_1(script);
                                }
                                return result;
                            })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_4 = _a.sent();
                        this.logger.log("Failed to extract from embedded JSON: ".concat(error_4), "debug");
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RedditScraper.prototype.extractFromDOM = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, page.evaluate(function () {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                var result = {};
                                var scoreSelectors = [
                                    '[data-testid="vote-arrows"] + span',
                                    '[data-click-id="upvote"] + span',
                                    'button[aria-label*="upvote"] + span',
                                    '[class*="vote"] [class*="score"]',
                                    '[data-testid="post-score"]',
                                    'faceplate-number[number]',
                                    '[data-testid="vote-arrows"] faceplate-number',
                                    'shreddit-post faceplate-number',
                                    '[slot="score"]',
                                    'span[slot="score"]'
                                ];
                                for (var _i = 0, scoreSelectors_1 = scoreSelectors; _i < scoreSelectors_1.length; _i++) {
                                    var selector = scoreSelectors_1[_i];
                                    var elements = document.querySelectorAll(selector);
                                    for (var _l = 0, elements_2 = elements; _l < elements_2.length; _l++) {
                                        var el = elements_2[_l];
                                        var text = (el.textContent || '').trim();
                                        var numberAttr = el.getAttribute('number');
                                        if (numberAttr) {
                                            var num = parseInt(numberAttr);
                                            if (num > 0 && num < 100000000) {
                                                result.like_count = num;
                                                break;
                                            }
                                        }
                                        if (text && /^[\d,]+[KMB]?$/.test(text)) {
                                            var num = parseFloat(text.replace(/,/g, '').replace(/[KMB]/i, ''));
                                            if (text.includes('K') || text.includes('k'))
                                                num *= 1000;
                                            else if (text.includes('M') || text.includes('m'))
                                                num *= 1000000;
                                            else if (text.includes('B') || text.includes('b'))
                                                num *= 1000000000;
                                            if (num > 0 && num < 100000000) {
                                                result.like_count = Math.floor(num);
                                                break;
                                            }
                                        }
                                    }
                                    if (result.like_count)
                                        break;
                                }
                                if (!result.like_count) {
                                    var upvoteSelectors = [
                                        '[data-testid="vote-arrows"]',
                                        'button[aria-label*="upvote"]',
                                        '[aria-label*="upvote"]',
                                        'button[aria-label*="Upvote"]',
                                        '.vote-button',
                                        '[data-click-id="upvote"]'
                                    ];
                                    for (var _m = 0, upvoteSelectors_1 = upvoteSelectors; _m < upvoteSelectors_1.length; _m++) {
                                        var selector = upvoteSelectors_1[_m];
                                        var elements = document.querySelectorAll(selector);
                                        for (var _o = 0, elements_3 = elements; _o < elements_3.length; _o++) {
                                            var el = elements_3[_o];
                                            var parent_1 = el.closest('[data-testid="post-container"], article, [class*="Post"], shreddit-post');
                                            if (parent_1) {
                                                var scoreEl = parent_1.querySelector('faceplate-number[number], [slot="score"], span[slot="score"]');
                                                if (scoreEl) {
                                                    var numberAttr = scoreEl.getAttribute('number');
                                                    if (numberAttr) {
                                                        var num = parseInt(numberAttr);
                                                        if (num > 0 && num < 100000000) {
                                                            result.like_count = num;
                                                            break;
                                                        }
                                                    }
                                                }
                                                var scoreText = parent_1.textContent || '';
                                                var scoreMatch = scoreText.match(/([\d,]+[KMB]?)\s*(?:upvotes?|points?|karma)/i);
                                                if (scoreMatch) {
                                                    var num = parseFloat(scoreMatch[1].replace(/,/g, '').replace(/[KMB]/i, ''));
                                                    if (scoreMatch[1].includes('K') || scoreMatch[1].includes('k'))
                                                        num *= 1000;
                                                    else if (scoreMatch[1].includes('M') || scoreMatch[1].includes('m'))
                                                        num *= 1000000;
                                                    else if (scoreMatch[1].includes('B') || scoreMatch[1].includes('b'))
                                                        num *= 1000000000;
                                                    if (num > 0 && num < 100000000) {
                                                        result.like_count = Math.floor(num);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        if (result.like_count)
                                            break;
                                    }
                                }
                                var commentSelectors = [
                                    'shreddit-post a[href*="comments"] faceplate-number[number]',
                                    'a[href*="/comments/"] faceplate-number[number]',
                                    'a[href*="/comments/"]',
                                    'button[aria-label*="comment"]',
                                    '[data-testid="comment-count"]',
                                    '[slot="comment-count"]'
                                ];
                                for (var _p = 0, commentSelectors_1 = commentSelectors; _p < commentSelectors_1.length; _p++) {
                                    var selector = commentSelectors_1[_p];
                                    var elements = document.querySelectorAll(selector);
                                    for (var _q = 0, elements_4 = elements; _q < elements_4.length; _q++) {
                                        var el = elements_4[_q];
                                        var isCommentLink = el.tagName === 'A' && ((_a = el.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.includes('/comments/'));
                                        var hasCommentText = ((_b = el.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('comment')) ||
                                            ((_c = el.getAttribute('aria-label')) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes('comment'));
                                        if (!isCommentLink && !hasCommentText)
                                            continue;
                                        var numberEl = el.querySelector('faceplate-number[number]') ||
                                            (el.tagName === 'FACEPLATE-NUMBER' ? el : null);
                                        if (numberEl) {
                                            var numberAttr = numberEl.getAttribute('number');
                                            if (numberAttr) {
                                                var num = parseInt(numberAttr);
                                                if (num >= 0 && num < 10000000 && num !== result.like_count) {
                                                    result.comment_count = num;
                                                    break;
                                                }
                                            }
                                        }
                                        var text = (el.textContent || '').trim();
                                        var ariaLabel = el.getAttribute('aria-label') || '';
                                        var searchText = text || ariaLabel;
                                        if (searchText && (searchText.toLowerCase().includes('comment') || /^[\d,]+[KMB]?\s*(comment|comments)?$/i.test(searchText))) {
                                            var match = searchText.match(/([\d,]+[KMB]?)/);
                                            if (match) {
                                                var num = parseFloat(match[1].replace(/,/g, '').replace(/[KMB]/i, ''));
                                                var matchText = match[1];
                                                if (matchText.includes('K') || matchText.includes('k'))
                                                    num *= 1000;
                                                else if (matchText.includes('M') || matchText.includes('m'))
                                                    num *= 1000000;
                                                else if (matchText.includes('B') || matchText.includes('b'))
                                                    num *= 1000000000;
                                                var finalNum = Math.floor(num);
                                                if (finalNum >= 0 && finalNum < 10000000 && finalNum !== result.like_count) {
                                                    result.comment_count = finalNum;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    if (result.comment_count !== undefined)
                                        break;
                                }
                                if (!result.comment_count) {
                                    var postContainer = document.querySelector('shreddit-post, [data-testid="post-container"], article');
                                    if (postContainer) {
                                        var commentButton = postContainer.querySelector('a[href*="/comments/"][href*="#"]') ||
                                            postContainer.querySelector('button[aria-label*="comment"]') ||
                                            postContainer.querySelector('a[href*="/comments/"]');
                                        if (commentButton) {
                                            var faceplateNumber = commentButton.querySelector('faceplate-number[number]') ||
                                                ((_d = commentButton.closest('div')) === null || _d === void 0 ? void 0 : _d.querySelector('faceplate-number[number]'));
                                            if (faceplateNumber) {
                                                var numberAttr = faceplateNumber.getAttribute('number');
                                                if (numberAttr) {
                                                    var num = parseInt(numberAttr);
                                                    if (num >= 0 && num < 10000000 && num !== result.like_count) {
                                                        result.comment_count = num;
                                                    }
                                                }
                                            }
                                            if (!result.comment_count) {
                                                var text = commentButton.textContent || '';
                                                var match = text.match(/([\d,]+[KMB]?)\s*(?:comment|comments)?/i);
                                                if (match) {
                                                    var num = parseFloat(match[1].replace(/,/g, '').replace(/[KMB]/i, ''));
                                                    if (match[1].includes('K') || match[1].includes('k'))
                                                        num *= 1000;
                                                    else if (match[1].includes('M') || match[1].includes('m'))
                                                        num *= 1000000;
                                                    else if (match[1].includes('B') || match[1].includes('b'))
                                                        num *= 1000000000;
                                                    var finalNum = Math.floor(num);
                                                    if (finalNum >= 0 && finalNum < 10000000 && finalNum !== result.like_count) {
                                                        result.comment_count = finalNum;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (!result.comment_count) {
                                    var voteSection = (_f = (_e = document.querySelector('[data-testid="vote-arrows"], [data-click-id="upvote"]')) === null || _e === void 0 ? void 0 : _e.closest('div')) === null || _f === void 0 ? void 0 : _f.parentElement;
                                    if (voteSection) {
                                        var commentButton = voteSection.querySelector('a[href*="/comments/"]:not([href*="/comment/"])');
                                        if (commentButton) {
                                            var faceplate = commentButton.querySelector('faceplate-number[number]') ||
                                                ((_g = commentButton.parentElement) === null || _g === void 0 ? void 0 : _g.querySelector('faceplate-number[number]'));
                                            if (faceplate) {
                                                var num = parseInt(faceplate.getAttribute('number') || '0');
                                                if (num > 0 && num < 10000000 && num !== result.like_count) {
                                                    result.comment_count = num;
                                                }
                                            }
                                            if (!result.comment_count) {
                                                var text = commentButton.textContent || '';
                                                var match = text.match(/([\d,]+[KMB]?)/);
                                                if (match) {
                                                    var num = parseFloat(match[1].replace(/,/g, '').replace(/[KMB]/i, ''));
                                                    if (match[1].includes('K') || match[1].includes('k'))
                                                        num *= 1000;
                                                    else if (match[1].includes('M') || match[1].includes('m'))
                                                        num *= 1000000;
                                                    else if (match[1].includes('B') || match[1].includes('b'))
                                                        num *= 1000000000;
                                                    var finalNum = Math.floor(num);
                                                    if (finalNum > 0 && finalNum < 10000000 && finalNum !== result.like_count) {
                                                        result.comment_count = finalNum;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (!result.comment_count) {
                                    var firstFaceplate = document.querySelector('faceplate-number[number]');
                                    if (firstFaceplate) {
                                        var firstNum = parseInt(firstFaceplate.getAttribute('number') || '0');
                                        var allFaceplates = Array.from(document.querySelectorAll('faceplate-number[number]'));
                                        for (var _r = 0, allFaceplates_1 = allFaceplates; _r < allFaceplates_1.length; _r++) {
                                            var fp = allFaceplates_1[_r];
                                            var num = parseInt(fp.getAttribute('number') || '0');
                                            if (num > 0 && num < 10000000 && num !== result.like_count && num !== firstNum) {
                                                var nearbyText = ((_j = (_h = fp.parentElement) === null || _h === void 0 ? void 0 : _h.textContent) === null || _j === void 0 ? void 0 : _j.toLowerCase()) || '';
                                                if (nearbyText.includes('comment') || nearbyText.match(/\d+\s*(comment|comments)/)) {
                                                    result.comment_count = num;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                var viewSelectors = [
                                    '[data-testid="view-count"]',
                                    'span[title*="view"]',
                                    '[aria-label*="view"]'
                                ];
                                for (var _s = 0, viewSelectors_1 = viewSelectors; _s < viewSelectors_1.length; _s++) {
                                    var selector = viewSelectors_1[_s];
                                    var el = document.querySelector(selector);
                                    if (el) {
                                        var text = (el.textContent || '').trim();
                                        var title = el.getAttribute('title') || '';
                                        var searchText = text || title;
                                        if (searchText && searchText.toLowerCase().includes('view')) {
                                            var match = searchText.match(/([\d,]+[KMB]?)/);
                                            if (match) {
                                                var num = parseFloat(match[1].replace(/,/g, '').replace(/[KMB]/i, ''));
                                                var matchText = match[1];
                                                if (matchText.includes('K') || matchText.includes('k'))
                                                    num *= 1000;
                                                else if (matchText.includes('M') || matchText.includes('m'))
                                                    num *= 1000000;
                                                else if (matchText.includes('B') || matchText.includes('b'))
                                                    num *= 1000000000;
                                                result.view_count = Math.floor(num);
                                                break;
                                            }
                                        }
                                    }
                                }
                                var titleSelectors = [
                                    '[data-testid="post-content"] h1',
                                    'h1[data-testid="post-title"]',
                                    'h1',
                                    '[data-click-id="body"] h1',
                                    'article h1'
                                ];
                                for (var _t = 0, titleSelectors_1 = titleSelectors; _t < titleSelectors_1.length; _t++) {
                                    var selector = titleSelectors_1[_t];
                                    var el = document.querySelector(selector);
                                    if (el) {
                                        var text = (el.textContent || '').trim();
                                        if (text && text.length > 0) {
                                            result.caption = text;
                                            var hashtags = text.match(/#\w+/g);
                                            if (hashtags) {
                                                result.hashtags = hashtags.map(function (h) { return h.substring(1); });
                                            }
                                            break;
                                        }
                                    }
                                }
                                var timeSelectors = [
                                    '[data-testid="post-timestamp"]',
                                    'time',
                                    '[title*="ago"]',
                                    '[aria-label*="ago"]'
                                ];
                                for (var _u = 0, timeSelectors_1 = timeSelectors; _u < timeSelectors_1.length; _u++) {
                                    var selector = timeSelectors_1[_u];
                                    var el = document.querySelector(selector);
                                    if (el) {
                                        var datetime = el.getAttribute('datetime') || el.getAttribute('title') || '';
                                        if (datetime) {
                                            var date = new Date(datetime);
                                            if (!isNaN(date.getTime())) {
                                                result.timestamp = Math.floor(date.getTime() / 1000);
                                                break;
                                            }
                                        }
                                        var text = (el.textContent || '').trim();
                                        if (text && text.includes('ago')) {
                                            var now = Date.now();
                                            var hoursAgo = text.match(/(\d+)\s*hour/i);
                                            var daysAgo = text.match(/(\d+)\s*day/i);
                                            var monthsAgo = text.match(/(\d+)\s*month/i);
                                            var yearsAgo = text.match(/(\d+)\s*year/i);
                                            var timestamp = now;
                                            if (yearsAgo)
                                                timestamp -= parseInt(yearsAgo[1]) * 365 * 24 * 60 * 60 * 1000;
                                            else if (monthsAgo)
                                                timestamp -= parseInt(monthsAgo[1]) * 30 * 24 * 60 * 60 * 1000;
                                            else if (daysAgo)
                                                timestamp -= parseInt(daysAgo[1]) * 24 * 60 * 60 * 1000;
                                            else if (hoursAgo)
                                                timestamp -= parseInt(hoursAgo[1]) * 60 * 60 * 1000;
                                            result.timestamp = Math.floor(timestamp / 1000);
                                            break;
                                        }
                                    }
                                }
                                var shredditPost = document.querySelector('shreddit-post');
                                if (shredditPost) {
                                    var postType = shredditPost.getAttribute('post-type');
                                    var contentHref = shredditPost.getAttribute('content-href') || '';
                                    var isVideoPost = postType === 'video' ||
                                        contentHref.includes('v.redd.it') ||
                                        shredditPost.querySelector('shreddit-player, shreddit-player-2') !== null;
                                    var isImagePost = postType === 'image' ||
                                        shredditPost.querySelector('shreddit-aspect-ratio img, gallery-carousel') !== null;
                                    var isGallery = postType === 'gallery' || shredditPost.querySelector('gallery-carousel') !== null;
                                    if (isVideoPost) {
                                        result.is_video = true;
                                    }
                                    else if (isImagePost || isGallery) {
                                        result.is_video = false;
                                    }
                                    if (isGallery)
                                        result.is_gallery = true;
                                    if (postType === 'self' || postType === 'text')
                                        result.is_self = true;
                                    else if (postType === 'link' || postType === 'video' || postType === 'image')
                                        result.is_self = false;
                                    var hasSpoiler = shredditPost.hasAttribute('spoiler') ||
                                        shredditPost.getAttribute('is-spoiler') === 'true' ||
                                        shredditPost.querySelector('[slot="spoiler-tag"]') !== null;
                                    result.spoiler = hasSpoiler;
                                    var isLocked = shredditPost.hasAttribute('locked') ||
                                        shredditPost.getAttribute('is-locked') === 'true' ||
                                        shredditPost.querySelector('[data-testid="locked-badge"]') !== null;
                                    result.locked = isLocked;
                                    var isStickied = shredditPost.hasAttribute('stickied') ||
                                        shredditPost.getAttribute('is-stickied') === 'true' ||
                                        shredditPost.getAttribute('pinned') === 'true';
                                    result.stickied = isStickied;
                                    var isNsfw = shredditPost.hasAttribute('nsfw') ||
                                        shredditPost.hasAttribute('over-18') ||
                                        shredditPost.getAttribute('is-nsfw') === 'true' ||
                                        shredditPost.querySelector('[slot="nsfw-tag"], [data-testid="nsfw-badge"]') !== null;
                                    result.over_18 = isNsfw;
                                    var flairEl = shredditPost.querySelector('flair-tag, [slot="flair"], shreddit-post-flair, [data-testid="post-flair"]');
                                    if (flairEl) {
                                        result.link_flair_text = ((_k = flairEl.textContent) === null || _k === void 0 ? void 0 : _k.trim()) || undefined;
                                    }
                                    var flairAttr = shredditPost.getAttribute('link-flair-text') || shredditPost.getAttribute('flair');
                                    if (flairAttr && !result.link_flair_text) {
                                        result.link_flair_text = flairAttr;
                                    }
                                    if (contentHref) {
                                        try {
                                            var url = new URL(contentHref);
                                            result.domain = url.hostname;
                                        }
                                        catch (_v) {
                                            var domainMatch = contentHref.match(/https?:\/\/([^\/]+)/);
                                            if (domainMatch)
                                                result.domain = domainMatch[1];
                                        }
                                    }
                                    var authorId = shredditPost.getAttribute('author-id');
                                    if (authorId)
                                        result.author_fullname = authorId;
                                    var subredditId = shredditPost.getAttribute('subreddit-id');
                                    if (subredditId)
                                        result.subreddit_id = subredditId;
                                    var scoreAttr = shredditPost.getAttribute('score');
                                    var upvoteRatioAttr = shredditPost.getAttribute('upvote-ratio');
                                    if (upvoteRatioAttr && !result.upvote_ratio) {
                                        result.upvote_ratio = parseFloat(upvoteRatioAttr);
                                    }
                                }
                                if (result.is_video === undefined) {
                                    var videoElement = document.querySelector('video, [data-testid="video-player"], vreddit-player, shreddit-player');
                                    if (videoElement) {
                                        result.is_video = true;
                                    }
                                    else {
                                        var postContainer = document.querySelector('shreddit-post, [data-testid="post-container"], article');
                                        if (postContainer) {
                                            var hasVideo = postContainer.querySelector('video, vreddit-player, [data-testid="video-player"], shreddit-player');
                                            if (hasVideo) {
                                                result.is_video = true;
                                            }
                                            else {
                                                var hasImage = postContainer.querySelector('img[src*="redd.it"], img[src*="preview"], gallery-carousel');
                                                if (hasImage) {
                                                    result.is_video = false;
                                                }
                                            }
                                        }
                                    }
                                }
                                var awardSelectors = [
                                    '[data-testid="award-count"]',
                                    '[aria-label*="award"]',
                                    '[title*="award"]'
                                ];
                                for (var _w = 0, awardSelectors_1 = awardSelectors; _w < awardSelectors_1.length; _w++) {
                                    var selector = awardSelectors_1[_w];
                                    var el = document.querySelector(selector);
                                    if (el) {
                                        var text = (el.textContent || '').trim();
                                        var title = el.getAttribute('title') || '';
                                        var searchText = text || title;
                                        if (searchText && searchText.toLowerCase().includes('award')) {
                                            var match = searchText.match(/([\d,]+)/);
                                            if (match) {
                                                result.save_count = parseInt(match[1].replace(/,/g, ''));
                                                break;
                                            }
                                        }
                                    }
                                }
                                return result;
                            })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_5 = _a.sent();
                        this.logger.log("Failed to extract from DOM: ".concat(error_5), "debug");
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return RedditScraper;
}(CreatorMetadataScraper_js_1.CreatorMetadataScraper));
exports.RedditScraper = RedditScraper;
