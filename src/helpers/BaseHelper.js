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
exports.BaseHelper = void 0;
var BaseHelper = /** @class */ (function () {
    function BaseHelper(logger, statusCallback) {
        this.logger = logger.agent(this.constructor.name);
        this.statusCallback = statusCallback;
    }
    BaseHelper.prototype.updateStatus = function (status) {
        this.logger.log(status, "info");
        if (this.statusCallback) {
            this.statusCallback(status);
        }
    };
    BaseHelper.prototype.extractDomain = function (url) {
        try {
            return new URL(url).hostname;
        }
        catch (_a) {
            return "";
        }
    };
    BaseHelper.prototype.extractOriginFromUrl = function (url) {
        try {
            var parsed = new URL(url);
            return "".concat(parsed.protocol, "//").concat(parsed.host);
        }
        catch (_a) {
            return "https://jav.guru";
        }
    };
    BaseHelper.prototype.isValidVideoUrl = function (url) {
        if (!url || url.length < 10) {
            return false;
        }
        var urlLower = url.toLowerCase();
        // PRIORITY: Direct turbovidhls.com/t/ URLs are ALWAYS valid
        if (urlLower.includes("turbovidhls.com/t/")) {
            this.logger.log("Priority direct video URL detected: ".concat(url), "info");
            return true;
        }
        // Check for video file extensions or streaming indicators
        var videoIndicators = [
            ".mp4",
            ".webm",
            ".mkv",
            ".avi",
            ".mov",
            ".flv",
            ".m4v",
            ".m3u8",
            "stream",
            "video",
            "/t/",
            "/v/",
            "turbovidhls.com",
        ];
        // Must have at least one video indicator
        var hasIndicator = videoIndicators.some(function (indicator) {
            return urlLower.includes(indicator);
        });
        if (!hasIndicator) {
            return false;
        }
        // Exclude obvious non-video URLs
        var exclusions = [
            "google",
            "facebook",
            "twitter",
            "analytics",
            "ads",
            "popup",
            ".js",
            ".css",
            ".png",
            ".jpg",
            ".gif",
            "fonts.",
            "cdn-cgi",
        ];
        // Must not have exclusions
        var hasExclusion = exclusions.some(function (exclusion) {
            return urlLower.includes(exclusion);
        });
        return !hasExclusion;
    };
    BaseHelper.prototype.delay = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    };
    BaseHelper.prototype.generateTimestamp = function () {
        return Math.floor(Date.now() / 1000);
    };
    BaseHelper.prototype.sanitizeFilename = function (filename) {
        return filename.replace(/[<>:"/\\|?*]/g, "_").replace(/\s+/g, "_");
    };
    return BaseHelper;
}());
exports.BaseHelper = BaseHelper;
