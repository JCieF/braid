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
    var Logger4 = (
      /** @class */
      (function(_super) {
        __extends(Logger5, _super);
        function Logger5(downloadId, invokeEvent) {
          var _this = _super.call(this) || this;
          _this.downloadId = downloadId;
          _this.invokeEvent = invokeEvent;
          return _this;
        }
        Logger5.prototype.log = function(text, type) {
          this.append("".concat(text, " @ ").concat(type));
          this.invokeEvent.sender.send(this.downloadId, {
            data: text,
            completeLog: this.toString()
          });
          return this;
        };
        Logger5.prototype.agent = function(name) {
          return new LogAgent(name, this);
        };
        return Logger5;
      })(StringBuilder)
    );
    exports2.Logger = Logger4;
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
            var launchOptions, _a, contextOptions, _b, error_1;
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
                  launchOptions = {
                    headless: (_c = config.headless) !== null && _c !== void 0 ? _c : true,
                    args: []
                  };
                  if (config.firefoxUserDataDir) {
                    launchOptions.firefoxUserDataDir = config.firefoxUserDataDir;
                  }
                  _a = this;
                  return [4, playwright_1.firefox.launch(launchOptions)];
                case 2:
                  _a.browser = _h.sent();
                  contextOptions = {
                    viewport: (_d = config.viewport) !== null && _d !== void 0 ? _d : { width: 1920, height: 1080 },
                    userAgent: (_e = config.userAgent) !== null && _e !== void 0 ? _e : "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0",
                    ignoreHTTPSErrors: (_f = config.ignoreHTTPSErrors) !== null && _f !== void 0 ? _f : true,
                    javaScriptEnabled: (_g = config.javaScriptEnabled) !== null && _g !== void 0 ? _g : true,
                    permissions: [],
                    extraHTTPHeaders: {
                      "Accept-Language": "en-US,en;q=0.9"
                    }
                  };
                  _b = this;
                  return [4, this.browser.newContext(contextOptions)];
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
    var CreatorMetadataScraper3 = (
      /** @class */
      (function(_super) {
        __extends(CreatorMetadataScraper4, _super);
        function CreatorMetadataScraper4(logger, config) {
          if (config === void 0) {
            config = {};
          }
          var _this = _super.call(this, logger) || this;
          _this.config = __assign({ timeout: 3e4, retries: 3 }, config);
          return _this;
        }
        CreatorMetadataScraper4.detectPlatform = function(url) {
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
        CreatorMetadataScraper4.prototype.extractVideoMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, null];
            });
          });
        };
        CreatorMetadataScraper4.prototype.getElementText = function(page, selector) {
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
        CreatorMetadataScraper4.prototype.getElementAttribute = function(page, selector, attribute) {
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
        CreatorMetadataScraper4.prototype.parseCount = function(text) {
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
        CreatorMetadataScraper4.prototype.waitForElement = function(page_1, selector_1) {
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
        CreatorMetadataScraper4.prototype.cleanText = function(text) {
          if (!text)
            return "";
          return text.trim().replace(/\s+/g, " ");
        };
        return CreatorMetadataScraper4;
      })(BaseHelper_js_1.BaseHelper)
    );
    exports2.CreatorMetadataScraper = CreatorMetadataScraper3;
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
              return [2, null];
            });
          });
        };
        YouTubeScraper3.prototype.extractMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var channelUrl, channelSelectors, _i, channelSelectors_1, selector, link, _a, metadata, _b, _c, error_1;
            return __generator(this, function(_d) {
              switch (_d.label) {
                case 0:
                  _d.trys.push([0, 15, , 16]);
                  this.logger.log("Extracting YouTube creator metadata (avatar, verified)...", "info");
                  return [4, page.goto(videoUrl, { waitUntil: "domcontentloaded" })];
                case 1:
                  _d.sent();
                  return [4, this.delay(3e3)];
                case 2:
                  _d.sent();
                  channelUrl = null;
                  channelSelectors = [
                    'a[href*="/channel/"]',
                    'a[href*="/c/"]',
                    'a[href*="/user/"]',
                    'a[href*="/@"]',
                    "ytd-channel-name a",
                    "#channel-name a"
                  ];
                  _i = 0, channelSelectors_1 = channelSelectors;
                  _d.label = 3;
                case 3:
                  if (!(_i < channelSelectors_1.length)) return [3, 6];
                  selector = channelSelectors_1[_i];
                  return [4, this.getElementAttribute(page, selector, "href")];
                case 4:
                  link = _d.sent();
                  if (link && (link.includes("/channel/") || link.includes("/c/") || link.includes("/user/") || link.includes("/@"))) {
                    channelUrl = link.startsWith("http") ? link : "https://www.youtube.com".concat(link);
                    return [3, 6];
                  }
                  _d.label = 5;
                case 5:
                  _i++;
                  return [3, 3];
                case 6:
                  if (!channelUrl) {
                    this.logger.log("Could not find channel URL", "warn");
                    return [2, null];
                  }
                  this.logger.log("Found channel URL: ".concat(channelUrl), "debug");
                  return [4, page.goto(channelUrl, { waitUntil: "networkidle" })];
                case 7:
                  _d.sent();
                  return [4, this.delay(3e3)];
                case 8:
                  _d.sent();
                  _d.label = 9;
                case 9:
                  _d.trys.push([9, 11, , 12]);
                  return [4, page.waitForSelector("ytd-channel-avatar, #avatar", { timeout: 5e3 })];
                case 10:
                  _d.sent();
                  return [3, 12];
                case 11:
                  _a = _d.sent();
                  return [3, 12];
                case 12:
                  metadata = {
                    platform: "youtube",
                    url: channelUrl,
                    extractedAt: Date.now()
                  };
                  _b = metadata;
                  return [4, this.extractAvatarUrl(page)];
                case 13:
                  _b.creator_avatar_url = _d.sent();
                  _c = metadata;
                  return [4, this.extractVerifiedStatus(page)];
                case 14:
                  _c.creator_verified = _d.sent();
                  this.logger.log("Successfully extracted YouTube creator metadata", "info");
                  return [2, metadata];
                case 15:
                  error_1 = _d.sent();
                  this.logger.log("Failed to extract YouTube metadata: ".concat(error_1), "error");
                  return [2, null];
                case 16:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        YouTubeScraper3.prototype.extractVideoMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var _a, _b, videoIdMatch, isShortUrl, metadata, embeddedData, domData, error_2;
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  _c.trys.push([0, 16, , 17]);
                  this.logger.log("Extracting YouTube video metadata (all fields for fallback)...", "info");
                  return [4, page.goto(videoUrl, { waitUntil: "networkidle" })];
                case 1:
                  _c.sent();
                  return [4, this.delay(3e3)];
                case 2:
                  _c.sent();
                  _c.label = 3;
                case 3:
                  _c.trys.push([3, 5, , 6]);
                  return [4, page.waitForSelector("ytd-video-primary-info-renderer, #top-level-buttons-computed", { timeout: 5e3 })];
                case 4:
                  _c.sent();
                  return [3, 6];
                case 5:
                  _a = _c.sent();
                  return [3, 6];
                case 6:
                  return [4, this.delay(2e3)];
                case 7:
                  _c.sent();
                  _c.label = 8;
                case 8:
                  _c.trys.push([8, 11, , 12]);
                  return [4, page.evaluate(function() {
                    var commentsSection = document.querySelector("ytd-comments-header-renderer, #comments");
                    if (commentsSection) {
                      commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  })];
                case 9:
                  _c.sent();
                  return [4, this.delay(2e3)];
                case 10:
                  _c.sent();
                  return [3, 12];
                case 11:
                  _b = _c.sent();
                  return [3, 12];
                case 12:
                  videoIdMatch = videoUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
                  isShortUrl = videoUrl.includes("/shorts/");
                  metadata = {
                    platform: "youtube",
                    url: videoUrl,
                    extractedAt: Date.now()
                  };
                  if (videoIdMatch) {
                    metadata.video_id = videoIdMatch[1];
                  }
                  return [4, this.extractYouTubeSpecificData(page)];
                case 13:
                  embeddedData = _c.sent();
                  if (!embeddedData) return [3, 15];
                  return [4, this.extractFromDOM(page)];
                case 14:
                  domData = _c.sent();
                  if (domData) {
                    if (!embeddedData.like_count && domData.like_count) {
                      embeddedData.like_count = domData.like_count;
                    }
                    if (!embeddedData.comment_count && domData.comment_count) {
                      embeddedData.comment_count = domData.comment_count;
                    }
                  }
                  _c.label = 15;
                case 15:
                  if (embeddedData) {
                    if (embeddedData.title) {
                      metadata.caption = embeddedData.title;
                    }
                    if (embeddedData.description) {
                      if (!metadata.caption) {
                        metadata.caption = embeddedData.description;
                      } else {
                        metadata.caption = "".concat(metadata.caption, "\n\n").concat(embeddedData.description);
                      }
                    }
                    if (embeddedData.view_count !== void 0)
                      metadata.view_count = embeddedData.view_count;
                    if (embeddedData.like_count !== void 0)
                      metadata.like_count = embeddedData.like_count;
                    if (embeddedData.comment_count !== void 0)
                      metadata.comment_count = embeddedData.comment_count;
                    if (embeddedData.timestamp !== void 0)
                      metadata.timestamp = embeddedData.timestamp;
                    if (embeddedData.tags)
                      metadata.hashtags = embeddedData.tags;
                    if (embeddedData.duration !== void 0)
                      metadata.duration = embeddedData.duration;
                    if (embeddedData.channel_id)
                      metadata.channel_id = embeddedData.channel_id;
                    if (embeddedData.channel_name)
                      metadata.channel_name = embeddedData.channel_name;
                    if (embeddedData.thumbnails && embeddedData.thumbnails.length > 0)
                      metadata.thumbnails = embeddedData.thumbnails;
                    if (embeddedData.definition)
                      metadata.definition = embeddedData.definition;
                    if (embeddedData.concurrentViewers !== void 0)
                      metadata.concurrentViewers = embeddedData.concurrentViewers;
                    if (embeddedData.mentions)
                      metadata.mentions = embeddedData.mentions;
                    if (embeddedData.embeddable !== void 0)
                      metadata.embeddable = embeddedData.embeddable;
                    if (embeddedData.dimension)
                      metadata.dimension = embeddedData.dimension;
                    if (embeddedData.projection)
                      metadata.projection = embeddedData.projection;
                    if (embeddedData.madeForKids !== void 0)
                      metadata.madeForKids = embeddedData.madeForKids;
                    if (embeddedData.isShort !== void 0)
                      metadata.isShort = embeddedData.isShort;
                    if (embeddedData.isLive !== void 0)
                      metadata.isLive = embeddedData.isLive;
                    if (embeddedData.isUpcoming !== void 0)
                      metadata.isUpcoming = embeddedData.isUpcoming;
                    if (embeddedData.hasCaptions !== void 0)
                      metadata.hasCaptions = embeddedData.hasCaptions;
                    if (embeddedData.isUnlisted !== void 0)
                      metadata.isUnlisted = embeddedData.isUnlisted;
                    if (embeddedData.isAgeRestricted !== void 0)
                      metadata.isAgeRestricted = embeddedData.isAgeRestricted;
                    if (embeddedData.category)
                      metadata.category = embeddedData.category;
                    if (embeddedData.defaultLanguage)
                      metadata.defaultLanguage = embeddedData.defaultLanguage;
                  }
                  if (metadata.isShort === void 0 && isShortUrl) {
                    metadata.isShort = true;
                  }
                  this.logger.log("Successfully extracted YouTube video metadata", "info");
                  return [2, metadata];
                case 16:
                  error_2 = _c.sent();
                  this.logger.log("Failed to extract YouTube video metadata: ".concat(error_2), "error");
                  return [2, null];
                case 17:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        YouTubeScraper3.prototype.extractFromDOM = function(page) {
          return __awaiter(this, void 0, void 0, function() {
            var data, error_3;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 2, , 3]);
                  return [4, page.evaluate(function() {
                    var result = {};
                    var likeSelectors = [
                      'ytd-toggle-button-renderer[aria-label*="like"]',
                      'button[aria-label*="like"]',
                      '#top-level-buttons-computed button[aria-label*="like"]'
                    ];
                    for (var _i = 0, likeSelectors_1 = likeSelectors; _i < likeSelectors_1.length; _i++) {
                      var selector = likeSelectors_1[_i];
                      try {
                        var elements = document.querySelectorAll(selector);
                        for (var _a2 = 0, elements_1 = elements; _a2 < elements_1.length; _a2++) {
                          var el = elements_1[_a2];
                          var ariaLabel = el.getAttribute("aria-label") || "";
                          if (ariaLabel && ariaLabel.toLowerCase().includes("like") && !ariaLabel.toLowerCase().includes("view") && /[\d.,]+[KMB]?/.test(ariaLabel)) {
                            var match = ariaLabel.match(/([\d.,]+[KMB]?)/);
                            if (match) {
                              var num = parseFloat(match[1].replace(/,/g, ""));
                              var matchText = match[1];
                              if (matchText.includes("K") || matchText.includes("k"))
                                num *= 1e3;
                              else if (matchText.includes("M") || matchText.includes("m"))
                                num *= 1e6;
                              else if (matchText.includes("B") || matchText.includes("b"))
                                num *= 1e9;
                              if (num < 1e9 && num > 0) {
                                result.like_count = Math.floor(num);
                                break;
                              }
                            }
                          }
                        }
                        if (result.like_count)
                          break;
                      } catch (e) {
                        continue;
                      }
                    }
                    var commentSelectors = [
                      "ytd-comments-header-renderer #count",
                      "h2#count",
                      'yt-formatted-string[id="count"]',
                      "ytd-comments-header-renderer yt-formatted-string",
                      "#count-text",
                      '[aria-label*="comment"]',
                      "ytd-comments-header-renderer span"
                    ];
                    for (var _b = 0, commentSelectors_1 = commentSelectors; _b < commentSelectors_1.length; _b++) {
                      var selector = commentSelectors_1[_b];
                      try {
                        var elements = document.querySelectorAll(selector);
                        for (var _c = 0, elements_2 = elements; _c < elements_2.length; _c++) {
                          var el = elements_2[_c];
                          var text = (el.textContent || "").trim();
                          if (text && /^[\d.,]+[KMB]?\s*(comment|comments)?$/i.test(text)) {
                            var match = text.match(/([\d.,]+[KMB]?)/);
                            if (match) {
                              var num = parseFloat(match[1].replace(/,/g, ""));
                              var matchText = match[1];
                              if (matchText.includes("K") || matchText.includes("k"))
                                num *= 1e3;
                              else if (matchText.includes("M") || matchText.includes("m"))
                                num *= 1e6;
                              else if (matchText.includes("B") || matchText.includes("b"))
                                num *= 1e9;
                              if (num > 0 && num < 1e8) {
                                result.comment_count = Math.floor(num);
                                break;
                              }
                            }
                          }
                        }
                        if (result.comment_count)
                          break;
                      } catch (e) {
                        continue;
                      }
                    }
                    return result;
                  })];
                case 1:
                  data = _a.sent();
                  return [2, data];
                case 2:
                  error_3 = _a.sent();
                  this.logger.log("Failed to extract from DOM: ".concat(error_3), "debug");
                  return [2, null];
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        YouTubeScraper3.prototype.extractAvatarUrl = function(page) {
          return __awaiter(this, void 0, void 0, function() {
            var avatar, error_4;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 3, , 4]);
                  return [4, this.delay(2e3)];
                case 1:
                  _a.sent();
                  return [4, page.evaluate(function() {
                    var _a2, _b;
                    var avatarContainer = document.querySelector("ytd-channel-avatar");
                    if (avatarContainer) {
                      var img = avatarContainer.querySelector("img");
                      if (img) {
                        var src = img.src || img.currentSrc;
                        if (src && (src.includes("ggpht.com") || src.includes("ytimg.com") || src.includes("googleusercontent.com"))) {
                          return src;
                        }
                      }
                    }
                    var avatarEl = document.querySelector("#avatar img");
                    if (avatarEl) {
                      var img = avatarEl;
                      var src = img.src || img.currentSrc;
                      if (src && (src.includes("ggpht.com") || src.includes("ytimg.com") || src.includes("googleusercontent.com"))) {
                        return src;
                      }
                    }
                    var images = document.querySelectorAll("img");
                    for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
                      var img = images_1[_i];
                      var src = img.src || img.currentSrc;
                      if (src && src.includes("ggpht.com") && src.includes("=s")) {
                        if (!src.includes("banner") && !src.includes("hqdefault") && !src.includes("mqdefault")) {
                          return src;
                        }
                      }
                    }
                    if (window.ytInitialData) {
                      var ytData = window.ytInitialData;
                      var header = (_a2 = ytData === null || ytData === void 0 ? void 0 : ytData.header) === null || _a2 === void 0 ? void 0 : _a2.c4TabbedHeaderRenderer;
                      if ((_b = header === null || header === void 0 ? void 0 : header.avatar) === null || _b === void 0 ? void 0 : _b.thumbnails) {
                        var thumbnails = header.avatar.thumbnails;
                        if (thumbnails.length > 0) {
                          var largest = thumbnails[thumbnails.length - 1];
                          return largest.url;
                        }
                      }
                    }
                    return null;
                  })];
                case 2:
                  avatar = _a.sent();
                  if (avatar && this.isValidAvatarUrl(avatar)) {
                    this.logger.log("Found avatar URL: ".concat(avatar.substring(0, 60), "..."), "info");
                    return [2, avatar];
                  }
                  this.logger.log("Could not find avatar URL on channel page", "warn");
                  return [2, void 0];
                case 3:
                  error_4 = _a.sent();
                  this.logger.log("Error extracting avatar: ".concat(error_4), "warn");
                  return [2, void 0];
                case 4:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        YouTubeScraper3.prototype.isValidAvatarUrl = function(url) {
          if (!url)
            return false;
          var isYouTubeImage = url.includes("ytimg.com") || url.includes("googleusercontent.com") || url.includes("ggpht.com");
          var isNotBanner = !url.includes("featured_channel") && !url.includes("banner") && !url.includes("hqdefault") && !url.includes("mqdefault") && !url.includes("sddefault");
          return isYouTubeImage && isNotBanner;
        };
        YouTubeScraper3.prototype.extractVerifiedStatus = function(page) {
          return __awaiter(this, void 0, void 0, function() {
            var verifiedSelectors, _i, verifiedSelectors_1, selector, verified, ariaLabel, _a, _b;
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  _c.trys.push([0, 9, , 10]);
                  verifiedSelectors = [
                    '[aria-label*="Verified"]',
                    '[aria-label*="verified"]',
                    "#badge",
                    "yt-icon#badge"
                  ];
                  _i = 0, verifiedSelectors_1 = verifiedSelectors;
                  _c.label = 1;
                case 1:
                  if (!(_i < verifiedSelectors_1.length)) return [3, 8];
                  selector = verifiedSelectors_1[_i];
                  _c.label = 2;
                case 2:
                  _c.trys.push([2, 6, , 7]);
                  verified = page.locator(selector).first();
                  return [4, verified.isVisible({ timeout: 2e3 }).catch(function() {
                    return false;
                  })];
                case 3:
                  if (!_c.sent()) return [3, 5];
                  return [4, verified.getAttribute("aria-label").catch(function() {
                    return null;
                  })];
                case 4:
                  ariaLabel = _c.sent();
                  if (ariaLabel && ariaLabel.toLowerCase().includes("verified")) {
                    return [2, true];
                  }
                  _c.label = 5;
                case 5:
                  return [3, 7];
                case 6:
                  _a = _c.sent();
                  return [3, 7];
                case 7:
                  _i++;
                  return [3, 1];
                case 8:
                  return [2, false];
                case 9:
                  _b = _c.sent();
                  return [2, false];
                case 10:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        YouTubeScraper3.prototype.extractYouTubeSpecificData = function(page) {
          return __awaiter(this, void 0, void 0, function() {
            var hasData, data, error_5;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 5, , 6]);
                  return [4, page.evaluate(function() {
                    return !!window.ytInitialPlayerResponse || !!window.ytInitialData;
                  })];
                case 1:
                  hasData = _a.sent();
                  if (!!hasData) return [3, 3];
                  this.logger.log("YouTube data not loaded yet, waiting...", "warn");
                  return [4, this.delay(3e3)];
                case 2:
                  _a.sent();
                  _a.label = 3;
                case 3:
                  return [4, page.evaluate(function() {
                    var _a2, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57;
                    var result = {};
                    if (window.ytInitialPlayerResponse) {
                      var playerData = window.ytInitialPlayerResponse;
                      if (((_a2 = playerData === null || playerData === void 0 ? void 0 : playerData.playabilityStatus) === null || _a2 === void 0 ? void 0 : _a2.playableInEmbed) !== void 0) {
                        result.embeddable = playerData.playabilityStatus.playableInEmbed;
                      }
                      var playabilityStatus = playerData === null || playerData === void 0 ? void 0 : playerData.playabilityStatus;
                      if (playabilityStatus) {
                        if (((_b = playabilityStatus.reason) === null || _b === void 0 ? void 0 : _b.includes("age")) || ((_c = playabilityStatus.messages) === null || _c === void 0 ? void 0 : _c.some(function(m) {
                          return m.toLowerCase().includes("age");
                        }))) {
                          result.isAgeRestricted = true;
                        } else {
                          result.isAgeRestricted = false;
                        }
                      }
                      var streamingData = playerData === null || playerData === void 0 ? void 0 : playerData.streamingData;
                      if (streamingData === null || streamingData === void 0 ? void 0 : streamingData.adaptiveFormats) {
                        var highestQuality = 0;
                        for (var _i = 0, _58 = streamingData.adaptiveFormats; _i < _58.length; _i++) {
                          var format = _58[_i];
                          if (format.projectionType) {
                            result.projection = format.projectionType === "RECTANGULAR" ? "rectangular" : "360";
                          }
                          if (format.stereoLayout) {
                            result.dimension = "3d";
                          }
                          if (format.height && format.height >= 720) {
                            result.definition = "hd";
                            highestQuality = Math.max(highestQuality, format.height);
                          }
                        }
                        if (!result.definition && streamingData.adaptiveFormats.length > 0) {
                          var hasLowQuality = streamingData.adaptiveFormats.some(function(f) {
                            return f.height && f.height < 720;
                          });
                          if (hasLowQuality) {
                            result.definition = "sd";
                          }
                        }
                      }
                      if (!result.dimension) {
                        result.dimension = "2d";
                      }
                      var videoDetails = playerData === null || playerData === void 0 ? void 0 : playerData.videoDetails;
                      if (videoDetails) {
                        if (videoDetails.isShortFormVideo !== void 0) {
                          result.isShort = videoDetails.isShortFormVideo;
                        }
                        if (videoDetails.isLiveContent !== void 0) {
                          result.isLive = videoDetails.isLiveContent;
                        }
                        if (videoDetails.isUpcoming !== void 0) {
                          result.isUpcoming = videoDetails.isUpcoming;
                        }
                        if (result.isLive) {
                          if (videoDetails.concurrentViewers) {
                            var viewersStr = String(videoDetails.concurrentViewers);
                            if (viewersStr.includes(",") || viewersStr.includes(".")) {
                              var num = parseFloat(viewersStr.replace(/,/g, ""));
                              if (viewersStr.includes("K") || viewersStr.includes("k"))
                                num *= 1e3;
                              else if (viewersStr.includes("M") || viewersStr.includes("m"))
                                num *= 1e6;
                              result.concurrentViewers = Math.floor(num);
                            } else {
                              result.concurrentViewers = parseInt(viewersStr) || 0;
                            }
                          }
                          if (!result.concurrentViewers && videoDetails.concurrentViewerCount) {
                            var viewersStr = String(videoDetails.concurrentViewerCount);
                            if (viewersStr.includes(",") || viewersStr.includes(".")) {
                              var num = parseFloat(viewersStr.replace(/,/g, ""));
                              if (viewersStr.includes("K") || viewersStr.includes("k"))
                                num *= 1e3;
                              else if (viewersStr.includes("M") || viewersStr.includes("m"))
                                num *= 1e6;
                              result.concurrentViewers = Math.floor(num);
                            } else {
                              result.concurrentViewers = parseInt(viewersStr) || 0;
                            }
                          }
                        }
                        if (result.isShort === void 0 && videoDetails.lengthSeconds) {
                          var length_1 = parseInt(videoDetails.lengthSeconds);
                          if (length_1 > 0 && length_1 <= 60) {
                          }
                        }
                        if (videoDetails.title) {
                          result.title = videoDetails.title;
                        }
                        if (videoDetails.shortDescription) {
                          result.description = videoDetails.shortDescription;
                        }
                        if (videoDetails.viewCount) {
                          var viewCountStr = String(videoDetails.viewCount);
                          if (viewCountStr.includes(",") || viewCountStr.includes(".")) {
                            var num = parseFloat(viewCountStr.replace(/,/g, ""));
                            if (viewCountStr.includes("K") || viewCountStr.includes("k"))
                              num *= 1e3;
                            else if (viewCountStr.includes("M") || viewCountStr.includes("m"))
                              num *= 1e6;
                            else if (viewCountStr.includes("B") || viewCountStr.includes("b"))
                              num *= 1e9;
                            result.view_count = Math.floor(num);
                          } else {
                            result.view_count = parseInt(viewCountStr) || 0;
                          }
                        }
                        if (videoDetails.lengthSeconds) {
                          result.duration = parseInt(videoDetails.lengthSeconds) || 0;
                        }
                        if (videoDetails.channelId) {
                          result.channel_id = videoDetails.channelId;
                        }
                        if (videoDetails.author) {
                          result.channel_name = videoDetails.author;
                        }
                        if (((_d = videoDetails.thumbnail) === null || _d === void 0 ? void 0 : _d.thumbnails) && videoDetails.thumbnail.thumbnails.length > 0) {
                          result.thumbnails = videoDetails.thumbnail.thumbnails.map(function(t) {
                            return t.url;
                          });
                        }
                        if (videoDetails.keywords && videoDetails.keywords.length > 0) {
                          result.tags = videoDetails.keywords;
                        }
                      }
                      var microformat = (_e = playerData === null || playerData === void 0 ? void 0 : playerData.microformat) === null || _e === void 0 ? void 0 : _e.playerMicroformatRenderer;
                      if (microformat) {
                        if (microformat.category) {
                          result.category = microformat.category;
                        }
                        if (microformat.defaultAudioLanguage) {
                          result.defaultLanguage = microformat.defaultAudioLanguage;
                        }
                        if (!result.defaultLanguage && (videoDetails === null || videoDetails === void 0 ? void 0 : videoDetails.defaultAudioLanguage)) {
                          result.defaultLanguage = videoDetails.defaultAudioLanguage;
                        }
                        if (!result.defaultLanguage && ((_g = (_f = playerData === null || playerData === void 0 ? void 0 : playerData.captions) === null || _f === void 0 ? void 0 : _f.playerCaptionsTracklistRenderer) === null || _g === void 0 ? void 0 : _g.captionTracks)) {
                          var tracks = playerData.captions.playerCaptionsTracklistRenderer.captionTracks;
                          var originalTrack = tracks.find(function(t) {
                            var _a3, _b2;
                            return ((_b2 = (_a3 = t.name) === null || _a3 === void 0 ? void 0 : _a3.simpleText) === null || _b2 === void 0 ? void 0 : _b2.toLowerCase().includes("original")) || t.kind !== "asr" && t.isTranslatable === false;
                          });
                          if (originalTrack && originalTrack.languageCode) {
                            result.defaultLanguage = originalTrack.languageCode;
                          } else {
                            var englishTrack = tracks.find(function(t) {
                              return t.languageCode && (t.languageCode.startsWith("en") || t.languageCode === "en");
                            });
                            if (englishTrack && englishTrack.languageCode) {
                              result.defaultLanguage = englishTrack.languageCode;
                            } else {
                              var firstTrack = tracks[0];
                              if (firstTrack && firstTrack.languageCode && firstTrack.kind !== "asr") {
                                var langCode = firstTrack.languageCode.split("-")[0];
                                var commonVideoLanguages = ["en", "es", "fr", "de", "ja", "ko", "pt", "ru", "it", "nl", "pl", "tr", "vi", "ar", "hi", "th", "id", "ms", "tl", "zh"];
                                if (commonVideoLanguages.includes(langCode) && langCode !== "zh") {
                                  result.defaultLanguage = firstTrack.languageCode;
                                }
                              }
                            }
                          }
                        }
                        if (microformat.isUnlisted !== void 0) {
                          result.isUnlisted = microformat.isUnlisted;
                        }
                        if (microformat.liveBroadcastDetails) {
                          result.isLive = microformat.liveBroadcastDetails.isLiveNow || false;
                          if (microformat.liveBroadcastDetails.startTimestamp) {
                            var startTime = parseInt(microformat.liveBroadcastDetails.startTimestamp);
                            var now = Math.floor(Date.now() / 1e3);
                            if (startTime > now) {
                              result.isUpcoming = true;
                            }
                          }
                        }
                        if (microformat.publishDate) {
                          var date = new Date(microformat.publishDate);
                          result.timestamp = Math.floor(date.getTime() / 1e3);
                        } else if (microformat.uploadDate) {
                          var date = new Date(microformat.uploadDate);
                          result.timestamp = Math.floor(date.getTime() / 1e3);
                        }
                      }
                      if (((_h = playerData === null || playerData === void 0 ? void 0 : playerData.videoDetails) === null || _h === void 0 ? void 0 : _h.isMadeForKids) !== void 0) {
                        result.madeForKids = playerData.videoDetails.isMadeForKids;
                      }
                      if (result.madeForKids === void 0 && ((_j = playerData === null || playerData === void 0 ? void 0 : playerData.playabilityStatus) === null || _j === void 0 ? void 0 : _j.madeForKids) !== void 0) {
                        result.madeForKids = playerData.playabilityStatus.madeForKids;
                      }
                      if (result.madeForKids === void 0 && (microformat === null || microformat === void 0 ? void 0 : microformat.isMadeForKids) !== void 0) {
                        result.madeForKids = microformat.isMadeForKids;
                      }
                      if (result.madeForKids === void 0 && videoDetails) {
                        if (videoDetails.isKidsContent !== void 0) {
                          result.madeForKids = videoDetails.isKidsContent;
                        }
                      }
                      var captions = (_l = (_k = playerData === null || playerData === void 0 ? void 0 : playerData.captions) === null || _k === void 0 ? void 0 : _k.playerCaptionsTracklistRenderer) === null || _l === void 0 ? void 0 : _l.captionTracks;
                      result.hasCaptions = captions && captions.length > 0;
                    }
                    if (window.ytInitialData) {
                      var ytData = window.ytInitialData;
                      if (result.madeForKids === void 0) {
                        var responseContext = ytData === null || ytData === void 0 ? void 0 : ytData.responseContext;
                        if (((_m = responseContext === null || responseContext === void 0 ? void 0 : responseContext.mainAppWebResponseContext) === null || _m === void 0 ? void 0 : _m.madeForKids) !== void 0) {
                          result.madeForKids = responseContext.mainAppWebResponseContext.madeForKids;
                        }
                        var contents_3 = (_r = (_q = (_p = (_o = ytData === null || ytData === void 0 ? void 0 : ytData.contents) === null || _o === void 0 ? void 0 : _o.twoColumnWatchNextResults) === null || _p === void 0 ? void 0 : _p.results) === null || _q === void 0 ? void 0 : _q.results) === null || _r === void 0 ? void 0 : _r.contents;
                        if (contents_3) {
                          var hasCommentsSection = false;
                          for (var _59 = 0, contents_1 = contents_3; _59 < contents_1.length; _59++) {
                            var content = contents_1[_59];
                            if (((_s = content === null || content === void 0 ? void 0 : content.itemSectionRenderer) === null || _s === void 0 ? void 0 : _s.sectionIdentifier) === "comment-item-section") {
                              hasCommentsSection = true;
                              break;
                            }
                          }
                        }
                        var videoDetails = (_t = contents_3 === null || contents_3 === void 0 ? void 0 : contents_3[0]) === null || _t === void 0 ? void 0 : _t.videoPrimaryInfoRenderer;
                        if (videoDetails === null || videoDetails === void 0 ? void 0 : videoDetails.badges) {
                          for (var _60 = 0, _61 = videoDetails.badges; _60 < _61.length; _60++) {
                            var badge = _61[_60];
                            var label = ((_v = (_u = badge === null || badge === void 0 ? void 0 : badge.metadataBadgeRenderer) === null || _u === void 0 ? void 0 : _u.label) === null || _v === void 0 ? void 0 : _v.toLowerCase()) || "";
                            if (label.includes("kids") || label.includes("children")) {
                              result.madeForKids = true;
                              break;
                            }
                          }
                        }
                        var pageText = ((_w = document.body) === null || _w === void 0 ? void 0 : _w.innerText) || "";
                        if (pageText.includes("Made for kids") || pageText.includes("Made for Kids")) {
                          result.madeForKids = true;
                        }
                        if (window.ytcfg) {
                          var ytcfg = window.ytcfg;
                          var data_1 = ytcfg.data_ || ((_x = ytcfg.d) === null || _x === void 0 ? void 0 : _x.call(ytcfg)) || {};
                          if (((_y = data_1.PLAYER_VARS) === null || _y === void 0 ? void 0 : _y.madeForKids) !== void 0) {
                            result.madeForKids = data_1.PLAYER_VARS.madeForKids;
                          }
                        }
                        if (result.madeForKids === void 0) {
                          result.madeForKids = false;
                        }
                      }
                      var contents = (_2 = (_1 = (_0 = (_z = ytData === null || ytData === void 0 ? void 0 : ytData.contents) === null || _z === void 0 ? void 0 : _z.twoColumnWatchNextResults) === null || _0 === void 0 ? void 0 : _0.results) === null || _1 === void 0 ? void 0 : _1.results) === null || _2 === void 0 ? void 0 : _2.contents;
                      if (contents) {
                        var videoPrimaryInfo = (_3 = contents[0]) === null || _3 === void 0 ? void 0 : _3.videoPrimaryInfoRenderer;
                        if (videoPrimaryInfo) {
                          var topLevelButtons = (_5 = (_4 = videoPrimaryInfo === null || videoPrimaryInfo === void 0 ? void 0 : videoPrimaryInfo.videoActions) === null || _4 === void 0 ? void 0 : _4.menuRenderer) === null || _5 === void 0 ? void 0 : _5.topLevelButtons;
                          if (topLevelButtons) {
                            for (var _62 = 0, topLevelButtons_1 = topLevelButtons; _62 < topLevelButtons_1.length; _62++) {
                              var button = topLevelButtons_1[_62];
                              if (button === null || button === void 0 ? void 0 : button.segmentedLikeDislikeButtonRenderer) {
                                var likeButton = button.segmentedLikeDislikeButtonRenderer.likeButton;
                                if (likeButton === null || likeButton === void 0 ? void 0 : likeButton.toggleButtonRenderer) {
                                  var likeText = ((_8 = (_7 = (_6 = likeButton.toggleButtonRenderer.defaultText) === null || _6 === void 0 ? void 0 : _6.accessibility) === null || _7 === void 0 ? void 0 : _7.accessibilityData) === null || _8 === void 0 ? void 0 : _8.label) || ((_9 = likeButton.toggleButtonRenderer.defaultText) === null || _9 === void 0 ? void 0 : _9.simpleText) || ((_12 = (_11 = (_10 = likeButton.toggleButtonRenderer.toggledText) === null || _10 === void 0 ? void 0 : _10.accessibility) === null || _11 === void 0 ? void 0 : _11.accessibilityData) === null || _12 === void 0 ? void 0 : _12.label) || ((_13 = likeButton.toggleButtonRenderer.toggledText) === null || _13 === void 0 ? void 0 : _13.simpleText) || ((_16 = (_15 = (_14 = likeButton.toggleButtonRenderer.defaultText) === null || _14 === void 0 ? void 0 : _14.runs) === null || _15 === void 0 ? void 0 : _15[0]) === null || _16 === void 0 ? void 0 : _16.text) || "";
                                  if (likeText && !likeText.toLowerCase().includes("view") && !likeText.toLowerCase().includes("like this")) {
                                    var likeMatch = likeText.match(/([\d.,]+[KMB]?)/);
                                    if (likeMatch) {
                                      var num = parseFloat(likeMatch[1].replace(/,/g, ""));
                                      var matchText = likeMatch[1];
                                      if (matchText.includes("K") || matchText.includes("k"))
                                        num *= 1e3;
                                      else if (matchText.includes("M") || matchText.includes("m"))
                                        num *= 1e6;
                                      else if (matchText.includes("B") || matchText.includes("b"))
                                        num *= 1e9;
                                      if (num < 1e9 && num > 0) {
                                        result.like_count = Math.floor(num);
                                        break;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        for (var _63 = 0, contents_2 = contents; _63 < contents_2.length; _63++) {
                          var content = contents_2[_63];
                          if ((_19 = (_18 = (_17 = content === null || content === void 0 ? void 0 : content.itemSectionRenderer) === null || _17 === void 0 ? void 0 : _17.contents) === null || _18 === void 0 ? void 0 : _18[0]) === null || _19 === void 0 ? void 0 : _19.commentsEntryPointHeaderRenderer) {
                            var commentHeader = content.itemSectionRenderer.contents[0].commentsEntryPointHeaderRenderer;
                            var commentCount = ((_20 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _20 === void 0 ? void 0 : _20.simpleText) || ((_23 = (_22 = (_21 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _21 === void 0 ? void 0 : _21.runs) === null || _22 === void 0 ? void 0 : _22[0]) === null || _23 === void 0 ? void 0 : _23.text) || ((_26 = (_25 = (_24 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.contentRenderer) === null || _24 === void 0 ? void 0 : _24.commentsEntryPointHeaderRenderer) === null || _25 === void 0 ? void 0 : _25.commentCount) === null || _26 === void 0 ? void 0 : _26.simpleText) || ((_29 = (_28 = (_27 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _27 === void 0 ? void 0 : _27.accessibility) === null || _28 === void 0 ? void 0 : _28.accessibilityData) === null || _29 === void 0 ? void 0 : _29.label);
                            if (commentCount) {
                              var match = commentCount.match(/([\d.,]+[KMB]?)/);
                              if (match) {
                                var num = parseFloat(match[1].replace(/,/g, ""));
                                var matchText = match[1];
                                if (matchText.includes("K") || matchText.includes("k"))
                                  num *= 1e3;
                                else if (matchText.includes("M") || matchText.includes("m"))
                                  num *= 1e6;
                                else if (matchText.includes("B") || matchText.includes("b"))
                                  num *= 1e9;
                                if (num > 0 && num < 1e8) {
                                  result.comment_count = Math.floor(num);
                                  break;
                                }
                              }
                            }
                          }
                          if (content === null || content === void 0 ? void 0 : content.commentsEntryPointHeaderRenderer) {
                            var commentHeader = content.commentsEntryPointHeaderRenderer;
                            var commentCount = ((_30 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _30 === void 0 ? void 0 : _30.simpleText) || ((_33 = (_32 = (_31 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _31 === void 0 ? void 0 : _31.runs) === null || _32 === void 0 ? void 0 : _32[0]) === null || _33 === void 0 ? void 0 : _33.text);
                            if (commentCount && !result.comment_count) {
                              var match = commentCount.match(/([\d.,]+[KMB]?)/);
                              if (match) {
                                var num = parseFloat(match[1].replace(/,/g, ""));
                                var matchText = match[1];
                                if (matchText.includes("K") || matchText.includes("k"))
                                  num *= 1e3;
                                else if (matchText.includes("M") || matchText.includes("m"))
                                  num *= 1e6;
                                else if (matchText.includes("B") || matchText.includes("b"))
                                  num *= 1e9;
                                if (num > 0 && num < 1e8) {
                                  result.comment_count = Math.floor(num);
                                  break;
                                }
                              }
                            }
                          }
                          if ((_34 = content === null || content === void 0 ? void 0 : content.itemSectionRenderer) === null || _34 === void 0 ? void 0 : _34.contents) {
                            for (var _64 = 0, _65 = content.itemSectionRenderer.contents; _64 < _65.length; _64++) {
                              var item = _65[_64];
                              if (item === null || item === void 0 ? void 0 : item.commentsEntryPointHeaderRenderer) {
                                var commentHeader = item.commentsEntryPointHeaderRenderer;
                                var commentCount = ((_35 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _35 === void 0 ? void 0 : _35.simpleText) || ((_38 = (_37 = (_36 = commentHeader === null || commentHeader === void 0 ? void 0 : commentHeader.commentCount) === null || _36 === void 0 ? void 0 : _36.runs) === null || _37 === void 0 ? void 0 : _37[0]) === null || _38 === void 0 ? void 0 : _38.text);
                                if (commentCount && !result.comment_count) {
                                  var match = commentCount.match(/([\d.,]+[KMB]?)/);
                                  if (match) {
                                    var num = parseFloat(match[1].replace(/,/g, ""));
                                    var matchText = match[1];
                                    if (matchText.includes("K") || matchText.includes("k"))
                                      num *= 1e3;
                                    else if (matchText.includes("M") || matchText.includes("m"))
                                      num *= 1e6;
                                    else if (matchText.includes("B") || matchText.includes("b"))
                                      num *= 1e9;
                                    if (num > 0 && num < 1e8) {
                                      result.comment_count = Math.floor(num);
                                      break;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if (!result.comment_count) {
                          try {
                            var responseContext = ytData === null || ytData === void 0 ? void 0 : ytData.responseContext;
                            if (responseContext) {
                              var visitorData = responseContext === null || responseContext === void 0 ? void 0 : responseContext.visitorData;
                            }
                            var onResponseReceived = ytData === null || ytData === void 0 ? void 0 : ytData.onResponseReceivedActions;
                            if (onResponseReceived && Array.isArray(onResponseReceived)) {
                              for (var _66 = 0, onResponseReceived_1 = onResponseReceived; _66 < onResponseReceived_1.length; _66++) {
                                var action = onResponseReceived_1[_66];
                                if ((_39 = action === null || action === void 0 ? void 0 : action.reloadContinuationItemsCommand) === null || _39 === void 0 ? void 0 : _39.continuationItems) {
                                  var items = action.reloadContinuationItemsCommand.continuationItems;
                                  for (var _67 = 0, items_1 = items; _67 < items_1.length; _67++) {
                                    var item = items_1[_67];
                                    if ((_40 = item === null || item === void 0 ? void 0 : item.commentsEntryPointHeaderRenderer) === null || _40 === void 0 ? void 0 : _40.commentCount) {
                                      var commentCount = item.commentsEntryPointHeaderRenderer.commentCount.simpleText || ((_42 = (_41 = item.commentsEntryPointHeaderRenderer.commentCount.runs) === null || _41 === void 0 ? void 0 : _41[0]) === null || _42 === void 0 ? void 0 : _42.text);
                                      if (commentCount) {
                                        var match = commentCount.match(/([\d.,]+[KMB]?)/);
                                        if (match) {
                                          var num = parseFloat(match[1].replace(/,/g, ""));
                                          var matchText = match[1];
                                          if (matchText.includes("K") || matchText.includes("k"))
                                            num *= 1e3;
                                          else if (matchText.includes("M") || matchText.includes("m"))
                                            num *= 1e6;
                                          else if (matchText.includes("B") || matchText.includes("b"))
                                            num *= 1e9;
                                          if (num > 0 && num < 1e8) {
                                            result.comment_count = Math.floor(num);
                                            break;
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          } catch (e) {
                          }
                        }
                      }
                      if (result.isLive && !result.concurrentViewers) {
                        var videoPrimaryInfo = (_43 = contents === null || contents === void 0 ? void 0 : contents[0]) === null || _43 === void 0 ? void 0 : _43.videoPrimaryInfoRenderer;
                        if (videoPrimaryInfo) {
                          var viewCount = ((_46 = (_45 = (_44 = videoPrimaryInfo === null || videoPrimaryInfo === void 0 ? void 0 : videoPrimaryInfo.viewCount) === null || _44 === void 0 ? void 0 : _44.videoViewCountRenderer) === null || _45 === void 0 ? void 0 : _45.viewCount) === null || _46 === void 0 ? void 0 : _46.simpleText) || ((_48 = (_47 = videoPrimaryInfo === null || videoPrimaryInfo === void 0 ? void 0 : videoPrimaryInfo.viewCount) === null || _47 === void 0 ? void 0 : _47.videoViewCountRenderer) === null || _48 === void 0 ? void 0 : _48.originalViewCount);
                          if (viewCount && (viewCount.includes("watching") || viewCount.includes("viewers"))) {
                            var match = viewCount.match(/([\d.,]+[KMB]?)/);
                            if (match) {
                              var num = parseFloat(match[1].replace(/,/g, ""));
                              var matchText = match[1];
                              if (matchText.includes("K") || matchText.includes("k"))
                                num *= 1e3;
                              else if (matchText.includes("M") || matchText.includes("m"))
                                num *= 1e6;
                              if (num > 0 && num < 1e8) {
                                result.concurrentViewers = Math.floor(num);
                              }
                            }
                          }
                        }
                      }
                      var secondaryInfo = (_54 = (_53 = (_52 = (_51 = (_50 = (_49 = ytData === null || ytData === void 0 ? void 0 : ytData.contents) === null || _49 === void 0 ? void 0 : _49.twoColumnWatchNextResults) === null || _50 === void 0 ? void 0 : _50.results) === null || _51 === void 0 ? void 0 : _51.results) === null || _52 === void 0 ? void 0 : _52.contents) === null || _53 === void 0 ? void 0 : _53[1]) === null || _54 === void 0 ? void 0 : _54.videoSecondaryInfoRenderer;
                      var description = (_55 = secondaryInfo === null || secondaryInfo === void 0 ? void 0 : secondaryInfo.attributedDescription) === null || _55 === void 0 ? void 0 : _55.content;
                      if (description) {
                        result.description = description;
                        var mentions = description.match(/@[\w.]+/g);
                        if (mentions) {
                          result.mentions = mentions.map(function(m) {
                            return m.substring(1);
                          });
                        }
                      }
                      if (!result.mentions) {
                        var playerResponse = window.ytInitialPlayerResponse;
                        var shortDesc = (_56 = playerResponse === null || playerResponse === void 0 ? void 0 : playerResponse.videoDetails) === null || _56 === void 0 ? void 0 : _56.shortDescription;
                        if (shortDesc) {
                          var mentions = shortDesc.match(/@[\w.]+/g);
                          if (mentions) {
                            result.mentions = mentions.map(function(m) {
                              return m.substring(1);
                            });
                          }
                        }
                      }
                      var pageType = ytData === null || ytData === void 0 ? void 0 : ytData.page;
                      if (pageType === "shorts") {
                        result.isShort = true;
                      }
                      var engagementPanels = ytData === null || ytData === void 0 ? void 0 : ytData.engagementPanels;
                      if (engagementPanels) {
                        for (var _68 = 0, engagementPanels_1 = engagementPanels; _68 < engagementPanels_1.length; _68++) {
                          var panel = engagementPanels_1[_68];
                          if (((_57 = panel === null || panel === void 0 ? void 0 : panel.engagementPanelSectionListRenderer) === null || _57 === void 0 ? void 0 : _57.panelIdentifier) === "shorts-info-panel") {
                            result.isShort = true;
                            break;
                          }
                        }
                      }
                      if (result.isShort === void 0) {
                        result.isShort = false;
                      }
                      if (result.isUpcoming === void 0) {
                        result.isUpcoming = false;
                      }
                    }
                    return result;
                  })];
                case 4:
                  data = _a.sent();
                  return [2, data];
                case 5:
                  error_5 = _a.sent();
                  this.logger.log("Failed to extract YouTube-specific data: ".concat(error_5), "error");
                  return [2, null];
                case 6:
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
            var profileUrl, metadata, usernameMatch, nameSelectors, _i, nameSelectors_1, selector, name_1, followerSelectors, _a, followerSelectors_1, selector, followerText, bioSelectors, _b, bioSelectors_1, selector, bio, avatarSelectors, _c, avatarSelectors_1, selector, avatar, avatar100, avatarLarge, verifiedSelectors, _d, verifiedSelectors_1, selector, verified, verifiedInPage, e_1, error_1;
            return __generator(this, function(_e) {
              switch (_e.label) {
                case 0:
                  _e.trys.push([0, 29, , 30]);
                  this.logger.log("Extracting TikTok creator metadata...", "info");
                  return [4, this.getCreatorProfileUrl(videoUrl)];
                case 1:
                  profileUrl = _e.sent();
                  if (!profileUrl) {
                    this.logger.log("Could not determine TikTok profile URL", "warn");
                    return [2, null];
                  }
                  metadata = {
                    platform: "tiktok",
                    url: profileUrl,
                    extractedAt: Date.now()
                  };
                  usernameMatch = profileUrl.match(/@([^\/\?]+)/);
                  if (usernameMatch) {
                    metadata.creator_username = usernameMatch[1];
                    metadata.creator_profile_deep_link = profileUrl;
                  }
                  return [4, page.goto(profileUrl, { waitUntil: "domcontentloaded" })];
                case 2:
                  _e.sent();
                  return [4, this.delay(3e3)];
                case 3:
                  _e.sent();
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
                    if (avatar.includes("tiktokcdn.com")) {
                      avatar100 = avatar.replace(/~tplv-[^:]+:[^:]+:[^:]+/, "~tplv-tiktokx-cropcenter:100:100");
                      if (avatar100 !== avatar) {
                        metadata.creator_avatar_url_100 = avatar100;
                      }
                      avatarLarge = avatar.replace(/~tplv-[^:]+:[^:]+:[^:]+/, "~tplv-tiktokx-cropcenter:720:720");
                      if (avatarLarge !== avatar) {
                        metadata.creator_avatar_large_url = avatarLarge;
                      }
                    }
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
                    '[aria-label*="Verified"]',
                    '[title*="Verified"]',
                    'svg[data-e2e="verified-icon"]',
                    '[class*="verified"]',
                    '[class*="Verified"]'
                  ];
                  metadata.creator_verified = false;
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
                    this.logger.log("Found verified badge with selector: ".concat(selector), "debug");
                    return [3, 24];
                  }
                  _e.label = 23;
                case 23:
                  _d++;
                  return [3, 20];
                case 24:
                  if (!!metadata.creator_verified) return [3, 28];
                  _e.label = 25;
                case 25:
                  _e.trys.push([25, 27, , 28]);
                  return [4, page.evaluate(function() {
                    var elements = document.querySelectorAll("*");
                    for (var _i2 = 0, elements_1 = elements; _i2 < elements_1.length; _i2++) {
                      var el = elements_1[_i2];
                      var ariaLabel = el.getAttribute("aria-label");
                      var title = el.getAttribute("title");
                      var className = el.className || "";
                      if (ariaLabel && ariaLabel.toLowerCase().includes("verified") || title && title.toLowerCase().includes("verified") || className && className.toLowerCase().includes("verified")) {
                        return true;
                      }
                    }
                    return false;
                  })];
                case 26:
                  verifiedInPage = _e.sent();
                  if (verifiedInPage) {
                    metadata.creator_verified = true;
                    this.logger.log("Found verified badge via page evaluation", "debug");
                  }
                  return [3, 28];
                case 27:
                  e_1 = _e.sent();
                  this.logger.log("Error checking verified status: ".concat(e_1), "debug");
                  return [3, 28];
                case 28:
                  this.logger.log("Successfully extracted TikTok creator metadata", "info");
                  return [2, metadata];
                case 29:
                  error_1 = _e.sent();
                  this.logger.log("Failed to extract TikTok metadata: ".concat(error_1), "error");
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
        TikTokScraper3.prototype.extractVideoMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var apiResponses_1, allApiResponses_1, responseHandler, e_2, metadata, videoIdMatch, videoId, embeddedData, domData, creatorFields, error_2;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 17, , 18]);
                  this.logger.log("Extracting TikTok video metadata...", "info");
                  apiResponses_1 = [];
                  allApiResponses_1 = [];
                  responseHandler = function(response) {
                    return __awaiter(_this, void 0, void 0, function() {
                      var url, json, hasVideoData, dataKeys, e_3;
                      return __generator(this, function(_a2) {
                        switch (_a2.label) {
                          case 0:
                            url = response.url();
                            if (!(url.includes("/api/") || url.includes("/aweme/") || url.includes("/post/") || url.includes("/tiktok/"))) return [3, 4];
                            _a2.label = 1;
                          case 1:
                            _a2.trys.push([1, 3, , 4]);
                            return [4, response.json()];
                          case 2:
                            json = _a2.sent();
                            allApiResponses_1.push({ url, data: json });
                            hasVideoData = url.includes("item_list") || url.includes("itemList") || url.includes("/post/item_list") || url.includes("/api/post/item_list") || url.includes("related/item_list") || url.includes("video") || url.includes("post") || url.includes("item/detail") || url.includes("aweme/detail") || url.includes("item/info") || url.includes("feed") || url.includes("aweme/v1") || url.includes("aweme/v2") || url.includes("item") || (json.itemInfo || json.itemList || json.items || json.aweme_detail || json.item || json.data);
                            if (hasVideoData) {
                              apiResponses_1.push({ url, data: json });
                              this.logger.log("Found potential video data API: ".concat(url.substring(0, 150)), "debug");
                              dataKeys = Object.keys(json).slice(0, 10);
                              this.logger.log("  API response keys: ".concat(dataKeys.join(", ")), "debug");
                              if (json.itemInfo || json.itemList || json.items || json.aweme_detail || json.item) {
                                this.logger.log("  Contains video data structure!", "info");
                              }
                            }
                            return [3, 4];
                          case 3:
                            e_3 = _a2.sent();
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
                  page.on("response", responseHandler);
                  _a.label = 1;
                case 1:
                  _a.trys.push([1, , 13, 14]);
                  return [4, page.goto(videoUrl, { waitUntil: "networkidle" })];
                case 2:
                  _a.sent();
                  return [4, Promise.race([
                    page.waitForResponse(function(response) {
                      var url = response.url();
                      return (url.includes("/api/") || url.includes("/aweme/") || url.includes("/tiktok/")) && (url.includes("item") || url.includes("video") || url.includes("post") || url.includes("feed") || url.includes("aweme/v"));
                    }, { timeout: 15e3 }).catch(function() {
                      return null;
                    }),
                    new Promise(function(resolve) {
                      return setTimeout(resolve, 15e3);
                    })
                  ])];
                case 3:
                  _a.sent();
                  return [4, this.delay(5e3)];
                case 4:
                  _a.sent();
                  _a.label = 5;
                case 5:
                  _a.trys.push([5, 7, , 8]);
                  return [4, page.waitForSelector('[data-e2e="browse-video-desc"], [data-e2e="video-desc"], [class*="desc"], h1, [class*="Description"]', { timeout: 5e3 })];
                case 6:
                  _a.sent();
                  return [3, 8];
                case 7:
                  e_2 = _a.sent();
                  this.logger.log("Video description element not found, continuing anyway", "debug");
                  return [3, 8];
                case 8:
                  return [4, page.evaluate(function() {
                    window.scrollTo(0, document.body.scrollHeight / 2);
                  })];
                case 9:
                  _a.sent();
                  return [4, this.delay(2e3)];
                case 10:
                  _a.sent();
                  return [4, page.evaluate(function() {
                    window.scrollTo(0, 0);
                  })];
                case 11:
                  _a.sent();
                  return [4, this.delay(1e3)];
                case 12:
                  _a.sent();
                  return [3, 14];
                case 13:
                  page.off("response", responseHandler);
                  return [
                    7
                    /*endfinally*/
                  ];
                case 14:
                  this.logger.log("Total API responses captured: ".concat(allApiResponses_1.length), "debug");
                  metadata = {
                    platform: "tiktok",
                    url: videoUrl,
                    extractedAt: Date.now()
                  };
                  videoIdMatch = videoUrl.match(/\/video\/(\d+)/);
                  if (videoIdMatch) {
                    metadata.video_id = videoIdMatch[1];
                  }
                  videoId = videoIdMatch === null || videoIdMatch === void 0 ? void 0 : videoIdMatch[1];
                  return [4, this.extractTikTokEmbeddedData(page, videoId, apiResponses_1)];
                case 15:
                  embeddedData = _a.sent();
                  if (embeddedData) {
                    this.logger.log("Extracted ".concat(Object.keys(embeddedData).length, " fields from embedded data"), "debug");
                    this.logger.log("Embedded data keys: ".concat(Object.keys(embeddedData).join(", ")), "debug");
                    if (embeddedData.embed_link)
                      metadata.embed_link = embeddedData.embed_link;
                    if (embeddedData.hashtags) {
                      metadata.hashtags = embeddedData.hashtags;
                      this.logger.log("Merged hashtags: ".concat(Array.isArray(embeddedData.hashtags) ? embeddedData.hashtags.join(", ") : embeddedData.hashtags), "info");
                    }
                    if (embeddedData.effect_ids) {
                      metadata.effect_ids = embeddedData.effect_ids;
                      this.logger.log("Merged effect_ids: ".concat(Array.isArray(embeddedData.effect_ids) ? embeddedData.effect_ids.join(", ") : embeddedData.effect_ids), "info");
                    }
                    if (embeddedData.playlist_id)
                      metadata.playlist_id = embeddedData.playlist_id;
                    if (embeddedData.voice_to_text)
                      metadata.voice_to_text = embeddedData.voice_to_text;
                    if (embeddedData.region_code)
                      metadata.region_code = embeddedData.region_code;
                    if (embeddedData.music_id)
                      metadata.music_id = embeddedData.music_id;
                    if (embeddedData.caption)
                      metadata.caption = embeddedData.caption;
                    if (embeddedData.timestamp !== void 0)
                      metadata.timestamp = embeddedData.timestamp;
                    if (embeddedData.like_count !== void 0)
                      metadata.like_count = embeddedData.like_count;
                    if (embeddedData.comment_count !== void 0)
                      metadata.comment_count = embeddedData.comment_count;
                    if (embeddedData.view_count !== void 0)
                      metadata.view_count = embeddedData.view_count;
                    if (embeddedData.play_count !== void 0)
                      metadata.play_count = embeddedData.play_count;
                    if (embeddedData.share_count !== void 0)
                      metadata.share_count = embeddedData.share_count;
                    if (embeddedData.duration !== void 0)
                      metadata.duration = embeddedData.duration;
                    if (embeddedData.music_title)
                      metadata.music_title = embeddedData.music_title;
                    if (embeddedData.music_artist)
                      metadata.music_artist = embeddedData.music_artist;
                    if (embeddedData.mentions)
                      metadata.mentions = embeddedData.mentions;
                    if (embeddedData.thumbnails)
                      metadata.thumbnails = embeddedData.thumbnails;
                    if (embeddedData.save_count !== void 0)
                      metadata.save_count = embeddedData.save_count;
                    if (embeddedData.location)
                      metadata.location = embeddedData.location;
                    if (embeddedData.location_latitude !== void 0)
                      metadata.location_latitude = embeddedData.location_latitude;
                    if (embeddedData.location_longitude !== void 0)
                      metadata.location_longitude = embeddedData.location_longitude;
                    if (embeddedData.is_video !== void 0)
                      metadata.is_video = embeddedData.is_video;
                    if (embeddedData.dimension)
                      metadata.dimension = embeddedData.dimension;
                  } else {
                    this.logger.log("No embedded data found", "debug");
                  }
                  if (!metadata.embed_link && (videoIdMatch === null || videoIdMatch === void 0 ? void 0 : videoIdMatch[1])) {
                    metadata.embed_link = "https://www.tiktok.com/embed/v2/".concat(videoIdMatch[1]);
                  }
                  return [4, this.extractTikTokDOMData(page)];
                case 16:
                  domData = _a.sent();
                  if (domData) {
                    this.logger.log("Extracted ".concat(Object.keys(domData).length, " fields from DOM"), "debug");
                    this.logger.log("DOM data keys: ".concat(Object.keys(domData).join(", ")), "debug");
                    if (domData.embed_link && !metadata.embed_link)
                      metadata.embed_link = domData.embed_link;
                    if (domData.hashtags && !metadata.hashtags) {
                      metadata.hashtags = domData.hashtags;
                      this.logger.log("Found ".concat(domData.hashtags.length, " hashtags in DOM"), "info");
                    }
                    if (domData.music_id && !metadata.music_id) {
                      metadata.music_id = domData.music_id;
                      this.logger.log("Found music_id in DOM: ".concat(domData.music_id), "info");
                    }
                    if (domData.caption && !metadata.caption) {
                      metadata.caption = domData.caption;
                      this.logger.log("Found caption in DOM (".concat(domData.caption.length, " chars)"), "info");
                    }
                  } else {
                    this.logger.log("No data extracted from DOM", "debug");
                  }
                  this.logger.log("Final metadata keys: ".concat(Object.keys(metadata).join(", ")), "debug");
                  if (metadata.effect_ids) {
                    this.logger.log("Final effect_ids: ".concat(Array.isArray(metadata.effect_ids) ? metadata.effect_ids.join(", ") : metadata.effect_ids), "info");
                  }
                  if (metadata.hashtags) {
                    this.logger.log("Final hashtags: ".concat(Array.isArray(metadata.hashtags) ? metadata.hashtags.join(", ") : metadata.hashtags), "info");
                  }
                  creatorFields = {};
                  if (embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_open_id)
                    creatorFields.creator_open_id = embeddedData.creator_open_id;
                  if (embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_union_id)
                    creatorFields.creator_union_id = embeddedData.creator_union_id;
                  if (embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_avatar_url_100)
                    creatorFields.creator_avatar_url_100 = embeddedData.creator_avatar_url_100;
                  if (embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_avatar_large_url)
                    creatorFields.creator_avatar_large_url = embeddedData.creator_avatar_large_url;
                  if (embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_profile_deep_link)
                    creatorFields.creator_profile_deep_link = embeddedData.creator_profile_deep_link;
                  if ((embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_following_count) !== void 0)
                    creatorFields.creator_following_count = embeddedData.creator_following_count;
                  if ((embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_likes_count) !== void 0)
                    creatorFields.creator_likes_count = embeddedData.creator_likes_count;
                  if ((embeddedData === null || embeddedData === void 0 ? void 0 : embeddedData.creator_video_count) !== void 0)
                    creatorFields.creator_video_count = embeddedData.creator_video_count;
                  if (Object.keys(creatorFields).length > 0) {
                    metadata.creator_fields = creatorFields;
                    this.logger.log("Extracted ".concat(Object.keys(creatorFields).length, " creator fields from video API"), "info");
                  }
                  this.logger.log("Successfully extracted TikTok video metadata", "info");
                  return [2, metadata];
                case 17:
                  error_2 = _a.sent();
                  this.logger.log("Failed to extract TikTok video metadata: ".concat(error_2), "error");
                  return [2, null];
                case 18:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        TikTokScraper3.prototype.extractTikTokEmbeddedData = function(page, videoId, apiResponses) {
          return __awaiter(this, void 0, void 0, function() {
            var evalCode, response_1, _i, apiResponses_2, apiResp, dataKeys, extractVideoData, items, video, _a, _b, item, video, keywords, windowData, extractedKeys, error_3;
            var _this = this;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            return __generator(this, function(_p) {
              switch (_p.label) {
                case 0:
                  _p.trys.push([0, 3, , 4]);
                  evalCode = `
                (function(vidId) {
                    var result = {};
                    var debugInfo = {
                        foundSIGI: false,
                        foundVideo: false,
                        videoKeys: [],
                        sigiTopLevelKeys: [],
                        itemModuleKeys: []
                    };

                    function findVideoInItemModule(itemModule, targetId) {
                        if (!itemModule) return null;
                        if (targetId) {
                            return itemModule[targetId] || null;
                        }
                        var entries = Object.values(itemModule);
                        if (entries.length > 0) {
                            return entries[0];
                        }
                        return null;
                    }

                    function extractFromSIGI(sigiState, vidId, result, debugInfo) {
                        if (!sigiState) return;
                        debugInfo.foundSIGI = true;
                        debugInfo.sigiTopLevelKeys = Object.keys(sigiState).slice(0, 20);
                        
                        var itemModule = sigiState.ItemModule || sigiState.itemModule;
                        if (itemModule) {
                            debugInfo.itemModuleKeys = Object.keys(itemModule).slice(0, 10);
                        }
                        
                        var video = findVideoInItemModule(itemModule, vidId);
                        
                        if (video) {
                            debugInfo.foundVideo = true;
                            debugInfo.videoKeys = Object.keys(video).slice(0, 50);
                            
                            if (video.embedLink || video.embed_link) {
                                result.embed_link = video.embedLink || video.embed_link;
                            } else if (vidId) {
                                result.embed_link = "https://www.tiktok.com/embed/v2/" + vidId;
                            }

                            if (video.music) {
                                if (video.music.id) {
                                    result.music_id = String(video.music.id);
                                } else if (video.music.musicId) {
                                    result.music_id = String(video.music.musicId);
                                }
                            }

                            if (video.effectStickers && Array.isArray(video.effectStickers)) {
                                result.effect_ids = video.effectStickers
                                    .map(function(e) { return e.id || e.effectId || e.effect_id; })
                                    .filter(function(id) { return id != null; })
                                    .map(function(id) { return String(id); });
                            }

                            if (video.challengeList && Array.isArray(video.challengeList)) {
                                result.hashtags = video.challengeList
                                    .map(function(c) { return c.title || c.challengeName || c.name; })
                                    .filter(function(val) { return val != null; });
                            } else if (video.textExtra && Array.isArray(video.textExtra)) {
                                var hashtags = video.textExtra
                                    .filter(function(item) { return item.hashtagName || item.hashtag; })
                                    .map(function(item) { return item.hashtagName || item.hashtag; });
                                if (hashtags.length > 0) {
                                    result.hashtags = hashtags;
                                }
                            }

                            if (video.desc) {
                                var descHashtags = (video.desc.match(/#[\\w]+/g) || [])
                                    .map(function(h) { return h.substring(1); });
                                if (descHashtags.length > 0) {
                                    result.hashtags = (result.hashtags || []).concat(descHashtags);
                                    result.hashtags = result.hashtags.filter(function(v, i, a) { return a.indexOf(v) === i; });
                                }
                            }

                            if (video.playlistId) {
                                result.playlist_id = String(video.playlistId);
                            }

                            if (video.regionCode) {
                                result.region_code = video.regionCode;
                            }

                            if (video.transcription || video.voiceToText || video.voice_to_text) {
                                result.voice_to_text = video.transcription || video.voiceToText || video.voice_to_text;
                            }
                        }
                    }

                    var scripts = document.querySelectorAll('script');
                    debugInfo.scriptCount = scripts.length;
                    var scriptIds = [];
                    var scriptTypes = [];
                    
                    for (var i = 0; i < scripts.length; i++) {
                        var script = scripts[i];
                        var id = script.id || "";
                        var type = script.getAttribute("type") || "";
                        if (id) scriptIds.push(id);
                        if (type) scriptTypes.push(type);
                    }
                    debugInfo.scriptIds = scriptIds.slice(0, 20);
                    debugInfo.scriptTypes = scriptTypes.slice(0, 10);
                    
                    for (var i = 0; i < scripts.length; i++) {
                        var script = scripts[i];
                        try {
                            var text = script.textContent || "";
                            var id = script.id || "";
                            var type = script.getAttribute("type") || "";

                            if (id.indexOf("SIGI_STATE") !== -1 || text.indexOf("SIGI_STATE") !== -1 || text.indexOf("ItemModule") !== -1) {
                                var sigiState = null;
                                
                                if (id.indexOf("SIGI_STATE") !== -1) {
                                    try {
                                        sigiState = JSON.parse(text);
                                    } catch (e) {
                                        var match = text.match(/SIGI_STATE\\s*=\\s*({.+?});/s);
                                        if (match) {
                                            sigiState = JSON.parse(match[1]);
                                        }
                                    }
                                } else {
                                    var match1 = text.match(/SIGI_STATE\\s*=\\s*({.+?});/s);
                                    var match2 = text.match(/window\\[['"]SIGI_STATE['"]\\]\\s*=\\s*({.+?});/s);
                                    var match3 = text.match(/<script[^>]*id=['"]SIGI_STATE['"][^>]*>([\\s\\S]*?)<\\/script>/);
                                    
                                    if (match1) {
                                        sigiState = JSON.parse(match1[1]);
                                    } else if (match2) {
                                        sigiState = JSON.parse(match2[1]);
                                    } else if (match3) {
                                        sigiState = JSON.parse(match3[1]);
                                    } else if (text.indexOf("ItemModule") !== -1 && (type === "application/json" || id === "")) {
                                        try {
                                            var jsonMatch = text.match(/\\{[\\s\\S]*"ItemModule"[\\s\\S]*\\}/);
                                            if (jsonMatch) {
                                                sigiState = JSON.parse(jsonMatch[0]);
                                            }
                                        } catch (e) {
                                            try {
                                                sigiState = JSON.parse(text);
                                            } catch (e2) {
                                                var lines = text.split("\\n");
                                                for (var j = 0; j < lines.length; j++) {
                                                    if (lines[j].indexOf("ItemModule") !== -1) {
                                                        try {
                                                            var lineMatch = lines[j].match(/\\{[\\s\\S]*\\}/);
                                                            if (lineMatch) {
                                                                sigiState = JSON.parse(lineMatch[0]);
                                                                break;
                                                            }
                                                        } catch (e3) {}
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                if (sigiState) {
                                    extractFromSIGI(sigiState, vidId, result, debugInfo);
                                    break;
                                }
                            }

                            if (id === "__UNIVERSAL_DATA_FOR_REHYDRATION__" || text.indexOf("__UNIVERSAL_DATA_FOR_REHYDRATION__") !== -1) {
                                try {
                                    var parsed = null;
                                    
                                    if (id === "__UNIVERSAL_DATA_FOR_REHYDRATION__") {
                                        try {
                                            parsed = JSON.parse(text);
                                        } catch (e) {
                                            var match = text.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__\\s*=\\s*({.+?});/s);
                                            if (match) {
                                                parsed = JSON.parse(match[1]);
                                            }
                                        }
                                    } else {
                                        var match1 = text.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__\\s*=\\s*({.+?});/s);
                                        var match2 = text.match(/window\\.__UNIVERSAL_DATA_FOR_REHYDRATION__\\s*=\\s*({.+?});/s);
                                        var match3 = text.match(/\\{.*"defaultScope".*\\}/s);
                                        
                                        if (match1) {
                                            parsed = JSON.parse(match1[1]);
                                        } else if (match2) {
                                            parsed = JSON.parse(match2[1]);
                                        } else if (match3) {
                                            parsed = JSON.parse(match3[0]);
                                        } else {
                                            try {
                                                parsed = JSON.parse(text);
                                            } catch (e) {}
                                        }
                                    }
                                    
                                    if (parsed) {
                                        var state = parsed.defaultScope || parsed.__UNIVERSAL_DATA_FOR_REHYDRATION__ || parsed;
                                        if (state && (state.ItemModule || state.itemModule || state.VideoModule || state.videoModule)) {
                                            extractFromSIGI(state, vidId, result, debugInfo);
                                        }
                                    }
                                } catch (e) {
                                    // Ignore parsing errors
                                }
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                    
                    if (!debugInfo.foundSIGI) {
                        debugInfo.searchText = "Searched " + scripts.length + " scripts, found ItemModule in: " + 
                            Array.from(scripts).filter(function(s) { 
                                return (s.textContent || "").indexOf("ItemModule") !== -1; 
                            }).length;
                    }

                    if (window.location.href.indexOf("embed") !== -1) {
                        var embedUrl = window.location.href;
                        if (embedUrl.indexOf("/embed/") !== -1) {
                            result.embed_link = embedUrl;
                        }
                    }

                    if (vidId && !result.embed_link) {
                        result.embed_link = "https://www.tiktok.com/embed/v2/" + vidId;
                    }

                    if (window.__UNIVERSAL_DATA_FOR_REHYDRATION__) {
                        try {
                            var universalData = window.__UNIVERSAL_DATA_FOR_REHYDRATION__;
                            var state = universalData.defaultScope || universalData;
                            if (state && (state.ItemModule || state.itemModule || state.VideoModule || state.videoModule)) {
                                extractFromSIGI(state, vidId, result, debugInfo);
                            }
                        } catch (e) {
                            debugInfo.windowAccessError = String(e);
                        }
                    }

                    var metaTags = document.querySelectorAll('meta[property], meta[name]');
                    for (var i = 0; i < metaTags.length; i++) {
                        var meta = metaTags[i];
                        var property = meta.getAttribute("property") || meta.getAttribute("name") || "";
                        var content = meta.getAttribute("content") || "";
                        
                        if (property.indexOf("music") !== -1 && content && !result.music_id) {
                            var musicMatch = content.match(/\\/(\\d+)/);
                            if (musicMatch) {
                                result.music_id = musicMatch[1];
                            }
                        }
                    }

                    var jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
                    for (var i = 0; i < jsonLdScripts.length; i++) {
                        try {
                            var jsonLd = JSON.parse(jsonLdScripts[i].textContent || "{}");
                            if (jsonLd["@type"] === "VideoObject" || jsonLd["@type"] === "SocialMediaPosting") {
                                if (jsonLd.description && !result.hashtags) {
                                    var descHashtags = (jsonLd.description.match(/#[\\w]+/g) || [])
                                        .map(function(h) { return h.substring(1); });
                                    if (descHashtags.length > 0) {
                                        result.hashtags = descHashtags;
                                    }
                                }
                            }
                        } catch (e) {
                            continue;
                        }
                    }

                    var descSelectors = [
                        '[data-e2e="browse-video-desc"]',
                        '[data-e2e="video-desc"]',
                        'h1[data-e2e="browse-video-desc"]',
                        '[class*="desc"]',
                        '[class*="Description"]',
                        'span[class*="desc"]',
                        'div[class*="desc"]'
                    ];
                    
                    var descElement = null;
                    for (var s = 0; s < descSelectors.length; s++) {
                        descElement = document.querySelector(descSelectors[s]);
                        if (descElement) break;
                    }
                    
                    if (!descElement) {
                        var allSpans = document.querySelectorAll('span');
                        for (var s = 0; s < Math.min(allSpans.length, 200); s++) {
                            var text = allSpans[s].textContent || "";
                            if (text.indexOf("#") !== -1 && text.length < 500 && text.length > 5) {
                                descElement = allSpans[s];
                                break;
                            }
                        }
                    }
                    
                    if (!descElement) {
                        var allDivs = document.querySelectorAll('div');
                        for (var d = 0; d < Math.min(allDivs.length, 200); d++) {
                            var text = allDivs[d].textContent || "";
                            if (text.indexOf("#") !== -1 && text.length < 500 && text.length > 5) {
                                var parent = allDivs[d].parentElement;
                                if (parent && parent.textContent && parent.textContent.length < 1000) {
                                    descElement = parent;
                                } else {
                                    descElement = allDivs[d];
                                }
                                break;
                            }
                        }
                    }
                    
                    if (!descElement) {
                        var bodyText = document.body.textContent || "";
                        var hashtagMatches = bodyText.match(/#[\\w]+/g);
                        if (hashtagMatches && hashtagMatches.length > 0) {
                            var uniqueHashtags = Array.from(new Set(hashtagMatches.map(function(h) { return h.substring(1); })));
                            var genericTags = ["tiktok", "fyp", "foryou", "foryoupage", "viral", "trending", "trend", "animals", "animalcare", "beauty", "comedyvideos", "dance", "food", "gaming", "sports", "entertainment", "funny", "comedy", "music", "love", "like", "follow", "share", "comment"];
                            uniqueHashtags = uniqueHashtags.filter(function(tag) {
                                return genericTags.indexOf(tag.toLowerCase()) === -1;
                            });
                            if (uniqueHashtags.length > 0 && uniqueHashtags.length < 50) {
                                result.hashtags = uniqueHashtags;
                                debugInfo.foundHashtagsInDOM = true;
                                debugInfo.descText = "Found in body text (filtered)";
                            }
                        }
                    }
                    
                    if (descElement && !result.hashtags) {
                        var descText = descElement.textContent || "";
                        var descHashtags = (descText.match(/#[\\w]+/g) || [])
                            .map(function(h) { return h.substring(1); });
                        if (descHashtags.length > 0) {
                            result.hashtags = descHashtags;
                            debugInfo.foundHashtagsInDOM = true;
                            debugInfo.descText = descText.substring(0, 100);
                        }
                    }
                    
                    debugInfo.descElementFound = descElement !== null;

                    return {
                        data: Object.keys(result).length > 0 ? result : null,
                        debug: debugInfo
                    };
                })
            `;
                  return [4, page.evaluate(evalCode + "(".concat(JSON.stringify(videoId), ")"))];
                case 1:
                  response_1 = _p.sent();
                  if (!response_1) {
                    response_1 = { data: {} };
                  } else if (!response_1.data) {
                    response_1.data = {};
                  }
                  if (apiResponses && apiResponses.length > 0) {
                    this.logger.log("Found ".concat(apiResponses.length, " potential video data API responses"), "debug");
                    for (_i = 0, apiResponses_2 = apiResponses; _i < apiResponses_2.length; _i++) {
                      apiResp = apiResponses_2[_i];
                      this.logger.log("Processing API URL: ".concat(apiResp.url.substring(0, 150)), "debug");
                      dataKeys = apiResp.data ? Object.keys(apiResp.data).slice(0, 15) : [];
                      this.logger.log("API data keys: ".concat(dataKeys.join(", ")), "debug");
                      extractVideoData = function(videoData, source) {
                        var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
                        if (!videoData || !(response_1 === null || response_1 === void 0 ? void 0 : response_1.data))
                          return;
                        var videoKeys = Object.keys(videoData);
                        _this.logger.log("".concat(source, " video keys (first 50): ").concat(videoKeys.slice(0, 50).join(", ")), "debug");
                        if (videoKeys.length > 50) {
                          _this.logger.log("".concat(source, " video has ").concat(videoKeys.length, " total keys (showing first 50)"), "debug");
                        }
                        var hasEffectStickers = videoKeys.includes("effectStickers");
                        if (hasEffectStickers) {
                          _this.logger.log("".concat(source, " has effectStickers key"), "debug");
                        }
                        if (videoData.effectStickers) {
                          _this.logger.log("".concat(source, " effectStickers type: ").concat(Array.isArray(videoData.effectStickers) ? "array" : typeof videoData.effectStickers, ", length: ").concat(Array.isArray(videoData.effectStickers) ? videoData.effectStickers.length : "N/A"), "debug");
                          if (Array.isArray(videoData.effectStickers) && videoData.effectStickers.length > 0) {
                            _this.logger.log("".concat(source, " effectStickers sample: ").concat(JSON.stringify(videoData.effectStickers[0])), "debug");
                          }
                        } else {
                          _this.logger.log("".concat(source, " no effectStickers found (checked ").concat(videoKeys.length, " keys)"), "debug");
                        }
                        if (videoData.desc) {
                          _this.logger.log("".concat(source, " desc preview: ").concat(String(videoData.desc).substring(0, 100)), "debug");
                        }
                        if (videoData.textExtra) {
                          _this.logger.log("".concat(source, " textExtra type: ").concat(Array.isArray(videoData.textExtra) ? "array" : typeof videoData.textExtra, ", length: ").concat(Array.isArray(videoData.textExtra) ? videoData.textExtra.length : "N/A"), "debug");
                        }
                        if (videoData.challengeList) {
                          _this.logger.log("".concat(source, " challengeList type: ").concat(Array.isArray(videoData.challengeList) ? "array" : typeof videoData.challengeList, ", length: ").concat(Array.isArray(videoData.challengeList) ? videoData.challengeList.length : "N/A"), "debug");
                        }
                        if (!response_1.data.caption && videoData.desc) {
                          response_1.data.caption = String(videoData.desc);
                          _this.logger.log("Extracted caption from ".concat(source, " (").concat(response_1.data.caption.length, " chars)"), "info");
                        }
                        if (!response_1.data.timestamp && videoData.createTime) {
                          var createTime = typeof videoData.createTime === "number" ? videoData.createTime : parseInt(String(videoData.createTime));
                          if (!isNaN(createTime)) {
                            response_1.data.timestamp = createTime;
                            _this.logger.log("Extracted timestamp from ".concat(source, ": ").concat(createTime), "info");
                          }
                        }
                        if (videoData.stats) {
                          if (!response_1.data.like_count && (videoData.stats.diggCount !== void 0 || videoData.stats.likeCount !== void 0)) {
                            response_1.data.like_count = videoData.stats.diggCount || videoData.stats.likeCount || 0;
                            _this.logger.log("Extracted like_count from ".concat(source, ": ").concat(response_1.data.like_count), "info");
                          }
                          if (!response_1.data.comment_count && videoData.stats.commentCount !== void 0) {
                            response_1.data.comment_count = videoData.stats.commentCount || 0;
                            _this.logger.log("Extracted comment_count from ".concat(source, ": ").concat(response_1.data.comment_count), "info");
                          }
                          if (!response_1.data.view_count && (videoData.stats.playCount !== void 0 || videoData.stats.viewCount !== void 0)) {
                            response_1.data.view_count = videoData.stats.playCount || videoData.stats.viewCount || 0;
                            _this.logger.log("Extracted view_count from ".concat(source, ": ").concat(response_1.data.view_count), "info");
                          }
                          if (!response_1.data.play_count && videoData.stats.playCount !== void 0) {
                            response_1.data.play_count = videoData.stats.playCount || 0;
                            _this.logger.log("Extracted play_count from ".concat(source, ": ").concat(response_1.data.play_count), "info");
                          }
                          if (!response_1.data.share_count && videoData.stats.shareCount !== void 0) {
                            response_1.data.share_count = videoData.stats.shareCount || 0;
                            _this.logger.log("Extracted share_count from ".concat(source, ": ").concat(response_1.data.share_count), "info");
                          }
                        }
                        if (videoData.statsV2) {
                          if (!response_1.data.like_count && (videoData.statsV2.diggCount !== void 0 || videoData.statsV2.likeCount !== void 0)) {
                            response_1.data.like_count = videoData.statsV2.diggCount || videoData.statsV2.likeCount || 0;
                            _this.logger.log("Extracted like_count from ".concat(source, " statsV2: ").concat(response_1.data.like_count), "info");
                          }
                          if (!response_1.data.comment_count && videoData.statsV2.commentCount !== void 0) {
                            response_1.data.comment_count = videoData.statsV2.commentCount || 0;
                            _this.logger.log("Extracted comment_count from ".concat(source, " statsV2: ").concat(response_1.data.comment_count), "info");
                          }
                          if (!response_1.data.view_count && (videoData.statsV2.playCount !== void 0 || videoData.statsV2.viewCount !== void 0)) {
                            response_1.data.view_count = videoData.statsV2.playCount || videoData.statsV2.viewCount || 0;
                            _this.logger.log("Extracted view_count from ".concat(source, " statsV2: ").concat(response_1.data.view_count), "info");
                          }
                          if (!response_1.data.share_count && videoData.statsV2.shareCount !== void 0) {
                            response_1.data.share_count = videoData.statsV2.shareCount || 0;
                            _this.logger.log("Extracted share_count from ".concat(source, " statsV2: ").concat(response_1.data.share_count), "info");
                          }
                        }
                        if (!response_1.data.duration && ((_a2 = videoData.video) === null || _a2 === void 0 ? void 0 : _a2.duration)) {
                          var duration = typeof videoData.video.duration === "number" ? videoData.video.duration : parseInt(String(videoData.video.duration));
                          if (!isNaN(duration) && duration > 0) {
                            response_1.data.duration = duration;
                            _this.logger.log("Extracted duration from ".concat(source, ": ").concat(duration, "s"), "info");
                          }
                        }
                        if (!response_1.data.music_title && ((_b2 = videoData.music) === null || _b2 === void 0 ? void 0 : _b2.title)) {
                          response_1.data.music_title = String(videoData.music.title);
                          _this.logger.log("Extracted music_title from ".concat(source, ": ").concat(response_1.data.music_title), "info");
                        }
                        if (!response_1.data.music_artist && ((_c2 = videoData.music) === null || _c2 === void 0 ? void 0 : _c2.authorName)) {
                          response_1.data.music_artist = String(videoData.music.authorName);
                          _this.logger.log("Extracted music_artist from ".concat(source, ": ").concat(response_1.data.music_artist), "info");
                        }
                        if (!response_1.data.music_artist && ((_d2 = videoData.music) === null || _d2 === void 0 ? void 0 : _d2.author)) {
                          response_1.data.music_artist = String(videoData.music.author);
                          _this.logger.log("Extracted music_artist from ".concat(source, " (author): ").concat(response_1.data.music_artist), "info");
                        }
                        if (!response_1.data.hashtags && videoData.desc) {
                          var descText = String(videoData.desc);
                          var hashtags = (descText.match(/#[\w\u4e00-\u9fff]+/g) || []).map(function(h) {
                            return h.substring(1);
                          });
                          if (hashtags.length > 0) {
                            var genericTags_1 = ["fyp", "foryou", "foryoupage", "viral", "trending", "trend", "fyp\u30B7", "fypage", "fy"];
                            var filtered = hashtags.filter(function(tag) {
                              return !genericTags_1.includes(tag.toLowerCase());
                            });
                            if (filtered.length > 0) {
                              response_1.data.hashtags = filtered;
                              _this.logger.log("Extracted hashtags from ".concat(source, ": ").concat(filtered.join(", ")), "info");
                            } else if (hashtags.length > 0) {
                              response_1.data.hashtags = hashtags;
                              _this.logger.log("Extracted hashtags from ".concat(source, " (all generic): ").concat(hashtags.join(", ")), "debug");
                            }
                          }
                        }
                        if (!response_1.data.hashtags && videoData.textExtra && Array.isArray(videoData.textExtra)) {
                          var hashtags = videoData.textExtra.filter(function(item2) {
                            return item2.hashtagName || item2.hashtag;
                          }).map(function(item2) {
                            return item2.hashtagName || item2.hashtag;
                          }).filter(Boolean);
                          if (hashtags.length > 0) {
                            response_1.data.hashtags = hashtags;
                            _this.logger.log("Extracted hashtags from ".concat(source, " textExtra: ").concat(hashtags.join(", ")), "info");
                          }
                        }
                        if (!response_1.data.hashtags && videoData.challengeList && Array.isArray(videoData.challengeList)) {
                          var hashtags = videoData.challengeList.map(function(c) {
                            return c.title || c.challengeName || c.name;
                          }).filter(Boolean);
                          if (hashtags.length > 0) {
                            response_1.data.hashtags = hashtags;
                            _this.logger.log("Extracted hashtags from ".concat(source, " challengeList: ").concat(hashtags.join(", ")), "info");
                          }
                        }
                        if (!response_1.data.music_id && videoData.music) {
                          var musicId = videoData.music.id || videoData.music.musicId || videoData.musicId || ((_e2 = videoData.music) === null || _e2 === void 0 ? void 0 : _e2.idStr);
                          if (musicId) {
                            response_1.data.music_id = String(musicId);
                            _this.logger.log("Extracted music_id from ".concat(source, ": ").concat(musicId), "info");
                          }
                        }
                        if (!response_1.data.effect_ids && videoData.effectStickers) {
                          _this.logger.log("".concat(source, " has effectStickers, type: ").concat(typeof videoData.effectStickers, ", isArray: ").concat(Array.isArray(videoData.effectStickers)), "debug");
                          var effects = [];
                          if (Array.isArray(videoData.effectStickers)) {
                            _this.logger.log("".concat(source, " effectStickers array length: ").concat(videoData.effectStickers.length), "debug");
                            effects = videoData.effectStickers.map(function(e) {
                              if (typeof e === "string")
                                return e;
                              if (typeof e === "number")
                                return String(e);
                              return (e === null || e === void 0 ? void 0 : e.ID) || (e === null || e === void 0 ? void 0 : e.id) || (e === null || e === void 0 ? void 0 : e.effectId) || (e === null || e === void 0 ? void 0 : e.effect_id) || (e === null || e === void 0 ? void 0 : e.stickerId) || (e === null || e === void 0 ? void 0 : e.sticker_id);
                            }).filter(Boolean).map(String);
                            _this.logger.log("".concat(source, " extracted effect IDs: ").concat(effects.join(", ")), "debug");
                          } else if (typeof videoData.effectStickers === "object" && videoData.effectStickers !== null) {
                            var effectObj = videoData.effectStickers;
                            if (effectObj.ID)
                              effects.push(String(effectObj.ID));
                            if (effectObj.id)
                              effects.push(String(effectObj.id));
                            if (effectObj.effectId)
                              effects.push(String(effectObj.effectId));
                          }
                          if (effects.length > 0) {
                            response_1.data.effect_ids = effects;
                            _this.logger.log("Extracted effect_ids from ".concat(source, ": ").concat(effects.join(", ")), "info");
                          } else {
                            _this.logger.log("".concat(source, " effectStickers exists but no IDs extracted"), "debug");
                          }
                        }
                        if (!response_1.data.effect_ids && videoData.effectIds && Array.isArray(videoData.effectIds)) {
                          response_1.data.effect_ids = videoData.effectIds.map(String);
                          _this.logger.log("Extracted effect_ids from ".concat(source, " effectIds: ").concat((_f2 = response_1.data.effect_ids) === null || _f2 === void 0 ? void 0 : _f2.join(", ")), "info");
                        }
                        if (!response_1.data.effect_ids && videoData.stickersOnItem && Array.isArray(videoData.stickersOnItem)) {
                          var effects = videoData.stickersOnItem.map(function(s) {
                            return s.stickerId || s.id || s.effectId;
                          }).filter(Boolean).map(String);
                          if (effects.length > 0) {
                            response_1.data.effect_ids = effects;
                            _this.logger.log("Extracted effect_ids from ".concat(source, " stickersOnItem: ").concat(effects.join(", ")), "info");
                          }
                        }
                        if (!response_1.data.playlist_id && videoData.playlistId) {
                          response_1.data.playlist_id = String(videoData.playlistId);
                          _this.logger.log("Extracted playlist_id from ".concat(source, ": ").concat(response_1.data.playlist_id), "info");
                        }
                        if (!response_1.data.playlist_id && videoData.playlist_id) {
                          response_1.data.playlist_id = String(videoData.playlist_id);
                          _this.logger.log("Extracted playlist_id from ".concat(source, " (playlist_id): ").concat(response_1.data.playlist_id), "info");
                        }
                        if (!response_1.data.playlist_id && ((_g2 = videoData.music) === null || _g2 === void 0 ? void 0 : _g2.playlistId)) {
                          response_1.data.playlist_id = String(videoData.music.playlistId);
                          _this.logger.log("Extracted playlist_id from ".concat(source, " (music.playlistId): ").concat(response_1.data.playlist_id), "info");
                        }
                        if (!response_1.data.region_code && videoData.regionCode) {
                          response_1.data.region_code = videoData.regionCode;
                          _this.logger.log("Extracted region_code from ".concat(source, ": ").concat(response_1.data.region_code), "info");
                        }
                        if (!response_1.data.region_code && videoData.region) {
                          response_1.data.region_code = videoData.region;
                          _this.logger.log("Extracted region_code from ".concat(source, " (region): ").concat(response_1.data.region_code), "info");
                        }
                        if (!response_1.data.region_code && ((_h2 = videoData.video) === null || _h2 === void 0 ? void 0 : _h2.region)) {
                          response_1.data.region_code = videoData.video.region;
                          _this.logger.log("Extracted region_code from ".concat(source, " (video.region): ").concat(response_1.data.region_code), "info");
                        }
                        if (!response_1.data.voice_to_text && videoData.transcription) {
                          response_1.data.voice_to_text = videoData.transcription;
                          _this.logger.log("Extracted voice_to_text from ".concat(source, " (").concat(videoData.transcription.length, " chars)"), "info");
                        }
                        if (!response_1.data.voice_to_text && videoData.voiceToText) {
                          response_1.data.voice_to_text = videoData.voiceToText;
                          _this.logger.log("Extracted voice_to_text from ".concat(source, " (").concat(videoData.voiceToText.length, " chars)"), "info");
                        }
                        if (!response_1.data.voice_to_text && videoData.subtitleInfos && Array.isArray(videoData.subtitleInfos)) {
                          var subtitles = videoData.subtitleInfos.map(function(s) {
                            return s.content || s.text || s.subtitle;
                          }).filter(Boolean).join(" ");
                          if (subtitles) {
                            response_1.data.voice_to_text = subtitles;
                            _this.logger.log("Extracted voice_to_text from ".concat(source, " subtitleInfos (").concat(subtitles.length, " chars)"), "info");
                          }
                        }
                        if (videoData.textExtra && Array.isArray(videoData.textExtra)) {
                          var mentions = videoData.textExtra.filter(function(item2) {
                            return item2.userUniqueId || item2.userId || item2.userUniqueId || item2.type === "user";
                          }).map(function(item2) {
                            return item2.userUniqueId || item2.userId || item2.userName || item2.nickname;
                          }).filter(Boolean);
                          if (mentions.length > 0 && !response_1.data.mentions) {
                            response_1.data.mentions = mentions;
                            _this.logger.log("Extracted mentions from ".concat(source, ": ").concat(mentions.join(", ")), "info");
                          }
                        }
                        if (videoData.video) {
                          if (!response_1.data.is_video && videoData.video.duration !== void 0) {
                            response_1.data.is_video = true;
                            _this.logger.log("Extracted is_video from ".concat(source, ": true"), "info");
                          }
                          var thumbnails = [];
                          if (videoData.video.cover)
                            thumbnails.push(String(videoData.video.cover));
                          if (videoData.video.dynamicCover)
                            thumbnails.push(String(videoData.video.dynamicCover));
                          if (videoData.video.originCover)
                            thumbnails.push(String(videoData.video.originCover));
                          if (thumbnails.length > 0 && !response_1.data.thumbnails) {
                            response_1.data.thumbnails = thumbnails;
                            _this.logger.log("Extracted ".concat(thumbnails.length, " thumbnail(s) from ").concat(source), "info");
                          }
                          if (videoData.video.width && !response_1.data.dimension) {
                            var width = typeof videoData.video.width === "number" ? videoData.video.width : parseInt(String(videoData.video.width));
                            var height = videoData.video.height ? typeof videoData.video.height === "number" ? videoData.video.height : parseInt(String(videoData.video.height)) : null;
                            if (!isNaN(width)) {
                              response_1.data.dimension = height && !isNaN(height) ? "".concat(width, "x").concat(height) : "".concat(width);
                              _this.logger.log("Extracted dimension from ".concat(source, ": ").concat(response_1.data.dimension), "info");
                            }
                          }
                        }
                        if (!response_1.data.caption && videoData.title) {
                          response_1.data.caption = String(videoData.title);
                          _this.logger.log("Extracted title as caption from ".concat(source), "info");
                        }
                        if (videoData.collected !== void 0 && !response_1.data.save_count) {
                          response_1.data.save_count = videoData.collected ? 1 : 0;
                          _this.logger.log("Extracted save_count (collected) from ".concat(source, ": ").concat(response_1.data.save_count), "info");
                        }
                        if (videoData.author) {
                          if (videoData.author.openId && !response_1.data.creator_open_id) {
                            response_1.data.creator_open_id = String(videoData.author.openId);
                            _this.logger.log("Extracted creator_open_id from ".concat(source, ": ").concat(response_1.data.creator_open_id), "info");
                          }
                          if (videoData.author.unionId && !response_1.data.creator_union_id) {
                            response_1.data.creator_union_id = String(videoData.author.unionId);
                            _this.logger.log("Extracted creator_union_id from ".concat(source, ": ").concat(response_1.data.creator_union_id), "info");
                          }
                          if (videoData.author.avatarThumb && !response_1.data.creator_avatar_url_100) {
                            response_1.data.creator_avatar_url_100 = String(videoData.author.avatarThumb);
                            _this.logger.log("Extracted creator_avatar_url_100 from ".concat(source), "info");
                          }
                          if (videoData.author.avatarMedium && !response_1.data.creator_avatar_large_url) {
                            response_1.data.creator_avatar_large_url = String(videoData.author.avatarMedium);
                            _this.logger.log("Extracted creator_avatar_large_url from ".concat(source), "info");
                          }
                          if (videoData.author.avatarLarger && !response_1.data.creator_avatar_large_url) {
                            response_1.data.creator_avatar_large_url = String(videoData.author.avatarLarger);
                            _this.logger.log("Extracted creator_avatar_large_url from ".concat(source, " (avatarLarger)"), "info");
                          }
                          if (videoData.author.uniqueId && !response_1.data.creator_profile_deep_link) {
                            response_1.data.creator_profile_deep_link = "https://www.tiktok.com/@".concat(videoData.author.uniqueId);
                            _this.logger.log("Extracted creator_profile_deep_link from ".concat(source, ": ").concat(response_1.data.creator_profile_deep_link), "info");
                          }
                          if (videoData.authorStats) {
                            if (videoData.authorStats.followingCount !== void 0 && !response_1.data.creator_following_count) {
                              response_1.data.creator_following_count = videoData.authorStats.followingCount;
                              _this.logger.log("Extracted creator_following_count from ".concat(source, ": ").concat(response_1.data.creator_following_count), "info");
                            }
                            if (videoData.authorStats.heartCount !== void 0 && !response_1.data.creator_likes_count) {
                              response_1.data.creator_likes_count = videoData.authorStats.heartCount;
                              _this.logger.log("Extracted creator_likes_count from ".concat(source, ": ").concat(response_1.data.creator_likes_count), "info");
                            }
                            if (videoData.authorStats.videoCount !== void 0 && !response_1.data.creator_video_count) {
                              response_1.data.creator_video_count = videoData.authorStats.videoCount;
                              _this.logger.log("Extracted creator_video_count from ".concat(source, ": ").concat(response_1.data.creator_video_count), "info");
                            }
                          }
                          if (videoData.authorStatsV2) {
                            if (videoData.authorStatsV2.followingCount !== void 0 && !response_1.data.creator_following_count) {
                              response_1.data.creator_following_count = videoData.authorStatsV2.followingCount;
                              _this.logger.log("Extracted creator_following_count from ".concat(source, " (V2): ").concat(response_1.data.creator_following_count), "info");
                            }
                            if (videoData.authorStatsV2.heartCount !== void 0 && !response_1.data.creator_likes_count) {
                              response_1.data.creator_likes_count = videoData.authorStatsV2.heartCount;
                              _this.logger.log("Extracted creator_likes_count from ".concat(source, " (V2): ").concat(response_1.data.creator_likes_count), "info");
                            }
                            if (videoData.authorStatsV2.videoCount !== void 0 && !response_1.data.creator_video_count) {
                              response_1.data.creator_video_count = videoData.authorStatsV2.videoCount;
                              _this.logger.log("Extracted creator_video_count from ".concat(source, " (V2): ").concat(response_1.data.creator_video_count), "info");
                            }
                          }
                        }
                        if (videoData.locationInfo || videoData.location) {
                          var location_1 = videoData.locationInfo || videoData.location;
                          if (location_1 && !response_1.data.location) {
                            response_1.data.location = location_1.name || location_1.address || location_1.locationName || String(location_1);
                            _this.logger.log("Extracted location from ".concat(source, ": ").concat(response_1.data.location), "info");
                          }
                          if ((location_1 === null || location_1 === void 0 ? void 0 : location_1.latitude) && !response_1.data.location_latitude) {
                            response_1.data.location_latitude = typeof location_1.latitude === "number" ? location_1.latitude : parseFloat(String(location_1.latitude));
                            _this.logger.log("Extracted location_latitude from ".concat(source, ": ").concat(response_1.data.location_latitude), "info");
                          }
                          if ((location_1 === null || location_1 === void 0 ? void 0 : location_1.longitude) && !response_1.data.location_longitude) {
                            response_1.data.location_longitude = typeof location_1.longitude === "number" ? location_1.longitude : parseFloat(String(location_1.longitude));
                            _this.logger.log("Extracted location_longitude from ".concat(source, ": ").concat(response_1.data.location_longitude), "info");
                          }
                        }
                      };
                      if ((_c = apiResp.data) === null || _c === void 0 ? void 0 : _c.itemList) {
                        items = apiResp.data.itemList;
                        if (Array.isArray(items) && items.length > 0) {
                          video = items.find(function(item2) {
                            var _a2, _b2, _c2, _d2, _e2, _f2;
                            return ((_a2 = item2.itemInfo) === null || _a2 === void 0 ? void 0 : _a2.itemId) === videoId || ((_c2 = (_b2 = item2.itemInfo) === null || _b2 === void 0 ? void 0 : _b2.itemStruct) === null || _c2 === void 0 ? void 0 : _c2.id) === videoId || item2.id === videoId || ((_f2 = (_e2 = (_d2 = item2.itemInfo) === null || _d2 === void 0 ? void 0 : _d2.itemStruct) === null || _e2 === void 0 ? void 0 : _e2.video) === null || _f2 === void 0 ? void 0 : _f2.id) === videoId;
                          }) || items[0];
                          if ((_d = video === null || video === void 0 ? void 0 : video.itemInfo) === null || _d === void 0 ? void 0 : _d.itemStruct) {
                            extractVideoData(video.itemInfo.itemStruct, "itemList.itemInfo.itemStruct");
                          } else if (video === null || video === void 0 ? void 0 : video.itemStruct) {
                            extractVideoData(video.itemStruct, "itemList.itemStruct");
                          } else if (video) {
                            extractVideoData(video, "itemList item");
                          }
                        }
                      }
                      if (((_e = apiResp.data) === null || _e === void 0 ? void 0 : _e.itemList) && Array.isArray(apiResp.data.itemList)) {
                        for (_a = 0, _b = apiResp.data.itemList; _a < _b.length; _a++) {
                          item = _b[_a];
                          if (item && (item.id === videoId || ((_f = item.itemInfo) === null || _f === void 0 ? void 0 : _f.itemId) === videoId)) {
                            if (item.effectStickers || item.music || item.desc || item.playlistId) {
                              extractVideoData(item, "itemList direct");
                            }
                            if ((_g = item.itemInfo) === null || _g === void 0 ? void 0 : _g.itemStruct) {
                              extractVideoData(item.itemInfo.itemStruct, "itemList.itemInfo.itemStruct");
                            }
                            break;
                          }
                        }
                      }
                      if ((_j = (_h = apiResp.data) === null || _h === void 0 ? void 0 : _h.itemInfo) === null || _j === void 0 ? void 0 : _j.itemStruct) {
                        extractVideoData(apiResp.data.itemInfo.itemStruct, "itemInfo.itemStruct");
                      }
                      if ((_k = apiResp.data) === null || _k === void 0 ? void 0 : _k.aweme_detail) {
                        extractVideoData(apiResp.data.aweme_detail, "aweme_detail");
                      }
                      if (((_l = apiResp.data) === null || _l === void 0 ? void 0 : _l.items) && Array.isArray(apiResp.data.items)) {
                        video = apiResp.data.items.find(function(item2) {
                          return item2.id === videoId;
                        }) || apiResp.data.items[0];
                        if (video) {
                          extractVideoData(video, "items array");
                        }
                      }
                      if ((_m = apiResp.data) === null || _m === void 0 ? void 0 : _m.item) {
                        extractVideoData(apiResp.data.item, "item");
                      }
                      if (((_o = apiResp.data) === null || _o === void 0 ? void 0 : _o.keywordsByItemId) && videoId) {
                        keywords = apiResp.data.keywordsByItemId[videoId];
                        if (keywords && Array.isArray(keywords) && keywords.length > 0 && (response_1 === null || response_1 === void 0 ? void 0 : response_1.data) && !response_1.data.hashtags) {
                          response_1.data.hashtags = keywords.map(function(k) {
                            return typeof k === "string" ? k : k.keyword || k.name || k;
                          }).filter(Boolean);
                          this.logger.log("Extracted hashtags from SEO keywords: ".concat(response_1.data.hashtags.join(", ")), "debug");
                        }
                      }
                    }
                  }
                  return [4, page.evaluate(function(vidId) {
                    var result = {};
                    try {
                      var win = window;
                      if (win.__UNIVERSAL_DATA_FOR_REHYDRATION__) {
                        result.hasUniversalData = true;
                        try {
                          var data = win.__UNIVERSAL_DATA_FOR_REHYDRATION__;
                          var state = data.defaultScope || data;
                          if (state && (state.ItemModule || state.itemModule)) {
                            var itemModule = state.ItemModule || state.itemModule;
                            var video2 = itemModule && itemModule[vidId] || itemModule && Object.values(itemModule)[0];
                            if (video2) {
                              result.foundVideoInUniversal = true;
                              result.videoKeys = Object.keys(video2).slice(0, 30);
                              if (video2.desc) {
                                var hashtags = (video2.desc.match(/#\w+/g) || []).map(function(h) {
                                  return h.substring(1);
                                });
                                if (hashtags.length > 0) {
                                  result.hashtags = hashtags;
                                }
                              }
                              if (video2.music && video2.music.id) {
                                result.music_id = String(video2.music.id);
                              }
                            }
                          }
                        } catch (e) {
                          result.universalError = String(e);
                        }
                      }
                      if (win.__$UNIVERSAL_DATA$__) {
                        result.hasUniversalDataDollar = true;
                      }
                      if (win.SIGI_STATE) {
                        result.hasSIGI = true;
                      }
                      result.windowKeys = Object.keys(win).filter(function(k) {
                        return k.startsWith("__") || k.includes("DATA") || k.includes("STATE");
                      }).slice(0, 20);
                    } catch (e) {
                      result.error = String(e);
                    }
                    return result;
                  }, videoId || "")];
                case 2:
                  windowData = _p.sent();
                  if (windowData.foundVideoInUniversal) {
                    this.logger.log("Found video in __UNIVERSAL_DATA_FOR_REHYDRATION__", "debug");
                    if (windowData.videoKeys) {
                      this.logger.log("Video keys: ".concat(windowData.videoKeys.join(", ")), "debug");
                    }
                    if (windowData.hashtags && (response_1 === null || response_1 === void 0 ? void 0 : response_1.data)) {
                      response_1.data.hashtags = windowData.hashtags;
                      this.logger.log("Extracted hashtags from window: ".concat(windowData.hashtags.join(", ")), "debug");
                    }
                    if (windowData.music_id && (response_1 === null || response_1 === void 0 ? void 0 : response_1.data)) {
                      response_1.data.music_id = windowData.music_id;
                      this.logger.log("Extracted music_id from window: ".concat(windowData.music_id), "debug");
                    }
                  }
                  if (windowData.windowKeys && windowData.windowKeys.length > 0) {
                    this.logger.log("Window objects found: ".concat(windowData.windowKeys.join(", ")), "debug");
                  }
                  if (response_1 && response_1.debug) {
                    this.logger.log("SIGI_STATE debug - Found SIGI: ".concat(response_1.debug.foundSIGI, ", Found Video: ").concat(response_1.debug.foundVideo), "debug");
                    this.logger.log("Script count: ".concat(response_1.debug.scriptCount || 0), "debug");
                    if (response_1.debug.scriptIds && response_1.debug.scriptIds.length > 0) {
                      this.logger.log("Script IDs found: ".concat(response_1.debug.scriptIds.join(", ")), "debug");
                    }
                    if (response_1.debug.searchText) {
                      this.logger.log(response_1.debug.searchText, "debug");
                    }
                    if (response_1.debug.sigiTopLevelKeys && response_1.debug.sigiTopLevelKeys.length > 0) {
                      this.logger.log("SIGI top-level keys: ".concat(response_1.debug.sigiTopLevelKeys.join(", ")), "debug");
                    }
                    if (response_1.debug.itemModuleKeys && response_1.debug.itemModuleKeys.length > 0) {
                      this.logger.log("ItemModule keys (first 10): ".concat(response_1.debug.itemModuleKeys.join(", ")), "debug");
                    }
                    if (response_1.debug.videoKeys && response_1.debug.videoKeys.length > 0) {
                      this.logger.log("Video object keys (first 50): ".concat(response_1.debug.videoKeys.join(", ")), "debug");
                    }
                    if (response_1.debug.descElementFound !== void 0) {
                      this.logger.log("Description element found: ".concat(response_1.debug.descElementFound), "debug");
                    }
                    if (response_1.debug.foundHashtagsInDOM) {
                      this.logger.log("Found hashtags in DOM: ".concat(response_1.debug.descText), "debug");
                    }
                  }
                  if (response_1 === null || response_1 === void 0 ? void 0 : response_1.data) {
                    extractedKeys = Object.keys(response_1.data);
                    this.logger.log("Final extracted data keys: ".concat(extractedKeys.join(", ")), "debug");
                    if (response_1.data.effect_ids) {
                      this.logger.log("Effect IDs in response.data: ".concat(Array.isArray(response_1.data.effect_ids) ? response_1.data.effect_ids.join(", ") : response_1.data.effect_ids), "info");
                    }
                    if (response_1.data.hashtags) {
                      this.logger.log("Hashtags in response.data: ".concat(Array.isArray(response_1.data.hashtags) ? response_1.data.hashtags.join(", ") : response_1.data.hashtags), "info");
                    }
                  }
                  return [2, (response_1 === null || response_1 === void 0 ? void 0 : response_1.data) || null];
                case 3:
                  error_3 = _p.sent();
                  this.logger.log("Failed to extract embedded TikTok data: ".concat(error_3), "debug");
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
        TikTokScraper3.prototype.extractTikTokDOMData = function(page) {
          return __awaiter(this, void 0, void 0, function() {
            var evalCode, data, error_4;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 2, , 3]);
                  evalCode = `
                (function() {
                    var result = {};
                    var debug = [];

                    function logDebug(msg) {
                        debug.push(msg);
                    }

                    var descSelectors = [
                        '[data-e2e="browse-video-desc"]',
                        '[data-e2e="video-desc"]',
                        '[data-e2e="video-desc-text"]',
                        'h1[data-e2e="browse-video-desc"]',
                        '[class*="desc"]',
                        '[class*="Description"]',
                        'span[class*="desc"]',
                        'div[class*="desc"]',
                        '[class*="video-desc"]',
                        '[class*="VideoDesc"]'
                    ];

                    var captionText = "";
                    var descElement = null;
                    
                    for (var i = 0; i < descSelectors.length; i++) {
                        var selector = descSelectors[i];
                        descElement = document.querySelector(selector);
                        if (descElement) {
                            captionText = descElement.textContent || "";
                            if (captionText && captionText.length > 0) {
                                logDebug("Found description with selector: " + selector + ", length: " + captionText.length);
                                break;
                            }
                        }
                    }

                    if (!captionText) {
                        var allSpans = Array.from(document.querySelectorAll('span, div, p, h1, h2, h3, h4'));
                        for (var j = 0; j < Math.min(allSpans.length, 200); j++) {
                            var el = allSpans[j];
                            var text = el.textContent || "";
                            if (text.indexOf("#") !== -1 && text.length > 5 && text.length < 1000) {
                                var parent = el.closest('[class*="desc"], [class*="video"], [class*="caption"], [data-e2e*="desc"], [data-e2e*="video"], [data-e2e*="caption"]');
                                if (parent) {
                                    captionText = parent.textContent || text;
                                    descElement = parent;
                                    logDebug("Found description in parent element, length: " + captionText.length);
                                    break;
                                } else if (text.length > 10 && text.length < 500) {
                                    captionText = text;
                                    descElement = el;
                                    logDebug("Found description directly in element, length: " + captionText.length);
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (!captionText) {
                        var bodyText = document.body.textContent || "";
                        var lines = bodyText.split("\\n");
                        for (var l = 0; l < lines.length; l++) {
                            var line = lines[l].trim();
                            if (line.indexOf("#") !== -1 && line.length > 5 && line.length < 500 && line.split("#").length > 1) {
                                var hashtagCount = (line.match(/#/g) || []).length;
                                if (hashtagCount >= 1 && hashtagCount <= 20) {
                                    captionText = line;
                                    logDebug("Found description in body text line, length: " + captionText.length);
                                    break;
                                }
                            }
                        }
                    }

                    if (captionText) {
                        var captionHashtags = captionText.match(/#[\\w\\u4e00-\\u9fff]+/g);
                        if (captionHashtags && captionHashtags.length > 0) {
                            var extracted = captionHashtags.map(function(h) { return h.substring(1); }).filter(function(h) { return h.length > 0 && h.length < 100; });
                            var genericTags = ["fyp", "foryou", "foryoupage", "viral", "trending", "trend", "fyp\u30B7", "fypage", "fy", "fyp\u30B7\u309Aviral", "viralvideos", "viralvideo", "trendingnow", "trendingvideos"];
                            extracted = extracted.filter(function(tag) {
                                return genericTags.indexOf(tag.toLowerCase()) === -1;
                            });
                            if (extracted.length > 0) {
                                result.hashtags = Array.from(new Set(extracted));
                                logDebug("Extracted " + result.hashtags.length + " hashtags from description: " + extracted.join(", "));
                            } else {
                                logDebug("Found hashtags in description but all were filtered as generic");
                            }
                        } else {
                            logDebug("Description found but no hashtags in it: " + captionText.substring(0, 100));
                        }
                        result.caption = captionText.substring(0, 500);
                    }
                    
                    if (!result.hashtags || result.hashtags.length === 0) {
                        var videoContainer = document.querySelector('[class*="video"], [class*="Video"], [data-e2e*="video"], [class*="player"], [class*="Player"]');
                        if (videoContainer) {
                            var containerText = videoContainer.textContent || "";
                            var containerHashtags = containerText.match(/#[\\w\\u4e00-\\u9fff]+/g);
                            if (containerHashtags && containerHashtags.length > 0) {
                                var extracted = containerHashtags.map(function(h) { return h.substring(1); }).filter(function(h) { return h.length > 0 && h.length < 100; });
                                var genericTags = ["fyp", "foryou", "foryoupage", "viral", "trending", "trend", "fyp\u30B7", "fypage", "fy"];
                                extracted = extracted.filter(function(tag) {
                                    return genericTags.indexOf(tag.toLowerCase()) === -1;
                                });
                                if (extracted.length > 0 && extracted.length <= 30) {
                                    result.hashtags = Array.from(new Set(extracted));
                                    logDebug("Extracted " + result.hashtags.length + " hashtags from video container");
                                }
                            }
                        }
                    }
                    
                    if (!result.hashtags || result.hashtags.length === 0) {
                        var mainContent = document.querySelector('[class*="video"], [class*="Video"], [data-e2e*="video"], main, article') || document.body;
                        var mainText = mainContent.textContent || "";
                        var allHashtags = mainText.match(/#[\\w\\u4e00-\\u9fff]+/g);
                        if (allHashtags && allHashtags.length > 0) {
                            var extracted = allHashtags.map(function(h) { return h.substring(1); }).filter(function(h) { return h.length > 0 && h.length < 100; });
                            var genericTags = ["fyp", "foryou", "foryoupage", "viral", "trending", "trend", "fyp\u30B7", "fypage", "fy", "fyp\u30B7\u309Aviral", "viralvideos", "viralvideo", "trendingnow", "trendingvideos", "tiktok", "tiktokviral", "tiktoktrending", "explore", "discover"];
                            extracted = extracted.filter(function(tag) {
                                return genericTags.indexOf(tag.toLowerCase()) === -1;
                            });
                            if (extracted.length > 0 && extracted.length <= 30) {
                                result.hashtags = Array.from(new Set(extracted));
                                logDebug("Extracted " + result.hashtags.length + " hashtags from main content");
                            }
                        }
                    }
                    
                    if (!result.hashtags || result.hashtags.length === 0) {
                        var linkElements = document.querySelectorAll('a[href*="/tag/"], a[href*="/challenge/"], a[href*="/hashtag/"]');
                        var linkHashtags = [];
                        for (var q = 0; q < Math.min(linkElements.length, 50); q++) {
                            var link = linkElements[q];
                            var href = link.getAttribute("href") || "";
                            var linkText = link.textContent || "";
                            var match = href.match(/[\\/](tag|challenge|hashtag)[\\/]([^\\/\\?#]+)/i);
                            if (match && match[2]) {
                                linkHashtags.push(match[2].trim());
                            } else if (linkText && linkText.indexOf("#") === 0) {
                                linkHashtags.push(linkText.substring(1).trim());
                            }
                        }
                        if (linkHashtags.length > 0) {
                            var uniqueLinkHashtags = Array.from(new Set(linkHashtags.filter(function(h) { return h.length > 0 && h.length < 100; })));
                            if (uniqueLinkHashtags.length > 0 && uniqueLinkHashtags.length <= 30) {
                                result.hashtags = uniqueLinkHashtags;
                                logDebug("Extracted " + result.hashtags.length + " hashtags from link elements");
                            }
                        }
                    }

                    var hashtagSelectors = [
                        '[data-e2e="challenge-item"]',
                        '[data-e2e="challenge-list"] a',
                        '[data-e2e="challenge"]',
                        '[data-e2e*="challenge"]',
                        '[data-e2e*="hashtag"]',
                        '[data-e2e*="tag"]',
                        '.hashtag',
                        '[href*="/tag/"]',
                        '[href*="/challenge/"]',
                        '[href*="/hashtag/"]',
                        'a[href*="hashtag"]',
                        'a[href*="/tag/"]',
                        'a[href*="/challenge/"]',
                        '[class*="hashtag"]',
                        '[class*="challenge"]',
                        '[class*="Tag"]',
                        '[class*="Hashtag"]',
                        '[class*="Challenge"]',
                        'span[class*="hashtag"]',
                        'div[class*="hashtag"]',
                        'a[class*="hashtag"]'
                    ];

                    var hashtags = [];
                    for (var k = 0; k < hashtagSelectors.length; k++) {
                        var sel = hashtagSelectors[k];
                        var elements = document.querySelectorAll(sel);
                        logDebug("Selector " + sel + " found " + elements.length + " elements");
                        for (var m = 0; m < elements.length; m++) {
                            var el = elements[m];
                            var text = (el.textContent || "").trim();
                            var href = el.getAttribute("href") || "";
                            
                            if (text) {
                                if (text.indexOf("#") === 0) {
                                    hashtags.push(text.substring(1).trim());
                                } else if (text.length > 0 && text.length < 50 && text.indexOf(" ") === -1 && text.indexOf("\\n") === -1) {
                                    hashtags.push(text.trim());
                                }
                            }
                            
                            if (href) {
                                var match = href.match(/[#\\/](tag|challenge|hashtag)[\\/#]([^\\/\\?#]+)/i);
                                if (match && match[2]) {
                                    hashtags.push(match[2].trim());
                                }
                            }
                        }
                    }

                    if (hashtags.length > 0) {
                        var uniqueHashtags = Array.from(new Set(hashtags.filter(function(h) { return h.length > 0 && h.length < 50; })));
                        if (result.hashtags) {
                            result.hashtags = Array.from(new Set(result.hashtags.concat(uniqueHashtags)));
                        } else {
                            result.hashtags = uniqueHashtags;
                        }
                        logDebug("Total unique hashtags: " + result.hashtags.length);
                    }

                    var musicSelectors = [
                        '[data-e2e="browse-music"]',
                        '[data-e2e="music"]',
                        '[class*="music"]',
                        '[class*="Music"]',
                        '[class*="sound"]',
                        '[class*="Sound"]',
                        'a[href*="/music/"]',
                        'a[href*="/sound/"]'
                    ];

                    for (var n = 0; n < musicSelectors.length; n++) {
                        var musicSel = musicSelectors[n];
                        var musicEl = document.querySelector(musicSel);
                        if (musicEl) {
                            var musicText = musicEl.textContent || "";
                            var musicHref = musicEl.getAttribute("href") || "";
                            
                            if (musicHref) {
                                var musicMatch = musicHref.match(/[\\/](music|sound)[\\/]([^\\/\\?#]+)/i);
                                if (musicMatch && musicMatch[2]) {
                                    var musicIdStr = musicMatch[2];
                                    musicIdStr = musicIdStr.replace(/^(original-sound-|som-original-)/i, "");
                                    var numericMatch = musicIdStr.match(/\\d+/);
                                    if (numericMatch) {
                                        result.music_id = numericMatch[0];
                                    } else {
                                        result.music_id = musicIdStr;
                                    }
                                    logDebug("Found music ID from href: " + result.music_id);
                                    break;
                                }
                            }
                            
                            if (musicText && musicText.length < 100) {
                                var dataId = musicEl.getAttribute("data-id") || musicEl.getAttribute("data-music-id");
                                if (dataId) {
                                    result.music_id = dataId;
                                    logDebug("Found music ID from data attribute: " + result.music_id);
                                    break;
                                }
                            }
                        }
                    }

                    var embedSelectors = [
                        '[data-e2e="embed-button"]',
                        'a[href*="/embed/"]',
                        'button[aria-label*="embed" i]',
                        'button[aria-label*="Embed" i]',
                        '[class*="embed"]',
                        '[class*="Embed"]'
                    ];

                    for (var p = 0; p < embedSelectors.length; p++) {
                        var embedSel = embedSelectors[p];
                        var embedButton = document.querySelector(embedSel);
                        if (embedButton) {
                            var embedHref = embedButton.getAttribute("href");
                            if (embedHref) {
                                result.embed_link = embedHref.indexOf("http") === 0 ? embedHref : "https://www.tiktok.com" + embedHref;
                                logDebug("Found embed link: " + result.embed_link);
                                break;
                            }
                        }
                    }

                    logDebug("Total result keys: " + Object.keys(result).length);
                    logDebug("Has hashtags: " + !!result.hashtags + ", Has music_id: " + !!result.music_id + ", Has embed_link: " + !!result.embed_link + ", Has caption: " + !!result.caption);
                    
                    if (debug.length > 0) {
                        result.debug = debug;
                    }
                    
                    return result;
                })
            `;
                  return [4, page.evaluate(evalCode + "()")];
                case 1:
                  data = _a.sent();
                  if (data) {
                    if (data.debug) {
                      data.debug.forEach(function(log) {
                        return _this.logger.log("[DOM Debug] ".concat(log), "debug");
                      });
                      delete data.debug;
                    }
                    if (Object.keys(data).length === 0) {
                      return [2, null];
                    }
                    return [2, data];
                  }
                  return [2, null];
                case 2:
                  error_4 = _a.sent();
                  this.logger.log("Failed to extract DOM TikTok data: ".concat(error_4), "debug");
                  return [2, null];
                case 3:
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
            var username, profileUrl, urlMatch, usernameFromLink, postUsername, _a, pageContent, metadata, nameData, bioData, followerData, avatarData, verifiedSelectors, _i, verifiedSelectors_1, selector, verified, _b, verified, _c, error_1;
            return __generator(this, function(_d) {
              switch (_d.label) {
                case 0:
                  _d.trys.push([0, 31, , 32]);
                  this.logger.log("Extracting Instagram creator metadata...", "info");
                  return [4, page.goto(videoUrl, { waitUntil: "networkidle" })];
                case 1:
                  _d.sent();
                  return [4, this.delay(3e3)];
                case 2:
                  _d.sent();
                  username = null;
                  profileUrl = null;
                  urlMatch = videoUrl.match(/instagram\.com\/([^\/\?]+)/);
                  if (!(urlMatch && !urlMatch[1].includes("p/") && !urlMatch[1].includes("reel/"))) return [3, 3];
                  username = urlMatch[1];
                  profileUrl = "https://www.instagram.com/".concat(username, "/");
                  return [3, 7];
                case 3:
                  return [4, page.evaluate(function() {
                    var links = document.querySelectorAll('a[href^="/"]');
                    for (var _i2 = 0, links_1 = links; _i2 < links_1.length; _i2++) {
                      var link = links_1[_i2];
                      var href = link.getAttribute("href");
                      if (href && href.match(/^\/[^\/]+\/$/) && !href.includes("/p/") && !href.includes("/reel/") && !href.includes("/stories/")) {
                        return href.replace(/\//g, "");
                      }
                    }
                    return null;
                  })];
                case 4:
                  usernameFromLink = _d.sent();
                  if (!usernameFromLink) return [3, 5];
                  username = usernameFromLink;
                  profileUrl = "https://www.instagram.com/".concat(username, "/");
                  return [3, 7];
                case 5:
                  return [4, page.evaluate(function() {
                    var header = document.querySelector("header");
                    if (header) {
                      var link = header.querySelector('a[href^="/"]');
                      if (link) {
                        var href = link.getAttribute("href");
                        if (href && !href.includes("/p/") && !href.includes("/reel/")) {
                          return href.replace(/\//g, "");
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
                    return [2, null];
                  }
                  this.logger.log("Found username: ".concat(username), "debug");
                  if (!!page.url().includes("instagram.com")) return [3, 9];
                  this.logger.log("Waiting for manual login if needed...", "info");
                  return [4, this.delay(1e4)];
                case 8:
                  _d.sent();
                  _d.label = 9;
                case 9:
                  return [4, page.goto(profileUrl, { waitUntil: "networkidle" })];
                case 10:
                  _d.sent();
                  return [4, this.delay(5e3)];
                case 11:
                  _d.sent();
                  _d.label = 12;
                case 12:
                  _d.trys.push([12, 14, , 15]);
                  return [4, page.waitForSelector("header, main, article", { timeout: 5e3 })];
                case 13:
                  _d.sent();
                  return [3, 15];
                case 14:
                  _a = _d.sent();
                  return [3, 15];
                case 15:
                  return [4, page.evaluate(function() {
                    return document.body.innerText || document.body.textContent || "";
                  })];
                case 16:
                  pageContent = _d.sent();
                  if (pageContent.includes("Log in") || pageContent.includes("Sign up")) {
                    this.logger.log("Instagram may require login to view profile details", "warn");
                  }
                  metadata = {
                    platform: "instagram",
                    url: profileUrl,
                    creator_username: username,
                    creator_id: username,
                    extractedAt: Date.now()
                  };
                  return [4, page.evaluate(function() {
                    var header = document.querySelector("header");
                    if (header) {
                      var h2 = header.querySelector("h2");
                      if (h2) {
                        var text = h2.textContent || "";
                        if (text && !text.includes("Sign up") && !text.includes("Log in")) {
                          return text;
                        }
                      }
                      var spans = header.querySelectorAll("span");
                      for (var _i2 = 0, spans_1 = spans; _i2 < spans_1.length; _i2++) {
                        var span = spans_1[_i2];
                        var text = span.textContent || "";
                        if (text && text.length > 0 && text.length < 100 && !text.includes("followers") && !text.includes("following") && !text.includes("posts") && !text.includes("Sign up") && !text.includes("Log in")) {
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
                  return [4, page.evaluate(function() {
                    var header = document.querySelector("header");
                    if (header) {
                      var sections = header.querySelectorAll("section, div");
                      for (var _i2 = 0, sections_1 = sections; _i2 < sections_1.length; _i2++) {
                        var section = sections_1[_i2];
                        var spans = section.querySelectorAll("span");
                        for (var _a2 = 0, spans_2 = spans; _a2 < spans_2.length; _a2++) {
                          var span = spans_2[_a2];
                          var text = span.textContent || "";
                          if (text && text.length > 20 && !text.includes("followers") && !text.includes("following") && !text.includes("posts") && !text.includes("Sign up") && !text.includes("Log in")) {
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
                  return [4, page.evaluate(function() {
                    var links = document.querySelectorAll("a");
                    for (var _i2 = 0, links_2 = links; _i2 < links_2.length; _i2++) {
                      var link = links_2[_i2];
                      var href = link.getAttribute("href");
                      var text = (link.textContent || "").trim();
                      if (href && (href.includes("/followers/") || href.includes("followers")) && /[\d.,]+[KMB]?/.test(text)) {
                        return text;
                      }
                    }
                    var header = document.querySelector("header");
                    if (header) {
                      var allText = header.textContent || "";
                      var followerMatch = allText.match(/([\d.,]+[KMB]?)\s*followers?/i);
                      if (followerMatch) {
                        return followerMatch[1] + " followers";
                      }
                    }
                    return null;
                  })];
                case 19:
                  followerData = _d.sent();
                  if (followerData) {
                    metadata.creator_follower_count = this.parseCount(followerData);
                  }
                  return [4, page.evaluate(function() {
                    var header = document.querySelector("header");
                    if (header) {
                      var images = header.querySelectorAll("img");
                      for (var _i2 = 0, images_1 = images; _i2 < images_1.length; _i2++) {
                        var img = images_1[_i2];
                        var src = img.src || img.getAttribute("src");
                        var alt = img.getAttribute("alt") || "";
                        if (src && (src.includes("instagram.com") || src.includes("fbcdn.net")) && (alt.includes("profile") || alt.includes("Profile"))) {
                          return src;
                        }
                      }
                    }
                    var profileImages = document.querySelectorAll('img[alt*="profile"], img[alt*="Profile"]');
                    for (var _a2 = 0, profileImages_1 = profileImages; _a2 < profileImages_1.length; _a2++) {
                      var img = profileImages_1[_a2];
                      var imgElement = img;
                      var src = imgElement.src || img.getAttribute("src");
                      if (src && (src.includes("instagram.com") || src.includes("fbcdn.net"))) {
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
                  if (!(_i < verifiedSelectors_1.length)) return [3, 26];
                  selector = verifiedSelectors_1[_i];
                  _d.label = 22;
                case 22:
                  _d.trys.push([22, 24, , 25]);
                  verified = page.locator(selector).first();
                  return [4, verified.isVisible({ timeout: 2e3 }).catch(function() {
                    return false;
                  })];
                case 23:
                  if (_d.sent()) {
                    metadata.creator_verified = true;
                    return [3, 26];
                  }
                  return [3, 25];
                case 24:
                  _b = _d.sent();
                  return [3, 25];
                case 25:
                  _i++;
                  return [3, 21];
                case 26:
                  if (!!metadata.creator_verified) return [3, 30];
                  _d.label = 27;
                case 27:
                  _d.trys.push([27, 29, , 30]);
                  return [4, page.evaluate(function() {
                    var elements = document.querySelectorAll("*");
                    for (var _i2 = 0, elements_1 = elements; _i2 < elements_1.length; _i2++) {
                      var el = elements_1[_i2];
                      var ariaLabel = el.getAttribute("aria-label");
                      var title = el.getAttribute("title");
                      if (ariaLabel && ariaLabel.toLowerCase().includes("verified") || title && title.toLowerCase().includes("verified")) {
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
                  return [3, 30];
                case 29:
                  _c = _d.sent();
                  return [3, 30];
                case 30:
                  this.logger.log("Successfully extracted Instagram creator metadata", "info");
                  return [2, metadata];
                case 31:
                  error_1 = _d.sent();
                  this.logger.log("Failed to extract Instagram metadata: ".concat(error_1), "error");
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
        InstagramScraper3.prototype.extractVideoMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var metadata, shortcodeMatch, embeddedData, domData, error_2;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 5, , 6]);
                  this.logger.log("Extracting Instagram video metadata...", "info");
                  return [4, page.goto(videoUrl, { waitUntil: "networkidle" })];
                case 1:
                  _a.sent();
                  return [4, this.delay(3e3)];
                case 2:
                  _a.sent();
                  metadata = {
                    platform: "instagram",
                    url: videoUrl,
                    extractedAt: Date.now()
                  };
                  shortcodeMatch = videoUrl.match(/instagram\.com\/(?:p|reel)\/([^\/\?]+)/);
                  if (shortcodeMatch) {
                    metadata.shortcode = shortcodeMatch[1];
                    metadata.video_id = shortcodeMatch[1];
                  }
                  return [4, this.extractFromEmbeddedJSON(page)];
                case 3:
                  embeddedData = _a.sent();
                  if (embeddedData) {
                    if (embeddedData.like_count !== void 0)
                      metadata.like_count = embeddedData.like_count;
                    if (embeddedData.comment_count !== void 0)
                      metadata.comment_count = embeddedData.comment_count;
                    if (embeddedData.view_count !== void 0)
                      metadata.view_count = embeddedData.view_count;
                    if (embeddedData.play_count !== void 0)
                      metadata.play_count = embeddedData.play_count;
                    if (embeddedData.timestamp !== void 0)
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
                    if (embeddedData.is_carousel !== void 0)
                      metadata.is_carousel = embeddedData.is_carousel;
                    if (embeddedData.carousel_media_count !== void 0)
                      metadata.carousel_media_count = embeddedData.carousel_media_count;
                    if (embeddedData.is_video !== void 0)
                      metadata.is_video = embeddedData.is_video;
                    if (embeddedData.is_photo !== void 0)
                      metadata.is_photo = embeddedData.is_photo;
                    if (embeddedData.requiresLogin !== void 0)
                      metadata.requiresLogin = embeddedData.requiresLogin;
                  }
                  return [4, this.extractFromDOM(page)];
                case 4:
                  domData = _a.sent();
                  if (domData) {
                    if (domData.like_count !== void 0 && !metadata.like_count)
                      metadata.like_count = domData.like_count;
                    if (domData.comment_count !== void 0 && !metadata.comment_count)
                      metadata.comment_count = domData.comment_count;
                    if (domData.view_count !== void 0 && !metadata.view_count)
                      metadata.view_count = domData.view_count;
                    if (domData.caption && !metadata.caption)
                      metadata.caption = domData.caption;
                    if (domData.hashtags && !metadata.hashtags)
                      metadata.hashtags = domData.hashtags;
                    if (domData.mentions && !metadata.mentions)
                      metadata.mentions = domData.mentions;
                  }
                  if (metadata.like_count === void 0 && metadata.comment_count === void 0) {
                    metadata.requiresLogin = true;
                    this.logger.log("Like/comment counts not available - may require login", "warn");
                  }
                  this.logger.log("Successfully extracted Instagram video metadata", "info");
                  return [2, metadata];
                case 5:
                  error_2 = _a.sent();
                  this.logger.log("Failed to extract Instagram video metadata: ".concat(error_2), "error");
                  return [2, null];
                case 6:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        InstagramScraper3.prototype.extractFromEmbeddedJSON = function(page) {
          return __awaiter(this, void 0, void 0, function() {
            var data, error_3;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 2, , 3]);
                  return [4, page.evaluate(function() {
                    var _a2, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
                    var result = {};
                    if (window._sharedData) {
                      var sharedData = window._sharedData;
                      if ((_d = (_c = (_b = (_a2 = sharedData.entry_data) === null || _a2 === void 0 ? void 0 : _a2.PostPage) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.graphql) === null || _d === void 0 ? void 0 : _d.shortcode_media) {
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
                          result.hashtags = (caption.match(/#\w+/g) || []).map(function(h) {
                            return h.substring(1);
                          });
                          result.mentions = (caption.match(/@\w+/g) || []).map(function(m) {
                            return m.substring(1);
                          });
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
                        var json = JSON.parse(script.textContent || "{}");
                        if (json["@type"] === "VideoObject" || json["@type"] === "ImageObject") {
                          if (json.interactionStatistic) {
                            for (var _x = 0, _y = json.interactionStatistic; _x < _y.length; _x++) {
                              var stat = _y[_x];
                              if (stat["@type"] === "LikeAction") {
                                result.like_count = parseInt(stat.userInteractionCount) || result.like_count;
                              } else if (stat["@type"] === "CommentAction") {
                                result.comment_count = parseInt(stat.userInteractionCount) || result.comment_count;
                              }
                            }
                          }
                          if (json.caption)
                            result.caption = json.caption;
                        }
                      } catch (e) {
                        continue;
                      }
                    }
                    var graphqlScripts = document.querySelectorAll("script");
                    for (var _z = 0, graphqlScripts_1 = graphqlScripts; _z < graphqlScripts_1.length; _z++) {
                      var script = graphqlScripts_1[_z];
                      var content = script.textContent || "";
                      if (content.includes("shortcode_media") || content.includes("GraphImage") || content.includes("GraphVideo")) {
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
                        } catch (e) {
                          continue;
                        }
                      }
                    }
                    return result;
                  })];
                case 1:
                  data = _a.sent();
                  return [2, data];
                case 2:
                  error_3 = _a.sent();
                  this.logger.log("Failed to extract from embedded JSON: ".concat(error_3), "debug");
                  return [2, null];
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        InstagramScraper3.prototype.extractFromDOM = function(page) {
          return __awaiter(this, void 0, void 0, function() {
            var data, error_4;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 2, , 3]);
                  return [4, page.evaluate(function() {
                    var result = {};
                    var likeButtons = document.querySelectorAll("button, span, a");
                    for (var _i = 0, likeButtons_1 = likeButtons; _i < likeButtons_1.length; _i++) {
                      var el = likeButtons_1[_i];
                      var text = (el.textContent || "").trim();
                      var ariaLabel = el.getAttribute("aria-label") || "";
                      if (ariaLabel.includes("like") || ariaLabel.includes("Like")) {
                        var match = ariaLabel.match(/([\d.,]+[KMB]?)\s*likes?/i) || text.match(/([\d.,]+[KMB]?)/);
                        if (match) {
                          var count = match[1].replace(/,/g, "");
                          var num = parseFloat(count);
                          if (count.includes("K") || count.includes("k"))
                            num *= 1e3;
                          else if (count.includes("M") || count.includes("m"))
                            num *= 1e6;
                          else if (count.includes("B") || count.includes("b"))
                            num *= 1e9;
                          result.like_count = Math.floor(num);
                          break;
                        }
                      }
                    }
                    var commentButtons = document.querySelectorAll("button, span, a");
                    for (var _a2 = 0, commentButtons_1 = commentButtons; _a2 < commentButtons_1.length; _a2++) {
                      var el = commentButtons_1[_a2];
                      var text = (el.textContent || "").trim();
                      var ariaLabel = el.getAttribute("aria-label") || "";
                      if (ariaLabel.includes("comment") || ariaLabel.includes("Comment")) {
                        var match = ariaLabel.match(/([\d.,]+[KMB]?)\s*comments?/i) || text.match(/([\d.,]+[KMB]?)/);
                        if (match) {
                          var count = match[1].replace(/,/g, "");
                          var num = parseFloat(count);
                          if (count.includes("K") || count.includes("k"))
                            num *= 1e3;
                          else if (count.includes("M") || count.includes("m"))
                            num *= 1e6;
                          else if (count.includes("B") || count.includes("b"))
                            num *= 1e9;
                          result.comment_count = Math.floor(num);
                          break;
                        }
                      }
                    }
                    var viewElements = document.querySelectorAll("span, div");
                    for (var _b = 0, viewElements_1 = viewElements; _b < viewElements_1.length; _b++) {
                      var el = viewElements_1[_b];
                      var text = (el.textContent || "").trim();
                      if (text.match(/^[\d.,]+[KMB]?\s*views?$/i)) {
                        var match = text.match(/([\d.,]+[KMB]?)/);
                        if (match) {
                          var count = match[1].replace(/,/g, "");
                          var num = parseFloat(count);
                          if (count.includes("K") || count.includes("k"))
                            num *= 1e3;
                          else if (count.includes("M") || count.includes("m"))
                            num *= 1e6;
                          else if (count.includes("B") || count.includes("b"))
                            num *= 1e9;
                          result.view_count = Math.floor(num);
                          break;
                        }
                      }
                    }
                    var article = document.querySelector("article");
                    if (article) {
                      var spans = article.querySelectorAll("span");
                      for (var _c = 0, spans_3 = spans; _c < spans_3.length; _c++) {
                        var span = spans_3[_c];
                        var text = span.textContent || "";
                        if (text.length > 20 && text.length < 2e3 && !text.includes("Like") && !text.includes("Comment") && !text.includes("Share")) {
                          if (!result.caption) {
                            result.caption = text.trim();
                          }
                          var hashtags = text.match(/#\w+/g);
                          if (hashtags && hashtags.length > 0) {
                            result.hashtags = hashtags.map(function(h) {
                              return h.substring(1);
                            });
                          }
                          var mentions = text.match(/@\w+/g);
                          if (mentions && mentions.length > 0) {
                            result.mentions = mentions.map(function(m) {
                              return m.substring(1);
                            });
                          }
                        }
                      }
                    }
                    var carouselIndicators = document.querySelectorAll('[role="button"][aria-label*="carousel"], [aria-label*="Carousel"]');
                    if (carouselIndicators.length > 0) {
                      result.is_carousel = true;
                      result.carousel_media_count = carouselIndicators.length;
                    }
                    var videoElement = document.querySelector("video");
                    if (videoElement) {
                      result.is_video = true;
                    } else {
                      var images = document.querySelectorAll("article img");
                      if (images.length > 0) {
                        result.is_photo = true;
                      }
                    }
                    return result;
                  })];
                case 1:
                  data = _a.sent();
                  return [2, data];
                case 2:
                  error_4 = _a.sent();
                  this.logger.log("Failed to extract from DOM: ".concat(error_4), "debug");
                  return [2, null];
                case 3:
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
        RedditScraper3.prototype.extractVideoMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var e_1, postIdMatch, postId, metadata, apiData, embeddedData, domData, subredditMatch, subreddit, userMentions, _i, userMentions_1, mention, error_2;
            var _a, _b, _c, _d;
            return __generator(this, function(_e) {
              switch (_e.label) {
                case 0:
                  _e.trys.push([0, 14, , 15]);
                  this.logger.log("Extracting Reddit video metadata...", "info");
                  return [4, page.goto(videoUrl, { waitUntil: "domcontentloaded" })];
                case 1:
                  _e.sent();
                  return [4, this.delay(5e3)];
                case 2:
                  _e.sent();
                  _e.label = 3;
                case 3:
                  _e.trys.push([3, 5, , 6]);
                  return [4, page.waitForSelector('shreddit-post, [data-testid="post-container"], article, faceplate-number', { timeout: 5e3 })];
                case 4:
                  _e.sent();
                  return [3, 6];
                case 5:
                  e_1 = _e.sent();
                  this.logger.log("Post container selector not found, continuing anyway", "debug");
                  return [3, 6];
                case 6:
                  return [4, page.evaluate(function() {
                    window.scrollTo(0, document.body.scrollHeight / 2);
                  })];
                case 7:
                  _e.sent();
                  return [4, this.delay(2e3)];
                case 8:
                  _e.sent();
                  return [4, page.evaluate(function() {
                    window.scrollTo(0, 0);
                  })];
                case 9:
                  _e.sent();
                  return [4, this.delay(1e3)];
                case 10:
                  _e.sent();
                  postIdMatch = videoUrl.match(/\/comments\/([a-z0-9]+)/);
                  postId = postIdMatch ? postIdMatch[1] : null;
                  this.logger.log("Extracted post ID: ".concat(postId || "N/A"), "debug");
                  metadata = {
                    platform: "reddit",
                    url: videoUrl,
                    extractedAt: Date.now()
                  };
                  if (postId) {
                    metadata.video_id = postId;
                  }
                  this.logger.log("Attempting to fetch from Reddit JSON API...", "debug");
                  return [4, this.fetchFromRedditAPI(page, videoUrl)];
                case 11:
                  apiData = _e.sent();
                  if (apiData) {
                    this.logger.log("Reddit API data: ".concat(JSON.stringify(apiData)), "debug");
                    if (apiData.like_count !== void 0)
                      metadata.like_count = apiData.like_count;
                    if (apiData.comment_count !== void 0)
                      metadata.comment_count = apiData.comment_count;
                    if (apiData.view_count !== void 0)
                      metadata.view_count = apiData.view_count;
                    if (apiData.timestamp !== void 0)
                      metadata.timestamp = apiData.timestamp;
                    if (apiData.caption)
                      metadata.caption = apiData.caption;
                    if (apiData.is_video !== void 0)
                      metadata.is_video = apiData.is_video;
                    if (apiData.save_count !== void 0)
                      metadata.save_count = apiData.save_count;
                    if (apiData.upvote_ratio !== void 0)
                      metadata.upvote_ratio = apiData.upvote_ratio;
                    if (apiData.is_self !== void 0)
                      metadata.is_self = apiData.is_self;
                    if (apiData.is_gallery !== void 0)
                      metadata.is_gallery = apiData.is_gallery;
                    if (apiData.spoiler !== void 0)
                      metadata.spoiler = apiData.spoiler;
                    if (apiData.locked !== void 0)
                      metadata.locked = apiData.locked;
                    if (apiData.stickied !== void 0)
                      metadata.stickied = apiData.stickied;
                    if (apiData.over_18 !== void 0)
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
                  } else {
                    this.logger.log("No data from Reddit API, falling back to embedded JSON...", "debug");
                  }
                  this.logger.log("Attempting to extract from embedded JSON...", "debug");
                  return [4, this.extractFromEmbeddedJSON(page)];
                case 12:
                  embeddedData = _e.sent();
                  if (embeddedData) {
                    this.logger.log("Embedded JSON extracted: ".concat(JSON.stringify(embeddedData)), "debug");
                    if (embeddedData.like_count !== void 0) {
                      metadata.like_count = embeddedData.like_count;
                      this.logger.log("Like count from JSON: ".concat(embeddedData.like_count), "debug");
                    }
                    if (embeddedData.comment_count !== void 0) {
                      metadata.comment_count = embeddedData.comment_count;
                      this.logger.log("Comment count from JSON: ".concat(embeddedData.comment_count), "debug");
                    }
                    if (embeddedData.view_count !== void 0) {
                      metadata.view_count = embeddedData.view_count;
                      this.logger.log("View count from JSON: ".concat(embeddedData.view_count), "debug");
                    }
                    if (embeddedData.timestamp !== void 0) {
                      metadata.timestamp = embeddedData.timestamp;
                      this.logger.log("Timestamp from JSON: ".concat(new Date(embeddedData.timestamp * 1e3).toISOString()), "debug");
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
                    if (embeddedData.is_video !== void 0) {
                      metadata.is_video = embeddedData.is_video;
                      this.logger.log("Is video from JSON: ".concat(embeddedData.is_video), "debug");
                    }
                    if (embeddedData.save_count !== void 0) {
                      metadata.save_count = embeddedData.save_count;
                      this.logger.log("Save count (awards) from JSON: ".concat(embeddedData.save_count), "debug");
                    }
                    if (embeddedData.upvote_ratio !== void 0)
                      metadata.upvote_ratio = embeddedData.upvote_ratio;
                    if (embeddedData.is_self !== void 0)
                      metadata.is_self = embeddedData.is_self;
                    if (embeddedData.is_gallery !== void 0)
                      metadata.is_gallery = embeddedData.is_gallery;
                    if (embeddedData.spoiler !== void 0)
                      metadata.spoiler = embeddedData.spoiler;
                    if (embeddedData.locked !== void 0)
                      metadata.locked = embeddedData.locked;
                    if (embeddedData.stickied !== void 0)
                      metadata.stickied = embeddedData.stickied;
                    if (embeddedData.over_18 !== void 0)
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
                  } else {
                    this.logger.log("No data found in embedded JSON", "debug");
                  }
                  this.logger.log("Attempting to extract from DOM...", "debug");
                  return [4, this.extractFromDOM(page)];
                case 13:
                  domData = _e.sent();
                  if (domData) {
                    this.logger.log("DOM extracted: ".concat(JSON.stringify(domData)), "debug");
                    if (domData.like_count !== void 0 && !metadata.like_count) {
                      metadata.like_count = domData.like_count;
                      this.logger.log("Like count from DOM: ".concat(domData.like_count), "debug");
                    }
                    if (domData.comment_count !== void 0 && !metadata.comment_count) {
                      metadata.comment_count = domData.comment_count;
                      this.logger.log("Comment count from DOM: ".concat(domData.comment_count), "debug");
                    }
                    if (domData.view_count !== void 0 && !metadata.view_count) {
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
                    if (domData.timestamp !== void 0 && !metadata.timestamp) {
                      metadata.timestamp = domData.timestamp;
                      this.logger.log("Timestamp from DOM: ".concat(new Date(domData.timestamp * 1e3).toISOString()), "debug");
                    }
                    if (domData.is_video !== void 0) {
                      metadata.is_video = domData.is_video;
                      this.logger.log("Is video from DOM: ".concat(domData.is_video), "debug");
                    }
                    if (domData.save_count !== void 0 && !metadata.save_count) {
                      metadata.save_count = domData.save_count;
                      this.logger.log("Save count (awards) from DOM: ".concat(domData.save_count), "debug");
                    }
                    if (domData.upvote_ratio !== void 0 && metadata.upvote_ratio === void 0)
                      metadata.upvote_ratio = domData.upvote_ratio;
                    if (domData.is_self !== void 0 && metadata.is_self === void 0)
                      metadata.is_self = domData.is_self;
                    if (domData.is_gallery !== void 0 && metadata.is_gallery === void 0)
                      metadata.is_gallery = domData.is_gallery;
                    if (domData.spoiler !== void 0 && metadata.spoiler === void 0)
                      metadata.spoiler = domData.spoiler;
                    if (domData.locked !== void 0 && metadata.locked === void 0)
                      metadata.locked = domData.locked;
                    if (domData.stickied !== void 0 && metadata.stickied === void 0)
                      metadata.stickied = domData.stickied;
                    if (domData.over_18 !== void 0 && metadata.over_18 === void 0)
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
                  } else {
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
                  this.logger.log("Is Video: ".concat(metadata.is_video !== void 0 ? metadata.is_video : "N/A"), "info");
                  this.logger.log("Timestamp: ".concat(metadata.timestamp ? new Date(metadata.timestamp * 1e3).toISOString() : "N/A"), "info");
                  this.logger.log("--- Fields yt-dlp CANNOT get ---", "info");
                  this.logger.log("Upvote Ratio: ".concat(metadata.upvote_ratio !== void 0 ? metadata.upvote_ratio : "N/A"), "info");
                  this.logger.log("Is Self Post: ".concat(metadata.is_self !== void 0 ? metadata.is_self : "N/A"), "info");
                  this.logger.log("Is Gallery: ".concat(metadata.is_gallery !== void 0 ? metadata.is_gallery : "N/A"), "info");
                  this.logger.log("Spoiler: ".concat(metadata.spoiler !== void 0 ? metadata.spoiler : "N/A"), "info");
                  this.logger.log("Locked: ".concat(metadata.locked !== void 0 ? metadata.locked : "N/A"), "info");
                  this.logger.log("Stickied: ".concat(metadata.stickied !== void 0 ? metadata.stickied : "N/A"), "info");
                  this.logger.log("Over 18 (NSFW): ".concat(metadata.over_18 !== void 0 ? metadata.over_18 : "N/A"), "info");
                  this.logger.log("Link Flair: ".concat(metadata.link_flair_text || "N/A"), "info");
                  this.logger.log("Domain: ".concat(metadata.domain || "N/A"), "info");
                  this.logger.log("Author Fullname: ".concat(metadata.author_fullname || "N/A"), "info");
                  this.logger.log("Subreddit ID: ".concat(metadata.subreddit_id || "N/A"), "info");
                  this.logger.log("Has Selftext HTML: ".concat(metadata.selftext_html ? "Yes" : "No"), "info");
                  this.logger.log("=== END REDDIT METADATA ===", "info");
                  this.logger.log("Successfully extracted Reddit video metadata", "info");
                  return [2, metadata];
                case 14:
                  error_2 = _e.sent();
                  this.logger.log("Failed to extract Reddit video metadata: ".concat(error_2), "error");
                  return [2, null];
                case 15:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        RedditScraper3.prototype.fetchFromRedditAPI = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var jsonUrl, response, postData, result, error_3;
            var _this = this;
            var _a, _b, _c, _d;
            return __generator(this, function(_e) {
              switch (_e.label) {
                case 0:
                  _e.trys.push([0, 2, , 3]);
                  jsonUrl = videoUrl.replace(/\/$/, "") + ".json";
                  return [4, page.evaluate(function(url) {
                    return __awaiter(_this, void 0, void 0, function() {
                      var res, _a2;
                      return __generator(this, function(_b2) {
                        switch (_b2.label) {
                          case 0:
                            _b2.trys.push([0, 3, , 4]);
                            return [4, fetch(url, {
                              headers: { "User-Agent": "Mozilla/5.0" }
                            })];
                          case 1:
                            res = _b2.sent();
                            if (!res.ok)
                              return [2, null];
                            return [4, res.json()];
                          case 2:
                            return [2, _b2.sent()];
                          case 3:
                            _a2 = _b2.sent();
                            return [2, null];
                          case 4:
                            return [
                              2
                              /*return*/
                            ];
                        }
                      });
                    });
                  }, jsonUrl)];
                case 1:
                  response = _e.sent();
                  if (!response || !Array.isArray(response) || response.length === 0) {
                    return [2, null];
                  }
                  postData = (_d = (_c = (_b = (_a = response[0]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.children) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.data;
                  if (!postData)
                    return [2, null];
                  result = {};
                  if (postData.ups !== void 0)
                    result.like_count = postData.ups;
                  if (postData.score !== void 0 && !result.like_count)
                    result.like_count = postData.score;
                  if (postData.num_comments !== void 0)
                    result.comment_count = postData.num_comments;
                  if (postData.view_count !== void 0)
                    result.view_count = postData.view_count;
                  if (postData.title)
                    result.caption = postData.title;
                  if (postData.created_utc)
                    result.timestamp = Math.floor(postData.created_utc);
                  if (postData.is_video !== void 0)
                    result.is_video = postData.is_video;
                  if (postData.total_awards_received !== void 0)
                    result.save_count = postData.total_awards_received;
                  if (postData.upvote_ratio !== void 0)
                    result.upvote_ratio = postData.upvote_ratio;
                  if (postData.is_self !== void 0)
                    result.is_self = postData.is_self;
                  if (postData.is_gallery !== void 0)
                    result.is_gallery = postData.is_gallery;
                  if (postData.spoiler !== void 0)
                    result.spoiler = postData.spoiler;
                  if (postData.locked !== void 0)
                    result.locked = postData.locked;
                  if (postData.stickied !== void 0)
                    result.stickied = postData.stickied;
                  if (postData.over_18 !== void 0)
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
                  return [2, result];
                case 2:
                  error_3 = _e.sent();
                  this.logger.log("Failed to fetch from Reddit API: ".concat(error_3), "debug");
                  return [2, null];
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        RedditScraper3.prototype.extractFromEmbeddedJSON = function(page) {
          return __awaiter(this, void 0, void 0, function() {
            var data, error_4;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 2, , 3]);
                  return [4, page.evaluate(function() {
                    var _a2, _b, _c, _d, _e, _f, _g;
                    var result = {};
                    if (window.__r) {
                      var redditData = window.__r;
                      if ((_b = (_a2 = redditData === null || redditData === void 0 ? void 0 : redditData.data) === null || _a2 === void 0 ? void 0 : _a2.posts) === null || _b === void 0 ? void 0 : _b.models) {
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
                          if (post.upvoteRatio !== void 0)
                            result.upvote_ratio = post.upvoteRatio;
                          if (post.isSelf !== void 0)
                            result.is_self = post.isSelf;
                          if (post.isGallery !== void 0)
                            result.is_gallery = post.isGallery;
                          if (post.spoiler !== void 0)
                            result.spoiler = post.spoiler;
                          if (post.locked !== void 0)
                            result.locked = post.locked;
                          if (post.stickied !== void 0)
                            result.stickied = post.stickied;
                          if (post.over18 !== void 0)
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
                    var _loop_1 = function(script2) {
                      var content = script2.textContent || "";
                      if (content.includes('"ups"') || content.includes('"score"') || content.includes('"numComments"')) {
                        try {
                          var json = JSON.parse(content);
                          var findPostData_1 = function(obj) {
                            if (!obj || typeof obj !== "object")
                              return null;
                            if (obj.ups !== void 0 || obj.score !== void 0 || obj.numComments !== void 0) {
                              return obj;
                            }
                            for (var key in obj) {
                              var found = findPostData_1(obj[key]);
                              if (found)
                                return found;
                            }
                            return null;
                          };
                          var post2 = findPostData_1(json);
                          if (post2) {
                            if (!result.like_count)
                              result.like_count = post2.ups || post2.score;
                            if (!result.comment_count)
                              result.comment_count = post2.numComments || post2.num_comments || post2.commentCount;
                            if (!result.view_count)
                              result.view_count = post2.viewCount || post2.view_count || post2.views;
                            if (!result.caption)
                              result.caption = post2.title || post2.titleText;
                            if (!result.timestamp && (post2.created || post2.createdUTC)) {
                              result.timestamp = post2.created || post2.createdUTC;
                            }
                            if ((post2.isVideo || ((_d = post2.media) === null || _d === void 0 ? void 0 : _d.isVideo)) && !result.is_video) {
                              result.is_video = true;
                            }
                            if (post2.awards && !result.save_count) {
                              result.save_count = post2.awards.totalAwardsReceived || post2.awards.total_awards_received || post2.totalAwardsReceived;
                            }
                            if (post2.upvote_ratio !== void 0 && !result.upvote_ratio)
                              result.upvote_ratio = post2.upvote_ratio;
                            if (post2.is_self !== void 0 && result.is_self === void 0)
                              result.is_self = post2.is_self;
                            if (post2.is_gallery !== void 0 && result.is_gallery === void 0)
                              result.is_gallery = post2.is_gallery;
                            if (post2.spoiler !== void 0 && result.spoiler === void 0)
                              result.spoiler = post2.spoiler;
                            if (post2.locked !== void 0 && result.locked === void 0)
                              result.locked = post2.locked;
                            if (post2.stickied !== void 0 && result.stickied === void 0)
                              result.stickied = post2.stickied;
                            if (post2.over_18 !== void 0 && result.over_18 === void 0)
                              result.over_18 = post2.over_18;
                            if (post2.link_flair_text && !result.link_flair_text)
                              result.link_flair_text = post2.link_flair_text;
                            if (post2.link_flair_css_class && !result.link_flair_css_class)
                              result.link_flair_css_class = post2.link_flair_css_class;
                            if (post2.domain && !result.domain)
                              result.domain = post2.domain;
                            if (post2.selftext_html && !result.selftext_html)
                              result.selftext_html = post2.selftext_html;
                            if (post2.author_fullname && !result.author_fullname)
                              result.author_fullname = post2.author_fullname;
                          }
                        } catch (e) {
                          if (content.includes("window.__r = ")) {
                            try {
                              var match = content.match(/window\.__r\s*=\s*({.+?});/s);
                              if (match) {
                                var json = JSON.parse(match[1]);
                                var posts = (_f = (_e = json === null || json === void 0 ? void 0 : json.data) === null || _e === void 0 ? void 0 : _e.posts) === null || _f === void 0 ? void 0 : _f.models;
                                if (posts) {
                                  var post2 = Object.values(posts)[0];
                                  if (post2) {
                                    if (!result.like_count)
                                      result.like_count = post2.ups || post2.score;
                                    if (!result.comment_count)
                                      result.comment_count = post2.numComments || post2.num_comments || post2.commentCount;
                                    if (!result.view_count)
                                      result.view_count = post2.viewCount || post2.view_count || post2.views;
                                    if (!result.caption)
                                      result.caption = post2.title || post2.titleText;
                                    if (!result.timestamp && (post2.created || post2.createdUTC)) {
                                      result.timestamp = post2.created || post2.createdUTC;
                                    }
                                    if ((post2.isVideo || ((_g = post2.media) === null || _g === void 0 ? void 0 : _g.isVideo)) && !result.is_video) {
                                      result.is_video = true;
                                    }
                                    if (post2.awards && !result.save_count) {
                                      result.save_count = post2.awards.totalAwardsReceived || post2.awards.total_awards_received || post2.totalAwardsReceived;
                                    }
                                    if (post2.upvoteRatio !== void 0 && !result.upvote_ratio)
                                      result.upvote_ratio = post2.upvoteRatio;
                                    if (post2.isSelf !== void 0 && result.is_self === void 0)
                                      result.is_self = post2.isSelf;
                                    if (post2.isGallery !== void 0 && result.is_gallery === void 0)
                                      result.is_gallery = post2.isGallery;
                                    if (post2.spoiler !== void 0 && result.spoiler === void 0)
                                      result.spoiler = post2.spoiler;
                                    if (post2.locked !== void 0 && result.locked === void 0)
                                      result.locked = post2.locked;
                                    if (post2.stickied !== void 0 && result.stickied === void 0)
                                      result.stickied = post2.stickied;
                                    if (post2.over18 !== void 0 && result.over_18 === void 0)
                                      result.over_18 = post2.over18;
                                    if (post2.linkFlairText && !result.link_flair_text)
                                      result.link_flair_text = post2.linkFlairText;
                                    if (post2.linkFlairCssClass && !result.link_flair_css_class)
                                      result.link_flair_css_class = post2.linkFlairCssClass;
                                    if (post2.domain && !result.domain)
                                      result.domain = post2.domain;
                                    if (post2.selftextHtml && !result.selftext_html)
                                      result.selftext_html = post2.selftextHtml;
                                    if (post2.authorFullname && !result.author_fullname)
                                      result.author_fullname = post2.authorFullname;
                                  }
                                }
                              }
                            } catch (e2) {
                              return "continue";
                            }
                          } else {
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
                  return [2, data];
                case 2:
                  error_4 = _a.sent();
                  this.logger.log("Failed to extract from embedded JSON: ".concat(error_4), "debug");
                  return [2, null];
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        RedditScraper3.prototype.extractFromDOM = function(page) {
          return __awaiter(this, void 0, void 0, function() {
            var data, error_5;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 2, , 3]);
                  return [4, page.evaluate(function() {
                    var _a2, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    var result = {};
                    var scoreSelectors = [
                      '[data-testid="vote-arrows"] + span',
                      '[data-click-id="upvote"] + span',
                      'button[aria-label*="upvote"] + span',
                      '[class*="vote"] [class*="score"]',
                      '[data-testid="post-score"]',
                      "faceplate-number[number]",
                      '[data-testid="vote-arrows"] faceplate-number',
                      "shreddit-post faceplate-number",
                      '[slot="score"]',
                      'span[slot="score"]'
                    ];
                    for (var _i = 0, scoreSelectors_1 = scoreSelectors; _i < scoreSelectors_1.length; _i++) {
                      var selector = scoreSelectors_1[_i];
                      var elements = document.querySelectorAll(selector);
                      for (var _l = 0, elements_2 = elements; _l < elements_2.length; _l++) {
                        var el = elements_2[_l];
                        var text = (el.textContent || "").trim();
                        var numberAttr = el.getAttribute("number");
                        if (numberAttr) {
                          var num = parseInt(numberAttr);
                          if (num > 0 && num < 1e8) {
                            result.like_count = num;
                            break;
                          }
                        }
                        if (text && /^[\d,]+[KMB]?$/.test(text)) {
                          var num = parseFloat(text.replace(/,/g, "").replace(/[KMB]/i, ""));
                          if (text.includes("K") || text.includes("k"))
                            num *= 1e3;
                          else if (text.includes("M") || text.includes("m"))
                            num *= 1e6;
                          else if (text.includes("B") || text.includes("b"))
                            num *= 1e9;
                          if (num > 0 && num < 1e8) {
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
                        ".vote-button",
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
                              var numberAttr = scoreEl.getAttribute("number");
                              if (numberAttr) {
                                var num = parseInt(numberAttr);
                                if (num > 0 && num < 1e8) {
                                  result.like_count = num;
                                  break;
                                }
                              }
                            }
                            var scoreText = parent_1.textContent || "";
                            var scoreMatch = scoreText.match(/([\d,]+[KMB]?)\s*(?:upvotes?|points?|karma)/i);
                            if (scoreMatch) {
                              var num = parseFloat(scoreMatch[1].replace(/,/g, "").replace(/[KMB]/i, ""));
                              if (scoreMatch[1].includes("K") || scoreMatch[1].includes("k"))
                                num *= 1e3;
                              else if (scoreMatch[1].includes("M") || scoreMatch[1].includes("m"))
                                num *= 1e6;
                              else if (scoreMatch[1].includes("B") || scoreMatch[1].includes("b"))
                                num *= 1e9;
                              if (num > 0 && num < 1e8) {
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
                        var isCommentLink = el.tagName === "A" && ((_a2 = el.getAttribute("href")) === null || _a2 === void 0 ? void 0 : _a2.includes("/comments/"));
                        var hasCommentText = ((_b = el.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes("comment")) || ((_c = el.getAttribute("aria-label")) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes("comment"));
                        if (!isCommentLink && !hasCommentText)
                          continue;
                        var numberEl = el.querySelector("faceplate-number[number]") || (el.tagName === "FACEPLATE-NUMBER" ? el : null);
                        if (numberEl) {
                          var numberAttr = numberEl.getAttribute("number");
                          if (numberAttr) {
                            var num = parseInt(numberAttr);
                            if (num >= 0 && num < 1e7 && num !== result.like_count) {
                              result.comment_count = num;
                              break;
                            }
                          }
                        }
                        var text = (el.textContent || "").trim();
                        var ariaLabel = el.getAttribute("aria-label") || "";
                        var searchText = text || ariaLabel;
                        if (searchText && (searchText.toLowerCase().includes("comment") || /^[\d,]+[KMB]?\s*(comment|comments)?$/i.test(searchText))) {
                          var match = searchText.match(/([\d,]+[KMB]?)/);
                          if (match) {
                            var num = parseFloat(match[1].replace(/,/g, "").replace(/[KMB]/i, ""));
                            var matchText = match[1];
                            if (matchText.includes("K") || matchText.includes("k"))
                              num *= 1e3;
                            else if (matchText.includes("M") || matchText.includes("m"))
                              num *= 1e6;
                            else if (matchText.includes("B") || matchText.includes("b"))
                              num *= 1e9;
                            var finalNum = Math.floor(num);
                            if (finalNum >= 0 && finalNum < 1e7 && finalNum !== result.like_count) {
                              result.comment_count = finalNum;
                              break;
                            }
                          }
                        }
                      }
                      if (result.comment_count !== void 0)
                        break;
                    }
                    if (!result.comment_count) {
                      var postContainer = document.querySelector('shreddit-post, [data-testid="post-container"], article');
                      if (postContainer) {
                        var commentButton = postContainer.querySelector('a[href*="/comments/"][href*="#"]') || postContainer.querySelector('button[aria-label*="comment"]') || postContainer.querySelector('a[href*="/comments/"]');
                        if (commentButton) {
                          var faceplateNumber = commentButton.querySelector("faceplate-number[number]") || ((_d = commentButton.closest("div")) === null || _d === void 0 ? void 0 : _d.querySelector("faceplate-number[number]"));
                          if (faceplateNumber) {
                            var numberAttr = faceplateNumber.getAttribute("number");
                            if (numberAttr) {
                              var num = parseInt(numberAttr);
                              if (num >= 0 && num < 1e7 && num !== result.like_count) {
                                result.comment_count = num;
                              }
                            }
                          }
                          if (!result.comment_count) {
                            var text = commentButton.textContent || "";
                            var match = text.match(/([\d,]+[KMB]?)\s*(?:comment|comments)?/i);
                            if (match) {
                              var num = parseFloat(match[1].replace(/,/g, "").replace(/[KMB]/i, ""));
                              if (match[1].includes("K") || match[1].includes("k"))
                                num *= 1e3;
                              else if (match[1].includes("M") || match[1].includes("m"))
                                num *= 1e6;
                              else if (match[1].includes("B") || match[1].includes("b"))
                                num *= 1e9;
                              var finalNum = Math.floor(num);
                              if (finalNum >= 0 && finalNum < 1e7 && finalNum !== result.like_count) {
                                result.comment_count = finalNum;
                              }
                            }
                          }
                        }
                      }
                    }
                    if (!result.comment_count) {
                      var voteSection = (_f = (_e = document.querySelector('[data-testid="vote-arrows"], [data-click-id="upvote"]')) === null || _e === void 0 ? void 0 : _e.closest("div")) === null || _f === void 0 ? void 0 : _f.parentElement;
                      if (voteSection) {
                        var commentButton = voteSection.querySelector('a[href*="/comments/"]:not([href*="/comment/"])');
                        if (commentButton) {
                          var faceplate = commentButton.querySelector("faceplate-number[number]") || ((_g = commentButton.parentElement) === null || _g === void 0 ? void 0 : _g.querySelector("faceplate-number[number]"));
                          if (faceplate) {
                            var num = parseInt(faceplate.getAttribute("number") || "0");
                            if (num > 0 && num < 1e7 && num !== result.like_count) {
                              result.comment_count = num;
                            }
                          }
                          if (!result.comment_count) {
                            var text = commentButton.textContent || "";
                            var match = text.match(/([\d,]+[KMB]?)/);
                            if (match) {
                              var num = parseFloat(match[1].replace(/,/g, "").replace(/[KMB]/i, ""));
                              if (match[1].includes("K") || match[1].includes("k"))
                                num *= 1e3;
                              else if (match[1].includes("M") || match[1].includes("m"))
                                num *= 1e6;
                              else if (match[1].includes("B") || match[1].includes("b"))
                                num *= 1e9;
                              var finalNum = Math.floor(num);
                              if (finalNum > 0 && finalNum < 1e7 && finalNum !== result.like_count) {
                                result.comment_count = finalNum;
                              }
                            }
                          }
                        }
                      }
                    }
                    if (!result.comment_count) {
                      var firstFaceplate = document.querySelector("faceplate-number[number]");
                      if (firstFaceplate) {
                        var firstNum = parseInt(firstFaceplate.getAttribute("number") || "0");
                        var allFaceplates = Array.from(document.querySelectorAll("faceplate-number[number]"));
                        for (var _r = 0, allFaceplates_1 = allFaceplates; _r < allFaceplates_1.length; _r++) {
                          var fp = allFaceplates_1[_r];
                          var num = parseInt(fp.getAttribute("number") || "0");
                          if (num > 0 && num < 1e7 && num !== result.like_count && num !== firstNum) {
                            var nearbyText = ((_j = (_h = fp.parentElement) === null || _h === void 0 ? void 0 : _h.textContent) === null || _j === void 0 ? void 0 : _j.toLowerCase()) || "";
                            if (nearbyText.includes("comment") || nearbyText.match(/\d+\s*(comment|comments)/)) {
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
                        var text = (el.textContent || "").trim();
                        var title = el.getAttribute("title") || "";
                        var searchText = text || title;
                        if (searchText && searchText.toLowerCase().includes("view")) {
                          var match = searchText.match(/([\d,]+[KMB]?)/);
                          if (match) {
                            var num = parseFloat(match[1].replace(/,/g, "").replace(/[KMB]/i, ""));
                            var matchText = match[1];
                            if (matchText.includes("K") || matchText.includes("k"))
                              num *= 1e3;
                            else if (matchText.includes("M") || matchText.includes("m"))
                              num *= 1e6;
                            else if (matchText.includes("B") || matchText.includes("b"))
                              num *= 1e9;
                            result.view_count = Math.floor(num);
                            break;
                          }
                        }
                      }
                    }
                    var titleSelectors = [
                      '[data-testid="post-content"] h1',
                      'h1[data-testid="post-title"]',
                      "h1",
                      '[data-click-id="body"] h1',
                      "article h1"
                    ];
                    for (var _t = 0, titleSelectors_1 = titleSelectors; _t < titleSelectors_1.length; _t++) {
                      var selector = titleSelectors_1[_t];
                      var el = document.querySelector(selector);
                      if (el) {
                        var text = (el.textContent || "").trim();
                        if (text && text.length > 0) {
                          result.caption = text;
                          var hashtags = text.match(/#\w+/g);
                          if (hashtags) {
                            result.hashtags = hashtags.map(function(h) {
                              return h.substring(1);
                            });
                          }
                          break;
                        }
                      }
                    }
                    var timeSelectors = [
                      '[data-testid="post-timestamp"]',
                      "time",
                      '[title*="ago"]',
                      '[aria-label*="ago"]'
                    ];
                    for (var _u = 0, timeSelectors_1 = timeSelectors; _u < timeSelectors_1.length; _u++) {
                      var selector = timeSelectors_1[_u];
                      var el = document.querySelector(selector);
                      if (el) {
                        var datetime = el.getAttribute("datetime") || el.getAttribute("title") || "";
                        if (datetime) {
                          var date = new Date(datetime);
                          if (!isNaN(date.getTime())) {
                            result.timestamp = Math.floor(date.getTime() / 1e3);
                            break;
                          }
                        }
                        var text = (el.textContent || "").trim();
                        if (text && text.includes("ago")) {
                          var now = Date.now();
                          var hoursAgo = text.match(/(\d+)\s*hour/i);
                          var daysAgo = text.match(/(\d+)\s*day/i);
                          var monthsAgo = text.match(/(\d+)\s*month/i);
                          var yearsAgo = text.match(/(\d+)\s*year/i);
                          var timestamp = now;
                          if (yearsAgo)
                            timestamp -= parseInt(yearsAgo[1]) * 365 * 24 * 60 * 60 * 1e3;
                          else if (monthsAgo)
                            timestamp -= parseInt(monthsAgo[1]) * 30 * 24 * 60 * 60 * 1e3;
                          else if (daysAgo)
                            timestamp -= parseInt(daysAgo[1]) * 24 * 60 * 60 * 1e3;
                          else if (hoursAgo)
                            timestamp -= parseInt(hoursAgo[1]) * 60 * 60 * 1e3;
                          result.timestamp = Math.floor(timestamp / 1e3);
                          break;
                        }
                      }
                    }
                    var shredditPost = document.querySelector("shreddit-post");
                    if (shredditPost) {
                      var postType = shredditPost.getAttribute("post-type");
                      var contentHref = shredditPost.getAttribute("content-href") || "";
                      var isVideoPost = postType === "video" || contentHref.includes("v.redd.it") || shredditPost.querySelector("shreddit-player, shreddit-player-2") !== null;
                      var isImagePost = postType === "image" || shredditPost.querySelector("shreddit-aspect-ratio img, gallery-carousel") !== null;
                      var isGallery = postType === "gallery" || shredditPost.querySelector("gallery-carousel") !== null;
                      if (isVideoPost) {
                        result.is_video = true;
                      } else if (isImagePost || isGallery) {
                        result.is_video = false;
                      }
                      if (isGallery)
                        result.is_gallery = true;
                      if (postType === "self" || postType === "text")
                        result.is_self = true;
                      else if (postType === "link" || postType === "video" || postType === "image")
                        result.is_self = false;
                      var hasSpoiler = shredditPost.hasAttribute("spoiler") || shredditPost.getAttribute("is-spoiler") === "true" || shredditPost.querySelector('[slot="spoiler-tag"]') !== null;
                      result.spoiler = hasSpoiler;
                      var isLocked = shredditPost.hasAttribute("locked") || shredditPost.getAttribute("is-locked") === "true" || shredditPost.querySelector('[data-testid="locked-badge"]') !== null;
                      result.locked = isLocked;
                      var isStickied = shredditPost.hasAttribute("stickied") || shredditPost.getAttribute("is-stickied") === "true" || shredditPost.getAttribute("pinned") === "true";
                      result.stickied = isStickied;
                      var isNsfw = shredditPost.hasAttribute("nsfw") || shredditPost.hasAttribute("over-18") || shredditPost.getAttribute("is-nsfw") === "true" || shredditPost.querySelector('[slot="nsfw-tag"], [data-testid="nsfw-badge"]') !== null;
                      result.over_18 = isNsfw;
                      var flairEl = shredditPost.querySelector('flair-tag, [slot="flair"], shreddit-post-flair, [data-testid="post-flair"]');
                      if (flairEl) {
                        result.link_flair_text = ((_k = flairEl.textContent) === null || _k === void 0 ? void 0 : _k.trim()) || void 0;
                      }
                      var flairAttr = shredditPost.getAttribute("link-flair-text") || shredditPost.getAttribute("flair");
                      if (flairAttr && !result.link_flair_text) {
                        result.link_flair_text = flairAttr;
                      }
                      if (contentHref) {
                        try {
                          var url = new URL(contentHref);
                          result.domain = url.hostname;
                        } catch (_v) {
                          var domainMatch = contentHref.match(/https?:\/\/([^\/]+)/);
                          if (domainMatch)
                            result.domain = domainMatch[1];
                        }
                      }
                      var authorId = shredditPost.getAttribute("author-id");
                      if (authorId)
                        result.author_fullname = authorId;
                      var subredditId = shredditPost.getAttribute("subreddit-id");
                      if (subredditId)
                        result.subreddit_id = subredditId;
                      var scoreAttr = shredditPost.getAttribute("score");
                      var upvoteRatioAttr = shredditPost.getAttribute("upvote-ratio");
                      if (upvoteRatioAttr && !result.upvote_ratio) {
                        result.upvote_ratio = parseFloat(upvoteRatioAttr);
                      }
                    }
                    if (result.is_video === void 0) {
                      var videoElement = document.querySelector('video, [data-testid="video-player"], vreddit-player, shreddit-player');
                      if (videoElement) {
                        result.is_video = true;
                      } else {
                        var postContainer = document.querySelector('shreddit-post, [data-testid="post-container"], article');
                        if (postContainer) {
                          var hasVideo = postContainer.querySelector('video, vreddit-player, [data-testid="video-player"], shreddit-player');
                          if (hasVideo) {
                            result.is_video = true;
                          } else {
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
                        var text = (el.textContent || "").trim();
                        var title = el.getAttribute("title") || "";
                        var searchText = text || title;
                        if (searchText && searchText.toLowerCase().includes("award")) {
                          var match = searchText.match(/([\d,]+)/);
                          if (match) {
                            result.save_count = parseInt(match[1].replace(/,/g, ""));
                            break;
                          }
                        }
                      }
                    }
                    return result;
                  })];
                case 1:
                  data = _a.sent();
                  return [2, data];
                case 2:
                  error_5 = _a.sent();
                  this.logger.log("Failed to extract from DOM: ".concat(error_5), "debug");
                  return [2, null];
                case 3:
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
    var __spreadArray = exports2 && exports2.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
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
        TwitchScraper3.prototype.detectContentType = function(url) {
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
        TwitchScraper3.prototype.extractVideoId = function(url) {
          var vodMatch = url.match(/\/videos\/(\d+)/);
          if (vodMatch)
            return vodMatch[1];
          return null;
        };
        TwitchScraper3.prototype.extractClipSlug = function(url) {
          var clipMatch = url.match(/\/clip\/([^\/\?]+)/);
          if (clipMatch)
            return clipMatch[1];
          var clipsMatch = url.match(/clips\.twitch\.tv\/([^\/\?]+)/);
          if (clipsMatch)
            return clipsMatch[1];
          return null;
        };
        TwitchScraper3.prototype.getCreatorProfileUrl = function(videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var match;
            return __generator(this, function(_a) {
              try {
                match = videoUrl.match(/twitch\.tv\/([^\/\?]+)/);
                if (match && match[1] !== "videos" && match[1] !== "clip" && match[1] !== "directory") {
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
        TwitchScraper3.prototype.extractVideoMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var contentType, gqlData_1, responseHandler, metadata, _a, error_1;
            var _this = this;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  _b.trys.push([0, 12, , 13]);
                  contentType = this.detectContentType(videoUrl);
                  this.logger.log("Extracting Twitch ".concat(contentType, " metadata via GraphQL..."), "info");
                  gqlData_1 = /* @__PURE__ */ new Map();
                  responseHandler = function(response) {
                    return __awaiter(_this, void 0, void 0, function() {
                      var reqUrl, json, responses, _i, responses_1, resp, opName, e_1;
                      var _a2;
                      return __generator(this, function(_b2) {
                        switch (_b2.label) {
                          case 0:
                            reqUrl = response.url();
                            if (!(reqUrl.includes("gql.twitch.tv") || reqUrl.includes("/gql"))) return [3, 4];
                            _b2.label = 1;
                          case 1:
                            _b2.trys.push([1, 3, , 4]);
                            return [4, response.json()];
                          case 2:
                            json = _b2.sent();
                            responses = Array.isArray(json) ? json : [json];
                            for (_i = 0, responses_1 = responses; _i < responses_1.length; _i++) {
                              resp = responses_1[_i];
                              opName = (_a2 = resp === null || resp === void 0 ? void 0 : resp.extensions) === null || _a2 === void 0 ? void 0 : _a2.operationName;
                              if (opName && (resp === null || resp === void 0 ? void 0 : resp.data)) {
                                gqlData_1.set(opName, resp.data);
                              }
                            }
                            return [3, 4];
                          case 3:
                            e_1 = _b2.sent();
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
                  page.on("response", responseHandler);
                  _b.label = 1;
                case 1:
                  _b.trys.push([1, , 4, 5]);
                  return [4, page.goto(videoUrl, { waitUntil: "domcontentloaded", timeout: 6e4 })];
                case 2:
                  _b.sent();
                  return [4, this.delay(8e3)];
                case 3:
                  _b.sent();
                  return [3, 5];
                case 4:
                  page.off("response", responseHandler);
                  return [
                    7
                    /*endfinally*/
                  ];
                case 5:
                  metadata = {
                    platform: "twitch",
                    url: videoUrl,
                    extractedAt: Date.now(),
                    twitch_content_type: contentType
                  };
                  _a = contentType;
                  switch (_a) {
                    case "vod":
                      return [3, 6];
                    case "clip":
                      return [3, 7];
                    case "stream":
                      return [3, 9];
                  }
                  return [3, 11];
                case 6:
                  this.extractVodFromGql(gqlData_1, videoUrl, metadata);
                  return [3, 11];
                case 7:
                  return [4, this.extractClipFromGql(gqlData_1, page, videoUrl, metadata)];
                case 8:
                  _b.sent();
                  return [3, 11];
                case 9:
                  return [4, this.extractStreamFromGql(gqlData_1, page, metadata)];
                case 10:
                  _b.sent();
                  return [3, 11];
                case 11:
                  this.extractChannelFromGql(gqlData_1, metadata);
                  this.logger.log("Successfully extracted Twitch ".concat(contentType, " metadata"), "info");
                  return [2, metadata];
                case 12:
                  error_1 = _b.sent();
                  this.logger.log("Failed to extract Twitch video metadata: ".concat(error_1), "error");
                  return [2, null];
                case 13:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        TwitchScraper3.prototype.extractVodFromGql = function(gqlData, url, metadata) {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
          var videoId = this.extractVideoId(url);
          if (videoId) {
            metadata.video_id = videoId;
          }
          var videoMetadata = gqlData.get("VideoMetadata");
          if (videoMetadata === null || videoMetadata === void 0 ? void 0 : videoMetadata.video) {
            var video = videoMetadata.video;
            if (video.id)
              metadata.video_id = video.id;
            if (video.title)
              metadata.title = video.title;
            if (video.description !== void 0 && video.description !== null)
              metadata.description = video.description;
            if (video.createdAt)
              metadata.created_at = video.createdAt;
            if (video.publishedAt)
              metadata.published_at = video.publishedAt;
            if (video.viewCount !== void 0)
              metadata.view_count = video.viewCount;
            if (video.lengthSeconds !== void 0)
              metadata.duration = video.lengthSeconds;
            if (video.language)
              metadata.language = video.language;
            if (video.previewThumbnailURL)
              metadata.thumbnail_url = video.previewThumbnailURL;
            if (video.owner) {
              if (video.owner.id)
                metadata.user_id = video.owner.id;
              if (video.owner.login)
                metadata.user_login = video.owner.login;
              if (video.owner.displayName)
                metadata.user_name = video.owner.displayName;
            }
            if ((_a = video.game) === null || _a === void 0 ? void 0 : _a.id)
              metadata.game_id = video.game.id;
            if ((_b = video.game) === null || _b === void 0 ? void 0 : _b.name)
              metadata.game_name = video.game.name;
          }
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
          var adData = gqlData.get("AdRequestHandling");
          if (adData === null || adData === void 0 ? void 0 : adData.video) {
            if (!metadata.video_id && adData.video.id)
              metadata.video_id = adData.video.id;
            if (!metadata.title && adData.video.title)
              metadata.title = adData.video.title;
            if (adData.video.lengthSeconds !== void 0 && metadata.duration === void 0) {
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
            if (((_f = (_e = adData.video.owner) === null || _e === void 0 ? void 0 : _e.broadcastSettings) === null || _f === void 0 ? void 0 : _f.isMature) !== void 0) {
              metadata.is_mature = adData.video.owner.broadcastSettings.isMature;
            }
            if (adData.video.broadcastType) {
              metadata.vod_type = adData.video.broadcastType;
            }
          }
          var channelVideo = gqlData.get("ChannelVideoCore");
          if ((_g = channelVideo === null || channelVideo === void 0 ? void 0 : channelVideo.video) === null || _g === void 0 ? void 0 : _g.owner) {
            if (!metadata.user_id && channelVideo.video.owner.id)
              metadata.user_id = channelVideo.video.owner.id;
            if (!metadata.user_login && channelVideo.video.owner.login)
              metadata.user_login = channelVideo.video.owner.login;
            if (!metadata.user_name && channelVideo.video.owner.displayName)
              metadata.user_name = channelVideo.video.owner.displayName;
          }
          var seekbarPreviewData = gqlData.get("VideoPlayer_VODSeekbarPreviewVideo");
          if ((_h = seekbarPreviewData === null || seekbarPreviewData === void 0 ? void 0 : seekbarPreviewData.video) === null || _h === void 0 ? void 0 : _h.seekPreviewsURL) {
            var seekUrl = seekbarPreviewData.video.seekPreviewsURL;
            var broadcastMatch = seekUrl.match(/_(\d{12,})_\d+\/storyboards/);
            if (broadcastMatch) {
              metadata.stream_id = broadcastMatch[1];
            }
          }
          var mutedData = gqlData.get("VideoPlayer_MutedSegmentsAlertOverlay");
          if ((_l = (_k = (_j = mutedData === null || mutedData === void 0 ? void 0 : mutedData.video) === null || _j === void 0 ? void 0 : _j.muteInfo) === null || _k === void 0 ? void 0 : _k.mutedSegmentConnection) === null || _l === void 0 ? void 0 : _l.nodes) {
            var nodes = mutedData.video.muteInfo.mutedSegmentConnection.nodes;
            if (nodes.length > 0) {
              metadata.muted_segments = nodes.map(function(n) {
                return {
                  offset: n.offset,
                  duration: n.duration
                };
              });
            }
          }
          var seekbarData = gqlData.get("VideoPlayer_VODSeekbar");
          if (!metadata.muted_segments && ((_p = (_o = (_m = seekbarData === null || seekbarData === void 0 ? void 0 : seekbarData.video) === null || _m === void 0 ? void 0 : _m.muteInfo) === null || _o === void 0 ? void 0 : _o.mutedSegmentConnection) === null || _p === void 0 ? void 0 : _p.nodes)) {
            var nodes = seekbarData.video.muteInfo.mutedSegmentConnection.nodes;
            if (nodes.length > 0) {
              metadata.muted_segments = nodes.map(function(n) {
                return {
                  offset: n.offset,
                  duration: n.duration
                };
              });
            }
          }
          var policyData = gqlData.get("ContentPolicyPropertiesQuery");
          if (((_r = (_q = policyData === null || policyData === void 0 ? void 0 : policyData.video) === null || _q === void 0 ? void 0 : _q.contentPolicyProperties) === null || _r === void 0 ? void 0 : _r.hasBrandedContent) !== void 0) {
            metadata.is_branded_content = policyData.video.contentPolicyProperties.hasBrandedContent;
          }
          var classificationData = gqlData.get("ContentClassificationContext");
          if ((_s = classificationData === null || classificationData === void 0 ? void 0 : classificationData.video) === null || _s === void 0 ? void 0 : _s.contentClassificationLabels) {
            var labels = classificationData.video.contentClassificationLabels;
            if (labels.length > 0) {
              metadata.content_classification_labels = labels;
            }
          }
          var watchData = gqlData.get("WatchTrackQuery");
          if (watchData === null || watchData === void 0 ? void 0 : watchData.video) {
            if (!metadata.vod_type && watchData.video.broadcastType) {
              metadata.vod_type = watchData.video.broadcastType;
            }
            if (metadata.view_count === void 0 && watchData.video.viewCount !== void 0) {
              metadata.view_count = watchData.video.viewCount;
            }
          }
          var playerTracking = gqlData.get("PlayerTrackingContextQuery");
          if (playerTracking === null || playerTracking === void 0 ? void 0 : playerTracking.video) {
            if (!metadata.vod_type && playerTracking.video.broadcastType) {
              metadata.vod_type = playerTracking.video.broadcastType;
            }
            if (metadata.view_count === void 0 && playerTracking.video.viewCount !== void 0) {
              metadata.view_count = playerTracking.video.viewCount;
            }
          }
        };
        TwitchScraper3.prototype.extractClipFromGql = function(gqlData, page, url, metadata) {
          return __awaiter(this, void 0, void 0, function() {
            var clipSlug, chatClip, clip, clipCore, clip, feedClip, clip, trackingData, clip, classificationData, labels, shelvesData, _i, _a, edge, _b, _c, item, clipData;
            var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            return __generator(this, function(_p) {
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
                    if (clip.videoOffsetSeconds !== void 0)
                      metadata.vod_offset = clip.videoOffsetSeconds;
                    if ((_d = clip.video) === null || _d === void 0 ? void 0 : _d.id)
                      metadata.source_video_id = clip.video.id;
                  }
                  clipCore = gqlData.get("ChannelClipCore");
                  if (clipCore === null || clipCore === void 0 ? void 0 : clipCore.clip) {
                    clip = clipCore.clip;
                    if (clip.isFeatured !== void 0)
                      metadata.is_featured = clip.isFeatured;
                    if (clip.videoOffsetSeconds !== void 0 && metadata.vod_offset === void 0) {
                      metadata.vod_offset = clip.videoOffsetSeconds;
                    }
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
                    if (clip.id)
                      metadata.video_id = clip.id;
                    if (clip.slug)
                      metadata.video_id = clip.slug;
                    if (clip.title)
                      metadata.title = clip.title;
                    if (clip.viewCount !== void 0)
                      metadata.view_count = clip.viewCount;
                    if (clip.createdAt)
                      metadata.created_at = clip.createdAt;
                    if (clip.durationSeconds !== void 0)
                      metadata.duration = clip.durationSeconds;
                    if (clip.language)
                      metadata.language = clip.language;
                    if (clip.thumbnailURL)
                      metadata.thumbnail_url = clip.thumbnailURL;
                    if (clip.broadcaster) {
                      if (!metadata.user_id && clip.broadcaster.id)
                        metadata.user_id = clip.broadcaster.id;
                      if (!metadata.user_login && clip.broadcaster.login)
                        metadata.user_login = clip.broadcaster.login;
                      if (!metadata.user_name && clip.broadcaster.displayName)
                        metadata.user_name = clip.broadcaster.displayName;
                    }
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
                      metadata.content_classification_labels = labels.map(function(l) {
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
                            if (metadata.is_featured === void 0 && item.isFeatured !== void 0) {
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
                  if (!!metadata.clip_creator_id) return [3, 2];
                  return [4, page.evaluate(function() {
                    var scripts = document.querySelectorAll("script");
                    for (var _i2 = 0, scripts_1 = scripts; _i2 < scripts_1.length; _i2++) {
                      var script = scripts_1[_i2];
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
                case 2:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        TwitchScraper3.prototype.extractStreamFromGql = function(gqlData, page, metadata) {
          return __awaiter(this, void 0, void 0, function() {
            var watchData, game, adData, channelShell, videoMetadata, useViewCount, streamMetadata, user, ffzData, game, tags;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            return __generator(this, function(_q) {
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
                  if (((_e = (_d = (_c = adData === null || adData === void 0 ? void 0 : adData.video) === null || _c === void 0 ? void 0 : _c.owner) === null || _d === void 0 ? void 0 : _d.broadcastSettings) === null || _e === void 0 ? void 0 : _e.isMature) !== void 0) {
                    metadata.is_mature = adData.video.owner.broadcastSettings.isMature;
                  }
                  channelShell = gqlData.get("ChannelShell");
                  if (((_g = (_f = channelShell === null || channelShell === void 0 ? void 0 : channelShell.userOrError) === null || _f === void 0 ? void 0 : _f.broadcastSettings) === null || _g === void 0 ? void 0 : _g.isMature) !== void 0) {
                    metadata.is_mature = channelShell.userOrError.broadcastSettings.isMature;
                  }
                  videoMetadata = gqlData.get("VideoMetadata");
                  if (((_j = (_h = videoMetadata === null || videoMetadata === void 0 ? void 0 : videoMetadata.user) === null || _h === void 0 ? void 0 : _h.broadcastSettings) === null || _j === void 0 ? void 0 : _j.isMature) !== void 0 && metadata.is_mature === void 0) {
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
                      if (useViewCount.user.stream.viewersCount !== void 0)
                        metadata.viewer_count = useViewCount.user.stream.viewersCount;
                      if (useViewCount.user.stream.game) {
                        if (!metadata.game_id && useViewCount.user.stream.game.id)
                          metadata.game_id = useViewCount.user.stream.game.id;
                        if (!metadata.game_name && useViewCount.user.stream.game.name)
                          metadata.game_name = useViewCount.user.stream.game.name;
                      }
                    }
                  }
                  if (videoMetadata === null || videoMetadata === void 0 ? void 0 : videoMetadata.user) {
                    if (!metadata.user_id && videoMetadata.user.id)
                      metadata.user_id = videoMetadata.user.id;
                    if (!metadata.user_login && videoMetadata.user.login)
                      metadata.user_login = videoMetadata.user.login;
                    if (videoMetadata.user.stream) {
                      if (!metadata.video_id && videoMetadata.user.stream.id)
                        metadata.video_id = videoMetadata.user.stream.id;
                      if (metadata.viewer_count === void 0 && videoMetadata.user.stream.viewersCount !== void 0) {
                        metadata.viewer_count = videoMetadata.user.stream.viewersCount;
                      }
                    }
                    if (videoMetadata.user.lastBroadcast) {
                      if (videoMetadata.user.lastBroadcast.startedAt)
                        metadata.started_at = videoMetadata.user.lastBroadcast.startedAt;
                    }
                  }
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
                    if (((_l = user.broadcastSettings) === null || _l === void 0 ? void 0 : _l.isMature) !== void 0) {
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
                  return [4, page.evaluate(function() {
                    var _a2, _b2, _c2;
                    var tagElements = [];
                    var tagLinks = document.querySelectorAll('a[href*="/directory/tags/"]');
                    for (var _i = 0, tagLinks_1 = tagLinks; _i < tagLinks_1.length; _i++) {
                      var link = tagLinks_1[_i];
                      var text = (_a2 = link.textContent) === null || _a2 === void 0 ? void 0 : _a2.trim();
                      var href = link.getAttribute("href") || "";
                      var urlMatch = href.match(/\/tags\/([^\/\?]+)/);
                      if (urlMatch) {
                        var tagName = decodeURIComponent(urlMatch[1].replace(/-/g, " "));
                        if (tagName && tagName.length > 0 && tagName.length < 100) {
                          tagElements.push(tagName);
                        }
                      } else if (text && text.length > 0 && text.length < 100 && !text.toLowerCase().includes("tag")) {
                        tagElements.push(text);
                      }
                    }
                    var tagElementsWithData = document.querySelectorAll('[data-a-target*="tag"], [data-test-selector*="tag"]');
                    for (var _d2 = 0, tagElementsWithData_1 = tagElementsWithData; _d2 < tagElementsWithData_1.length; _d2++) {
                      var elem = tagElementsWithData_1[_d2];
                      var text = (_b2 = elem.textContent) === null || _b2 === void 0 ? void 0 : _b2.trim();
                      if (text && text.length > 0 && text.length < 100) {
                        tagElements.push(text);
                      }
                    }
                    var streamInfo = document.querySelector('[data-a-target="stream-info"], .stream-info, [class*="StreamInfo"]');
                    if (streamInfo) {
                      var infoTags = streamInfo.querySelectorAll('a, button, span[class*="tag"], div[class*="tag"]');
                      for (var _e2 = 0, infoTags_1 = infoTags; _e2 < infoTags_1.length; _e2++) {
                        var tag = infoTags_1[_e2];
                        var text = (_c2 = tag.textContent) === null || _c2 === void 0 ? void 0 : _c2.trim();
                        if (text && text.length > 0 && text.length < 100 && !text.toLowerCase().includes("tag")) {
                          tagElements.push(text);
                        }
                      }
                    }
                    var scripts = document.querySelectorAll("script");
                    for (var _f2 = 0, scripts_2 = scripts; _f2 < scripts_2.length; _f2++) {
                      var script = scripts_2[_f2];
                      var content = script.textContent || "";
                      var patterns = [
                        /"tags"\s*:\s*\[(.*?)\]/,
                        /"streamTags"\s*:\s*\[(.*?)\]/,
                        /tags:\s*\[(.*?)\]/
                      ];
                      for (var _g2 = 0, patterns_1 = patterns; _g2 < patterns_1.length; _g2++) {
                        var pattern = patterns_1[_g2];
                        var match = content.match(pattern);
                        if (match) {
                          try {
                            var jsonStr = "[".concat(match[1], "]");
                            var tagArray = JSON.parse(jsonStr);
                            for (var _h2 = 0, tagArray_1 = tagArray; _h2 < tagArray_1.length; _h2++) {
                              var tag = tagArray_1[_h2];
                              if (typeof tag === "string" && tag.length > 0) {
                                tagElements.push(tag);
                              } else if ((tag === null || tag === void 0 ? void 0 : tag.name) && typeof tag.name === "string") {
                                tagElements.push(tag.name);
                              } else if ((tag === null || tag === void 0 ? void 0 : tag.localizedName) && typeof tag.localizedName === "string") {
                                tagElements.push(tag.localizedName);
                              }
                            }
                          } catch (e) {
                            var stringMatches = match[1].match(/"([^"]+)"/g);
                            if (stringMatches) {
                              for (var _j2 = 0, stringMatches_1 = stringMatches; _j2 < stringMatches_1.length; _j2++) {
                                var strMatch = stringMatches_1[_j2];
                                var tag = strMatch.replace(/"/g, "");
                                if (tag.length > 0 && tag.length < 100) {
                                  tagElements.push(tag);
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    var filtered = __spreadArray([], new Set(tagElements), true).filter(function(tag2) {
                      var lower = tag2.toLowerCase();
                      return tag2.length > 0 && tag2.length < 100 && !lower.includes("tag") && !lower.includes("tags") && !lower.includes("viewer") && !lower.includes("follow");
                    });
                    return filtered;
                  })];
                case 1:
                  tags = _q.sent();
                  if (tags && tags.length > 0) {
                    metadata.tags = tags;
                  }
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        TwitchScraper3.prototype.extractChannelFromGql = function(gqlData, metadata) {
          var _a, _b, _c;
          var classificationData = gqlData.get("ContentClassificationContext");
          if (((_a = classificationData === null || classificationData === void 0 ? void 0 : classificationData.video) === null || _a === void 0 ? void 0 : _a.contentClassificationLabels) && !metadata.content_classification_labels) {
            var labels = classificationData.video.contentClassificationLabels;
            if (labels.length > 0) {
              metadata.content_classification_labels = labels;
            }
          }
          var policyData = gqlData.get("ContentPolicyPropertiesQuery");
          if (((_c = (_b = policyData === null || policyData === void 0 ? void 0 : policyData.video) === null || _b === void 0 ? void 0 : _b.contentPolicyProperties) === null || _c === void 0 ? void 0 : _c.hasBrandedContent) !== void 0 && metadata.is_branded_content === void 0) {
            metadata.is_branded_content = policyData.video.contentPolicyProperties.hasBrandedContent;
          }
        };
        TwitchScraper3.prototype.extractMetadata = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var profileUrl, link, metadata, usernameMatch, nameSelectors, _i, nameSelectors_1, selector, name_1, bioSelectors, _a, bioSelectors_1, selector, bio, followerSelectors, _b, followerSelectors_1, selector, followerText, avatarSelectors, _c, avatarSelectors_1, selector, avatar, verifiedSelectors, _d, verifiedSelectors_1, selector, verified, error_2;
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
                  error_2 = _e.sent();
                  this.logger.log("Failed to extract Twitch metadata: ".concat(error_2), "error");
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
    var CreatorMetadataManager4 = (
      /** @class */
      (function() {
        function CreatorMetadataManager5(logger, config) {
          if (config === void 0) {
            config = {};
          }
          this.logger = logger;
          this.config = config;
        }
        CreatorMetadataManager5.prototype.getScraperForPlatform = function(platform) {
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
        CreatorMetadataManager5.prototype.extractMetadata = function(videoUrl) {
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
                  if (!page) {
                    logAgent.log("Failed to get browser page", "error");
                    return [2, null];
                  }
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
        CreatorMetadataManager5.prototype.extractMetadataFromPage = function(page, videoUrl) {
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
        CreatorMetadataManager5.prototype.extractExtendedMetadata = function(videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var logAgent, browserInstance, page, platform, scraper, browserType, creatorMetadata, videoMetadata, result, error_5, error_6, error_7;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function(_j) {
              switch (_j.label) {
                case 0:
                  logAgent = this.logger.agent("CreatorMetadataManager");
                  browserInstance = null;
                  page = null;
                  _j.label = 1;
                case 1:
                  _j.trys.push([1, 6, 7, 16]);
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
                  if (!page) {
                    logAgent.log("Failed to get browser page", "error");
                    return [2, null];
                  }
                  return [4, scraper.extractMetadata(page, videoUrl)];
                case 4:
                  creatorMetadata = _j.sent();
                  return [4, scraper.extractVideoMetadata(page, videoUrl)];
                case 5:
                  videoMetadata = _j.sent();
                  result = {};
                  if (creatorMetadata)
                    result.creator = creatorMetadata;
                  if (videoMetadata)
                    result.video = videoMetadata;
                  return [2, Object.keys(result).length > 0 ? result : null];
                case 6:
                  error_5 = _j.sent();
                  logAgent.log("Error extracting extended metadata: ".concat(error_5), "error");
                  return [2, null];
                case 7:
                  if (!page) return [3, 11];
                  _j.label = 8;
                case 8:
                  _j.trys.push([8, 10, , 11]);
                  return [4, page.close()];
                case 9:
                  _j.sent();
                  return [3, 11];
                case 10:
                  error_6 = _j.sent();
                  return [3, 11];
                case 11:
                  if (!browserInstance) return [3, 15];
                  _j.label = 12;
                case 12:
                  _j.trys.push([12, 14, , 15]);
                  return [4, browserInstance.close()];
                case 13:
                  _j.sent();
                  return [3, 15];
                case 14:
                  error_7 = _j.sent();
                  return [3, 15];
                case 15:
                  return [
                    7
                    /*endfinally*/
                  ];
                case 16:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        CreatorMetadataManager5.prototype.extractExtendedMetadataFromPage = function(page, videoUrl) {
          return __awaiter(this, void 0, void 0, function() {
            var logAgent, platform, scraper, creatorMetadata, videoMetadata, result, creatorFields, error_8;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  logAgent = this.logger.agent("CreatorMetadataManager");
                  _a.label = 1;
                case 1:
                  _a.trys.push([1, 4, , 5]);
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
                  creatorMetadata = _a.sent();
                  return [4, scraper.extractVideoMetadata(page, videoUrl)];
                case 3:
                  videoMetadata = _a.sent();
                  result = {};
                  if (creatorMetadata)
                    result.creator = creatorMetadata;
                  if (videoMetadata)
                    result.video = videoMetadata;
                  if (creatorMetadata && videoMetadata && videoMetadata.creator_fields) {
                    creatorFields = videoMetadata.creator_fields;
                    if (creatorFields.creator_open_id)
                      creatorMetadata.creator_open_id = creatorFields.creator_open_id;
                    if (creatorFields.creator_union_id)
                      creatorMetadata.creator_union_id = creatorFields.creator_union_id;
                    if (creatorFields.creator_avatar_url_100)
                      creatorMetadata.creator_avatar_url_100 = creatorFields.creator_avatar_url_100;
                    if (creatorFields.creator_avatar_large_url)
                      creatorMetadata.creator_avatar_large_url = creatorFields.creator_avatar_large_url;
                    if (creatorFields.creator_profile_deep_link)
                      creatorMetadata.creator_profile_deep_link = creatorFields.creator_profile_deep_link;
                    if (creatorFields.creator_following_count !== void 0)
                      creatorMetadata.creator_following_count = creatorFields.creator_following_count;
                    if (creatorFields.creator_likes_count !== void 0)
                      creatorMetadata.creator_likes_count = creatorFields.creator_likes_count;
                    if (creatorFields.creator_video_count !== void 0)
                      creatorMetadata.creator_video_count = creatorFields.creator_video_count;
                  }
                  return [2, Object.keys(result).length > 0 ? result : null];
                case 4:
                  error_8 = _a.sent();
                  logAgent.log("Error extracting extended metadata: ".concat(error_8), "error");
                  return [2, null];
                case 5:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return CreatorMetadataManager5;
      })()
    );
    exports2.CreatorMetadataManager = CreatorMetadataManager4;
  }
});

// src/types/index.js
var require_types = __commonJS({
  "src/types/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
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
  CreatorMetadataManager: () => import_CreatorMetadataManager3.CreatorMetadataManager,
  CreatorMetadataScraper: () => import_CreatorMetadataScraper2.CreatorMetadataScraper,
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
  detectPlatform: () => detectPlatform,
  extractExtendedMetadata: () => extractExtendedMetadata,
  extractMetadata: () => extractMetadata,
  ipcDetectPlatform: () => ipcDetectPlatform,
  ipcExtractExtendedMetadata: () => ipcExtractExtendedMetadata,
  ipcExtractMetadata: () => ipcExtractMetadata,
  main: () => main
});
module.exports = __toCommonJS(index_exports);
var import_StringBuilder3 = __toESM(require_StringBuilder());

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

// src/handlers/extractMetadata.ts
var import_CreatorMetadataManager = __toESM(require_CreatorMetadataManager());
var import_StringBuilder = __toESM(require_StringBuilder());
async function extractMetadata(e, args) {
  e.stopPropagation();
  try {
    const { url, browserType = "chromium", headless = true, viewport, firefoxUserDataDir } = args;
    if (!url) {
      return { ok: false, error: "URL is required" };
    }
    const invokeEvent = e.invokeEvent || {
      sender: {
        send: (id, data) => {
          if (data.data) {
            console.log(`[${id}] ${data.data}`);
          }
        }
      }
    };
    const logger = new import_StringBuilder.Logger("extractMetadata", invokeEvent);
    const logAgent = logger.agent("ExtractMetadataHandler");
    logAgent.log(`Extracting metadata for URL: ${url}`, "info");
    logAgent.log(`Using browser: ${browserType}, headless: ${headless}`, "info");
    const browserConfig = {
      headless,
      viewport: viewport || { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true
    };
    if (firefoxUserDataDir) {
      browserConfig.firefoxUserDataDir = firefoxUserDataDir;
    }
    const manager = new import_CreatorMetadataManager.CreatorMetadataManager(logger, {
      browserType,
      browserConfig,
      apiConfig: args.apiConfig,
      scraperMode: args.scraperMode,
      platformOverrides: args.platformOverrides
    });
    const metadata = await manager.extractMetadata(url);
    if (metadata) {
      logAgent.log("Successfully extracted metadata", "info");
      return { ok: true, data: metadata };
    } else {
      logAgent.log("No metadata extracted", "warn");
      return { ok: false, error: "No metadata could be extracted from the URL" };
    }
  } catch (error) {
    console.error("[Braid] Error extracting metadata:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// src/handlers/extractExtendedMetadata.ts
var import_CreatorMetadataManager2 = __toESM(require_CreatorMetadataManager());
var import_StringBuilder2 = __toESM(require_StringBuilder());
async function extractExtendedMetadata(e, args) {
  e.stopPropagation();
  try {
    const { url, browserType = "chromium", headless = true, viewport, firefoxUserDataDir } = args;
    if (!url) {
      return { ok: false, error: "URL is required" };
    }
    const invokeEvent = e.invokeEvent || {
      sender: {
        send: (id, data) => {
          if (data.data) {
            console.log(`[${id}] ${data.data}`);
          }
        }
      }
    };
    const logger = new import_StringBuilder2.Logger("extractExtendedMetadata", invokeEvent);
    const logAgent = logger.agent("ExtractExtendedMetadataHandler");
    logAgent.log(`Extracting extended metadata for URL: ${url}`, "info");
    logAgent.log(`Using browser: ${browserType}, headless: ${headless}`, "info");
    const browserConfig = {
      headless,
      viewport: viewport || { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true
    };
    if (firefoxUserDataDir) {
      browserConfig.firefoxUserDataDir = firefoxUserDataDir;
    }
    const manager = new import_CreatorMetadataManager2.CreatorMetadataManager(logger, {
      browserType,
      browserConfig,
      apiConfig: args.apiConfig,
      scraperMode: args.scraperMode,
      platformOverrides: args.platformOverrides
    });
    const extendedMetadata = await manager.extractExtendedMetadata(url);
    if (extendedMetadata) {
      logAgent.log("Successfully extracted extended metadata", "info");
      return { ok: true, data: extendedMetadata };
    } else {
      logAgent.log("No metadata extracted", "warn");
      return { ok: false, error: "No metadata could be extracted from the URL" };
    }
  } catch (error) {
    console.error("[Braid] Error extracting extended metadata:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// src/handlers/detectPlatform.ts
var import_CreatorMetadataScraper = __toESM(require_CreatorMetadataScraper());
async function detectPlatform(e, args) {
  e.stopPropagation();
  try {
    const { url } = args;
    if (!url) {
      return { ok: false, error: "URL is required" };
    }
    const platform = import_CreatorMetadataScraper.CreatorMetadataScraper.detectPlatform(url);
    return {
      ok: true,
      data: {
        platform,
        url
      }
    };
  } catch (error) {
    console.error("[Braid] Error detecting platform:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// src/ipc/extractMetadata.ts
async function ipcExtractMetadata(e, args) {
  try {
    const mockEvent = {
      stopPropagation: () => {
      },
      invokeEvent: null
    };
    const result = await extractMetadata(mockEvent, args);
    return result;
  } catch (error) {
    console.error("[Braid] IPC Error extracting metadata:", error);
    return {
      ok: false,
      error: error.message || String(error)
    };
  }
}

// src/ipc/extractExtendedMetadata.ts
async function ipcExtractExtendedMetadata(e, args) {
  try {
    const mockEvent = {
      stopPropagation: () => {
      },
      invokeEvent: null
    };
    const result = await extractExtendedMetadata(mockEvent, args);
    return result;
  } catch (error) {
    console.error("[Braid] IPC Error extracting extended metadata:", error);
    return {
      ok: false,
      error: error.message || String(error)
    };
  }
}

// src/ipc/detectPlatform.ts
async function ipcDetectPlatform(e, args) {
  try {
    const mockEvent = {
      stopPropagation: () => {
      },
      invokeEvent: null
    };
    const result = await detectPlatform(mockEvent, args);
    return result;
  } catch (error) {
    console.error("[Braid] IPC Error detecting platform:", error);
    return {
      ok: false,
      error: error.message || String(error)
    };
  }
}

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
var import_CreatorMetadataManager3 = __toESM(require_CreatorMetadataManager());
var import_CreatorMetadataScraper2 = __toESM(require_CreatorMetadataScraper());
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
    const simpleLogger = new import_StringBuilder3.Logger("getInfo", e.invokeEvent);
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
  let completeLog = new import_StringBuilder3.Logger(downloadId, invokeEvent);
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
function main({ events, channels, electron: { ipcMain } }) {
  const extensionPath = __dirname;
  const extensionRoot = extensionPath.replace(/[\\/]dist$/, "");
  console.log(`[Braid] Extension path: ${extensionPath}`);
  console.log(`[Braid] Extension root: ${extensionRoot}`);
  const extractMetadataId = channels.register("extendr:extractMetadata");
  const extractExtendedMetadataId = channels.register("extendr:extractExtendedMetadata");
  const detectPlatformId = channels.register("extendr:detectPlatform");
  const getInfoId = channels.register("extendr:getInfo");
  const downloadId = channels.register("extendr:download");
  events.on(extractMetadataId, extractMetadata, -10);
  events.on(extractExtendedMetadataId, extractExtendedMetadata, -10);
  events.on(detectPlatformId, detectPlatform, -10);
  events.on(getInfoId, getInfo, -10);
  events.on(downloadId, download, -10);
  ipcMain.handle(extractMetadataId, ipcExtractMetadata);
  ipcMain.handle(extractExtendedMetadataId, ipcExtractExtendedMetadata);
  ipcMain.handle(detectPlatformId, ipcDetectPlatform);
  console.log("[Braid] Extension initialized successfully");
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
  detectPlatform,
  extractExtendedMetadata,
  extractMetadata,
  ipcDetectPlatform,
  ipcExtractExtendedMetadata,
  ipcExtractMetadata,
  main
});
