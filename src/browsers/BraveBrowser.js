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
exports.BraveBrowser = void 0;
var playwright_1 = require("playwright");
var BraveBrowser = /** @class */ (function () {
    function BraveBrowser(logger) {
        this.browser = null;
        this.context = null;
        this.logger = logger.agent("BraveBrowser");
    }
    BraveBrowser.prototype.launch = function () {
        return __awaiter(this, arguments, void 0, function (config) {
            var _a, _b, error_1;
            var _c, _d, _e, _f, _g;
            if (config === void 0) { config = {}; }
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, playwright_1.chromium.launch({
                                headless: (_c = config.headless) !== null && _c !== void 0 ? _c : true,
                                executablePath: this.getBravePath(),
                                args: [
                                    "--no-sandbox",
                                    "--disable-dev-shm-usage",
                                    "--disable-web-security",
                                    "--allow-running-insecure-content",
                                    "--disable-features=VizDisplayCompositor",
                                    "--block-new-web-contents",
                                    "--disable-popup-blocking=false",
                                    // Brave-specific privacy and ad-blocking enhancements
                                    "--enable-aggressive-domstorage-flushing",
                                    "--disable-background-networking",
                                    "--disable-background-timer-throttling",
                                    "--disable-renderer-backgrounding",
                                    "--disable-backgrounding-occluded-windows",
                                    "--disable-client-side-phishing-detection",
                                    "--disable-component-extensions-with-background-pages",
                                    "--disable-default-apps",
                                    "--disable-extensions-http-throttling",
                                    "--disable-ipc-flooding-protection",
                                    // Enhanced debugging
                                    "--enable-logging",
                                    "--log-level=0",
                                    // Network debugging
                                    "--enable-network-service-logging",
                                ],
                            })];
                    case 1:
                        _a.browser = _h.sent();
                        _b = this;
                        return [4 /*yield*/, this.browser.newContext({
                                viewport: (_d = config.viewport) !== null && _d !== void 0 ? _d : { width: 1920, height: 1080 },
                                userAgent: (_e = config.userAgent) !== null && _e !== void 0 ? _e : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/1.60",
                                ignoreHTTPSErrors: (_f = config.ignoreHTTPSErrors) !== null && _f !== void 0 ? _f : true,
                                javaScriptEnabled: (_g = config.javaScriptEnabled) !== null && _g !== void 0 ? _g : true,
                            })];
                    case 2:
                        _b.context = _h.sent();
                        this.logger.log("Brave browser launched with enhanced ad-blocking", "info");
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _h.sent();
                        this.logger.log("Failed to launch Brave browser: ".concat(error_1), "error");
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BraveBrowser.prototype.getPage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var page, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.context) {
                            throw new Error("Browser context not initialized. Call launch() first.");
                        }
                        return [4 /*yield*/, this.context.newPage()];
                    case 1:
                        page = _a.sent();
                        // Set up request/response logging
                        page.on("request", function (request) { return _this.logRequest(request); });
                        page.on("response", function (response) { return _this.logResponse(response); });
                        if (!url) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        this.logger.log("Navigating to: ".concat(url), "info");
                        return [4 /*yield*/, page.goto(url, {
                                waitUntil: "domcontentloaded",
                                timeout: 30000,
                            })];
                    case 3:
                        _a.sent();
                        this.logger.log("Page loaded successfully", "info");
                        // Wait for dynamic content
                        return [4 /*yield*/, page.waitForTimeout(3000)];
                    case 4:
                        // Wait for dynamic content
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        this.logger.log("Page load timeout, but continuing anyway: ".concat(error_2), "warn");
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, page];
                }
            });
        });
    };
    BraveBrowser.prototype.getBravePath = function () {
        var bravePaths = [
            "/usr/bin/brave-browser", // Linux
            "/usr/bin/brave",
            "/opt/brave.com/brave/brave-browser",
            "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser", // macOS
            "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe", // Windows
            "C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
        ];
        // In a real implementation, you'd check which path exists
        return bravePaths[0]; // Default to Linux path
    };
    BraveBrowser.prototype.logRequest = function (request) {
        var url = request.url();
        if (this.isVideoRelatedUrl(url)) {
            this.logger.log("REQUEST: ".concat(request.method(), " ").concat(url), "info");
        }
    };
    BraveBrowser.prototype.logResponse = function (response) {
        var url = response.url();
        if (this.isVideoRelatedUrl(url)) {
            this.logger.log("RESPONSE: ".concat(response.status(), " ").concat(url), "info");
        }
    };
    BraveBrowser.prototype.isVideoRelatedUrl = function (url) {
        var patterns = ["m3u8", "mp4", "ts", "stream"];
        return patterns.some(function (pattern) { return url.toLowerCase().includes(pattern); });
    };
    BraveBrowser.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!this.browser) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.browser.close()];
                    case 1:
                        _a.sent();
                        this.logger.log("Brave browser closed", "info");
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        this.logger.log("Error closing Brave browser: ".concat(error_3), "warn");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return BraveBrowser;
}());
exports.BraveBrowser = BraveBrowser;
