"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/helpers/StringBuilder.js
var require_StringBuilder = __commonJS({
  "src/helpers/StringBuilder.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    var __classPrivateFieldGet = exports2 && exports2.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var __classPrivateFieldSet = exports2 && exports2.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var _StringBuilder_strings;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LogAgent = exports2.Logger = exports2.StringBuilder = void 0;
    var StringBuilder = (
      /** @class */
      (function() {
        function StringBuilder2() {
          _StringBuilder_strings.set(this, []);
        }
        StringBuilder2.prototype.append = function() {
          var _a;
          var texts = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            texts[_i] = arguments[_i];
          }
          (_a = __classPrivateFieldGet(this, _StringBuilder_strings, "f")).push.apply(_a, texts);
          return this;
        };
        StringBuilder2.prototype.clear = function() {
          __classPrivateFieldSet(this, _StringBuilder_strings, [], "f");
        };
        StringBuilder2.prototype.toString = function(sep) {
          if (sep === void 0) {
            sep = "\n";
          }
          return __classPrivateFieldGet(this, _StringBuilder_strings, "f").join(sep);
        };
        Object.defineProperty(StringBuilder2.prototype, "length", {
          get: function() {
            return this.toString().length;
          },
          enumerable: false,
          configurable: true
        });
        return StringBuilder2;
      })()
    );
    exports2.StringBuilder = StringBuilder;
    _StringBuilder_strings = /* @__PURE__ */ new WeakMap();
    var Logger2 = (
      /** @class */
      (function(_super) {
        __extends(Logger3, _super);
        function Logger3(downloadId, invokeEvent) {
          var _this = _super.call(this) || this;
          _this.downloadId = downloadId;
          _this.invokeEvent = invokeEvent;
          return _this;
        }
        Logger3.prototype.log = function(text, type) {
          this.append("".concat(text, " @ ").concat(type));
          this.invokeEvent.sender.send(this.downloadId, {
            data: text,
            completeLog: this.toString()
          });
          return this;
        };
        Logger3.prototype.agent = function(name) {
          return new LogAgent(name, this);
        };
        return Logger3;
      })(StringBuilder)
    );
    exports2.Logger = Logger2;
    var LogAgent = (
      /** @class */
      (function() {
        function LogAgent2(name, logger) {
          this.logger = logger;
          this.name = name;
        }
        LogAgent2.prototype.log = function(text, type) {
          this.logger.log("".concat(this.name, " - ").concat(text), type);
          return this;
        };
        return LogAgent2;
      })()
    );
    exports2.LogAgent = LogAgent;
  }
});

// src/browsers/FirefoxBrowser.js
var require_FirefoxBrowser = __commonJS({
  "src/browsers/FirefoxBrowser.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FirefoxBrowser = void 0;
    var playwright_1 = require("playwright");
    var FirefoxBrowser3 = (
      /** @class */
      (function() {
        function FirefoxBrowser4(logger) {
          this.browser = null;
          this.context = null;
          this.config = {};
          this.logger = logger.agent("FirefoxBrowser");
        }
        FirefoxBrowser4.prototype.launch = function() {
          return __awaiter(this, arguments, void 0, function(config) {
            var _a, _b, error_1;
            var _c, _d, _e, _f, _g;
            if (config === void 0) {
              config = {};
            }
            return __generator(this, function(_h) {
              switch (_h.label) {
                case 0:
                  this.config = config;
                  _h.label = 1;
                case 1:
                  _h.trys.push([1, 4, , 5]);
                  _a = this;
                  return [4, playwright_1.firefox.launch({
                    headless: (_c = config.headless) !== null && _c !== void 0 ? _c : true,
                    // Use minimal args - custom args were causing context closure issues
                    args: []
                  })];
                case 2:
                  _a.browser = _h.sent();
                  _b = this;
                  return [4, this.browser.newContext({
                    viewport: (_d = config.viewport) !== null && _d !== void 0 ? _d : { width: 1920, height: 1080 },
                    userAgent: (_e = config.userAgent) !== null && _e !== void 0 ? _e : "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0",
                    ignoreHTTPSErrors: (_f = config.ignoreHTTPSErrors) !== null && _f !== void 0 ? _f : true,
                    javaScriptEnabled: (_g = config.javaScriptEnabled) !== null && _g !== void 0 ? _g : true,
                    // Firefox-specific settings
                    permissions: [],
                    extraHTTPHeaders: {
                      "Accept-Language": "en-US,en;q=0.9"
                    }
                  })];
                case 3:
                  _b.context = _h.sent();
                  this.logger.log("Firefox browser launched with enhanced privacy settings", "info");
                  return [3, 5];
                case 4:
                  error_1 = _h.sent();
                  this.logger.log("Failed to launch Firefox browser: ".concat(error_1), "error");
                  throw error_1;
                case 5:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        FirefoxBrowser4.prototype.getPage = function(url) {
          return __awaiter(this, void 0, void 0, function() {
            var page, error_2;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!this.context) {
                    throw new Error("Browser context not initialized. Call launch() first.");
                  }
                  return [4, this.context.newPage()];
                case 1:
                  page = _a.sent();
                  if (!this.config.disableImages) return [3, 3];
                  return [4, page.route("**/*", function(route) {
                    var request = route.request();
                    var resourceType = request.resourceType();
                    if (resourceType === "image") {
                      _this.logger.log("Blocked image request: ".concat(request.url()), "debug");
                      route.abort();
                    } else {
                      route.continue();
                    }
                  })];
                case 2:
                  _a.sent();
                  this.logger.log("Image loading disabled for this page", "info");
                  _a.label = 3;
                case 3:
                  page.on("request", function(request) {
                    return _this.logRequest(request);
                  });
                  page.on("response", function(response) {
                    return _this.logResponse(response);
                  });
                  if (!url) return [3, 8];
                  _a.label = 4;
                case 4:
                  _a.trys.push([4, 7, , 8]);
                  this.logger.log("Navigating to: ".concat(url), "info");
                  return [4, page.goto(url, {
                    waitUntil: "domcontentloaded",
                    timeout: 3e4
                  })];
                case 5:
                  _a.sent();
                  this.logger.log("Page loaded successfully", "info");
                  return [4, page.waitForTimeout(3e3)];
                case 6:
                  _a.sent();
                  return [3, 8];
                case 7:
                  error_2 = _a.sent();
                  this.logger.log("Page load timeout, but continuing anyway: ".concat(error_2), "warn");
                  return [3, 8];
                case 8:
                  return [2, page];
              }
            });
          });
        };
        FirefoxBrowser4.prototype.logRequest = function(request) {
          var url = request.url();
          if (this.isVideoRelatedUrl(url)) {
            this.logger.log("REQUEST: ".concat(request.method(), " ").concat(url), "info");
          }
        };
        FirefoxBrowser4.prototype.logResponse = function(response) {
          var url = response.url();
          if (this.isVideoRelatedUrl(url)) {
            this.logger.log("RESPONSE: ".concat(response.status(), " ").concat(url), "info");
          }
        };
        FirefoxBrowser4.prototype.isVideoRelatedUrl = function(url) {
          if (url.includes("sacdnssedge") || url.includes("tscprts.com") || url.includes("mnaspm.com") || url.includes("tsyndicate.com")) {
            return false;
          }
          return url.includes(".m3u8");
        };
        FirefoxBrowser4.prototype.close = function() {
          return __awaiter(this, void 0, void 0, function() {
            var error_3;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 3, , 4]);
                  if (!this.browser) return [3, 2];
                  return [4, this.browser.close()];
                case 1:
                  _a.sent();
                  this.logger.log("Firefox browser closed", "info");
                  _a.label = 2;
                case 2:
                  return [3, 4];
                case 3:
                  error_3 = _a.sent();
                  this.logger.log("Error closing Firefox browser: ".concat(error_3), "warn");
                  return [3, 4];
                case 4:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return FirefoxBrowser4;
      })()
    );
    exports2.FirefoxBrowser = FirefoxBrowser3;
  }
});

// src/browsers/BraveBrowser.js
var require_BraveBrowser = __commonJS({
  "src/browsers/BraveBrowser.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.BraveBrowser = void 0;
    var playwright_1 = require("playwright");
    var BraveBrowser3 = (
      /** @class */
      (function() {
        function BraveBrowser4(logger) {
          this.browser = null;
          this.context = null;
          this.logger = logger.agent("BraveBrowser");
        }
        BraveBrowser4.prototype.launch = function() {
          return __awaiter(this, arguments, void 0, function(config) {
            var _a, _b, error_1;
            var _c, _d, _e, _f, _g;
            if (config === void 0) {
              config = {};
            }
            return __generator(this, function(_h) {
              switch (_h.label) {
                case 0:
                  _h.trys.push([0, 3, , 4]);
                  _a = this;
                  return [4, playwright_1.chromium.launch({
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
                      "--enable-network-service-logging"
                    ]
                  })];
                case 1:
                  _a.browser = _h.sent();
                  _b = this;
                  return [4, this.browser.newContext({
                    viewport: (_d = config.viewport) !== null && _d !== void 0 ? _d : { width: 1920, height: 1080 },
                    userAgent: (_e = config.userAgent) !== null && _e !== void 0 ? _e : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/1.60",
                    ignoreHTTPSErrors: (_f = config.ignoreHTTPSErrors) !== null && _f !== void 0 ? _f : true,
                    javaScriptEnabled: (_g = config.javaScriptEnabled) !== null && _g !== void 0 ? _g : true
                  })];
                case 2:
                  _b.context = _h.sent();
                  this.logger.log("Brave browser launched with enhanced ad-blocking", "info");
                  return [3, 4];
                case 3:
                  error_1 = _h.sent();
                  this.logger.log("Failed to launch Brave browser: ".concat(error_1), "error");
                  throw error_1;
                case 4:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        BraveBrowser4.prototype.getPage = function(url) {
          return __awaiter(this, void 0, void 0, function() {
            var page, error_2;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!this.context) {
                    throw new Error("Browser context not initialized. Call launch() first.");
                  }
                  return [4, this.context.newPage()];
                case 1:
                  page = _a.sent();
                  page.on("request", function(request) {
                    return _this.logRequest(request);
                  });
                  page.on("response", function(response) {
                    return _this.logResponse(response);
                  });
                  if (!url) return [3, 6];
                  _a.label = 2;
                case 2:
                  _a.trys.push([2, 5, , 6]);
                  this.logger.log("Navigating to: ".concat(url), "info");
                  return [4, page.goto(url, {
                    waitUntil: "domcontentloaded",
                    timeout: 3e4
                  })];
                case 3:
                  _a.sent();
                  this.logger.log("Page loaded successfully", "info");
                  return [4, page.waitForTimeout(3e3)];
                case 4:
                  _a.sent();
                  return [3, 6];
                case 5:
                  error_2 = _a.sent();
                  this.logger.log("Page load timeout, but continuing anyway: ".concat(error_2), "warn");
                  return [3, 6];
                case 6:
                  return [2, page];
              }
            });
          });
        };
        BraveBrowser4.prototype.getBravePath = function() {
          var bravePaths = [
            "/usr/bin/brave-browser",
            // Linux
            "/usr/bin/brave",
            "/opt/brave.com/brave/brave-browser",
            "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
            // macOS
            "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
            // Windows
            "C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
          ];
          return bravePaths[0];
        };
        BraveBrowser4.prototype.logRequest = function(request) {
          var url = request.url();
          if (this.isVideoRelatedUrl(url)) {
            this.logger.log("REQUEST: ".concat(request.method(), " ").concat(url), "info");
          }
        };
        BraveBrowser4.prototype.logResponse = function(response) {
          var url = response.url();
          if (this.isVideoRelatedUrl(url)) {
            this.logger.log("RESPONSE: ".concat(response.status(), " ").concat(url), "info");
          }
        };
        BraveBrowser4.prototype.isVideoRelatedUrl = function(url) {
          var patterns = ["m3u8", "mp4", "ts", "stream"];
          return patterns.some(function(pattern) {
            return url.toLowerCase().includes(pattern);
          });
        };
        BraveBrowser4.prototype.close = function() {
          return __awaiter(this, void 0, void 0, function() {
            var error_3;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 3, , 4]);
                  if (!this.browser) return [3, 2];
                  return [4, this.browser.close()];
                case 1:
                  _a.sent();
                  this.logger.log("Brave browser closed", "info");
                  _a.label = 2;
                case 2:
                  return [3, 4];
                case 3:
                  error_3 = _a.sent();
                  this.logger.log("Error closing Brave browser: ".concat(error_3), "warn");
                  return [3, 4];
                case 4:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return BraveBrowser4;
      })()
    );
    exports2.BraveBrowser = BraveBrowser3;
  }
});

// src/browsers/ChromiumBrowser.js
var require_ChromiumBrowser = __commonJS({
  "src/browsers/ChromiumBrowser.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ChromiumBrowser = void 0;
    var playwright_1 = require("playwright");
    var ChromiumBrowser3 = (
      /** @class */
      (function() {
        function ChromiumBrowser4(logger) {
          this.browser = null;
          this.context = null;
          this.logger = logger.agent("ChromiumBrowser");
        }
        ChromiumBrowser4.prototype.launch = function() {
          return __awaiter(this, arguments, void 0, function(config) {
            var _a, _b, error_1;
            var _c, _d, _e, _f, _g;
            if (config === void 0) {
              config = {};
            }
            return __generator(this, function(_h) {
              switch (_h.label) {
                case 0:
                  _h.trys.push([0, 3, , 4]);
                  _a = this;
                  return [4, playwright_1.chromium.launch({
                    headless: (_c = config.headless) !== null && _c !== void 0 ? _c : true,
                    args: [
                      "--no-sandbox",
                      "--disable-dev-shm-usage",
                      "--disable-web-security",
                      "--allow-running-insecure-content",
                      "--disable-features=VizDisplayCompositor",
                      "--block-new-web-contents",
                      "--disable-popup-blocking=false",
                      "--disable-background-networking",
                      "--disable-background-timer-throttling",
                      "--disable-renderer-backgrounding",
                      "--disable-backgrounding-occluded-windows",
                      "--enable-logging",
                      "--log-level=0",
                      "--enable-network-service-logging"
                    ]
                  })];
                case 1:
                  _a.browser = _h.sent();
                  _b = this;
                  return [4, this.browser.newContext({
                    viewport: (_d = config.viewport) !== null && _d !== void 0 ? _d : { width: 1920, height: 1080 },
                    userAgent: (_e = config.userAgent) !== null && _e !== void 0 ? _e : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    ignoreHTTPSErrors: (_f = config.ignoreHTTPSErrors) !== null && _f !== void 0 ? _f : true,
                    javaScriptEnabled: (_g = config.javaScriptEnabled) !== null && _g !== void 0 ? _g : true
                  })];
                case 2:
                  _b.context = _h.sent();
                  this.logger.log("Chromium browser launched", "info");
                  return [3, 4];
                case 3:
                  error_1 = _h.sent();
                  this.logger.log("Failed to launch Chromium browser: ".concat(error_1), "error");
                  throw error_1;
                case 4:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        ChromiumBrowser4.prototype.getPage = function(url) {
          return __awaiter(this, void 0, void 0, function() {
            var page, error_2;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!this.context) {
                    throw new Error("Browser context not initialized. Call launch() first.");
                  }
                  return [4, this.context.newPage()];
                case 1:
                  page = _a.sent();
                  page.on("request", function(request) {
                    return _this.logRequest(request);
                  });
                  page.on("response", function(response) {
                    return _this.logResponse(response);
                  });
                  if (!url) return [3, 6];
                  _a.label = 2;
                case 2:
                  _a.trys.push([2, 5, , 6]);
                  this.logger.log("Navigating to: ".concat(url), "info");
                  return [4, page.goto(url, {
                    waitUntil: "domcontentloaded",
                    timeout: 3e4
                  })];
                case 3:
                  _a.sent();
                  this.logger.log("Page loaded successfully", "info");
                  return [4, page.waitForTimeout(3e3)];
                case 4:
                  _a.sent();
                  return [3, 6];
                case 5:
                  error_2 = _a.sent();
                  this.logger.log("Page load timeout, but continuing anyway: ".concat(error_2), "warn");
                  return [3, 6];
                case 6:
                  return [2, page];
              }
            });
          });
        };
        ChromiumBrowser4.prototype.logRequest = function(request) {
          var url = request.url();
          if (this.isVideoRelatedUrl(url)) {
            this.logger.log("REQUEST: ".concat(request.method(), " ").concat(url), "info");
          }
        };
        ChromiumBrowser4.prototype.logResponse = function(response) {
          var url = response.url();
          if (this.isVideoRelatedUrl(url)) {
            this.logger.log("RESPONSE: ".concat(response.status(), " ").concat(url), "info");
          }
        };
        ChromiumBrowser4.prototype.isVideoRelatedUrl = function(url) {
          var patterns = ["m3u8", "mp4", "ts", "stream"];
          return patterns.some(function(pattern) {
            return url.toLowerCase().includes(pattern);
          });
        };
        ChromiumBrowser4.prototype.close = function() {
          return __awaiter(this, void 0, void 0, function() {
            var error_3;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 3, , 4]);
                  if (!this.browser) return [3, 2];
                  return [4, this.browser.close()];
                case 1:
                  _a.sent();
                  this.logger.log("Chromium browser closed", "info");
                  _a.label = 2;
                case 2:
                  return [3, 4];
                case 3:
                  error_3 = _a.sent();
                  this.logger.log("Error closing Chromium browser: ".concat(error_3), "warn");
                  return [3, 4];
                case 4:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return ChromiumBrowser4;
      })()
    );
    exports2.ChromiumBrowser = ChromiumBrowser3;
  }
});

// src/utils/TitleScraper.ts
var TitleScraper_exports = {};
__export(TitleScraper_exports, {
  TitleScraper: () => TitleScraper
});
var TitleScraper;
var init_TitleScraper = __esm({
  "src/utils/TitleScraper.ts"() {
    "use strict";
    TitleScraper = class {
      logger;
      constructor(logger) {
        this.logger = logger;
      }
      /**
       * Extract title information from a JAV page
       */
      async extractTitleInfo(page) {
        try {
          this.logger.log("Extracting title information from page...", "info");
          const url = page.url();
          this.logger.log(`Extracting from URL: ${url}`, "debug");
          const allFrames = [
            page.mainFrame(),
            ...page.frames().filter((f) => f !== page.mainFrame())
          ];
          for (let frameIndex = 0; frameIndex < allFrames.length; frameIndex++) {
            const frame = allFrames[frameIndex];
            const frameName = frameIndex === 0 ? "main" : `iframe-${frameIndex}`;
            try {
              this.logger.log(`Checking ${frameName} frame for title info...`, "debug");
              const titleInfo = await frame.evaluate(() => {
                const cleanText = (text) => {
                  if (!text) return "";
                  return text.trim().replace(/\s+/g, " ");
                };
                const getElementText = (selector) => {
                  const element = document.querySelector(selector);
                  return element ? cleanText(element.textContent) : "";
                };
                const getElementAttribute = (selector, attribute) => {
                  const element = document.querySelector(selector);
                  return element ? cleanText(element.getAttribute(attribute)) : "";
                };
                const getMultipleElementsText = (selector) => {
                  const elements = document.querySelectorAll(selector);
                  return Array.from(elements).map((el) => cleanText(el.textContent)).filter((text) => text.length > 0);
                };
                const result = {};
                const titleSelectors = [
                  "h1.title",
                  "h1",
                  ".title h1",
                  ".video-title",
                  ".post-title",
                  ".entry-title",
                  "title",
                  ".movie-title",
                  ".video-info h1",
                  ".content-title",
                  ".post-content h1",
                  "h1.entry-title"
                ];
                for (const selector of titleSelectors) {
                  const title = getElementText(selector);
                  if (title && title.length > 5) {
                    result.title = title;
                    break;
                  }
                }
                const codeSelectors = [
                  ".video-code",
                  ".movie-code",
                  ".code",
                  '[class*="code"]',
                  '[id*="code"]'
                ];
                for (const selector of codeSelectors) {
                  const code = getElementText(selector);
                  if (code && /^[A-Z]{2,5}-?\d{3,4}$/i.test(code)) {
                    result.code = code.toUpperCase();
                    break;
                  }
                }
                if (!result.code && result.title) {
                  const codeMatch = result.title.match(/\[([A-Z]{2,5}-?\d{3,4})\]/i) || result.title.match(/([A-Z]{2,5}-?\d{3,4})/i);
                  if (codeMatch) {
                    result.code = codeMatch[1].toUpperCase();
                  }
                }
                const actressSelectors = [
                  ".actress",
                  ".performer",
                  ".star",
                  ".model",
                  ".girls",
                  '[class*="actress"]',
                  '[class*="performer"]',
                  ".video-info .actress",
                  ".cast",
                  '.tags a[href*="actress"]',
                  '.tags a[href*="performer"]'
                ];
                for (const selector of actressSelectors) {
                  const actresses = getMultipleElementsText(selector);
                  if (actresses.length > 0) {
                    result.actress = actresses;
                    break;
                  }
                }
                const studioSelectors = [
                  ".studio",
                  ".maker",
                  ".label",
                  ".publisher",
                  '[class*="studio"]',
                  '[class*="maker"]',
                  '.tags a[href*="studio"]'
                ];
                for (const selector of studioSelectors) {
                  const studio = getElementText(selector);
                  if (studio && studio.length > 1) {
                    result.studio = studio;
                    break;
                  }
                }
                const dateSelectors = [
                  ".release-date",
                  ".date",
                  ".published",
                  '[class*="date"]',
                  "time",
                  ".post-date"
                ];
                for (const selector of dateSelectors) {
                  const date = getElementText(selector) || getElementAttribute(selector, "datetime");
                  if (date && /\d{4}/.test(date)) {
                    result.releaseDate = date;
                    break;
                  }
                }
                const durationSelectors = [
                  ".duration",
                  ".runtime",
                  ".length",
                  '[class*="duration"]',
                  '[class*="runtime"]'
                ];
                for (const selector of durationSelectors) {
                  const duration = getElementText(selector);
                  if (duration && /\d+/.test(duration)) {
                    result.duration = duration;
                    break;
                  }
                }
                const genreSelectors = [
                  ".genre",
                  ".tag",
                  ".category",
                  ".tags a",
                  ".genres a",
                  ".categories a",
                  '[class*="genre"]',
                  '[class*="tag"]',
                  ".post-tags a"
                ];
                for (const selector of genreSelectors) {
                  const genres = getMultipleElementsText(selector);
                  if (genres.length > 0) {
                    result.genre = genres;
                    break;
                  }
                }
                const descriptionSelectors = [
                  ".description",
                  ".summary",
                  ".plot",
                  ".synopsis",
                  ".content",
                  '[class*="description"]',
                  '[class*="summary"]',
                  ".post-content p",
                  ".entry-content p"
                ];
                for (const selector of descriptionSelectors) {
                  const description = getElementText(selector);
                  if (description && description.length > 20) {
                    result.description = description;
                    break;
                  }
                }
                const imageSelectors = [
                  ".cover img",
                  ".poster img",
                  ".thumbnail img",
                  ".video-thumb img",
                  'img[class*="cover"]',
                  'img[class*="poster"]',
                  'img[class*="thumb"]',
                  ".post-thumbnail img",
                  ".featured-image img"
                ];
                for (const selector of imageSelectors) {
                  const coverImage = getElementAttribute(selector, "src") || getElementAttribute(selector, "data-src");
                  if (coverImage && coverImage.startsWith("http")) {
                    result.coverImage = coverImage;
                    break;
                  }
                }
                if (!result.title && !result.code) {
                  return null;
                }
                return result;
              });
              if (titleInfo) {
                const finalTitleInfo = {
                  title: titleInfo.title || "Unknown Title",
                  originalTitle: titleInfo.originalTitle,
                  code: titleInfo.code,
                  actress: titleInfo.actress,
                  studio: titleInfo.studio,
                  releaseDate: titleInfo.releaseDate,
                  duration: titleInfo.duration,
                  genre: titleInfo.genre,
                  description: titleInfo.description,
                  coverImage: titleInfo.coverImage,
                  url,
                  extractedAt: Date.now()
                };
                this.logger.log(`Successfully extracted title info from ${frameName} frame`, "info");
                this.logger.log(`Title: ${finalTitleInfo.title}`, "debug");
                if (finalTitleInfo.code) this.logger.log(`Code: ${finalTitleInfo.code}`, "debug");
                if (finalTitleInfo.actress) this.logger.log(`Actress: ${finalTitleInfo.actress.join(", ")}`, "debug");
                return finalTitleInfo;
              }
            } catch (error) {
              this.logger.log(`Error extracting from ${frameName} frame: ${error}`, "debug");
              continue;
            }
          }
          this.logger.log("No title information found in any frame", "warn");
          return null;
        } catch (error) {
          this.logger.log(`Failed to extract title info: ${error}`, "error");
          return null;
        }
      }
      /**
       * Format title info for display
       */
      formatTitleInfo(titleInfo) {
        const lines = [];
        lines.push(`Title: ${titleInfo.title}`);
        if (titleInfo.code) lines.push(`\u{1F3F7}\uFE0F  Code: ${titleInfo.code}`);
        if (titleInfo.actress && titleInfo.actress.length > 0) {
          lines.push(`Actress: ${titleInfo.actress.join(", ")}`);
        }
        if (titleInfo.studio) lines.push(`\u{1F3E2} Studio: ${titleInfo.studio}`);
        if (titleInfo.releaseDate) lines.push(`\u{1F4C5} Release: ${titleInfo.releaseDate}`);
        if (titleInfo.duration) lines.push(`\u23F1\uFE0F  Duration: ${titleInfo.duration}`);
        if (titleInfo.genre && titleInfo.genre.length > 0) {
          lines.push(`Genres: ${titleInfo.genre.join(", ")}`);
        }
        if (titleInfo.description) {
          const shortDesc = titleInfo.description.length > 100 ? titleInfo.description.substring(0, 100) + "..." : titleInfo.description;
          lines.push(`Description: ${shortDesc}`);
        }
        lines.push(`\u{1F517} URL: ${titleInfo.url}`);
        return lines.join("\n");
      }
    };
  }
});

// src/helpers/BaseHelper.js
var require_BaseHelper = __commonJS({
  "src/helpers/BaseHelper.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.BaseHelper = void 0;
    var BaseHelper5 = (
      /** @class */
      (function() {
        function BaseHelper6(logger, statusCallback) {
          this.logger = logger.agent(this.constructor.name);
          this.statusCallback = statusCallback;
        }
        BaseHelper6.prototype.updateStatus = function(status) {
          this.logger.log(status, "info");
          if (this.statusCallback) {
            this.statusCallback(status);
          }
        };
        BaseHelper6.prototype.extractDomain = function(url) {
          try {
            return new URL(url).hostname;
          } catch (_a) {
            return "";
          }
        };
        BaseHelper6.prototype.extractOriginFromUrl = function(url) {
          try {
            var parsed = new URL(url);
            return "".concat(parsed.protocol, "//").concat(parsed.host);
          } catch (_a) {
            return "https://jav.guru";
          }
        };
        BaseHelper6.prototype.isValidVideoUrl = function(url) {
          if (!url || url.length < 10) {
            return false;
          }
          var urlLower = url.toLowerCase();
          if (urlLower.includes("turbovidhls.com/t/")) {
            this.logger.log("Priority direct video URL detected: ".concat(url), "info");
            return true;
          }
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
            "turbovidhls.com"
          ];
          var hasIndicator = videoIndicators.some(function(indicator) {
            return urlLower.includes(indicator);
          });
          if (!hasIndicator) {
            return false;
          }
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
            "cdn-cgi"
          ];
          var hasExclusion = exclusions.some(function(exclusion) {
            return urlLower.includes(exclusion);
          });
          return !hasExclusion;
        };
        BaseHelper6.prototype.delay = function(ms) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, new Promise(function(resolve) {
                return setTimeout(resolve, ms);
              })];
            });
          });
        };
        BaseHelper6.prototype.generateTimestamp = function() {
          return Math.floor(Date.now() / 1e3);
        };
        BaseHelper6.prototype.sanitizeFilename = function(filename) {
          return filename.replace(/[<>:"/\\|?*]/g, "_").replace(/\s+/g, "_");
        };
        return BaseHelper6;
      })()
    );
    exports2.BaseHelper = BaseHelper5;
  }
});

// src/types/index.js
var require_types = __commonJS({
  "src/types/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// src/scrapers/CreatorMetadataScraper.js
var require_CreatorMetadataScraper = __commonJS({
  "src/scrapers/CreatorMetadataScraper.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CreatorMetadataScraper = void 0;
    var BaseHelper_js_1 = require_BaseHelper();
    var CreatorMetadataScraper2 = (
      /** @class */
      (function(_super) {
        __extends(CreatorMetadataScraper3, _super);
        function CreatorMetadataScraper3(logger, config) {
          if (config === void 0) {
            config = {};
          }
          var _this = _super.call(this, logger) || this;
          _this.config = __assign({ timeout: 3e4, retries: 3 }, config);
          return _this;
        }
        CreatorMetadataScraper3.detectPlatform = function(url) {
          var urlLower = url.toLowerCase();
          if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
            return "youtube";
          } else if (urlLower.includes("tiktok.com")) {
            return "tiktok";
          } else if (urlLower.includes("facebook.com") || urlLower.includes("fb.com")) {
            return "facebook";
          } else if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) {
            return "twitter";
          } else if (urlLower.includes("instagram.com")) {
            return "instagram";
          } else if (urlLower.includes("reddit.com")) {
            return "reddit";
          } else if (urlLower.includes("twitch.tv")) {
            return "twitch";
          }
          return "unknown";
        };
        CreatorMetadataScraper3.prototype.getElementText = function(page, selector) {
          return __awaiter(this, void 0, void 0, function() {
            var element, error_1;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 5, , 6]);
                  return [4, page.locator(selector).first()];
                case 1:
                  element = _a.sent();
                  return [4, element.isVisible({ timeout: 5e3 })];
                case 2:
                  if (!_a.sent()) return [3, 4];
                  return [4, element.textContent()];
                case 3:
                  return [2, _a.sent()];
                case 4:
                  return [3, 6];
                case 5:
                  error_1 = _a.sent();
                  this.logger.log("Could not extract text from ".concat(selector, ": ").concat(error_1), "debug");
                  return [3, 6];
                case 6:
                  return [2, null];
              }
            });
          });
        };
        CreatorMetadataScraper3.prototype.getElementAttribute = function(page, selector, attribute) {
          return __awaiter(this, void 0, void 0, function() {
            var element, error_2;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 5, , 6]);
                  return [4, page.locator(selector).first()];
                case 1:
                  element = _a.sent();
                  return [4, element.isVisible({ timeout: 5e3 })];
                case 2:
                  if (!_a.sent()) return [3, 4];
                  return [4, element.getAttribute(attribute)];
                case 3:
                  return [2, _a.sent()];
                case 4:
                  return [3, 6];
                case 5:
                  error_2 = _a.sent();
                  this.logger.log("Could not extract ".concat(attribute, " from ").concat(selector, ": ").concat(error_2), "debug");
                  return [3, 6];
                case 6:
                  return [2, null];
              }
            });
          });
        };
        CreatorMetadataScraper3.prototype.parseCount = function(text) {
          var _a;
          if (!text)
            return void 0;
          var cleaned = text.replace(/,/g, "").trim();
          var match = cleaned.match(/^([\d.]+)([KMBkmb])?$/);
          if (match) {
            var num = parseFloat(match[1]);
            var suffix = (_a = match[2]) === null || _a === void 0 ? void 0 : _a.toUpperCase();
            if (suffix === "K")
              num *= 1e3;
            else if (suffix === "M")
              num *= 1e6;
            else if (suffix === "B")
              num *= 1e9;
            return Math.floor(num);
          }
          var numbers = cleaned.match(/[\d.]+/);
          if (numbers) {
            return Math.floor(parseFloat(numbers[0]));
          }
          return void 0;
        };
        CreatorMetadataScraper3.prototype.waitForElement = function(page_1, selector_1) {
          return __awaiter(this, arguments, void 0, function(page, selector, timeout) {
            var _a;
            if (timeout === void 0) {
              timeout = 1e4;
            }
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  _b.trys.push([0, 2, , 3]);
                  return [4, page.waitForSelector(selector, { timeout })];
                case 1:
                  _b.sent();
                  return [2, true];
                case 2:
                  _a = _b.sent();
                  return [2, false];
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        CreatorMetadataScraper3.prototype.cleanText = function(text) {
          if (!text)
            return "";
          return text.trim().replace(/\s+/g, " ");
        };
        return CreatorMetadataScraper3;
      })(BaseHelper_js_1.BaseHelper)
    );
    exports2.CreatorMetadataScraper = CreatorMetadataScraper2;
  }
});

// src/scrapers/YouTubeScraper.js
var require_YouTubeScraper = __commonJS({
  "src/scrapers/YouTubeScraper.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.YouTubeScraper = void 0;
    var CreatorMetadataScraper_js_1 = require_CreatorMetadataScraper();
    var YouTubeScraper2 = (
      /** @class */
      (function(_super) {
        __extends(YouTubeScraper3, _super);
        function YouTubeScraper3() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        YouTubeScraper3.prototype.getCreatorProfileUrl = function(videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              try {
                return [2, null];
              } catch (_b) {
                return [2, null];
              }
              return [
                2
                /*return*/
              ];
            });
          });
        };
        YouTubeScraper3.prototype.extractMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var channelUrl, channelSelectors, _i, channelSelectors_1, selector, link, metadata, nameSelectors, _a, nameSelectors_1, selector, name_1, handleSelectors, _b, handleSelectors_1, selector, handle, channelIdMatch, subscriberSelectors, _c, subscriberSelectors_1, selector, subText, avatarSelectors, _d, avatarSelectors_1, selector, avatar, bioSelectors, _e, bioSelectors_1, selector, bio, verifiedSelectors, _f, verifiedSelectors_1, selector, verified, error_1;
            return __generator(this, function(_g) {
              switch (_g.label) {
                case 0:
                  _g.trys.push([0, 34, , 35]);
                  this.logger.log("Extracting YouTube creator metadata...", "info");
                  return [4, page.waitForLoadState("domcontentloaded")];
                case 1:
                  _g.sent();
                  return [4, this.delay(2e3)];
                case 2:
                  _g.sent();
                  channelUrl = null;
                  channelSelectors = [
                    'a[href*="/channel/"]',
                    'a[href*="/c/"]',
                    'a[href*="/user/"]',
                    'a[href*="/@"]',
                    "ytd-channel-name a",
                    "#channel-name a",
                    "#owner-sub-count a",
                    ".ytd-channel-name a"
                  ];
                  _i = 0, channelSelectors_1 = channelSelectors;
                  _g.label = 3;
                case 3:
                  if (!(_i < channelSelectors_1.length)) return [3, 6];
                  selector = channelSelectors_1[_i];
                  return [4, this.getElementAttribute(page, selector, "href")];
                case 4:
                  link = _g.sent();
                  if (link && link.includes("/channel/") || link.includes("/c/") || link.includes("/user/") || link.includes("/@")) {
                    channelUrl = link.startsWith("http") ? link : "https://www.youtube.com".concat(link);
                    return [3, 6];
                  }
                  _g.label = 5;
                case 5:
                  _i++;
                  return [3, 3];
                case 6:
                  if (!channelUrl) {
                    this.logger.log("Could not find channel URL", "warn");
                    return [2, null];
                  }
                  this.logger.log("Found channel URL: ".concat(channelUrl), "debug");
                  return [4, page.goto(channelUrl, { waitUntil: "domcontentloaded" })];
                case 7:
                  _g.sent();
                  return [4, this.delay(3e3)];
                case 8:
                  _g.sent();
                  metadata = {
                    platform: "youtube",
                    url: channelUrl,
                    extractedAt: Date.now()
                  };
                  nameSelectors = [
                    "#channel-name",
                    "ytd-channel-name #text",
                    ".ytd-channel-name #text",
                    "h1.ytd-channel-name",
                    "#text-container"
                  ];
                  _a = 0, nameSelectors_1 = nameSelectors;
                  _g.label = 9;
                case 9:
                  if (!(_a < nameSelectors_1.length)) return [3, 12];
                  selector = nameSelectors_1[_a];
                  return [4, this.getElementText(page, selector)];
                case 10:
                  name_1 = _g.sent();
                  if (name_1) {
                    metadata.creator_name = this.cleanText(name_1);
                    return [3, 12];
                  }
                  _g.label = 11;
                case 11:
                  _a++;
                  return [3, 9];
                case 12:
                  handleSelectors = [
                    "#channel-handle",
                    "yt-formatted-string#channel-handle",
                    "#handle-text"
                  ];
                  _b = 0, handleSelectors_1 = handleSelectors;
                  _g.label = 13;
                case 13:
                  if (!(_b < handleSelectors_1.length)) return [3, 16];
                  selector = handleSelectors_1[_b];
                  return [4, this.getElementText(page, selector)];
                case 14:
                  handle = _g.sent();
                  if (handle) {
                    metadata.creator_username = this.cleanText(handle).replace("@", "");
                    return [3, 16];
                  }
                  _g.label = 15;
                case 15:
                  _b++;
                  return [3, 13];
                case 16:
                  channelIdMatch = channelUrl.match(/\/(channel|c|user|@)([^\/\?]+)/);
                  if (channelIdMatch) {
                    metadata.creator_id = channelIdMatch[2];
                  }
                  subscriberSelectors = [
                    "#subscriber-count",
                    "yt-formatted-string#subscriber-count",
                    "#sub-count",
                    ".ytd-c4-tabbed-header-renderer #subscriber-count"
                  ];
                  _c = 0, subscriberSelectors_1 = subscriberSelectors;
                  _g.label = 17;
                case 17:
                  if (!(_c < subscriberSelectors_1.length)) return [3, 20];
                  selector = subscriberSelectors_1[_c];
                  return [4, this.getElementText(page, selector)];
                case 18:
                  subText = _g.sent();
                  if (subText) {
                    metadata.creator_follower_count = this.parseCount(subText);
                    return [3, 20];
                  }
                  _g.label = 19;
                case 19:
                  _c++;
                  return [3, 17];
                case 20:
                  avatarSelectors = [
                    "#avatar img",
                    "#channel-header-container img",
                    "yt-img-shadow#avatar img",
                    "img#img"
                  ];
                  _d = 0, avatarSelectors_1 = avatarSelectors;
                  _g.label = 21;
                case 21:
                  if (!(_d < avatarSelectors_1.length)) return [3, 24];
                  selector = avatarSelectors_1[_d];
                  return [4, this.getElementAttribute(page, selector, "src")];
                case 22:
                  avatar = _g.sent();
                  if (avatar && avatar.includes("ytimg.com")) {
                    metadata.creator_avatar_url = avatar;
                    return [3, 24];
                  }
                  _g.label = 23;
                case 23:
                  _d++;
                  return [3, 21];
                case 24:
                  bioSelectors = [
                    "#description",
                    "#channel-description",
                    "yt-formatted-string#description",
                    ".ytd-channel-about-metadata-renderer #description"
                  ];
                  _e = 0, bioSelectors_1 = bioSelectors;
                  _g.label = 25;
                case 25:
                  if (!(_e < bioSelectors_1.length)) return [3, 28];
                  selector = bioSelectors_1[_e];
                  return [4, this.getElementText(page, selector)];
                case 26:
                  bio = _g.sent();
                  if (bio && bio.length > 10) {
                    metadata.creator_bio = this.cleanText(bio);
                    return [3, 28];
                  }
                  _g.label = 27;
                case 27:
                  _e++;
                  return [3, 25];
                case 28:
                  verifiedSelectors = [
                    "#badge",
                    "yt-icon#badge",
                    '[aria-label*="Verified"]',
                    ".ytd-badge-supported-renderer"
                  ];
                  _f = 0, verifiedSelectors_1 = verifiedSelectors;
                  _g.label = 29;
                case 29:
                  if (!(_f < verifiedSelectors_1.length)) return [3, 33];
                  selector = verifiedSelectors_1[_f];
                  return [4, page.locator(selector).first()];
                case 30:
                  verified = _g.sent();
                  return [4, verified.isVisible({ timeout: 2e3 }).catch(function() {
                    return false;
                  })];
                case 31:
                  if (_g.sent()) {
                    metadata.creator_verified = true;
                    return [3, 33];
                  }
                  _g.label = 32;
                case 32:
                  _f++;
                  return [3, 29];
                case 33:
                  this.logger.log("Successfully extracted YouTube creator metadata", "info");
                  return [2, metadata];
                case 34:
                  error_1 = _g.sent();
                  this.logger.log("Failed to extract YouTube metadata: ".concat(error_1), "error");
                  return [2, null];
                case 35:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return YouTubeScraper3;
      })(CreatorMetadataScraper_js_1.CreatorMetadataScraper)
    );
    exports2.YouTubeScraper = YouTubeScraper2;
  }
});

// src/scrapers/TikTokScraper.js
var require_TikTokScraper = __commonJS({
  "src/scrapers/TikTokScraper.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TikTokScraper = void 0;
    var CreatorMetadataScraper_js_1 = require_CreatorMetadataScraper();
    var TikTokScraper2 = (
      /** @class */
      (function(_super) {
        __extends(TikTokScraper3, _super);
        function TikTokScraper3() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        TikTokScraper3.prototype.getCreatorProfileUrl = function(videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var match;
            return __generator(this, function(_a) {
              try {
                match = videoUrl.match(/tiktok\.com\/@([^\/]+)/);
                if (match) {
                  return [2, "https://www.tiktok.com/@".concat(match[1])];
                }
                return [2, null];
              } catch (_b) {
                return [2, null];
              }
              return [
                2
                /*return*/
              ];
            });
          });
        };
        TikTokScraper3.prototype.extractMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var profileUrl, metadata, usernameMatch, nameSelectors, _i, nameSelectors_1, selector, name_1, followerSelectors, _a, followerSelectors_1, selector, followerText, bioSelectors, _b, bioSelectors_1, selector, bio, avatarSelectors, _c, avatarSelectors_1, selector, avatar, verifiedSelectors, _d, verifiedSelectors_1, selector, verified, error_1;
            return __generator(this, function(_e) {
              switch (_e.label) {
                case 0:
                  _e.trys.push([0, 25, , 26]);
                  this.logger.log("Extracting TikTok creator metadata...", "info");
                  return [4, this.getCreatorProfileUrl(videoUrl)];
                case 1:
                  profileUrl = _e.sent();
                  if (!profileUrl) {
                    this.logger.log("Could not determine TikTok profile URL", "warn");
                    return [2, null];
                  }
                  return [4, page.goto(profileUrl, { waitUntil: "domcontentloaded" })];
                case 2:
                  _e.sent();
                  return [4, this.delay(3e3)];
                case 3:
                  _e.sent();
                  metadata = {
                    platform: "tiktok",
                    url: profileUrl,
                    extractedAt: Date.now()
                  };
                  usernameMatch = profileUrl.match(/@([^\/\?]+)/);
                  if (usernameMatch) {
                    metadata.creator_username = usernameMatch[1];
                  }
                  nameSelectors = [
                    '[data-e2e="user-title"]',
                    'h1[data-e2e="user-title"]',
                    ".user-title",
                    "h1"
                  ];
                  _i = 0, nameSelectors_1 = nameSelectors;
                  _e.label = 4;
                case 4:
                  if (!(_i < nameSelectors_1.length)) return [3, 7];
                  selector = nameSelectors_1[_i];
                  return [4, this.getElementText(page, selector)];
                case 5:
                  name_1 = _e.sent();
                  if (name_1 && !name_1.includes("@")) {
                    metadata.creator_name = this.cleanText(name_1);
                    return [3, 7];
                  }
                  _e.label = 6;
                case 6:
                  _i++;
                  return [3, 4];
                case 7:
                  followerSelectors = [
                    '[data-e2e="followers-count"]',
                    '[data-e2e="followers"]',
                    ".followers-count",
                    'strong[title*="followers"]'
                  ];
                  _a = 0, followerSelectors_1 = followerSelectors;
                  _e.label = 8;
                case 8:
                  if (!(_a < followerSelectors_1.length)) return [3, 11];
                  selector = followerSelectors_1[_a];
                  return [4, this.getElementText(page, selector)];
                case 9:
                  followerText = _e.sent();
                  if (followerText) {
                    metadata.creator_follower_count = this.parseCount(followerText);
                    return [3, 11];
                  }
                  _e.label = 10;
                case 10:
                  _a++;
                  return [3, 8];
                case 11:
                  bioSelectors = [
                    '[data-e2e="user-bio"]',
                    ".user-bio",
                    '[data-e2e="user-desc"]'
                  ];
                  _b = 0, bioSelectors_1 = bioSelectors;
                  _e.label = 12;
                case 12:
                  if (!(_b < bioSelectors_1.length)) return [3, 15];
                  selector = bioSelectors_1[_b];
                  return [4, this.getElementText(page, selector)];
                case 13:
                  bio = _e.sent();
                  if (bio && bio.length > 5) {
                    metadata.creator_bio = this.cleanText(bio);
                    return [3, 15];
                  }
                  _e.label = 14;
                case 14:
                  _b++;
                  return [3, 12];
                case 15:
                  avatarSelectors = [
                    '[data-e2e="user-avatar"] img',
                    ".avatar img",
                    'img[alt*="avatar"]',
                    'img[data-e2e="user-avatar"]'
                  ];
                  _c = 0, avatarSelectors_1 = avatarSelectors;
                  _e.label = 16;
                case 16:
                  if (!(_c < avatarSelectors_1.length)) return [3, 19];
                  selector = avatarSelectors_1[_c];
                  return [4, this.getElementAttribute(page, selector, "src")];
                case 17:
                  avatar = _e.sent();
                  if (avatar) {
                    metadata.creator_avatar_url = avatar;
                    return [3, 19];
                  }
                  _e.label = 18;
                case 18:
                  _c++;
                  return [3, 16];
                case 19:
                  verifiedSelectors = [
                    '[data-e2e="verified-icon"]',
                    ".verified-badge",
                    '[aria-label*="Verified"]'
                  ];
                  _d = 0, verifiedSelectors_1 = verifiedSelectors;
                  _e.label = 20;
                case 20:
                  if (!(_d < verifiedSelectors_1.length)) return [3, 24];
                  selector = verifiedSelectors_1[_d];
                  return [4, page.locator(selector).first()];
                case 21:
                  verified = _e.sent();
                  return [4, verified.isVisible({ timeout: 2e3 }).catch(function() {
                    return false;
                  })];
                case 22:
                  if (_e.sent()) {
                    metadata.creator_verified = true;
                    return [3, 24];
                  }
                  _e.label = 23;
                case 23:
                  _d++;
                  return [3, 20];
                case 24:
                  this.logger.log("Successfully extracted TikTok creator metadata", "info");
                  return [2, metadata];
                case 25:
                  error_1 = _e.sent();
                  this.logger.log("Failed to extract TikTok metadata: ".concat(error_1), "error");
                  return [2, null];
                case 26:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return TikTokScraper3;
      })(CreatorMetadataScraper_js_1.CreatorMetadataScraper)
    );
    exports2.TikTokScraper = TikTokScraper2;
  }
});

// src/scrapers/TwitterScraper.js
var require_TwitterScraper = __commonJS({
  "src/scrapers/TwitterScraper.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TwitterScraper = void 0;
    var CreatorMetadataScraper_js_1 = require_CreatorMetadataScraper();
    var TwitterScraper2 = (
      /** @class */
      (function(_super) {
        __extends(TwitterScraper3, _super);
        function TwitterScraper3() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        TwitterScraper3.prototype.getCreatorProfileUrl = function(videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var match, domain;
            return __generator(this, function(_a) {
              try {
                match = videoUrl.match(/(?:twitter\.com|x\.com)\/([^\/]+)/);
                if (match) {
                  domain = videoUrl.includes("x.com") ? "x.com" : "twitter.com";
                  return [2, "https://".concat(domain, "/").concat(match[1])];
                }
                return [2, null];
              } catch (_b) {
                return [2, null];
              }
              return [
                2
                /*return*/
              ];
            });
          });
        };
        TwitterScraper3.prototype.extractMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var profileUrl, metadata, usernameMatch, nameSelectors, _i, nameSelectors_1, selector, name_1, bioSelectors, _a, bioSelectors_1, selector, bio, followerSelectors, _b, followerSelectors_1, selector, followerText, avatarSelectors, _c, avatarSelectors_1, selector, avatar, verifiedSelectors, _d, verifiedSelectors_1, selector, verified, error_1;
            return __generator(this, function(_e) {
              switch (_e.label) {
                case 0:
                  _e.trys.push([0, 25, , 26]);
                  this.logger.log("Extracting Twitter/X creator metadata...", "info");
                  return [4, this.getCreatorProfileUrl(videoUrl)];
                case 1:
                  profileUrl = _e.sent();
                  if (!profileUrl) {
                    this.logger.log("Could not determine Twitter profile URL", "warn");
                    return [2, null];
                  }
                  return [4, page.goto(profileUrl, { waitUntil: "domcontentloaded" })];
                case 2:
                  _e.sent();
                  return [4, this.delay(3e3)];
                case 3:
                  _e.sent();
                  metadata = {
                    platform: "twitter",
                    url: profileUrl,
                    extractedAt: Date.now()
                  };
                  usernameMatch = profileUrl.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
                  if (usernameMatch) {
                    metadata.creator_username = usernameMatch[1];
                  }
                  nameSelectors = [
                    '[data-testid="UserName"]',
                    'h1[data-testid="UserName"]',
                    '[data-testid="User-Names"] span',
                    "h1"
                  ];
                  _i = 0, nameSelectors_1 = nameSelectors;
                  _e.label = 4;
                case 4:
                  if (!(_i < nameSelectors_1.length)) return [3, 7];
                  selector = nameSelectors_1[_i];
                  return [4, this.getElementText(page, selector)];
                case 5:
                  name_1 = _e.sent();
                  if (name_1 && !name_1.startsWith("@")) {
                    metadata.creator_name = this.cleanText(name_1);
                    return [3, 7];
                  }
                  _e.label = 6;
                case 6:
                  _i++;
                  return [3, 4];
                case 7:
                  bioSelectors = [
                    '[data-testid="UserDescription"]',
                    '[data-testid="UserBio"]',
                    ".user-description"
                  ];
                  _a = 0, bioSelectors_1 = bioSelectors;
                  _e.label = 8;
                case 8:
                  if (!(_a < bioSelectors_1.length)) return [3, 11];
                  selector = bioSelectors_1[_a];
                  return [4, this.getElementText(page, selector)];
                case 9:
                  bio = _e.sent();
                  if (bio && bio.length > 5) {
                    metadata.creator_bio = this.cleanText(bio);
                    return [3, 11];
                  }
                  _e.label = 10;
                case 10:
                  _a++;
                  return [3, 8];
                case 11:
                  followerSelectors = [
                    '[data-testid="followers"]',
                    'a[href*="/followers"]',
                    '[href*="/followers"] span'
                  ];
                  _b = 0, followerSelectors_1 = followerSelectors;
                  _e.label = 12;
                case 12:
                  if (!(_b < followerSelectors_1.length)) return [3, 15];
                  selector = followerSelectors_1[_b];
                  return [4, this.getElementText(page, selector)];
                case 13:
                  followerText = _e.sent();
                  if (followerText) {
                    metadata.creator_follower_count = this.parseCount(followerText);
                    return [3, 15];
                  }
                  _e.label = 14;
                case 14:
                  _b++;
                  return [3, 12];
                case 15:
                  avatarSelectors = [
                    '[data-testid="UserAvatar-Container-"] img',
                    'img[alt*="Avatar"]',
                    '[data-testid="primaryColumn"] img[src*="pbs.twimg.com"]'
                  ];
                  _c = 0, avatarSelectors_1 = avatarSelectors;
                  _e.label = 16;
                case 16:
                  if (!(_c < avatarSelectors_1.length)) return [3, 19];
                  selector = avatarSelectors_1[_c];
                  return [4, this.getElementAttribute(page, selector, "src")];
                case 17:
                  avatar = _e.sent();
                  if (avatar && avatar.includes("pbs.twimg.com")) {
                    metadata.creator_avatar_url = avatar;
                    return [3, 19];
                  }
                  _e.label = 18;
                case 18:
                  _c++;
                  return [3, 16];
                case 19:
                  verifiedSelectors = [
                    '[data-testid="icon-verified"]',
                    '[aria-label*="Verified account"]',
                    'svg[data-testid="icon-verified"]'
                  ];
                  _d = 0, verifiedSelectors_1 = verifiedSelectors;
                  _e.label = 20;
                case 20:
                  if (!(_d < verifiedSelectors_1.length)) return [3, 24];
                  selector = verifiedSelectors_1[_d];
                  return [4, page.locator(selector).first()];
                case 21:
                  verified = _e.sent();
                  return [4, verified.isVisible({ timeout: 2e3 }).catch(function() {
                    return false;
                  })];
                case 22:
                  if (_e.sent()) {
                    metadata.creator_verified = true;
                    return [3, 24];
                  }
                  _e.label = 23;
                case 23:
                  _d++;
                  return [3, 20];
                case 24:
                  this.logger.log("Successfully extracted Twitter/X creator metadata", "info");
                  return [2, metadata];
                case 25:
                  error_1 = _e.sent();
                  this.logger.log("Failed to extract Twitter metadata: ".concat(error_1), "error");
                  return [2, null];
                case 26:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return TwitterScraper3;
      })(CreatorMetadataScraper_js_1.CreatorMetadataScraper)
    );
    exports2.TwitterScraper = TwitterScraper2;
  }
});

// src/scrapers/InstagramScraper.js
var require_InstagramScraper = __commonJS({
  "src/scrapers/InstagramScraper.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InstagramScraper = void 0;
    var CreatorMetadataScraper_js_1 = require_CreatorMetadataScraper();
    var InstagramScraper2 = (
      /** @class */
      (function(_super) {
        __extends(InstagramScraper3, _super);
        function InstagramScraper3() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        InstagramScraper3.prototype.getCreatorProfileUrl = function(videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              try {
                return [2, null];
              } catch (_b) {
                return [2, null];
              }
              return [
                2
                /*return*/
              ];
            });
          });
        };
        InstagramScraper3.prototype.extractMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var username, links, _i, links_1, link, href, profileUrl, metadata, nameSelectors, _a, nameSelectors_1, selector, name_1, header, bioText, followerLinks, followerText, avatarSelectors, _b, avatarSelectors_1, selector, avatar, verifiedSelectors, _c, verifiedSelectors_1, selector, verified, error_1;
            return __generator(this, function(_d) {
              switch (_d.label) {
                case 0:
                  _d.trys.push([0, 30, , 31]);
                  this.logger.log("Extracting Instagram creator metadata...", "info");
                  return [4, page.goto(videoUrl, { waitUntil: "domcontentloaded" })];
                case 1:
                  _d.sent();
                  return [4, this.delay(3e3)];
                case 2:
                  _d.sent();
                  username = null;
                  return [4, page.locator('a[href^="/"]').all()];
                case 3:
                  links = _d.sent();
                  _i = 0, links_1 = links;
                  _d.label = 4;
                case 4:
                  if (!(_i < links_1.length)) return [3, 7];
                  link = links_1[_i];
                  return [4, link.getAttribute("href")];
                case 5:
                  href = _d.sent();
                  if (href && href.match(/^\/[^\/]+\/$/) && !href.includes("/p/") && !href.includes("/reel/")) {
                    username = href.replace(/\//g, "");
                    return [3, 7];
                  }
                  _d.label = 6;
                case 6:
                  _i++;
                  return [3, 4];
                case 7:
                  if (!username) {
                    this.logger.log("Could not find Instagram username", "warn");
                    return [2, null];
                  }
                  profileUrl = "https://www.instagram.com/".concat(username, "/");
                  return [4, page.goto(profileUrl, { waitUntil: "domcontentloaded" })];
                case 8:
                  _d.sent();
                  return [4, this.delay(3e3)];
                case 9:
                  _d.sent();
                  metadata = {
                    platform: "instagram",
                    url: profileUrl,
                    creator_username: username,
                    extractedAt: Date.now()
                  };
                  nameSelectors = [
                    "h2",
                    "header h1",
                    '[data-testid="user-name"]'
                  ];
                  _a = 0, nameSelectors_1 = nameSelectors;
                  _d.label = 10;
                case 10:
                  if (!(_a < nameSelectors_1.length)) return [3, 13];
                  selector = nameSelectors_1[_a];
                  return [4, this.getElementText(page, selector)];
                case 11:
                  name_1 = _d.sent();
                  if (name_1 && name_1.length > 0) {
                    metadata.creator_name = this.cleanText(name_1);
                    return [3, 13];
                  }
                  _d.label = 12;
                case 12:
                  _a++;
                  return [3, 10];
                case 13:
                  return [4, page.locator("header").first()];
                case 14:
                  header = _d.sent();
                  return [4, header.isVisible().catch(function() {
                    return false;
                  })];
                case 15:
                  if (!_d.sent()) return [3, 17];
                  return [4, header.locator("span").nth(1).textContent().catch(function() {
                    return null;
                  })];
                case 16:
                  bioText = _d.sent();
                  if (bioText && bioText.length > 5) {
                    metadata.creator_bio = this.cleanText(bioText);
                  }
                  _d.label = 17;
                case 17:
                  return [4, page.locator('a[href*="/followers/"]').all()];
                case 18:
                  followerLinks = _d.sent();
                  if (!(followerLinks.length > 0)) return [3, 20];
                  return [4, followerLinks[0].textContent()];
                case 19:
                  followerText = _d.sent();
                  if (followerText) {
                    metadata.creator_follower_count = this.parseCount(followerText);
                  }
                  _d.label = 20;
                case 20:
                  avatarSelectors = [
                    "header img",
                    'img[alt*="profile picture"]',
                    'img[alt*="Profile picture"]'
                  ];
                  _b = 0, avatarSelectors_1 = avatarSelectors;
                  _d.label = 21;
                case 21:
                  if (!(_b < avatarSelectors_1.length)) return [3, 24];
                  selector = avatarSelectors_1[_b];
                  return [4, this.getElementAttribute(page, selector, "src")];
                case 22:
                  avatar = _d.sent();
                  if (avatar) {
                    metadata.creator_avatar_url = avatar;
                    return [3, 24];
                  }
                  _d.label = 23;
                case 23:
                  _b++;
                  return [3, 21];
                case 24:
                  verifiedSelectors = [
                    '[aria-label*="Verified"]',
                    'svg[aria-label*="Verified"]'
                  ];
                  _c = 0, verifiedSelectors_1 = verifiedSelectors;
                  _d.label = 25;
                case 25:
                  if (!(_c < verifiedSelectors_1.length)) return [3, 29];
                  selector = verifiedSelectors_1[_c];
                  return [4, page.locator(selector).first()];
                case 26:
                  verified = _d.sent();
                  return [4, verified.isVisible({ timeout: 2e3 }).catch(function() {
                    return false;
                  })];
                case 27:
                  if (_d.sent()) {
                    metadata.creator_verified = true;
                    return [3, 29];
                  }
                  _d.label = 28;
                case 28:
                  _c++;
                  return [3, 25];
                case 29:
                  this.logger.log("Successfully extracted Instagram creator metadata", "info");
                  return [2, metadata];
                case 30:
                  error_1 = _d.sent();
                  this.logger.log("Failed to extract Instagram metadata: ".concat(error_1), "error");
                  return [2, null];
                case 31:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return InstagramScraper3;
      })(CreatorMetadataScraper_js_1.CreatorMetadataScraper)
    );
    exports2.InstagramScraper = InstagramScraper2;
  }
});

// src/scrapers/RedditScraper.js
var require_RedditScraper = __commonJS({
  "src/scrapers/RedditScraper.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RedditScraper = void 0;
    var CreatorMetadataScraper_js_1 = require_CreatorMetadataScraper();
    var RedditScraper2 = (
      /** @class */
      (function(_super) {
        __extends(RedditScraper3, _super);
        function RedditScraper3() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        RedditScraper3.prototype.getCreatorProfileUrl = function(videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              try {
                return [2, null];
              } catch (_b) {
                return [2, null];
              }
              return [
                2
                /*return*/
              ];
            });
          });
        };
        RedditScraper3.prototype.extractMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var username, usernameSelectors, _i, usernameSelectors_1, selector, link, match, profileUrl, metadata, karmaSelectors, karmaText, karmaMatch, bioSelectors, _a, bioSelectors_1, selector, bio, avatarSelectors, _b, avatarSelectors_1, selector, avatar, verifiedSelectors, _c, verifiedSelectors_1, selector, verified, error_1;
            return __generator(this, function(_d) {
              switch (_d.label) {
                case 0:
                  _d.trys.push([0, 23, , 24]);
                  this.logger.log("Extracting Reddit creator metadata...", "info");
                  return [4, page.goto(videoUrl, { waitUntil: "domcontentloaded" })];
                case 1:
                  _d.sent();
                  return [4, this.delay(3e3)];
                case 2:
                  _d.sent();
                  username = null;
                  usernameSelectors = [
                    'a[href^="/user/"]',
                    'a[href^="/u/"]',
                    '[data-testid="post_author_link"]',
                    "a.author"
                  ];
                  _i = 0, usernameSelectors_1 = usernameSelectors;
                  _d.label = 3;
                case 3:
                  if (!(_i < usernameSelectors_1.length)) return [3, 6];
                  selector = usernameSelectors_1[_i];
                  return [4, this.getElementAttribute(page, selector, "href")];
                case 4:
                  link = _d.sent();
                  if (link) {
                    match = link.match(/\/(?:u|user)\/([^\/\?]+)/);
                    if (match) {
                      username = match[1];
                      return [3, 6];
                    }
                  }
                  _d.label = 5;
                case 5:
                  _i++;
                  return [3, 3];
                case 6:
                  if (!username) {
                    this.logger.log("Could not find Reddit username", "warn");
                    return [2, null];
                  }
                  profileUrl = "https://www.reddit.com/user/".concat(username, "/");
                  return [4, page.goto(profileUrl, { waitUntil: "domcontentloaded" })];
                case 7:
                  _d.sent();
                  return [4, this.delay(3e3)];
                case 8:
                  _d.sent();
                  metadata = {
                    platform: "reddit",
                    url: profileUrl,
                    creator_username: username,
                    extractedAt: Date.now()
                  };
                  metadata.creator_name = username;
                  karmaSelectors = [
                    '[data-testid="karma"]',
                    ".karma",
                    'span[title*="karma"]'
                  ];
                  return [4, page.evaluate(function() {
                    var elements = document.querySelectorAll("*");
                    for (var _i2 = 0, elements_1 = elements; _i2 < elements_1.length; _i2++) {
                      var el = elements_1[_i2];
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
                    ".user-about",
                    'p[data-testid="user-bio"]'
                  ];
                  _a = 0, bioSelectors_1 = bioSelectors;
                  _d.label = 10;
                case 10:
                  if (!(_a < bioSelectors_1.length)) return [3, 13];
                  selector = bioSelectors_1[_a];
                  return [4, this.getElementText(page, selector)];
                case 11:
                  bio = _d.sent();
                  if (bio && bio.length > 5) {
                    metadata.creator_bio = this.cleanText(bio);
                    return [3, 13];
                  }
                  _d.label = 12;
                case 12:
                  _a++;
                  return [3, 10];
                case 13:
                  avatarSelectors = [
                    'img[alt*="avatar"]',
                    'img[alt*="snoo"]',
                    '[data-testid="user-avatar"] img'
                  ];
                  _b = 0, avatarSelectors_1 = avatarSelectors;
                  _d.label = 14;
                case 14:
                  if (!(_b < avatarSelectors_1.length)) return [3, 17];
                  selector = avatarSelectors_1[_b];
                  return [4, this.getElementAttribute(page, selector, "src")];
                case 15:
                  avatar = _d.sent();
                  if (avatar) {
                    metadata.creator_avatar_url = avatar;
                    return [3, 17];
                  }
                  _d.label = 16;
                case 16:
                  _b++;
                  return [3, 14];
                case 17:
                  verifiedSelectors = [
                    '[data-testid="mod-badge"]',
                    '[data-testid="admin-badge"]'
                  ];
                  _c = 0, verifiedSelectors_1 = verifiedSelectors;
                  _d.label = 18;
                case 18:
                  if (!(_c < verifiedSelectors_1.length)) return [3, 22];
                  selector = verifiedSelectors_1[_c];
                  return [4, page.locator(selector).first()];
                case 19:
                  verified = _d.sent();
                  return [4, verified.isVisible({ timeout: 2e3 }).catch(function() {
                    return false;
                  })];
                case 20:
                  if (_d.sent()) {
                    metadata.creator_verified = true;
                    return [3, 22];
                  }
                  _d.label = 21;
                case 21:
                  _c++;
                  return [3, 18];
                case 22:
                  this.logger.log("Successfully extracted Reddit creator metadata", "info");
                  return [2, metadata];
                case 23:
                  error_1 = _d.sent();
                  this.logger.log("Failed to extract Reddit metadata: ".concat(error_1), "error");
                  return [2, null];
                case 24:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return RedditScraper3;
      })(CreatorMetadataScraper_js_1.CreatorMetadataScraper)
    );
    exports2.RedditScraper = RedditScraper2;
  }
});

// src/scrapers/FacebookScraper.js
var require_FacebookScraper = __commonJS({
  "src/scrapers/FacebookScraper.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FacebookScraper = void 0;
    var CreatorMetadataScraper_js_1 = require_CreatorMetadataScraper();
    var FacebookScraper2 = (
      /** @class */
      (function(_super) {
        __extends(FacebookScraper3, _super);
        function FacebookScraper3() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        FacebookScraper3.prototype.getCreatorProfileUrl = function(videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var match;
            return __generator(this, function(_a) {
              try {
                match = videoUrl.match(/facebook\.com\/([^\/\?]+)/);
                if (match && !match[1].includes("watch")) {
                  return [2, "https://www.facebook.com/".concat(match[1])];
                }
                return [2, null];
              } catch (_b) {
                return [2, null];
              }
              return [
                2
                /*return*/
              ];
            });
          });
        };
        FacebookScraper3.prototype.extractMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var profileUrl, links, _i, links_1, link, href, metadata, nameSelectors, _a, nameSelectors_1, selector, name_1, bioSelectors, _b, bioSelectors_1, selector, bio, followerSelectors, _c, followerSelectors_1, selector, followerText, avatarSelectors, _d, avatarSelectors_1, selector, avatar, verifiedSelectors, _e, verifiedSelectors_1, selector, verified, error_1;
            return __generator(this, function(_f) {
              switch (_f.label) {
                case 0:
                  _f.trys.push([0, 31, , 32]);
                  this.logger.log("Extracting Facebook creator metadata...", "info");
                  return [4, page.goto(videoUrl, { waitUntil: "domcontentloaded" })];
                case 1:
                  _f.sent();
                  return [4, this.delay(3e3)];
                case 2:
                  _f.sent();
                  profileUrl = null;
                  return [4, page.locator('a[href*="facebook.com"]').all()];
                case 3:
                  links = _f.sent();
                  _i = 0, links_1 = links;
                  _f.label = 4;
                case 4:
                  if (!(_i < links_1.length)) return [3, 7];
                  link = links_1[_i];
                  return [4, link.getAttribute("href")];
                case 5:
                  href = _f.sent();
                  if (href && !href.includes("/watch") && !href.includes("/videos") && href.match(/facebook\.com\/[^\/]+$/)) {
                    profileUrl = href;
                    return [3, 7];
                  }
                  _f.label = 6;
                case 6:
                  _i++;
                  return [3, 4];
                case 7:
                  if (!profileUrl) {
                    this.logger.log("Could not find Facebook profile URL", "warn");
                    return [2, null];
                  }
                  return [4, page.goto(profileUrl, { waitUntil: "domcontentloaded" })];
                case 8:
                  _f.sent();
                  return [4, this.delay(3e3)];
                case 9:
                  _f.sent();
                  metadata = {
                    platform: "facebook",
                    url: profileUrl,
                    extractedAt: Date.now()
                  };
                  nameSelectors = [
                    "h1",
                    '[data-testid="profile-name"]',
                    "header h1"
                  ];
                  _a = 0, nameSelectors_1 = nameSelectors;
                  _f.label = 10;
                case 10:
                  if (!(_a < nameSelectors_1.length)) return [3, 13];
                  selector = nameSelectors_1[_a];
                  return [4, this.getElementText(page, selector)];
                case 11:
                  name_1 = _f.sent();
                  if (name_1 && name_1.length > 0) {
                    metadata.creator_name = this.cleanText(name_1);
                    return [3, 13];
                  }
                  _f.label = 12;
                case 12:
                  _a++;
                  return [3, 10];
                case 13:
                  bioSelectors = [
                    '[data-testid="profile-bio"]',
                    ".profile-bio",
                    'div[data-testid="profile-info"]'
                  ];
                  _b = 0, bioSelectors_1 = bioSelectors;
                  _f.label = 14;
                case 14:
                  if (!(_b < bioSelectors_1.length)) return [3, 17];
                  selector = bioSelectors_1[_b];
                  return [4, this.getElementText(page, selector)];
                case 15:
                  bio = _f.sent();
                  if (bio && bio.length > 5) {
                    metadata.creator_bio = this.cleanText(bio);
                    return [3, 17];
                  }
                  _f.label = 16;
                case 16:
                  _b++;
                  return [3, 14];
                case 17:
                  followerSelectors = [
                    '[data-testid="followers"]',
                    'a[href*="/followers"]'
                  ];
                  _c = 0, followerSelectors_1 = followerSelectors;
                  _f.label = 18;
                case 18:
                  if (!(_c < followerSelectors_1.length)) return [3, 21];
                  selector = followerSelectors_1[_c];
                  return [4, this.getElementText(page, selector)];
                case 19:
                  followerText = _f.sent();
                  if (followerText) {
                    metadata.creator_follower_count = this.parseCount(followerText);
                    return [3, 21];
                  }
                  _f.label = 20;
                case 20:
                  _c++;
                  return [3, 18];
                case 21:
                  avatarSelectors = [
                    'img[alt*="profile picture"]',
                    'img[alt*="Profile picture"]',
                    '[data-testid="profile-picture"] img'
                  ];
                  _d = 0, avatarSelectors_1 = avatarSelectors;
                  _f.label = 22;
                case 22:
                  if (!(_d < avatarSelectors_1.length)) return [3, 25];
                  selector = avatarSelectors_1[_d];
                  return [4, this.getElementAttribute(page, selector, "src")];
                case 23:
                  avatar = _f.sent();
                  if (avatar) {
                    metadata.creator_avatar_url = avatar;
                    return [3, 25];
                  }
                  _f.label = 24;
                case 24:
                  _d++;
                  return [3, 22];
                case 25:
                  verifiedSelectors = [
                    '[aria-label*="Verified"]',
                    '[data-testid="verified-badge"]'
                  ];
                  _e = 0, verifiedSelectors_1 = verifiedSelectors;
                  _f.label = 26;
                case 26:
                  if (!(_e < verifiedSelectors_1.length)) return [3, 30];
                  selector = verifiedSelectors_1[_e];
                  return [4, page.locator(selector).first()];
                case 27:
                  verified = _f.sent();
                  return [4, verified.isVisible({ timeout: 2e3 }).catch(function() {
                    return false;
                  })];
                case 28:
                  if (_f.sent()) {
                    metadata.creator_verified = true;
                    return [3, 30];
                  }
                  _f.label = 29;
                case 29:
                  _e++;
                  return [3, 26];
                case 30:
                  this.logger.log("Successfully extracted Facebook creator metadata", "info");
                  return [2, metadata];
                case 31:
                  error_1 = _f.sent();
                  this.logger.log("Failed to extract Facebook metadata: ".concat(error_1), "error");
                  return [2, null];
                case 32:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return FacebookScraper3;
      })(CreatorMetadataScraper_js_1.CreatorMetadataScraper)
    );
    exports2.FacebookScraper = FacebookScraper2;
  }
});

// src/scrapers/TwitchScraper.js
var require_TwitchScraper = __commonJS({
  "src/scrapers/TwitchScraper.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TwitchScraper = void 0;
    var CreatorMetadataScraper_js_1 = require_CreatorMetadataScraper();
    var TwitchScraper2 = (
      /** @class */
      (function(_super) {
        __extends(TwitchScraper3, _super);
        function TwitchScraper3() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        TwitchScraper3.prototype.getCreatorProfileUrl = function(videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var match;
            return __generator(this, function(_a) {
              try {
                match = videoUrl.match(/twitch\.tv\/([^\/\?]+)/);
                if (match && match[1] !== "videos") {
                  return [2, "https://www.twitch.tv/".concat(match[1])];
                }
                return [2, null];
              } catch (_b) {
                return [2, null];
              }
              return [
                2
                /*return*/
              ];
            });
          });
        };
        TwitchScraper3.prototype.extractMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var profileUrl, link, metadata, usernameMatch, nameSelectors, _i, nameSelectors_1, selector, name_1, bioSelectors, _a, bioSelectors_1, selector, bio, followerSelectors, _b, followerSelectors_1, selector, followerText, avatarSelectors, _c, avatarSelectors_1, selector, avatar, verifiedSelectors, _d, verifiedSelectors_1, selector, verified, error_1;
            return __generator(this, function(_e) {
              switch (_e.label) {
                case 0:
                  _e.trys.push([0, 29, , 30]);
                  this.logger.log("Extracting Twitch creator metadata...", "info");
                  return [4, this.getCreatorProfileUrl(videoUrl)];
                case 1:
                  profileUrl = _e.sent();
                  if (!!profileUrl) return [3, 5];
                  return [4, page.goto(videoUrl, { waitUntil: "domcontentloaded" })];
                case 2:
                  _e.sent();
                  return [4, this.delay(3e3)];
                case 3:
                  _e.sent();
                  return [4, this.getElementAttribute(page, 'a[href*="/"]', "href")];
                case 4:
                  link = _e.sent();
                  if (link && link.includes("twitch.tv/") && !link.includes("/videos/")) {
                    profileUrl = link.startsWith("http") ? link : "https://www.twitch.tv".concat(link);
                  }
                  _e.label = 5;
                case 5:
                  if (!profileUrl) {
                    this.logger.log("Could not find Twitch profile URL", "warn");
                    return [2, null];
                  }
                  return [4, page.goto(profileUrl, { waitUntil: "domcontentloaded" })];
                case 6:
                  _e.sent();
                  return [4, this.delay(3e3)];
                case 7:
                  _e.sent();
                  metadata = {
                    platform: "twitch",
                    url: profileUrl,
                    extractedAt: Date.now()
                  };
                  usernameMatch = profileUrl.match(/twitch\.tv\/([^\/\?]+)/);
                  if (usernameMatch) {
                    metadata.creator_username = usernameMatch[1];
                  }
                  nameSelectors = [
                    'h2[data-a-target="user-channel-header-item"]',
                    "h2",
                    '[data-a-target="user-display-name"]'
                  ];
                  _i = 0, nameSelectors_1 = nameSelectors;
                  _e.label = 8;
                case 8:
                  if (!(_i < nameSelectors_1.length)) return [3, 11];
                  selector = nameSelectors_1[_i];
                  return [4, this.getElementText(page, selector)];
                case 9:
                  name_1 = _e.sent();
                  if (name_1 && name_1.length > 0) {
                    metadata.creator_name = this.cleanText(name_1);
                    return [3, 11];
                  }
                  _e.label = 10;
                case 10:
                  _i++;
                  return [3, 8];
                case 11:
                  bioSelectors = [
                    '[data-a-target="user-channel-description"]',
                    ".channel-info-content",
                    '[data-a-target="user-channel-description-text"]'
                  ];
                  _a = 0, bioSelectors_1 = bioSelectors;
                  _e.label = 12;
                case 12:
                  if (!(_a < bioSelectors_1.length)) return [3, 15];
                  selector = bioSelectors_1[_a];
                  return [4, this.getElementText(page, selector)];
                case 13:
                  bio = _e.sent();
                  if (bio && bio.length > 5) {
                    metadata.creator_bio = this.cleanText(bio);
                    return [3, 15];
                  }
                  _e.label = 14;
                case 14:
                  _a++;
                  return [3, 12];
                case 15:
                  followerSelectors = [
                    '[data-a-target="follow-count"]',
                    'a[href*="/followers"]',
                    '[data-a-target="user-channel-header-item"]'
                  ];
                  _b = 0, followerSelectors_1 = followerSelectors;
                  _e.label = 16;
                case 16:
                  if (!(_b < followerSelectors_1.length)) return [3, 19];
                  selector = followerSelectors_1[_b];
                  return [4, this.getElementText(page, selector)];
                case 17:
                  followerText = _e.sent();
                  if (followerText && (followerText.includes("followers") || followerText.includes("Follower"))) {
                    metadata.creator_follower_count = this.parseCount(followerText);
                    return [3, 19];
                  }
                  _e.label = 18;
                case 18:
                  _b++;
                  return [3, 16];
                case 19:
                  avatarSelectors = [
                    'img[alt*="avatar"]',
                    '[data-a-target="user-avatar"] img',
                    'img[src*="static-cdn.jtvnw.net"]'
                  ];
                  _c = 0, avatarSelectors_1 = avatarSelectors;
                  _e.label = 20;
                case 20:
                  if (!(_c < avatarSelectors_1.length)) return [3, 23];
                  selector = avatarSelectors_1[_c];
                  return [4, this.getElementAttribute(page, selector, "src")];
                case 21:
                  avatar = _e.sent();
                  if (avatar && avatar.includes("static-cdn.jtvnw.net")) {
                    metadata.creator_avatar_url = avatar;
                    return [3, 23];
                  }
                  _e.label = 22;
                case 22:
                  _c++;
                  return [3, 20];
                case 23:
                  verifiedSelectors = [
                    '[data-a-target="verified-badge"]',
                    '[aria-label*="Verified"]',
                    ".verified-badge"
                  ];
                  _d = 0, verifiedSelectors_1 = verifiedSelectors;
                  _e.label = 24;
                case 24:
                  if (!(_d < verifiedSelectors_1.length)) return [3, 28];
                  selector = verifiedSelectors_1[_d];
                  return [4, page.locator(selector).first()];
                case 25:
                  verified = _e.sent();
                  return [4, verified.isVisible({ timeout: 2e3 }).catch(function() {
                    return false;
                  })];
                case 26:
                  if (_e.sent()) {
                    metadata.creator_verified = true;
                    return [3, 28];
                  }
                  _e.label = 27;
                case 27:
                  _d++;
                  return [3, 24];
                case 28:
                  this.logger.log("Successfully extracted Twitch creator metadata", "info");
                  return [2, metadata];
                case 29:
                  error_1 = _e.sent();
                  this.logger.log("Failed to extract Twitch metadata: ".concat(error_1), "error");
                  return [2, null];
                case 30:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return TwitchScraper3;
      })(CreatorMetadataScraper_js_1.CreatorMetadataScraper)
    );
    exports2.TwitchScraper = TwitchScraper2;
  }
});

// src/scrapers/CreatorMetadataManager.js
var require_CreatorMetadataManager = __commonJS({
  "src/scrapers/CreatorMetadataManager.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CreatorMetadataManager = void 0;
    var CreatorMetadataScraper_js_1 = require_CreatorMetadataScraper();
    var YouTubeScraper_js_1 = require_YouTubeScraper();
    var TikTokScraper_js_1 = require_TikTokScraper();
    var TwitterScraper_js_1 = require_TwitterScraper();
    var InstagramScraper_js_1 = require_InstagramScraper();
    var RedditScraper_js_1 = require_RedditScraper();
    var FacebookScraper_js_1 = require_FacebookScraper();
    var TwitchScraper_js_1 = require_TwitchScraper();
    var ChromiumBrowser_js_1 = require_ChromiumBrowser();
    var FirefoxBrowser_js_1 = require_FirefoxBrowser();
    var BraveBrowser_js_1 = require_BraveBrowser();
    var CreatorMetadataManager2 = (
      /** @class */
      (function() {
        function CreatorMetadataManager3(logger, config) {
          if (config === void 0) {
            config = {};
          }
          this.logger = logger;
          this.config = config;
        }
        CreatorMetadataManager3.prototype.getScraperForPlatform = function(platform) {
          var logAgent = this.logger.agent("CreatorMetadataManager");
          switch (platform) {
            case "youtube":
              return new YouTubeScraper_js_1.YouTubeScraper(this.logger, this.config);
            case "tiktok":
              return new TikTokScraper_js_1.TikTokScraper(this.logger, this.config);
            case "twitter":
              return new TwitterScraper_js_1.TwitterScraper(this.logger, this.config);
            case "instagram":
              return new InstagramScraper_js_1.InstagramScraper(this.logger, this.config);
            case "reddit":
              return new RedditScraper_js_1.RedditScraper(this.logger, this.config);
            case "facebook":
              return new FacebookScraper_js_1.FacebookScraper(this.logger, this.config);
            case "twitch":
              return new TwitchScraper_js_1.TwitchScraper(this.logger, this.config);
            default:
              logAgent.log("No scraper available for platform: ".concat(platform), "warn");
              return null;
          }
        };
        CreatorMetadataManager3.prototype.extractMetadata = function(videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var logAgent, browserInstance, page, platform, scraper, browserType, metadata, error_1, error_2, error_3;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function(_j) {
              switch (_j.label) {
                case 0:
                  logAgent = this.logger.agent("CreatorMetadataManager");
                  browserInstance = null;
                  page = null;
                  _j.label = 1;
                case 1:
                  _j.trys.push([1, 5, 6, 15]);
                  platform = CreatorMetadataScraper_js_1.CreatorMetadataScraper.detectPlatform(videoUrl);
                  logAgent.log("Detected platform: ".concat(platform), "info");
                  if (platform === "unknown") {
                    logAgent.log("Unknown platform for URL: ".concat(videoUrl), "warn");
                    return [2, null];
                  }
                  scraper = this.getScraperForPlatform(platform);
                  if (!scraper) {
                    return [2, null];
                  }
                  browserType = this.config.browserType || "chromium";
                  if (browserType === "chromium") {
                    browserInstance = new ChromiumBrowser_js_1.ChromiumBrowser(this.logger);
                  } else if (browserType === "firefox") {
                    browserInstance = new FirefoxBrowser_js_1.FirefoxBrowser(this.logger);
                  } else if (browserType === "brave") {
                    browserInstance = new BraveBrowser_js_1.BraveBrowser(this.logger);
                  } else {
                    browserInstance = new ChromiumBrowser_js_1.ChromiumBrowser(this.logger);
                  }
                  return [4, browserInstance.launch({
                    headless: (_b = (_a = this.config.browserConfig) === null || _a === void 0 ? void 0 : _a.headless) !== null && _b !== void 0 ? _b : true,
                    viewport: (_d = (_c = this.config.browserConfig) === null || _c === void 0 ? void 0 : _c.viewport) !== null && _d !== void 0 ? _d : { width: 1920, height: 1080 },
                    ignoreHTTPSErrors: (_f = (_e = this.config.browserConfig) === null || _e === void 0 ? void 0 : _e.ignoreHTTPSErrors) !== null && _f !== void 0 ? _f : true,
                    javaScriptEnabled: (_h = (_g = this.config.browserConfig) === null || _g === void 0 ? void 0 : _g.javaScriptEnabled) !== null && _h !== void 0 ? _h : true
                  })];
                case 2:
                  _j.sent();
                  return [4, browserInstance.getPage()];
                case 3:
                  page = _j.sent();
                  return [4, scraper.extractMetadata(page, videoUrl)];
                case 4:
                  metadata = _j.sent();
                  return [2, metadata];
                case 5:
                  error_1 = _j.sent();
                  logAgent.log("Error extracting metadata: ".concat(error_1), "error");
                  return [2, null];
                case 6:
                  if (!page) return [3, 10];
                  _j.label = 7;
                case 7:
                  _j.trys.push([7, 9, , 10]);
                  return [4, page.close()];
                case 8:
                  _j.sent();
                  return [3, 10];
                case 9:
                  error_2 = _j.sent();
                  return [3, 10];
                case 10:
                  if (!browserInstance) return [3, 14];
                  _j.label = 11;
                case 11:
                  _j.trys.push([11, 13, , 14]);
                  return [4, browserInstance.close()];
                case 12:
                  _j.sent();
                  return [3, 14];
                case 13:
                  error_3 = _j.sent();
                  return [3, 14];
                case 14:
                  return [
                    7
                    /*endfinally*/
                  ];
                case 15:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        CreatorMetadataManager3.prototype.extractMetadataFromPage = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var logAgent, platform, scraper, metadata, error_4;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  logAgent = this.logger.agent("CreatorMetadataManager");
                  _a.label = 1;
                case 1:
                  _a.trys.push([1, 3, , 4]);
                  platform = CreatorMetadataScraper_js_1.CreatorMetadataScraper.detectPlatform(videoUrl);
                  logAgent.log("Detected platform: ".concat(platform), "info");
                  if (platform === "unknown") {
                    logAgent.log("Unknown platform for URL: ".concat(videoUrl), "warn");
                    return [2, null];
                  }
                  scraper = this.getScraperForPlatform(platform);
                  if (!scraper) {
                    return [2, null];
                  }
                  return [4, scraper.extractMetadata(page, videoUrl)];
                case 2:
                  metadata = _a.sent();
                  return [2, metadata];
                case 3:
                  error_4 = _a.sent();
                  logAgent.log("Error extracting metadata: ".concat(error_4), "error");
                  return [2, null];
                case 4:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return CreatorMetadataManager3;
      })()
    );
    exports2.CreatorMetadataManager = CreatorMetadataManager2;
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AdBlocker: () => AdBlocker,
  BaseHelper: () => import_BaseHelper4.BaseHelper,
  BraveBrowser: () => import_BraveBrowser2.BraveBrowser,
  BrowserHelper: () => BrowserHelper,
  ChromiumBrowser: () => import_ChromiumBrowser2.ChromiumBrowser,
  CreatorMetadataManager: () => import_CreatorMetadataManager.CreatorMetadataManager,
  CreatorMetadataScraper: () => import_CreatorMetadataScraper.CreatorMetadataScraper,
  DownloadHelper: () => DownloadHelper,
  FacebookScraper: () => import_FacebookScraper.FacebookScraper,
  FirefoxBrowser: () => import_FirefoxBrowser2.FirefoxBrowser,
  IFrameMonitor: () => IFrameMonitor,
  InstagramScraper: () => import_InstagramScraper.InstagramScraper,
  M3U8Processor: () => M3U8Processor,
  NetworkMonitor: () => NetworkMonitor,
  PageHelper: () => PageHelper,
  PlayButtonHandler: () => PlayButtonHandler,
  PopupHandler: () => PopupHandler,
  RedditScraper: () => import_RedditScraper.RedditScraper,
  RequestHandler: () => RequestHandler,
  RouteHandler: () => RouteHandler,
  StreamButtonHandler: () => StreamButtonHandler,
  StreamHandler: () => StreamHandler,
  TikTokScraper: () => import_TikTokScraper.TikTokScraper,
  TitleScraper: () => TitleScraper,
  TwitchScraper: () => import_TwitchScraper.TwitchScraper,
  TwitterScraper: () => import_TwitterScraper.TwitterScraper,
  VideoDownloader: () => VideoDownloader,
  YouTubeScraper: () => import_YouTubeScraper.YouTubeScraper,
  default: () => index_default,
  main: () => main
});
module.exports = __toCommonJS(index_exports);
var import_StringBuilder = __toESM(require_StringBuilder());

// src/VideoDownloader.ts
var import_FirefoxBrowser = __toESM(require_FirefoxBrowser());
var import_BraveBrowser = __toESM(require_BraveBrowser());
var import_ChromiumBrowser = __toESM(require_ChromiumBrowser());

// src/utils/AdBlocker.ts
var AdBlocker = class {
  blockedDomains;
  blockedPatterns;
  constructor() {
    this.blockedDomains = /* @__PURE__ */ new Set([
      "googleads.g.doubleclick.net",
      "googlesyndication.com",
      "doubleclick.net",
      "google-analytics.com",
      "googletagmanager.com",
      "facebook.com",
      "facebook.net",
      "twitter.com",
      "ads.yahoo.com",
      "amazon-adsystem.com",
      "adnxs.com",
      "adsystem.com",
      "outbrain.com",
      "taboola.com",
      "adskeeper.co.uk",
      "mgid.com",
      "smartadserver.com",
      "criteo.com",
      "adsafeprotected.com",
      "moatads.com",
      "scorecardresearch.com",
      "quantserve.com",
      "openx.net",
      "rubiconproject.com",
      "pubmatic.com",
      "contextweb.com",
      "adsrvr.org",
      "turn.com",
      "rlcdn.com",
      "bluekai.com",
      "demdex.net",
      "adsafeprotected.com",
      "creative.mnaspm.com",
      "growcdnssedge.com",
      "edge-hls.growcdnssedge.com",
      "media-hls.growcdnssedge.com"
    ]);
    this.blockedPatterns = [
      /\/ads?\//i,
      /\/ad[\-_]?server/i,
      /\/advertisement/i,
      /\/banner/i,
      /\/popup/i,
      /\/interstitial/i,
      /\/preroll/i,
      /\/midroll/i,
      /\/tracking/i,
      /\/analytics/i,
      /\/metrics/i,
      /googleads/i,
      /doubleclick/i,
      /googlesyndication/i
    ];
  }
  blockWebsites(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      const fullUrl = url.toLowerCase();
      if (this.blockedDomains.has(domain)) {
        return true;
      }
      for (const blockedDomain of this.blockedDomains) {
        if (domain.endsWith(`.${blockedDomain}`)) {
          return true;
        }
      }
      for (const pattern of this.blockedPatterns) {
        if (pattern.test(fullUrl)) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  addBlockedDomain(domain) {
    this.blockedDomains.add(domain.toLowerCase());
  }
  removeBlockedDomain(domain) {
    this.blockedDomains.delete(domain.toLowerCase());
  }
  addBlockedPattern(pattern) {
    this.blockedPatterns.push(pattern);
  }
  isBlocked(url) {
    return this.blockWebsites(url);
  }
};

// src/handlers/RouteHandler.ts
var RouteHandler = class {
  adBlocker;
  logger;
  constructor(logger) {
    this.adBlocker = new AdBlocker();
    this.logger = logger.agent("RouteHandler");
  }
  async handleRoute(route, request) {
    const url = request.url();
    if (this.adBlocker.blockWebsites(url)) {
      this.logger.log(`Blocked: ${url}`, "debug");
      await route.abort();
    } else {
      await route.continue();
    }
  }
  getAdBlocker() {
    return this.adBlocker;
  }
};

// src/handlers/RequestHandler.ts
var RequestHandler = class {
  logger;
  videoCandidates = [];
  allVideoRequests = [];
  capturedHeaders = {};
  constructor(logger) {
    this.logger = logger.agent("RequestHandler");
  }
  async handleRequest(request) {
    const url = request.url();
    const urlLower = url.toLowerCase();
    if (this.isVideoRelatedUrl(urlLower)) {
      this.capturedHeaders = {
        "User-Agent": request.headers()["user-agent"] || "",
        Referer: request.headers()["referer"] || "",
        Origin: request.headers()["origin"] || "",
        Cookie: request.headers()["cookie"] || "",
        Accept: request.headers()["accept"] || "*/*",
        "Accept-Language": request.headers()["accept-language"] || "en-US,en;q=0.9"
      };
      this.allVideoRequests.push(url);
      this.logger.log(
        `Video-related request: ${request.method()} ${url}`,
        "info"
      );
      if (urlLower.includes(".m3u8")) {
        this.logger.log(`M3U8 detected: ${url}`, "info");
        const candidate = {
          url,
          headers: { ...this.capturedHeaders },
          timestamp: Date.now(),
          domain: this.extractDomain(url),
          source: "request_handler"
        };
        if (!this.videoCandidates.some((c) => c.url === url)) {
          this.videoCandidates.push(candidate);
          this.logger.log(`Added M3U8 candidate: ${url}`, "info");
        }
      }
    }
  }
  async handleResponse(response) {
    const url = response.url();
    const urlLower = url.toLowerCase();
    if (this.isVideoRelatedUrl(urlLower)) {
      this.logger.log(
        `Video response: ${response.status()} ${url}`,
        "info"
      );
      if (urlLower.includes(".m3u8")) {
        const candidate = {
          url,
          headers: this.capturedHeaders,
          timestamp: Date.now(),
          domain: this.extractDomain(url),
          source: "response_handler",
          status: response.status()
        };
        if (!this.videoCandidates.some((c) => c.url === url)) {
          this.videoCandidates.push(candidate);
        }
      }
    }
  }
  isVideoRelatedUrl(url) {
    if (url.includes("sacdnssedge") || url.includes("growcdnssedge")) {
      return false;
    }
    if (url.includes("tscprts.com") || url.includes("mnaspm.com") || url.includes("tsyndicate.com")) {
      return false;
    }
    return url.includes(".m3u8");
  }
  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  }
  getVideoCandidates() {
    return [...this.videoCandidates];
  }
  getAllVideoRequests() {
    return [...this.allVideoRequests];
  }
  getCapturedHeaders() {
    return { ...this.capturedHeaders };
  }
  clearCandidates() {
    this.videoCandidates = [];
    this.allVideoRequests = [];
  }
};

// src/handlers/StreamButtonHandler.ts
var StreamButtonHandler = class {
  logger;
  constructor(logger) {
    this.logger = logger.agent("StreamButtonHandler");
  }
  async tryStreamButtonsSequentially(page) {
    this.logger.log("Trying stream buttons sequentially...", "info");
    const streamButtonSelectors = [
      'a[data-localize="iozdmrmvqd"]',
      // STREAM TV
      'a[data-localize="vsomupazip"]',
      // STREAM ST
      'a[data-localize="mppucpwmlr"]',
      // STREAM SB
      'a[data-localize="fnxaxpqtvb"]',
      // STREAM EA
      'a[data-localize="zvaqabbhei"]',
      // STREAM LU
      'a[data-localize="ctslwegyea"]',
      // STREAM JK
      "a.wp-btn-iframe__shortcode"
      // Generic fallback
    ];
    for (let i = 0; i < streamButtonSelectors.length; i++) {
      const selector = streamButtonSelectors[i];
      try {
        this.logger.log(
          `Trying stream button ${i + 1}/${streamButtonSelectors.length}: ${selector}`,
          "info"
        );
        const elements = page.locator(selector);
        const count = await elements.count();
        if (count === 0) {
          this.logger.log(
            `No buttons found with selector: ${selector}`,
            "info"
          );
          continue;
        }
        for (let j = 0; j < count; j++) {
          try {
            if (page.isClosed()) {
              this.logger.log(
                "Page is closed, stopping button attempts",
                "warn"
              );
              return false;
            }
            const button = elements.nth(j);
            const isVisible = await button.isVisible();
            if (!isVisible) {
              continue;
            }
            const buttonText = await button.textContent() || "";
            const dataLocalize = await button.getAttribute("data-localize") || "";
            this.logger.log(
              `Clicking button: ${buttonText} (${dataLocalize})`,
              "info"
            );
            try {
              await page.waitForTimeout(2e3);
              await button.scrollIntoViewIfNeeded();
              await page.waitForTimeout(500);
              try {
                await button.hover({ timeout: 3e3 });
                await page.waitForTimeout(800);
              } catch {
              }
              this.logger.log(
                `Clicking button: ${buttonText} with human-like behavior`,
                "info"
              );
              await button.click({ timeout: 1e4 });
              await page.waitForTimeout(1500);
              return true;
            } catch (clickError) {
              this.logger.log(
                `Failed to click button ${buttonText}: ${clickError}`,
                "warn"
              );
              continue;
            }
          } catch (error) {
            this.logger.log(
              `Failed to click button ${j + 1} with selector ${selector}: ${error}`,
              "warn"
            );
            continue;
          }
        }
      } catch (error) {
        this.logger.log(
          `Error with selector ${selector}: ${error}`,
          "warn"
        );
        continue;
      }
    }
    return false;
  }
  async clickSpecificStreamButton(page, selector) {
    try {
      this.logger.log(
        `Attempting to click specific stream button: ${selector}`,
        "info"
      );
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count === 0) {
        this.logger.log(
          `No button found with selector: ${selector}`,
          "info"
        );
        return false;
      }
      const button = elements.first();
      const isVisible = await button.isVisible();
      if (!isVisible) {
        this.logger.log(`Button not visible: ${selector}`, "info");
        return false;
      }
      const buttonText = await button.textContent() || "";
      this.logger.log(`Clicking specific button: ${buttonText}`, "info");
      await page.waitForTimeout(1e3);
      await button.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      try {
        await button.hover({ timeout: 2e3 });
        await page.waitForTimeout(500);
      } catch {
      }
      await button.click({ timeout: 5e3 });
      await page.waitForTimeout(1e3);
      this.logger.log(
        `Successfully clicked button: ${buttonText}`,
        "info"
      );
      return true;
    } catch (error) {
      this.logger.log(
        `Failed to click specific stream button ${selector}: ${error}`,
        "error"
      );
      return false;
    }
  }
  async findAvailableStreamButtons(page) {
    const streamButtonSelectors = [
      'a[data-localize="iozdmrmvqd"]',
      // STREAM TV
      'a[data-localize="vsomupazip"]',
      // STREAM ST
      'a[data-localize="mppucpwmlr"]',
      // STREAM SB
      'a[data-localize="fnxaxpqtvb"]',
      // STREAM EA
      'a[data-localize="zvaqabbhei"]',
      // STREAM LU
      'a[data-localize="ctslwegyea"]',
      // STREAM JK
      "a.wp-btn-iframe__shortcode"
      // Generic fallback
    ];
    const availableButtons = [];
    for (const selector of streamButtonSelectors) {
      try {
        const elements = page.locator(selector);
        const count = await elements.count();
        if (count > 0) {
          const isVisible = await elements.first().isVisible();
          if (isVisible) {
            availableButtons.push(selector);
            const buttonText = await elements.first().textContent() || "";
            this.logger.log(
              `Found available stream button: ${buttonText} (${selector})`,
              "info"
            );
          }
        }
      } catch (error) {
        this.logger.log(
          `Error checking selector ${selector}: ${error}`,
          "debug"
        );
      }
    }
    this.logger.log(
      `Found ${availableButtons.length} available stream buttons`,
      "info"
    );
    return availableButtons;
  }
};

// src/handlers/PopupHandler.ts
var PopupHandler = class {
  logger;
  constructor(logger) {
    this.logger = logger.agent("PopupHandler");
  }
  async closePopups(page) {
    this.logger.log("Checking for popups and modals to close...", "info");
    const popupSelectors = [
      // Common modal close buttons
      ".modal-close",
      ".close-modal",
      ".modal .close",
      ".popup-close",
      ".close-popup",
      ".popup .close",
      // Generic close buttons
      '[aria-label*="close" i]',
      '[title*="close" i]',
      '[data-dismiss="modal"]',
      "[data-close]",
      // Common close button patterns
      "button.close",
      ".close-btn",
      ".btn-close",
      "#close-btn",
      ".close-button",
      // X buttons
      ".fa-times",
      ".fa-close",
      ".icon-close",
      ".icon-times",
      // Overlay close
      ".overlay-close",
      ".backdrop-close",
      // Ad close buttons
      ".ad-close",
      ".advertisement-close",
      ".banner-close",
      // Video player close buttons
      ".video-close",
      ".player-close",
      // Newsletter/subscription popups
      ".newsletter-close",
      ".subscription-close",
      ".email-close",
      // Cookie consent
      ".cookie-close",
      ".gdpr-close",
      ".consent-close",
      // Skip buttons for ads
      ".skip-ad",
      ".skip-button",
      '[aria-label*="skip" i]',
      // Continue buttons that might close popups
      ".continue-btn",
      ".proceed-btn",
      '[onclick*="proceed" i]'
    ];
    for (const selector of popupSelectors) {
      try {
        const elements = page.locator(selector);
        const count = await elements.count();
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            try {
              const element = elements.nth(i);
              const isVisible = await element.isVisible();
              if (!isVisible) continue;
              this.logger.log(
                `Clicking popup close button: ${selector}`,
                "info"
              );
              await element.click({ timeout: 3e3 });
              await page.waitForTimeout(500);
            } catch (error) {
              this.logger.log(
                `Failed to click popup element ${i} with selector ${selector}: ${error}`,
                "debug"
              );
            }
          }
        }
      } catch (error) {
        this.logger.log(
          `Error with popup selector ${selector}: ${error}`,
          "debug"
        );
      }
    }
    page.on("dialog", async (dialog) => {
      this.logger.log(
        `Handling dialog: ${dialog.type()} - ${dialog.message()}`,
        "info"
      );
      await dialog.dismiss();
    });
    page.context().on("page", async (newPage) => {
      this.logger.log("New popup page detected, closing it", "info");
      try {
        await newPage.close();
      } catch (error) {
        this.logger.log(
          `Failed to close popup page: ${error}`,
          "debug"
        );
      }
    });
    this.logger.log("Popup cleanup completed", "info");
  }
  async closeSpecificPopup(page, selector) {
    try {
      const element = page.locator(selector);
      const isVisible = await element.isVisible();
      if (isVisible) {
        this.logger.log(`Closing specific popup: ${selector}`, "info");
        await element.click({ timeout: 3e3 });
        await page.waitForTimeout(500);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.log(
        `Failed to close specific popup ${selector}: ${error}`,
        "debug"
      );
      return false;
    }
  }
  async waitAndClosePopups(page, timeout = 5e3) {
    this.logger.log(
      `Waiting ${timeout}ms for popups to appear and closing them...`,
      "info"
    );
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      await this.closePopups(page);
      await page.waitForTimeout(1e3);
    }
    this.logger.log("Popup monitoring period completed", "info");
  }
};

// src/handlers/PlayButtonHandler.ts
var PlayButtonHandler = class {
  logger;
  downloadCompleted = false;
  shouldTerminate = false;
  constructor(logger) {
    this.logger = logger.agent("PlayButtonHandler");
  }
  async handlePlayButtons(page, maxAttempts = 2) {
    this.logger.log("Starting automatic play button handling...", "info");
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      this.logger.log(
        `Play button attempt ${attempt}/${maxAttempts}`,
        "info"
      );
      let clicked = await this.tryClickPlayButton(page);
      if (!clicked) {
        clicked = await this.tryClickPlayButtonInIframes(page);
      }
      if (clicked) {
        this.logger.log(
          "Play button clicked! Waiting for video streams to load...",
          "info"
        );
        await page.waitForTimeout(12e3);
        this.logger.log(
          "Checking if additional play button clicks needed...",
          "info"
        );
        const additionalClick = await this.tryClickPlayButton(page, true) || await this.tryClickPlayButtonInIframes(page, true);
        if (additionalClick) {
          this.logger.log("Additional play button clicked!", "info");
          await page.waitForTimeout(8e3);
        }
        break;
      } else {
        await page.waitForTimeout(2e3);
      }
    }
  }
  async tryClickPlayButton(page, quickCheck = false) {
    const playButtonSelectors = [
      // Specific selectors from the actual page (highest priority)
      "div.playbutton",
      ".playbutton",
      '[onclick*="start_player"]',
      '[onclick="start_player()"]',
      'div[onclick*="start_player"]',
      // Other common selectors
      '[onclick*="start_player" i]',
      // Common play button selectors
      ".jw-display-icon-container",
      ".jw-display-icon-play",
      ".jwplayer .jw-icon-play",
      ".video-js .vjs-big-play-button",
      ".plyr__control--overlaid",
      '[aria-label*="play" i]',
      '[title*="play" i]',
      'button[class*="play"]',
      ".play-button",
      ".play-btn",
      "#play-button",
      // SVG play buttons
      'svg[class*="play"]',
      // Generic play indicators
      '[data-role="play"]',
      '[onclick*="play"]',
      // Video elements that might be clickable
      "#vplayer",
      ".video-container"
    ];
    if (quickCheck) {
      this.logger.log(
        "Quick check for additional play buttons...",
        "info"
      );
      playButtonSelectors.splice(8);
    } else {
      this.logger.log("Looking for play button...", "info");
    }
    for (const selector of playButtonSelectors) {
      try {
        const elements = page.locator(selector);
        const count = await elements.count();
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            try {
              const button = elements.nth(i);
              const isVisible = await button.isVisible();
              if (isVisible) {
                this.logger.log(
                  `Clicking play button with selector: ${selector}`,
                  "info"
                );
                await button.click({ timeout: 3e3 });
                await page.waitForTimeout(3e3);
                return true;
              }
            } catch (error) {
              this.logger.log(
                `Failed to click play button ${i}: ${error}`,
                "debug"
              );
            }
          }
        }
      } catch (error) {
        this.logger.log(
          `Error with play button selector ${selector}: ${error}`,
          "debug"
        );
      }
    }
    const frames = page.frames();
    for (const frame of frames) {
      if (frame !== page.mainFrame()) {
        try {
          for (const selector of playButtonSelectors) {
            try {
              const elements = frame.locator(selector);
              const count = await elements.count();
              if (count > 0) {
                for (let i = 0; i < count; i++) {
                  try {
                    const button = elements.nth(i);
                    const isVisible = await button.isVisible();
                    if (isVisible) {
                      this.logger.log(
                        `Clicking play button in iframe with selector: ${selector}`,
                        "info"
                      );
                      await button.click({
                        timeout: 3e3
                      });
                      await page.waitForTimeout(3e3);
                      return true;
                    }
                  } catch (error) {
                    this.logger.log(
                      `Failed to click iframe play button ${i}: ${error}`,
                      "debug"
                    );
                  }
                }
              }
            } catch (error) {
              this.logger.log(
                `Error with iframe play button selector ${selector}: ${error}`,
                "debug"
              );
            }
          }
        } catch (error) {
          this.logger.log(
            `Error accessing iframe for play button: ${error}`,
            "debug"
          );
        }
      }
    }
    this.logger.log("No play button found or clicked", "info");
    return false;
  }
  async tryClickPlayButtonInIframes(page, quickCheck = false) {
    this.logger.log("Looking for play button in iframes...", "info");
    const frames = page.frames();
    for (const frame of frames) {
      if (frame === page.mainFrame()) continue;
      try {
        const frameUrl = frame.url();
        if (!frameUrl || frameUrl === "about:blank") continue;
        this.logger.log(
          `Checking iframe for play button: ${frameUrl}`,
          "info"
        );
        const playButtonSelectors = [
          "div.playbutton",
          ".playbutton",
          '[onclick*="start_player"]',
          '[onclick="start_player()"]',
          'div[onclick*="start_player"]',
          'button[data-action="play"]',
          ".video-play-button",
          ".play-btn",
          ".play-button",
          "button.play",
          ".jw-display-icon-container",
          ".jw-icon-play",
          ".vjs-big-play-button",
          'button[aria-label*="play" i]',
          'button[title*="play" i]',
          '[role="button"][aria-label*="play" i]',
          'div[class*="play" i][role="button"]',
          'button[class*="play" i]',
          ".video-overlay-play-button",
          ".plyr__control--overlaid"
        ];
        for (const selector of playButtonSelectors) {
          try {
            const button = frame.locator(selector).first();
            const isVisible = await button.isVisible({
              timeout: quickCheck ? 1e3 : 3e3
            });
            if (isVisible) {
              this.logger.log(
                `Found play button in iframe with selector: ${selector}`,
                "info"
              );
              try {
                await button.scrollIntoViewIfNeeded({
                  timeout: 2e3
                });
                await frame.waitForTimeout(500);
                await button.click({ timeout: 5e3 });
                this.logger.log(
                  `Successfully clicked play button in iframe: ${frameUrl}`,
                  "info"
                );
                await frame.waitForTimeout(3e3);
                return true;
              } catch (clickError) {
                this.logger.log(
                  `Failed to click play button in iframe: ${clickError}`,
                  "warn"
                );
                continue;
              }
            }
          } catch (selectorError) {
            continue;
          }
        }
      } catch (frameError) {
        this.logger.log(
          `Error checking iframe ${frame.url()}: ${frameError}`,
          "warn"
        );
        continue;
      }
    }
    this.logger.log("No play button found in any iframe", "info");
    return false;
  }
  shouldContinueNavigation() {
    return !this.downloadCompleted && !this.shouldTerminate;
  }
  markDownloadCompleted() {
    this.downloadCompleted = true;
    this.shouldTerminate = true;
    this.logger.log("Download marked as completed", "info");
  }
  shouldTerminateScript() {
    return this.shouldTerminate;
  }
  reset() {
    this.downloadCompleted = false;
    this.shouldTerminate = false;
  }
};

// src/utils/M3U8Processor.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var os = __toESM(require("os"));
var import_child_process = require("child_process");

// src/helpers/Constants.ts
var DEFAULT_OUTPUT_DIR = "downloads/output.mp4";

// src/utils/M3U8Processor.ts
var ffmpegStatic = null;
async function loadFFmpegStatic() {
  if (ffmpegStatic !== null) {
    return ffmpegStatic;
  }
  try {
    const ffmpegModule = await import("ffmpeg-static");
    ffmpegStatic = ffmpegModule.default || ffmpegModule;
    return ffmpegStatic;
  } catch (error) {
    try {
      const { createRequire } = await import("module");
      let requireFn;
      if (typeof __filename !== "undefined") {
        requireFn = require;
      } else {
        const moduleUrl = new URL(
          "file://" + process.cwd() + "/package.json"
        );
        requireFn = createRequire(moduleUrl);
      }
      ffmpegStatic = requireFn("ffmpeg-static");
      return ffmpegStatic;
    } catch (requireError) {
      console.warn(
        "Warning: ffmpeg-static could not be loaded. Using system ffmpeg as fallback."
      );
      return null;
    }
  }
}
var SimpleDownloader = class {
  defaultHeaders = {};
  constructor(config = {}) {
    this.defaultHeaders = config.headers || {};
  }
  get defaults() {
    return {
      headers: {
        common: this.defaultHeaders
      }
    };
  }
  /**
   * Download file using curl - much more reliable than custom HTTP implementation
   */
  async downloadFile(url, outputPath, headers) {
    try {
      const allHeaders = { ...this.defaultHeaders, ...headers };
      const curlArgs = [
        "-L",
        // Follow redirects
        "--fail",
        // Fail on HTTP errors
        "--silent",
        // Silent mode
        "--show-error",
        // Show errors
        "--max-time",
        "60",
        // 60 second timeout
        "--retry",
        "3",
        // Retry 3 times
        "--retry-delay",
        "2"
        // 2 second delay between retries
      ];
      for (const [key, value] of Object.entries(allHeaders)) {
        if (value) {
          curlArgs.push("-H", `${key}: ${value}`);
        }
      }
      curlArgs.push("-o", outputPath, url);
      const result = await new Promise((resolve) => {
        const curlProcess = (0, import_child_process.spawn)("curl", curlArgs, {
          stdio: "pipe"
        });
        let errorOutput = "";
        curlProcess.stderr?.on("data", (data) => {
          errorOutput += data.toString();
        });
        curlProcess.on("close", (code) => {
          if (code === 0) {
            resolve({ success: true });
          } else {
            resolve({
              success: false,
              error: `Exit code ${code}: ${errorOutput}`
            });
          }
        });
        curlProcess.on("error", (error) => {
          resolve({ success: false, error: error.message });
        });
        setTimeout(() => {
          curlProcess.kill();
          resolve({
            success: false,
            error: "Timeout after 90 seconds"
          });
        }, 9e4);
      });
      if (!result.success) {
        return false;
      }
      if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  /**
   * Download text content using curl
   */
  async downloadText(url, headers) {
    try {
      const tempFile = path.join(
        os.tmpdir(),
        `temp_download_${Date.now()}.txt`
      );
      if (await this.downloadFile(url, tempFile, headers)) {
        const content = fs.readFileSync(tempFile, "utf8");
        fs.unlinkSync(tempFile);
        return content;
      }
      return null;
    } catch (error) {
      this.logger?.log(`Text download failed: ${error}`, "error");
      return null;
    }
  }
  logger;
  setLogger(logger) {
    this.logger = logger.agent("SimpleDownloader");
  }
};
var M3U8Processor = class {
  logger;
  downloader;
  tempDir = null;
  segmentFiles = [];
  config;
  progressBar = null;
  progressUpdateLock = false;
  completedSegments = 0;
  totalSegments = 0;
  downloadStartTime = 0;
  constructor(logger, config = {}) {
    this.logger = logger.agent("M3U8Processor");
    this.config = {
      outputFilepath: config.outputFilepath || DEFAULT_OUTPUT_DIR,
      maxWorkers: config.maxWorkers || 4,
      timeout: config.timeout || 3e4,
      // Python default timeout
      retries: config.retries || 3,
      ffmpegPath: config.ffmpegPath,
      // Will be set in initializeFFmpeg
      segmentTimeout: config.segmentTimeout || 3e4
    };
    this.initializeFFmpeg();
    this.downloader = new SimpleDownloader({
      // EXACT headers from working Python script (lines 26-38 in m3u8_downloader.py)
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0"
      }
    });
    this.downloader.setLogger(this.logger.logger);
  }
  get outputFilename() {
    return path.basename(this.config.outputFilepath || DEFAULT_OUTPUT_DIR);
  }
  get outputDirpath() {
    return path.dirname(this.config.outputFilepath || DEFAULT_OUTPUT_DIR);
  }
  async initializeFFmpeg() {
    if (!this.config.ffmpegPath) {
      const bundledFFmpeg = await loadFFmpegStatic();
      this.config.ffmpegPath = bundledFFmpeg || "ffmpeg";
      if (bundledFFmpeg) {
        this.logger.log(
          "Using bundled FFmpeg from ffmpeg-static",
          "info"
        );
      } else {
        this.logger.log("Using system FFmpeg as fallback", "warn");
      }
    }
  }
  /**
   * Configure downloader headers - EXACT equivalent of Python session.headers.update()
   */
  configureDownloaderHeaders(headers, m3u8Url) {
    this.downloader.defaults.headers.common = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      DNT: "1",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Cache-Control": "max-age=0"
    };
    if (headers["Referer"]) {
      this.downloader.defaults.headers.common["Referer"] = headers["Referer"];
    } else if (m3u8Url) {
      try {
        const url = new URL(m3u8Url);
        this.downloader.defaults.headers.common["Referer"] = `${url.protocol}//${url.host}/`;
      } catch (e) {
      }
    }
    if (headers["Origin"]) {
      this.downloader.defaults.headers.common["Origin"] = headers["Origin"];
    } else if (m3u8Url) {
      try {
        const url = new URL(m3u8Url);
        this.downloader.defaults.headers.common["Origin"] = `${url.protocol}//${url.host}`;
      } catch (e) {
      }
    }
    for (const [key, value] of Object.entries(headers)) {
      if (value && !["Referer", "Origin"].includes(key)) {
        if (![
          "User-Agent",
          "Accept",
          "Accept-Language",
          "Accept-Encoding",
          "DNT",
          "Connection",
          "Upgrade-Insecure-Requests",
          "Sec-Fetch-Dest",
          "Sec-Fetch-Mode",
          "Sec-Fetch-Site",
          "Sec-Fetch-User",
          "Cache-Control"
        ].includes(key)) {
          this.downloader.defaults.headers.common[key] = value;
        }
      }
    }
  }
  /**
   * Parse M3U8 playlist - Download file locally then parse it
   */
  async parsePlaylist(m3u8Url, browserPage) {
    try {
      this.logger.log(`Downloading M3U8 playlist: ${m3u8Url}`, "info");
      const playlistContent = await this.downloader.downloadText(m3u8Url);
      if (!playlistContent) {
        this.logger.log("Failed to download M3U8 playlist", "error");
        return null;
      }
      this.logger.log(
        `M3U8 content downloaded: ${playlistContent.length} characters`,
        "info"
      );
      const firstLines = playlistContent.split("\n").slice(0, 5).join("\n");
      this.logger.log(`Playlist preview:
${firstLines}`, "debug");
      return this.parseM3U8Content(playlistContent, m3u8Url);
    } catch (error) {
      this.logger.log(
        `Error parsing playlist: ${error.message || error}`,
        "error"
      );
      return null;
    }
  }
  extractOrigin(url) {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}`;
    } catch {
      return "";
    }
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  /**
   * Parse M3U8 content - EXACT replication of Python m3u8.loads() behavior
   */
  parseM3U8Content(content, baseUrl) {
    const lines = content.split("\n").map((line) => line.trim()).filter((line) => line);
    const playlist = { segments: [], playlists: [] };
    let isMasterPlaylist = false;
    for (const line of lines) {
      if (line.startsWith("#EXT-X-STREAM-INF:")) {
        isMasterPlaylist = true;
        break;
      }
    }
    if (isMasterPlaylist) {
      this.logger.log(
        "Parsing master playlist (multiple quality streams)",
        "info"
      );
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        if (line.startsWith("#EXT-X-STREAM-INF:")) {
          const streamInfo = this.parseStreamInfo(line);
          const nextLine = lines[i + 1];
          if (nextLine && !nextLine.startsWith("#")) {
            playlist.playlists = playlist.playlists || [];
            playlist.playlists.push({
              uri: nextLine,
              streamInfo
            });
          }
          i += 2;
        } else {
          i++;
        }
      }
      this.logger.log(
        `Found ${playlist.playlists?.length || 0} quality variants`,
        "info"
      );
    } else {
      this.logger.log("Parsing media playlist (video segments)", "info");
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        if (line.startsWith("#EXTINF:")) {
          const duration = this.extractDuration(line);
          const nextLine = lines[i + 1];
          if (nextLine && !nextLine.startsWith("#")) {
            playlist.segments.push({
              uri: nextLine,
              duration
            });
          }
          i += 2;
        } else {
          i++;
        }
      }
      this.logger.log(
        `Found ${playlist.segments.length} video segments`,
        "info"
      );
    }
    return playlist;
  }
  /**
   * Parse stream info from EXT-X-STREAM-INF line
   */
  parseStreamInfo(line) {
    const streamInfo = {};
    const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
    if (bandwidthMatch) {
      streamInfo.bandwidth = parseInt(bandwidthMatch[1]);
    }
    const resolutionMatch = line.match(/RESOLUTION=([^,\s]+)/);
    if (resolutionMatch) {
      streamInfo.resolution = resolutionMatch[1];
    }
    const codecsMatch = line.match(/CODECS="([^"]+)"/);
    if (codecsMatch) {
      streamInfo.codecs = codecsMatch[1];
    }
    return streamInfo;
  }
  /**
   * Extract duration from EXTINF line
   */
  extractDuration(line) {
    const match = line.match(/#EXTINF:([\d.]+)/);
    return match ? parseFloat(match[1]) : void 0;
  }
  /**
   * Select best quality stream - EXACT copy of Python _select_quality method
   */
  selectBestQuality(masterPlaylist, baseUrl) {
    if (!masterPlaylist.playlists || masterPlaylist.playlists.length === 0) {
      this.logger.log(
        "No quality variants found in master playlist",
        "error"
      );
      return null;
    }
    const qualities = [];
    for (const playlist of masterPlaylist.playlists) {
      const resolution = playlist.streamInfo.resolution;
      const bandwidth = playlist.streamInfo.bandwidth || 0;
      if (resolution) {
        const [width, height] = resolution.split("x").map(Number);
        qualities.push({
          url: playlist.uri,
          resolution: `${width}x${height}`,
          bandwidth,
          playlist
        });
      }
    }
    qualities.sort((a, b) => {
      const heightA = parseInt(a.resolution.split("x")[1]);
      const heightB = parseInt(b.resolution.split("x")[1]);
      return heightB - heightA;
    });
    this.logger.log("Available qualities:", "info");
    qualities.forEach((q, i) => {
      this.logger.log(
        `${i + 1}. ${q.resolution} (${q.bandwidth} bps)`,
        "info"
      );
    });
    const selected = qualities[0];
    this.logger.log(`Selected quality: ${selected.resolution}`, "info");
    return this.resolveUrl(selected.url, baseUrl);
  }
  /**
   * Initialize progress tracking with single updating line
   */
  initializeProgressBar(totalSegments) {
    this.stopProgressBar();
    this.updateProgressDisplay(0, totalSegments, "0.0", "0.0");
  }
  /**
   * Update progress display with single overwriting line
   */
  updateProgressDisplay(completed, total, speed, percentage) {
    const speedNum = parseFloat(speed);
    const remainingSegments = total - completed;
    const etaSeconds = speedNum > 0 ? Math.round(remainingSegments / speedNum) : 0;
    const elapsed = (Date.now() - this.downloadStartTime) / 1e3;
    const avgSegmentSize = 500 * 1024;
    const estimatedTotalBytes = total * avgSegmentSize;
    const estimatedDownloadedBytes = completed * avgSegmentSize;
    const formatBytes = (bytes) => {
      const mb = bytes / (1024 * 1024);
      return mb >= 1 ? `${mb.toFixed(2)}MiB` : `${(bytes / 1024).toFixed(2)}KiB`;
    };
    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor(seconds % 3600 / 60);
      const secs = Math.floor(seconds % 60);
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };
    const speedBytesPerSec = speedNum * avgSegmentSize;
    const progressData = {
      status: completed === total ? "finished" : "downloading",
      downloaded_bytes: estimatedDownloadedBytes,
      total_bytes: estimatedTotalBytes,
      tmpfilename: `segment_${completed.toString().padStart(5, "0")}.ts.part`,
      filename: `video_segments_${total}_total.mp4`,
      eta: etaSeconds,
      speed: speedBytesPerSec,
      elapsed,
      ctx_id: null,
      _eta_str: etaSeconds > 0 ? formatTime(etaSeconds) : "N/A",
      _speed_str: speedBytesPerSec > 0 ? `${(speedBytesPerSec / (1024 * 1024)).toFixed(2)}MiB/s` : "N/A",
      _percent_str: percentage + "%",
      _total_bytes_str: formatBytes(estimatedTotalBytes),
      _total_bytes_estimate_str: formatBytes(estimatedTotalBytes),
      _downloaded_bytes_str: formatBytes(estimatedDownloadedBytes),
      _elapsed_str: formatTime(elapsed),
      _default_template: `${percentage}% of ${formatBytes(
        estimatedTotalBytes
      )} at ${speedBytesPerSec > 0 ? (speedBytesPerSec / (1024 * 1024)).toFixed(2) + "MiB/s" : "N/A"} ETA ${etaSeconds > 0 ? formatTime(etaSeconds) : "N/A"}`
    };
    const payload = JSON.stringify(progressData);
    this.logger.logger.append(payload);
    this.logger.logger.invokeEvent.sender.send(
      this.logger.logger.downloadId,
      {
        data: {
          log: payload,
          value: progressData
        },
        completeLog: this.logger.logger.toString()
      }
    );
  }
  /**
   * Increment completed segments counter and log progress periodically
   */
  incrementProgress() {
    if (this.progressUpdateLock) {
      return;
    }
    this.progressUpdateLock = true;
    try {
      this.completedSegments++;
      const elapsed = (Date.now() - this.downloadStartTime) / 1e3;
      const speed = elapsed > 0 ? (this.completedSegments / elapsed).toFixed(1) : "0.0";
      const percentage = (this.completedSegments / this.totalSegments * 100).toFixed(1);
      this.updateProgressDisplay(
        this.completedSegments,
        this.totalSegments,
        speed,
        percentage
      );
    } catch (error) {
      this.logger.log(`Progress update error: ${error}`, "debug");
    } finally {
      this.progressUpdateLock = false;
    }
  }
  /**
   * Update progress bar with current status (thread-safe with simple locking)
   */
  updateProgressBar(current, total, speed) {
    if (this.progressUpdateLock || !this.progressBar) {
      return;
    }
    if (this.progressBar && !this.progressBar.isActive) {
      return;
    }
    this.progressUpdateLock = true;
    try {
      if (this.progressBar) {
        this.progressBar.update(current, {
          speed: speed || "N/A"
        });
      }
    } catch (error) {
      this.logger.log(`Progress bar update error: ${error}`, "debug");
    } finally {
      this.progressUpdateLock = false;
    }
  }
  /**
   * Stop and cleanup progress tracking (safe)
   */
  stopProgressBar() {
    this.progressBar = null;
    this.progressUpdateLock = false;
  }
  /**
   * Download video segments using curl - Much more reliable than custom HTTP
   */
  async downloadSegments(playlist, baseUrl, maxWorkers, progressCallback) {
    if (!playlist.segments || playlist.segments.length === 0) {
      this.logger.log("No segments found in playlist", "error");
      return false;
    }
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), `m3u8_download_${uniqueId}_`)
    );
    this.totalSegments = playlist.segments.length;
    this.completedSegments = 0;
    this.downloadStartTime = Date.now();
    this.logger.log(
      `Starting download of ${this.totalSegments} segments...`,
      "info"
    );
    this.initializeProgressBar(this.totalSegments);
    let successCount = 0;
    const downloadSegment = async (segment, index) => {
      const maxRetries = 10;
      const segmentUrl = this.resolveUrl(segment.uri, baseUrl);
      const segmentFile = path.join(
        this.tempDir,
        `segment_${index.toString().padStart(5, "0")}.ts`
      );
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const success = await this.downloader.downloadFile(
            segmentUrl,
            segmentFile
          );
          if (success) {
            this.segmentFiles.push(segmentFile);
            successCount++;
            this.incrementProgress();
            if (progressCallback) {
              progressCallback(successCount, this.totalSegments);
            }
            return true;
          } else {
            if (attempt < maxRetries) {
              const delay = Math.min(attempt * 300, 3e3);
              await new Promise(
                (resolve) => setTimeout(resolve, delay)
              );
            }
          }
        } catch (error) {
          if (attempt < maxRetries) {
            const delay = Math.min(attempt * 300, 3e3);
            await new Promise(
              (resolve) => setTimeout(resolve, delay)
            );
          }
        }
      }
      return false;
    };
    const semaphore = Array(maxWorkers).fill(0);
    const downloadPromises = playlist.segments.map((segment, index) => {
      return new Promise((resolve) => {
        const execute = async () => {
          const result = await downloadSegment(segment, index);
          resolve(result);
        };
        const waitForSlot = () => {
          const availableIndex = semaphore.findIndex(
            (slot) => slot === 0
          );
          if (availableIndex !== -1) {
            semaphore[availableIndex] = 1;
            execute().finally(() => {
              semaphore[availableIndex] = 0;
            });
          } else {
            setTimeout(waitForSlot, 10);
          }
        };
        waitForSlot();
      });
    });
    await Promise.all(downloadPromises);
    this.stopProgressBar();
    const totalTime = (Date.now() - this.downloadStartTime) / 1e3;
    const avgSpeed = totalTime > 0 ? (successCount / totalTime).toFixed(1) : "N/A";
    process.stdout.write("\r" + " ".repeat(100) + "\r");
    this.logger.log(
      `Download completed: ${successCount}/${this.totalSegments} segments successful in ${totalTime.toFixed(
        1
      )}s (avg: ${avgSpeed} seg/s)`,
      "info"
    );
    if (successCount === 0) {
      this.logger.log(
        "No segments were downloaded successfully",
        "error"
      );
      return false;
    }
    const successRate = successCount / this.totalSegments;
    if (successRate < 0.8) {
      this.logger.log(
        `Partial success: ${(successRate * 100).toFixed(
          1
        )}% - will try curl fallback`,
        "warn"
      );
      return false;
    } else {
      this.logger.log(
        `Successfully downloaded ${successCount} segments via direct HTTP`,
        "info"
      );
      return true;
    }
    return successCount > 0;
  }
  /**
   * Convert downloaded segments to MP4 - equivalent of Python _convert_to_mp4
   */
  async convertToMp4() {
    if (this.segmentFiles.length === 0) {
      this.logger.log("No segments to convert", "error");
      return false;
    }
    this.logger.log(
      `Converting ${this.segmentFiles.length} segments to MP4: ${this.outputFilename}`,
      "info"
    );
    try {
      const outputDir = this.outputDirpath;
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const concatFile = path.join(this.tempDir, "concat.txt");
      const sortedSegments = this.segmentFiles.sort();
      const concatContent = sortedSegments.map((file) => `file '${file}'`).join("\n");
      fs.writeFileSync(concatFile, concatContent);
      const ffmpegArgs = [
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        concatFile,
        "-c:v",
        "copy",
        // Copy video codec
        "-c:a",
        "copy",
        // Copy audio codec
        "-f",
        "mp4",
        "-y",
        // Overwrite output
        this.config.outputFilepath || DEFAULT_OUTPUT_DIR
      ];
      const success = await this.runFFmpeg(ffmpegArgs);
      if (success) {
        this.logger.log("Conversion completed successfully", "info");
        return true;
      } else {
        return await this.convertAlternative(this.outputFilename);
      }
    } catch (error) {
      this.logger.log(`Error during conversion: ${error}`, "error");
      return await this.convertAlternative(this.outputFilename);
    }
  }
  /**
   * Alternative conversion method - equivalent of Python _convert_alternative
   */
  async convertAlternative(outputFilename) {
    try {
      this.logger.log("Trying alternative conversion method...", "info");
      const concatFile = path.join(this.tempDir, "concat.txt");
      const sortedSegments = this.segmentFiles.sort();
      const concatContent = sortedSegments.map((file) => `file '${file}'`).join("\n");
      fs.writeFileSync(concatFile, concatContent);
      const ffmpegArgs = [
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        concatFile,
        "-c:v",
        "libx264",
        // Use h264 codec
        "-c:a",
        "aac",
        // Use AAC audio codec
        "-f",
        "mp4",
        "-y",
        // Overwrite output
        outputFilename
      ];
      const success = await this.runFFmpeg(ffmpegArgs);
      if (success) {
        this.logger.log(
          "Alternative conversion completed successfully",
          "info"
        );
        return true;
      } else {
        this.logger.log("Alternative conversion also failed", "error");
        return false;
      }
    } catch (error) {
      this.logger.log(
        `Alternative conversion also failed: ${error}`,
        "error"
      );
      return false;
    }
  }
  /**
   * Run FFmpeg with given arguments
   */
  async runFFmpeg(args) {
    return new Promise((resolve) => {
      const ffmpeg = (0, import_child_process.spawn)(this.config.ffmpegPath || "ffmpeg", args);
      let hasError = false;
      ffmpeg.stderr?.on("data", (data) => {
        const output = data.toString();
        if (output.includes("error") || output.includes("Error")) {
          this.logger.log(`FFmpeg error: ${output}`, "error");
          hasError = true;
        }
      });
      ffmpeg.on("close", (code) => {
        if (code === 0 && !hasError) {
          resolve(true);
        } else {
          this.logger.log(
            `FFmpeg failed with code: ${code}`,
            "error"
          );
          resolve(false);
        }
      });
      ffmpeg.on("error", (error) => {
        this.logger.log(`FFmpeg process error: ${error}`, "error");
        resolve(false);
      });
    });
  }
  /**
   * Clean up temporary files - equivalent of Python _cleanup
   */
  cleanup() {
    this.stopProgressBar();
    if (this.tempDir && fs.existsSync(this.tempDir)) {
      try {
        fs.rmSync(this.tempDir, { recursive: true, force: true });
      } catch (error) {
        this.logger.log(
          `Failed to cleanup temp directory: ${error}`,
          "warn"
        );
      }
    }
    this.segmentFiles = [];
  }
  /**
   * Resolve URL relative to base URL
   */
  resolveUrl(url, baseUrl) {
    if (url.startsWith("http")) {
      return url;
    }
    try {
      return new URL(url, baseUrl).toString();
    } catch {
      const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
      return base + url;
    }
  }
  // Hybrid approach: Use browser session + TypeScript processing
  async processM3U8(m3u8Url, headers, browserPage) {
    try {
      await this.initializeFFmpeg();
      const outputDir = path.dirname(
        this.config.outputFilepath || DEFAULT_OUTPUT_DIR
      );
      const outputFilename = path.basename(
        this.config.outputFilepath || DEFAULT_OUTPUT_DIR
      );
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const fullPath = path.join(outputDir, outputFilename);
      this.logger.log(`Processing M3U8: ${m3u8Url}`, "info");
      this.logger.log(`Output: ${fullPath}`, "info");
      this.configureDownloaderHeaders(headers, m3u8Url);
      this.logger.log(`Fetching M3U8 playlist from: ${m3u8Url}`, "info");
      let playlist = null;
      if (browserPage) {
        playlist = await this.parsePlaylistWithBrowser(
          m3u8Url,
          browserPage
        );
        if (playlist) {
          this.logger.log(
            "Successfully parsed M3U8 playlist via browser",
            "info"
          );
        } else {
          this.logger.log(
            "Browser M3U8 fetch failed, trying direct HTTP...",
            "debug"
          );
        }
      }
      if (!playlist) {
        playlist = await this.parsePlaylist(m3u8Url);
        if (!playlist) {
          this.logger.log(
            "Failed to parse M3U8 playlist with both browser and direct HTTP",
            "error"
          );
          return false;
        }
      }
      let finalPlaylist = playlist;
      if (playlist.playlists && playlist.playlists.length > 0) {
        this.logger.log(
          "This appears to be a master playlist with multiple qualities",
          "debug"
        );
        const selectedUrl = this.selectBestQuality(playlist, m3u8Url);
        if (!selectedUrl) {
          return false;
        }
        this.logger.log(
          `Selected quality URL: ${selectedUrl}`,
          "debug"
        );
        const selectedPlaylist = await this.parsePlaylist(selectedUrl);
        if (!selectedPlaylist) {
          return false;
        }
        finalPlaylist = selectedPlaylist;
      }
      const segmentSuccess = await this.downloadSegments(
        finalPlaylist,
        m3u8Url,
        this.config.maxWorkers || 4
      );
      if (!segmentSuccess) {
        this.logger.log("Failed to download segments", "error");
        return false;
      }
      if (!await this.convertToMp4()) {
        return false;
      }
      this.logger.log(
        `Download completed successfully: ${fullPath}`,
        "info"
      );
      return true;
    } catch (error) {
      this.logger.log(`M3U8 processing failed: ${error}`, "error");
      return false;
    } finally {
      this.cleanup();
    }
  }
  async downloadDirectVideo(videoUrl, headers) {
    try {
      this.logger.log(`Downloading direct video: ${videoUrl}`, "info");
      const outputFilename = path.basename(
        this.config.outputFilepath || DEFAULT_OUTPUT_DIR
      );
      const outputDir = path.dirname(
        this.config.outputFilepath || DEFAULT_OUTPUT_DIR
      );
      const outputPath = path.join(outputDir, outputFilename);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const ffmpegHeaders = [];
      for (const [key, value] of Object.entries(headers)) {
        if (value) {
          ffmpegHeaders.push("-headers", `${key}: ${value}`);
        }
      }
      const ffmpegArgs = [
        "-y",
        // Overwrite output files
        "-loglevel",
        "info",
        ...ffmpegHeaders,
        "-i",
        videoUrl,
        "-c",
        "copy",
        // Copy without re-encoding
        "-f",
        "mp4",
        outputPath
      ];
      const success = await this.runFFmpeg(ffmpegArgs);
      if (success) {
        this.logger.log(
          `Direct video download successful: ${outputPath}`,
          "info"
        );
        return true;
      } else {
        this.logger.log("Direct video download failed", "error");
        return false;
      }
    } catch (error) {
      this.logger.log(
        `Error downloading direct video: ${error}`,
        "error"
      );
      return false;
    }
  }
  // Browser-based methods that use the browser's session context
  async parsePlaylistWithBrowser(url, browserPage) {
    try {
      this.logger.log(`Extracting M3U8 from browser: ${url}`, "debug");
      const response = await browserPage.evaluate((m3u8Url) => {
        return fetch(m3u8Url, {
          method: "GET",
          credentials: "include",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache"
          }
        }).then((response2) => {
          if (!response2.ok) {
            throw new Error(
              `HTTP ${response2.status}: ${response2.statusText}`
            );
          }
          return response2.text();
        }).then((text) => ({ success: true, content: text })).catch((error) => ({
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }));
      }, url);
      if (!response.success) {
        this.logger.log(
          `Browser M3U8 fetch failed: ${response.error}`,
          "error"
        );
        return null;
      }
      return this.parseM3U8Content(response.content, url);
    } catch (error) {
      this.logger.log(
        `Error in browser M3U8 extraction: ${error}`,
        "error"
      );
      return null;
    }
  }
  async downloadSegmentsWithBrowser(playlist, baseUrl, browserPage, sessionHeaders) {
    if (!playlist.segments || playlist.segments.length === 0) {
      this.logger.log("No segments found in playlist", "error");
      return false;
    }
    if (!this.tempDir) {
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      this.tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), `m3u8_download_${uniqueId}_`)
      );
    }
    this.totalSegments = playlist.segments.length;
    this.completedSegments = 0;
    this.downloadStartTime = Date.now();
    this.logger.log(
      `Starting browser download of ${this.totalSegments} segments...`,
      "info"
    );
    this.initializeProgressBar(this.totalSegments);
    let successCount = 0;
    const startTime = Date.now();
    const downloadSegment = async (segment, index) => {
      const segmentUrl = this.resolveUrl(segment.uri, baseUrl);
      try {
        const segmentData = await browserPage.evaluate(
          (params) => {
            return fetch(params.url, {
              method: "GET",
              credentials: "include",
              headers: params.headers
            }).then((response) => {
              if (!response.ok) {
                throw new Error(
                  `HTTP ${response.status}: ${response.statusText}`
                );
              }
              return response.arrayBuffer();
            }).then((arrayBuffer) => ({
              success: true,
              data: Array.from(new Uint8Array(arrayBuffer))
            })).catch((error) => ({
              success: false,
              error: error instanceof Error ? error.message : String(error)
            }));
          },
          {
            url: segmentUrl,
            headers: sessionHeaders || {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              Accept: "*/*"
            }
          }
        );
        if (segmentData.success) {
          const segmentFile = path.join(
            this.tempDir,
            `segment_${index.toString().padStart(5, "0")}.ts`
          );
          fs.writeFileSync(
            segmentFile,
            Buffer.from(segmentData.data)
          );
          this.segmentFiles.push(segmentFile);
          successCount++;
          this.incrementProgress();
          return true;
        }
      } catch (error) {
        this.logger.log(
          `Segment ${index + 1} failed: ${error}`,
          "debug"
        );
      }
      return false;
    };
    const maxWorkers = 4;
    const semaphore = Array(maxWorkers).fill(0);
    const downloadPromises = playlist.segments.map((segment, index) => {
      return new Promise((resolve) => {
        const execute = async () => {
          const result = await downloadSegment(segment, index);
          resolve(result);
        };
        const waitForSlot = () => {
          const availableIndex = semaphore.findIndex(
            (slot) => slot === 0
          );
          if (availableIndex !== -1) {
            semaphore[availableIndex] = 1;
            execute().finally(() => {
              semaphore[availableIndex] = 0;
            });
          } else {
            setTimeout(waitForSlot, 10);
          }
        };
        waitForSlot();
      });
    });
    await Promise.all(downloadPromises);
    this.stopProgressBar();
    const totalTime = (Date.now() - startTime) / 1e3;
    const successRate = successCount / this.totalSegments;
    this.logger.log(
      `Browser download: ${successCount}/${this.totalSegments} segments (${(successRate * 100).toFixed(
        1
      )}%) in ${totalTime.toFixed(1)}s`,
      "info"
    );
    return successRate >= 0.8;
  }
};

// src/VideoDownloader.ts
init_TitleScraper();

// src/utils/IFrameMonitor.ts
var IFrameMonitor = class {
  logger;
  monitoredFrames = /* @__PURE__ */ new Set();
  constructor(logger) {
    this.logger = logger.agent("IFrameMonitor");
  }
  async setupMonitoring(page, requestHandler) {
    this.logger.log("Setting up iframe monitoring...", "info");
    await this.monitorExistingFrames(page, requestHandler);
    page.on("frameattached", async (frame) => {
      this.logger.log(`New iframe attached: ${frame.url()}`, "info");
      await this.monitorFrame(frame, requestHandler);
    });
    page.on("framenavigated", async (frame) => {
      if (frame !== page.mainFrame()) {
        this.logger.log(`Iframe navigated: ${frame.url()}`, "info");
        await this.monitorFrame(frame, requestHandler);
      }
    });
    this.logger.log("Iframe monitoring setup complete", "info");
  }
  async monitorExistingFrames(page, requestHandler) {
    const frames = page.frames();
    for (const frame of frames) {
      if (frame !== page.mainFrame()) {
        await this.monitorFrame(frame, requestHandler);
      }
    }
  }
  async monitorFrame(frame, requestHandler) {
    const frameUrl = frame.url();
    if (!frameUrl || this.monitoredFrames.has(frameUrl)) {
      return;
    }
    this.monitoredFrames.add(frameUrl);
    if (this.isVideoRelatedFrame(frameUrl)) {
      this.logger.log(`Monitoring video iframe: ${frameUrl}`, "info");
      await this.analyzeFrameContent(frame);
    }
  }
  isVideoRelatedFrame(url) {
    const videoIndicators = [
      "embed",
      "player",
      "/e/",
      "/t/",
      "/v/",
      "javplaya.com",
      "streamhihi.com",
      "maxstream.org",
      "emturbovid.com",
      "streamtape.com",
      "vidhide.com",
      "turbovidhls.com",
      "turboviplay.com"
    ];
    const urlLower = url.toLowerCase();
    return videoIndicators.some(
      (indicator) => urlLower.includes(indicator)
    );
  }
  async analyzeFrameContent(frame) {
    try {
      this.logger.log(`Analyzing iframe content: ${frame.url()}`, "info");
      await frame.waitForLoadState("domcontentloaded", { timeout: 5e3 });
      const videoElements = await frame.evaluate(() => {
        const videos = [];
        document.querySelectorAll("video").forEach((video) => {
          if (video.src && video.src.length > 0 && !video.src.startsWith("blob:")) {
            videos.push({
              type: "video_src",
              url: video.src,
              element: "video"
            });
          }
          if (video.currentSrc && video.currentSrc.length > 0 && !video.currentSrc.startsWith("blob:")) {
            videos.push({
              type: "video_currentSrc",
              url: video.currentSrc,
              element: "video"
            });
          }
        });
        if (typeof window.jwplayer !== "undefined") {
          try {
            const instances = window.jwplayer().getContainer();
            if (instances) {
              const playlist = window.jwplayer().getPlaylist();
              if (playlist && playlist.length > 0) {
                playlist.forEach((item) => {
                  if (item.file) {
                    videos.push({
                      type: "jwplayer_file",
                      url: item.file,
                      element: "jwplayer"
                    });
                  }
                  if (item.sources) {
                    item.sources.forEach((source) => {
                      if (source.file) {
                        videos.push({
                          type: "jwplayer_source",
                          url: source.file,
                          element: "jwplayer"
                        });
                      }
                    });
                  }
                });
              }
            }
          } catch (e) {
            this.logger.log(`JWPlayer check failed: ${e}`, "info");
          }
        }
        document.querySelectorAll("source").forEach((source) => {
          if (source.src && source.src.length > 0) {
            videos.push({
              type: "source_src",
              url: source.src,
              element: "source"
            });
          }
        });
        return videos;
      });
      if (videoElements.length > 0) {
        this.logger.log(
          `Found ${videoElements.length} video elements in iframe`,
          "info"
        );
        for (const element of videoElements) {
          this.logger.log(
            `${element.type} (${element.element}): ${element.url}`,
            "info"
          );
        }
      }
    } catch (error) {
      this.logger.log(`Error analyzing iframe content: ${error}`, "info");
    }
  }
  async waitForIframeContentLoad(page) {
    this.logger.log("Waiting for iframe content to fully load...", "info");
    const frames = page.frames();
    for (const frame of frames) {
      if (frame !== page.mainFrame() && frame.url()) {
        try {
          await frame.waitForLoadState("domcontentloaded", {
            timeout: 5e3
          });
          const hasVideoElements = await frame.evaluate(() => {
            const videoElements = document.querySelectorAll(
              'video, .jwplayer, [id*="player"], [class*="player"]'
            );
            return videoElements.length > 0;
          });
          if (hasVideoElements) {
            this.logger.log(
              `Video player elements found in iframe: ${frame.url()}`,
              "info"
            );
            await page.waitForTimeout(3e3);
          }
        } catch (error) {
          this.logger.log(
            `Could not check iframe content: ${error}`,
            "debug"
          );
        }
      }
    }
  }
  getMonitoredFrames() {
    return Array.from(this.monitoredFrames);
  }
  clearMonitoredFrames() {
    this.monitoredFrames.clear();
  }
};

// src/utils/NetworkMonitor.ts
var NetworkMonitor = class {
  logger;
  capturedHeaders = {};
  videoCandidates = [];
  constructor(logger) {
    this.logger = logger.agent("NetworkMonitor");
  }
  setupComprehensiveMonitoring(page) {
    this.logger.log(
      "Setting up comprehensive network monitoring...",
      "info"
    );
    page.on("request", (request) => {
      const url = request.url().toLowerCase();
      if (this.isImportantRequest(url)) {
        this.logger.log(
          `BROWSER-LIKE REQUEST: ${request.method()} ${request.url()}`,
          "info"
        );
        if (this.isVideoRelatedUrl(url)) {
          this.capturedHeaders = {
            "User-Agent": request.headers()["user-agent"] || "",
            Referer: request.headers()["referer"] || "",
            Origin: request.headers()["origin"] || "https://jav.guru",
            Cookie: request.headers()["cookie"] || "",
            Accept: request.headers()["accept"] || "*/*",
            "Accept-Language": request.headers()["accept-language"] || "en-US,en;q=0.9"
          };
        }
      }
    });
    page.on("response", (response) => {
      const url = response.url().toLowerCase();
      if (response.status() === 200 && this.isImportantRequest(url)) {
        this.logger.log(
          `SUCCESSFUL RESPONSE: ${response.status()} ${response.url()}`,
          "info"
        );
        if (url.includes(".m3u8")) {
          this.logger.log(
            `M3U8 RESPONSE DETECTED: ${response.url()}`,
            "info"
          );
          const candidate = {
            url: response.url(),
            headers: { ...this.capturedHeaders },
            timestamp: Date.now(),
            domain: this.extractDomain(response.url()),
            source: "comprehensive_monitoring",
            status: response.status()
          };
          if (!this.videoCandidates.some(
            (c) => c.url === response.url()
          )) {
            this.videoCandidates.push(candidate);
          }
        }
      }
    });
    this.logger.log(
      "Comprehensive network monitoring setup complete",
      "info"
    );
  }
  isImportantRequest(url) {
    if (url.includes("sacdnssedge") || url.includes("growcdnssedge") || url.includes("tscprts.com") || url.includes("mnaspm.com") || url.includes("tsyndicate.com")) {
      return false;
    }
    return url.includes("jwplayer") || url.includes(".m3u8");
  }
  isVideoRelatedUrl(url) {
    if (url.includes("sacdnssedge") || url.includes("growcdnssedge") || url.includes("tscprts.com") || url.includes("mnaspm.com") || url.includes("tsyndicate.com")) {
      return false;
    }
    return url.includes(".m3u8");
  }
  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  }
  getVideoCandidates() {
    return [...this.videoCandidates];
  }
  getCapturedHeaders() {
    return { ...this.capturedHeaders };
  }
  clearCandidates() {
    this.videoCandidates = [];
  }
};

// src/utils/StreamHandler.ts
var StreamHandler = class {
  logger;
  processor;
  constructor(logger) {
    this.logger = logger.agent("StreamHandler");
    this.processor = new M3U8Processor(logger);
  }
  async processResults(candidates) {
    if (candidates.length === 0) {
      this.logger.log("No video candidates found", "warn");
      return false;
    }
    this.logger.log(`Found ${candidates.length} video candidates:`, "info");
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const age = (Date.now() - candidate.timestamp) / 1e3;
      const source = candidate.source || "network";
      this.logger.log(
        `  ${i + 1}. ${candidate.domain} (age: ${age.toFixed(
          1
        )}s, source: ${source})`,
        "info"
      );
      this.logger.log(`     ${candidate.url}`, "info");
    }
    const scoredCandidates = candidates.map((candidate) => ({
      score: this.calculateCandidateScore(candidate),
      candidate
    }));
    const sortedCandidates = scoredCandidates.sort(
      (a, b) => b.score - a.score
    );
    for (let i = 0; i < sortedCandidates.length; i++) {
      const { score, candidate } = sortedCandidates[i];
      const url = candidate.url;
      this.logger.log(
        `Trying candidate ${i + 1}/${sortedCandidates.length} (score ${score}): ${url}`,
        "info"
      );
      if (score < 0) {
        this.logger.log(
          `SKIPPING AD CANDIDATE ${i + 1} (score ${score}): ${url}`,
          "info"
        );
        continue;
      }
      if (score < 50) {
        this.logger.log(
          `SKIPPING LOW-QUALITY CANDIDATE ${i + 1} (score ${score}): ${url}`,
          "info"
        );
        continue;
      }
      if (this.isNonVideoUrl(url)) {
        this.logger.log(`SKIPPING NON-VIDEO URL: ${url}`, "info");
        continue;
      }
      const isAd = await this.isLikelyAdStream(url, candidate.headers);
      if (isAd) {
        this.logger.log(`SKIPPING DETECTED AD STREAM: ${url}`, "info");
        continue;
      }
      let success = false;
      if (this.isDirectVideoUrl(url)) {
        success = await this.processor.downloadDirectVideo(
          url,
          candidate.headers
        );
      } else {
        success = await this.processor.processM3U8(
          url,
          candidate.headers
        );
      }
      if (success) {
        this.logger.log(
          `SUCCESS! Downloaded video using candidate ${i + 1}`,
          "info"
        );
        return true;
      } else {
        this.logger.log(
          `Candidate ${i + 1} failed (likely contains ads), trying next...`,
          "info"
        );
      }
    }
    this.logger.log(
      "All video candidates failed or contained ads",
      "error"
    );
    return false;
  }
  calculateCandidateScore(candidate) {
    const url = candidate.url;
    const domain = candidate.domain || "";
    const age = (Date.now() - candidate.timestamp) / 1e3;
    let score = 0;
    this.logger.log(`SCORING: ${url} (domain: ${domain})`, "info");
    if (this.isDirectVideoPlayerUrl(url)) {
      score += 5e3;
      this.logger.log(
        `DIRECT VIDEO PLAYER URL BONUS: +5000 points for ${url}`,
        "info"
      );
    }
    const source = candidate.source || "";
    if (source.includes("dom_extraction")) {
      score += 2e3;
      this.logger.log(
        `DOM EXTRACTION BONUS: +2000 points for ${url}`,
        "info"
      );
    } else if (source.includes("player_page_analysis")) {
      score += 1e3;
      this.logger.log(
        `PLAYER PAGE ANALYSIS BONUS: +1000 points for ${url}`,
        "info"
      );
    }
    if (url.toLowerCase().includes(".m3u8")) {
      if (url.includes("/master/") || url.includes("master.m3u8") || /_(240p|360p|480p|720p|1080p)\.m3u8/.test(url)) {
        score += 900;
        this.logger.log(
          `M3U8 MASTER MANIFEST DETECTED - HIGHEST PRIORITY: ${url}`,
          "info"
        );
      } else {
        score += 700;
        this.logger.log(
          `M3U8 STREAM DETECTED - HIGH PRIORITY: ${url}`,
          "info"
        );
      }
    } else if (this.isDirectVideoUrl(url)) {
      if (url.includes("_h264_") && (url.includes("_init_") || /\d+_[a-zA-Z0-9]+_\d+\.mp4$/.test(url))) {
        score += 400;
        this.logger.log(
          `HLS SEGMENT DETECTED - MEDIUM PRIORITY: ${url}`,
          "info"
        );
      } else {
        score += 600;
        this.logger.log(
          `DIRECT VIDEO FILE DETECTED - HIGH PRIORITY: ${url}`,
          "info"
        );
      }
    }
    if (this.isKnownStreamingDomain(domain)) {
      score += 300;
      this.logger.log(
        `KNOWN STREAMING DOMAIN - MEDIUM PRIORITY: ${url}`,
        "info"
      );
    }
    if (this.isAdDomain(domain)) {
      score -= 1e3;
      this.logger.log(
        `AD DOMAIN DETECTED - HEAVILY PENALIZED: ${url}`,
        "warn"
      );
      if (score < 400) {
        score = -999;
        this.logger.log(`AD DOMAIN BLOCKED COMPLETELY: ${url}`, "warn");
      }
    }
    if (age < 10) {
      score += 10;
    }
    if (url.length < 200) {
      score += 20;
    }
    return score;
  }
  isDirectVideoPlayerUrl(url) {
    const patterns = ["/t/", "/e/", "/embed/", "/player/", "/v/"];
    return patterns.some((pattern) => url.includes(pattern)) && !url.endsWith(".m3u8");
  }
  isDirectVideoUrl(url) {
    const extensions = [".mp4", ".mkv", ".avi", ".webm", ".mov"];
    return extensions.some((ext) => url.toLowerCase().includes(ext));
  }
  isKnownStreamingDomain(domain) {
    const domains = [
      "sacdnssedge.com",
      "turbovidhls.com",
      "streamhihi.com",
      "ovaltinecdn",
      "equityvypqjdgkbw",
      "tnmr.org"
    ];
    return domains.some((d) => domain.toLowerCase().includes(d));
  }
  isAdDomain(domain) {
    const adDomains = [
      "emturbovid.com",
      "growcdnssedge.com",
      "sacdnssedge.com"
    ];
    return adDomains.some((d) => domain.toLowerCase().includes(d));
  }
  isNonVideoUrl(url) {
    const nonVideoPatterns = [
      "/cdn-cgi/",
      "/api/",
      "/config",
      ".json",
      ".js",
      ".css",
      "speculation",
      "googletagmanager",
      "analytics",
      "tracking",
      "fonts.gstatic",
      "tiktokcdn"
    ];
    const urlLower = url.toLowerCase();
    return nonVideoPatterns.some((pattern) => urlLower.includes(pattern));
  }
  async isLikelyAdStream(url, headers) {
    try {
      this.logger.log(`VALIDATING STREAM: ${url}`, "info");
      const adIndicators = [
        "googleads",
        "doubleclick",
        "googlesyndication",
        "adsystem",
        "ads.yahoo",
        "amazon-adsystem",
        "adnxs.com",
        "creative.mnaspm.com"
      ];
      const urlLower = url.toLowerCase();
      return adIndicators.some(
        (indicator) => urlLower.includes(indicator)
      );
    } catch (error) {
      this.logger.log(`Error validating stream: ${error}`, "warn");
      return true;
    }
  }
};

// src/helpers/BrowserHelper.ts
var fs2 = __toESM(require("fs"));
var import_BaseHelper = __toESM(require_BaseHelper());
var BrowserHelper = class extends import_BaseHelper.BaseHelper {
  async isBraveAvailable() {
    const bravePaths = [
      "/usr/bin/brave-browser",
      // Linux
      "/usr/bin/brave",
      "/opt/brave.com/brave/brave-browser",
      "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
      // macOS
      "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
      // Windows
      "C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
    ];
    for (const path4 of bravePaths) {
      if (fs2.existsSync(path4)) {
        this.logger.log(`Found Brave browser at: ${path4}`, "info");
        return true;
      }
    }
    try {
      const { execSync: execSync2 } = await import("child_process");
      const result = execSync2("which brave-browser", {
        encoding: "utf8"
      });
      if (result.trim()) {
        this.logger.log(
          `Found Brave browser via which: ${result.trim()}`,
          "info"
        );
        return true;
      }
    } catch {
    }
    this.logger.log("Brave browser not found on system", "warn");
    return false;
  }
  getBravePath() {
    const bravePaths = [
      "/usr/bin/brave-browser",
      // Linux
      "/usr/bin/brave",
      "/opt/brave.com/brave/brave-browser",
      "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
      // macOS
      "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
      // Windows
      "C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
    ];
    for (const path4 of bravePaths) {
      if (fs2.existsSync(path4)) {
        return path4;
      }
    }
    return null;
  }
  async selectBestBrowser(preferredType) {
    if (preferredType === "firefox") {
      return "firefox";
    } else if (preferredType === "brave" && await this.isBraveAvailable()) {
      return "brave";
    } else if (preferredType === "brave") {
      this.logger.log(
        "Brave browser not found, falling back to Firefox",
        "warn"
      );
      return "firefox";
    }
    return preferredType === "chromium" ? "chromium" : "firefox";
  }
  generateUserAgent(browserType) {
    switch (browserType) {
      case "firefox":
        return "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0";
      case "brave":
        return "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/1.60";
      case "chromium":
      default:
        return "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    }
  }
  getBrowserLaunchArgs(browserType) {
    if (browserType === "firefox") {
      return [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        // Firefox-specific args
        "--enable-logging",
        "--new-instance",
        "--no-remote",
        "--safe-mode=false"
      ];
    }
    const commonArgs = [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
      "--allow-running-insecure-content",
      "--disable-features=VizDisplayCompositor",
      "--block-new-web-contents",
      "--disable-popup-blocking=false",
      "--disable-background-networking",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
      "--enable-logging",
      "--log-level=0",
      "--enable-network-service-logging"
    ];
    if (browserType === "brave") {
      return [
        ...commonArgs,
        // Brave-specific privacy and ad-blocking enhancements
        "--enable-aggressive-domstorage-flushing",
        "--disable-client-side-phishing-detection",
        "--disable-component-extensions-with-background-pages",
        "--disable-default-apps",
        "--disable-extensions-http-throttling",
        "--disable-ipc-flooding-protection"
      ];
    }
    return commonArgs;
  }
};

// src/helpers/PageHelper.ts
var import_BaseHelper2 = __toESM(require_BaseHelper());
var PageHelper = class extends import_BaseHelper2.BaseHelper {
  async waitForJWPlayerInitialization(page) {
    this.logger.log("\u23F3 Waiting for JWPlayer initialization...", "info");
    try {
      await page.waitForSelector('script[src*="jwplayer"]', {
        timeout: 1e4
      });
      this.logger.log("JWPlayer script detected", "debug");
    } catch {
      this.logger.log(
        "JWPlayer script not found, continuing anyway...",
        "warn"
      );
    }
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3e3);
    try {
      const jwplayerReady = await page.evaluate(() => {
        return typeof window.jwplayer !== "undefined" && typeof window.jwplayer.key !== "undefined";
      });
      if (jwplayerReady) {
        this.logger.log("JWPlayer is initialized and ready", "debug");
      } else {
        this.logger.log(
          "JWPlayer may not be fully initialized",
          "debug"
        );
      }
    } catch (error) {
      this.logger.log(
        `Could not check JWPlayer status: ${error}`,
        "debug"
      );
    }
    await page.waitForTimeout(2e3);
  }
  async extractVideoUrlsFromDOM(page) {
    try {
      this.logger.log("Scanning DOM for video URLs...", "debug");
      const allFrames = [
        page.mainFrame(),
        ...page.frames().filter((f) => f !== page.mainFrame())
      ];
      const allVideoElements = [];
      for (let frameIndex = 0; frameIndex < allFrames.length; frameIndex++) {
        const frame = allFrames[frameIndex];
        const frameName = frameIndex === 0 ? "main" : `iframe-${frameIndex}`;
        try {
          this.logger.log(
            `Checking ${frameName} frame for video elements...`,
            "info"
          );
          const videoElements = await frame.evaluate(() => {
            const videos = [];
            document.querySelectorAll("video").forEach((video) => {
              const videoEl = video;
              if (videoEl.src && videoEl.src.length > 0 && !videoEl.src.startsWith("blob:")) {
                videos.push({
                  type: "video_src",
                  url: videoEl.src,
                  element: "video"
                });
              }
              if (videoEl.currentSrc && videoEl.currentSrc.length > 0 && !videoEl.currentSrc.startsWith("blob:")) {
                videos.push({
                  type: "video_currentSrc",
                  url: videoEl.currentSrc,
                  element: "video"
                });
              }
            });
            if (typeof window.jwplayer !== "undefined") {
              try {
                const instances = window.jwplayer().getContainer();
                if (instances) {
                  const playlist = window.jwplayer().getPlaylist();
                  if (playlist && playlist.length > 0) {
                    playlist.forEach((item) => {
                      if (item.file) {
                        videos.push({
                          type: "jwplayer_file",
                          url: item.file,
                          element: "jwplayer"
                        });
                      }
                      if (item.sources) {
                        item.sources.forEach(
                          (source) => {
                            if (source.file) {
                              videos.push({
                                type: "jwplayer_source",
                                url: source.file,
                                element: "jwplayer"
                              });
                            }
                          }
                        );
                      }
                    });
                  }
                }
              } catch (e) {
                this.logger.log(
                  `JWPlayer check failed: ${e}`,
                  "debug"
                );
              }
            }
            document.querySelectorAll("source").forEach((source) => {
              const sourceEl = source;
              if (sourceEl.src && sourceEl.src.length > 0) {
                videos.push({
                  type: "source_src",
                  url: sourceEl.src,
                  element: "source"
                });
              }
            });
            return videos;
          });
          if (videoElements && videoElements.length > 0) {
            this.logger.log(
              `\u{1F3AC} FOUND ${videoElements.length} VIDEO URLs IN ${frameName.toUpperCase()}:`,
              "info"
            );
            for (const videoInfo of videoElements) {
              this.logger.log(
                `  ${videoInfo.type} (${videoInfo.element}): ${videoInfo.url}`,
                "info"
              );
              allVideoElements.push({
                ...videoInfo,
                frame: frameName,
                frameUrl: frame.url()
              });
            }
          }
        } catch (error) {
          this.logger.log(
            `Error checking frame ${frameIndex}: ${error}`,
            "debug"
          );
        }
      }
      if (allVideoElements.length === 0) {
        this.logger.log("No video URLs found in DOM", "debug");
      }
      return allVideoElements;
    } catch (error) {
      this.logger.log(
        `Error extracting video URLs from DOM: ${error}`,
        "warn"
      );
      return [];
    }
  }
  async takeScreenshot(page, filename) {
    try {
      const screenshotPath = filename || `screenshot_${this.generateTimestamp()}.png`;
      await page.screenshot({ path: screenshotPath });
      this.logger.log(`Screenshot saved: ${screenshotPath}`, "info");
      return screenshotPath;
    } catch (error) {
      this.logger.log(`Could not take screenshot: ${error}`, "warn");
      return null;
    }
  }
  async scrollToElement(page, selector) {
    try {
      const element = page.locator(selector);
      await element.scrollIntoViewIfNeeded();
      return true;
    } catch (error) {
      this.logger.log(
        `Could not scroll to element ${selector}: ${error}`,
        "debug"
      );
      return false;
    }
  }
  async waitForElement(page, selector, timeout = 5e3) {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }
  async isElementVisible(page, selector) {
    try {
      const element = page.locator(selector);
      return await element.isVisible();
    } catch {
      return false;
    }
  }
  async getElementText(page, selector) {
    try {
      const element = page.locator(selector);
      return await element.textContent();
    } catch {
      return null;
    }
  }
  async clickElement(page, selector, timeout = 3e3) {
    try {
      const element = page.locator(selector);
      await element.click({ timeout });
      return true;
    } catch (error) {
      this.logger.log(
        `Could not click element ${selector}: ${error}`,
        "debug"
      );
      return false;
    }
  }
};

// src/VideoDownloader.ts
var VideoDownloader = class {
  config;
  browser = null;
  page = null;
  // Core components
  routeHandler;
  requestHandler;
  streamButtonHandler;
  popupHandler;
  playButtonHandler;
  m3u8Processor;
  titleScraper;
  iframeMonitor;
  networkMonitor;
  streamHandler;
  // Helpers
  browserHelper;
  pageHelper;
  // State
  videoCandidates = [];
  allVideoRequests = [];
  capturedHeaders = {};
  directUrlFound = false;
  titleInfo = null;
  completeLog;
  logAgent;
  constructor(config) {
    console.log("RRR", config);
    this.config = config;
    this.routeHandler = new RouteHandler(config.completeLog);
    this.requestHandler = new RequestHandler(config.completeLog);
    this.streamButtonHandler = new StreamButtonHandler(config.completeLog);
    this.popupHandler = new PopupHandler(config.completeLog);
    this.playButtonHandler = new PlayButtonHandler(config.completeLog);
    this.m3u8Processor = new M3U8Processor(
      config.completeLog,
      config.downloadConfig
    );
    this.iframeMonitor = new IFrameMonitor(config.completeLog);
    this.networkMonitor = new NetworkMonitor(config.completeLog);
    this.streamHandler = new StreamHandler(config.completeLog);
    this.browserHelper = new BrowserHelper(config.completeLog);
    this.pageHelper = new PageHelper(config.completeLog);
    this.completeLog = config.completeLog;
    this.logAgent = this.completeLog.agent("VideoDownloader");
    this.titleScraper = new TitleScraper(this.completeLog.agent("TitleScraper"));
  }
  log(text, type) {
    this.logAgent.log(text, type);
  }
  async main() {
    const browserType = await this.browserHelper.selectBestBrowser(
      this.config.browserType
    );
    this.log(
      `Starting downloader with ${browserType.toUpperCase()}`,
      "info"
    );
    try {
      await this.initializeBrowser(browserType);
      if (!this.page) {
        throw new Error("Failed to initialize page");
      }
      await this.setupComprehensiveMonitoring();
      await this.page.route(
        "**/*",
        (route, request) => this.routeHandler.handleRoute(route, request)
      );
      await this.iframeMonitor.setupMonitoring(
        this.page,
        this.requestHandler
      );
      this.log("Waiting for page to fully load...", "debug");
      await this.pageHelper.waitForJWPlayerInitialization(this.page);
      this.log("Extracting title information...", "debug");
      this.titleInfo = await this.titleScraper.extractTitleInfo(this.page);
      if (this.titleInfo) {
        this.log("Title information extracted successfully", "info");
        this.log(`Title: ${this.titleInfo.title}`, "debug");
        if (this.titleInfo.code) this.log(`Code: ${this.titleInfo.code}`, "debug");
      } else {
        this.log("Could not extract title information", "warn");
      }
      this.log("Handling popups and modals...", "debug");
      await this.popupHandler.closePopups(this.page);
      await this.popupHandler.waitAndClosePopups(this.page, 3e3);
      this.log("Starting stream button handling...", "debug");
      const success = await this.tryStreamButtonsWithMonitoring();
      if (success) {
        this.log("Download completed successfully", "info");
        this.playButtonHandler.markDownloadCompleted();
        return true;
      } else {
        this.log("No video streams found", "warn");
        await this.pageHelper.takeScreenshot(
          this.page,
          "no_streams_found.png"
        );
        return false;
      }
    } catch (error) {
      this.log(`Error during execution: ${error}`, "error");
      if (this.page) {
        await this.pageHelper.takeScreenshot(this.page, "error.png");
      }
      return false;
    } finally {
      await this.cleanup();
    }
  }
  async initializeBrowser(browserType) {
    if (browserType === "firefox") {
      this.browser = new import_FirefoxBrowser.FirefoxBrowser(this.config.completeLog);
    } else if (browserType === "brave") {
      this.browser = new import_BraveBrowser.BraveBrowser(this.config.completeLog);
    } else {
      this.browser = new import_ChromiumBrowser.ChromiumBrowser(this.config.completeLog);
    }
    await this.browser.launch(this.config.browserConfig);
    this.page = await this.browser.getPage(this.config.url);
  }
  async setupComprehensiveMonitoring() {
    if (!this.page) return;
    this.log("Setting up comprehensive monitoring...", "debug");
    this.networkMonitor.setupComprehensiveMonitoring(this.page);
    this.page.on("request", async (request) => {
      await this.requestHandler.handleRequest(request);
    });
    this.page.on("response", async (response) => {
      await this.requestHandler.handleResponse(response);
    });
  }
  async tryStreamButtonsWithMonitoring() {
    if (!this.page) return false;
    this.log("Trying stream buttons with monitoring...", "debug");
    const availableButtons = await this.streamButtonHandler.findAvailableStreamButtons(
      this.page
    );
    if (availableButtons.length === 0) {
      this.log("No stream buttons found on page", "warn");
      return false;
    }
    this.log(`Found ${availableButtons.length} stream buttons`, "info");
    for (const selector of availableButtons) {
      try {
        this.log(`Trying stream button: ${selector}`, "debug");
        this.videoCandidates = [];
        const buttonClicked = await this.streamButtonHandler.clickSpecificStreamButton(
          this.page,
          selector
        );
        if (!buttonClicked) {
          this.log(
            `Failed to click button with selector: ${selector}`,
            "warn"
          );
          continue;
        }
        this.log("Waiting for iframe to load...", "debug");
        await this.page.waitForTimeout(3e3);
        await this.popupHandler.closePopups(this.page);
        if (await this.isAdRedirect()) {
          this.log(
            "Ad redirect detected - attempting to click through ad...",
            "debug"
          );
          let adClickedThrough = false;
          for (let attempt = 1; attempt <= 3; attempt++) {
            this.log(
              `Ad click-through attempt ${attempt}/3`,
              "info"
            );
            adClickedThrough = await this.clickThroughAd();
            if (adClickedThrough) {
              this.log(
                "Clicked through ad, waiting for video iframe...",
                "info"
              );
              await this.popupHandler.closePopups(this.page);
              await this.page.waitForTimeout(5e3);
              const videoIframeNow = await this.checkForVideoIframe();
              if (videoIframeNow) {
                this.log(
                  "Video iframe found after ad click-through!",
                  "info"
                );
                break;
              } else {
                this.log(
                  `No video iframe after attempt ${attempt}, trying again...`,
                  "warn"
                );
                adClickedThrough = false;
              }
            } else {
              this.log(
                `Ad click-through attempt ${attempt} failed`,
                "warn"
              );
              await this.page.waitForTimeout(2e3);
            }
          }
          if (!adClickedThrough) {
            this.log(
              "Could not click through ad after 3 attempts",
              "warn"
            );
          }
        }
        const existingVideoIframes = this.page.frames().filter((frame) => {
          const url = frame.url();
          return (url.includes("turbovidhls.com") || url.includes("turboviplay.com") || url.includes("jwplayer") || url.includes("/player/") || url.includes("/video/") || url.includes("streamtape") || url.includes("mixdrop") || url.includes("doodstream") || url.includes("upstream")) && !url.includes("searcho") && !url.includes("/ads/");
        });
        let videoIframeFound = existingVideoIframes.length > 0;
        if (videoIframeFound) {
          this.log(
            `Video iframe already present: ${existingVideoIframes[0].url()}`,
            "info"
          );
        } else {
          this.log(
            "Waiting for video iframe to appear (may take 30 seconds after ad click-through)...",
            "info"
          );
          videoIframeFound = await this.waitForVideoIframe(3e4);
          if (!videoIframeFound) {
            this.log(
              "No video iframe found after 30 seconds",
              "warn"
            );
            const networkCandidates2 = this.networkMonitor.getVideoCandidates();
            const requestCandidates2 = this.requestHandler.getVideoCandidates();
            const allCandidates = [
              ...networkCandidates2,
              ...requestCandidates2
            ];
            if (allCandidates.length > 0) {
              this.log(
                `Found ${allCandidates.length} M3U8 candidates from network monitoring - processing them`,
                "info"
              );
              for (const candidate of allCandidates) {
                if (!this.videoCandidates.some(
                  (c) => c.url === candidate.url
                )) {
                  this.videoCandidates.push(candidate);
                }
              }
              const downloadSuccess = await this.processResults();
              if (downloadSuccess) {
                this.log(
                  `SUCCESS! Downloaded video using M3U8 candidates from button: ${selector}`,
                  "info"
                );
                this.playButtonHandler.markDownloadCompleted();
                return true;
              }
            }
            this.log(
              "No video iframe and no M3U8 candidates - trying next stream button",
              "warn"
            );
            continue;
          }
        }
        this.log(
          "Looking for play buttons in video iframes...",
          "info"
        );
        let playButtonClicked = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
          this.log(`Play button attempt ${attempt}/3...`, "info");
          playButtonClicked = await this.tryClickPlayButtonInIframes();
          if (playButtonClicked) {
            this.log(
              "Play button clicked - monitoring for streams...",
              "info"
            );
            break;
          } else {
            this.log(
              `Play button attempt ${attempt} failed, waiting 2s...`,
              "warn"
            );
            await this.page.waitForTimeout(2e3);
          }
        }
        if (!playButtonClicked) {
          this.log(
            "No play button found after 3 attempts - still monitoring...",
            "warn"
          );
        }
        const networkCandidates = this.networkMonitor.getVideoCandidates();
        const requestCandidates = this.requestHandler.getVideoCandidates();
        const initialCandidates = [
          ...networkCandidates,
          ...requestCandidates
        ];
        if (initialCandidates.length > 0) {
          this.log(
            `Found ${initialCandidates.length} video candidates from initial page load - processing immediately`,
            "info"
          );
          for (const candidate of initialCandidates) {
            if (!this.videoCandidates.some(
              (c) => c.url === candidate.url
            )) {
              this.videoCandidates.push(candidate);
            }
          }
          const sortedCandidates = initialCandidates.sort((a, b) => {
            const aHasQuality = a.url.includes("720") || a.url.includes("1080");
            const bHasQuality = b.url.includes("720") || b.url.includes("1080");
            if (aHasQuality && !bHasQuality) return -1;
            if (!aHasQuality && bHasQuality) return 1;
            return 0;
          });
          for (const candidate of sortedCandidates) {
            this.log(
              `IMMEDIATE PROCESSING: ${candidate.url}`,
              "info"
            );
            let success = false;
            if (candidate.url.includes(".m3u8")) {
              success = await this.processM3U8Directly(
                candidate.url,
                candidate.headers
              );
            } else if (candidate.url.endsWith(".mp4") || candidate.url.endsWith(".mkv")) {
              success = await this.downloadDirectVideo(
                candidate.url,
                candidate.headers
              );
            }
            if (success) {
              this.log(
                `SUCCESS! Downloaded video immediately using: ${candidate.url}`,
                "info"
              );
              this.playButtonHandler.markDownloadCompleted();
              return true;
            } else {
              this.log(
                `Immediate processing failed for: ${candidate.url}`,
                "warn"
              );
            }
          }
          this.log(
            "Immediate processing failed for all candidates, falling back to monitoring...",
            "warn"
          );
        }
        const result = await this.monitorForVideoStreams(selector, 60);
        if (result.success) {
          if (this.directUrlFound) {
            this.log(
              `SUCCESS! Direct video URL found with button: ${selector}`,
              "info"
            );
            return true;
          }
          if (result.processed) {
            this.log(
              `SUCCESS! Downloaded video using button: ${selector} (processed during monitoring)`,
              "info"
            );
            this.playButtonHandler.markDownloadCompleted();
            return true;
          }
          this.log(
            `Found video streams with button: ${selector}`,
            "info"
          );
          const downloadSuccess = await this.processResults();
          if (downloadSuccess) {
            this.log(
              `SUCCESS! Downloaded video using button: ${selector}`,
              "info"
            );
            this.playButtonHandler.markDownloadCompleted();
            return true;
          } else {
            this.log(
              `Button ${selector} found streams but all contained ads - trying next button`,
              "warn"
            );
            continue;
          }
        } else {
          this.log(
            `Button ${selector} did not find any video streams - trying next button`,
            "warn"
          );
          continue;
        }
      } catch (error) {
        this.log(
          `Error with button ${selector}: ${error} - trying next button`,
          "warn"
        );
        continue;
      }
    }
    this.log(
      `All ${availableButtons.length} stream buttons failed - no video found`,
      "error"
    );
    return false;
  }
  async tryClickPlayButtonInIframes() {
    if (!this.page) return false;
    const frames = this.page.frames();
    let playButtonClicked = false;
    for (const frame of frames) {
      if (frame === this.page.mainFrame()) continue;
      try {
        const frameUrl = frame.url();
        if (!frameUrl || frameUrl === "about:blank" || frameUrl.includes("searcho"))
          continue;
        this.log(
          `Checking iframe for play button: ${frameUrl}`,
          "info"
        );
        await this.page.waitForTimeout(1e3);
        const playButtonSelectors = [
          // Exact match from screenshot - highest priority
          'div.playbutton[onclick="start_player()"]',
          "div.playbutton",
          ".playbutton",
          '[onclick="start_player()"]',
          '[onclick*="start_player"]',
          'div[onclick*="start_player"]',
          // Common video player patterns
          ".jw-display-icon-container",
          ".jw-icon-play",
          ".jwplayer .jw-display-icon-container",
          ".vjs-big-play-button",
          ".video-js .vjs-big-play-button",
          // Generic play buttons
          'button[data-action="play"]',
          ".video-play-button",
          ".play-btn",
          ".play-button",
          "button.play",
          'button[aria-label*="play" i]',
          'button[title*="play" i]',
          '[role="button"][aria-label*="play" i]',
          'div[class*="play" i][role="button"]',
          'button[class*="play" i]',
          ".video-overlay-play-button",
          ".plyr__control--overlaid",
          // More generic selectors
          'div[style*="cursor: pointer"][class*="play"]',
          'span[class*="play"]',
          ".fa-play",
          ".icon-play",
          '[data-toggle="play"]',
          // Last resort - any clickable element in video context
          "video + *[onclick]",
          ".video-container [onclick]",
          ".player-container [onclick]"
        ];
        for (const selector of playButtonSelectors) {
          try {
            const buttons = frame.locator(selector);
            const count = await buttons.count();
            for (let i = 0; i < count; i++) {
              try {
                const button = buttons.nth(i);
                const isVisible = await button.isVisible({
                  timeout: 1e3
                });
                if (isVisible) {
                  this.log(
                    `Found play button: ${selector} in ${frameUrl}`,
                    "info"
                  );
                  try {
                    this.log(
                      `Attempting to click play button with ${selector}`,
                      "info"
                    );
                    await button.evaluate((el) => {
                      try {
                        if (typeof window.start_player === "function") {
                          window.start_player();
                          console.log(
                            "start_player() function executed"
                          );
                          return true;
                        }
                      } catch (e) {
                        console.log(
                          "start_player() not available:",
                          e
                        );
                      }
                      return false;
                    });
                    await frame.waitForTimeout(500);
                    await button.evaluate((el) => {
                      if (el && "click" in el) {
                        el.click();
                        console.log(
                          "Direct JS click executed"
                        );
                      }
                    });
                    await frame.waitForTimeout(500);
                    await button.evaluate((el) => {
                      if (el && el.onclick) {
                        try {
                          const event = new PointerEvent(
                            "click",
                            { bubbles: true }
                          );
                          el.onclick(event);
                          console.log(
                            "onclick handler executed"
                          );
                        } catch (e) {
                          console.log(
                            "onclick failed:",
                            e
                          );
                        }
                      }
                    });
                    await frame.waitForTimeout(500);
                    try {
                      await button.click({
                        force: true,
                        timeout: 3e3
                      });
                      console.log("Force click executed");
                    } catch (forceError) {
                    }
                    await button.evaluate((el) => {
                      const events = [
                        "mousedown",
                        "mouseup",
                        "click",
                        "touchstart",
                        "touchend"
                      ];
                      events.forEach((eventType) => {
                        try {
                          let event;
                          if (eventType.startsWith(
                            "touch"
                          )) {
                            event = new TouchEvent(
                              eventType,
                              {
                                bubbles: true,
                                cancelable: true
                              }
                            );
                          } else {
                            event = new MouseEvent(
                              eventType,
                              {
                                bubbles: true,
                                cancelable: true
                              }
                            );
                          }
                          el.dispatchEvent(event);
                        } catch (e) {
                          console.log(
                            `Event ${eventType} failed:`,
                            e
                          );
                        }
                      });
                      console.log(
                        "All mouse/touch events dispatched"
                      );
                    });
                    this.log(
                      `Play button click attempts completed for ${selector}`,
                      "info"
                    );
                    playButtonClicked = true;
                    await this.page.waitForTimeout(2e3);
                    try {
                      const hasPlayingVideo = await frame.locator(
                        "video[autoplay], video:not([paused]), .jwplayer.jw-state-playing"
                      ).count();
                      if (hasPlayingVideo > 0) {
                        this.log(
                          `Video playback detected!`,
                          "info"
                        );
                        return true;
                      }
                    } catch (videoCheckError) {
                    }
                  } catch (clickError) {
                    this.log(
                      `All click strategies failed for ${selector}: ${clickError}`,
                      "warn"
                    );
                    continue;
                  }
                }
              } catch (elementError) {
                continue;
              }
            }
          } catch (selectorError) {
            continue;
          }
        }
      } catch (frameError) {
        this.log(
          `Error checking iframe ${frame.url()}: ${frameError}`,
          "warn"
        );
        continue;
      }
    }
    if (playButtonClicked) {
      this.log(`Play button interaction completed`, "info");
      return true;
    }
    this.log(`No play buttons found or clicked successfully`, "warn");
    return false;
  }
  async isAdRedirect() {
    if (!this.page) return false;
    const frames = this.page.frames();
    for (const frame of frames) {
      const url = frame.url();
      if (url.includes("searcho") || url.includes("/ads/") || url.includes("redirect") || url.includes("popup") || url.includes("promo")) {
        this.log(`Ad detected: ${url}`, "info");
        return true;
      }
    }
    return false;
  }
  async checkForVideoIframe() {
    if (!this.page) return false;
    const frames = this.page.frames();
    for (const frame of frames) {
      const url = frame.url();
      if ((url.includes("turbovidhls.com") || url.includes("turboviplay.com") || url.includes("jwplayer") || url.includes("/player/") || url.includes("/video/") || url.includes("streamtape") || url.includes("mixdrop") || url.includes("doodstream") || url.includes("upstream")) && !url.includes("searcho") && !url.includes("/ads/")) {
        this.log(`\u{1F3AC} Video iframe detected: ${url}`, "info");
        return true;
      }
    }
    return false;
  }
  async clickThroughAd() {
    if (!this.page) return false;
    const frames = this.page.frames();
    for (const frame of frames) {
      const url = frame.url();
      if (url.includes("searcho") || url.includes("/ads/") || url.includes("redirect")) {
        this.log(
          `Attempting to click through ad iframe: ${url}`,
          "info"
        );
        try {
          await this.page.waitForTimeout(1e3);
          const clickSelectors = [
            // Look for specific turbo/video links first
            'a[href*="turbo"]',
            'a[href*="video"]',
            'a[href*="play"]',
            'a[href*="stream"]',
            // Look for skip/continue buttons
            ".skip-ad",
            ".skip-button",
            '[data-action="skip"]',
            ".continue",
            ".proceed",
            // General clickable elements
            "button:not([disabled])",
            'a[href]:not([href="#"])',
            "[onclick]",
            ".btn:not(.disabled)",
            ".button:not(.disabled)",
            '[role="button"]',
            // Last resort - any clickable element
            "*[onclick]",
            'div[style*="cursor: pointer"]'
          ];
          let clickedSuccessfully = false;
          for (const selector of clickSelectors) {
            try {
              const elements = frame.locator(selector);
              const count = await elements.count();
              if (count > 0) {
                for (let i = 0; i < Math.min(count, 3); i++) {
                  try {
                    const element = elements.nth(i);
                    const isVisible = await element.isVisible({
                      timeout: 1e3
                    });
                    if (isVisible) {
                      this.log(
                        `Clicking ${selector} in ad iframe`,
                        "info"
                      );
                      try {
                        await element.click({
                          force: true,
                          timeout: 3e3
                        });
                        this.log(
                          `Regular click succeeded on ${selector}`,
                          "info"
                        );
                      } catch {
                        try {
                          await element.evaluate(
                            (el) => {
                              if (el && "click" in el) {
                                el.click();
                              }
                            }
                          );
                          this.log(
                            `JavaScript click succeeded on ${selector}`,
                            "info"
                          );
                        } catch {
                          await element.evaluate(
                            (el) => {
                              const event = new MouseEvent(
                                "click",
                                {
                                  bubbles: true,
                                  cancelable: true
                                }
                              );
                              el.dispatchEvent(
                                event
                              );
                            }
                          );
                          this.log(
                            `Event dispatch succeeded on ${selector}`,
                            "info"
                          );
                        }
                      }
                      await this.page.waitForTimeout(
                        2e3
                      );
                      clickedSuccessfully = true;
                      break;
                    }
                  } catch (elementError) {
                    continue;
                  }
                }
                if (clickedSuccessfully) break;
              }
            } catch (selectorError) {
              continue;
            }
          }
          if (!clickedSuccessfully) {
            this.log(
              `No specific elements found, trying to click iframe areas directly`,
              "info"
            );
            try {
              const iframeSelector = `iframe[src*="${new URL(url).hostname}"]`;
              const iframeElement = this.page.locator(iframeSelector).first();
              if (await iframeElement.isVisible()) {
                const box = await iframeElement.boundingBox();
                if (box) {
                  const clickPositions = [
                    { x: box.width / 2, y: box.height / 2 },
                    // Center (where play button usually is)
                    {
                      x: box.width * 0.3,
                      y: box.height * 0.3
                    },
                    // Upper left area
                    {
                      x: box.width * 0.7,
                      y: box.height * 0.3
                    },
                    // Upper right area
                    {
                      x: box.width * 0.5,
                      y: box.height * 0.7
                    }
                    // Lower center
                  ];
                  for (const position of clickPositions) {
                    try {
                      this.log(
                        `Clicking iframe at position (${Math.round(
                          position.x
                        )}, ${Math.round(position.y)})`,
                        "info"
                      );
                      await iframeElement.click({
                        position,
                        force: true,
                        timeout: 2e3
                      });
                      await this.page.waitForTimeout(
                        2e3
                      );
                      clickedSuccessfully = true;
                      this.log(
                        `Iframe position click succeeded`,
                        "info"
                      );
                      break;
                    } catch (positionClickError) {
                      this.log(
                        `Position click failed: ${positionClickError}`,
                        "warn"
                      );
                      continue;
                    }
                  }
                } else {
                  await iframeElement.click({
                    position: { x: 200, y: 150 },
                    force: true,
                    timeout: 3e3
                  });
                  clickedSuccessfully = true;
                  this.log(
                    `Fallback iframe click succeeded`,
                    "info"
                  );
                }
                if (clickedSuccessfully) {
                  await this.page.waitForTimeout(3e3);
                }
              }
            } catch (iframeClickError) {
              this.log(
                `Iframe area click failed: ${iframeClickError}`,
                "warn"
              );
            }
          }
          if (clickedSuccessfully) {
            this.log(
              `Ad click-through completed, checking for video iframe...`,
              "info"
            );
            return true;
          }
        } catch (error) {
          this.log(`Failed to click through ad: ${error}`, "warn");
        }
      }
    }
    this.log(`Could not click through ad`, "warn");
    return false;
  }
  async waitForVideoIframe(timeoutMs = 1e4) {
    if (!this.page) return false;
    const startTime = Date.now();
    const endTime = startTime + timeoutMs;
    while (Date.now() < endTime) {
      const frames = this.page.frames();
      for (const frame of frames) {
        const url = frame.url();
        if ((url.includes("turbovidhls.com") || url.includes("turboviplay.com") || url.includes("jwplayer") || url.includes("/player/") || url.includes("/video/") || url.includes("streamtape") || url.includes("mixdrop") || url.includes("doodstream") || url.includes("upstream")) && !url.includes("searcho") && // Exclude ad domains
        !url.includes("/ads/")) {
          this.log(`\u{1F3AC} Video iframe found: ${url}`, "info");
          await this.page.waitForTimeout(2e3);
          try {
            const hasVideoElements = await frame.locator(
              'video, .video-player, .jwplayer, [class*="player"]'
            ).count();
            if (hasVideoElements > 0) {
              this.log(
                `Video elements detected in iframe`,
                "info"
              );
              return true;
            }
          } catch (error) {
          }
          return true;
        }
      }
      const elapsed = Date.now() - startTime;
      if (elapsed % 3e3 === 0) {
        this.log(
          `Still waiting for video iframe... ${elapsed / 1e3}s elapsed`,
          "info"
        );
        const currentFrames = this.page.frames();
        for (const frame of currentFrames) {
          const url = frame.url();
          if (url && url !== "about:blank" && !url.includes("searcho")) {
            this.log(`Current iframe: ${url}`, "info");
          }
        }
      }
      await this.page.waitForTimeout(1e3);
    }
    this.log(
      `Video iframe not found after ${timeoutMs / 1e3} seconds`,
      "warn"
    );
    return false;
  }
  async clickButtonWithHumanBehavior(button, buttonText) {
    await this.page.waitForTimeout(2e3);
    await button.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    try {
      await button.hover({ timeout: 3e3 });
      await this.page.waitForTimeout(800);
    } catch {
    }
    this.log(
      `Clicking button: ${buttonText} with human-like behavior`,
      "info"
    );
    await button.click({ timeout: 1e4 });
    await this.page.waitForTimeout(1500);
  }
  async monitorForVideoStreams(buttonName, timeout = 180) {
    this.log(
      `Monitoring for video streams after clicking ${buttonName}...`,
      "info"
    );
    const startTime = Date.now();
    let framesBeforeCount = this.page.frames().length;
    let playButtonClicked = false;
    let downloadStarted = false;
    const downloadPromise = this.setupDownloadMonitoring();
    while (Date.now() - startTime < timeout * 1e3) {
      if (!this.playButtonHandler.shouldContinueNavigation()) {
        this.log(
          "Play button handler suggests stopping navigation",
          "info"
        );
        break;
      }
      if (downloadStarted) {
        this.log(
          "Download detected, waiting for completion...",
          "info"
        );
        const downloadSuccess = await downloadPromise;
        if (downloadSuccess) {
          this.log("Download completed successfully!", "info");
          return { success: true, processed: true };
        }
      }
      if (!playButtonClicked && this.videoCandidates.length === 0 && !this.directUrlFound) {
        const elapsed2 = (Date.now() - startTime) / 1e3;
        if (elapsed2 > 5) {
          this.log(
            "Trying play buttons during monitoring...",
            "info"
          );
          const playSuccess = await this.tryClickPlayButtonInIframes();
          if (playSuccess) {
            this.log("Play button clicked successfully", "info");
            playButtonClicked = true;
            await this.page.waitForTimeout(3e3);
          } else {
            await this.playButtonHandler.handlePlayButtons(
              this.page,
              1
            );
            playButtonClicked = true;
          }
        }
      }
      if (this.directUrlFound) {
        this.log(
          "DIRECT URL FOUND - STOPPING ALL M3U8 PROCESSING!",
          "info"
        );
        return { success: true, processed: false };
      }
      await this.page.waitForTimeout(2e3);
      const framesAfterCount = this.page.frames().length;
      if (framesAfterCount > framesBeforeCount) {
        this.log(
          `New iframe(s) detected: ${framesAfterCount - framesBeforeCount}`,
          "info"
        );
        await this.iframeMonitor.setupMonitoring(
          this.page,
          this.requestHandler
        );
        await this.iframeMonitor.waitForIframeContentLoad(this.page);
        framesBeforeCount = framesAfterCount;
        if (playButtonClicked) {
          this.log(
            "\u{1F3AE} Trying play buttons in new iframes...",
            "info"
          );
          await this.tryClickPlayButtonInIframes();
        }
      }
      const elapsed = (Date.now() - startTime) / 1e3;
      if (elapsed > 3) {
        const domVideos = await this.pageHelper.extractVideoUrlsFromDOM(
          this.page
        );
        if (domVideos.length > 0) {
          this.log(
            "FOUND VIDEO URL IN DOM - Processing immediately!",
            "info"
          );
          for (const video of domVideos) {
            const candidate = {
              url: video.url,
              headers: this.capturedHeaders,
              timestamp: Date.now(),
              domain: this.extractDomain(video.url),
              source: `dom_extraction_${video.frame}`,
              type: video.type
            };
            if (!this.videoCandidates.some(
              (c) => c.url === video.url
            )) {
              this.videoCandidates.push(candidate);
            }
          }
          for (const video of domVideos) {
            if (video.type === "direct" && (video.url.endsWith(".mp4") || video.url.endsWith(".mkv") || video.url.endsWith(".avi"))) {
              this.log(
                "Attempting direct download of: ${video.url}",
                "info"
              );
              const directSuccess = await this.downloadDirectVideo(video.url);
              if (directSuccess) {
                return { success: true, processed: true };
              }
            } else if (video.type === "m3u8" || video.url.includes(".m3u8")) {
              this.log(
                "Attempting M3U8 processing of: ${video.url}",
                "info"
              );
              const m3u8Success = await this.processM3U8Directly(
                video.url
              );
              if (m3u8Success) {
                return { success: true, processed: true };
              }
            }
          }
          return { success: true, processed: false };
        }
      }
      const networkCandidates = this.networkMonitor.getVideoCandidates();
      const requestCandidates = this.requestHandler.getVideoCandidates();
      this.videoCandidates = [
        ...this.videoCandidates,
        ...networkCandidates.filter(
          (nc) => !this.videoCandidates.some((vc) => vc.url === nc.url)
        ),
        ...requestCandidates.filter(
          (rc) => !this.videoCandidates.some((vc) => vc.url === rc.url)
        )
      ];
      if (this.videoCandidates.length > 0) {
        this.log(
          `Found ${this.videoCandidates.length} video candidates!`,
          "info"
        );
        if (playButtonClicked && elapsed < 20) {
          this.log(
            "Found candidates after play button click, collecting more sources...",
            "info"
          );
          continue;
        }
        this.log("Processing video candidates...", "info");
        const downloadSuccess = await this.processResults();
        if (downloadSuccess) {
          this.log(
            "Download started successfully! Stopping monitoring.",
            "info"
          );
          return { success: true, processed: true };
        } else {
          this.log(
            "Failed to start download with current candidates, continuing monitoring...",
            "warn"
          );
          this.videoCandidates = [];
        }
      }
      this.log(`Monitoring... ${elapsed.toFixed(1)}s elapsed`, "info");
    }
    this.log(`No video streams found after ${timeout}s monitoring`, "info");
    return { success: false, processed: false };
  }
  async processResults() {
    try {
      const allCandidates = [
        ...this.videoCandidates,
        ...this.networkMonitor.getVideoCandidates(),
        ...this.requestHandler.getVideoCandidates()
      ];
      const uniqueCandidates = allCandidates.filter(
        (candidate, index, array) => array.findIndex((c) => c.url === candidate.url) === index
      );
      if (uniqueCandidates.length === 0) {
        this.log("No video candidates found to process", "warn");
        return false;
      }
      this.log(
        `Processing ${uniqueCandidates.length} unique video candidates`,
        "info"
      );
      for (const candidate of uniqueCandidates) {
        try {
          if (candidate.url.endsWith(".mp4") || candidate.url.endsWith(".mkv") || candidate.url.endsWith(".avi")) {
            this.log(
              `Trying direct download for: ${candidate.url}`,
              "info"
            );
            const directSuccess = await this.downloadDirectVideo(
              candidate.url,
              candidate.headers
            );
            if (directSuccess) {
              return true;
            }
          } else if (candidate.url.includes(".m3u8") || candidate.type === "m3u8") {
            this.log(
              `Trying M3U8 processing for: ${candidate.url}`,
              "info"
            );
            const m3u8Success = await this.processM3U8Directly(
              candidate.url,
              candidate.headers
            );
            if (m3u8Success) {
              return true;
            }
          }
        } catch (error) {
          this.log(
            `Failed to process candidate ${candidate.url}: ${error}`,
            "warn"
          );
          continue;
        }
      }
      this.log(
        "Falling back to stream handler for complex processing",
        "info"
      );
      return await this.streamHandler.processResults(uniqueCandidates);
    } catch (error) {
      this.log(`Error in processResults: ${error}`, "error");
      return false;
    }
  }
  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  }
  async cleanup() {
    try {
      if (this.browser) {
        console.log("VideoDownloader: Cleaning up browser...");
        await this.browser.close();
        console.log("VideoDownloader: Browser cleanup completed");
      }
    } catch (error) {
      this.log(`Error during cleanup: ${error}`, "warn");
      console.error(
        "VideoDownloader: Cleanup error:",
        error instanceof Error ? error.message : String(error)
      );
    }
    try {
      this.log("VideoDownloader cleanup completed", "info");
    } catch (error) {
      this.log(`Error during M3U8 cleanup: ${error}`, "warn");
    }
  }
  // Public cleanup method for external use
  async forceCleanup() {
    await this.cleanup();
  }
  // Public methods for external use
  getVideoCandidates() {
    return [...this.videoCandidates];
  }
  getAllVideoRequests() {
    return [...this.allVideoRequests];
  }
  isDirectUrlFound() {
    return this.directUrlFound;
  }
  getTitleInfo() {
    return this.titleInfo;
  }
  hasTitleInfo() {
    return this.titleInfo !== null;
  }
  formatTitleInfo() {
    if (!this.titleInfo) {
      return "No title information available";
    }
    return this.titleScraper.formatTitleInfo(this.titleInfo);
  }
  setDirectUrlFound(found) {
    this.directUrlFound = found;
  }
  /**
   * Initialize browser and extract title info without full download process
   * This is used by the getInfo function for quick title extraction
   */
  async initializeBrowserAndExtractTitle() {
    try {
      const browserType = await this.browserHelper.selectBestBrowser(
        this.config.browserType
      );
      this.log(`Starting title extraction with ${browserType.toUpperCase()}`, "info");
      await this.initializeBrowser(browserType);
      if (!this.page) {
        throw new Error("Failed to initialize page");
      }
      await this.setupComprehensiveMonitoring();
      this.log("Waiting for page to fully load...", "debug");
      await this.pageHelper.waitForJWPlayerInitialization(this.page);
      this.log("Extracting title information...", "debug");
      this.titleInfo = await this.titleScraper.extractTitleInfo(this.page);
      if (this.titleInfo) {
        this.log("Title information extracted successfully", "info");
        this.log(`Title: ${this.titleInfo.title}`, "debug");
        if (this.titleInfo.code) this.log(`Code: ${this.titleInfo.code}`, "debug");
      } else {
        this.log("Could not extract title information", "warn");
      }
      const networkCandidates = this.networkMonitor.getVideoCandidates();
      const requestCandidates = this.requestHandler.getVideoCandidates();
      this.videoCandidates = [
        ...this.videoCandidates,
        ...networkCandidates.filter(
          (nc) => !this.videoCandidates.some((vc) => vc.url === nc.url)
        ),
        ...requestCandidates.filter(
          (rc) => !this.videoCandidates.some((vc) => vc.url === rc.url)
        )
      ];
      return this.titleInfo !== null;
    } catch (error) {
      this.log(`Title extraction failed: ${error}`, "error");
      return false;
    }
  }
  // Download monitoring setup
  async setupDownloadMonitoring() {
    if (!this.page) return false;
    return new Promise((resolve) => {
      let downloadDetected = false;
      this.page.context().on("page", async (newPage) => {
        try {
          const url = newPage.url();
          if (url.includes("download") || url.includes(".mp4") || url.includes(".mkv")) {
            this.log(`Download page detected: ${url}`, "info");
            downloadDetected = true;
            resolve(true);
          }
        } catch (error) {
        }
      });
      this.page.on("response", async (response) => {
        try {
          const headers = response.headers();
          const contentDisposition = headers["content-disposition"];
          const contentType = headers["content-type"];
          if (contentDisposition && contentDisposition.includes("attachment")) {
            this.log(
              `Download response detected: ${response.url()}`,
              "info"
            );
            downloadDetected = true;
            resolve(true);
          }
          if (contentType && (contentType.includes("video/") || contentType.includes("application/octet-stream"))) {
            const url = response.url();
            if (url.includes(".mp4") || url.includes(".mkv") || url.includes(".avi")) {
              this.log(
                `Video file response detected: ${url}`,
                "info"
              );
              downloadDetected = true;
              resolve(true);
            }
          }
        } catch (error) {
        }
      });
      setTimeout(() => {
        if (!downloadDetected) {
          resolve(false);
        }
      }, 3e4);
    });
  }
  // Direct M3U8 processing methods for easier access
  async processM3U8Directly(m3u8Url, headers = {}) {
    this.log(`Processing M3U8 directly: ${m3u8Url}`, "info");
    try {
      const finalHeaders = Object.keys(headers).length > 0 ? headers : this.capturedHeaders;
      const enhancedHeaders = {
        ...finalHeaders,
        Referer: this.config.url,
        // Use the original page URL as referer
        Origin: this.extractDomain(this.config.url),
        // Use EXACT same User-Agent as Python script
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0"
      };
      let success = await this.m3u8Processor.processM3U8(
        m3u8Url,
        enhancedHeaders,
        this.page
      );
      if (!success && this.page) {
        this.log(
          "M3U8Processor failed, trying browser-based approach...",
          "info"
        );
        success = await this.procesM3U8WithBrowser(m3u8Url);
      }
      if (!success) {
        this.log(
          "Browser-based approach failed, trying TypeScript M3U8 processor...",
          "info"
        );
        success = await this.m3u8Processor.processM3U8(
          m3u8Url,
          this.capturedHeaders
        );
      }
      if (success) {
        this.log(
          "Direct M3U8 processing completed successfully",
          "info"
        );
        this.playButtonHandler.markDownloadCompleted();
      } else {
        this.log(
          "Direct M3U8 processing failed with all methods",
          "error"
        );
      }
      return success;
    } catch (error) {
      this.log(`Error in direct M3U8 processing: ${error}`, "error");
      return false;
    }
  }
  async procesM3U8WithBrowser(m3u8Url) {
    if (!this.page) return false;
    try {
      this.log(
        `Trying browser-based M3U8 processing: ${m3u8Url}`,
        "info"
      );
      const response = await this.page.evaluate(async (url) => {
        try {
          const response2 = await fetch(url, {
            method: "GET",
            credentials: "include",
            // Include cookies
            headers: {
              // Use EXACT same headers as Python script for consistency
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.9",
              "Accept-Encoding": "gzip, deflate, br",
              DNT: "1",
              Connection: "keep-alive",
              "Upgrade-Insecure-Requests": "1",
              "Sec-Fetch-Dest": "document",
              "Sec-Fetch-Mode": "navigate",
              "Sec-Fetch-Site": "none",
              "Sec-Fetch-User": "?1",
              "Cache-Control": "max-age=0"
            }
          });
          if (!response2.ok) {
            throw new Error(
              `HTTP ${response2.status}: ${response2.statusText}`
            );
          }
          const text = await response2.text();
          return {
            success: true,
            content: text,
            status: response2.status
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
          };
        }
      }, m3u8Url);
      if (response.success && response.content) {
        this.log(
          `Successfully fetched M3U8 content via browser (${response.content.length} chars)`,
          "info"
        );
        return await this.processPythonStyleM3U8(
          m3u8Url,
          response.content
        );
      } else {
        this.log(
          `Browser-based M3U8 fetch failed: ${response.error}`,
          "warn"
        );
        return false;
      }
    } catch (error) {
      this.log(
        `Error in browser-based M3U8 processing: ${error}`,
        "error"
      );
      return false;
    }
  }
  async processPythonStyleM3U8(baseUrl, m3u8Content) {
    try {
      this.log(`Processing M3U8 with Python-style approach`, "info");
      const lines = m3u8Content.split("\n").map((line) => line.trim()).filter((line) => line);
      const segments = [];
      let isPlaylist = false;
      for (const line of lines) {
        if (line.startsWith("#EXT-X-STREAM-INF:")) {
          isPlaylist = true;
          break;
        }
      }
      if (isPlaylist) {
        this.log(
          `Master playlist detected, selecting best quality`,
          "info"
        );
        let bestBandwidth = 0;
        let bestVariantUrl = "";
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith("#EXT-X-STREAM-INF:")) {
            const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
            const bandwidth = bandwidthMatch ? parseInt(bandwidthMatch[1]) : 0;
            if (bandwidth > bestBandwidth && i + 1 < lines.length) {
              const nextLine = lines[i + 1];
              if (!nextLine.startsWith("#")) {
                bestBandwidth = bandwidth;
                bestVariantUrl = nextLine;
              }
            }
          }
        }
        if (bestVariantUrl) {
          const fullVariantUrl = this.resolveUrl(
            bestVariantUrl,
            baseUrl
          );
          this.log(
            `Selected best quality variant: ${fullVariantUrl}`,
            "info"
          );
          const variantResponse = await this.page.evaluate(
            async (url) => {
              try {
                const response = await fetch(url, {
                  method: "GET",
                  credentials: "include",
                  headers: {
                    // Use EXACT same headers as Python script for consistency
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Accept-Encoding": "gzip, deflate, br",
                    DNT: "1",
                    Connection: "keep-alive",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "none",
                    "Sec-Fetch-User": "?1",
                    "Cache-Control": "max-age=0"
                  }
                });
                if (!response.ok) {
                  throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`
                  );
                }
                const text = await response.text();
                return { success: true, content: text };
              } catch (error) {
                return {
                  success: false,
                  error: error instanceof Error ? error.message : String(error)
                };
              }
            },
            fullVariantUrl
          );
          if (variantResponse.success && variantResponse.content) {
            return await this.processPythonStyleM3U8(
              fullVariantUrl,
              variantResponse.content
            );
          } else {
            this.log(
              `Failed to fetch variant playlist: ${variantResponse.error}`,
              "error"
            );
            return false;
          }
        }
      } else {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith("#EXTINF:") && i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            if (!nextLine.startsWith("#")) {
              const segmentUrl = this.resolveUrl(
                nextLine,
                baseUrl
              );
              segments.push(segmentUrl);
            }
          }
        }
        if (segments.length === 0) {
          this.log(`No segments found in M3U8 playlist`, "error");
          return false;
        }
        this.log(
          `Found ${segments.length} segments to download`,
          "info"
        );
        return await this.m3u8Processor.processM3U8(
          baseUrl,
          this.capturedHeaders,
          this.page
        );
      }
      return false;
    } catch (error) {
      this.log(`Error in TypeScript M3U8 processing: ${error}`, "error");
      return false;
    }
  }
  resolveUrl(url, baseUrl) {
    if (url.startsWith("http")) {
      return url;
    }
    try {
      return new URL(url, baseUrl).toString();
    } catch {
      const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
      return base + url;
    }
  }
  async downloadDirectVideo(videoUrl, headers = {}) {
    this.log(`Downloading direct video: ${videoUrl}`, "info");
    try {
      const finalHeaders = Object.keys(headers).length > 0 ? headers : this.capturedHeaders;
      const success = await this.m3u8Processor.downloadDirectVideo(
        videoUrl,
        finalHeaders
      );
      if (success) {
        this.log(
          "Direct video download completed successfully",
          "info"
        );
        this.playButtonHandler.markDownloadCompleted();
        this.directUrlFound = true;
      } else {
        this.log("Direct video download failed", "error");
      }
      return success;
    } catch (error) {
      this.log(`Error in direct video download: ${error}`, "error");
      return false;
    }
  }
  async handlePopupsManually() {
    if (!this.page) {
      this.log("No page available for popup handling", "warn");
      return;
    }
    this.log("Manual popup handling requested", "info");
    try {
      await this.popupHandler.closePopups(this.page);
      this.log("Manual popup handling completed", "info");
    } catch (error) {
      this.log(`Error in manual popup handling: ${error}`, "error");
    }
  }
  async closeSpecificPopup(selector) {
    if (!this.page) {
      this.log("No page available for popup handling", "warn");
      return false;
    }
    this.log(`Closing specific popup: ${selector}`, "info");
    try {
      return await this.popupHandler.closeSpecificPopup(
        this.page,
        selector
      );
    } catch (error) {
      this.log(`Error closing specific popup: ${error}`, "error");
      return false;
    }
  }
};

// src/index.ts
init_TitleScraper();
var import_FirefoxBrowser2 = __toESM(require_FirefoxBrowser());
var import_BraveBrowser2 = __toESM(require_BraveBrowser());
var import_ChromiumBrowser2 = __toESM(require_ChromiumBrowser());
var import_BaseHelper4 = __toESM(require_BaseHelper());

// src/helpers/DownloadHelper.ts
var fs3 = __toESM(require("fs"));
var path2 = __toESM(require("path"));
var import_BaseHelper3 = __toESM(require_BaseHelper());
var DownloadHelper = class extends import_BaseHelper3.BaseHelper {
  config;
  constructor(logger, config = {}) {
    super(logger);
    this.config = {
      outputFilepath: config.outputFilepath || DEFAULT_OUTPUT_DIR,
      maxWorkers: config.maxWorkers || 4,
      timeout: config.timeout || 3e4,
      retries: config.retries || 3
    };
  }
  get outputFilename() {
    return path2.basename(this.config.outputFilepath || DEFAULT_OUTPUT_DIR);
  }
  get outputDirpath() {
    return path2.dirname(this.config.outputFilepath || DEFAULT_OUTPUT_DIR);
  }
  ensureDownloadDirectory() {
    const outputDir = this.outputDirpath;
    if (!fs3.existsSync(outputDir)) {
      fs3.mkdirSync(outputDir, { recursive: true });
      this.logger.log(`Created download directory: ${outputDir}`, "info");
    }
  }
  generateOutputFilename(prefix = "pokemon_video", extension = "mp4") {
    const timestamp = this.generateTimestamp();
    return `${prefix}_${timestamp}.${extension}`;
  }
  getOutputPath(filename) {
    this.ensureDownloadDirectory();
    return this.config.outputFilepath || DEFAULT_OUTPUT_DIR;
  }
  fileExists(filepath) {
    return fs3.existsSync(filepath);
  }
  getFileSize(filepath) {
    try {
      const stats = fs3.statSync(filepath);
      return stats.size;
    } catch {
      return 0;
    }
  }
  deleteFile(filepath) {
    try {
      fs3.unlinkSync(filepath);
      this.logger.log(`Deleted file: ${filepath}`, "info");
      return true;
    } catch (error) {
      this.logger.log(
        `Failed to delete file ${filepath}: ${error}`,
        "error"
      );
      return false;
    }
  }
  moveFile(source, destination) {
    try {
      fs3.renameSync(source, destination);
      this.logger.log(
        `Moved file from ${source} to ${destination}`,
        "info"
      );
      return true;
    } catch (error) {
      this.logger.log(
        `Failed to move file from ${source} to ${destination}: ${error}`,
        "error"
      );
      return false;
    }
  }
  copyFile(source, destination) {
    try {
      fs3.copyFileSync(source, destination);
      this.logger.log(
        `Copied file from ${source} to ${destination}`,
        "info"
      );
      return true;
    } catch (error) {
      this.logger.log(
        `Failed to copy file from ${source} to ${destination}: ${error}`,
        "error"
      );
      return false;
    }
  }
  listDownloadedFiles() {
    try {
      this.ensureDownloadDirectory();
      return fs3.readdirSync(this.config.outputFilepath);
    } catch (error) {
      this.logger.log(
        `Failed to list downloaded files: ${error}`,
        "error"
      );
      return [];
    }
  }
  getDownloadStats() {
    const files = this.listDownloadedFiles();
    let totalSize = 0;
    for (const file of files) {
      const filepath = path2.join(this.config.outputFilepath, file);
      totalSize += this.getFileSize(filepath);
    }
    return {
      count: files.length,
      totalSize
    };
  }
  formatFileSize(bytes) {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
  cleanupIncompleteFiles() {
    try {
      const files = this.listDownloadedFiles();
      for (const file of files) {
        const filepath = path2.join(this.config.outputFilepath, file);
        const size = this.getFileSize(filepath);
        if (size < 1024 * 1024) {
          this.logger.log(
            `Deleting incomplete file: ${file} (${this.formatFileSize(
              size
            )})`,
            "warn"
          );
          this.deleteFile(filepath);
        }
      }
    } catch (error) {
      this.logger.log(
        `Failed to cleanup incomplete files: ${error}`,
        "error"
      );
    }
  }
  getConfig() {
    return { ...this.config };
  }
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.logger.log("Download configuration updated", "info");
  }
};

// src/index.ts
__reExport(index_exports, __toESM(require_types()), module.exports);
var import_CreatorMetadataManager = __toESM(require_CreatorMetadataManager());
var import_CreatorMetadataScraper = __toESM(require_CreatorMetadataScraper());
var import_YouTubeScraper = __toESM(require_YouTubeScraper());
var import_TikTokScraper = __toESM(require_TikTokScraper());
var import_TwitterScraper = __toESM(require_TwitterScraper());
var import_InstagramScraper = __toESM(require_InstagramScraper());
var import_RedditScraper = __toESM(require_RedditScraper());
var import_FacebookScraper = __toESM(require_FacebookScraper());
var import_TwitchScraper = __toESM(require_TwitchScraper());
var path3 = require("path");
var index_default = VideoDownloader;
async function getInfo(e, url) {
  if (!url.startsWith("https://jav.guru")) return;
  e.stopPropagation();
  try {
    const simpleLogger = new import_StringBuilder.Logger("getInfo", e.invokeEvent);
    const logAgent = simpleLogger.agent("TitleScraper");
    const { TitleScraper: TitleScraper2 } = await Promise.resolve().then(() => (init_TitleScraper(), TitleScraper_exports));
    const { FirefoxBrowser: FirefoxBrowser3 } = await Promise.resolve().then(() => __toESM(require_FirefoxBrowser()));
    const titleScraper = new TitleScraper2(logAgent);
    const browser = new FirefoxBrowser3(simpleLogger);
    await browser.launch({
      headless: true,
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true
    });
    const page = await browser.getPage(url);
    const titleInfo = await titleScraper.extractTitleInfo(page);
    await browser.close();
    return {
      ok: true,
      data: {
        id: titleInfo?.code || url,
        title: titleInfo?.title || url,
        titleInfo: titleInfo || void 0,
        formats: [
          {
            format_id: "detected-stream",
            url,
            // The actual stream URL will be detected during download
            ext: "mp4",
            protocol: "https",
            http_headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Sec-Fetch-Mode": "navigate"
            },
            format: "Stream (detected during download)"
          }
        ]
      }
    };
  } catch (error) {
    console.error("Error in getInfo:", error);
    return {
      ok: false,
      data: {
        id: url,
        title: url,
        error: error instanceof Error ? error.message : String(error),
        formats: [
          {
            format_id: "mp4-720p",
            url,
            ext: "mp4",
            protocol: "https",
            http_headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Sec-Fetch-Mode": "navigate"
            },
            format: "720p MP4"
          }
        ]
      }
    };
  }
}
async function downloadInternal(downloadId, url, outputFilepath, invokeEvent) {
  let processCompletionHandled = false;
  let completeLog = new import_StringBuilder.Logger(downloadId, invokeEvent);
  function handleProcessCompletion(code, signal, eventType) {
    if (processCompletionHandled) return;
    processCompletionHandled = true;
    const completionMessage = `Process '${downloadId}' ${eventType} with code: ${code}, signal: ${signal}`;
    completeLog.append(completionMessage);
    setTimeout(() => {
      invokeEvent.sender.send(downloadId, {
        type: "completion",
        data: {
          log: completionMessage,
          completeLog: completeLog.toString(),
          exitCode: code,
          signal,
          controllerId: downloadId
        }
      });
    }, 100);
  }
  const videoDownloader = new VideoDownloader({
    completeLog,
    downloadId,
    invokeEvent,
    url,
    browserType: "firefox",
    downloadConfig: {
      outputFilepath
    },
    browserConfig: {
      headless: false,
      disableImages: true
    }
  });
  const video = await videoDownloader.main();
  if (!video) {
    handleProcessCompletion(1, "failed", "failed");
    return;
  }
  handleProcessCompletion(0, "closed", "closed");
}
async function download(e, downloadId, args) {
  const { url, outputFilepath } = args;
  if (!url.startsWith("https://jav.guru")) return;
  e.stopPropagation();
  const { invokeEvent } = e;
  downloadInternal(
    downloadId,
    url,
    path3.normalize(outputFilepath),
    invokeEvent
  );
  return { downloadId, controllerId: downloadId };
}
function main({ events }) {
  events.on("extendr:getInfo", getInfo, -10);
  events.on("extendr:download", download, -10);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AdBlocker,
  BaseHelper,
  BraveBrowser,
  BrowserHelper,
  ChromiumBrowser,
  CreatorMetadataManager,
  CreatorMetadataScraper,
  DownloadHelper,
  FacebookScraper,
  FirefoxBrowser,
  IFrameMonitor,
  InstagramScraper,
  M3U8Processor,
  NetworkMonitor,
  PageHelper,
  PlayButtonHandler,
  PopupHandler,
  RedditScraper,
  RequestHandler,
  RouteHandler,
  StreamButtonHandler,
  StreamHandler,
  TikTokScraper,
  TitleScraper,
  TwitchScraper,
  TwitterScraper,
  VideoDownloader,
  YouTubeScraper,
  main
});
