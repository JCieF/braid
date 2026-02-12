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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/browsers/FirefoxBrowser.ts
var FirefoxBrowser_exports = {};
__export(FirefoxBrowser_exports, {
  FirefoxBrowser: () => FirefoxBrowser
});
var import_playwright, FirefoxBrowser;
var init_FirefoxBrowser = __esm({
  "src/browsers/FirefoxBrowser.ts"() {
    "use strict";
    import_playwright = require("playwright");
    FirefoxBrowser = class {
      browser = null;
      context = null;
      logger;
      config = {};
      constructor(logger) {
        this.logger = logger.agent("FirefoxBrowser");
      }
      async launch(config = {}) {
        this.config = config;
        try {
          const launchOptions = {
            headless: config.headless ?? true,
            args: []
          };
          if (config.firefoxUserDataDir) {
            launchOptions.firefoxUserDataDir = config.firefoxUserDataDir;
          }
          this.browser = await import_playwright.firefox.launch(launchOptions);
          const contextOptions = {
            viewport: config.viewport ?? { width: 1920, height: 1080 },
            userAgent: config.userAgent ?? "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0",
            ignoreHTTPSErrors: config.ignoreHTTPSErrors ?? true,
            javaScriptEnabled: config.javaScriptEnabled ?? true,
            permissions: [],
            extraHTTPHeaders: {
              "Accept-Language": "en-US,en;q=0.9"
            }
          };
          this.context = await this.browser.newContext(contextOptions);
          this.logger.log(
            "Firefox browser launched with enhanced privacy settings",
            "info"
          );
        } catch (error) {
          this.logger.log(
            `Failed to launch Firefox browser: ${error}`,
            "error"
          );
          throw error;
        }
      }
      async getPage(url) {
        if (!this.context) {
          throw new Error(
            "Browser context not initialized. Call launch() first."
          );
        }
        const page = await this.context.newPage();
        if (this.config.disableImages) {
          await page.route("**/*", (route) => {
            const request = route.request();
            const resourceType = request.resourceType();
            if (resourceType === "image") {
              this.logger.log(
                `Blocked image request: ${request.url()}`,
                "debug"
              );
              route.abort();
            } else {
              route.continue();
            }
          });
          this.logger.log("Image loading disabled for this page", "info");
        }
        page.on("request", (request) => this.logRequest(request));
        page.on("response", (response) => this.logResponse(response));
        if (url) {
          try {
            this.logger.log(`Navigating to: ${url}`, "info");
            await page.goto(url, {
              waitUntil: "domcontentloaded",
              timeout: 3e4
            });
            this.logger.log("Page loaded successfully", "info");
            await page.waitForTimeout(3e3);
          } catch (error) {
            this.logger.log(
              `Page load timeout, but continuing anyway: ${error}`,
              "warn"
            );
          }
        }
        return page;
      }
      logRequest(request) {
        const url = request.url();
        if (this.isVideoRelatedUrl(url)) {
          this.logger.log(`REQUEST: ${request.method()} ${url}`, "info");
        }
      }
      logResponse(response) {
        const url = response.url();
        if (this.isVideoRelatedUrl(url)) {
          this.logger.log(`RESPONSE: ${response.status()} ${url}`, "info");
        }
      }
      isVideoRelatedUrl(url) {
        if (url.includes("sacdnssedge") || url.includes("tscprts.com") || url.includes("mnaspm.com") || url.includes("tsyndicate.com")) {
          return false;
        }
        return url.includes(".m3u8");
      }
      async close() {
        try {
          if (this.browser) {
            await this.browser.close();
            this.logger.log("Firefox browser closed", "info");
          }
        } catch (error) {
          this.logger.log(`Error closing Firefox browser: ${error}`, "warn");
        }
      }
    };
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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AdBlocker: () => AdBlocker,
  BaseHelper: () => BaseHelper,
  BraveBrowser: () => BraveBrowser,
  BrowserHelper: () => BrowserHelper,
  ChromiumBrowser: () => ChromiumBrowser,
  CreatorMetadataManager: () => CreatorMetadataManager,
  CreatorMetadataScraper: () => CreatorMetadataScraper,
  DownloadHelper: () => DownloadHelper,
  FacebookScraper: () => FacebookScraper,
  FirefoxBrowser: () => FirefoxBrowser,
  IFrameMonitor: () => IFrameMonitor,
  InstagramScraper: () => InstagramScraper,
  M3U8Processor: () => M3U8Processor,
  NetworkMonitor: () => NetworkMonitor,
  PageHelper: () => PageHelper,
  PlayButtonHandler: () => PlayButtonHandler,
  PopupHandler: () => PopupHandler,
  RedditScraper: () => RedditScraper,
  RequestHandler: () => RequestHandler,
  RouteHandler: () => RouteHandler,
  StreamButtonHandler: () => StreamButtonHandler,
  StreamHandler: () => StreamHandler,
  TikTokScraper: () => TikTokScraper,
  TitleScraper: () => TitleScraper,
  TwitchScraper: () => TwitchScraper,
  TwitterScraper: () => TwitterScraper,
  VideoDownloader: () => VideoDownloader,
  YouTubeScraper: () => YouTubeScraper,
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

// src/helpers/StringBuilder.ts
var StringBuilder = class {
  #strings = [];
  append(...texts) {
    this.#strings.push(...texts);
    return this;
  }
  clear() {
    this.#strings = [];
  }
  toString(sep = "\n") {
    return this.#strings.join(sep);
  }
  get length() {
    return this.toString().length;
  }
};
var Logger = class extends StringBuilder {
  downloadId;
  invokeEvent;
  constructor(downloadId, invokeEvent) {
    super();
    this.downloadId = downloadId;
    this.invokeEvent = invokeEvent;
  }
  log(text, type) {
    this.append(`${text} @ ${type}`);
    this.invokeEvent.sender.send(this.downloadId, {
      data: text,
      completeLog: this.toString()
    });
    return this;
  }
  agent(name) {
    return new LogAgent(name, this);
  }
};
var LogAgent = class {
  logger;
  name;
  constructor(name, logger) {
    this.logger = logger;
    this.name = name;
  }
  log(text, type) {
    this.logger.log(`${this.name} - ${text}`, type);
    return this;
  }
};

// src/VideoDownloader.ts
init_FirefoxBrowser();

// src/browsers/BraveBrowser.ts
var import_playwright2 = require("playwright");
var BraveBrowser = class {
  browser = null;
  context = null;
  logger;
  constructor(logger) {
    this.logger = logger.agent("BraveBrowser");
  }
  async launch(config = {}) {
    try {
      const launchOptions = {
        headless: config.headless ?? true,
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
      };
      if (config.userDataDir) {
        launchOptions.userDataDir = config.userDataDir;
      }
      this.browser = await import_playwright2.chromium.launch(launchOptions);
      this.context = await this.browser.newContext({
        viewport: config.viewport ?? { width: 1920, height: 1080 },
        userAgent: config.userAgent ?? "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/1.60",
        ignoreHTTPSErrors: config.ignoreHTTPSErrors ?? true,
        javaScriptEnabled: config.javaScriptEnabled ?? true
      });
      this.logger.log(
        "Brave browser launched with enhanced ad-blocking",
        "info"
      );
    } catch (error) {
      this.logger.log(
        `Failed to launch Brave browser: ${error}`,
        "error"
      );
      throw error;
    }
  }
  async getPage(url) {
    if (!this.context) {
      throw new Error(
        "Browser context not initialized. Call launch() first."
      );
    }
    const page = await this.context.newPage();
    page.on("request", (request) => this.logRequest(request));
    page.on("response", (response) => this.logResponse(response));
    if (url) {
      try {
        this.logger.log(`Navigating to: ${url}`, "info");
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 3e4
        });
        this.logger.log("Page loaded successfully", "info");
        await page.waitForTimeout(3e3);
      } catch (error) {
        this.logger.log(
          `Page load timeout, but continuing anyway: ${error}`,
          "warn"
        );
      }
    }
    return page;
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
    return bravePaths[0];
  }
  logRequest(request) {
    const url = request.url();
    if (this.isVideoRelatedUrl(url)) {
      this.logger.log(`REQUEST: ${request.method()} ${url}`, "info");
    }
  }
  logResponse(response) {
    const url = response.url();
    if (this.isVideoRelatedUrl(url)) {
      this.logger.log(`RESPONSE: ${response.status()} ${url}`, "info");
    }
  }
  isVideoRelatedUrl(url) {
    const patterns = ["m3u8", "mp4", "ts", "stream"];
    return patterns.some((pattern) => url.toLowerCase().includes(pattern));
  }
  async close() {
    try {
      if (this.browser) {
        await this.browser.close();
        this.logger.log("Brave browser closed", "info");
      }
    } catch (error) {
      this.logger.log(`Error closing Brave browser: ${error}`, "warn");
    }
  }
};

// src/browsers/ChromiumBrowser.ts
var import_playwright3 = require("playwright");
var ChromiumBrowser = class {
  browser = null;
  context = null;
  logger;
  constructor(logger) {
    this.logger = logger.agent("ChromiumBrowser");
  }
  async launch(config = {}) {
    try {
      const launchOptions = {
        headless: config.headless ?? true,
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
      };
      if (config.userDataDir) {
        launchOptions.userDataDir = config.userDataDir;
      }
      this.browser = await import_playwright3.chromium.launch(launchOptions);
      this.context = await this.browser.newContext({
        viewport: config.viewport ?? { width: 1920, height: 1080 },
        userAgent: config.userAgent ?? "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        ignoreHTTPSErrors: config.ignoreHTTPSErrors ?? true,
        javaScriptEnabled: config.javaScriptEnabled ?? true
      });
      this.logger.log("Chromium browser launched", "info");
    } catch (error) {
      this.logger.log(
        `Failed to launch Chromium browser: ${error}`,
        "error"
      );
      throw error;
    }
  }
  async getPage(url) {
    if (!this.context) {
      throw new Error(
        "Browser context not initialized. Call launch() first."
      );
    }
    const page = await this.context.newPage();
    page.on("request", (request) => this.logRequest(request));
    page.on("response", (response) => this.logResponse(response));
    if (url) {
      try {
        this.logger.log(`Navigating to: ${url}`, "info");
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 3e4
        });
        this.logger.log("Page loaded successfully", "info");
        await page.waitForTimeout(3e3);
      } catch (error) {
        this.logger.log(
          `Page load timeout, but continuing anyway: ${error}`,
          "warn"
        );
      }
    }
    return page;
  }
  logRequest(request) {
    const url = request.url();
    if (this.isVideoRelatedUrl(url)) {
      this.logger.log(`REQUEST: ${request.method()} ${url}`, "info");
    }
  }
  logResponse(response) {
    const url = response.url();
    if (this.isVideoRelatedUrl(url)) {
      this.logger.log(`RESPONSE: ${response.status()} ${url}`, "info");
    }
  }
  isVideoRelatedUrl(url) {
    const patterns = ["m3u8", "mp4", "ts", "stream"];
    return patterns.some((pattern) => url.toLowerCase().includes(pattern));
  }
  async close() {
    try {
      if (this.browser) {
        await this.browser.close();
        this.logger.log("Chromium browser closed", "info");
      }
    } catch (error) {
      this.logger.log(`Error closing Chromium browser: ${error}`, "warn");
    }
  }
};

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

// src/helpers/BaseHelper.ts
var BaseHelper = class {
  logger;
  statusCallback;
  constructor(logger, statusCallback) {
    this.logger = logger.agent(this.constructor.name);
    this.statusCallback = statusCallback;
  }
  updateStatus(status) {
    this.logger.log(status, "info");
    if (this.statusCallback) {
      this.statusCallback(status);
    }
  }
  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  }
  extractOriginFromUrl(url) {
    try {
      const parsed = new URL(url);
      return `${parsed.protocol}//${parsed.host}`;
    } catch {
      return "https://jav.guru";
    }
  }
  isValidVideoUrl(url) {
    if (!url || url.length < 10) {
      return false;
    }
    const urlLower = url.toLowerCase();
    if (urlLower.includes("turbovidhls.com/t/")) {
      this.logger.log(
        `Priority direct video URL detected: ${url}`,
        "info"
      );
      return true;
    }
    const videoIndicators = [
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
    const hasIndicator = videoIndicators.some(
      (indicator) => urlLower.includes(indicator)
    );
    if (!hasIndicator) {
      return false;
    }
    const exclusions = [
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
    const hasExclusion = exclusions.some(
      (exclusion) => urlLower.includes(exclusion)
    );
    return !hasExclusion;
  }
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  generateTimestamp() {
    return Math.floor(Date.now() / 1e3);
  }
  sanitizeFilename(filename) {
    return filename.replace(/[<>:"/\\|?*]/g, "_").replace(/\s+/g, "_");
  }
};

// src/helpers/BrowserHelper.ts
var BrowserHelper = class extends BaseHelper {
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
var PageHelper = class extends BaseHelper {
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
      this.browser = new FirefoxBrowser(this.config.completeLog);
    } else if (browserType === "brave") {
      this.browser = new BraveBrowser(this.config.completeLog);
    } else {
      this.browser = new ChromiumBrowser(this.config.completeLog);
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

// src/scrapers/CreatorMetadataScraper.ts
var CreatorMetadataScraper = class extends BaseHelper {
  config;
  constructor(logger, config = {}) {
    super(logger);
    this.config = {
      timeout: 3e4,
      retries: 3,
      ...config
    };
  }
  static detectPlatform(url) {
    const urlLower = url.toLowerCase();
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
  }
  async extractVideoMetadata(page, videoUrl) {
    return null;
  }
  async getElementText(page, selector) {
    try {
      const element = await page.locator(selector).first();
      if (await element.isVisible({ timeout: 5e3 })) {
        return await element.textContent();
      }
    } catch (error) {
      this.logger.log(`Could not extract text from ${selector}: ${error}`, "debug");
    }
    return null;
  }
  async getElementAttribute(page, selector, attribute) {
    try {
      const element = await page.locator(selector).first();
      if (await element.isVisible({ timeout: 5e3 })) {
        return await element.getAttribute(attribute);
      }
    } catch (error) {
      this.logger.log(
        `Could not extract ${attribute} from ${selector}: ${error}`,
        "debug"
      );
    }
    return null;
  }
  parseCount(text) {
    if (!text) return void 0;
    const cleaned = text.replace(/,/g, "").trim();
    const match = cleaned.match(/^([\d.]+)([KMBkmb])?$/);
    if (match) {
      let num = parseFloat(match[1]);
      const suffix = match[2]?.toUpperCase();
      if (suffix === "K") num *= 1e3;
      else if (suffix === "M") num *= 1e6;
      else if (suffix === "B") num *= 1e9;
      return Math.floor(num);
    }
    const numbers = cleaned.match(/[\d.]+/);
    if (numbers) {
      return Math.floor(parseFloat(numbers[0]));
    }
    return void 0;
  }
  async waitForElement(page, selector, timeout = 1e4) {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }
  cleanText(text) {
    if (!text) return "";
    return text.trim().replace(/\s+/g, " ");
  }
};

// src/scrapers/YouTubeScraper.ts
var YouTubeScraper = class extends CreatorMetadataScraper {
  async getCreatorProfileUrl(videoUrl) {
    return null;
  }
  async extractMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting YouTube creator metadata (avatar, verified)...", "info");
      const videoIdMatch = videoUrl.match(/(?:v=|\/shorts\/)([a-zA-Z0-9_-]{11})/);
      const currentUrl = page.url();
      const alreadyOnVideoPage = videoIdMatch && (currentUrl.includes(videoIdMatch[1]) || currentUrl.includes("youtube.com/watch") || currentUrl.includes("youtube.com/shorts"));
      if (!alreadyOnVideoPage) {
        await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
        try {
          await page.waitForFunction(
            () => !!window.ytInitialPlayerResponse || !!window.ytInitialData,
            { timeout: 6e3 }
          );
        } catch {
        }
        await this.delay(300);
      }
      let channelUrl = null;
      const channelSelectors = [
        'a[href*="/channel/"]',
        'a[href*="/c/"]',
        'a[href*="/user/"]',
        'a[href*="/@"]',
        "ytd-channel-name a",
        "#channel-name a"
      ];
      for (const selector of channelSelectors) {
        const link = await this.getElementAttribute(page, selector, "href");
        if (link && (link.includes("/channel/") || link.includes("/c/") || link.includes("/user/") || link.includes("/@"))) {
          channelUrl = link.startsWith("http") ? link : `https://www.youtube.com${link}`;
          break;
        }
      }
      if (!channelUrl) {
        this.logger.log("Could not find channel URL", "warn");
        return null;
      }
      this.logger.log(`Found channel URL: ${channelUrl}`, "debug");
      const fromVideoPage = await this.tryExtractCreatorFromVideoPage(page, channelUrl);
      if (fromVideoPage) {
        this.logger.log("Successfully extracted YouTube creator metadata from video page (skipped channel)", "info");
        return fromVideoPage;
      }
      await page.goto(channelUrl, { waitUntil: "domcontentloaded" });
      try {
        await page.waitForSelector("ytd-channel-avatar, #avatar", { timeout: 5e3 });
      } catch {
      }
      await this.delay(200);
      const metadata = {
        platform: "youtube",
        url: channelUrl,
        extractedAt: Date.now()
      };
      metadata.creator_avatar_url = await this.extractAvatarUrl(page);
      metadata.creator_verified = await this.extractVerifiedStatus(page);
      this.logger.log("Successfully extracted YouTube creator metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract YouTube metadata: ${error}`, "error");
      return null;
    }
  }
  async extractVideoMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting YouTube video metadata (all fields for fallback)...", "info");
      const isShortUrl = videoUrl.includes("/shorts/");
      await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
      try {
        await page.waitForFunction(
          () => !!window.ytInitialPlayerResponse || !!window.ytInitialData,
          { timeout: isShortUrl ? 6e3 : 5e3 }
        );
      } catch {
      }
      await this.delay(200);
      const videoIdMatch = videoUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
      const metadata = {
        platform: "youtube",
        url: videoUrl,
        extractedAt: Date.now()
      };
      if (videoIdMatch) {
        metadata.video_id = videoIdMatch[1];
      }
      const embeddedData = await this.extractYouTubeSpecificData(page, videoUrl);
      if (!embeddedData) {
        this.logger.log("Warning: extractYouTubeSpecificData returned null - data may not be available", "warn");
      }
      if (embeddedData && (embeddedData.like_count === void 0 || embeddedData.comment_count === void 0)) {
        const domData = await this.extractFromDOM(page);
        if (domData) {
          if (embeddedData.like_count === void 0 && domData.like_count !== void 0) {
            embeddedData.like_count = domData.like_count;
          }
          if (embeddedData.comment_count === void 0 && domData.comment_count !== void 0) {
            embeddedData.comment_count = domData.comment_count;
          }
        }
      }
      if (embeddedData) {
        if (embeddedData.title) {
          metadata.caption = embeddedData.title;
        }
        if (embeddedData.description) {
          if (!metadata.caption) {
            metadata.caption = embeddedData.description;
          } else {
            metadata.caption = `${metadata.caption}

${embeddedData.description}`;
          }
        }
        if (embeddedData.view_count !== void 0) metadata.view_count = embeddedData.view_count;
        if (embeddedData.like_count !== void 0) metadata.like_count = embeddedData.like_count;
        if (embeddedData.comment_count !== void 0) metadata.comment_count = embeddedData.comment_count;
        if (embeddedData.timestamp !== void 0) metadata.timestamp = embeddedData.timestamp;
        if (embeddedData.tags) metadata.hashtags = embeddedData.tags;
        if (embeddedData.duration !== void 0) metadata.duration = embeddedData.duration;
        if (embeddedData.channel_id) metadata.channel_id = embeddedData.channel_id;
        if (embeddedData.channel_name) metadata.channel_name = embeddedData.channel_name;
        if (embeddedData.thumbnails && embeddedData.thumbnails.length > 0) metadata.thumbnails = embeddedData.thumbnails;
        if (embeddedData.definition) metadata.definition = embeddedData.definition;
        if (embeddedData.concurrentViewers !== void 0) metadata.concurrentViewers = embeddedData.concurrentViewers;
        if (embeddedData.mentions) metadata.mentions = embeddedData.mentions;
        if (embeddedData.embeddable !== void 0) metadata.embeddable = embeddedData.embeddable;
        if (embeddedData.dimension) metadata.dimension = embeddedData.dimension;
        if (embeddedData.projection) metadata.projection = embeddedData.projection;
        if (embeddedData.madeForKids !== void 0) metadata.madeForKids = embeddedData.madeForKids;
        if (embeddedData.isShort !== void 0) metadata.isShort = embeddedData.isShort;
        if (embeddedData.isLive !== void 0) metadata.isLive = embeddedData.isLive;
        if (embeddedData.isUpcoming !== void 0) metadata.isUpcoming = embeddedData.isUpcoming;
        if (embeddedData.hasCaptions !== void 0) metadata.hasCaptions = embeddedData.hasCaptions;
        if (embeddedData.isUnlisted !== void 0) metadata.isUnlisted = embeddedData.isUnlisted;
        if (embeddedData.isAgeRestricted !== void 0) metadata.isAgeRestricted = embeddedData.isAgeRestricted;
        if (embeddedData.category) metadata.category = embeddedData.category;
        if (embeddedData.defaultLanguage) metadata.defaultLanguage = embeddedData.defaultLanguage;
      }
      if (metadata.isShort === void 0 && isShortUrl) {
        metadata.isShort = true;
      }
      this.logger.log("Successfully extracted YouTube video metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract YouTube video metadata: ${error}`, "error");
      return null;
    }
  }
  async extractFromDOM(page) {
    try {
      const data = await page.evaluate(() => {
        const result = {};
        const likeSelectors = [
          'ytd-toggle-button-renderer[aria-label*="like"]',
          'button[aria-label*="like"]',
          '#top-level-buttons-computed button[aria-label*="like"]'
        ];
        for (const selector of likeSelectors) {
          try {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
              const ariaLabel = el.getAttribute("aria-label") || "";
              if (ariaLabel && ariaLabel.toLowerCase().includes("like") && !ariaLabel.toLowerCase().includes("view") && /[\d.,]+[KMB]?/.test(ariaLabel)) {
                const match = ariaLabel.match(/([\d.,]+[KMB]?)/);
                if (match) {
                  let num = parseFloat(match[1].replace(/,/g, ""));
                  const matchText = match[1];
                  if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                  else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                  else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
                  if (num < 1e9 && num > 0) {
                    result.like_count = Math.floor(num);
                    break;
                  }
                }
              }
            }
            if (result.like_count) break;
          } catch (e) {
            continue;
          }
        }
        const commentSelectors = [
          "ytd-comments-header-renderer #count",
          "h2#count",
          'yt-formatted-string[id="count"]',
          "ytd-comments-header-renderer yt-formatted-string",
          "#count-text",
          '[aria-label*="comment"]',
          "ytd-comments-header-renderer span"
        ];
        for (const selector of commentSelectors) {
          try {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
              const text = (el.textContent || "").trim();
              if (text && /^[\d.,]+[KMB]?\s*(comment|comments)?$/i.test(text)) {
                const match = text.match(/([\d.,]+[KMB]?)/);
                if (match) {
                  let num = parseFloat(match[1].replace(/,/g, ""));
                  const matchText = match[1];
                  if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                  else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                  else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
                  if (num > 0 && num < 1e8) {
                    result.comment_count = Math.floor(num);
                    break;
                  }
                }
              }
            }
            if (result.comment_count) break;
          } catch (e) {
            continue;
          }
        }
        if (!result.comment_count) {
          try {
            const ariaCandidates = document.querySelectorAll("[aria-label]");
            for (const el of ariaCandidates) {
              const ariaLabel = (el.getAttribute("aria-label") || "").trim();
              const lower = ariaLabel.toLowerCase();
              if (!ariaLabel || !lower.includes("comment")) continue;
              if (!/[\d.,]+[KMB]?/.test(ariaLabel)) continue;
              const match = ariaLabel.match(/([\d.,]+[KMB]?)/);
              if (!match) continue;
              let num = parseFloat(match[1].replace(/,/g, ""));
              const matchText = match[1];
              if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
              else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
              else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
              if (num > 0 && num < 1e8) {
                result.comment_count = Math.floor(num);
                break;
              }
            }
          } catch (e) {
          }
        }
        return result;
      });
      return data;
    } catch (error) {
      this.logger.log(`Failed to extract from DOM: ${error}`, "debug");
      return null;
    }
  }
  async extractAvatarUrl(page) {
    try {
      await this.delay(200);
      const avatar = await page.evaluate(() => {
        const avatarContainer = document.querySelector("ytd-channel-avatar");
        if (avatarContainer) {
          const img = avatarContainer.querySelector("img");
          if (img) {
            const src = img.src || img.currentSrc;
            if (src && (src.includes("ggpht.com") || src.includes("ytimg.com") || src.includes("googleusercontent.com"))) {
              return src;
            }
          }
        }
        const avatarEl = document.querySelector("#avatar img");
        if (avatarEl) {
          const img = avatarEl;
          const src = img.src || img.currentSrc;
          if (src && (src.includes("ggpht.com") || src.includes("ytimg.com") || src.includes("googleusercontent.com"))) {
            return src;
          }
        }
        const images = document.querySelectorAll("img");
        for (const img of images) {
          const src = img.src || img.currentSrc;
          if (src && src.includes("ggpht.com") && src.includes("=s")) {
            if (!src.includes("banner") && !src.includes("hqdefault") && !src.includes("mqdefault")) {
              return src;
            }
          }
        }
        if (window.ytInitialData) {
          const ytData = window.ytInitialData;
          const header = ytData?.header?.c4TabbedHeaderRenderer;
          if (header?.avatar?.thumbnails) {
            const thumbnails = header.avatar.thumbnails;
            if (thumbnails.length > 0) {
              const largest = thumbnails[thumbnails.length - 1];
              return largest.url;
            }
          }
        }
        return null;
      });
      if (avatar && this.isValidAvatarUrl(avatar)) {
        this.logger.log(`Found avatar URL: ${avatar.substring(0, 60)}...`, "info");
        return avatar;
      }
      this.logger.log("Could not find avatar URL on channel page", "warn");
      return void 0;
    } catch (error) {
      this.logger.log(`Error extracting avatar: ${error}`, "warn");
      return void 0;
    }
  }
  isValidAvatarUrl(url) {
    if (!url) return false;
    const isYouTubeImage = url.includes("ytimg.com") || url.includes("googleusercontent.com") || url.includes("ggpht.com");
    const isNotBanner = !url.includes("featured_channel") && !url.includes("banner") && !url.includes("hqdefault") && !url.includes("mqdefault") && !url.includes("sddefault");
    return isYouTubeImage && isNotBanner;
  }
  async extractVerifiedStatus(page) {
    try {
      const verifiedSelectors = [
        '[aria-label*="Verified"]',
        '[aria-label*="verified"]',
        "#badge",
        "yt-icon#badge"
      ];
      for (const selector of verifiedSelectors) {
        try {
          const verified = page.locator(selector).first();
          if (await verified.isVisible({ timeout: 2e3 }).catch(() => false)) {
            const ariaLabel = await verified.getAttribute("aria-label").catch(() => null);
            if (ariaLabel && ariaLabel.toLowerCase().includes("verified")) {
              return true;
            }
          }
        } catch {
          continue;
        }
      }
      return false;
    } catch {
      return false;
    }
  }
  /**
   * Try to extract creator (avatar, verified) from video page embedded data to skip channel navigation.
   * Returns CreatorMetadata if we get avatar and/or verified from ytInitialData; null to fall back to channel page.
   */
  async tryExtractCreatorFromVideoPage(page, channelUrl) {
    try {
      const raw = await page.evaluate(() => {
        const yt = window.ytInitialData;
        if (!yt) return null;
        const result = {};
        const two = yt?.contents?.twoColumnWatchNextResults?.results?.results?.contents;
        const single = yt?.contents?.singleColumnWatchNextResults?.results?.results?.contents;
        const contents = two || single;
        if (!contents || !Array.isArray(contents)) return null;
        for (const c of contents) {
          const primary = c?.videoPrimaryInfoRenderer;
          const owner = primary?.owner?.videoOwnerRenderer;
          if (owner?.thumbnail?.thumbnails?.length) {
            const thumbs = owner.thumbnail.thumbnails;
            result.avatar = thumbs[thumbs.length - 1]?.url ?? thumbs[0]?.url;
          }
          if (primary?.badges) {
            for (const b of primary.badges) {
              const label = (b?.metadataBadgeRenderer?.label || "").toLowerCase();
              if (label.includes("verified")) {
                result.verified = true;
                break;
              }
            }
          }
          if (result.avatar !== void 0 && result.verified !== void 0) break;
        }
        return result.avatar || result.verified !== void 0 ? result : null;
      });
      if (!raw) return null;
      const metadata = {
        platform: "youtube",
        url: channelUrl,
        extractedAt: Date.now()
      };
      if (raw.avatar && this.isValidAvatarUrl(raw.avatar)) metadata.creator_avatar_url = raw.avatar;
      if (raw.verified !== void 0) metadata.creator_verified = raw.verified;
      if (!metadata.creator_avatar_url && metadata.creator_verified === void 0) return null;
      return metadata;
    } catch {
      return null;
    }
  }
  async extractYouTubeSpecificData(page, videoUrl) {
    try {
      const hasData = await page.evaluate(() => {
        return !!window.ytInitialPlayerResponse || !!window.ytInitialData;
      });
      if (!hasData) {
        this.logger.log("YouTube data not loaded yet, waiting...", "warn");
        await this.delay(200);
      }
      const data = await page.evaluate((videoUrl2) => {
        const result = {};
        if (window.ytInitialPlayerResponse) {
          const playerData = window.ytInitialPlayerResponse;
          if (playerData?.playabilityStatus?.playableInEmbed !== void 0) {
            result.embeddable = playerData.playabilityStatus.playableInEmbed;
          }
          const playabilityStatus = playerData?.playabilityStatus;
          if (playabilityStatus) {
            if (playabilityStatus.reason?.includes("age") || playabilityStatus.messages?.some((m) => m.toLowerCase().includes("age"))) {
              result.isAgeRestricted = true;
            } else {
              result.isAgeRestricted = false;
            }
          }
          const streamingData = playerData?.streamingData;
          if (streamingData?.adaptiveFormats) {
            let highestQuality = 0;
            for (const format of streamingData.adaptiveFormats) {
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
              const hasLowQuality = streamingData.adaptiveFormats.some((f) => f.height && f.height < 720);
              if (hasLowQuality) {
                result.definition = "sd";
              }
            }
          }
          if (!result.dimension) {
            result.dimension = "2d";
          }
          const videoDetails = playerData?.videoDetails;
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
                const viewersStr = String(videoDetails.concurrentViewers);
                if (viewersStr.includes(",") || viewersStr.includes(".")) {
                  let num = parseFloat(viewersStr.replace(/,/g, ""));
                  if (viewersStr.includes("K") || viewersStr.includes("k")) num *= 1e3;
                  else if (viewersStr.includes("M") || viewersStr.includes("m")) num *= 1e6;
                  result.concurrentViewers = Math.floor(num);
                } else {
                  result.concurrentViewers = parseInt(viewersStr) || 0;
                }
              }
              if (!result.concurrentViewers && videoDetails.concurrentViewerCount) {
                const viewersStr = String(videoDetails.concurrentViewerCount);
                if (viewersStr.includes(",") || viewersStr.includes(".")) {
                  let num = parseFloat(viewersStr.replace(/,/g, ""));
                  if (viewersStr.includes("K") || viewersStr.includes("k")) num *= 1e3;
                  else if (viewersStr.includes("M") || viewersStr.includes("m")) num *= 1e6;
                  result.concurrentViewers = Math.floor(num);
                } else {
                  result.concurrentViewers = parseInt(viewersStr) || 0;
                }
              }
            }
            if (result.isShort === void 0 && videoDetails.lengthSeconds) {
              const length = parseInt(videoDetails.lengthSeconds);
              if (length > 0 && length <= 60) {
              }
            }
            if (videoDetails.title) {
              result.title = videoDetails.title;
            }
            if (videoDetails.shortDescription) {
              result.description = videoDetails.shortDescription;
            }
            if (videoDetails.viewCount) {
              if (typeof videoDetails.viewCount === "number") {
                result.view_count = videoDetails.viewCount;
              } else {
                const viewCountStr = String(videoDetails.viewCount);
                if (viewCountStr.includes(",") || viewCountStr.includes(".")) {
                  let num = parseFloat(viewCountStr.replace(/,/g, ""));
                  if (viewCountStr.includes("K") || viewCountStr.includes("k")) num *= 1e3;
                  else if (viewCountStr.includes("M") || viewCountStr.includes("m")) num *= 1e6;
                  else if (viewCountStr.includes("B") || viewCountStr.includes("b")) num *= 1e9;
                  if (num > 0 && num < 1e10) {
                    result.view_count = Math.floor(num);
                  }
                } else {
                  const parsed = parseInt(viewCountStr);
                  if (parsed > 0 && parsed < 1e10) {
                    result.view_count = parsed;
                  }
                }
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
            if (videoDetails.thumbnail?.thumbnails && videoDetails.thumbnail.thumbnails.length > 0) {
              result.thumbnails = videoDetails.thumbnail.thumbnails.map((t) => t.url);
            }
            if (videoDetails.keywords && videoDetails.keywords.length > 0) {
              result.tags = videoDetails.keywords;
            }
          }
          const microformat = playerData?.microformat?.playerMicroformatRenderer;
          if (microformat) {
            if (microformat.category) {
              result.category = microformat.category;
            }
            if (!result.view_count && microformat.viewCount) {
              const viewCountStr = String(microformat.viewCount);
              const parsed = parseInt(viewCountStr.replace(/[^\d]/g, ""));
              if (parsed > 0 && parsed < 1e10) {
                result.view_count = parsed;
              }
            }
            if (microformat.defaultAudioLanguage) {
              result.defaultLanguage = microformat.defaultAudioLanguage;
            }
            if (!result.defaultLanguage && videoDetails?.defaultAudioLanguage) {
              result.defaultLanguage = videoDetails.defaultAudioLanguage;
            }
            if (!result.defaultLanguage && playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks) {
              const tracks = playerData.captions.playerCaptionsTracklistRenderer.captionTracks;
              const originalTrack = tracks.find(
                (t) => t.name?.simpleText?.toLowerCase().includes("original") || t.kind !== "asr" && t.isTranslatable === false
              );
              if (originalTrack && originalTrack.languageCode) {
                result.defaultLanguage = originalTrack.languageCode;
              } else {
                const englishTrack = tracks.find(
                  (t) => t.languageCode && (t.languageCode.startsWith("en") || t.languageCode === "en")
                );
                if (englishTrack && englishTrack.languageCode) {
                  result.defaultLanguage = englishTrack.languageCode;
                } else {
                  const firstTrack = tracks[0];
                  if (firstTrack && firstTrack.languageCode && firstTrack.kind !== "asr") {
                    const langCode = firstTrack.languageCode.split("-")[0];
                    const commonVideoLanguages = ["en", "es", "fr", "de", "ja", "ko", "pt", "ru", "it", "nl", "pl", "tr", "vi", "ar", "hi", "th", "id", "ms", "tl", "zh"];
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
                const startTime = parseInt(microformat.liveBroadcastDetails.startTimestamp);
                const now = Math.floor(Date.now() / 1e3);
                if (startTime > now) {
                  result.isUpcoming = true;
                }
              }
            }
            if (microformat.publishDate) {
              const date = new Date(microformat.publishDate);
              result.timestamp = Math.floor(date.getTime() / 1e3);
            } else if (microformat.uploadDate) {
              const date = new Date(microformat.uploadDate);
              result.timestamp = Math.floor(date.getTime() / 1e3);
            }
          }
          if (playerData?.videoDetails?.isMadeForKids !== void 0) {
            result.madeForKids = playerData.videoDetails.isMadeForKids;
          }
          if (result.madeForKids === void 0 && playerData?.playabilityStatus?.madeForKids !== void 0) {
            result.madeForKids = playerData.playabilityStatus.madeForKids;
          }
          if (result.madeForKids === void 0 && microformat?.isMadeForKids !== void 0) {
            result.madeForKids = microformat.isMadeForKids;
          }
          if (result.madeForKids === void 0 && videoDetails) {
            if (videoDetails.isKidsContent !== void 0) {
              result.madeForKids = videoDetails.isKidsContent;
            }
          }
          const captions = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
          result.hasCaptions = captions && captions.length > 0;
        }
        if (!result.tags) {
          const text = `${result.title || ""}
${result.description || ""}`;
          const hashtagMatches = text.match(/#[A-Za-z0-9_]+/g) || [];
          if (hashtagMatches.length > 0) {
            const unique = Array.from(new Set(hashtagMatches.map((h) => h.replace(/^#/, ""))));
            if (unique.length > 0) {
              result.tags = unique;
            }
          }
        }
        if (window.ytInitialData) {
          const ytData = window.ytInitialData;
          if (result.madeForKids === void 0) {
            const responseContext = ytData?.responseContext;
            if (responseContext?.mainAppWebResponseContext?.madeForKids !== void 0) {
              result.madeForKids = responseContext.mainAppWebResponseContext.madeForKids;
            }
            const contents2 = ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents;
            let hasCommentsSection = false;
            if (contents2) {
              for (const content of contents2) {
                if (content?.itemSectionRenderer?.sectionIdentifier === "comment-item-section") {
                  hasCommentsSection = true;
                  break;
                }
              }
            }
            const videoDetails = contents2?.[0]?.videoPrimaryInfoRenderer;
            if (videoDetails?.badges) {
              for (const badge of videoDetails.badges) {
                const label = badge?.metadataBadgeRenderer?.label?.toLowerCase() || "";
                if (label.includes("kids") || label.includes("children")) {
                  result.madeForKids = true;
                  break;
                }
              }
            }
            const pageText = (document.body?.innerText || "").toLowerCase();
            const pageHTML = (document.body?.innerHTML || "").toLowerCase();
            const combinedText = pageText + " " + pageHTML;
            const kidsIndicators = [
              "made for kids",
              "youtube kids",
              "try youtube kids",
              "app made just for kids",
              "comments are turned off",
              "comments are disabled"
            ];
            let foundKidsIndicator = false;
            for (const indicator of kidsIndicators) {
              if (combinedText.includes(indicator.toLowerCase())) {
                foundKidsIndicator = true;
                break;
              }
            }
            if (foundKidsIndicator) {
              result.madeForKids = true;
            }
            if (result.madeForKids === void 0 && !hasCommentsSection) {
              let channelName = result.channel_name?.toLowerCase() || "";
              if (!channelName) {
                const channelInfo = contents2?.[0]?.videoPrimaryInfoRenderer?.owner?.videoOwnerRenderer?.title?.runs?.[0]?.text || contents2?.[0]?.videoPrimaryInfoRenderer?.owner?.videoOwnerRenderer?.title?.simpleText;
                if (channelInfo) {
                  channelName = channelInfo.toLowerCase();
                }
              }
              const kidsChannelPatterns = [
                "nursery rhymes",
                "kids songs",
                "children",
                "cocomelon",
                "pinkfong",
                "little baby bum",
                "super simple songs"
              ];
              for (const pattern of kidsChannelPatterns) {
                if (channelName.includes(pattern)) {
                  result.madeForKids = true;
                  break;
                }
              }
            }
            if (result.madeForKids === void 0 && window.ytcfg) {
              const ytcfg = window.ytcfg;
              const data2 = ytcfg.data_ || ytcfg.d?.() || {};
              if (data2.PLAYER_VARS?.madeForKids !== void 0) {
                result.madeForKids = data2.PLAYER_VARS.madeForKids;
              }
            }
            if (result.madeForKids === void 0) {
              result.madeForKids = false;
            }
          }
          const contents = ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents;
          if (contents) {
            const videoPrimaryInfo = contents[0]?.videoPrimaryInfoRenderer;
            if (videoPrimaryInfo) {
              const topLevelButtons = videoPrimaryInfo?.videoActions?.menuRenderer?.topLevelButtons;
              if (topLevelButtons) {
                for (const button of topLevelButtons) {
                  if (button?.segmentedLikeDislikeButtonRenderer) {
                    const likeButton = button.segmentedLikeDislikeButtonRenderer.likeButton;
                    if (likeButton?.toggleButtonRenderer) {
                      const likeText = likeButton.toggleButtonRenderer.defaultText?.accessibility?.accessibilityData?.label || likeButton.toggleButtonRenderer.defaultText?.simpleText || likeButton.toggleButtonRenderer.toggledText?.accessibility?.accessibilityData?.label || likeButton.toggleButtonRenderer.toggledText?.simpleText || likeButton.toggleButtonRenderer.defaultText?.runs?.[0]?.text || "";
                      if (likeText && !likeText.toLowerCase().includes("view") && !likeText.toLowerCase().includes("like this")) {
                        const likeMatch = likeText.match(/([\d.,]+[KMB]?)/);
                        if (likeMatch) {
                          let num = parseFloat(likeMatch[1].replace(/,/g, ""));
                          const matchText = likeMatch[1];
                          if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                          else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                          else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
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
            for (const content of contents) {
              if (content?.itemSectionRenderer?.contents?.[0]?.commentsEntryPointHeaderRenderer) {
                const commentHeader = content.itemSectionRenderer.contents[0].commentsEntryPointHeaderRenderer;
                const commentCount = commentHeader?.commentCount?.simpleText || commentHeader?.commentCount?.runs?.[0]?.text || commentHeader?.contentRenderer?.commentsEntryPointHeaderRenderer?.commentCount?.simpleText || commentHeader?.commentCount?.accessibility?.accessibilityData?.label;
                if (commentCount) {
                  const match = commentCount.match(/([\d.,]+[KMB]?)/);
                  if (match) {
                    let num = parseFloat(match[1].replace(/,/g, ""));
                    const matchText = match[1];
                    if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                    else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                    else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
                    if (num > 0 && num < 1e8) {
                      result.comment_count = Math.floor(num);
                      break;
                    }
                  }
                }
              }
              if (content?.commentsEntryPointHeaderRenderer) {
                const commentHeader = content.commentsEntryPointHeaderRenderer;
                const commentCount = commentHeader?.commentCount?.simpleText || commentHeader?.commentCount?.runs?.[0]?.text;
                if (commentCount && !result.comment_count) {
                  const match = commentCount.match(/([\d.,]+[KMB]?)/);
                  if (match) {
                    let num = parseFloat(match[1].replace(/,/g, ""));
                    const matchText = match[1];
                    if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                    else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                    else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
                    if (num > 0 && num < 1e8) {
                      result.comment_count = Math.floor(num);
                      break;
                    }
                  }
                }
              }
              if (content?.itemSectionRenderer?.contents) {
                for (const item of content.itemSectionRenderer.contents) {
                  if (item?.commentsEntryPointHeaderRenderer) {
                    const commentHeader = item.commentsEntryPointHeaderRenderer;
                    const commentCount = commentHeader?.commentCount?.simpleText || commentHeader?.commentCount?.runs?.[0]?.text;
                    if (commentCount && !result.comment_count) {
                      const match = commentCount.match(/([\d.,]+[KMB]?)/);
                      if (match) {
                        let num = parseFloat(match[1].replace(/,/g, ""));
                        const matchText = match[1];
                        if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                        else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                        else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
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
                const responseContext = ytData?.responseContext;
                if (responseContext) {
                  const visitorData = responseContext?.visitorData;
                }
                const onResponseReceived = ytData?.onResponseReceivedActions;
                if (onResponseReceived && Array.isArray(onResponseReceived)) {
                  for (const action of onResponseReceived) {
                    if (action?.reloadContinuationItemsCommand?.continuationItems) {
                      const items = action.reloadContinuationItemsCommand.continuationItems;
                      for (const item of items) {
                        if (item?.commentsEntryPointHeaderRenderer?.commentCount) {
                          const commentCount = item.commentsEntryPointHeaderRenderer.commentCount.simpleText || item.commentsEntryPointHeaderRenderer.commentCount.runs?.[0]?.text;
                          if (commentCount) {
                            const match = commentCount.match(/([\d.,]+[KMB]?)/);
                            if (match) {
                              let num = parseFloat(match[1].replace(/,/g, ""));
                              const matchText = match[1];
                              if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                              else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                              else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
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
            const videoPrimaryInfo = contents?.[0]?.videoPrimaryInfoRenderer;
            if (videoPrimaryInfo) {
              const viewCount = videoPrimaryInfo?.viewCount?.videoViewCountRenderer?.viewCount?.simpleText || videoPrimaryInfo?.viewCount?.videoViewCountRenderer?.originalViewCount;
              if (viewCount && (viewCount.includes("watching") || viewCount.includes("viewers"))) {
                const match = viewCount.match(/([\d.,]+[KMB]?)/);
                if (match) {
                  let num = parseFloat(match[1].replace(/,/g, ""));
                  const matchText = match[1];
                  if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                  else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                  if (num > 0 && num < 1e8) {
                    result.concurrentViewers = Math.floor(num);
                  }
                }
              }
            }
          }
          const secondaryInfo = ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[1]?.videoSecondaryInfoRenderer;
          const description = secondaryInfo?.attributedDescription?.content;
          if (description) {
            result.description = description;
            const mentions = description.match(/@[\w.]+/g);
            if (mentions) {
              result.mentions = mentions.map((m) => m.substring(1));
            }
          }
          if (!result.mentions) {
            const playerResponse = window.ytInitialPlayerResponse;
            const shortDesc = playerResponse?.videoDetails?.shortDescription;
            if (shortDesc) {
              const mentions = shortDesc.match(/@[\w.]+/g);
              if (mentions) {
                result.mentions = mentions.map((m) => m.substring(1));
              }
            }
          }
          const pageType = ytData?.page;
          if (pageType === "shorts") {
            result.isShort = true;
          }
          const engagementPanels = ytData?.engagementPanels;
          if (engagementPanels) {
            for (const panel of engagementPanels) {
              if (panel?.engagementPanelSectionListRenderer?.panelIdentifier === "shorts-info-panel") {
                result.isShort = true;
                break;
              }
            }
          }
          if (result.isShort === void 0) {
            if (videoUrl2 && videoUrl2.includes("/shorts/")) {
              result.isShort = true;
            } else {
              result.isShort = false;
            }
          }
          if (result.isShort) {
            if (!result.view_count) {
              const paths = [
                // Path 1: reelPlayerOverlayRenderer
                ytData?.contents?.singleColumnWatchNextResults?.results?.results?.contents?.[0]?.reelPlayerOverlayRenderer,
                // Path 2: reelWatchRenderer
                ytData?.contents?.singleColumnWatchNextResults?.results?.results?.contents?.[0]?.reelWatchRenderer,
                // Path 3: Check all contents for reel-related renderers
                ...ytData?.contents?.singleColumnWatchNextResults?.results?.results?.contents || []
              ];
              for (const path4 of paths) {
                if (!path4) continue;
                const header = path4?.reelPlayerHeaderSupportedRenderers?.reelPlayerHeaderRenderer || path4?.reelPlayerHeaderRenderer;
                if (header?.viewCountText) {
                  const viewText = header.viewCountText.simpleText || header.viewCountText.runs?.[0]?.text || header.viewCountText?.accessibility?.accessibilityData?.label;
                  if (viewText) {
                    const match = viewText.match(/([\d.,]+[KMB]?)/);
                    if (match) {
                      let num = parseFloat(match[1].replace(/,/g, ""));
                      const matchText = match[1];
                      if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                      else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                      else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
                      if (num > 0 && num < 1e10) {
                        result.view_count = Math.floor(num);
                        break;
                      }
                    }
                  }
                }
                const primaryInfo = path4?.videoPrimaryInfoRenderer;
                if (primaryInfo?.viewCount?.videoViewCountRenderer) {
                  const viewCount = primaryInfo.viewCount.videoViewCountRenderer.viewCount?.simpleText || primaryInfo.viewCount.videoViewCountRenderer.originalViewCount;
                  if (viewCount) {
                    const match = viewCount.match(/([\d.,]+[KMB]?)/);
                    if (match) {
                      let num = parseFloat(match[1].replace(/,/g, ""));
                      const matchText = match[1];
                      if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                      else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                      else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
                      if (num > 0 && num < 1e10) {
                        result.view_count = Math.floor(num);
                        break;
                      }
                    }
                  }
                }
              }
              if (!result.view_count && engagementPanels) {
                for (const panel of engagementPanels) {
                  const panelContent = panel?.engagementPanelSectionListRenderer?.content;
                  if (panelContent?.structuredDescriptionContentRenderer?.items) {
                    for (const item of panelContent.structuredDescriptionContentRenderer.items) {
                      const viewCountText = item?.videoDescriptionHeaderRenderer?.viewCountText?.simpleText || item?.videoDescriptionHeaderRenderer?.viewCountText?.runs?.[0]?.text;
                      if (viewCountText) {
                        const match = viewCountText.match(/([\d.,]+[KMB]?)/);
                        if (match) {
                          let num = parseFloat(match[1].replace(/,/g, ""));
                          const matchText = match[1];
                          if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                          else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                          else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
                          if (num > 0 && num < 1e10) {
                            result.view_count = Math.floor(num);
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (!result.comment_count) {
              const paths = [
                ytData?.contents?.singleColumnWatchNextResults?.results?.results?.contents?.[0]?.reelPlayerOverlayRenderer,
                ...ytData?.contents?.singleColumnWatchNextResults?.results?.results?.contents || []
              ];
              for (const path4 of paths) {
                if (!path4) continue;
                const actions = path4?.reelPlayerActionsRenderer?.actionButtons;
                if (actions) {
                  for (const button of actions) {
                    if (button?.commentButtonRenderer?.commentCount) {
                      const commentCount = button.commentButtonRenderer.commentCount.simpleText || button.commentButtonRenderer.commentCount.runs?.[0]?.text || button.commentButtonRenderer.commentCount?.accessibility?.accessibilityData?.label;
                      if (commentCount) {
                        const match = commentCount.match(/([\d.,]+[KMB]?)/);
                        if (match) {
                          let num = parseFloat(match[1].replace(/,/g, ""));
                          const matchText = match[1];
                          if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                          else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                          else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
                          if (num > 0 && num < 1e8) {
                            result.comment_count = Math.floor(num);
                            break;
                          }
                        }
                      }
                    }
                  }
                }
                if (path4?.commentsEntryPointHeaderRenderer?.commentCount) {
                  const commentCount = path4.commentsEntryPointHeaderRenderer.commentCount.simpleText || path4.commentsEntryPointHeaderRenderer.commentCount.runs?.[0]?.text;
                  if (commentCount) {
                    const match = commentCount.match(/([\d.,]+[KMB]?)/);
                    if (match) {
                      let num = parseFloat(match[1].replace(/,/g, ""));
                      const matchText = match[1];
                      if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                      else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                      else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
                      if (num > 0 && num < 1e8) {
                        result.comment_count = Math.floor(num);
                        break;
                      }
                    }
                  }
                }
              }
              if (!result.comment_count && engagementPanels) {
                for (const panel of engagementPanels) {
                  const panelContent = panel?.engagementPanelSectionListRenderer?.content;
                  const commentCountText = panelContent?.structuredDescriptionContentRenderer?.items?.[0]?.videoDescriptionHeaderRenderer?.commentCountText?.simpleText || panelContent?.structuredDescriptionContentRenderer?.items?.[0]?.videoDescriptionHeaderRenderer?.commentCountText?.runs?.[0]?.text;
                  if (commentCountText) {
                    const match = commentCountText.match(/([\d.,]+[KMB]?)/);
                    if (match) {
                      let num = parseFloat(match[1].replace(/,/g, ""));
                      const matchText = match[1];
                      if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                      else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                      else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
                      if (num > 0 && num < 1e8) {
                        result.comment_count = Math.floor(num);
                        break;
                      }
                    }
                  }
                  if (panelContent?.commentsEntryPointHeaderRenderer?.commentCount) {
                    const commentCount = panelContent.commentsEntryPointHeaderRenderer.commentCount.simpleText || panelContent.commentsEntryPointHeaderRenderer.commentCount.runs?.[0]?.text;
                    if (commentCount) {
                      const match = commentCount.match(/([\d.,]+[KMB]?)/);
                      if (match) {
                        let num = parseFloat(match[1].replace(/,/g, ""));
                        const matchText = match[1];
                        if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                        else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                        else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
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
            if (!result.mentions) {
              const playerResponse = window.ytInitialPlayerResponse;
              const shortDesc = playerResponse?.videoDetails?.shortDescription;
              if (shortDesc) {
                const mentions = shortDesc.match(/@[\w.]+/g);
                if (mentions) {
                  result.mentions = mentions.map((m) => m.substring(1));
                }
              }
            }
            if (!result.tags) {
              const playerResponse = window.ytInitialPlayerResponse;
              const keywords = playerResponse?.videoDetails?.keywords;
              if (keywords && Array.isArray(keywords) && keywords.length > 0) {
                result.tags = keywords;
              }
            }
          }
          if (result.isUpcoming === void 0) {
            result.isUpcoming = false;
          }
        }
        return result;
      }, videoUrl);
      return data;
    } catch (error) {
      this.logger.log(`Failed to extract YouTube-specific data: ${error}`, "error");
      return null;
    }
  }
};

// src/scrapers/TikTokScraper.ts
var TikTokScraper = class extends CreatorMetadataScraper {
  async getCreatorProfileUrl(videoUrl) {
    try {
      const match = videoUrl.match(/tiktok\.com\/@([^\/]+)/);
      if (match) {
        return `https://www.tiktok.com/@${match[1]}`;
      }
      return null;
    } catch {
      return null;
    }
  }
  async extractMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting TikTok creator metadata...", "info");
      const profileUrl = await this.getCreatorProfileUrl(videoUrl);
      if (!profileUrl) {
        this.logger.log("Could not determine TikTok profile URL", "warn");
        return null;
      }
      const metadata = {
        platform: "tiktok",
        url: profileUrl,
        extractedAt: Date.now()
      };
      const usernameMatch = profileUrl.match(/@([^\/\?]+)/);
      if (usernameMatch) {
        metadata.creator_username = usernameMatch[1];
        metadata.creator_profile_deep_link = profileUrl;
      }
      const currentUrl = page.url();
      const videoIdMatch = videoUrl.match(/\/video\/(\d+)/);
      const alreadyOnVideoPage = videoIdMatch && currentUrl.includes(videoIdMatch[1]);
      if (alreadyOnVideoPage) {
        this.logger.log("Already on video page, attempting to extract creator data from here first", "debug");
        const fromVideoPage = await this.tryExtractCreatorFromVideoPage(page, profileUrl);
        if (fromVideoPage) {
          this.logger.log("Successfully extracted TikTok creator metadata from video page (skipped profile)", "info");
          return fromVideoPage;
        }
      }
      await page.goto(profileUrl, { waitUntil: "domcontentloaded" });
      try {
        await page.waitForSelector('[data-e2e="user-title"], [data-e2e="user-avatar"]', { timeout: 3e3 });
      } catch {
      }
      await this.delay(500);
      const nameSelectors = [
        '[data-e2e="user-title"]',
        'h1[data-e2e="user-title"]',
        ".user-title",
        "h1"
      ];
      for (const selector of nameSelectors) {
        const name = await this.getElementText(page, selector);
        if (name && !name.includes("@")) {
          metadata.creator_name = this.cleanText(name);
          break;
        }
      }
      const followerSelectors = [
        '[data-e2e="followers-count"]',
        '[data-e2e="followers"]',
        ".followers-count",
        'strong[title*="followers"]'
      ];
      for (const selector of followerSelectors) {
        const followerText = await this.getElementText(page, selector);
        if (followerText) {
          metadata.creator_follower_count = this.parseCount(followerText);
          break;
        }
      }
      const bioSelectors = [
        '[data-e2e="user-bio"]',
        ".user-bio",
        '[data-e2e="user-desc"]'
      ];
      for (const selector of bioSelectors) {
        const bio = await this.getElementText(page, selector);
        if (bio && bio.length > 5) {
          metadata.creator_bio = this.cleanText(bio);
          break;
        }
      }
      const avatarSelectors = [
        '[data-e2e="user-avatar"] img',
        ".avatar img",
        'img[alt*="avatar"]',
        'img[data-e2e="user-avatar"]'
      ];
      for (const selector of avatarSelectors) {
        const avatar = await this.getElementAttribute(page, selector, "src");
        if (avatar) {
          metadata.creator_avatar_url = avatar;
          if (avatar.includes("tiktokcdn.com")) {
            const avatar100 = avatar.replace(/~tplv-[^:]+:[^:]+:[^:]+/, "~tplv-tiktokx-cropcenter:100:100");
            if (avatar100 !== avatar) {
              metadata.creator_avatar_url_100 = avatar100;
            }
            const avatarLarge = avatar.replace(/~tplv-[^:]+:[^:]+:[^:]+/, "~tplv-tiktokx-cropcenter:720:720");
            if (avatarLarge !== avatar) {
              metadata.creator_avatar_large_url = avatarLarge;
            }
          }
          break;
        }
      }
      const verifiedSelectors = [
        '[data-e2e="verified-icon"]',
        ".verified-badge",
        '[aria-label*="Verified"]',
        '[title*="Verified"]',
        'svg[data-e2e="verified-icon"]',
        '[class*="verified"]',
        '[class*="Verified"]'
      ];
      metadata.creator_verified = false;
      for (const selector of verifiedSelectors) {
        const verified = await page.locator(selector).first();
        if (await verified.isVisible({ timeout: 2e3 }).catch(() => false)) {
          metadata.creator_verified = true;
          this.logger.log(`Found verified badge with selector: ${selector}`, "debug");
          break;
        }
      }
      if (!metadata.creator_verified) {
        try {
          const verifiedInPage = await page.evaluate(() => {
            const elements = document.querySelectorAll("*");
            for (const el of elements) {
              const ariaLabel = el.getAttribute("aria-label");
              const title = el.getAttribute("title");
              const className = el.className || "";
              if (ariaLabel && ariaLabel.toLowerCase().includes("verified") || title && title.toLowerCase().includes("verified") || className && className.toLowerCase().includes("verified")) {
                return true;
              }
            }
            return false;
          });
          if (verifiedInPage) {
            metadata.creator_verified = true;
            this.logger.log("Found verified badge via page evaluation", "debug");
          }
        } catch (e) {
          this.logger.log(`Error checking verified status: ${e}`, "debug");
        }
      }
      this.logger.log("Successfully extracted TikTok creator metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract TikTok metadata: ${error}`, "error");
      return null;
    }
  }
  async tryExtractCreatorFromVideoPage(page, profileUrl) {
    try {
      const raw = await page.evaluate(() => {
        const result = {};
        const extractFromData = (data) => {
          if (!data) return;
          const itemModule = data.ItemModule || data.itemModule;
          if (!itemModule) return;
          const video = Object.values(itemModule)[0];
          if (!video || !video.author) return;
          const author = video.author;
          if (author.avatarThumb || author.avatarMedium || author.avatarLarger) {
            result.avatar = author.avatarLarger || author.avatarMedium || author.avatarThumb;
          }
          if (author.verified !== void 0) {
            result.verified = author.verified;
          }
          if (author.nickname) {
            result.name = author.nickname;
          }
          if (author.signature) {
            result.bio = author.signature;
          }
          const stats = video.authorStats || video.authorStatsV2;
          if (stats && stats.followerCount !== void 0) {
            result.follower_count = stats.followerCount;
          }
        };
        if (window.__UNIVERSAL_DATA_FOR_REHYDRATION__) {
          const data = window.__UNIVERSAL_DATA_FOR_REHYDRATION__;
          const state = data.defaultScope || data;
          extractFromData(state);
        }
        if (!result.avatar && window.SIGI_STATE) {
          extractFromData(window.SIGI_STATE);
        }
        return Object.keys(result).length > 0 ? result : null;
      });
      if (!raw) return null;
      const metadata = {
        platform: "tiktok",
        url: profileUrl,
        extractedAt: Date.now()
      };
      if (raw.avatar) metadata.creator_avatar_url = raw.avatar;
      if (raw.verified !== void 0) metadata.creator_verified = raw.verified;
      if (raw.name) metadata.creator_name = raw.name;
      if (raw.follower_count !== void 0) metadata.creator_follower_count = raw.follower_count;
      if (raw.bio) metadata.creator_bio = raw.bio;
      if (!metadata.creator_avatar_url && metadata.creator_verified === void 0 && !metadata.creator_name) {
        return null;
      }
      return metadata;
    } catch {
      return null;
    }
  }
  async extractVideoMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting TikTok video metadata...", "info");
      const apiResponses = [];
      const allApiResponses = [];
      const responseHandler = async (response) => {
        const url = response.url();
        if (url.includes("/api/") || url.includes("/aweme/") || url.includes("/post/") || url.includes("/tiktok/")) {
          try {
            const json = await response.json();
            allApiResponses.push({ url, data: json });
            const hasVideoData = url.includes("item_list") || url.includes("itemList") || url.includes("/post/item_list") || url.includes("/api/post/item_list") || url.includes("related/item_list") || url.includes("video") || url.includes("post") || url.includes("item/detail") || url.includes("aweme/detail") || url.includes("item/info") || url.includes("feed") || url.includes("aweme/v1") || url.includes("aweme/v2") || url.includes("item") || (json.itemInfo || json.itemList || json.items || json.aweme_detail || json.item || json.data);
            if (hasVideoData) {
              apiResponses.push({ url, data: json });
              this.logger.log(`Found potential video data API: ${url.substring(0, 150)}`, "debug");
              const dataKeys = Object.keys(json).slice(0, 10);
              this.logger.log(`  API response keys: ${dataKeys.join(", ")}`, "debug");
              if (json.itemInfo || json.itemList || json.items || json.aweme_detail || json.item) {
                this.logger.log(`  Contains video data structure!`, "info");
              }
            }
          } catch (e) {
          }
        }
      };
      page.on("response", responseHandler);
      try {
        await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
        await Promise.race([
          page.waitForResponse((response) => {
            const url = response.url();
            return (url.includes("/api/") || url.includes("/aweme/") || url.includes("/tiktok/")) && (url.includes("item") || url.includes("video") || url.includes("post") || url.includes("feed") || url.includes("aweme/v"));
          }, { timeout: 8e3 }).catch(() => null),
          new Promise((resolve) => setTimeout(resolve, 8e3))
        ]);
        await this.delay(1e3);
        try {
          await page.waitForSelector('[data-e2e="browse-video-desc"], [data-e2e="video-desc"], [class*="desc"], h1, [class*="Description"]', { timeout: 3e3 });
        } catch (e) {
          this.logger.log("Video description element not found, continuing anyway", "debug");
        }
        await this.delay(200);
      } finally {
        page.off("response", responseHandler);
      }
      this.logger.log(`Total API responses captured: ${allApiResponses.length}`, "debug");
      const metadata = {
        platform: "tiktok",
        url: videoUrl,
        extractedAt: Date.now()
      };
      const videoIdMatch = videoUrl.match(/\/video\/(\d+)/);
      if (videoIdMatch) {
        metadata.video_id = videoIdMatch[1];
      }
      const videoId = videoIdMatch?.[1];
      const embeddedData = await this.extractTikTokEmbeddedData(page, videoId, apiResponses);
      if (embeddedData) {
        this.logger.log(`Extracted ${Object.keys(embeddedData).length} fields from embedded data`, "debug");
        this.logger.log(`Embedded data keys: ${Object.keys(embeddedData).join(", ")}`, "debug");
        if (embeddedData.embed_link) metadata.embed_link = embeddedData.embed_link;
        if (embeddedData.hashtags) {
          metadata.hashtags = embeddedData.hashtags;
          this.logger.log(`Merged hashtags: ${Array.isArray(embeddedData.hashtags) ? embeddedData.hashtags.join(", ") : embeddedData.hashtags}`, "info");
        }
        if (embeddedData.effect_ids) {
          metadata.effect_ids = embeddedData.effect_ids;
          this.logger.log(`Merged effect_ids: ${Array.isArray(embeddedData.effect_ids) ? embeddedData.effect_ids.join(", ") : embeddedData.effect_ids}`, "info");
        }
        if (embeddedData.playlist_id) metadata.playlist_id = embeddedData.playlist_id;
        if (embeddedData.voice_to_text) metadata.voice_to_text = embeddedData.voice_to_text;
        if (embeddedData.region_code) metadata.region_code = embeddedData.region_code;
        if (embeddedData.music_id) metadata.music_id = embeddedData.music_id;
        if (embeddedData.caption) metadata.caption = embeddedData.caption;
        if (embeddedData.timestamp !== void 0) metadata.timestamp = embeddedData.timestamp;
        if (embeddedData.like_count !== void 0) metadata.like_count = embeddedData.like_count;
        if (embeddedData.comment_count !== void 0) metadata.comment_count = embeddedData.comment_count;
        if (embeddedData.view_count !== void 0) metadata.view_count = embeddedData.view_count;
        if (embeddedData.play_count !== void 0) metadata.play_count = embeddedData.play_count;
        if (embeddedData.share_count !== void 0) metadata.share_count = embeddedData.share_count;
        if (embeddedData.duration !== void 0) metadata.duration = embeddedData.duration;
        if (embeddedData.music_title) metadata.music_title = embeddedData.music_title;
        if (embeddedData.music_artist) metadata.music_artist = embeddedData.music_artist;
        if (embeddedData.mentions) metadata.mentions = embeddedData.mentions;
        if (embeddedData.thumbnails) metadata.thumbnails = embeddedData.thumbnails;
        if (embeddedData.save_count !== void 0) metadata.save_count = embeddedData.save_count;
        if (embeddedData.location) metadata.location = embeddedData.location;
        if (embeddedData.location_latitude !== void 0) metadata.location_latitude = embeddedData.location_latitude;
        if (embeddedData.location_longitude !== void 0) metadata.location_longitude = embeddedData.location_longitude;
        if (embeddedData.is_video !== void 0) metadata.is_video = embeddedData.is_video;
        if (embeddedData.dimension) metadata.dimension = embeddedData.dimension;
      } else {
        this.logger.log("No embedded data found", "debug");
      }
      if (!metadata.embed_link && videoIdMatch?.[1]) {
        metadata.embed_link = `https://www.tiktok.com/embed/v2/${videoIdMatch[1]}`;
      }
      if (!metadata.hashtags || !metadata.music_id || !metadata.caption) {
        const domData = await this.extractTikTokDOMData(page);
        if (domData) {
          this.logger.log(`Extracted ${Object.keys(domData).length} fields from DOM`, "debug");
          this.logger.log(`DOM data keys: ${Object.keys(domData).join(", ")}`, "debug");
          if (domData.embed_link && !metadata.embed_link) metadata.embed_link = domData.embed_link;
          if (domData.hashtags && !metadata.hashtags) {
            metadata.hashtags = domData.hashtags;
            this.logger.log(`Found ${domData.hashtags.length} hashtags in DOM`, "info");
          }
          if (domData.music_id && !metadata.music_id) {
            metadata.music_id = domData.music_id;
            this.logger.log(`Found music_id in DOM: ${domData.music_id}`, "info");
          }
          if (domData.caption && !metadata.caption) {
            metadata.caption = domData.caption;
            this.logger.log(`Found caption in DOM (${domData.caption.length} chars)`, "info");
          }
        } else {
          this.logger.log("No data extracted from DOM", "debug");
        }
      } else {
        this.logger.log("Skipping DOM extraction - all critical fields found in embedded data", "debug");
      }
      this.logger.log(`Final metadata keys: ${Object.keys(metadata).join(", ")}`, "debug");
      if (metadata.effect_ids) {
        this.logger.log(`Final effect_ids: ${Array.isArray(metadata.effect_ids) ? metadata.effect_ids.join(", ") : metadata.effect_ids}`, "info");
      }
      if (metadata.hashtags) {
        this.logger.log(`Final hashtags: ${Array.isArray(metadata.hashtags) ? metadata.hashtags.join(", ") : metadata.hashtags}`, "info");
      }
      const creatorFields = {};
      if (embeddedData?.creator_open_id) creatorFields.creator_open_id = embeddedData.creator_open_id;
      if (embeddedData?.creator_union_id) creatorFields.creator_union_id = embeddedData.creator_union_id;
      if (embeddedData?.creator_avatar_url_100) creatorFields.creator_avatar_url_100 = embeddedData.creator_avatar_url_100;
      if (embeddedData?.creator_avatar_large_url) creatorFields.creator_avatar_large_url = embeddedData.creator_avatar_large_url;
      if (embeddedData?.creator_profile_deep_link) creatorFields.creator_profile_deep_link = embeddedData.creator_profile_deep_link;
      if (embeddedData?.creator_following_count !== void 0) creatorFields.creator_following_count = embeddedData.creator_following_count;
      if (embeddedData?.creator_likes_count !== void 0) creatorFields.creator_likes_count = embeddedData.creator_likes_count;
      if (embeddedData?.creator_video_count !== void 0) creatorFields.creator_video_count = embeddedData.creator_video_count;
      if (Object.keys(creatorFields).length > 0) {
        metadata.creator_fields = creatorFields;
        this.logger.log(`Extracted ${Object.keys(creatorFields).length} creator fields from video API`, "info");
      }
      this.logger.log("Successfully extracted TikTok video metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract TikTok video metadata: ${error}`, "error");
      return null;
    }
  }
  async extractTikTokEmbeddedData(page, videoId, apiResponses) {
    try {
      const evalCode = `
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
      let response = await page.evaluate(evalCode + `(${JSON.stringify(videoId)})`);
      if (!response) {
        response = { data: {} };
      } else if (!response.data) {
        response.data = {};
      }
      if (apiResponses && apiResponses.length > 0) {
        this.logger.log(`Found ${apiResponses.length} potential video data API responses`, "debug");
        for (const apiResp of apiResponses) {
          this.logger.log(`Processing API URL: ${apiResp.url.substring(0, 150)}`, "debug");
          const dataKeys = apiResp.data ? Object.keys(apiResp.data).slice(0, 15) : [];
          this.logger.log(`API data keys: ${dataKeys.join(", ")}`, "debug");
          const extractVideoData = (videoData, source) => {
            if (!videoData || !response?.data) return;
            const videoKeys = Object.keys(videoData);
            this.logger.log(`${source} video keys (first 50): ${videoKeys.slice(0, 50).join(", ")}`, "debug");
            if (videoKeys.length > 50) {
              this.logger.log(`${source} video has ${videoKeys.length} total keys (showing first 50)`, "debug");
            }
            const hasEffectStickers = videoKeys.includes("effectStickers");
            if (hasEffectStickers) {
              this.logger.log(`${source} has effectStickers key`, "debug");
            }
            if (videoData.effectStickers) {
              this.logger.log(`${source} effectStickers type: ${Array.isArray(videoData.effectStickers) ? "array" : typeof videoData.effectStickers}, length: ${Array.isArray(videoData.effectStickers) ? videoData.effectStickers.length : "N/A"}`, "debug");
              if (Array.isArray(videoData.effectStickers) && videoData.effectStickers.length > 0) {
                this.logger.log(`${source} effectStickers sample: ${JSON.stringify(videoData.effectStickers[0])}`, "debug");
              }
            } else {
              this.logger.log(`${source} no effectStickers found (checked ${videoKeys.length} keys)`, "debug");
            }
            if (videoData.desc) {
              this.logger.log(`${source} desc preview: ${String(videoData.desc).substring(0, 100)}`, "debug");
            }
            if (videoData.textExtra) {
              this.logger.log(`${source} textExtra type: ${Array.isArray(videoData.textExtra) ? "array" : typeof videoData.textExtra}, length: ${Array.isArray(videoData.textExtra) ? videoData.textExtra.length : "N/A"}`, "debug");
            }
            if (videoData.challengeList) {
              this.logger.log(`${source} challengeList type: ${Array.isArray(videoData.challengeList) ? "array" : typeof videoData.challengeList}, length: ${Array.isArray(videoData.challengeList) ? videoData.challengeList.length : "N/A"}`, "debug");
            }
            if (!response.data.caption && videoData.desc) {
              response.data.caption = String(videoData.desc);
              this.logger.log(`Extracted caption from ${source} (${response.data.caption.length} chars)`, "info");
            }
            if (!response.data.timestamp && videoData.createTime) {
              const createTime = typeof videoData.createTime === "number" ? videoData.createTime : parseInt(String(videoData.createTime));
              if (!isNaN(createTime)) {
                response.data.timestamp = createTime;
                this.logger.log(`Extracted timestamp from ${source}: ${createTime}`, "info");
              }
            }
            if (videoData.stats) {
              if (!response.data.like_count && (videoData.stats.diggCount !== void 0 || videoData.stats.likeCount !== void 0)) {
                response.data.like_count = videoData.stats.diggCount || videoData.stats.likeCount || 0;
                this.logger.log(`Extracted like_count from ${source}: ${response.data.like_count}`, "info");
              }
              if (!response.data.comment_count && videoData.stats.commentCount !== void 0) {
                response.data.comment_count = videoData.stats.commentCount || 0;
                this.logger.log(`Extracted comment_count from ${source}: ${response.data.comment_count}`, "info");
              }
              if (!response.data.view_count && (videoData.stats.playCount !== void 0 || videoData.stats.viewCount !== void 0)) {
                response.data.view_count = videoData.stats.playCount || videoData.stats.viewCount || 0;
                this.logger.log(`Extracted view_count from ${source}: ${response.data.view_count}`, "info");
              }
              if (!response.data.play_count && videoData.stats.playCount !== void 0) {
                response.data.play_count = videoData.stats.playCount || 0;
                this.logger.log(`Extracted play_count from ${source}: ${response.data.play_count}`, "info");
              }
              if (!response.data.share_count && videoData.stats.shareCount !== void 0) {
                response.data.share_count = videoData.stats.shareCount || 0;
                this.logger.log(`Extracted share_count from ${source}: ${response.data.share_count}`, "info");
              }
            }
            if (videoData.statsV2) {
              if (!response.data.like_count && (videoData.statsV2.diggCount !== void 0 || videoData.statsV2.likeCount !== void 0)) {
                response.data.like_count = videoData.statsV2.diggCount || videoData.statsV2.likeCount || 0;
                this.logger.log(`Extracted like_count from ${source} statsV2: ${response.data.like_count}`, "info");
              }
              if (!response.data.comment_count && videoData.statsV2.commentCount !== void 0) {
                response.data.comment_count = videoData.statsV2.commentCount || 0;
                this.logger.log(`Extracted comment_count from ${source} statsV2: ${response.data.comment_count}`, "info");
              }
              if (!response.data.view_count && (videoData.statsV2.playCount !== void 0 || videoData.statsV2.viewCount !== void 0)) {
                response.data.view_count = videoData.statsV2.playCount || videoData.statsV2.viewCount || 0;
                this.logger.log(`Extracted view_count from ${source} statsV2: ${response.data.view_count}`, "info");
              }
              if (!response.data.share_count && videoData.statsV2.shareCount !== void 0) {
                response.data.share_count = videoData.statsV2.shareCount || 0;
                this.logger.log(`Extracted share_count from ${source} statsV2: ${response.data.share_count}`, "info");
              }
            }
            if (!response.data.duration && videoData.video?.duration) {
              const duration = typeof videoData.video.duration === "number" ? videoData.video.duration : parseInt(String(videoData.video.duration));
              if (!isNaN(duration) && duration > 0) {
                response.data.duration = duration;
                this.logger.log(`Extracted duration from ${source}: ${duration}s`, "info");
              }
            }
            if (!response.data.music_title && videoData.music?.title) {
              response.data.music_title = String(videoData.music.title);
              this.logger.log(`Extracted music_title from ${source}: ${response.data.music_title}`, "info");
            }
            if (!response.data.music_artist && videoData.music?.authorName) {
              response.data.music_artist = String(videoData.music.authorName);
              this.logger.log(`Extracted music_artist from ${source}: ${response.data.music_artist}`, "info");
            }
            if (!response.data.music_artist && videoData.music?.author) {
              response.data.music_artist = String(videoData.music.author);
              this.logger.log(`Extracted music_artist from ${source} (author): ${response.data.music_artist}`, "info");
            }
            if (!response.data.hashtags && videoData.desc) {
              const descText = String(videoData.desc);
              const hashtags = (descText.match(/#[\w\u4e00-\u9fff]+/g) || []).map((h) => h.substring(1));
              if (hashtags.length > 0) {
                const genericTags = ["fyp", "foryou", "foryoupage", "viral", "trending", "trend", "fyp\u30B7", "fypage", "fy"];
                const filtered = hashtags.filter((tag) => !genericTags.includes(tag.toLowerCase()));
                if (filtered.length > 0) {
                  response.data.hashtags = filtered;
                  this.logger.log(`Extracted hashtags from ${source}: ${filtered.join(", ")}`, "info");
                } else if (hashtags.length > 0) {
                  response.data.hashtags = hashtags;
                  this.logger.log(`Extracted hashtags from ${source} (all generic): ${hashtags.join(", ")}`, "debug");
                }
              }
            }
            if (!response.data.hashtags && videoData.textExtra && Array.isArray(videoData.textExtra)) {
              const hashtags = videoData.textExtra.filter((item) => item.hashtagName || item.hashtag).map((item) => item.hashtagName || item.hashtag).filter(Boolean);
              if (hashtags.length > 0) {
                response.data.hashtags = hashtags;
                this.logger.log(`Extracted hashtags from ${source} textExtra: ${hashtags.join(", ")}`, "info");
              }
            }
            if (!response.data.hashtags && videoData.challengeList && Array.isArray(videoData.challengeList)) {
              const hashtags = videoData.challengeList.map((c) => c.title || c.challengeName || c.name).filter(Boolean);
              if (hashtags.length > 0) {
                response.data.hashtags = hashtags;
                this.logger.log(`Extracted hashtags from ${source} challengeList: ${hashtags.join(", ")}`, "info");
              }
            }
            if (!response.data.music_id && videoData.music) {
              const musicId = videoData.music.id || videoData.music.musicId || videoData.musicId || videoData.music?.idStr;
              if (musicId) {
                response.data.music_id = String(musicId);
                this.logger.log(`Extracted music_id from ${source}: ${musicId}`, "info");
              }
            }
            if (!response.data.effect_ids && videoData.effectStickers) {
              this.logger.log(`${source} has effectStickers, type: ${typeof videoData.effectStickers}, isArray: ${Array.isArray(videoData.effectStickers)}`, "debug");
              let effects = [];
              if (Array.isArray(videoData.effectStickers)) {
                this.logger.log(`${source} effectStickers array length: ${videoData.effectStickers.length}`, "debug");
                effects = videoData.effectStickers.map((e) => {
                  if (typeof e === "string") return e;
                  if (typeof e === "number") return String(e);
                  return e?.ID || e?.id || e?.effectId || e?.effect_id || e?.stickerId || e?.sticker_id;
                }).filter(Boolean).map(String);
                this.logger.log(`${source} extracted effect IDs: ${effects.join(", ")}`, "debug");
              } else if (typeof videoData.effectStickers === "object" && videoData.effectStickers !== null) {
                const effectObj = videoData.effectStickers;
                if (effectObj.ID) effects.push(String(effectObj.ID));
                if (effectObj.id) effects.push(String(effectObj.id));
                if (effectObj.effectId) effects.push(String(effectObj.effectId));
              }
              if (effects.length > 0) {
                response.data.effect_ids = effects;
                this.logger.log(`Extracted effect_ids from ${source}: ${effects.join(", ")}`, "info");
              } else {
                this.logger.log(`${source} effectStickers exists but no IDs extracted`, "debug");
              }
            }
            if (!response.data.effect_ids && videoData.effectIds && Array.isArray(videoData.effectIds)) {
              response.data.effect_ids = videoData.effectIds.map(String);
              this.logger.log(`Extracted effect_ids from ${source} effectIds: ${response.data.effect_ids?.join(", ")}`, "info");
            }
            if (!response.data.effect_ids && videoData.stickersOnItem && Array.isArray(videoData.stickersOnItem)) {
              const effects = videoData.stickersOnItem.map((s) => s.stickerId || s.id || s.effectId).filter(Boolean).map(String);
              if (effects.length > 0) {
                response.data.effect_ids = effects;
                this.logger.log(`Extracted effect_ids from ${source} stickersOnItem: ${effects.join(", ")}`, "info");
              }
            }
            if (!response.data.playlist_id && videoData.playlistId) {
              response.data.playlist_id = String(videoData.playlistId);
              this.logger.log(`Extracted playlist_id from ${source}: ${response.data.playlist_id}`, "info");
            }
            if (!response.data.playlist_id && videoData.playlist_id) {
              response.data.playlist_id = String(videoData.playlist_id);
              this.logger.log(`Extracted playlist_id from ${source} (playlist_id): ${response.data.playlist_id}`, "info");
            }
            if (!response.data.playlist_id && videoData.music?.playlistId) {
              response.data.playlist_id = String(videoData.music.playlistId);
              this.logger.log(`Extracted playlist_id from ${source} (music.playlistId): ${response.data.playlist_id}`, "info");
            }
            if (!response.data.region_code && videoData.regionCode) {
              response.data.region_code = videoData.regionCode;
              this.logger.log(`Extracted region_code from ${source}: ${response.data.region_code}`, "info");
            }
            if (!response.data.region_code && videoData.region) {
              response.data.region_code = videoData.region;
              this.logger.log(`Extracted region_code from ${source} (region): ${response.data.region_code}`, "info");
            }
            if (!response.data.region_code && videoData.video?.region) {
              response.data.region_code = videoData.video.region;
              this.logger.log(`Extracted region_code from ${source} (video.region): ${response.data.region_code}`, "info");
            }
            if (!response.data.voice_to_text && videoData.transcription) {
              response.data.voice_to_text = videoData.transcription;
              this.logger.log(`Extracted voice_to_text from ${source} (${videoData.transcription.length} chars)`, "info");
            }
            if (!response.data.voice_to_text && videoData.voiceToText) {
              response.data.voice_to_text = videoData.voiceToText;
              this.logger.log(`Extracted voice_to_text from ${source} (${videoData.voiceToText.length} chars)`, "info");
            }
            if (!response.data.voice_to_text && videoData.subtitleInfos && Array.isArray(videoData.subtitleInfos)) {
              const subtitles = videoData.subtitleInfos.map((s) => s.content || s.text || s.subtitle).filter(Boolean).join(" ");
              if (subtitles) {
                response.data.voice_to_text = subtitles;
                this.logger.log(`Extracted voice_to_text from ${source} subtitleInfos (${subtitles.length} chars)`, "info");
              }
            }
            if (videoData.textExtra && Array.isArray(videoData.textExtra)) {
              const mentions = videoData.textExtra.filter((item) => item.userUniqueId || item.userId || item.userUniqueId || item.type === "user").map((item) => item.userUniqueId || item.userId || item.userName || item.nickname).filter(Boolean);
              if (mentions.length > 0 && !response.data.mentions) {
                response.data.mentions = mentions;
                this.logger.log(`Extracted mentions from ${source}: ${mentions.join(", ")}`, "info");
              }
            }
            if (videoData.video) {
              if (!response.data.is_video && videoData.video.duration !== void 0) {
                response.data.is_video = true;
                this.logger.log(`Extracted is_video from ${source}: true`, "info");
              }
              const thumbnails = [];
              if (videoData.video.cover) thumbnails.push(String(videoData.video.cover));
              if (videoData.video.dynamicCover) thumbnails.push(String(videoData.video.dynamicCover));
              if (videoData.video.originCover) thumbnails.push(String(videoData.video.originCover));
              if (thumbnails.length > 0 && !response.data.thumbnails) {
                response.data.thumbnails = thumbnails;
                this.logger.log(`Extracted ${thumbnails.length} thumbnail(s) from ${source}`, "info");
              }
              if (videoData.video.width && !response.data.dimension) {
                const width = typeof videoData.video.width === "number" ? videoData.video.width : parseInt(String(videoData.video.width));
                const height = videoData.video.height ? typeof videoData.video.height === "number" ? videoData.video.height : parseInt(String(videoData.video.height)) : null;
                if (!isNaN(width)) {
                  response.data.dimension = height && !isNaN(height) ? `${width}x${height}` : `${width}`;
                  this.logger.log(`Extracted dimension from ${source}: ${response.data.dimension}`, "info");
                }
              }
            }
            if (!response.data.caption && videoData.title) {
              response.data.caption = String(videoData.title);
              this.logger.log(`Extracted title as caption from ${source}`, "info");
            }
            if (videoData.collected !== void 0 && !response.data.save_count) {
              response.data.save_count = videoData.collected ? 1 : 0;
              this.logger.log(`Extracted save_count (collected) from ${source}: ${response.data.save_count}`, "info");
            }
            if (videoData.author) {
              if (videoData.author.openId && !response.data.creator_open_id) {
                response.data.creator_open_id = String(videoData.author.openId);
                this.logger.log(`Extracted creator_open_id from ${source}: ${response.data.creator_open_id}`, "info");
              }
              if (videoData.author.unionId && !response.data.creator_union_id) {
                response.data.creator_union_id = String(videoData.author.unionId);
                this.logger.log(`Extracted creator_union_id from ${source}: ${response.data.creator_union_id}`, "info");
              }
              if (videoData.author.avatarThumb && !response.data.creator_avatar_url_100) {
                response.data.creator_avatar_url_100 = String(videoData.author.avatarThumb);
                this.logger.log(`Extracted creator_avatar_url_100 from ${source}`, "info");
              }
              if (videoData.author.avatarMedium && !response.data.creator_avatar_large_url) {
                response.data.creator_avatar_large_url = String(videoData.author.avatarMedium);
                this.logger.log(`Extracted creator_avatar_large_url from ${source}`, "info");
              }
              if (videoData.author.avatarLarger && !response.data.creator_avatar_large_url) {
                response.data.creator_avatar_large_url = String(videoData.author.avatarLarger);
                this.logger.log(`Extracted creator_avatar_large_url from ${source} (avatarLarger)`, "info");
              }
              if (videoData.author.uniqueId && !response.data.creator_profile_deep_link) {
                response.data.creator_profile_deep_link = `https://www.tiktok.com/@${videoData.author.uniqueId}`;
                this.logger.log(`Extracted creator_profile_deep_link from ${source}: ${response.data.creator_profile_deep_link}`, "info");
              }
              if (videoData.authorStats) {
                if (videoData.authorStats.followingCount !== void 0 && !response.data.creator_following_count) {
                  response.data.creator_following_count = videoData.authorStats.followingCount;
                  this.logger.log(`Extracted creator_following_count from ${source}: ${response.data.creator_following_count}`, "info");
                }
                if (videoData.authorStats.heartCount !== void 0 && !response.data.creator_likes_count) {
                  response.data.creator_likes_count = videoData.authorStats.heartCount;
                  this.logger.log(`Extracted creator_likes_count from ${source}: ${response.data.creator_likes_count}`, "info");
                }
                if (videoData.authorStats.videoCount !== void 0 && !response.data.creator_video_count) {
                  response.data.creator_video_count = videoData.authorStats.videoCount;
                  this.logger.log(`Extracted creator_video_count from ${source}: ${response.data.creator_video_count}`, "info");
                }
              }
              if (videoData.authorStatsV2) {
                if (videoData.authorStatsV2.followingCount !== void 0 && !response.data.creator_following_count) {
                  response.data.creator_following_count = videoData.authorStatsV2.followingCount;
                  this.logger.log(`Extracted creator_following_count from ${source} (V2): ${response.data.creator_following_count}`, "info");
                }
                if (videoData.authorStatsV2.heartCount !== void 0 && !response.data.creator_likes_count) {
                  response.data.creator_likes_count = videoData.authorStatsV2.heartCount;
                  this.logger.log(`Extracted creator_likes_count from ${source} (V2): ${response.data.creator_likes_count}`, "info");
                }
                if (videoData.authorStatsV2.videoCount !== void 0 && !response.data.creator_video_count) {
                  response.data.creator_video_count = videoData.authorStatsV2.videoCount;
                  this.logger.log(`Extracted creator_video_count from ${source} (V2): ${response.data.creator_video_count}`, "info");
                }
              }
            }
            if (videoData.locationInfo || videoData.location) {
              const location = videoData.locationInfo || videoData.location;
              if (location && !response.data.location) {
                response.data.location = location.name || location.address || location.locationName || String(location);
                this.logger.log(`Extracted location from ${source}: ${response.data.location}`, "info");
              }
              if (location?.latitude && !response.data.location_latitude) {
                response.data.location_latitude = typeof location.latitude === "number" ? location.latitude : parseFloat(String(location.latitude));
                this.logger.log(`Extracted location_latitude from ${source}: ${response.data.location_latitude}`, "info");
              }
              if (location?.longitude && !response.data.location_longitude) {
                response.data.location_longitude = typeof location.longitude === "number" ? location.longitude : parseFloat(String(location.longitude));
                this.logger.log(`Extracted location_longitude from ${source}: ${response.data.location_longitude}`, "info");
              }
            }
          };
          if (apiResp.data?.itemList) {
            const items = apiResp.data.itemList;
            if (Array.isArray(items) && items.length > 0) {
              const video = items.find(
                (item) => item.itemInfo?.itemId === videoId || item.itemInfo?.itemStruct?.id === videoId || item.id === videoId || item.itemInfo?.itemStruct?.video?.id === videoId
              ) || items[0];
              if (video?.itemInfo?.itemStruct) {
                extractVideoData(video.itemInfo.itemStruct, "itemList.itemInfo.itemStruct");
              } else if (video?.itemStruct) {
                extractVideoData(video.itemStruct, "itemList.itemStruct");
              } else if (video) {
                extractVideoData(video, "itemList item");
              }
            }
          }
          if (apiResp.data?.itemList && Array.isArray(apiResp.data.itemList)) {
            for (const item of apiResp.data.itemList) {
              if (item && (item.id === videoId || item.itemInfo?.itemId === videoId)) {
                if (item.effectStickers || item.music || item.desc || item.playlistId) {
                  extractVideoData(item, "itemList direct");
                }
                if (item.itemInfo?.itemStruct) {
                  extractVideoData(item.itemInfo.itemStruct, "itemList.itemInfo.itemStruct");
                }
                break;
              }
            }
          }
          if (apiResp.data?.itemInfo?.itemStruct) {
            extractVideoData(apiResp.data.itemInfo.itemStruct, "itemInfo.itemStruct");
          }
          if (apiResp.data?.aweme_detail) {
            extractVideoData(apiResp.data.aweme_detail, "aweme_detail");
          }
          if (apiResp.data?.items && Array.isArray(apiResp.data.items)) {
            const video = apiResp.data.items.find((item) => item.id === videoId) || apiResp.data.items[0];
            if (video) {
              extractVideoData(video, "items array");
            }
          }
          if (apiResp.data?.item) {
            extractVideoData(apiResp.data.item, "item");
          }
          if (apiResp.data?.keywordsByItemId && videoId) {
            const keywords = apiResp.data.keywordsByItemId[videoId];
            if (keywords && Array.isArray(keywords) && keywords.length > 0 && response?.data && !response.data.hashtags) {
              response.data.hashtags = keywords.map((k) => typeof k === "string" ? k : k.keyword || k.name || k).filter(Boolean);
              this.logger.log(`Extracted hashtags from SEO keywords: ${response.data.hashtags.join(", ")}`, "debug");
            }
          }
        }
      }
      const windowData = await page.evaluate((vidId) => {
        const result = {};
        try {
          const win = window;
          if (win.__UNIVERSAL_DATA_FOR_REHYDRATION__) {
            result.hasUniversalData = true;
            try {
              const data = win.__UNIVERSAL_DATA_FOR_REHYDRATION__;
              const state = data.defaultScope || data;
              if (state && (state.ItemModule || state.itemModule)) {
                const itemModule = state.ItemModule || state.itemModule;
                const video = itemModule && itemModule[vidId] || itemModule && Object.values(itemModule)[0];
                if (video) {
                  result.foundVideoInUniversal = true;
                  result.videoKeys = Object.keys(video).slice(0, 30);
                  if (video.desc) {
                    const hashtags = (video.desc.match(/#\w+/g) || []).map((h) => h.substring(1));
                    if (hashtags.length > 0) {
                      result.hashtags = hashtags;
                    }
                  }
                  if (video.music && video.music.id) {
                    result.music_id = String(video.music.id);
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
          result.windowKeys = Object.keys(win).filter((k) => k.startsWith("__") || k.includes("DATA") || k.includes("STATE")).slice(0, 20);
        } catch (e) {
          result.error = String(e);
        }
        return result;
      }, videoId || "");
      if (windowData.foundVideoInUniversal) {
        this.logger.log(`Found video in __UNIVERSAL_DATA_FOR_REHYDRATION__`, "debug");
        if (windowData.videoKeys) {
          this.logger.log(`Video keys: ${windowData.videoKeys.join(", ")}`, "debug");
        }
        if (windowData.hashtags && response?.data) {
          response.data.hashtags = windowData.hashtags;
          this.logger.log(`Extracted hashtags from window: ${windowData.hashtags.join(", ")}`, "debug");
        }
        if (windowData.music_id && response?.data) {
          response.data.music_id = windowData.music_id;
          this.logger.log(`Extracted music_id from window: ${windowData.music_id}`, "debug");
        }
      }
      if (windowData.windowKeys && windowData.windowKeys.length > 0) {
        this.logger.log(`Window objects found: ${windowData.windowKeys.join(", ")}`, "debug");
      }
      if (response && response.debug) {
        this.logger.log(`SIGI_STATE debug - Found SIGI: ${response.debug.foundSIGI}, Found Video: ${response.debug.foundVideo}`, "debug");
        this.logger.log(`Script count: ${response.debug.scriptCount || 0}`, "debug");
        if (response.debug.scriptIds && response.debug.scriptIds.length > 0) {
          this.logger.log(`Script IDs found: ${response.debug.scriptIds.join(", ")}`, "debug");
        }
        if (response.debug.searchText) {
          this.logger.log(response.debug.searchText, "debug");
        }
        if (response.debug.sigiTopLevelKeys && response.debug.sigiTopLevelKeys.length > 0) {
          this.logger.log(`SIGI top-level keys: ${response.debug.sigiTopLevelKeys.join(", ")}`, "debug");
        }
        if (response.debug.itemModuleKeys && response.debug.itemModuleKeys.length > 0) {
          this.logger.log(`ItemModule keys (first 10): ${response.debug.itemModuleKeys.join(", ")}`, "debug");
        }
        if (response.debug.videoKeys && response.debug.videoKeys.length > 0) {
          this.logger.log(`Video object keys (first 50): ${response.debug.videoKeys.join(", ")}`, "debug");
        }
        if (response.debug.descElementFound !== void 0) {
          this.logger.log(`Description element found: ${response.debug.descElementFound}`, "debug");
        }
        if (response.debug.foundHashtagsInDOM) {
          this.logger.log(`Found hashtags in DOM: ${response.debug.descText}`, "debug");
        }
      }
      if (response?.data) {
        const extractedKeys = Object.keys(response.data);
        this.logger.log(`Final extracted data keys: ${extractedKeys.join(", ")}`, "debug");
        if (response.data.effect_ids) {
          this.logger.log(`Effect IDs in response.data: ${Array.isArray(response.data.effect_ids) ? response.data.effect_ids.join(", ") : response.data.effect_ids}`, "info");
        }
        if (response.data.hashtags) {
          this.logger.log(`Hashtags in response.data: ${Array.isArray(response.data.hashtags) ? response.data.hashtags.join(", ") : response.data.hashtags}`, "info");
        }
      }
      return response?.data || null;
    } catch (error) {
      this.logger.log(`Failed to extract embedded TikTok data: ${error}`, "debug");
      return null;
    }
  }
  async extractTikTokDOMData(page) {
    try {
      const evalCode = `
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
      const data = await page.evaluate(evalCode + "()");
      if (data) {
        if (data.debug) {
          data.debug.forEach((log) => this.logger.log(`[DOM Debug] ${log}`, "debug"));
          delete data.debug;
        }
        if (Object.keys(data).length === 0) {
          return null;
        }
        return data;
      }
      return null;
    } catch (error) {
      this.logger.log(`Failed to extract DOM TikTok data: ${error}`, "debug");
      return null;
    }
  }
};

// src/scrapers/TwitterScraper.ts
var TwitterScraper = class extends CreatorMetadataScraper {
  async getCreatorProfileUrl(videoUrl) {
    try {
      const match = videoUrl.match(/(?:twitter\.com|x\.com)\/([^\/]+)/);
      if (match) {
        const domain = videoUrl.includes("x.com") ? "x.com" : "twitter.com";
        return `https://${domain}/${match[1]}`;
      }
      return null;
    } catch {
      return null;
    }
  }
  async extractMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting Twitter/X creator metadata...", "info");
      const profileUrl = await this.getCreatorProfileUrl(videoUrl);
      if (!profileUrl) {
        this.logger.log("Could not determine Twitter profile URL", "warn");
        return null;
      }
      await page.goto(profileUrl, { waitUntil: "domcontentloaded" });
      await this.delay(3e3);
      const metadata = {
        platform: "twitter",
        url: profileUrl,
        extractedAt: Date.now()
      };
      const usernameMatch = profileUrl.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
      if (usernameMatch) {
        metadata.creator_username = usernameMatch[1];
      }
      const nameSelectors = [
        '[data-testid="UserName"]',
        'h1[data-testid="UserName"]',
        '[data-testid="User-Names"] span',
        "h1"
      ];
      for (const selector of nameSelectors) {
        const name = await this.getElementText(page, selector);
        if (name && !name.startsWith("@")) {
          metadata.creator_name = this.cleanText(name);
          break;
        }
      }
      const bioSelectors = [
        '[data-testid="UserDescription"]',
        '[data-testid="UserBio"]',
        ".user-description"
      ];
      for (const selector of bioSelectors) {
        const bio = await this.getElementText(page, selector);
        if (bio && bio.length > 5) {
          metadata.creator_bio = this.cleanText(bio);
          break;
        }
      }
      const followerSelectors = [
        '[data-testid="followers"]',
        'a[href*="/followers"]',
        '[href*="/followers"] span'
      ];
      for (const selector of followerSelectors) {
        const followerText = await this.getElementText(page, selector);
        if (followerText) {
          metadata.creator_follower_count = this.parseCount(followerText);
          break;
        }
      }
      const avatarSelectors = [
        '[data-testid="UserAvatar-Container-"] img',
        'img[alt*="Avatar"]',
        '[data-testid="primaryColumn"] img[src*="pbs.twimg.com"]'
      ];
      for (const selector of avatarSelectors) {
        const avatar = await this.getElementAttribute(page, selector, "src");
        if (avatar && avatar.includes("pbs.twimg.com")) {
          metadata.creator_avatar_url = avatar;
          break;
        }
      }
      const verifiedSelectors = [
        '[data-testid="icon-verified"]',
        '[aria-label*="Verified account"]',
        'svg[data-testid="icon-verified"]'
      ];
      for (const selector of verifiedSelectors) {
        const verified = await page.locator(selector).first();
        if (await verified.isVisible({ timeout: 2e3 }).catch(() => false)) {
          metadata.creator_verified = true;
          break;
        }
      }
      const followingSelectors = [
        '[data-testid="following"]',
        'a[href*="/following"]',
        '[href*="/following"] span'
      ];
      for (const selector of followingSelectors) {
        const followingText = await this.getElementText(page, selector);
        if (followingText) {
          metadata.creator_following_count = this.parseCount(followingText);
          break;
        }
      }
      const tweetCountSelectors = [
        '[data-testid="tweetCount"]',
        'a[href*="/statuses"]',
        '[href*="/statuses"] span'
      ];
      for (const selector of tweetCountSelectors) {
        const tweetCountText = await this.getElementText(page, selector);
        if (tweetCountText) {
          metadata.creator_tweet_count = this.parseCount(tweetCountText);
          break;
        }
      }
      const locationSelectors = [
        '[data-testid="UserLocation"]',
        '[data-testid="UserProfileHeader_Items"] span',
        ".user-location"
      ];
      for (const selector of locationSelectors) {
        const location = await this.getElementText(page, selector);
        if (location && location.length > 2 && !location.includes("\xB7")) {
          metadata.creator_location = this.cleanText(location);
          break;
        }
      }
      const joinedDateSelectors = [
        '[data-testid="UserJoinDate"]',
        '[data-testid="UserProfileHeader_Items"] time'
      ];
      for (const selector of joinedDateSelectors) {
        const dateElement = await page.locator(selector).first();
        if (await dateElement.isVisible({ timeout: 2e3 }).catch(() => false)) {
          const dateText = await dateElement.getAttribute("datetime") || await dateElement.textContent();
          if (dateText) {
            const date = new Date(dateText);
            if (!isNaN(date.getTime())) {
              metadata.creator_created_at = Math.floor(date.getTime() / 1e3);
              break;
            }
          }
        }
      }
      this.logger.log("Successfully extracted Twitter/X creator metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract Twitter metadata: ${error}`, "error");
      return null;
    }
  }
  async extractVideoMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting Twitter/X video metadata...", "info");
      const apiResponses = [];
      const responseHandler = async (response) => {
        try {
          const url = response.url();
          if (url.includes("api.x.com/graphql") || url.includes("api.twitter.com/graphql") || url.includes("/graphql/")) {
            try {
              const json = await response.json().catch(() => null);
              if (json) {
                this.logger.log(`Captured GraphQL response: ${url.substring(0, 100)}...`, "debug");
                apiResponses.push(json);
              }
            } catch (e) {
            }
          }
        } catch (e) {
        }
      };
      page.on("response", responseHandler);
      await page.goto(videoUrl, { waitUntil: "domcontentloaded", timeout: 6e4 });
      try {
        await page.waitForResponse((response) => {
          const url = response.url();
          return url.includes("api.x.com/graphql") && (url.includes("TweetResultByRestId") || url.includes("TweetDetail"));
        }, { timeout: 15e3 });
      } catch (e) {
        this.logger.log("GraphQL response may not have loaded, continuing anyway", "debug");
      }
      await this.delay(5e3);
      const metadata = {
        platform: "twitter",
        url: videoUrl,
        extractedAt: Date.now()
      };
      const tweetIdMatch = videoUrl.match(/(?:twitter\.com|x\.com)\/[^\/]+\/status\/(\d+)/);
      if (tweetIdMatch) {
        metadata.video_id = tweetIdMatch[1];
      }
      await this.delay(3e3);
      this.logger.log(`Captured ${apiResponses.length} GraphQL API responses`, "debug");
      for (const apiResponse of apiResponses) {
        try {
          const extracted = this.extractFromGraphQLResponse(apiResponse, tweetIdMatch?.[1]);
          if (extracted && Object.keys(extracted).length > 0) {
            const extractedKeys = Object.keys(extracted);
            this.logger.log(`Extracted ${extractedKeys.length} fields from GraphQL: ${extractedKeys.join(", ")}`, "debug");
            Object.assign(metadata, extracted);
          }
        } catch (e) {
          this.logger.log(`Error extracting from GraphQL response: ${e}`, "debug");
        }
      }
      const embeddedData = await this.extractFromEmbeddedJSON(page);
      if (embeddedData) {
        if (embeddedData.like_count !== void 0) metadata.like_count = embeddedData.like_count;
        if (embeddedData.comment_count !== void 0) metadata.comment_count = embeddedData.comment_count;
        if (embeddedData.view_count !== void 0) metadata.view_count = embeddedData.view_count;
        if (embeddedData.share_count !== void 0) metadata.share_count = embeddedData.share_count;
        if (embeddedData.timestamp !== void 0) metadata.timestamp = embeddedData.timestamp;
        if (embeddedData.caption) metadata.caption = embeddedData.caption;
        if (embeddedData.hashtags) metadata.hashtags = embeddedData.hashtags;
        if (embeddedData.mentions) metadata.mentions = embeddedData.mentions;
        if (embeddedData.is_video !== void 0) metadata.is_video = embeddedData.is_video;
        if (embeddedData.context_annotations) metadata.context_annotations = embeddedData.context_annotations;
        if (embeddedData.conversation_id) metadata.conversation_id = embeddedData.conversation_id;
        if (embeddedData.edit_controls) metadata.edit_controls = embeddedData.edit_controls;
        if (embeddedData.edit_history_tweet_ids) metadata.edit_history_tweet_ids = embeddedData.edit_history_tweet_ids;
        if (embeddedData.entities_hashtags) metadata.entities_hashtags = embeddedData.entities_hashtags;
        if (embeddedData.entities_mentions) metadata.entities_mentions = embeddedData.entities_mentions;
        if (embeddedData.entities_urls) metadata.entities_urls = embeddedData.entities_urls;
        if (embeddedData.entities_cashtags) metadata.entities_cashtags = embeddedData.entities_cashtags;
        if (embeddedData.geo) metadata.geo = embeddedData.geo;
        if (embeddedData.in_reply_to_user_id) metadata.in_reply_to_user_id = embeddedData.in_reply_to_user_id;
        if (embeddedData.reply_settings) metadata.reply_settings = embeddedData.reply_settings;
        if (embeddedData.source) metadata.source = embeddedData.source;
        if (embeddedData.withheld) metadata.withheld = embeddedData.withheld;
        if (embeddedData.reply_count !== void 0) metadata.reply_count = embeddedData.reply_count;
        if (embeddedData.quote_count !== void 0) metadata.quote_count = embeddedData.quote_count;
        if (embeddedData.bookmark_count !== void 0) metadata.bookmark_count = embeddedData.bookmark_count;
        if (embeddedData.impression_count !== void 0) metadata.impression_count = embeddedData.impression_count;
        if (embeddedData.media_key) metadata.media_key = embeddedData.media_key;
        if (embeddedData.tweet_language) metadata.tweet_language = embeddedData.tweet_language;
        if (embeddedData.possibly_sensitive !== void 0) metadata.possibly_sensitive = embeddedData.possibly_sensitive;
        if (embeddedData.creator_created_at !== void 0) metadata.creator_created_at = embeddedData.creator_created_at;
        if (embeddedData.creator_description) metadata.creator_description = embeddedData.creator_description;
        if (embeddedData.creator_location) metadata.creator_location = embeddedData.creator_location;
        if (embeddedData.creator_profile_image_url) metadata.creator_profile_image_url = embeddedData.creator_profile_image_url;
        if (embeddedData.creator_protected !== void 0) metadata.creator_protected = embeddedData.creator_protected;
        if (embeddedData.creator_following_count !== void 0) metadata.creator_following_count = embeddedData.creator_following_count;
        if (embeddedData.creator_tweet_count !== void 0) metadata.creator_tweet_count = embeddedData.creator_tweet_count;
        if (embeddedData.creator_listed_count !== void 0) metadata.creator_listed_count = embeddedData.creator_listed_count;
        if (embeddedData.creator_verified !== void 0) metadata.creator_verified = embeddedData.creator_verified;
        if (embeddedData.creator_verified_type) metadata.creator_verified_type = embeddedData.creator_verified_type;
        if (embeddedData.place_full_name) metadata.place_full_name = embeddedData.place_full_name;
        if (embeddedData.place_country) metadata.place_country = embeddedData.place_country;
        if (embeddedData.place_geo) metadata.place_geo = embeddedData.place_geo;
      }
      const domData = await this.extractFromDOM(page);
      if (domData) {
        if (domData.like_count !== void 0 && !metadata.like_count) metadata.like_count = domData.like_count;
        if (domData.comment_count !== void 0 && !metadata.comment_count) metadata.comment_count = domData.comment_count;
        if (domData.view_count !== void 0 && !metadata.view_count) metadata.view_count = domData.view_count;
        if (domData.share_count !== void 0 && !metadata.share_count) metadata.share_count = domData.share_count;
        if (domData.caption && !metadata.caption) metadata.caption = domData.caption;
        if (domData.hashtags && !metadata.hashtags) metadata.hashtags = domData.hashtags;
        if (domData.mentions && !metadata.mentions) metadata.mentions = domData.mentions;
        if (domData.reply_count !== void 0 && !metadata.reply_count) metadata.reply_count = domData.reply_count;
        if (domData.quote_count !== void 0 && !metadata.quote_count) metadata.quote_count = domData.quote_count;
        if (domData.bookmark_count !== void 0 && !metadata.bookmark_count) metadata.bookmark_count = domData.bookmark_count;
        if (domData.impression_count !== void 0 && !metadata.impression_count) metadata.impression_count = domData.impression_count;
        if (domData.conversation_id && !metadata.conversation_id) metadata.conversation_id = domData.conversation_id;
        if (domData.in_reply_to_user_id && !metadata.in_reply_to_user_id) metadata.in_reply_to_user_id = domData.in_reply_to_user_id;
        if (domData.source && !metadata.source) metadata.source = domData.source;
        if (domData.tweet_language && !metadata.tweet_language) metadata.tweet_language = domData.tweet_language;
        if (domData.possibly_sensitive !== void 0 && metadata.possibly_sensitive === void 0) metadata.possibly_sensitive = domData.possibly_sensitive;
      }
      page.off("response", responseHandler);
      this.logger.log("Successfully extracted Twitter/X video metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract Twitter video metadata: ${error}`, "error");
      return null;
    }
  }
  extractFromGraphQLResponse(response, tweetId) {
    try {
      let extractTweetData2 = function(obj, path4 = "") {
        if (!obj || typeof obj !== "object") return;
        if (Array.isArray(obj)) {
          for (const item of obj) {
            extractTweetData2(item, path4);
          }
          return;
        }
        for (const key in obj) {
          const value = obj[key];
          if (key === "legacy" && value && typeof value === "object") {
            if (value.conversation_id_str && !result.conversation_id) {
              result.conversation_id = value.conversation_id_str;
            }
            if (value.in_reply_to_user_id_str && !result.in_reply_to_user_id) {
              result.in_reply_to_user_id = value.in_reply_to_user_id_str;
            }
            if (value.source && !result.source) {
              result.source = value.source;
            }
            if (value.lang && !result.tweet_language) {
              result.tweet_language = value.lang;
            }
            if (value.possibly_sensitive !== void 0 && result.possibly_sensitive === void 0) {
              result.possibly_sensitive = Boolean(value.possibly_sensitive);
            }
            if (value.reply_settings && !result.reply_settings) {
              result.reply_settings = value.reply_settings;
            }
            if (value.entities && value.entities.hashtags && Array.isArray(value.entities.hashtags) && !result.entities_hashtags) {
              result.entities_hashtags = value.entities.hashtags;
            }
            if (value.entities && value.entities.user_mentions && Array.isArray(value.entities.user_mentions) && !result.entities_mentions) {
              result.entities_mentions = value.entities.user_mentions;
            }
            if (value.entities && value.entities.urls && Array.isArray(value.entities.urls) && !result.entities_urls) {
              result.entities_urls = value.entities.urls;
            }
            if (value.entities && value.entities.symbols && Array.isArray(value.entities.symbols) && !result.entities_cashtags) {
              result.entities_cashtags = value.entities.symbols;
            }
            if (value.geo && !result.geo) {
              result.geo = value.geo;
            }
            if (value.edit_control && !result.edit_controls) {
              result.edit_controls = {
                edits_remaining: value.edit_control.edits_remaining,
                is_edit_eligible: value.edit_control.is_edit_eligible,
                editable_until: value.edit_control.editable_until
              };
            }
            if (value.edit_control && value.edit_control.edit_tweet_ids && Array.isArray(value.edit_control.edit_tweet_ids) && !result.edit_history_tweet_ids) {
              result.edit_history_tweet_ids = value.edit_control.edit_tweet_ids;
            }
            if (value.context_annotations && Array.isArray(value.context_annotations) && !result.context_annotations) {
              result.context_annotations = value.context_annotations;
            }
            if (value.withheld && !result.withheld) {
              result.withheld = value.withheld;
            }
            if (value.public_metrics && typeof value.public_metrics === "object") {
              if (value.public_metrics.reply_count !== void 0 && result.reply_count === void 0) {
                result.reply_count = Number(value.public_metrics.reply_count) || 0;
              }
              if (value.public_metrics.quote_count !== void 0 && result.quote_count === void 0) {
                result.quote_count = Number(value.public_metrics.quote_count) || 0;
              }
              if (value.public_metrics.bookmark_count !== void 0 && result.bookmark_count === void 0) {
                result.bookmark_count = Number(value.public_metrics.bookmark_count) || 0;
              }
              if (value.public_metrics.impression_count !== void 0 && result.impression_count === void 0) {
                result.impression_count = Number(value.public_metrics.impression_count) || 0;
              }
            }
          } else if (key === "public_metrics" && value && typeof value === "object") {
            if (value.reply_count !== void 0 && result.reply_count === void 0) {
              result.reply_count = Number(value.reply_count) || 0;
            }
            if (value.quote_count !== void 0 && result.quote_count === void 0) {
              result.quote_count = Number(value.quote_count) || 0;
            }
            if (value.bookmark_count !== void 0 && result.bookmark_count === void 0) {
              result.bookmark_count = Number(value.bookmark_count) || 0;
            }
            if (value.impression_count !== void 0 && result.impression_count === void 0) {
              result.impression_count = Number(value.impression_count) || 0;
            }
          } else if (key === "media_key" && value && !result.media_key) {
            result.media_key = String(value);
          } else if (key === "media" && Array.isArray(value)) {
            for (const mediaItem of value) {
              if (mediaItem.media_key && !result.media_key) {
                result.media_key = String(mediaItem.media_key);
              }
            }
          } else if (key === "user" && value && typeof value === "object") {
            if (value.legacy) {
              const userLegacy = value.legacy;
              if (userLegacy.created_at && !result.creator_created_at) {
                const date = new Date(userLegacy.created_at);
                if (!isNaN(date.getTime())) {
                  result.creator_created_at = Math.floor(date.getTime() / 1e3);
                }
              }
              if (userLegacy.description && !result.creator_description) {
                result.creator_description = userLegacy.description;
              }
              if (userLegacy.location && !result.creator_location) {
                result.creator_location = userLegacy.location;
              }
              if (userLegacy.profile_image_url_https && !result.creator_profile_image_url) {
                result.creator_profile_image_url = userLegacy.profile_image_url_https;
              }
              if (userLegacy.protected !== void 0 && result.creator_protected === void 0) {
                result.creator_protected = Boolean(userLegacy.protected);
              }
              if (userLegacy.friends_count !== void 0 && result.creator_following_count === void 0) {
                result.creator_following_count = Number(userLegacy.friends_count) || 0;
              }
              if (userLegacy.statuses_count !== void 0 && result.creator_tweet_count === void 0) {
                result.creator_tweet_count = Number(userLegacy.statuses_count) || 0;
              }
              if (userLegacy.listed_count !== void 0 && result.creator_listed_count === void 0) {
                result.creator_listed_count = Number(userLegacy.listed_count) || 0;
              }
            }
            if (value.verified !== void 0 && result.creator_verified === void 0) {
              result.creator_verified = Boolean(value.verified);
            }
            if (value.verified_type && !result.creator_verified_type) {
              result.creator_verified_type = String(value.verified_type);
            }
            if (value.is_blue_verified !== void 0 && result.creator_verified === void 0) {
              result.creator_verified = Boolean(value.is_blue_verified);
            }
            if (value.affiliates_highlighted_label && !result.creator_verified_type) {
              result.creator_verified_type = String(value.affiliates_highlighted_label.label?.userLabelType || "");
            }
          } else if (key === "place" && value && typeof value === "object") {
            if (value.full_name && !result.place_full_name) {
              result.place_full_name = value.full_name;
            }
            if (value.country && !result.place_country) {
              result.place_country = value.country;
            }
            if (value.geo && !result.place_geo) {
              result.place_geo = value.geo;
            }
          } else if (key === "edit_control" && value && typeof value === "object" && !result.edit_controls) {
            result.edit_controls = {
              edits_remaining: value.edits_remaining,
              is_edit_eligible: value.is_edit_eligible,
              editable_until: value.editable_until
            };
            if (value.edit_tweet_ids && Array.isArray(value.edit_tweet_ids) && !result.edit_history_tweet_ids) {
              result.edit_history_tweet_ids = value.edit_tweet_ids;
            }
          } else if (key === "context_annotations" && Array.isArray(value) && !result.context_annotations) {
            result.context_annotations = value;
          } else if (key === "withheld" && value && !result.withheld) {
            result.withheld = value;
          }
          if (typeof value === "object" && value !== null) {
            extractTweetData2(value, path4 ? `${path4}.${key}` : key);
          }
        }
      };
      var extractTweetData = extractTweetData2;
      const result = {};
      if (response.data) {
        extractTweetData2(response.data);
        if (response.data.tweetResult) {
          if (response.data.tweetResult.result) {
            extractTweetData2(response.data.tweetResult.result);
            if (response.data.tweetResult.result.legacy) {
              extractTweetData2(response.data.tweetResult.result.legacy);
            }
            if (response.data.tweetResult.result.core) {
              extractTweetData2(response.data.tweetResult.result.core);
            }
            if (response.data.tweetResult.result.user_results) {
              extractTweetData2(response.data.tweetResult.result.user_results);
              if (response.data.tweetResult.result.user_results.result) {
                extractTweetData2(response.data.tweetResult.result.user_results.result);
              }
            }
          }
          if (response.data.tweetResult.result?.quoted_status_result) {
            extractTweetData2(response.data.tweetResult.result.quoted_status_result);
          }
        }
        if (response.data.user) {
          extractTweetData2(response.data.user);
        }
        if (response.data.user_result && response.data.user_result.result) {
          extractTweetData2(response.data.user_result.result);
          if (response.data.user_result.result.legacy) {
            extractTweetData2(response.data.user_result.result.legacy);
          }
        }
      }
      if (response.result) {
        extractTweetData2(response.result);
        if (response.result.legacy) {
          extractTweetData2(response.result.legacy);
        }
      }
      if (response.instructions && Array.isArray(response.instructions)) {
        for (const instruction of response.instructions) {
          if (instruction.entries && Array.isArray(instruction.entries)) {
            for (const entry of instruction.entries) {
              if (entry.content && entry.content.itemContent && entry.content.itemContent.tweet_results) {
                const tweetResult = entry.content.itemContent.tweet_results.result;
                if (tweetResult) {
                  extractTweetData2(tweetResult);
                  if (tweetResult.legacy) {
                    extractTweetData2(tweetResult.legacy);
                  }
                }
              }
            }
          }
        }
      }
      extractTweetData2(response);
      return Object.keys(result).length > 0 ? result : null;
    } catch (error) {
      return null;
    }
  }
  async extractFromEmbeddedJSON(page) {
    try {
      const data = await page.evaluate(() => {
        const result = {};
        function extractTweetData(obj, path4 = "") {
          if (!obj || typeof obj !== "object") return;
          if (Array.isArray(obj)) {
            for (const item of obj) {
              extractTweetData(item, path4);
            }
            return;
          }
          for (const key in obj) {
            const value = obj[key];
            const currentPath = path4 ? `${path4}.${key}` : key;
            if (key === "conversation_id" || key === "conversationId") {
              if (value && !result.conversation_id) {
                result.conversation_id = String(value);
              }
            } else if (key === "edit_controls" || key === "editControls") {
              if (value && typeof value === "object" && !result.edit_controls) {
                result.edit_controls = {
                  edits_remaining: value.edits_remaining || value.editsRemaining,
                  is_edit_eligible: value.is_edit_eligible || value.isEditEligible,
                  editable_until: value.editable_until || value.editableUntil
                };
              }
            } else if (key === "edit_history_tweet_ids" || key === "editHistoryTweetIds") {
              if (Array.isArray(value) && !result.edit_history_tweet_ids) {
                result.edit_history_tweet_ids = value.map((id) => String(id));
              }
            } else if (key === "entities" && value && typeof value === "object") {
              if (value.hashtags && Array.isArray(value.hashtags) && !result.entities_hashtags) {
                result.entities_hashtags = value.hashtags;
              }
              if (value.user_mentions && Array.isArray(value.user_mentions) && !result.entities_mentions) {
                result.entities_mentions = value.user_mentions;
              } else if (value.mentions && Array.isArray(value.mentions) && !result.entities_mentions) {
                result.entities_mentions = value.mentions;
              }
              if (value.urls && Array.isArray(value.urls) && !result.entities_urls) {
                result.entities_urls = value.urls;
              }
              if (value.symbols && Array.isArray(value.symbols) && !result.entities_cashtags) {
                result.entities_cashtags = value.symbols;
              }
            } else if (key === "context_annotations" || key === "contextAnnotations") {
              if (Array.isArray(value) && !result.context_annotations) {
                result.context_annotations = value;
              }
            } else if (key === "geo" && value && typeof value === "object") {
              if (!result.geo) {
                result.geo = {
                  place_id: value.place_id || value.placeId,
                  coordinates: value.coordinates
                };
              }
            } else if (key === "in_reply_to_user_id" || key === "inReplyToUserId") {
              if (value && !result.in_reply_to_user_id) {
                result.in_reply_to_user_id = String(value);
              }
            } else if (key === "reply_settings" || key === "replySettings") {
              if (value && !result.reply_settings) {
                result.reply_settings = String(value);
              }
            } else if (key === "source") {
              if (value && !result.source) {
                result.source = String(value);
              }
            } else if (key === "withheld" && value && typeof value === "object") {
              if (!result.withheld) {
                result.withheld = {
                  copyright: value.copyright,
                  country_codes: value.country_codes || value.countryCodes,
                  scope: value.scope
                };
              }
            } else if (key === "public_metrics" || key === "publicMetrics") {
              if (value && typeof value === "object") {
                if (value.reply_count !== void 0 && result.reply_count === void 0) {
                  result.reply_count = Number(value.reply_count || value.replyCount) || 0;
                }
                if (value.quote_count !== void 0 && result.quote_count === void 0) {
                  result.quote_count = Number(value.quote_count || value.quoteCount) || 0;
                }
                if (value.bookmark_count !== void 0 && result.bookmark_count === void 0) {
                  result.bookmark_count = Number(value.bookmark_count || value.bookmarkCount) || 0;
                }
                if (value.impression_count !== void 0 && result.impression_count === void 0) {
                  result.impression_count = Number(value.impression_count || value.impressionCount) || 0;
                }
              }
            } else if (key === "lang" || key === "language") {
              if (value && !result.tweet_language) {
                result.tweet_language = String(value);
              }
            } else if (key === "possibly_sensitive" || key === "possiblySensitive") {
              if (value !== void 0 && result.possibly_sensitive === void 0) {
                result.possibly_sensitive = Boolean(value);
              }
            } else if (key === "media_key" || key === "mediaKey") {
              if (value && !result.media_key) {
                result.media_key = String(value);
              }
            }
            if (typeof value === "object" && value !== null) {
              extractTweetData(value, currentPath);
            }
          }
        }
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
          try {
            const json = JSON.parse(script.textContent || "{}");
            if (json["@type"] === "SocialMediaPosting" || json["@type"] === "Article") {
              if (json.interactionStatistic) {
                for (const stat of json.interactionStatistic) {
                  if (stat["@type"] === "LikeAction") {
                    result.like_count = parseInt(stat.userInteractionCount) || result.like_count;
                  } else if (stat["@type"] === "CommentAction") {
                    result.comment_count = parseInt(stat.userInteractionCount) || result.comment_count;
                  } else if (stat["@type"] === "ShareAction") {
                    result.share_count = parseInt(stat.userInteractionCount) || result.share_count;
                  }
                }
              }
              if (json.datePublished) {
                const date = new Date(json.datePublished);
                result.timestamp = Math.floor(date.getTime() / 1e3);
              }
              if (json.text || json.headline) {
                result.caption = json.text || json.headline;
              }
            }
            extractTweetData(json);
          } catch (e) {
            continue;
          }
        }
        const allScripts = document.querySelectorAll("script:not([src])");
        for (const script of allScripts) {
          const text = script.textContent || "";
          if (text.length < 100 || text.length > 5e5) continue;
          const searchTerms = [
            "conversation_id",
            "edit_controls",
            "context_annotations",
            "entities",
            "public_metrics",
            "reply_count",
            "quote_count",
            "bookmark_count",
            "impression_count"
          ];
          const hasRelevantData = searchTerms.some((term) => text.includes(term));
          if (!hasRelevantData) continue;
          try {
            const jsonMatches = text.match(/\{[\s\S]{100,500000}\}/g);
            if (jsonMatches) {
              for (const match of jsonMatches) {
                try {
                  const json = JSON.parse(match);
                  extractTweetData(json);
                } catch (e) {
                  continue;
                }
              }
            }
          } catch (e) {
            continue;
          }
        }
        try {
          const win = window;
          try {
            if ("__INITIAL_STATE__" in win) {
              const descriptor = Object.getOwnPropertyDescriptor(win, "__INITIAL_STATE__");
              if (descriptor && descriptor.value) {
                extractTweetData(descriptor.value);
              } else {
                try {
                  const value = win.__INITIAL_STATE__;
                  if (value) extractTweetData(value);
                } catch (e) {
                }
              }
            }
          } catch (e) {
          }
          try {
            if ("__NEXT_DATA__" in win) {
              const descriptor = Object.getOwnPropertyDescriptor(win, "__NEXT_DATA__");
              if (descriptor && descriptor.value) {
                extractTweetData(descriptor.value);
              } else {
                try {
                  const value = win.__NEXT_DATA__;
                  if (value) extractTweetData(value);
                } catch (e) {
                }
              }
            }
          } catch (e) {
          }
        } catch (e) {
        }
        const metaTags = document.querySelectorAll("meta[property], meta[name]");
        for (const meta of metaTags) {
          const property = meta.getAttribute("property") || meta.getAttribute("name") || "";
          const content = meta.getAttribute("content") || "";
          if (property.includes("twitter:description") && !result.caption) {
            result.caption = content;
          }
          if (property.includes("twitter:lang") && !result.tweet_language) {
            result.tweet_language = content;
          }
        }
        return result;
      });
      if (data.caption) {
        const hashtags = (data.caption.match(/#\w+/g) || []).map((h) => h.substring(1));
        if (hashtags.length > 0) {
          data.hashtags = hashtags;
        }
        const mentions = (data.caption.match(/@\w+/g) || []).map((m) => m.substring(1));
        if (mentions.length > 0) {
          data.mentions = mentions;
        }
      }
      return data;
    } catch (error) {
      this.logger.log(`Failed to extract from embedded JSON: ${error}`, "debug");
      return null;
    }
  }
  async extractFromDOM(page) {
    try {
      const data = await page.evaluate(() => {
        const result = {};
        const article = document.querySelector('article[data-testid="tweet"]');
        if (!article) {
          return result;
        }
        const likeButtons = article.querySelectorAll('[data-testid="like"], [aria-label*="like" i]');
        for (const el of likeButtons) {
          const ariaLabel = el.getAttribute("aria-label") || "";
          const match = ariaLabel.match(/([\d.,]+[KMB]?)\s*likes?/i);
          if (match) {
            const count = match[1].replace(/,/g, "");
            let num = parseFloat(count);
            if (count.includes("K") || count.includes("k")) num *= 1e3;
            else if (count.includes("M") || count.includes("m")) num *= 1e6;
            else if (count.includes("B") || count.includes("b")) num *= 1e9;
            result.like_count = Math.floor(num);
            break;
          }
        }
        const replyButtons = article.querySelectorAll('[data-testid="reply"], [aria-label*="reply" i], [aria-label*="comment" i]');
        for (const el of replyButtons) {
          const ariaLabel = el.getAttribute("aria-label") || "";
          const replyMatch = ariaLabel.match(/([\d.,]+[KMB]?)\s*replies?/i);
          if (replyMatch) {
            const count = replyMatch[1].replace(/,/g, "");
            let num = parseFloat(count);
            if (count.includes("K") || count.includes("k")) num *= 1e3;
            else if (count.includes("M") || count.includes("m")) num *= 1e6;
            else if (count.includes("B") || count.includes("b")) num *= 1e9;
            result.reply_count = Math.floor(num);
          }
          const commentMatch = ariaLabel.match(/([\d.,]+[KMB]?)\s*comments?/i);
          if (commentMatch) {
            const count = commentMatch[1].replace(/,/g, "");
            let num = parseFloat(count);
            if (count.includes("K") || count.includes("k")) num *= 1e3;
            else if (count.includes("M") || count.includes("m")) num *= 1e6;
            else if (count.includes("B") || count.includes("b")) num *= 1e9;
            result.comment_count = Math.floor(num);
          }
          if (result.reply_count || result.comment_count) break;
        }
        const retweetButtons = article.querySelectorAll('[data-testid="retweet"], [aria-label*="repost" i]');
        for (const el of retweetButtons) {
          const ariaLabel = el.getAttribute("aria-label") || "";
          const match = ariaLabel.match(/([\d.,]+[KMB]?)\s*(reposts?|retweets?)/i);
          if (match) {
            const count = match[1].replace(/,/g, "");
            let num = parseFloat(count);
            if (count.includes("K") || count.includes("k")) num *= 1e3;
            else if (count.includes("M") || count.includes("m")) num *= 1e6;
            else if (count.includes("B") || count.includes("b")) num *= 1e9;
            result.share_count = Math.floor(num);
            break;
          }
        }
        const quoteButtons = article.querySelectorAll('[data-testid="app-text-transition-container"], [aria-label*="quote" i]');
        for (const el of quoteButtons) {
          const ariaLabel = el.getAttribute("aria-label") || "";
          const match = ariaLabel.match(/([\d.,]+[KMB]?)\s*quotes?/i);
          if (match) {
            const count = match[1].replace(/,/g, "");
            let num = parseFloat(count);
            if (count.includes("K") || count.includes("k")) num *= 1e3;
            else if (count.includes("M") || count.includes("m")) num *= 1e6;
            else if (count.includes("B") || count.includes("b")) num *= 1e9;
            result.quote_count = Math.floor(num);
            break;
          }
        }
        const bookmarkButtons = article.querySelectorAll('[data-testid="bookmark"], [aria-label*="bookmark" i]');
        for (const el of bookmarkButtons) {
          const ariaLabel = el.getAttribute("aria-label") || "";
          const match = ariaLabel.match(/([\d.,]+[KMB]?)\s*bookmarks?/i);
          if (match) {
            const count = match[1].replace(/,/g, "");
            let num = parseFloat(count);
            if (count.includes("K") || count.includes("k")) num *= 1e3;
            else if (count.includes("M") || count.includes("m")) num *= 1e6;
            else if (count.includes("B") || count.includes("b")) num *= 1e9;
            result.bookmark_count = Math.floor(num);
            break;
          }
        }
        const viewElements = article.querySelectorAll("span");
        for (const el of viewElements) {
          const text = el.textContent || "";
          if (text.match(/^[\d.,]+[KMB]?\s*views?$/i)) {
            const match = text.match(/([\d.,]+[KMB]?)/);
            if (match) {
              const count = match[1].replace(/,/g, "");
              let num = parseFloat(count);
              if (count.includes("K") || count.includes("k")) num *= 1e3;
              else if (count.includes("M") || count.includes("m")) num *= 1e6;
              else if (count.includes("B") || count.includes("b")) num *= 1e9;
              result.view_count = Math.floor(num);
              break;
            }
          }
        }
        const textSelectors = [
          '[data-testid="tweetText"]',
          "div[lang]",
          "span[lang]"
        ];
        for (const selector of textSelectors) {
          const textEl = article.querySelector(selector);
          if (textEl) {
            const text = textEl.textContent || "";
            if (text.length > 0 && text.length < 5e3) {
              result.caption = text.trim();
              const hashtags = text.match(/#\w+/g);
              if (hashtags && hashtags.length > 0) {
                result.hashtags = hashtags.map((h) => h.substring(1));
              }
              const mentions = text.match(/@\w+/g);
              if (mentions && mentions.length > 0) {
                result.mentions = mentions.map((m) => m.substring(1));
              }
              break;
            }
          }
        }
        const videoElement = article.querySelector("video");
        if (videoElement) {
          result.is_video = true;
        }
        const timeElement = article.querySelector("time");
        if (timeElement) {
          const datetime = timeElement.getAttribute("datetime");
          if (datetime) {
            const date = new Date(datetime);
            result.timestamp = Math.floor(date.getTime() / 1e3);
          }
        }
        const langElement = article.querySelector("[lang]");
        if (langElement) {
          const lang = langElement.getAttribute("lang");
          if (lang && !result.tweet_language) {
            result.tweet_language = lang;
          }
        }
        const replyLink = article.querySelector('a[href*="/status/"]');
        if (replyLink) {
          const href = replyLink.getAttribute("href") || "";
          const replyMatch = href.match(/\/status\/(\d+)/);
          if (replyMatch && replyMatch[1] !== result.video_id) {
            result.in_reply_to_user_id = replyMatch[1];
          }
        }
        const sourceElement = article.querySelector('[data-testid="sourceLabel"]');
        if (sourceElement) {
          const sourceText = sourceElement.textContent || "";
          if (sourceText && !result.source) {
            result.source = sourceText.trim();
          }
        }
        const sensitiveWarning = article.querySelector('[data-testid="sensitiveMediaWarning"]');
        if (sensitiveWarning) {
          result.possibly_sensitive = true;
        }
        const conversationLink = article.querySelector('a[href*="/status/"]');
        if (conversationLink) {
          const href = conversationLink.getAttribute("href") || "";
          const conversationMatch = href.match(/\/status\/(\d+)/);
          if (conversationMatch) {
            result.conversation_id = conversationMatch[1];
          }
        }
        return result;
      });
      return data;
    } catch (error) {
      this.logger.log(`Failed to extract from DOM: ${error}`, "debug");
      return null;
    }
  }
};

// src/scrapers/InstagramScraper.ts
var InstagramScraper = class extends CreatorMetadataScraper {
  async getCreatorProfileUrl(videoUrl) {
    try {
      return null;
    } catch {
      return null;
    }
  }
  async extractMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting Instagram creator metadata...", "info");
      await page.goto(videoUrl, { waitUntil: "networkidle" });
      await this.delay(3e3);
      let username = null;
      let profileUrl = null;
      const urlMatch = videoUrl.match(/instagram\.com\/([^\/\?]+)/);
      if (urlMatch && !urlMatch[1].includes("p/") && !urlMatch[1].includes("reel/")) {
        username = urlMatch[1];
        profileUrl = `https://www.instagram.com/${username}/`;
      } else {
        const usernameFromLink = await page.evaluate(() => {
          const links = document.querySelectorAll('a[href^="/"]');
          for (const link of links) {
            const href = link.getAttribute("href");
            if (href && href.match(/^\/[^\/]+\/$/) && !href.includes("/p/") && !href.includes("/reel/") && !href.includes("/stories/")) {
              return href.replace(/\//g, "");
            }
          }
          return null;
        });
        if (usernameFromLink) {
          username = usernameFromLink;
          profileUrl = `https://www.instagram.com/${username}/`;
        } else {
          const postUsername = await page.evaluate(() => {
            const header = document.querySelector("header");
            if (header) {
              const link = header.querySelector('a[href^="/"]');
              if (link) {
                const href = link.getAttribute("href");
                if (href && !href.includes("/p/") && !href.includes("/reel/")) {
                  return href.replace(/\//g, "");
                }
              }
            }
            return null;
          });
          if (postUsername) {
            username = postUsername;
            profileUrl = `https://www.instagram.com/${username}/`;
          }
        }
      }
      if (!username || !profileUrl) {
        this.logger.log("Could not find Instagram username", "warn");
        return null;
      }
      this.logger.log(`Found username: ${username}`, "debug");
      if (!page.url().includes("instagram.com")) {
        this.logger.log("Waiting for manual login if needed...", "info");
        await this.delay(1e4);
      }
      await page.goto(profileUrl, { waitUntil: "networkidle" });
      await this.delay(5e3);
      try {
        await page.waitForSelector("header, main, article", { timeout: 5e3 });
      } catch {
      }
      const pageContent = await page.evaluate(() => {
        return document.body.innerText || document.body.textContent || "";
      });
      if (pageContent.includes("Log in") || pageContent.includes("Sign up")) {
        this.logger.log("Instagram may require login to view profile details", "warn");
      }
      const metadata = {
        platform: "instagram",
        url: profileUrl,
        creator_username: username,
        creator_id: username,
        extractedAt: Date.now()
      };
      const nameData = await page.evaluate(() => {
        const header = document.querySelector("header");
        if (header) {
          const h2 = header.querySelector("h2");
          if (h2) {
            const text = h2.textContent || "";
            if (text && !text.includes("Sign up") && !text.includes("Log in")) {
              return text;
            }
          }
          const spans = header.querySelectorAll("span");
          for (const span of spans) {
            const text = span.textContent || "";
            if (text && text.length > 0 && text.length < 100 && !text.includes("followers") && !text.includes("following") && !text.includes("posts") && !text.includes("Sign up") && !text.includes("Log in")) {
              return text;
            }
          }
        }
        return null;
      });
      if (nameData) {
        metadata.creator_name = this.cleanText(nameData);
      }
      const bioData = await page.evaluate(() => {
        const header = document.querySelector("header");
        if (header) {
          const sections = header.querySelectorAll("section, div");
          for (const section of sections) {
            const spans = section.querySelectorAll("span");
            for (const span of spans) {
              const text = span.textContent || "";
              if (text && text.length > 20 && !text.includes("followers") && !text.includes("following") && !text.includes("posts") && !text.includes("Sign up") && !text.includes("Log in")) {
                return text;
              }
            }
          }
        }
        return null;
      });
      if (bioData) {
        metadata.creator_bio = this.cleanText(bioData);
      }
      const followerData = await page.evaluate(() => {
        const links = document.querySelectorAll("a");
        for (const link of links) {
          const href = link.getAttribute("href");
          const text = (link.textContent || "").trim();
          if (href && (href.includes("/followers/") || href.includes("followers")) && /[\d.,]+[KMB]?/.test(text)) {
            return text;
          }
        }
        const header = document.querySelector("header");
        if (header) {
          const allText = header.textContent || "";
          const followerMatch = allText.match(/([\d.,]+[KMB]?)\s*followers?/i);
          if (followerMatch) {
            return followerMatch[1] + " followers";
          }
        }
        return null;
      });
      if (followerData) {
        metadata.creator_follower_count = this.parseCount(followerData);
      }
      const avatarData = await page.evaluate(() => {
        const header = document.querySelector("header");
        if (header) {
          const images = header.querySelectorAll("img");
          for (const img of images) {
            const src = img.src || img.getAttribute("src");
            const alt = img.getAttribute("alt") || "";
            if (src && (src.includes("instagram.com") || src.includes("fbcdn.net")) && (alt.includes("profile") || alt.includes("Profile"))) {
              return src;
            }
          }
        }
        const profileImages = document.querySelectorAll('img[alt*="profile"], img[alt*="Profile"]');
        for (const img of profileImages) {
          const imgElement = img;
          const src = imgElement.src || img.getAttribute("src");
          if (src && (src.includes("instagram.com") || src.includes("fbcdn.net"))) {
            return src;
          }
        }
        return null;
      });
      if (avatarData) {
        metadata.creator_avatar_url = avatarData;
      }
      const verifiedSelectors = [
        '[aria-label*="Verified"]',
        '[aria-label*="verified"]',
        'svg[aria-label*="Verified"]',
        'svg[aria-label*="verified"]',
        '[title*="Verified"]'
      ];
      for (const selector of verifiedSelectors) {
        try {
          const verified = page.locator(selector).first();
          if (await verified.isVisible({ timeout: 2e3 }).catch(() => false)) {
            metadata.creator_verified = true;
            break;
          }
        } catch {
          continue;
        }
      }
      if (!metadata.creator_verified) {
        try {
          const verified = await page.evaluate(() => {
            const elements = document.querySelectorAll("*");
            for (const el of elements) {
              const ariaLabel = el.getAttribute("aria-label");
              const title = el.getAttribute("title");
              if (ariaLabel && ariaLabel.toLowerCase().includes("verified") || title && title.toLowerCase().includes("verified")) {
                return true;
              }
            }
            return false;
          });
          if (verified) {
            metadata.creator_verified = true;
          }
        } catch {
        }
      }
      this.logger.log("Successfully extracted Instagram creator metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract Instagram metadata: ${error}`, "error");
      return null;
    }
  }
  async extractVideoMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting Instagram video metadata...", "info");
      await page.goto(videoUrl, { waitUntil: "networkidle" });
      await this.delay(3e3);
      const metadata = {
        platform: "instagram",
        url: videoUrl,
        extractedAt: Date.now()
      };
      const shortcodeMatch = videoUrl.match(/instagram\.com\/(?:p|reel)\/([^\/\?]+)/);
      if (shortcodeMatch) {
        metadata.shortcode = shortcodeMatch[1];
        metadata.video_id = shortcodeMatch[1];
      }
      const embeddedData = await this.extractFromEmbeddedJSON(page);
      if (embeddedData) {
        if (embeddedData.like_count !== void 0) metadata.like_count = embeddedData.like_count;
        if (embeddedData.comment_count !== void 0) metadata.comment_count = embeddedData.comment_count;
        if (embeddedData.view_count !== void 0) metadata.view_count = embeddedData.view_count;
        if (embeddedData.play_count !== void 0) metadata.play_count = embeddedData.play_count;
        if (embeddedData.timestamp !== void 0) metadata.timestamp = embeddedData.timestamp;
        if (embeddedData.caption) metadata.caption = embeddedData.caption;
        if (embeddedData.hashtags) metadata.hashtags = embeddedData.hashtags;
        if (embeddedData.mentions) metadata.mentions = embeddedData.mentions;
        if (embeddedData.location) metadata.location = embeddedData.location;
        if (embeddedData.music_title) metadata.music_title = embeddedData.music_title;
        if (embeddedData.music_artist) metadata.music_artist = embeddedData.music_artist;
        if (embeddedData.is_carousel !== void 0) metadata.is_carousel = embeddedData.is_carousel;
        if (embeddedData.carousel_media_count !== void 0) metadata.carousel_media_count = embeddedData.carousel_media_count;
        if (embeddedData.is_video !== void 0) metadata.is_video = embeddedData.is_video;
        if (embeddedData.is_photo !== void 0) metadata.is_photo = embeddedData.is_photo;
        if (embeddedData.requiresLogin !== void 0) metadata.requiresLogin = embeddedData.requiresLogin;
      }
      const domData = await this.extractFromDOM(page);
      if (domData) {
        if (domData.like_count !== void 0 && !metadata.like_count) metadata.like_count = domData.like_count;
        if (domData.comment_count !== void 0 && !metadata.comment_count) metadata.comment_count = domData.comment_count;
        if (domData.view_count !== void 0 && !metadata.view_count) metadata.view_count = domData.view_count;
        if (domData.caption && !metadata.caption) metadata.caption = domData.caption;
        if (domData.hashtags && !metadata.hashtags) metadata.hashtags = domData.hashtags;
        if (domData.mentions && !metadata.mentions) metadata.mentions = domData.mentions;
      }
      if (metadata.like_count === void 0 && metadata.comment_count === void 0) {
        metadata.requiresLogin = true;
        this.logger.log("Like/comment counts not available - may require login", "warn");
      }
      this.logger.log("Successfully extracted Instagram video metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract Instagram video metadata: ${error}`, "error");
      return null;
    }
  }
  async extractFromEmbeddedJSON(page) {
    try {
      const data = await page.evaluate(() => {
        const result = {};
        if (window._sharedData) {
          const sharedData = window._sharedData;
          if (sharedData.entry_data?.PostPage?.[0]?.graphql?.shortcode_media) {
            const media = sharedData.entry_data.PostPage[0].graphql.shortcode_media;
            result.like_count = media.edge_media_preview_like?.count;
            result.comment_count = media.edge_media_to_comment?.count;
            result.view_count = media.video_view_count;
            result.play_count = media.video_play_count;
            result.timestamp = media.taken_at_timestamp;
            result.caption = media.edge_media_to_caption?.edges?.[0]?.node?.text;
            result.is_carousel = media.__typename === "GraphSidecar";
            result.is_video = media.__typename === "GraphVideo";
            result.is_photo = media.__typename === "GraphImage";
            if (media.edge_media_to_caption?.edges?.[0]?.node?.text) {
              const caption = media.edge_media_to_caption.edges[0].node.text;
              result.hashtags = (caption.match(/#\w+/g) || []).map((h) => h.substring(1));
              result.mentions = (caption.match(/@\w+/g) || []).map((m) => m.substring(1));
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
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
          try {
            const json = JSON.parse(script.textContent || "{}");
            if (json["@type"] === "VideoObject" || json["@type"] === "ImageObject") {
              if (json.interactionStatistic) {
                for (const stat of json.interactionStatistic) {
                  if (stat["@type"] === "LikeAction") {
                    result.like_count = parseInt(stat.userInteractionCount) || result.like_count;
                  } else if (stat["@type"] === "CommentAction") {
                    result.comment_count = parseInt(stat.userInteractionCount) || result.comment_count;
                  }
                }
              }
              if (json.caption) result.caption = json.caption;
            }
          } catch (e) {
            continue;
          }
        }
        const graphqlScripts = document.querySelectorAll("script");
        for (const script of graphqlScripts) {
          const content = script.textContent || "";
          if (content.includes("shortcode_media") || content.includes("GraphImage") || content.includes("GraphVideo")) {
            try {
              const match = content.match(/window\.__additionalDataLoaded\([^,]+,\s*({.+?})\)/);
              if (match) {
                const json = JSON.parse(match[1]);
                if (json.graphql?.shortcode_media) {
                  const media = json.graphql.shortcode_media;
                  if (!result.like_count) result.like_count = media.edge_media_preview_like?.count;
                  if (!result.comment_count) result.comment_count = media.edge_media_to_comment?.count;
                  if (!result.view_count) result.view_count = media.video_view_count;
                  if (!result.caption) result.caption = media.edge_media_to_caption?.edges?.[0]?.node?.text;
                }
              }
            } catch (e) {
              continue;
            }
          }
        }
        return result;
      });
      return data;
    } catch (error) {
      this.logger.log(`Failed to extract from embedded JSON: ${error}`, "debug");
      return null;
    }
  }
  async extractFromDOM(page) {
    try {
      const data = await page.evaluate(() => {
        const result = {};
        const likeButtons = document.querySelectorAll("button, span, a");
        for (const el of likeButtons) {
          const text = (el.textContent || "").trim();
          const ariaLabel = el.getAttribute("aria-label") || "";
          if (ariaLabel.includes("like") || ariaLabel.includes("Like")) {
            const match = ariaLabel.match(/([\d.,]+[KMB]?)\s*likes?/i) || text.match(/([\d.,]+[KMB]?)/);
            if (match) {
              const count = match[1].replace(/,/g, "");
              let num = parseFloat(count);
              if (count.includes("K") || count.includes("k")) num *= 1e3;
              else if (count.includes("M") || count.includes("m")) num *= 1e6;
              else if (count.includes("B") || count.includes("b")) num *= 1e9;
              result.like_count = Math.floor(num);
              break;
            }
          }
        }
        const commentButtons = document.querySelectorAll("button, span, a");
        for (const el of commentButtons) {
          const text = (el.textContent || "").trim();
          const ariaLabel = el.getAttribute("aria-label") || "";
          if (ariaLabel.includes("comment") || ariaLabel.includes("Comment")) {
            const match = ariaLabel.match(/([\d.,]+[KMB]?)\s*comments?/i) || text.match(/([\d.,]+[KMB]?)/);
            if (match) {
              const count = match[1].replace(/,/g, "");
              let num = parseFloat(count);
              if (count.includes("K") || count.includes("k")) num *= 1e3;
              else if (count.includes("M") || count.includes("m")) num *= 1e6;
              else if (count.includes("B") || count.includes("b")) num *= 1e9;
              result.comment_count = Math.floor(num);
              break;
            }
          }
        }
        const viewElements = document.querySelectorAll("span, div");
        for (const el of viewElements) {
          const text = (el.textContent || "").trim();
          if (text.match(/^[\d.,]+[KMB]?\s*views?$/i)) {
            const match = text.match(/([\d.,]+[KMB]?)/);
            if (match) {
              const count = match[1].replace(/,/g, "");
              let num = parseFloat(count);
              if (count.includes("K") || count.includes("k")) num *= 1e3;
              else if (count.includes("M") || count.includes("m")) num *= 1e6;
              else if (count.includes("B") || count.includes("b")) num *= 1e9;
              result.view_count = Math.floor(num);
              break;
            }
          }
        }
        const article = document.querySelector("article");
        if (article) {
          const spans = article.querySelectorAll("span");
          for (const span of spans) {
            const text = span.textContent || "";
            if (text.length > 20 && text.length < 2e3 && !text.includes("Like") && !text.includes("Comment") && !text.includes("Share")) {
              if (!result.caption) {
                result.caption = text.trim();
              }
              const hashtags = text.match(/#\w+/g);
              if (hashtags && hashtags.length > 0) {
                result.hashtags = hashtags.map((h) => h.substring(1));
              }
              const mentions = text.match(/@\w+/g);
              if (mentions && mentions.length > 0) {
                result.mentions = mentions.map((m) => m.substring(1));
              }
            }
          }
        }
        const carouselIndicators = document.querySelectorAll('[role="button"][aria-label*="carousel"], [aria-label*="Carousel"]');
        if (carouselIndicators.length > 0) {
          result.is_carousel = true;
          result.carousel_media_count = carouselIndicators.length;
        }
        const videoElement = document.querySelector("video");
        if (videoElement) {
          result.is_video = true;
        } else {
          const images = document.querySelectorAll("article img");
          if (images.length > 0) {
            result.is_photo = true;
          }
        }
        return result;
      });
      return data;
    } catch (error) {
      this.logger.log(`Failed to extract from DOM: ${error}`, "debug");
      return null;
    }
  }
};

// src/scrapers/RedditScraper.ts
var RedditScraper = class extends CreatorMetadataScraper {
  async getCreatorProfileUrl(videoUrl) {
    try {
      return null;
    } catch {
      return null;
    }
  }
  async extractMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting Reddit creator metadata...", "info");
      await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
      await this.delay(3e3);
      let username = null;
      const usernameSelectors = [
        'a[href^="/user/"]',
        'a[href^="/u/"]',
        '[data-testid="post_author_link"]',
        "a.author"
      ];
      for (const selector of usernameSelectors) {
        const link = await this.getElementAttribute(page, selector, "href");
        if (link) {
          const match = link.match(/\/(?:u|user)\/([^\/\?]+)/);
          if (match) {
            username = match[1];
            break;
          }
        }
      }
      if (!username) {
        this.logger.log("Could not find Reddit username", "warn");
        return null;
      }
      const profileUrl = `https://www.reddit.com/user/${username}/`;
      await page.goto(profileUrl, { waitUntil: "domcontentloaded" });
      await this.delay(3e3);
      const metadata = {
        platform: "reddit",
        url: profileUrl,
        creator_username: username,
        extractedAt: Date.now()
      };
      metadata.creator_name = username;
      const karmaSelectors = [
        '[data-testid="karma"]',
        ".karma",
        'span[title*="karma"]'
      ];
      const karmaText = await page.evaluate(() => {
        const elements = document.querySelectorAll("*");
        for (const el of elements) {
          const text = el.textContent || "";
          if (text.includes("karma") || text.includes("Karma")) {
            return text;
          }
        }
        return null;
      });
      if (karmaText) {
        const karmaMatch = karmaText.match(/([\d,]+)/);
        if (karmaMatch) {
          metadata.creator_follower_count = this.parseCount(karmaMatch[1]);
        }
      }
      const bioSelectors = [
        '[data-testid="user-about"]',
        ".user-about",
        'p[data-testid="user-bio"]'
      ];
      for (const selector of bioSelectors) {
        const bio = await this.getElementText(page, selector);
        if (bio && bio.length > 5) {
          metadata.creator_bio = this.cleanText(bio);
          break;
        }
      }
      const avatarSelectors = [
        'img[alt*="avatar"]',
        'img[alt*="snoo"]',
        '[data-testid="user-avatar"] img'
      ];
      for (const selector of avatarSelectors) {
        const avatar = await this.getElementAttribute(page, selector, "src");
        if (avatar) {
          metadata.creator_avatar_url = avatar;
          break;
        }
      }
      const verifiedSelectors = [
        '[data-testid="mod-badge"]',
        '[data-testid="admin-badge"]'
      ];
      for (const selector of verifiedSelectors) {
        const verified = await page.locator(selector).first();
        if (await verified.isVisible({ timeout: 2e3 }).catch(() => false)) {
          metadata.creator_verified = true;
          break;
        }
      }
      this.logger.log("Successfully extracted Reddit creator metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract Reddit metadata: ${error}`, "error");
      return null;
    }
  }
  async extractVideoMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting Reddit video metadata...", "info");
      await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
      await this.delay(5e3);
      try {
        await page.waitForSelector('shreddit-post, [data-testid="post-container"], article, faceplate-number', { timeout: 5e3 });
      } catch (e) {
        this.logger.log("Post container selector not found, continuing anyway", "debug");
      }
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      await this.delay(2e3);
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await this.delay(1e3);
      const postIdMatch = videoUrl.match(/\/comments\/([a-z0-9]+)/);
      const postId = postIdMatch ? postIdMatch[1] : null;
      this.logger.log(`Extracted post ID: ${postId || "N/A"}`, "debug");
      const metadata = {
        platform: "reddit",
        url: videoUrl,
        extractedAt: Date.now()
      };
      if (postId) {
        metadata.video_id = postId;
      }
      this.logger.log("Attempting to fetch from Reddit JSON API...", "debug");
      const apiData = await this.fetchFromRedditAPI(page, videoUrl);
      if (apiData) {
        this.logger.log(`Reddit API data: ${JSON.stringify(apiData)}`, "debug");
        if (apiData.like_count !== void 0) metadata.like_count = apiData.like_count;
        if (apiData.comment_count !== void 0) metadata.comment_count = apiData.comment_count;
        if (apiData.view_count !== void 0) metadata.view_count = apiData.view_count;
        if (apiData.timestamp !== void 0) metadata.timestamp = apiData.timestamp;
        if (apiData.caption) metadata.caption = apiData.caption;
        if (apiData.is_video !== void 0) metadata.is_video = apiData.is_video;
        if (apiData.save_count !== void 0) metadata.save_count = apiData.save_count;
        if (apiData.upvote_ratio !== void 0) metadata.upvote_ratio = apiData.upvote_ratio;
        if (apiData.is_self !== void 0) metadata.is_self = apiData.is_self;
        if (apiData.is_gallery !== void 0) metadata.is_gallery = apiData.is_gallery;
        if (apiData.spoiler !== void 0) metadata.spoiler = apiData.spoiler;
        if (apiData.locked !== void 0) metadata.locked = apiData.locked;
        if (apiData.stickied !== void 0) metadata.stickied = apiData.stickied;
        if (apiData.over_18 !== void 0) metadata.over_18 = apiData.over_18;
        if (apiData.link_flair_text) metadata.link_flair_text = apiData.link_flair_text;
        if (apiData.link_flair_css_class) metadata.link_flair_css_class = apiData.link_flair_css_class;
        if (apiData.domain) metadata.domain = apiData.domain;
        if (apiData.selftext_html) metadata.selftext_html = apiData.selftext_html;
        if (apiData.author_fullname) metadata.author_fullname = apiData.author_fullname;
        if (apiData.subreddit_id) metadata.subreddit_id = apiData.subreddit_id;
        if (apiData.thumbnail_height) metadata.thumbnail_height = apiData.thumbnail_height;
        if (apiData.thumbnail_width) metadata.thumbnail_width = apiData.thumbnail_width;
      } else {
        this.logger.log("No data from Reddit API, falling back to embedded JSON...", "debug");
      }
      this.logger.log("Attempting to extract from embedded JSON...", "debug");
      const embeddedData = await this.extractFromEmbeddedJSON(page);
      if (embeddedData) {
        this.logger.log(`Embedded JSON extracted: ${JSON.stringify(embeddedData)}`, "debug");
        if (embeddedData.like_count !== void 0) {
          metadata.like_count = embeddedData.like_count;
          this.logger.log(`Like count from JSON: ${embeddedData.like_count}`, "debug");
        }
        if (embeddedData.comment_count !== void 0) {
          metadata.comment_count = embeddedData.comment_count;
          this.logger.log(`Comment count from JSON: ${embeddedData.comment_count}`, "debug");
        }
        if (embeddedData.view_count !== void 0) {
          metadata.view_count = embeddedData.view_count;
          this.logger.log(`View count from JSON: ${embeddedData.view_count}`, "debug");
        }
        if (embeddedData.timestamp !== void 0) {
          metadata.timestamp = embeddedData.timestamp;
          this.logger.log(`Timestamp from JSON: ${new Date(embeddedData.timestamp * 1e3).toISOString()}`, "debug");
        }
        if (embeddedData.caption) {
          metadata.caption = embeddedData.caption;
          this.logger.log(`Caption from JSON: ${embeddedData.caption.substring(0, 50)}...`, "debug");
        }
        if (embeddedData.hashtags) {
          metadata.hashtags = embeddedData.hashtags;
          this.logger.log(`Hashtags from JSON: ${embeddedData.hashtags.join(", ")}`, "debug");
        }
        if (embeddedData.mentions) {
          metadata.mentions = embeddedData.mentions;
          this.logger.log(`Mentions from JSON: ${embeddedData.mentions.join(", ")}`, "debug");
        }
        if (embeddedData.is_video !== void 0) {
          metadata.is_video = embeddedData.is_video;
          this.logger.log(`Is video from JSON: ${embeddedData.is_video}`, "debug");
        }
        if (embeddedData.save_count !== void 0) {
          metadata.save_count = embeddedData.save_count;
          this.logger.log(`Save count (awards) from JSON: ${embeddedData.save_count}`, "debug");
        }
        if (embeddedData.upvote_ratio !== void 0) metadata.upvote_ratio = embeddedData.upvote_ratio;
        if (embeddedData.is_self !== void 0) metadata.is_self = embeddedData.is_self;
        if (embeddedData.is_gallery !== void 0) metadata.is_gallery = embeddedData.is_gallery;
        if (embeddedData.spoiler !== void 0) metadata.spoiler = embeddedData.spoiler;
        if (embeddedData.locked !== void 0) metadata.locked = embeddedData.locked;
        if (embeddedData.stickied !== void 0) metadata.stickied = embeddedData.stickied;
        if (embeddedData.over_18 !== void 0) metadata.over_18 = embeddedData.over_18;
        if (embeddedData.link_flair_text) metadata.link_flair_text = embeddedData.link_flair_text;
        if (embeddedData.link_flair_css_class) metadata.link_flair_css_class = embeddedData.link_flair_css_class;
        if (embeddedData.domain) metadata.domain = embeddedData.domain;
        if (embeddedData.selftext_html) metadata.selftext_html = embeddedData.selftext_html;
        if (embeddedData.author_fullname) metadata.author_fullname = embeddedData.author_fullname;
      } else {
        this.logger.log("No data found in embedded JSON", "debug");
      }
      this.logger.log("Attempting to extract from DOM...", "debug");
      const domData = await this.extractFromDOM(page);
      if (domData) {
        this.logger.log(`DOM extracted: ${JSON.stringify(domData)}`, "debug");
        if (domData.like_count !== void 0 && !metadata.like_count) {
          metadata.like_count = domData.like_count;
          this.logger.log(`Like count from DOM: ${domData.like_count}`, "debug");
        }
        if (domData.comment_count !== void 0 && !metadata.comment_count) {
          metadata.comment_count = domData.comment_count;
          this.logger.log(`Comment count from DOM: ${domData.comment_count}`, "debug");
        }
        if (domData.view_count !== void 0 && !metadata.view_count) {
          metadata.view_count = domData.view_count;
          this.logger.log(`View count from DOM: ${domData.view_count}`, "debug");
        }
        if (domData.caption && !metadata.caption) {
          metadata.caption = domData.caption;
          this.logger.log(`Caption from DOM: ${domData.caption.substring(0, 50)}...`, "debug");
        }
        if (domData.hashtags && !metadata.hashtags) {
          metadata.hashtags = domData.hashtags;
          this.logger.log(`Hashtags from DOM: ${domData.hashtags.join(", ")}`, "debug");
        }
        if (domData.mentions && !metadata.mentions) {
          metadata.mentions = domData.mentions;
          this.logger.log(`Mentions from DOM: ${domData.mentions.join(", ")}`, "debug");
        }
        if (domData.timestamp !== void 0 && !metadata.timestamp) {
          metadata.timestamp = domData.timestamp;
          this.logger.log(`Timestamp from DOM: ${new Date(domData.timestamp * 1e3).toISOString()}`, "debug");
        }
        if (domData.is_video !== void 0) {
          metadata.is_video = domData.is_video;
          this.logger.log(`Is video from DOM: ${domData.is_video}`, "debug");
        }
        if (domData.save_count !== void 0 && !metadata.save_count) {
          metadata.save_count = domData.save_count;
          this.logger.log(`Save count (awards) from DOM: ${domData.save_count}`, "debug");
        }
        if (domData.upvote_ratio !== void 0 && metadata.upvote_ratio === void 0) metadata.upvote_ratio = domData.upvote_ratio;
        if (domData.is_self !== void 0 && metadata.is_self === void 0) metadata.is_self = domData.is_self;
        if (domData.is_gallery !== void 0 && metadata.is_gallery === void 0) metadata.is_gallery = domData.is_gallery;
        if (domData.spoiler !== void 0 && metadata.spoiler === void 0) metadata.spoiler = domData.spoiler;
        if (domData.locked !== void 0 && metadata.locked === void 0) metadata.locked = domData.locked;
        if (domData.stickied !== void 0 && metadata.stickied === void 0) metadata.stickied = domData.stickied;
        if (domData.over_18 !== void 0 && metadata.over_18 === void 0) metadata.over_18 = domData.over_18;
        if (domData.link_flair_text && !metadata.link_flair_text) metadata.link_flair_text = domData.link_flair_text;
        if (domData.link_flair_css_class && !metadata.link_flair_css_class) metadata.link_flair_css_class = domData.link_flair_css_class;
        if (domData.domain && !metadata.domain) metadata.domain = domData.domain;
        if (domData.selftext_html && !metadata.selftext_html) metadata.selftext_html = domData.selftext_html;
        if (domData.author_fullname && !metadata.author_fullname) metadata.author_fullname = domData.author_fullname;
        if (domData.subreddit_id && !metadata.subreddit_id) metadata.subreddit_id = domData.subreddit_id;
      } else {
        this.logger.log("No data found in DOM", "debug");
      }
      const subredditMatch = videoUrl.match(/\/r\/([^\/]+)/);
      if (subredditMatch) {
        const subreddit = subredditMatch[1];
        metadata.mentions = metadata.mentions || [];
        if (!metadata.mentions.includes(`r/${subreddit}`)) {
          metadata.mentions.unshift(`r/${subreddit}`);
        }
        this.logger.log(`Subreddit: r/${subreddit}`, "debug");
      }
      if (metadata.caption) {
        const userMentions = metadata.caption.match(/u\/[\w-]+/g);
        if (userMentions) {
          metadata.mentions = metadata.mentions || [];
          for (const mention of userMentions) {
            if (!metadata.mentions.includes(mention)) {
              metadata.mentions.push(mention);
            }
          }
          this.logger.log(`User mentions from caption: ${userMentions.join(", ")}`, "debug");
        }
      }
      this.logger.log("=== REDDIT VIDEO METADATA EXTRACTION RESULTS ===", "info");
      this.logger.log(`Post ID: ${metadata.video_id || "N/A"}`, "info");
      this.logger.log(`Like Count (Upvotes): ${metadata.like_count ?? "N/A"}`, "info");
      this.logger.log(`Comment Count: ${metadata.comment_count ?? "N/A"}`, "info");
      this.logger.log(`View Count: ${metadata.view_count ?? "N/A"}`, "info");
      this.logger.log(`Save Count (Awards): ${metadata.save_count ?? "N/A"}`, "info");
      this.logger.log(`Caption: ${metadata.caption ? metadata.caption.substring(0, 80) + "..." : "N/A"}`, "info");
      this.logger.log(`Hashtags: ${metadata.hashtags ? metadata.hashtags.join(", ") : "N/A"}`, "info");
      this.logger.log(`Mentions: ${metadata.mentions ? metadata.mentions.join(", ") : "N/A"}`, "info");
      this.logger.log(`Is Video: ${metadata.is_video !== void 0 ? metadata.is_video : "N/A"}`, "info");
      this.logger.log(`Timestamp: ${metadata.timestamp ? new Date(metadata.timestamp * 1e3).toISOString() : "N/A"}`, "info");
      this.logger.log("--- Fields yt-dlp CANNOT get ---", "info");
      this.logger.log(`Upvote Ratio: ${metadata.upvote_ratio !== void 0 ? metadata.upvote_ratio : "N/A"}`, "info");
      this.logger.log(`Is Self Post: ${metadata.is_self !== void 0 ? metadata.is_self : "N/A"}`, "info");
      this.logger.log(`Is Gallery: ${metadata.is_gallery !== void 0 ? metadata.is_gallery : "N/A"}`, "info");
      this.logger.log(`Spoiler: ${metadata.spoiler !== void 0 ? metadata.spoiler : "N/A"}`, "info");
      this.logger.log(`Locked: ${metadata.locked !== void 0 ? metadata.locked : "N/A"}`, "info");
      this.logger.log(`Stickied: ${metadata.stickied !== void 0 ? metadata.stickied : "N/A"}`, "info");
      this.logger.log(`Over 18 (NSFW): ${metadata.over_18 !== void 0 ? metadata.over_18 : "N/A"}`, "info");
      this.logger.log(`Link Flair: ${metadata.link_flair_text || "N/A"}`, "info");
      this.logger.log(`Domain: ${metadata.domain || "N/A"}`, "info");
      this.logger.log(`Author Fullname: ${metadata.author_fullname || "N/A"}`, "info");
      this.logger.log(`Subreddit ID: ${metadata.subreddit_id || "N/A"}`, "info");
      this.logger.log(`Has Selftext HTML: ${metadata.selftext_html ? "Yes" : "No"}`, "info");
      this.logger.log("=== END REDDIT METADATA ===", "info");
      this.logger.log("Successfully extracted Reddit video metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract Reddit video metadata: ${error}`, "error");
      return null;
    }
  }
  async fetchFromRedditAPI(page, videoUrl) {
    try {
      const jsonUrl = videoUrl.replace(/\/$/, "") + ".json";
      const response = await page.evaluate(async (url) => {
        try {
          const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" }
          });
          if (!res.ok) return null;
          return await res.json();
        } catch {
          return null;
        }
      }, jsonUrl);
      if (!response || !Array.isArray(response) || response.length === 0) {
        return null;
      }
      const postData = response[0]?.data?.children?.[0]?.data;
      if (!postData) return null;
      const result = {};
      if (postData.ups !== void 0) result.like_count = postData.ups;
      if (postData.score !== void 0 && !result.like_count) result.like_count = postData.score;
      if (postData.num_comments !== void 0) result.comment_count = postData.num_comments;
      if (postData.view_count !== void 0) result.view_count = postData.view_count;
      if (postData.title) result.caption = postData.title;
      if (postData.created_utc) result.timestamp = Math.floor(postData.created_utc);
      if (postData.is_video !== void 0) result.is_video = postData.is_video;
      if (postData.total_awards_received !== void 0) result.save_count = postData.total_awards_received;
      if (postData.upvote_ratio !== void 0) result.upvote_ratio = postData.upvote_ratio;
      if (postData.is_self !== void 0) result.is_self = postData.is_self;
      if (postData.is_gallery !== void 0) result.is_gallery = postData.is_gallery;
      if (postData.spoiler !== void 0) result.spoiler = postData.spoiler;
      if (postData.locked !== void 0) result.locked = postData.locked;
      if (postData.stickied !== void 0) result.stickied = postData.stickied;
      if (postData.over_18 !== void 0) result.over_18 = postData.over_18;
      if (postData.link_flair_text) result.link_flair_text = postData.link_flair_text;
      if (postData.link_flair_css_class) result.link_flair_css_class = postData.link_flair_css_class;
      if (postData.domain) result.domain = postData.domain;
      if (postData.selftext_html) result.selftext_html = postData.selftext_html;
      if (postData.author_fullname) result.author_fullname = postData.author_fullname;
      if (postData.subreddit_id) result.subreddit_id = postData.subreddit_id;
      if (postData.thumbnail_height) result.thumbnail_height = postData.thumbnail_height;
      if (postData.thumbnail_width) result.thumbnail_width = postData.thumbnail_width;
      return result;
    } catch (error) {
      this.logger.log(`Failed to fetch from Reddit API: ${error}`, "debug");
      return null;
    }
  }
  async extractFromEmbeddedJSON(page) {
    try {
      const data = await page.evaluate(() => {
        const result = {};
        if (window.__r) {
          const redditData = window.__r;
          if (redditData?.data?.posts?.models) {
            const post = Object.values(redditData.data.posts.models)[0];
            if (post) {
              result.like_count = post.ups || post.score;
              result.comment_count = post.numComments || post.num_comments || post.commentCount;
              result.view_count = post.viewCount || post.view_count || post.views;
              result.caption = post.title || post.titleText;
              if (post.created || post.createdUTC) {
                result.timestamp = post.created || post.createdUTC;
              }
              if (post.isVideo || post.media?.isVideo) {
                result.is_video = true;
              }
              if (post.awards) {
                result.save_count = post.awards.totalAwardsReceived || post.awards.total_awards_received || post.totalAwardsReceived;
              }
              if (post.selftext) {
                result.caption = (result.caption || "") + " " + post.selftext;
              }
              if (post.upvoteRatio !== void 0) result.upvote_ratio = post.upvoteRatio;
              if (post.isSelf !== void 0) result.is_self = post.isSelf;
              if (post.isGallery !== void 0) result.is_gallery = post.isGallery;
              if (post.spoiler !== void 0) result.spoiler = post.spoiler;
              if (post.locked !== void 0) result.locked = post.locked;
              if (post.stickied !== void 0) result.stickied = post.stickied;
              if (post.over18 !== void 0) result.over_18 = post.over18;
              if (post.linkFlairText) result.link_flair_text = post.linkFlairText;
              if (post.linkFlairCssClass) result.link_flair_css_class = post.linkFlairCssClass;
              if (post.domain) result.domain = post.domain;
              if (post.selftextHtml) result.selftext_html = post.selftextHtml;
              if (post.authorFullname) result.author_fullname = post.authorFullname;
            }
          }
        }
        const scripts = document.querySelectorAll('script[type="application/json"], script[id*="data"], script');
        for (const script of scripts) {
          const content = script.textContent || "";
          if (content.includes('"ups"') || content.includes('"score"') || content.includes('"numComments"')) {
            try {
              const json = JSON.parse(content);
              const findPostData = (obj) => {
                if (!obj || typeof obj !== "object") return null;
                if (obj.ups !== void 0 || obj.score !== void 0 || obj.numComments !== void 0) {
                  return obj;
                }
                for (const key in obj) {
                  const found = findPostData(obj[key]);
                  if (found) return found;
                }
                return null;
              };
              const post = findPostData(json);
              if (post) {
                if (!result.like_count) result.like_count = post.ups || post.score;
                if (!result.comment_count) result.comment_count = post.numComments || post.num_comments || post.commentCount;
                if (!result.view_count) result.view_count = post.viewCount || post.view_count || post.views;
                if (!result.caption) result.caption = post.title || post.titleText;
                if (!result.timestamp && (post.created || post.createdUTC)) {
                  result.timestamp = post.created || post.createdUTC;
                }
                if ((post.isVideo || post.media?.isVideo) && !result.is_video) {
                  result.is_video = true;
                }
                if (post.awards && !result.save_count) {
                  result.save_count = post.awards.totalAwardsReceived || post.awards.total_awards_received || post.totalAwardsReceived;
                }
                if (post.upvote_ratio !== void 0 && !result.upvote_ratio) result.upvote_ratio = post.upvote_ratio;
                if (post.is_self !== void 0 && result.is_self === void 0) result.is_self = post.is_self;
                if (post.is_gallery !== void 0 && result.is_gallery === void 0) result.is_gallery = post.is_gallery;
                if (post.spoiler !== void 0 && result.spoiler === void 0) result.spoiler = post.spoiler;
                if (post.locked !== void 0 && result.locked === void 0) result.locked = post.locked;
                if (post.stickied !== void 0 && result.stickied === void 0) result.stickied = post.stickied;
                if (post.over_18 !== void 0 && result.over_18 === void 0) result.over_18 = post.over_18;
                if (post.link_flair_text && !result.link_flair_text) result.link_flair_text = post.link_flair_text;
                if (post.link_flair_css_class && !result.link_flair_css_class) result.link_flair_css_class = post.link_flair_css_class;
                if (post.domain && !result.domain) result.domain = post.domain;
                if (post.selftext_html && !result.selftext_html) result.selftext_html = post.selftext_html;
                if (post.author_fullname && !result.author_fullname) result.author_fullname = post.author_fullname;
              }
            } catch (e) {
              if (content.includes("window.__r = ")) {
                try {
                  const match = content.match(/window\.__r\s*=\s*({.+?});/s);
                  if (match) {
                    const json = JSON.parse(match[1]);
                    const posts = json?.data?.posts?.models;
                    if (posts) {
                      const post = Object.values(posts)[0];
                      if (post) {
                        if (!result.like_count) result.like_count = post.ups || post.score;
                        if (!result.comment_count) result.comment_count = post.numComments || post.num_comments || post.commentCount;
                        if (!result.view_count) result.view_count = post.viewCount || post.view_count || post.views;
                        if (!result.caption) result.caption = post.title || post.titleText;
                        if (!result.timestamp && (post.created || post.createdUTC)) {
                          result.timestamp = post.created || post.createdUTC;
                        }
                        if ((post.isVideo || post.media?.isVideo) && !result.is_video) {
                          result.is_video = true;
                        }
                        if (post.awards && !result.save_count) {
                          result.save_count = post.awards.totalAwardsReceived || post.awards.total_awards_received || post.totalAwardsReceived;
                        }
                        if (post.upvoteRatio !== void 0 && !result.upvote_ratio) result.upvote_ratio = post.upvoteRatio;
                        if (post.isSelf !== void 0 && result.is_self === void 0) result.is_self = post.isSelf;
                        if (post.isGallery !== void 0 && result.is_gallery === void 0) result.is_gallery = post.isGallery;
                        if (post.spoiler !== void 0 && result.spoiler === void 0) result.spoiler = post.spoiler;
                        if (post.locked !== void 0 && result.locked === void 0) result.locked = post.locked;
                        if (post.stickied !== void 0 && result.stickied === void 0) result.stickied = post.stickied;
                        if (post.over18 !== void 0 && result.over_18 === void 0) result.over_18 = post.over18;
                        if (post.linkFlairText && !result.link_flair_text) result.link_flair_text = post.linkFlairText;
                        if (post.linkFlairCssClass && !result.link_flair_css_class) result.link_flair_css_class = post.linkFlairCssClass;
                        if (post.domain && !result.domain) result.domain = post.domain;
                        if (post.selftextHtml && !result.selftext_html) result.selftext_html = post.selftextHtml;
                        if (post.authorFullname && !result.author_fullname) result.author_fullname = post.authorFullname;
                      }
                    }
                  }
                } catch (e2) {
                  continue;
                }
              } else {
                continue;
              }
            }
          }
        }
        return result;
      });
      return data;
    } catch (error) {
      this.logger.log(`Failed to extract from embedded JSON: ${error}`, "debug");
      return null;
    }
  }
  async extractFromDOM(page) {
    try {
      const data = await page.evaluate(() => {
        const result = {};
        const scoreSelectors = [
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
        for (const selector of scoreSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const el of elements) {
            const text = (el.textContent || "").trim();
            const numberAttr = el.getAttribute("number");
            if (numberAttr) {
              const num = parseInt(numberAttr);
              if (num > 0 && num < 1e8) {
                result.like_count = num;
                break;
              }
            }
            if (text && /^[\d,]+[KMB]?$/.test(text)) {
              let num = parseFloat(text.replace(/,/g, "").replace(/[KMB]/i, ""));
              if (text.includes("K") || text.includes("k")) num *= 1e3;
              else if (text.includes("M") || text.includes("m")) num *= 1e6;
              else if (text.includes("B") || text.includes("b")) num *= 1e9;
              if (num > 0 && num < 1e8) {
                result.like_count = Math.floor(num);
                break;
              }
            }
          }
          if (result.like_count) break;
        }
        if (!result.like_count) {
          const upvoteSelectors = [
            '[data-testid="vote-arrows"]',
            'button[aria-label*="upvote"]',
            '[aria-label*="upvote"]',
            'button[aria-label*="Upvote"]',
            ".vote-button",
            '[data-click-id="upvote"]'
          ];
          for (const selector of upvoteSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
              const parent = el.closest('[data-testid="post-container"], article, [class*="Post"], shreddit-post');
              if (parent) {
                const scoreEl = parent.querySelector('faceplate-number[number], [slot="score"], span[slot="score"]');
                if (scoreEl) {
                  const numberAttr = scoreEl.getAttribute("number");
                  if (numberAttr) {
                    const num = parseInt(numberAttr);
                    if (num > 0 && num < 1e8) {
                      result.like_count = num;
                      break;
                    }
                  }
                }
                const scoreText = parent.textContent || "";
                const scoreMatch = scoreText.match(/([\d,]+[KMB]?)\s*(?:upvotes?|points?|karma)/i);
                if (scoreMatch) {
                  let num = parseFloat(scoreMatch[1].replace(/,/g, "").replace(/[KMB]/i, ""));
                  if (scoreMatch[1].includes("K") || scoreMatch[1].includes("k")) num *= 1e3;
                  else if (scoreMatch[1].includes("M") || scoreMatch[1].includes("m")) num *= 1e6;
                  else if (scoreMatch[1].includes("B") || scoreMatch[1].includes("b")) num *= 1e9;
                  if (num > 0 && num < 1e8) {
                    result.like_count = Math.floor(num);
                    break;
                  }
                }
              }
            }
            if (result.like_count) break;
          }
        }
        const commentSelectors = [
          'shreddit-post a[href*="comments"] faceplate-number[number]',
          'a[href*="/comments/"] faceplate-number[number]',
          'a[href*="/comments/"]',
          'button[aria-label*="comment"]',
          '[data-testid="comment-count"]',
          '[slot="comment-count"]'
        ];
        for (const selector of commentSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const el of elements) {
            const isCommentLink = el.tagName === "A" && el.getAttribute("href")?.includes("/comments/");
            const hasCommentText = el.textContent?.toLowerCase().includes("comment") || el.getAttribute("aria-label")?.toLowerCase().includes("comment");
            if (!isCommentLink && !hasCommentText) continue;
            const numberEl = el.querySelector("faceplate-number[number]") || (el.tagName === "FACEPLATE-NUMBER" ? el : null);
            if (numberEl) {
              const numberAttr = numberEl.getAttribute("number");
              if (numberAttr) {
                const num = parseInt(numberAttr);
                if (num >= 0 && num < 1e7 && num !== result.like_count) {
                  result.comment_count = num;
                  break;
                }
              }
            }
            const text = (el.textContent || "").trim();
            const ariaLabel = el.getAttribute("aria-label") || "";
            const searchText = text || ariaLabel;
            if (searchText && (searchText.toLowerCase().includes("comment") || /^[\d,]+[KMB]?\s*(comment|comments)?$/i.test(searchText))) {
              const match = searchText.match(/([\d,]+[KMB]?)/);
              if (match) {
                let num = parseFloat(match[1].replace(/,/g, "").replace(/[KMB]/i, ""));
                const matchText = match[1];
                if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
                const finalNum = Math.floor(num);
                if (finalNum >= 0 && finalNum < 1e7 && finalNum !== result.like_count) {
                  result.comment_count = finalNum;
                  break;
                }
              }
            }
          }
          if (result.comment_count !== void 0) break;
        }
        if (!result.comment_count) {
          const postContainer = document.querySelector('shreddit-post, [data-testid="post-container"], article');
          if (postContainer) {
            const commentButton = postContainer.querySelector('a[href*="/comments/"][href*="#"]') || postContainer.querySelector('button[aria-label*="comment"]') || postContainer.querySelector('a[href*="/comments/"]');
            if (commentButton) {
              const faceplateNumber = commentButton.querySelector("faceplate-number[number]") || commentButton.closest("div")?.querySelector("faceplate-number[number]");
              if (faceplateNumber) {
                const numberAttr = faceplateNumber.getAttribute("number");
                if (numberAttr) {
                  const num = parseInt(numberAttr);
                  if (num >= 0 && num < 1e7 && num !== result.like_count) {
                    result.comment_count = num;
                  }
                }
              }
              if (!result.comment_count) {
                const text = commentButton.textContent || "";
                const match = text.match(/([\d,]+[KMB]?)\s*(?:comment|comments)?/i);
                if (match) {
                  let num = parseFloat(match[1].replace(/,/g, "").replace(/[KMB]/i, ""));
                  if (match[1].includes("K") || match[1].includes("k")) num *= 1e3;
                  else if (match[1].includes("M") || match[1].includes("m")) num *= 1e6;
                  else if (match[1].includes("B") || match[1].includes("b")) num *= 1e9;
                  const finalNum = Math.floor(num);
                  if (finalNum >= 0 && finalNum < 1e7 && finalNum !== result.like_count) {
                    result.comment_count = finalNum;
                  }
                }
              }
            }
          }
        }
        if (!result.comment_count) {
          const voteSection = document.querySelector('[data-testid="vote-arrows"], [data-click-id="upvote"]')?.closest("div")?.parentElement;
          if (voteSection) {
            const commentButton = voteSection.querySelector('a[href*="/comments/"]:not([href*="/comment/"])');
            if (commentButton) {
              const faceplate = commentButton.querySelector("faceplate-number[number]") || commentButton.parentElement?.querySelector("faceplate-number[number]");
              if (faceplate) {
                const num = parseInt(faceplate.getAttribute("number") || "0");
                if (num > 0 && num < 1e7 && num !== result.like_count) {
                  result.comment_count = num;
                }
              }
              if (!result.comment_count) {
                const text = commentButton.textContent || "";
                const match = text.match(/([\d,]+[KMB]?)/);
                if (match) {
                  let num = parseFloat(match[1].replace(/,/g, "").replace(/[KMB]/i, ""));
                  if (match[1].includes("K") || match[1].includes("k")) num *= 1e3;
                  else if (match[1].includes("M") || match[1].includes("m")) num *= 1e6;
                  else if (match[1].includes("B") || match[1].includes("b")) num *= 1e9;
                  const finalNum = Math.floor(num);
                  if (finalNum > 0 && finalNum < 1e7 && finalNum !== result.like_count) {
                    result.comment_count = finalNum;
                  }
                }
              }
            }
          }
        }
        if (!result.comment_count) {
          const firstFaceplate = document.querySelector("faceplate-number[number]");
          if (firstFaceplate) {
            const firstNum = parseInt(firstFaceplate.getAttribute("number") || "0");
            const allFaceplates = Array.from(document.querySelectorAll("faceplate-number[number]"));
            for (const fp of allFaceplates) {
              const num = parseInt(fp.getAttribute("number") || "0");
              if (num > 0 && num < 1e7 && num !== result.like_count && num !== firstNum) {
                const nearbyText = fp.parentElement?.textContent?.toLowerCase() || "";
                if (nearbyText.includes("comment") || nearbyText.match(/\d+\s*(comment|comments)/)) {
                  result.comment_count = num;
                  break;
                }
              }
            }
          }
        }
        const viewSelectors = [
          '[data-testid="view-count"]',
          'span[title*="view"]',
          '[aria-label*="view"]'
        ];
        for (const selector of viewSelectors) {
          const el = document.querySelector(selector);
          if (el) {
            const text = (el.textContent || "").trim();
            const title = el.getAttribute("title") || "";
            const searchText = text || title;
            if (searchText && searchText.toLowerCase().includes("view")) {
              const match = searchText.match(/([\d,]+[KMB]?)/);
              if (match) {
                let num = parseFloat(match[1].replace(/,/g, "").replace(/[KMB]/i, ""));
                const matchText = match[1];
                if (matchText.includes("K") || matchText.includes("k")) num *= 1e3;
                else if (matchText.includes("M") || matchText.includes("m")) num *= 1e6;
                else if (matchText.includes("B") || matchText.includes("b")) num *= 1e9;
                result.view_count = Math.floor(num);
                break;
              }
            }
          }
        }
        const titleSelectors = [
          '[data-testid="post-content"] h1',
          'h1[data-testid="post-title"]',
          "h1",
          '[data-click-id="body"] h1',
          "article h1"
        ];
        for (const selector of titleSelectors) {
          const el = document.querySelector(selector);
          if (el) {
            const text = (el.textContent || "").trim();
            if (text && text.length > 0) {
              result.caption = text;
              const hashtags = text.match(/#\w+/g);
              if (hashtags) {
                result.hashtags = hashtags.map((h) => h.substring(1));
              }
              break;
            }
          }
        }
        const timeSelectors = [
          '[data-testid="post-timestamp"]',
          "time",
          '[title*="ago"]',
          '[aria-label*="ago"]'
        ];
        for (const selector of timeSelectors) {
          const el = document.querySelector(selector);
          if (el) {
            const datetime = el.getAttribute("datetime") || el.getAttribute("title") || "";
            if (datetime) {
              const date = new Date(datetime);
              if (!isNaN(date.getTime())) {
                result.timestamp = Math.floor(date.getTime() / 1e3);
                break;
              }
            }
            const text = (el.textContent || "").trim();
            if (text && text.includes("ago")) {
              const now = Date.now();
              const hoursAgo = text.match(/(\d+)\s*hour/i);
              const daysAgo = text.match(/(\d+)\s*day/i);
              const monthsAgo = text.match(/(\d+)\s*month/i);
              const yearsAgo = text.match(/(\d+)\s*year/i);
              let timestamp = now;
              if (yearsAgo) timestamp -= parseInt(yearsAgo[1]) * 365 * 24 * 60 * 60 * 1e3;
              else if (monthsAgo) timestamp -= parseInt(monthsAgo[1]) * 30 * 24 * 60 * 60 * 1e3;
              else if (daysAgo) timestamp -= parseInt(daysAgo[1]) * 24 * 60 * 60 * 1e3;
              else if (hoursAgo) timestamp -= parseInt(hoursAgo[1]) * 60 * 60 * 1e3;
              result.timestamp = Math.floor(timestamp / 1e3);
              break;
            }
          }
        }
        const shredditPost = document.querySelector("shreddit-post");
        if (shredditPost) {
          const postType = shredditPost.getAttribute("post-type");
          const contentHref = shredditPost.getAttribute("content-href") || "";
          const isVideoPost = postType === "video" || contentHref.includes("v.redd.it") || shredditPost.querySelector("shreddit-player, shreddit-player-2") !== null;
          const isImagePost = postType === "image" || shredditPost.querySelector("shreddit-aspect-ratio img, gallery-carousel") !== null;
          const isGallery = postType === "gallery" || shredditPost.querySelector("gallery-carousel") !== null;
          if (isVideoPost) {
            result.is_video = true;
          } else if (isImagePost || isGallery) {
            result.is_video = false;
          }
          if (isGallery) result.is_gallery = true;
          if (postType === "self" || postType === "text") result.is_self = true;
          else if (postType === "link" || postType === "video" || postType === "image") result.is_self = false;
          const hasSpoiler = shredditPost.hasAttribute("spoiler") || shredditPost.getAttribute("is-spoiler") === "true" || shredditPost.querySelector('[slot="spoiler-tag"]') !== null;
          result.spoiler = hasSpoiler;
          const isLocked = shredditPost.hasAttribute("locked") || shredditPost.getAttribute("is-locked") === "true" || shredditPost.querySelector('[data-testid="locked-badge"]') !== null;
          result.locked = isLocked;
          const isStickied = shredditPost.hasAttribute("stickied") || shredditPost.getAttribute("is-stickied") === "true" || shredditPost.getAttribute("pinned") === "true";
          result.stickied = isStickied;
          const isNsfw = shredditPost.hasAttribute("nsfw") || shredditPost.hasAttribute("over-18") || shredditPost.getAttribute("is-nsfw") === "true" || shredditPost.querySelector('[slot="nsfw-tag"], [data-testid="nsfw-badge"]') !== null;
          result.over_18 = isNsfw;
          const flairEl = shredditPost.querySelector('flair-tag, [slot="flair"], shreddit-post-flair, [data-testid="post-flair"]');
          if (flairEl) {
            result.link_flair_text = flairEl.textContent?.trim() || void 0;
          }
          const flairAttr = shredditPost.getAttribute("link-flair-text") || shredditPost.getAttribute("flair");
          if (flairAttr && !result.link_flair_text) {
            result.link_flair_text = flairAttr;
          }
          if (contentHref) {
            try {
              const url = new URL(contentHref);
              result.domain = url.hostname;
            } catch {
              const domainMatch = contentHref.match(/https?:\/\/([^\/]+)/);
              if (domainMatch) result.domain = domainMatch[1];
            }
          }
          const authorId = shredditPost.getAttribute("author-id");
          if (authorId) result.author_fullname = authorId;
          const subredditId = shredditPost.getAttribute("subreddit-id");
          if (subredditId) result.subreddit_id = subredditId;
          const scoreAttr = shredditPost.getAttribute("score");
          const upvoteRatioAttr = shredditPost.getAttribute("upvote-ratio");
          if (upvoteRatioAttr && !result.upvote_ratio) {
            result.upvote_ratio = parseFloat(upvoteRatioAttr);
          }
        }
        if (result.is_video === void 0) {
          const videoElement = document.querySelector('video, [data-testid="video-player"], vreddit-player, shreddit-player');
          if (videoElement) {
            result.is_video = true;
          } else {
            const postContainer = document.querySelector('shreddit-post, [data-testid="post-container"], article');
            if (postContainer) {
              const hasVideo = postContainer.querySelector('video, vreddit-player, [data-testid="video-player"], shreddit-player');
              if (hasVideo) {
                result.is_video = true;
              } else {
                const hasImage = postContainer.querySelector('img[src*="redd.it"], img[src*="preview"], gallery-carousel');
                if (hasImage) {
                  result.is_video = false;
                }
              }
            }
          }
        }
        const awardSelectors = [
          '[data-testid="award-count"]',
          '[aria-label*="award"]',
          '[title*="award"]'
        ];
        for (const selector of awardSelectors) {
          const el = document.querySelector(selector);
          if (el) {
            const text = (el.textContent || "").trim();
            const title = el.getAttribute("title") || "";
            const searchText = text || title;
            if (searchText && searchText.toLowerCase().includes("award")) {
              const match = searchText.match(/([\d,]+)/);
              if (match) {
                result.save_count = parseInt(match[1].replace(/,/g, ""));
                break;
              }
            }
          }
        }
        return result;
      });
      return data;
    } catch (error) {
      this.logger.log(`Failed to extract from DOM: ${error}`, "debug");
      return null;
    }
  }
};

// src/scrapers/FacebookScraper.ts
var FacebookScraper = class extends CreatorMetadataScraper {
  async getCreatorProfileUrl(videoUrl) {
    try {
      const match = videoUrl.match(/facebook\.com\/([^\/\?]+)/);
      if (match && !match[1].includes("watch")) {
        return `https://www.facebook.com/${match[1]}`;
      }
      return null;
    } catch {
      return null;
    }
  }
  async extractMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting Facebook creator metadata...", "info");
      await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
      await this.delay(3e3);
      let profileUrl = null;
      const links = await page.locator('a[href*="facebook.com"]').all();
      for (const link of links) {
        const href = await link.getAttribute("href");
        if (href && !href.includes("/watch") && !href.includes("/videos") && href.match(/facebook\.com\/[^\/]+$/)) {
          profileUrl = href;
          break;
        }
      }
      if (!profileUrl) {
        this.logger.log("Could not find Facebook profile URL", "warn");
        return null;
      }
      await page.goto(profileUrl, { waitUntil: "domcontentloaded" });
      await this.delay(3e3);
      const metadata = {
        platform: "facebook",
        url: profileUrl,
        extractedAt: Date.now()
      };
      const nameSelectors = [
        "h1",
        '[data-testid="profile-name"]',
        "header h1"
      ];
      for (const selector of nameSelectors) {
        const name = await this.getElementText(page, selector);
        if (name && name.length > 0) {
          metadata.creator_name = this.cleanText(name);
          break;
        }
      }
      const bioSelectors = [
        '[data-testid="profile-bio"]',
        ".profile-bio",
        'div[data-testid="profile-info"]'
      ];
      for (const selector of bioSelectors) {
        const bio = await this.getElementText(page, selector);
        if (bio && bio.length > 5) {
          metadata.creator_bio = this.cleanText(bio);
          break;
        }
      }
      const followerSelectors = [
        '[data-testid="followers"]',
        'a[href*="/followers"]'
      ];
      for (const selector of followerSelectors) {
        const followerText = await this.getElementText(page, selector);
        if (followerText) {
          metadata.creator_follower_count = this.parseCount(followerText);
          break;
        }
      }
      const avatarSelectors = [
        'img[alt*="profile picture"]',
        'img[alt*="Profile picture"]',
        '[data-testid="profile-picture"] img'
      ];
      for (const selector of avatarSelectors) {
        const avatar = await this.getElementAttribute(page, selector, "src");
        if (avatar) {
          metadata.creator_avatar_url = avatar;
          break;
        }
      }
      const verifiedSelectors = [
        '[aria-label*="Verified"]',
        '[data-testid="verified-badge"]'
      ];
      for (const selector of verifiedSelectors) {
        const verified = await page.locator(selector).first();
        if (await verified.isVisible({ timeout: 2e3 }).catch(() => false)) {
          metadata.creator_verified = true;
          break;
        }
      }
      this.logger.log("Successfully extracted Facebook creator metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract Facebook metadata: ${error}`, "error");
      return null;
    }
  }
  async extractVideoMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting Facebook video metadata...", "info");
      const apiResponses = [];
      page.on("response", async (response) => {
        try {
          const url = response.url();
          if (url.includes("graphql") || url.includes("api") || url.includes("graph.facebook.com") || url.includes("graphql/")) {
            try {
              const json = await response.json().catch(() => null);
              if (json) {
                apiResponses.push(json);
              }
            } catch (e) {
            }
          }
        } catch (e) {
        }
      });
      await page.goto(videoUrl, { waitUntil: "networkidle", timeout: 6e4 });
      await this.delay(5e3);
      try {
        const loginSelectors = [
          '[aria-label*="Log in" i]',
          '[aria-label*="login" i]',
          'button:has-text("Log in")',
          'button:has-text("Sign up")',
          '[role="dialog"]',
          '[data-testid*="login" i]'
        ];
        for (const selector of loginSelectors) {
          try {
            const element = await page.locator(selector).first();
            if (await element.isVisible({ timeout: 2e3 }).catch(() => false)) {
              this.logger.log("Login overlay detected, attempting to dismiss", "debug");
              try {
                await page.keyboard.press("Escape");
                await this.delay(1e3);
                const closeButton = await page.locator('button[aria-label*="close" i], button[aria-label*="Close" i], [aria-label*="Close" i]').first();
                if (await closeButton.isVisible({ timeout: 1e3 }).catch(() => false)) {
                  await closeButton.click();
                  await this.delay(1e3);
                }
              } catch (e) {
                this.logger.log("Could not dismiss login overlay", "debug");
              }
              break;
            }
          } catch (e) {
            continue;
          }
        }
      } catch (e) {
        this.logger.log("No login overlay found or already dismissed", "debug");
      }
      await this.delay(3e3);
      try {
        await page.waitForSelector('video, [role="article"], [data-pagelet]', { timeout: 1e4 });
      } catch (e) {
        this.logger.log("Facebook content may not be fully loaded", "debug");
      }
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      await this.delay(2e3);
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await this.delay(3e3);
      const metadata = {
        platform: "facebook",
        url: videoUrl,
        extractedAt: Date.now()
      };
      const videoIdMatch = videoUrl.match(/\/videos\/(\d+)/) || videoUrl.match(/\/watch\/\?v=(\d+)/) || videoUrl.match(/\/reel\/(\d+)/);
      if (videoIdMatch) {
        metadata.video_id = videoIdMatch[1];
      }
      await this.delay(2e3);
      for (const apiResponse of apiResponses) {
        try {
          const extracted = this.extractFromAPIResponse(apiResponse);
          if (extracted && Object.keys(extracted).length > 0) {
            Object.assign(metadata, extracted);
          }
        } catch (e) {
        }
      }
      const embeddedData = await this.extractFromEmbeddedJSON(page);
      if (embeddedData) {
        const extractedKeys = Object.keys(embeddedData);
        if (extractedKeys.length > 0) {
          this.logger.log(`Extracted ${extractedKeys.length} fields from embedded data: ${extractedKeys.join(", ")}`, "debug");
        }
        if (embeddedData.updated_time !== void 0) metadata.updated_time = embeddedData.updated_time;
        if (embeddedData.content_category) metadata.content_category = embeddedData.content_category;
        if (embeddedData.embed_html) metadata.embed_html = embeddedData.embed_html;
        if (embeddedData.embeddable !== void 0) metadata.embeddable = embeddedData.embeddable;
        if (embeddedData.icon) metadata.icon = embeddedData.icon;
        if (embeddedData.is_crosspost_video !== void 0) metadata.is_crosspost_video = embeddedData.is_crosspost_video;
        if (embeddedData.is_crossposting_eligible !== void 0) metadata.is_crossposting_eligible = embeddedData.is_crossposting_eligible;
        if (embeddedData.is_episode !== void 0) metadata.is_episode = embeddedData.is_episode;
        if (embeddedData.is_instagram_eligible !== void 0) metadata.is_instagram_eligible = embeddedData.is_instagram_eligible;
        if (embeddedData.live_status) metadata.live_status = embeddedData.live_status;
        if (embeddedData.post_views !== void 0) metadata.post_views = embeddedData.post_views;
        if (embeddedData.premiere_living_room_status) metadata.premiere_living_room_status = embeddedData.premiere_living_room_status;
        if (embeddedData.privacy) metadata.privacy = embeddedData.privacy;
        if (embeddedData.published !== void 0) metadata.published = embeddedData.published;
        if (embeddedData.status) metadata.status = embeddedData.status;
        if (embeddedData.universal_video_id) metadata.universal_video_id = embeddedData.universal_video_id;
        if (embeddedData.total_video_views_unique !== void 0) metadata.total_video_views_unique = embeddedData.total_video_views_unique;
        if (embeddedData.total_video_avg_time_watched !== void 0) metadata.total_video_avg_time_watched = embeddedData.total_video_avg_time_watched;
        if (embeddedData.total_video_complete_views !== void 0) metadata.total_video_complete_views = embeddedData.total_video_complete_views;
        if (embeddedData.total_video_10s_views !== void 0) metadata.total_video_10s_views = embeddedData.total_video_10s_views;
        if (embeddedData.total_video_30s_views !== void 0) metadata.total_video_30s_views = embeddedData.total_video_30s_views;
        if (embeddedData.total_video_60s_excludes_shorter_views !== void 0) metadata.total_video_60s_excludes_shorter_views = embeddedData.total_video_60s_excludes_shorter_views;
        if (embeddedData.reaction_love_count !== void 0) metadata.reaction_love_count = embeddedData.reaction_love_count;
        if (embeddedData.reaction_wow_count !== void 0) metadata.reaction_wow_count = embeddedData.reaction_wow_count;
        if (embeddedData.reaction_haha_count !== void 0) metadata.reaction_haha_count = embeddedData.reaction_haha_count;
        if (embeddedData.reaction_sad_count !== void 0) metadata.reaction_sad_count = embeddedData.reaction_sad_count;
        if (embeddedData.reaction_angry_count !== void 0) metadata.reaction_angry_count = embeddedData.reaction_angry_count;
        if (embeddedData.location) metadata.location = embeddedData.location;
        if (embeddedData.hashtags) metadata.hashtags = embeddedData.hashtags;
        if (embeddedData.caption) metadata.caption = embeddedData.caption;
      }
      const domData = await this.extractFromDOM(page);
      if (domData) {
        if (domData.embed_html && !metadata.embed_html) metadata.embed_html = domData.embed_html;
        if (domData.embeddable !== void 0 && metadata.embeddable === void 0) metadata.embeddable = domData.embeddable;
        if (domData.live_status && !metadata.live_status) metadata.live_status = domData.live_status;
        if (domData.published !== void 0 && metadata.published === void 0) metadata.published = domData.published;
        if (domData.location && !metadata.location) metadata.location = domData.location;
        if (domData.hashtags && !metadata.hashtags) metadata.hashtags = domData.hashtags;
        if (domData.caption && !metadata.caption) metadata.caption = domData.caption;
      }
      this.logger.log("Successfully extracted Facebook video metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract Facebook video metadata: ${error}`, "error");
      return null;
    }
  }
  async extractFromEmbeddedJSON(page) {
    try {
      const data = await page.evaluate(() => {
        const result = {};
        function safeAccess(obj, prop) {
          try {
            return obj && typeof obj === "object" ? obj[prop] : void 0;
          } catch (e) {
            return void 0;
          }
        }
        function extractVideoData(obj, path4 = "") {
          if (!obj || typeof obj !== "object") return;
          if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
              extractVideoData(obj[i], `${path4}[${i}]`);
            }
            return;
          }
          const keys = Object.keys(obj);
          for (const key of keys) {
            const value = obj[key];
            const currentPath = path4 ? `${path4}.${key}` : key;
            if (key === "updated_time" || key === "updatedTime") {
              if (value) {
                const date = value instanceof Date ? value : new Date(value);
                if (!isNaN(date.getTime())) {
                  result.updated_time = Math.floor(date.getTime() / 1e3);
                }
              }
            } else if (key === "content_category" || key === "contentCategory" || key === "category") {
              if (value && !result.content_category) {
                result.content_category = typeof value === "string" ? value : value.name || String(value);
              }
            } else if (key === "embed_html" || key === "embedHtml" || key === "embedCode") {
              if (value && !result.embed_html) {
                result.embed_html = String(value);
              }
            } else if (key === "embeddable") {
              if (value !== void 0 && result.embeddable === void 0) {
                result.embeddable = Boolean(value);
              }
            } else if (key === "icon") {
              if (value && !result.icon) {
                result.icon = String(value);
              }
            } else if (key === "is_crosspost_video" || key === "isCrosspostVideo") {
              if (value !== void 0 && result.is_crosspost_video === void 0) {
                result.is_crosspost_video = Boolean(value);
              }
            } else if (key === "is_crossposting_eligible" || key === "isCrosspostingEligible") {
              if (value !== void 0 && result.is_crossposting_eligible === void 0) {
                result.is_crossposting_eligible = Boolean(value);
              }
            } else if (key === "is_episode" || key === "isEpisode") {
              if (value !== void 0 && result.is_episode === void 0) {
                result.is_episode = Boolean(value);
              }
            } else if (key === "is_instagram_eligible" || key === "isInstagramEligible") {
              if (value !== void 0 && result.is_instagram_eligible === void 0) {
                result.is_instagram_eligible = Boolean(value);
              }
            } else if (key === "live_status" || key === "liveStatus") {
              if (value && !result.live_status) {
                result.live_status = String(value);
              }
            } else if (key === "post_views" || key === "postViews") {
              if (typeof value === "number" && result.post_views === void 0) {
                result.post_views = value;
              }
            } else if (key === "premiere_living_room_status" || key === "premiereLivingRoomStatus") {
              if (value && !result.premiere_living_room_status) {
                result.premiere_living_room_status = String(value);
              }
            } else if (key === "privacy") {
              if (value && !result.privacy) {
                result.privacy = typeof value === "string" ? value : JSON.stringify(value);
              }
            } else if (key === "published") {
              if (value !== void 0 && result.published === void 0) {
                result.published = Boolean(value);
              }
            } else if (key === "status") {
              if (value && !result.status) {
                result.status = typeof value === "string" ? value : JSON.stringify(value);
              }
            } else if (key === "universal_video_id" || key === "universalVideoId") {
              if (value && !result.universal_video_id) {
                result.universal_video_id = String(value);
              }
            } else if (key === "total_video_views_unique" || key === "totalVideoViewsUnique") {
              if (typeof value === "number" && result.total_video_views_unique === void 0) {
                result.total_video_views_unique = value;
              }
            } else if (key === "total_video_avg_time_watched" || key === "totalVideoAvgTimeWatched") {
              if (typeof value === "number" && result.total_video_avg_time_watched === void 0) {
                result.total_video_avg_time_watched = value;
              }
            } else if (key === "total_video_complete_views" || key === "totalVideoCompleteViews") {
              if (typeof value === "number" && result.total_video_complete_views === void 0) {
                result.total_video_complete_views = value;
              }
            } else if (key === "total_video_10s_views" || key === "totalVideo10sViews") {
              if (typeof value === "number" && result.total_video_10s_views === void 0) {
                result.total_video_10s_views = value;
              }
            } else if (key === "total_video_30s_views" || key === "totalVideo30sViews") {
              if (typeof value === "number" && result.total_video_30s_views === void 0) {
                result.total_video_30s_views = value;
              }
            } else if (key === "total_video_60s_excludes_shorter_views" || key === "totalVideo60sExcludesShorterViews") {
              if (typeof value === "number" && result.total_video_60s_excludes_shorter_views === void 0) {
                result.total_video_60s_excludes_shorter_views = value;
              }
            } else if (key === "reactions" && value && typeof value === "object") {
              if (value.LOVE !== void 0) result.reaction_love_count = Number(value.LOVE);
              if (value.WOW !== void 0) result.reaction_wow_count = Number(value.WOW);
              if (value.HAHA !== void 0) result.reaction_haha_count = Number(value.HAHA);
              if (value.SAD !== void 0) result.reaction_sad_count = Number(value.SAD);
              if (value.ANGRY !== void 0) result.reaction_angry_count = Number(value.ANGRY);
            } else if (key === "total_video_reactions_by_type_total" && value && typeof value === "object") {
              if (value.LOVE !== void 0) result.reaction_love_count = Number(value.LOVE);
              if (value.WOW !== void 0) result.reaction_wow_count = Number(value.WOW);
              if (value.HAHA !== void 0) result.reaction_haha_count = Number(value.HAHA);
              if (value.SAD !== void 0) result.reaction_sad_count = Number(value.SAD);
              if (value.ANGRY !== void 0) result.reaction_angry_count = Number(value.ANGRY);
            } else if (key === "place" && value) {
              if (!result.location) {
                result.location = typeof value === "string" ? value : value.name || value.address || JSON.stringify(value);
              }
            } else if (key === "content_tags" && Array.isArray(value)) {
              if (!result.hashtags) {
                const validTags = [];
                for (const tag of value) {
                  const tagStr = typeof tag === "string" ? tag : tag.name || String(tag);
                  if (tagStr && tagStr.length >= 2 && tagStr.length <= 50) {
                    if (!/^[0-9A-Fa-f]{3,8}$/.test(tagStr) && !tagStr.match(/^[0-9]+$/)) {
                      if (/^[a-zA-Z0-9_]+$/.test(tagStr)) {
                        validTags.push(tagStr);
                      }
                    }
                  }
                }
                if (validTags.length > 0) {
                  result.hashtags = validTags;
                }
              }
            } else if (key === "description" || key === "text" || key === "caption") {
              if (value && !result.caption) {
                const captionText = String(value);
                const lowerText = captionText.toLowerCase();
                const errorMessages = ["sorry", "trouble", "error", "loading", "please wait", "log in", "sign up"];
                if (!errorMessages.some((msg) => lowerText.includes(msg)) && captionText.length >= 10) {
                  result.caption = captionText;
                }
              }
            }
            if (typeof value === "object" && value !== null) {
              extractVideoData(value, currentPath);
            }
          }
        }
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
          try {
            const json = JSON.parse(script.textContent || "{}");
            if (json["@type"] === "VideoObject" || json["@type"] === "SocialMediaPosting") {
              extractVideoData(json);
            }
          } catch (e) {
            continue;
          }
        }
        const allScripts = document.querySelectorAll("script:not([src])");
        for (const script of allScripts) {
          const text = script.textContent || "";
          if (text.length < 100 || text.length > 1e6) continue;
          const searchTerms = [
            "updated_time",
            "content_category",
            "embed_html",
            "embeddable",
            "is_crosspost_video",
            "live_status",
            "total_video_views_unique",
            "reactions",
            "total_video_reactions_by_type_total",
            "content_tags",
            "universal_video_id",
            "premiere_living_room_status"
          ];
          const hasRelevantData = searchTerms.some((term) => text.includes(term));
          if (!hasRelevantData) continue;
          try {
            const jsonMatches = [
              text.match(/\{[\s\S]{100,100000}\}/g),
              text.match(/\[[\s\S]{100,100000}\]/g)
            ].flat().filter(Boolean);
            for (const match of jsonMatches) {
              try {
                const json = JSON.parse(match);
                extractVideoData(json);
              } catch (e) {
                continue;
              }
            }
            const requireMatches = text.match(/require\([^)]+\)/g);
            if (requireMatches) {
              for (const match of requireMatches) {
                try {
                  const innerMatch = match.match(/\{[\s\S]{50,50000}\}/);
                  if (innerMatch) {
                    const json = JSON.parse(innerMatch[0]);
                    extractVideoData(json);
                  }
                } catch (e) {
                  continue;
                }
              }
            }
          } catch (e) {
            continue;
          }
        }
        try {
          const win = window;
          const windowProps = ["__d", "require", "_sharedData", "__initialData"];
          for (const prop of windowProps) {
            try {
              if (prop in win) {
                const descriptor = Object.getOwnPropertyDescriptor(win, prop);
                if (descriptor && descriptor.value) {
                  const value = descriptor.value;
                  if (value && typeof value === "object") {
                    extractVideoData(value);
                  }
                } else {
                  try {
                    const value = win[prop];
                    if (value && typeof value === "object") {
                      extractVideoData(value);
                    }
                  } catch (e) {
                    continue;
                  }
                }
              }
            } catch (e) {
              continue;
            }
          }
        } catch (e) {
        }
        const metaTags = document.querySelectorAll("meta[property], meta[name]");
        for (const meta of metaTags) {
          const property = meta.getAttribute("property") || meta.getAttribute("name") || "";
          const content = meta.getAttribute("content") || "";
          if (property.includes("og:video:tag") && content) {
            if (!result.hashtags) result.hashtags = [];
            result.hashtags.push(content);
          }
          if ((property.includes("video:category") || property.includes("og:video:category")) && !result.content_category) {
            result.content_category = content;
          }
          if (property.includes("og:video:embed") && !result.embed_html) {
            result.embed_html = content;
          }
        }
        return result;
      }).catch((error) => {
        this.logger.log(`Error in page.evaluate: ${error}`, "debug");
        return {};
      });
      return data && Object.keys(data).length > 0 ? data : null;
    } catch (error) {
      this.logger.log(`Failed to extract from embedded JSON: ${error}`, "debug");
      return null;
    }
  }
  extractFromAPIResponse(response) {
    try {
      let extractData2 = function(obj) {
        if (!obj || typeof obj !== "object") return;
        if (Array.isArray(obj)) {
          for (const item of obj) {
            extractData2(item);
          }
          return;
        }
        for (const key in obj) {
          const value = obj[key];
          if (key === "updated_time" && value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              result.updated_time = Math.floor(date.getTime() / 1e3);
            }
          } else if (key === "content_category" && value && !result.content_category) {
            result.content_category = String(value);
          } else if (key === "embed_html" && value && !result.embed_html) {
            result.embed_html = String(value);
          } else if (key === "embeddable" && value !== void 0 && result.embeddable === void 0) {
            result.embeddable = Boolean(value);
          } else if (key === "is_crosspost_video" && value !== void 0 && result.is_crosspost_video === void 0) {
            result.is_crosspost_video = Boolean(value);
          } else if (key === "live_status" && value && !result.live_status) {
            result.live_status = String(value);
          } else if (key === "total_video_views_unique" && value !== void 0 && result.total_video_views_unique === void 0) {
            result.total_video_views_unique = Number(value) || 0;
          } else if (key === "total_video_avg_time_watched" && value !== void 0 && result.total_video_avg_time_watched === void 0) {
            result.total_video_avg_time_watched = Number(value) || 0;
          } else if (key === "total_video_complete_views" && value !== void 0 && result.total_video_complete_views === void 0) {
            result.total_video_complete_views = Number(value) || 0;
          } else if (key === "reactions" && value && typeof value === "object") {
            if (value.summary && value.summary.total_count !== void 0) {
            }
            if (value.data && Array.isArray(value.data)) {
              for (const reaction of value.data) {
                if (reaction.type === "LOVE" && reaction.total_count !== void 0) {
                  result.reaction_love_count = reaction.total_count;
                } else if (reaction.type === "WOW" && reaction.total_count !== void 0) {
                  result.reaction_wow_count = reaction.total_count;
                } else if (reaction.type === "HAHA" && reaction.total_count !== void 0) {
                  result.reaction_haha_count = reaction.total_count;
                } else if (reaction.type === "SAD" && reaction.total_count !== void 0) {
                  result.reaction_sad_count = reaction.total_count;
                } else if (reaction.type === "ANGRY" && reaction.total_count !== void 0) {
                  result.reaction_angry_count = reaction.total_count;
                }
              }
            }
          }
          if (typeof value === "object" && value !== null) {
            extractData2(value);
          }
        }
      };
      var extractData = extractData2;
      const result = {};
      extractData2(response);
      return Object.keys(result).length > 0 ? result : null;
    } catch (error) {
      return null;
    }
  }
  async extractFromDOM(page) {
    try {
      const data = await page.evaluate(() => {
        const result = {};
        const videoElement = document.querySelector("video");
        if (videoElement) {
          result.is_video = true;
        }
        const embedButtons = document.querySelectorAll('button[aria-label*="embed" i], a[href*="embed"]');
        if (embedButtons.length > 0) {
          result.embeddable = true;
          for (const btn of embedButtons) {
            const href = btn.getAttribute("href");
            if (href && href.includes("embed")) {
              result.embed_html = href;
              break;
            }
          }
        }
        const liveIndicators = document.querySelectorAll('[aria-label*="live" i], [class*="live" i], [data-testid*="live" i]');
        if (liveIndicators.length > 0) {
          result.live_status = "LIVE";
        } else {
          const vodIndicators = document.querySelectorAll('[aria-label*="video" i], [class*="video" i], video');
          if (vodIndicators.length > 0) {
            result.live_status = "VOD";
          }
        }
        const publishedIndicators = document.querySelectorAll('[aria-label*="published" i], [class*="published" i]');
        if (publishedIndicators.length > 0) {
          result.published = true;
        }
        const locationElements = document.querySelectorAll('[aria-label*="location" i], [class*="location" i], [data-testid*="location" i]');
        for (const el of locationElements) {
          const text = el.textContent || "";
          if (text.length > 0 && text.length < 200) {
            result.location = text.trim();
            break;
          }
        }
        function isValidHashtag(tag) {
          if (!tag || tag.length < 2 || tag.length > 50) return false;
          if (/^[0-9A-Fa-f]{3,8}$/.test(tag)) return false;
          if (tag.match(/^[0-9]+$/)) return false;
          if (tag.includes(" ") || tag.includes("\n")) return false;
          return /^[a-zA-Z0-9_]+$/.test(tag);
        }
        const hashtagElements = document.querySelectorAll('a[href*="/hashtag/"], a[href*="/tag/"], a[href*="hashtag"]');
        const hashtags = [];
        for (const el of hashtagElements) {
          const text = el.textContent || "";
          const cleanText = text.startsWith("#") ? text.substring(1).trim() : text.trim();
          if (isValidHashtag(cleanText) && !hashtags.includes(cleanText)) {
            hashtags.push(cleanText);
          }
        }
        const captionText = document.body.textContent || "";
        const captionHashtags = captionText.match(/#[a-zA-Z0-9_]+/g);
        if (captionHashtags) {
          captionHashtags.forEach((tag) => {
            const cleanTag = tag.substring(1);
            if (isValidHashtag(cleanTag) && !hashtags.includes(cleanTag)) {
              hashtags.push(cleanTag);
            }
          });
        }
        if (hashtags.length > 0) {
          result.hashtags = hashtags;
        }
        function isValidCaption(text) {
          if (!text || text.length < 10 || text.length > 5e3) return false;
          const errorMessages = [
            "sorry",
            "trouble",
            "error",
            "loading",
            "please wait",
            "log in",
            "sign up",
            "sign in",
            "create account",
            "learn more",
            "try again",
            "refresh",
            "reload"
          ];
          const lowerText = text.toLowerCase();
          if (errorMessages.some((msg) => lowerText.includes(msg))) return false;
          return true;
        }
        const captionSelectors = [
          '[data-testid*="post" i]',
          '[class*="post" i]',
          '[class*="caption" i]',
          '[role="article"]',
          "article",
          "[data-pagelet]"
        ];
        for (const selector of captionSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const el of elements) {
            const text = el.textContent || "";
            if (isValidCaption(text)) {
              result.caption = text.trim();
              break;
            }
          }
          if (result.caption) break;
        }
        const metaTags = document.querySelectorAll("meta[property], meta[name]");
        for (const meta of metaTags) {
          const property = meta.getAttribute("property") || meta.getAttribute("name") || "";
          const content = meta.getAttribute("content") || "";
          if ((property.includes("og:title") || property.includes("twitter:title")) && !result.caption) {
            result.caption = content;
          }
          if ((property.includes("og:description") || property.includes("twitter:description")) && !result.caption) {
            result.caption = content;
          }
        }
        return result;
      }).catch((error) => {
        return {};
      });
      return data && Object.keys(data).length > 0 ? data : null;
    } catch (error) {
      this.logger.log(`Failed to extract from DOM: ${error}`, "debug");
      return null;
    }
  }
};

// src/scrapers/TwitchScraper.ts
var TwitchScraper = class extends CreatorMetadataScraper {
  detectContentType(url) {
    if (url.includes("/videos/")) return "vod";
    if (url.includes("/clip/") || url.includes("clips.twitch.tv")) return "clip";
    const match = url.match(/twitch\.tv\/([^\/\?]+)/);
    if (match && match[1] !== "videos" && match[1] !== "directory") {
      if (!url.includes("/clip") && !url.includes("/videos")) {
        return "stream";
      }
    }
    return "channel";
  }
  extractVideoId(url) {
    const vodMatch = url.match(/\/videos\/(\d+)/);
    if (vodMatch) return vodMatch[1];
    return null;
  }
  extractClipSlug(url) {
    const clipMatch = url.match(/\/clip\/([^\/\?]+)/);
    if (clipMatch) return clipMatch[1];
    const clipsMatch = url.match(/clips\.twitch\.tv\/([^\/\?]+)/);
    if (clipsMatch) return clipsMatch[1];
    return null;
  }
  async getCreatorProfileUrl(videoUrl) {
    try {
      const match = videoUrl.match(/twitch\.tv\/([^\/\?]+)/);
      if (match && match[1] !== "videos" && match[1] !== "clip" && match[1] !== "directory") {
        return `https://www.twitch.tv/${match[1]}`;
      }
      return null;
    } catch {
      return null;
    }
  }
  async extractVideoMetadata(page, videoUrl) {
    try {
      const contentType = this.detectContentType(videoUrl);
      this.logger.log(`Extracting Twitch ${contentType} metadata via GraphQL...`, "info");
      const gqlData = /* @__PURE__ */ new Map();
      const responseHandler = async (response) => {
        const reqUrl = response.url();
        if (reqUrl.includes("gql.twitch.tv") || reqUrl.includes("/gql")) {
          try {
            const json = await response.json();
            const responses = Array.isArray(json) ? json : [json];
            for (const resp of responses) {
              const opName = resp?.extensions?.operationName;
              if (opName && resp?.data) {
                gqlData.set(opName, resp.data);
              }
            }
          } catch (e) {
          }
        }
      };
      page.on("response", responseHandler);
      try {
        await page.goto(videoUrl, { waitUntil: "domcontentloaded", timeout: 6e4 });
        await this.delay(8e3);
      } finally {
        page.off("response", responseHandler);
      }
      const metadata = {
        platform: "twitch",
        url: videoUrl,
        extractedAt: Date.now(),
        twitch_content_type: contentType
      };
      switch (contentType) {
        case "vod":
          this.extractVodFromGql(gqlData, videoUrl, metadata);
          break;
        case "clip":
          await this.extractClipFromGql(gqlData, page, videoUrl, metadata);
          break;
        case "stream":
          await this.extractStreamFromGql(gqlData, page, metadata);
          break;
      }
      this.extractChannelFromGql(gqlData, metadata);
      this.logger.log(`Successfully extracted Twitch ${contentType} metadata`, "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract Twitch video metadata: ${error}`, "error");
      return null;
    }
  }
  extractVodFromGql(gqlData, url, metadata) {
    const videoId = this.extractVideoId(url);
    if (videoId) {
      metadata.video_id = videoId;
    }
    const videoMetadata = gqlData.get("VideoMetadata");
    if (videoMetadata?.video) {
      const video = videoMetadata.video;
      if (video.id) metadata.video_id = video.id;
      if (video.title) metadata.title = video.title;
      if (video.description !== void 0 && video.description !== null) metadata.description = video.description;
      if (video.createdAt) metadata.created_at = video.createdAt;
      if (video.publishedAt) metadata.published_at = video.publishedAt;
      if (video.viewCount !== void 0) metadata.view_count = video.viewCount;
      if (video.lengthSeconds !== void 0) metadata.duration = video.lengthSeconds;
      if (video.language) metadata.language = video.language;
      if (video.previewThumbnailURL) metadata.thumbnail_url = video.previewThumbnailURL;
      if (video.owner) {
        if (video.owner.id) metadata.user_id = video.owner.id;
        if (video.owner.login) metadata.user_login = video.owner.login;
        if (video.owner.displayName) metadata.user_name = video.owner.displayName;
      }
      if (video.game?.id) metadata.game_id = video.game.id;
      if (video.game?.name) metadata.game_name = video.game.name;
    }
    const nielsenData = gqlData.get("NielsenContentMetadata");
    if (nielsenData?.video) {
      const video = nielsenData.video;
      if (!metadata.video_id && video.id) metadata.video_id = video.id;
      if (!metadata.title && video.title) metadata.title = video.title;
      if (!metadata.created_at && video.createdAt) metadata.created_at = video.createdAt;
      if (!metadata.published_at && video.createdAt) metadata.published_at = video.createdAt;
      if (!metadata.game_id && video.game?.id) metadata.game_id = video.game.id;
      if (!metadata.game_name && video.game?.displayName) metadata.game_name = video.game.displayName;
      if (video.owner) {
        if (!metadata.user_id && video.owner.id) metadata.user_id = video.owner.id;
        if (!metadata.user_login && video.owner.login) metadata.user_login = video.owner.login;
      }
    }
    const adData = gqlData.get("AdRequestHandling");
    if (adData?.video) {
      if (!metadata.video_id && adData.video.id) metadata.video_id = adData.video.id;
      if (!metadata.title && adData.video.title) metadata.title = adData.video.title;
      if (adData.video.lengthSeconds !== void 0 && metadata.duration === void 0) {
        metadata.duration = adData.video.lengthSeconds;
      }
      if (adData.video.owner) {
        if (!metadata.user_id && adData.video.owner.id) metadata.user_id = adData.video.owner.id;
        if (!metadata.user_login && adData.video.owner.login) metadata.user_login = adData.video.owner.login;
        if (!metadata.user_name && adData.video.owner.displayName) metadata.user_name = adData.video.owner.displayName;
      }
      if (adData.video.game) {
        if (!metadata.game_id && adData.video.game.id) metadata.game_id = adData.video.game.id;
        if (!metadata.game_name && adData.video.game.name) metadata.game_name = adData.video.game.name;
      }
      if (adData.video.owner?.broadcastSettings?.isMature !== void 0) {
        metadata.is_mature = adData.video.owner.broadcastSettings.isMature;
      }
      if (adData.video.broadcastType) {
        metadata.vod_type = adData.video.broadcastType;
      }
    }
    const channelVideo = gqlData.get("ChannelVideoCore");
    if (channelVideo?.video?.owner) {
      if (!metadata.user_id && channelVideo.video.owner.id) metadata.user_id = channelVideo.video.owner.id;
      if (!metadata.user_login && channelVideo.video.owner.login) metadata.user_login = channelVideo.video.owner.login;
      if (!metadata.user_name && channelVideo.video.owner.displayName) metadata.user_name = channelVideo.video.owner.displayName;
    }
    const seekbarPreviewData = gqlData.get("VideoPlayer_VODSeekbarPreviewVideo");
    if (seekbarPreviewData?.video?.seekPreviewsURL) {
      const seekUrl = seekbarPreviewData.video.seekPreviewsURL;
      const broadcastMatch = seekUrl.match(/_(\d{12,})_\d+\/storyboards/);
      if (broadcastMatch) {
        metadata.stream_id = broadcastMatch[1];
      }
    }
    const mutedData = gqlData.get("VideoPlayer_MutedSegmentsAlertOverlay");
    if (mutedData?.video?.muteInfo?.mutedSegmentConnection?.nodes) {
      const nodes = mutedData.video.muteInfo.mutedSegmentConnection.nodes;
      if (nodes.length > 0) {
        metadata.muted_segments = nodes.map((n) => ({
          offset: n.offset,
          duration: n.duration
        }));
      }
    }
    const seekbarData = gqlData.get("VideoPlayer_VODSeekbar");
    if (!metadata.muted_segments && seekbarData?.video?.muteInfo?.mutedSegmentConnection?.nodes) {
      const nodes = seekbarData.video.muteInfo.mutedSegmentConnection.nodes;
      if (nodes.length > 0) {
        metadata.muted_segments = nodes.map((n) => ({
          offset: n.offset,
          duration: n.duration
        }));
      }
    }
    const policyData = gqlData.get("ContentPolicyPropertiesQuery");
    if (policyData?.video?.contentPolicyProperties?.hasBrandedContent !== void 0) {
      metadata.is_branded_content = policyData.video.contentPolicyProperties.hasBrandedContent;
    }
    const classificationData = gqlData.get("ContentClassificationContext");
    if (classificationData?.video?.contentClassificationLabels) {
      const labels = classificationData.video.contentClassificationLabels;
      if (labels.length > 0) {
        metadata.content_classification_labels = labels;
      }
    }
    const watchData = gqlData.get("WatchTrackQuery");
    if (watchData?.video) {
      if (!metadata.vod_type && watchData.video.broadcastType) {
        metadata.vod_type = watchData.video.broadcastType;
      }
      if (metadata.view_count === void 0 && watchData.video.viewCount !== void 0) {
        metadata.view_count = watchData.video.viewCount;
      }
    }
    const playerTracking = gqlData.get("PlayerTrackingContextQuery");
    if (playerTracking?.video) {
      if (!metadata.vod_type && playerTracking.video.broadcastType) {
        metadata.vod_type = playerTracking.video.broadcastType;
      }
      if (metadata.view_count === void 0 && playerTracking.video.viewCount !== void 0) {
        metadata.view_count = playerTracking.video.viewCount;
      }
    }
  }
  async extractClipFromGql(gqlData, page, url, metadata) {
    const clipSlug = this.extractClipSlug(url);
    if (clipSlug) {
      metadata.video_id = clipSlug;
      metadata.embed_url = `https://clips.twitch.tv/embed?clip=${clipSlug}`;
    }
    const chatClip = gqlData.get("ChatClip");
    if (chatClip?.clip) {
      const clip = chatClip.clip;
      if (clip.videoOffsetSeconds !== void 0) metadata.vod_offset = clip.videoOffsetSeconds;
      if (clip.video?.id) metadata.source_video_id = clip.video.id;
    }
    const clipCore = gqlData.get("ChannelClipCore");
    if (clipCore?.clip) {
      const clip = clipCore.clip;
      if (clip.isFeatured !== void 0) metadata.is_featured = clip.isFeatured;
      if (clip.videoOffsetSeconds !== void 0 && metadata.vod_offset === void 0) {
        metadata.vod_offset = clip.videoOffsetSeconds;
      }
      if (clip.broadcaster) {
        if (!metadata.user_id && clip.broadcaster.id) metadata.user_id = clip.broadcaster.id;
        if (!metadata.user_login && clip.broadcaster.login) metadata.user_login = clip.broadcaster.login;
        if (!metadata.user_name && clip.broadcaster.displayName) metadata.user_name = clip.broadcaster.displayName;
      }
    }
    const feedClip = gqlData.get("FeedInteractionHook_GetClipBySlug");
    if (feedClip?.clip) {
      const clip = feedClip.clip;
      if (clip.id) metadata.video_id = clip.id;
      if (clip.slug) metadata.video_id = clip.slug;
      if (clip.title) metadata.title = clip.title;
      if (clip.viewCount !== void 0) metadata.view_count = clip.viewCount;
      if (clip.createdAt) metadata.created_at = clip.createdAt;
      if (clip.durationSeconds !== void 0) metadata.duration = clip.durationSeconds;
      if (clip.language) metadata.language = clip.language;
      if (clip.thumbnailURL) metadata.thumbnail_url = clip.thumbnailURL;
      if (clip.broadcaster) {
        if (!metadata.user_id && clip.broadcaster.id) metadata.user_id = clip.broadcaster.id;
        if (!metadata.user_login && clip.broadcaster.login) metadata.user_login = clip.broadcaster.login;
        if (!metadata.user_name && clip.broadcaster.displayName) metadata.user_name = clip.broadcaster.displayName;
      }
      if (clip.game?.id) metadata.game_id = clip.game.id;
      if (clip.game?.name) metadata.game_name = clip.game.name;
    }
    const trackingData = gqlData.get("PlayerTrackingContextQuery");
    if (trackingData?.clip) {
      const clip = trackingData.clip;
      if (!metadata.game_id && clip.game?.id) metadata.game_id = clip.game.id;
      if (!metadata.game_name && clip.game?.name) metadata.game_name = clip.game.name;
    }
    const classificationData = gqlData.get("ContentClassificationContext");
    if (classificationData?.clip?.contentClassificationLabels) {
      const labels = classificationData.clip.contentClassificationLabels;
      if (labels.length > 0) {
        metadata.content_classification_labels = labels.map(
          (l) => l.localizedName || l.id || l
        );
      }
    }
    const shelvesData = gqlData.get("ChannelVideoShelvesQuery");
    if (shelvesData?.user?.videoShelves?.edges) {
      for (const edge of shelvesData.user.videoShelves.edges) {
        if (edge?.node?.items) {
          for (const item of edge.node.items) {
            if (item.slug === clipSlug || item.id === clipSlug) {
              if (metadata.is_featured === void 0 && item.isFeatured !== void 0) {
                metadata.is_featured = item.isFeatured;
              }
              if (!metadata.clip_creator_id && item.curator?.id) {
                metadata.clip_creator_id = item.curator.id;
              }
            }
          }
        }
      }
    }
    if (!metadata.clip_creator_id) {
      const clipData = await page.evaluate(() => {
        const scripts = document.querySelectorAll("script");
        for (const script of scripts) {
          const content = script.textContent || "";
          const curatorMatch = content.match(/"curator"\s*:\s*\{[^}]*"id"\s*:\s*"(\d+)"/);
          if (curatorMatch) {
            return { clip_creator_id: curatorMatch[1] };
          }
        }
        return {};
      });
      if (clipData.clip_creator_id) metadata.clip_creator_id = clipData.clip_creator_id;
    }
  }
  async extractStreamFromGql(gqlData, page, metadata) {
    const watchData = gqlData.get("WatchTrackQuery");
    if (watchData?.user?.lastBroadcast?.game) {
      const game = watchData.user.lastBroadcast.game;
      if (game.id) metadata.game_id = game.id;
      if (game.name) metadata.game_name = game.name;
    }
    const adData = gqlData.get("AdRequestHandling");
    if (adData?.video?.owner?.broadcastSettings?.isMature !== void 0) {
      metadata.is_mature = adData.video.owner.broadcastSettings.isMature;
    }
    const channelShell = gqlData.get("ChannelShell");
    if (channelShell?.userOrError?.broadcastSettings?.isMature !== void 0) {
      metadata.is_mature = channelShell.userOrError.broadcastSettings.isMature;
    }
    const videoMetadata = gqlData.get("VideoMetadata");
    if (videoMetadata?.user?.broadcastSettings?.isMature !== void 0 && metadata.is_mature === void 0) {
      metadata.is_mature = videoMetadata.user.broadcastSettings.isMature;
    }
    const useViewCount = gqlData.get("UseViewCount");
    if (useViewCount?.user) {
      if (useViewCount.user.id) metadata.user_id = useViewCount.user.id;
      if (useViewCount.user.login) metadata.user_login = useViewCount.user.login;
      if (useViewCount.user.stream) {
        if (useViewCount.user.stream.id) metadata.video_id = useViewCount.user.stream.id;
        if (useViewCount.user.stream.viewersCount !== void 0) metadata.viewer_count = useViewCount.user.stream.viewersCount;
        if (useViewCount.user.stream.game) {
          if (!metadata.game_id && useViewCount.user.stream.game.id) metadata.game_id = useViewCount.user.stream.game.id;
          if (!metadata.game_name && useViewCount.user.stream.game.name) metadata.game_name = useViewCount.user.stream.game.name;
        }
      }
    }
    if (videoMetadata?.user) {
      if (!metadata.user_id && videoMetadata.user.id) metadata.user_id = videoMetadata.user.id;
      if (!metadata.user_login && videoMetadata.user.login) metadata.user_login = videoMetadata.user.login;
      if (videoMetadata.user.stream) {
        if (!metadata.video_id && videoMetadata.user.stream.id) metadata.video_id = videoMetadata.user.stream.id;
        if (metadata.viewer_count === void 0 && videoMetadata.user.stream.viewersCount !== void 0) {
          metadata.viewer_count = videoMetadata.user.stream.viewersCount;
        }
      }
      if (videoMetadata.user.lastBroadcast) {
        if (videoMetadata.user.lastBroadcast.startedAt) metadata.started_at = videoMetadata.user.lastBroadcast.startedAt;
      }
    }
    if (channelShell?.userOrError) {
      if (!metadata.user_id && channelShell.userOrError.id) metadata.user_id = channelShell.userOrError.id;
      if (!metadata.user_login && channelShell.userOrError.login) metadata.user_login = channelShell.userOrError.login;
      if (!metadata.user_name && channelShell.userOrError.displayName) metadata.user_name = channelShell.userOrError.displayName;
      if (channelShell.userOrError.broadcastSettings?.title) metadata.title = channelShell.userOrError.broadcastSettings.title;
    }
    const streamMetadata = gqlData.get("StreamMetadata");
    if (streamMetadata?.user) {
      const user = streamMetadata.user;
      if (user.broadcastSettings?.isMature !== void 0) {
        metadata.is_mature = user.broadcastSettings.isMature;
      }
      if (user.stream?.game) {
        if (!metadata.game_id && user.stream.game.id) metadata.game_id = user.stream.game.id;
        if (!metadata.game_name && user.stream.game.name) metadata.game_name = user.stream.game.name;
      }
    }
    const ffzData = gqlData.get("FFZ_StreamTagList");
    if (ffzData?.user?.stream?.game) {
      const game = ffzData.user.stream.game;
      if (!metadata.game_id && game.id) metadata.game_id = game.id;
      if (!metadata.game_name && game.name) metadata.game_name = game.name;
    }
    const tags = await page.evaluate(() => {
      const tagElements = [];
      const tagLinks = document.querySelectorAll('a[href*="/directory/tags/"]');
      for (const link of tagLinks) {
        const text = link.textContent?.trim();
        const href = link.getAttribute("href") || "";
        const urlMatch = href.match(/\/tags\/([^\/\?]+)/);
        if (urlMatch) {
          const tagName = decodeURIComponent(urlMatch[1].replace(/-/g, " "));
          if (tagName && tagName.length > 0 && tagName.length < 100) {
            tagElements.push(tagName);
          }
        } else if (text && text.length > 0 && text.length < 100 && !text.toLowerCase().includes("tag")) {
          tagElements.push(text);
        }
      }
      const tagElementsWithData = document.querySelectorAll('[data-a-target*="tag"], [data-test-selector*="tag"]');
      for (const elem of tagElementsWithData) {
        const text = elem.textContent?.trim();
        if (text && text.length > 0 && text.length < 100) {
          tagElements.push(text);
        }
      }
      const streamInfo = document.querySelector('[data-a-target="stream-info"], .stream-info, [class*="StreamInfo"]');
      if (streamInfo) {
        const infoTags = streamInfo.querySelectorAll('a, button, span[class*="tag"], div[class*="tag"]');
        for (const tag of infoTags) {
          const text = tag.textContent?.trim();
          if (text && text.length > 0 && text.length < 100 && !text.toLowerCase().includes("tag")) {
            tagElements.push(text);
          }
        }
      }
      const scripts = document.querySelectorAll("script");
      for (const script of scripts) {
        const content = script.textContent || "";
        const patterns = [
          /"tags"\s*:\s*\[(.*?)\]/,
          /"streamTags"\s*:\s*\[(.*?)\]/,
          /tags:\s*\[(.*?)\]/
        ];
        for (const pattern of patterns) {
          const match = content.match(pattern);
          if (match) {
            try {
              const jsonStr = `[${match[1]}]`;
              const tagArray = JSON.parse(jsonStr);
              for (const tag of tagArray) {
                if (typeof tag === "string" && tag.length > 0) {
                  tagElements.push(tag);
                } else if (tag?.name && typeof tag.name === "string") {
                  tagElements.push(tag.name);
                } else if (tag?.localizedName && typeof tag.localizedName === "string") {
                  tagElements.push(tag.localizedName);
                }
              }
            } catch (e) {
              const stringMatches = match[1].match(/"([^"]+)"/g);
              if (stringMatches) {
                for (const strMatch of stringMatches) {
                  const tag = strMatch.replace(/"/g, "");
                  if (tag.length > 0 && tag.length < 100) {
                    tagElements.push(tag);
                  }
                }
              }
            }
          }
        }
      }
      const filtered = [...new Set(tagElements)].filter((tag) => {
        const lower = tag.toLowerCase();
        return tag.length > 0 && tag.length < 100 && !lower.includes("tag") && !lower.includes("tags") && !lower.includes("viewer") && !lower.includes("follow");
      });
      return filtered;
    });
    if (tags && tags.length > 0) {
      metadata.tags = tags;
    }
  }
  extractChannelFromGql(gqlData, metadata) {
    const classificationData = gqlData.get("ContentClassificationContext");
    if (classificationData?.video?.contentClassificationLabels && !metadata.content_classification_labels) {
      const labels = classificationData.video.contentClassificationLabels;
      if (labels.length > 0) {
        metadata.content_classification_labels = labels;
      }
    }
    const policyData = gqlData.get("ContentPolicyPropertiesQuery");
    if (policyData?.video?.contentPolicyProperties?.hasBrandedContent !== void 0 && metadata.is_branded_content === void 0) {
      metadata.is_branded_content = policyData.video.contentPolicyProperties.hasBrandedContent;
    }
  }
  async extractMetadata(page, videoUrl) {
    try {
      this.logger.log("Extracting Twitch creator metadata...", "info");
      let profileUrl = await this.getCreatorProfileUrl(videoUrl);
      if (!profileUrl) {
        await page.goto(videoUrl, { waitUntil: "domcontentloaded" });
        await this.delay(3e3);
        const link = await this.getElementAttribute(page, 'a[href*="/"]', "href");
        if (link && link.includes("twitch.tv/") && !link.includes("/videos/")) {
          profileUrl = link.startsWith("http") ? link : `https://www.twitch.tv${link}`;
        }
      }
      if (!profileUrl) {
        this.logger.log("Could not find Twitch profile URL", "warn");
        return null;
      }
      await page.goto(profileUrl, { waitUntil: "domcontentloaded" });
      await this.delay(3e3);
      const metadata = {
        platform: "twitch",
        url: profileUrl,
        extractedAt: Date.now()
      };
      const usernameMatch = profileUrl.match(/twitch\.tv\/([^\/\?]+)/);
      if (usernameMatch) {
        metadata.creator_username = usernameMatch[1];
      }
      const nameSelectors = [
        'h2[data-a-target="user-channel-header-item"]',
        "h2",
        '[data-a-target="user-display-name"]'
      ];
      for (const selector of nameSelectors) {
        const name = await this.getElementText(page, selector);
        if (name && name.length > 0) {
          metadata.creator_name = this.cleanText(name);
          break;
        }
      }
      const bioSelectors = [
        '[data-a-target="user-channel-description"]',
        ".channel-info-content",
        '[data-a-target="user-channel-description-text"]'
      ];
      for (const selector of bioSelectors) {
        const bio = await this.getElementText(page, selector);
        if (bio && bio.length > 5) {
          metadata.creator_bio = this.cleanText(bio);
          break;
        }
      }
      const followerSelectors = [
        '[data-a-target="follow-count"]',
        'a[href*="/followers"]',
        '[data-a-target="user-channel-header-item"]'
      ];
      for (const selector of followerSelectors) {
        const followerText = await this.getElementText(page, selector);
        if (followerText && (followerText.includes("followers") || followerText.includes("Follower"))) {
          metadata.creator_follower_count = this.parseCount(followerText);
          break;
        }
      }
      const avatarSelectors = [
        'img[alt*="avatar"]',
        '[data-a-target="user-avatar"] img',
        'img[src*="static-cdn.jtvnw.net"]'
      ];
      for (const selector of avatarSelectors) {
        const avatar = await this.getElementAttribute(page, selector, "src");
        if (avatar && avatar.includes("static-cdn.jtvnw.net")) {
          metadata.creator_avatar_url = avatar;
          break;
        }
      }
      const verifiedSelectors = [
        '[data-a-target="verified-badge"]',
        '[aria-label*="Verified"]',
        ".verified-badge"
      ];
      for (const selector of verifiedSelectors) {
        const verified = await page.locator(selector).first();
        if (await verified.isVisible({ timeout: 2e3 }).catch(() => false)) {
          metadata.creator_verified = true;
          break;
        }
      }
      this.logger.log("Successfully extracted Twitch creator metadata", "info");
      return metadata;
    } catch (error) {
      this.logger.log(`Failed to extract Twitch metadata: ${error}`, "error");
      return null;
    }
  }
};

// src/scrapers/HybridScraper.ts
var HybridScraper = class extends CreatorMetadataScraper {
  apiScraper;
  localScraper;
  logAgent;
  constructor(apiScraper, localScraper, logger) {
    super(logger, {});
    this.apiScraper = apiScraper;
    this.localScraper = localScraper;
    this.logAgent = logger.agent("HybridScraper");
  }
  async extractMetadata(page, videoUrl) {
    if (this.apiScraper) {
      try {
        this.logAgent.log(`Attempting API scraper for ${videoUrl}`, "info");
        const metadata = await this.apiScraper.extractMetadata(page, videoUrl);
        if (metadata) {
          this.logAgent.log(`API scraper succeeded for ${videoUrl}`, "info");
          return metadata;
        }
        this.logAgent.log(`API scraper returned no metadata, falling back to local scraper`, "warn");
      } catch (error) {
        this.logAgent.log(`API scraper failed: ${error instanceof Error ? error.message : String(error)}, falling back to local scraper`, "warn");
      }
    } else {
      this.logAgent.log(`API scraper not available, using local scraper only`, "info");
    }
    try {
      this.logAgent.log(`Using local scraper for ${videoUrl}`, "info");
      const metadata = await this.localScraper.extractMetadata(page, videoUrl);
      if (metadata) {
        this.logAgent.log(`Local scraper succeeded for ${videoUrl}`, "info");
      } else {
        this.logAgent.log(`Local scraper returned no metadata for ${videoUrl}`, "warn");
      }
      return metadata;
    } catch (error) {
      this.logAgent.log(`Local scraper failed: ${error instanceof Error ? error.message : String(error)}`, "error");
      return null;
    }
  }
  async extractVideoMetadata(page, videoUrl) {
    if (this.apiScraper) {
      try {
        this.logAgent.log(`Attempting API scraper for video metadata: ${videoUrl}`, "info");
        const metadata = await this.apiScraper.extractVideoMetadata(page, videoUrl);
        if (metadata) {
          this.logAgent.log(`API scraper succeeded for video metadata: ${videoUrl}`, "info");
          return metadata;
        }
        this.logAgent.log(`API scraper returned no video metadata, falling back to local scraper`, "warn");
      } catch (error) {
        this.logAgent.log(`API scraper failed for video metadata: ${error instanceof Error ? error.message : String(error)}, falling back to local scraper`, "warn");
      }
    }
    try {
      this.logAgent.log(`Using local scraper for video metadata: ${videoUrl}`, "info");
      const metadata = await this.localScraper.extractVideoMetadata(page, videoUrl);
      if (metadata) {
        this.logAgent.log(`Local scraper succeeded for video metadata: ${videoUrl}`, "info");
      }
      return metadata;
    } catch (error) {
      this.logAgent.log(`Local scraper failed for video metadata: ${error instanceof Error ? error.message : String(error)}`, "error");
      return null;
    }
  }
  async getCreatorProfileUrl(videoUrl) {
    if (this.apiScraper) {
      try {
        const url = await this.apiScraper.getCreatorProfileUrl(videoUrl);
        if (url) return url;
      } catch (error) {
        this.logAgent.log(`API scraper failed to get creator profile URL: ${error instanceof Error ? error.message : String(error)}`, "debug");
      }
    }
    try {
      return await this.localScraper.getCreatorProfileUrl(videoUrl);
    } catch (error) {
      this.logAgent.log(`Local scraper failed to get creator profile URL: ${error instanceof Error ? error.message : String(error)}`, "error");
      return null;
    }
  }
};

// src/scrapers/ApiScraperAdapter.ts
var ApiScraperAdapter = class extends CreatorMetadataScraper {
  apiConfig;
  constructor(logger, config = {}) {
    super(logger, config);
    this.apiConfig = {
      baseUrl: config.apiConfig?.baseUrl || process.env.ML_API_BASE_URL || "https://ondemand-scraper-api.media-meter.in",
      timeout: config.apiConfig?.timeout || 3e4,
      retries: config.apiConfig?.retries || 3,
      enabled: config.apiConfig?.enabled !== false,
      pollInterval: 2e3,
      maxPollAttempts: 30,
      resultsPath: config.apiConfig?.resultsPath
    };
    if (!this.apiConfig.baseUrl) {
      this.logger.log("API base URL not configured. API scrapers will not work.", "warn");
    }
  }
  async extractMetadata(page, videoUrl) {
    if (!this.apiConfig.enabled || !this.apiConfig.baseUrl) {
      this.logger.log("API scraper is disabled or not configured", "warn");
      return null;
    }
    return this.extractMetadataFromApi(videoUrl);
  }
  async extractVideoMetadata(page, videoUrl) {
    if (!this.apiConfig.enabled || !this.apiConfig.baseUrl) {
      return null;
    }
    return this.extractVideoMetadataFromApi(videoUrl);
  }
  async extractVideoMetadataFromApi(url) {
    return null;
  }
  async makeApiRequest(endpoint, payload, options) {
    const logAgent = this.logger;
    let url = `${this.apiConfig.baseUrl}${endpoint}`;
    if (options?.queryParams && Object.keys(options.queryParams).length > 0) {
      const search = new URLSearchParams(options.queryParams).toString();
      url += (url.includes("?") ? "&" : "?") + search;
    }
    const method = options?.method ?? "POST";
    const headers = {
      "Content-Type": "application/json"
    };
    let lastError = null;
    const maxRetries = this.apiConfig.retries;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logAgent.log(`API request attempt ${attempt}/${maxRetries} to ${endpoint}`, "debug");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.apiConfig.timeout);
        const fetchOptions = {
          method,
          headers,
          signal: controller.signal
        };
        if (method === "POST" && payload != null) {
          fetchOptions.body = JSON.stringify(payload);
        }
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);
        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        logAgent.log(`API request successful to ${endpoint}`, "debug");
        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (error instanceof Error && error.name === "AbortError") {
          logAgent.log(`API request timeout after ${this.apiConfig.timeout}ms`, "warn");
        } else {
          logAgent.log(`API request failed (attempt ${attempt}/${maxRetries}): ${lastError.message}`, "warn");
        }
        if (attempt < maxRetries) {
          const delay = Math.min(1e3 * Math.pow(2, attempt - 1), 1e4);
          logAgent.log(`Retrying in ${delay}ms...`, "debug");
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    logAgent.log(`All API request attempts failed: ${lastError?.message}`, "error");
    throw lastError || new Error("API request failed after all retries");
  }
  /**
   * Override to extract platform-specific video id from URL. Default returns null.
   */
  getVideoIdFromUrl(_url) {
    return null;
  }
  /**
   * Normalize MLDC API payload (title, content, authors, engagements, reach_metrics, etc.)
   * to creator shape (creator_name, creator_username, creator_follower_count, etc.).
   */
  normalizeApiPayloadToCreatorShape(payload) {
    const out = { ...payload };
    const authors = payload.authors;
    if (typeof authors === "string" && authors.trim()) {
      out.creator_username = authors.trim();
      if (out.creator_name == null) out.creator_name = authors.trim();
    } else if (Array.isArray(authors) && authors.length > 0) {
      const first = authors[0];
      if (typeof first === "string" && first.trim()) {
        out.creator_username = first.trim();
        if (out.creator_name == null) out.creator_name = first.trim();
      } else if (first && typeof first === "object") {
        const author = first;
        if (author.name != null) out.creator_name = String(author.name);
        if (author.username != null) out.creator_username = String(author.username);
        if (author.display_name != null && out.creator_name == null) out.creator_name = String(author.display_name);
        if (author.title != null && out.creator_name == null) out.creator_name = String(author.title);
        if (author.channel_name != null && out.creator_name == null) out.creator_name = String(author.channel_name);
        if (author.channel_title != null && out.creator_name == null) out.creator_name = String(author.channel_title);
        if (author.handle != null && out.creator_username == null) out.creator_username = String(author.handle);
        if (author.avatar_url != null) out.creator_avatar_url = String(author.avatar_url);
        if (author.profile_url != null) out.creator_profile_deep_link = String(author.profile_url);
        if (author.follower_count != null) out.creator_follower_count = Number(author.follower_count);
        if (author.subscriber_count != null) out.creator_follower_count = Number(author.subscriber_count);
        if (author.subscribers != null && out.creator_follower_count == null) out.creator_follower_count = Number(author.subscribers);
        if (author.id != null) out.creator_id = String(author.id);
      }
    }
    const organicTraffic = payload.organic_traffic;
    if (organicTraffic != null && typeof organicTraffic === "object") {
      const ot = organicTraffic;
      if (ot.followers != null && out.creator_follower_count == null) out.creator_follower_count = Number(ot.followers);
    }
    const reachMetrics = payload.reach_metrics;
    if (reachMetrics != null && typeof reachMetrics === "object") {
      const rm = reachMetrics;
      if (out.creator_follower_count == null && rm.subscribers_count != null) out.creator_follower_count = Number(rm.subscribers_count);
      if (out.creator_follower_count == null && rm.followers_count != null) out.creator_follower_count = Number(rm.followers_count);
    }
    if (payload.title != null && out.creator_name == null && typeof payload.authors === "undefined") out.creator_name = String(payload.title);
    return out;
  }
  /**
   * Normalize MLDC API payload to video shape (caption, description, timestamp, thumbnails,
   * like_count, comment_count, view_count, etc.). video_id from getVideoIdFromUrl(url).
   */
  normalizeApiPayloadToVideoShape(payload, url) {
    const out = { ...payload };
    const videoId = this.getVideoIdFromUrl(url);
    if (videoId) out.video_id = videoId;
    if (payload.title != null) out.caption = String(payload.title);
    if (payload.content != null && typeof payload.content === "string") {
      out.description = payload.content;
      if (out.caption == null || out.caption.length === 0) out.caption = payload.content;
    }
    const publishDate = payload.publish_date;
    if (publishDate != null) {
      if (typeof publishDate === "number") out.timestamp = publishDate;
      else if (typeof publishDate === "string") {
        const parsed = Date.parse(publishDate);
        if (!Number.isNaN(parsed)) out.timestamp = Math.floor(parsed / 1e3);
      }
    }
    const attachments = payload.attachments;
    if (attachments != null && typeof attachments === "object") {
      const photos = attachments.photos;
      if (Array.isArray(photos) && photos.length > 0) {
        const urls = photos.filter((p) => typeof p === "string");
        if (urls.length > 0) out.thumbnails = urls;
      } else if (Array.isArray(attachments) && attachments.length > 0) {
        const urls = [];
        for (const a of attachments) {
          if (typeof a === "string") urls.push(a);
          else if (a != null && typeof a === "object") {
            const o = a;
            if (typeof o.url === "string") urls.push(o.url);
            else if (typeof o.thumbnail_url === "string") urls.push(o.thumbnail_url);
            else if (typeof o.thumbnail === "string") urls.push(o.thumbnail);
          }
        }
        if (urls.length > 0) out.thumbnails = urls;
      }
    }
    const engagements = payload.engagements;
    if (engagements != null && typeof engagements === "object") {
      const eng = engagements;
      if (eng.likes != null) out.like_count = Number(eng.likes);
      if (eng.like_count != null) out.like_count = Number(eng.like_count);
      if (eng.likes_count != null) out.like_count = Number(eng.likes_count);
      if (eng.comments != null) out.comment_count = Number(eng.comments);
      if (eng.comment_count != null) out.comment_count = Number(eng.comment_count);
      if (eng.comments_count != null) out.comment_count = Number(eng.comments_count);
      if (eng.views != null) out.view_count = Number(eng.views);
      if (eng.view_count != null) out.view_count = Number(eng.view_count);
      if (eng.views_count != null) out.view_count = Number(eng.views_count);
      if (eng.shares != null) out.share_count = Number(eng.shares);
      if (eng.shares_count != null) out.share_count = Number(eng.shares_count);
    }
    const reachMetrics = payload.reach_metrics;
    if (reachMetrics != null && typeof reachMetrics === "object") {
      const rm = reachMetrics;
      if (rm.views != null && out.view_count == null) out.view_count = Number(rm.views);
      if (rm.view_count != null && out.view_count == null) out.view_count = Number(rm.view_count);
      if (rm.views_count != null && out.view_count == null) out.view_count = Number(rm.views_count);
      if (rm.impressions != null && out.view_count == null) out.view_count = Number(rm.impressions);
    }
    if (typeof payload.comments === "number") out.comment_count = payload.comment_count;
    if (Array.isArray(payload.comments) && out.comment_count == null) out.comment_count = payload.comments.length;
    const virality = payload.virality;
    if (virality != null && typeof virality === "object") {
      const v = virality;
      if (v.views != null && out.view_count == null) out.view_count = Number(v.views);
      if (v.view_count != null && out.view_count == null) out.view_count = Number(v.view_count);
    }
    if (out.isShort === void 0 && url.includes("/shorts/")) out.isShort = true;
    return out;
  }
  async scrapeAndPoll(url) {
    const logAgent = this.logger;
    try {
      logAgent.log(`Initiating scrape for: ${url}`, "info");
      const scrapePayload = {
        urls: [url]
      };
      const scrapeResponse = await this.makeApiRequest("/v1/social-media/scrape", scrapePayload);
      if (!scrapeResponse || !scrapeResponse.job_id) {
        logAgent.log("Scrape response missing job_id", "warn");
        return null;
      }
      const jobId = scrapeResponse.job_id;
      logAgent.log(`Scrape job initiated with job_id: ${jobId}`, "info");
      const resultsPathBase = this.apiConfig.resultsPath ?? "/v1/social-media/results";
      const resultsPath = resultsPathBase.includes("{job_id}") ? resultsPathBase.replace(/\{job_id\}/g, jobId) : `${resultsPathBase}/${jobId}`;
      const resultsUrl = `${this.apiConfig.baseUrl}${resultsPath}`;
      logAgent.log(`Results endpoint: GET ${resultsUrl}`, "debug");
      for (let attempt = 1; attempt <= this.apiConfig.maxPollAttempts; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, this.apiConfig.pollInterval));
        logAgent.log(`Polling results (attempt ${attempt}/${this.apiConfig.maxPollAttempts}) for job_id: ${jobId}`, "debug");
        try {
          const resultsResponse = await this.makeApiRequest(resultsPath, null, {
            method: "GET"
          });
          if (attempt === 1 && resultsResponse) {
            const keys = Object.keys(resultsResponse);
            const preview = keys.length ? JSON.stringify(keys) : "empty";
            logAgent.log(`Results response keys (first poll): ${preview}, status=${resultsResponse.status}`, "debug");
          }
          if (resultsResponse && resultsResponse.status === "failed") {
            logAgent.log(`Job failed: ${resultsResponse.error || "Unknown error"}`, "error");
            return null;
          }
          const hasResults = resultsResponse && "results" in resultsResponse && resultsResponse.results != null;
          const resultsPayload = hasResults ? resultsResponse.results : null;
          const hasData = Array.isArray(resultsPayload) ? resultsPayload.length > 0 : typeof resultsPayload === "object" && resultsPayload !== null && Object.keys(resultsPayload).length > 0;
          if (hasResults && hasData) {
            logAgent.log(`Results ready for job_id: ${jobId}`, "info");
            return Array.isArray(resultsPayload) ? resultsPayload[0] : resultsPayload;
          }
          if (resultsResponse && resultsResponse.status === "completed" && resultsResponse.data) {
            logAgent.log(`Results ready for job_id: ${jobId} (data field)`, "info");
            return resultsResponse.data;
          }
          if (resultsResponse && resultsResponse.status === "processing") {
            logAgent.log(`Job still processing (attempt ${attempt}/${this.apiConfig.maxPollAttempts})`, "debug");
            continue;
          }
          if (resultsResponse && attempt === 1) {
            logAgent.log(`Results not ready: status=${resultsResponse.status}, hasResults=${hasResults}, hasData=${hasData}`, "debug");
          }
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : String(error);
          logAgent.log(`Error polling results: ${errMsg}`, "warn");
          if (errMsg.includes("status 404")) {
            logAgent.log(`Results endpoint returned 404 Not Found. Check apiConfig.resultsPath or ask API provider for the correct URL (e.g. GET ${resultsUrl})`, "error");
            return null;
          }
          if (attempt < this.apiConfig.maxPollAttempts) {
            continue;
          }
        }
      }
      logAgent.log(`Max polling attempts reached for job_id: ${jobId}`, "warn");
      return null;
    } catch (error) {
      logAgent.log(`Failed to scrape and poll: ${error instanceof Error ? error.message : String(error)}`, "error");
      return null;
    }
  }
  mapApiResponseToCreatorMetadata(apiResponse, url, platform) {
    const metadata = {
      platform,
      url,
      extractedAt: Date.now()
    };
    if (apiResponse.creator_id) metadata.creator_id = String(apiResponse.creator_id);
    if (apiResponse.creator_name) metadata.creator_name = apiResponse.creator_name;
    if (apiResponse.creator_username) metadata.creator_username = apiResponse.creator_username;
    if (apiResponse.creator_avatar_url) metadata.creator_avatar_url = apiResponse.creator_avatar_url;
    if (apiResponse.creator_avatar_url_100) metadata.creator_avatar_url_100 = apiResponse.creator_avatar_url_100;
    if (apiResponse.creator_avatar_large_url) metadata.creator_avatar_large_url = apiResponse.creator_avatar_large_url;
    if (apiResponse.creator_bio) metadata.creator_bio = apiResponse.creator_bio;
    if (apiResponse.creator_follower_count !== void 0) metadata.creator_follower_count = Number(apiResponse.creator_follower_count);
    if (apiResponse.creator_following_count !== void 0) metadata.creator_following_count = Number(apiResponse.creator_following_count);
    if (apiResponse.creator_likes_count !== void 0) metadata.creator_likes_count = Number(apiResponse.creator_likes_count);
    if (apiResponse.creator_video_count !== void 0) metadata.creator_video_count = Number(apiResponse.creator_video_count);
    if (apiResponse.creator_open_id) metadata.creator_open_id = apiResponse.creator_open_id;
    if (apiResponse.creator_union_id) metadata.creator_union_id = apiResponse.creator_union_id;
    if (apiResponse.creator_profile_deep_link) metadata.creator_profile_deep_link = apiResponse.creator_profile_deep_link;
    if (apiResponse.creator_verified !== void 0) metadata.creator_verified = Boolean(apiResponse.creator_verified);
    return metadata;
  }
  mapApiResponseToVideoMetadata(apiResponse, url, platform) {
    const metadata = {
      platform,
      url,
      extractedAt: Date.now()
    };
    if (apiResponse.video_id) metadata.video_id = String(apiResponse.video_id);
    if (apiResponse.shortcode) metadata.shortcode = apiResponse.shortcode;
    if (apiResponse.like_count !== void 0) metadata.like_count = Number(apiResponse.like_count);
    if (apiResponse.comment_count !== void 0) metadata.comment_count = Number(apiResponse.comment_count);
    if (apiResponse.view_count !== void 0) metadata.view_count = Number(apiResponse.view_count);
    if (apiResponse.share_count !== void 0) metadata.share_count = Number(apiResponse.share_count);
    if (apiResponse.save_count !== void 0) metadata.save_count = Number(apiResponse.save_count);
    if (apiResponse.play_count !== void 0) metadata.play_count = Number(apiResponse.play_count);
    if (apiResponse.reach !== void 0) metadata.reach = Number(apiResponse.reach);
    if (apiResponse.timestamp !== void 0) metadata.timestamp = Number(apiResponse.timestamp);
    if (apiResponse.caption) metadata.caption = apiResponse.caption;
    if (apiResponse.description) metadata.description = apiResponse.description;
    if (apiResponse.thumbnails) metadata.thumbnails = Array.isArray(apiResponse.thumbnails) ? apiResponse.thumbnails : [];
    if (apiResponse.hashtags) metadata.hashtags = Array.isArray(apiResponse.hashtags) ? apiResponse.hashtags : [];
    if (apiResponse.mentions) metadata.mentions = Array.isArray(apiResponse.mentions) ? apiResponse.mentions : [];
    if (apiResponse.duration !== void 0) metadata.duration = Number(apiResponse.duration);
    if (apiResponse.channel_id) metadata.channel_id = String(apiResponse.channel_id);
    if (apiResponse.channel_name) metadata.channel_name = apiResponse.channel_name;
    if (apiResponse.definition) metadata.definition = apiResponse.definition;
    if (apiResponse.concurrentViewers !== void 0) metadata.concurrentViewers = Number(apiResponse.concurrentViewers);
    if (apiResponse.embeddable !== void 0) metadata.embeddable = Boolean(apiResponse.embeddable);
    if (apiResponse.dimension) metadata.dimension = apiResponse.dimension;
    if (apiResponse.projection) metadata.projection = apiResponse.projection;
    if (apiResponse.madeForKids !== void 0) metadata.madeForKids = Boolean(apiResponse.madeForKids);
    if (apiResponse.isShort !== void 0) metadata.isShort = Boolean(apiResponse.isShort);
    if (apiResponse.isLive !== void 0) metadata.isLive = Boolean(apiResponse.isLive);
    if (apiResponse.isUpcoming !== void 0) metadata.isUpcoming = Boolean(apiResponse.isUpcoming);
    if (apiResponse.hasCaptions !== void 0) metadata.hasCaptions = Boolean(apiResponse.hasCaptions);
    if (apiResponse.isUnlisted !== void 0) metadata.isUnlisted = Boolean(apiResponse.isUnlisted);
    if (apiResponse.isAgeRestricted !== void 0) metadata.isAgeRestricted = Boolean(apiResponse.isAgeRestricted);
    if (apiResponse.category) metadata.category = apiResponse.category;
    if (apiResponse.defaultLanguage) metadata.defaultLanguage = apiResponse.defaultLanguage;
    return metadata;
  }
};

// src/scrapers/api/FacebookApiScraper.ts
var FacebookApiScraper = class extends ApiScraperAdapter {
  async getCreatorProfileUrl(videoUrl) {
    try {
      const match = videoUrl.match(/facebook\.com\/([^\/\?]+)/);
      if (match && !match[1].includes("watch")) {
        return `https://www.facebook.com/${match[1]}`;
      }
      return null;
    } catch {
      return null;
    }
  }
  getVideoIdFromUrl(url) {
    const reelMatch = url.match(/facebook\.com\/reel\/(\d+)/);
    if (reelMatch) return reelMatch[1];
    const watchMatch = url.match(/[\?&]v=(\d+)/);
    if (watchMatch) return watchMatch[1];
    return null;
  }
  async extractMetadataFromApi(url) {
    const logAgent = this.logger;
    try {
      logAgent.log(`Extracting Facebook metadata via API for: ${url}`, "info");
      const apiData = await this.scrapeAndPoll(url);
      if (!apiData) {
        logAgent.log("API response missing data", "warn");
        return null;
      }
      const hasNestedData = apiData && apiData.data != null && typeof apiData.data === "object";
      const payload = hasNestedData ? apiData.data : apiData;
      if (!payload || typeof payload !== "object") {
        logAgent.log("API response has no mappable payload (creator)", "warn");
        return null;
      }
      logAgent.log(`Creator payload from: ${hasNestedData ? "data" : "top-level"}, keys: ${JSON.stringify(Object.keys(payload))}`, "debug");
      const normalized = this.normalizeApiPayloadToCreatorShape(payload);
      const metadata = this.mapApiResponseToCreatorMetadata(normalized, url, "facebook");
      logAgent.log("Successfully extracted Facebook metadata via API", "info");
      return metadata;
    } catch (error) {
      logAgent.log(`Failed to extract Facebook metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
      return null;
    }
  }
  async extractVideoMetadataFromApi(url) {
    const logAgent = this.logger;
    try {
      logAgent.log(`Extracting Facebook video metadata via API for: ${url}`, "info");
      const apiData = await this.scrapeAndPoll(url);
      if (!apiData) {
        return null;
      }
      const hasNestedData = apiData && apiData.data != null && typeof apiData.data === "object";
      const payload = hasNestedData ? apiData.data : apiData;
      if (!payload || typeof payload !== "object") {
        logAgent.log("API response has no mappable payload (video)", "warn");
        return null;
      }
      logAgent.log(`Video payload from: ${hasNestedData ? "data" : "top-level"}, keys: ${JSON.stringify(Object.keys(payload))}`, "debug");
      const normalized = this.normalizeApiPayloadToVideoShape(payload, url);
      const metadata = this.mapApiResponseToVideoMetadata(normalized, url, "facebook");
      logAgent.log("Successfully extracted Facebook video metadata via API", "info");
      return metadata;
    } catch (error) {
      logAgent.log(`Failed to extract Facebook video metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
      return null;
    }
  }
};

// src/scrapers/api/TwitterApiScraper.ts
var TwitterApiScraper = class extends ApiScraperAdapter {
  async getCreatorProfileUrl(videoUrl) {
    try {
      const match = videoUrl.match(/(?:twitter\.com|x\.com)\/([^\/]+)/);
      if (match) {
        const domain = videoUrl.includes("x.com") ? "x.com" : "twitter.com";
        return `https://${domain}/${match[1]}`;
      }
      return null;
    } catch {
      return null;
    }
  }
  async extractMetadataFromApi(url) {
    const logAgent = this.logger;
    try {
      logAgent.log(`Extracting Twitter/X metadata via API for: ${url}`, "info");
      const apiData = await this.scrapeAndPoll(url);
      if (!apiData) {
        logAgent.log("API response missing data", "warn");
        return null;
      }
      const metadata = this.mapApiResponseToCreatorMetadata(apiData, url, "twitter");
      logAgent.log("Successfully extracted Twitter/X metadata via API", "info");
      return metadata;
    } catch (error) {
      logAgent.log(`Failed to extract Twitter/X metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
      return null;
    }
  }
  async extractVideoMetadataFromApi(url) {
    const logAgent = this.logger;
    try {
      logAgent.log(`Extracting Twitter/X video metadata via API for: ${url}`, "info");
      const apiData = await this.scrapeAndPoll(url);
      if (!apiData) {
        return null;
      }
      const metadata = this.mapApiResponseToVideoMetadata(apiData, url, "twitter");
      logAgent.log("Successfully extracted Twitter/X video metadata via API", "info");
      return metadata;
    } catch (error) {
      logAgent.log(`Failed to extract Twitter/X video metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
      return null;
    }
  }
};

// src/scrapers/api/RedditApiScraper.ts
var RedditApiScraper = class extends ApiScraperAdapter {
  async getCreatorProfileUrl(videoUrl) {
    try {
      const match = videoUrl.match(/reddit\.com\/user\/([^\/\?]+)/);
      if (match) {
        return `https://www.reddit.com/user/${match[1]}`;
      }
      const postMatch = videoUrl.match(/reddit\.com\/r\/([^\/]+)\/comments\/([^\/]+)/);
      if (postMatch) {
        return null;
      }
      return null;
    } catch {
      return null;
    }
  }
  async extractMetadataFromApi(url) {
    const logAgent = this.logger;
    try {
      logAgent.log(`Extracting Reddit metadata via API for: ${url}`, "info");
      const apiData = await this.scrapeAndPoll(url);
      if (!apiData) {
        logAgent.log("API response missing data", "warn");
        return null;
      }
      const metadata = this.mapApiResponseToCreatorMetadata(apiData, url, "reddit");
      logAgent.log("Successfully extracted Reddit metadata via API", "info");
      return metadata;
    } catch (error) {
      logAgent.log(`Failed to extract Reddit metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
      return null;
    }
  }
  async extractVideoMetadataFromApi(url) {
    const logAgent = this.logger;
    try {
      logAgent.log(`Extracting Reddit video metadata via API for: ${url}`, "info");
      const apiData = await this.scrapeAndPoll(url);
      if (!apiData) {
        return null;
      }
      const metadata = this.mapApiResponseToVideoMetadata(apiData, url, "reddit");
      logAgent.log("Successfully extracted Reddit video metadata via API", "info");
      return metadata;
    } catch (error) {
      logAgent.log(`Failed to extract Reddit video metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
      return null;
    }
  }
};

// src/scrapers/api/YouTubeApiScraper.ts
var YouTubeApiScraper = class extends ApiScraperAdapter {
  async getCreatorProfileUrl(videoUrl) {
    try {
      const channelMatch = videoUrl.match(/youtube\.com\/channel\/([^\/\?]+)/);
      if (channelMatch) {
        return `https://www.youtube.com/channel/${channelMatch[1]}`;
      }
      const handleMatch = videoUrl.match(/youtube\.com\/@([^\/\?]+)/);
      if (handleMatch) {
        return `https://www.youtube.com/@${handleMatch[1]}`;
      }
      return null;
    } catch {
      return null;
    }
  }
  getVideoIdFromUrl(url) {
    const match = url.match(/(?:v=|\/watch\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }
  async extractMetadataFromApi(url) {
    const logAgent = this.logger;
    try {
      logAgent.log(`Extracting YouTube metadata via API for: ${url}`, "info");
      const apiData = await this.scrapeAndPoll(url);
      if (!apiData) {
        logAgent.log("API response missing data", "warn");
        return null;
      }
      const hasNestedData = apiData && apiData.data != null && typeof apiData.data === "object";
      const payload = hasNestedData ? apiData.data : apiData;
      if (!payload || typeof payload !== "object") {
        logAgent.log("API response has no mappable payload (creator)", "warn");
        return null;
      }
      logAgent.log(`Creator payload from: ${hasNestedData ? "data" : "top-level"}, keys: ${JSON.stringify(Object.keys(payload))}`, "debug");
      if (payload.authors != null) logAgent.log(`Creator authors sample: ${JSON.stringify(payload.authors)}`, "debug");
      const normalized = this.normalizeApiPayloadToCreatorShape(payload);
      const metadata = this.mapApiResponseToCreatorMetadata(normalized, url, "youtube");
      logAgent.log("Successfully extracted YouTube metadata via API", "info");
      return metadata;
    } catch (error) {
      logAgent.log(`Failed to extract YouTube metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
      return null;
    }
  }
  async extractVideoMetadataFromApi(url) {
    const logAgent = this.logger;
    try {
      logAgent.log(`Extracting YouTube video metadata via API for: ${url}`, "info");
      const apiData = await this.scrapeAndPoll(url);
      if (!apiData) {
        return null;
      }
      const hasNestedData = apiData && apiData.data != null && typeof apiData.data === "object";
      const payload = hasNestedData ? apiData.data : apiData;
      if (!payload || typeof payload !== "object") {
        logAgent.log("API response has no mappable payload (video)", "warn");
        return null;
      }
      logAgent.log(`Video payload from: ${hasNestedData ? "data" : "top-level"}, keys: ${JSON.stringify(Object.keys(payload))}`, "debug");
      if (payload.engagements != null || payload.reach_metrics != null) logAgent.log(`Video engagements: ${JSON.stringify(payload.engagements)}, reach_metrics: ${JSON.stringify(payload.reach_metrics)}`, "debug");
      const normalized = this.normalizeApiPayloadToVideoShape(payload, url);
      const metadata = this.mapApiResponseToVideoMetadata(normalized, url, "youtube");
      logAgent.log("Successfully extracted YouTube video metadata via API", "info");
      return metadata;
    } catch (error) {
      logAgent.log(`Failed to extract YouTube video metadata via API: ${error instanceof Error ? error.message : String(error)}`, "error");
      return null;
    }
  }
};

// src/scrapers/CreatorMetadataManager.ts
init_FirefoxBrowser();
var CreatorMetadataManager = class {
  logger;
  config;
  constructor(logger, config = {}) {
    this.logger = logger;
    this.config = config;
  }
  getScraperMode(platform) {
    const logAgent = this.logger.agent("CreatorMetadataManager");
    const importantPlatforms = ["youtube", "tiktok", "twitch"];
    const localOnlyPlatforms = ["instagram"];
    console.log(`[DEBUG] getScraperMode called - platform: ${platform}, config.scraperMode: ${this.config.scraperMode}`);
    logAgent.log(`getScraperMode - platform: ${platform}, config.scraperMode: ${this.config.scraperMode}`, "info");
    logAgent.log(`Determining scraper mode for platform: ${platform}`, "debug");
    logAgent.log(`Config scraperMode: ${this.config.scraperMode}, platformOverrides: ${JSON.stringify(this.config.platformOverrides)}`, "debug");
    if (this.config.platformOverrides?.[platform]) {
      console.log(`[DEBUG] Platform override found for ${platform}: ${this.config.platformOverrides[platform]}`);
      logAgent.log(`Platform override found for ${platform}: ${this.config.platformOverrides[platform]}`, "debug");
      return this.config.platformOverrides[platform];
    }
    if (importantPlatforms.includes(platform) || localOnlyPlatforms.includes(platform)) {
      console.log(`[DEBUG] Platform ${platform} is in important/localOnly list, using local mode`);
      logAgent.log(`Platform ${platform} is in important/localOnly list, using local mode`, "debug");
      return "local";
    }
    const mode = this.config.scraperMode || "hybrid";
    console.log(`[DEBUG] Using config scraperMode: ${mode}`);
    logAgent.log(`Using config scraperMode: ${mode}`, "debug");
    return mode;
  }
  getLocalScraper(platform) {
    const logAgent = this.logger.agent("CreatorMetadataManager");
    switch (platform) {
      case "youtube":
        return new YouTubeScraper(this.logger, this.config);
      case "tiktok":
        return new TikTokScraper(this.logger, this.config);
      case "twitter":
        return new TwitterScraper(this.logger, this.config);
      case "instagram":
        return new InstagramScraper(this.logger, this.config);
      case "reddit":
        return new RedditScraper(this.logger, this.config);
      case "facebook":
        return new FacebookScraper(this.logger, this.config);
      case "twitch":
        return new TwitchScraper(this.logger, this.config);
      default:
        logAgent.log(`No local scraper available for platform: ${platform}`, "warn");
        return null;
    }
  }
  getApiScraper(platform) {
    const logAgent = this.logger.agent("CreatorMetadataManager");
    const apiEnabled = this.config.apiConfig?.enabled !== false;
    const hasBaseUrl = this.config.apiConfig?.baseUrl || process.env.ML_API_BASE_URL;
    console.log(`[DEBUG] getApiScraper - platform: ${platform}, apiEnabled: ${apiEnabled}, hasBaseUrl: ${!!hasBaseUrl}, baseUrl: ${this.config.apiConfig?.baseUrl || process.env.ML_API_BASE_URL}`);
    logAgent.log(`getApiScraper - platform: ${platform}, apiEnabled: ${apiEnabled}, hasBaseUrl: ${!!hasBaseUrl}, baseUrl: ${this.config.apiConfig?.baseUrl || process.env.ML_API_BASE_URL}`, "info");
    logAgent.log(`API scraper check for ${platform} - enabled: ${apiEnabled}, hasBaseUrl: ${!!hasBaseUrl}`, "info");
    logAgent.log(`API config: ${JSON.stringify(this.config.apiConfig)}`, "debug");
    if (!apiEnabled && !hasBaseUrl) {
      console.log(`[DEBUG] API scraper disabled or no base URL configured`);
      logAgent.log("API scraper disabled or no base URL configured", "warn");
      return null;
    }
    switch (platform) {
      case "facebook":
        console.log(`[DEBUG] Creating FacebookApiScraper`);
        return new FacebookApiScraper(this.logger, this.config);
      case "twitter":
        console.log(`[DEBUG] Creating TwitterApiScraper`);
        return new TwitterApiScraper(this.logger, this.config);
      case "reddit":
        console.log(`[DEBUG] Creating RedditApiScraper`);
        return new RedditApiScraper(this.logger, this.config);
      case "youtube":
        console.log(`[DEBUG] Creating YouTubeApiScraper`);
        return new YouTubeApiScraper(this.logger, this.config);
      default:
        console.log(`[DEBUG] No API scraper available for platform: ${platform}`);
        logAgent.log(`No API scraper available for platform: ${platform}`, "debug");
        return null;
    }
  }
  getScraperForPlatform(platform) {
    const logAgent = this.logger.agent("CreatorMetadataManager");
    process.stderr.write(`[DEBUG] getScraperForPlatform called - platform: ${platform}, config.scraperMode: ${this.config.scraperMode}
`);
    console.log(`[DEBUG] getScraperForPlatform called - platform: ${platform}, config.scraperMode: ${this.config.scraperMode}`);
    const explicitApi = this.config.scraperMode === "api" || this.config.platformOverrides?.[platform] === "api";
    if (explicitApi) {
      const apiScraper = this.getApiScraper(platform);
      if (apiScraper) {
        logAgent.log(`Using API scraper (explicit api mode): ${apiScraper.constructor.name}`, "info");
        return apiScraper;
      }
      if (this.config.scraperMode === "api") {
        logAgent.log(`API scraper not available for ${platform}, returning null`, "warn");
        return null;
      }
    }
    const mode = this.getScraperMode(platform);
    process.stderr.write(`[DEBUG] getScraperMode returned: ${mode}
`);
    console.log(`[DEBUG] getScraperMode returned: ${mode}`);
    logAgent.log(`getScraperForPlatform - platform: ${platform}, mode: ${mode}`, "info");
    console.log(`[DEBUG] Using scraper mode: ${mode} for platform: ${platform}`);
    if (mode === "local") {
      const scraper = this.getLocalScraper(platform);
      console.log(`[DEBUG] Selected local scraper: ${scraper?.constructor.name || "null"}`);
      logAgent.log(`Selected local scraper: ${scraper?.constructor.name || "null"}`, "info");
      return scraper;
    } else if (mode === "api") {
      process.stderr.write(`[DEBUG] Mode is 'api', calling getApiScraper for ${platform}
`);
      console.log(`[DEBUG] Mode is 'api', calling getApiScraper for ${platform}`);
      const apiScraper = this.getApiScraper(platform);
      process.stderr.write(`[DEBUG] getApiScraper returned: ${apiScraper?.constructor.name || "null"}
`);
      console.log(`[DEBUG] getApiScraper returned: ${apiScraper?.constructor.name || "null"}`);
      if (!apiScraper) {
        logAgent.log(`API scraper not available for ${platform}, returning null (no local fallback in API mode)`, "warn");
        return null;
      }
      process.stderr.write(`[DEBUG] Selected API scraper: ${apiScraper.constructor.name}
`);
      console.log(`[DEBUG] Selected API scraper: ${apiScraper.constructor.name}`);
      logAgent.log(`Selected API scraper: ${apiScraper.constructor.name}`, "info");
      return apiScraper;
    } else if (mode === "hybrid") {
      const apiScraper = this.getApiScraper(platform);
      const localScraper = this.getLocalScraper(platform);
      if (!localScraper) {
        logAgent.log(`Local scraper not available for ${platform}`, "warn");
        return apiScraper;
      }
      if (!apiScraper) {
        logAgent.log(`API scraper not available for ${platform}, using local only`, "info");
        return localScraper;
      }
      logAgent.log(`Selected hybrid scraper (API: ${apiScraper.constructor.name}, Local: ${localScraper.constructor.name})`, "info");
      return new HybridScraper(apiScraper, localScraper, this.logger);
    }
    logAgent.log(`No scraper available for platform: ${platform}`, "warn");
    return null;
  }
  /**
   * Set up a page for fast local metadata scraping: block heavy resources (image, font, media)
   * and set a sensible default timeout. Call this after getPage() when using local scrapers.
   */
  setupPageForFastScraping(page) {
    const blockedResourceTypes = ["image", "font", "media"];
    page.route("**/*", (route) => {
      const request = route.request();
      if (request.resourceType() && blockedResourceTypes.includes(request.resourceType())) {
        route.abort();
      } else {
        route.continue();
      }
    });
    page.setDefaultTimeout(2e4);
  }
  async extractMetadata(videoUrl) {
    const logAgent = this.logger.agent("CreatorMetadataManager");
    let browserInstance = null;
    let page = null;
    try {
      const platform = CreatorMetadataScraper.detectPlatform(videoUrl);
      logAgent.log(`Detected platform: ${platform}`, "info");
      if (platform === "unknown") {
        logAgent.log(`Unknown platform for URL: ${videoUrl}`, "warn");
        return null;
      }
      const scraper = this.getScraperForPlatform(platform);
      if (!scraper) {
        return null;
      }
      const browserType = this.config.browserType || "chromium";
      if (browserType === "chromium") {
        browserInstance = new ChromiumBrowser(this.logger);
      } else if (browserType === "firefox") {
        browserInstance = new FirefoxBrowser(this.logger);
      } else if (browserType === "brave") {
        browserInstance = new BraveBrowser(this.logger);
      } else {
        browserInstance = new ChromiumBrowser(this.logger);
      }
      await browserInstance.launch({
        headless: this.config.browserConfig?.headless ?? true,
        viewport: this.config.browserConfig?.viewport ?? { width: 1920, height: 1080 },
        ignoreHTTPSErrors: this.config.browserConfig?.ignoreHTTPSErrors ?? true,
        javaScriptEnabled: this.config.browserConfig?.javaScriptEnabled ?? true
      });
      page = await browserInstance.getPage();
      if (!page) {
        logAgent.log("Failed to get browser page", "error");
        return null;
      }
      this.setupPageForFastScraping(page);
      const metadata = await scraper.extractMetadata(page, videoUrl);
      return metadata;
    } catch (error) {
      logAgent.log(`Error extracting metadata: ${error}`, "error");
      return null;
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (error) {
        }
      }
      if (browserInstance) {
        try {
          await browserInstance.close();
        } catch (error) {
        }
      }
    }
  }
  async extractMetadataFromPage(page, videoUrl) {
    const logAgent = this.logger.agent("CreatorMetadataManager");
    try {
      const platform = CreatorMetadataScraper.detectPlatform(videoUrl);
      logAgent.log(`Detected platform: ${platform}`, "info");
      if (platform === "unknown") {
        logAgent.log(`Unknown platform for URL: ${videoUrl}`, "warn");
        return null;
      }
      const scraper = this.getScraperForPlatform(platform);
      if (!scraper) {
        return null;
      }
      const metadata = await scraper.extractMetadata(page, videoUrl);
      return metadata;
    } catch (error) {
      logAgent.log(`Error extracting metadata: ${error}`, "error");
      return null;
    }
  }
  async extractExtendedMetadata(videoUrl) {
    const logAgent = this.logger.agent("CreatorMetadataManager");
    let browserInstance = null;
    let page = null;
    logAgent.log(`extractExtendedMetadata called - scraperMode: ${this.config.scraperMode}, apiConfig: ${JSON.stringify(this.config.apiConfig)}`, "info");
    try {
      const platform = CreatorMetadataScraper.detectPlatform(videoUrl);
      logAgent.log(`Detected platform: ${platform}`, "info");
      if (platform === "unknown") {
        logAgent.log(`Unknown platform for URL: ${videoUrl}`, "warn");
        return null;
      }
      const scraper = this.getScraperForPlatform(platform);
      process.stderr.write(`[DEBUG] getScraperForPlatform returned: ${scraper?.constructor.name || "null"}
`);
      console.log(`[DEBUG] getScraperForPlatform returned: ${scraper?.constructor.name || "null"}`);
      if (!scraper) {
        process.stderr.write(`[DEBUG] No scraper returned, returning null
`);
        console.log(`[DEBUG] No scraper returned, returning null`);
        return null;
      }
      const scraperClassName = scraper.constructor.name;
      const isApiScraper = scraperClassName.includes("ApiScraper") && !(scraper instanceof HybridScraper);
      process.stderr.write(`[DEBUG] Scraper class: ${scraperClassName}, isApiScraper: ${isApiScraper}, config.scraperMode: ${this.config.scraperMode}
`);
      console.log(`[DEBUG] Scraper class: ${scraperClassName}, isApiScraper: ${isApiScraper}`);
      logAgent.log(`Scraper class: ${scraperClassName}, isApiScraper: ${isApiScraper}`, "info");
      logAgent.log(`Selected scraper type: ${scraperClassName}, config.scraperMode: ${this.config.scraperMode}`, "info");
      if (this.config.scraperMode === "api" && !isApiScraper) {
        const errorMsg = `ERROR: scraperMode is 'api' but selected scraper is ${scraperClassName} (not an API scraper)`;
        process.stderr.write(`[ERROR] ${errorMsg}
`);
        throw new Error(errorMsg);
      }
      if (isApiScraper) {
        logAgent.log("Using API scraper - skipping browser launch", "info");
        const creatorMetadata2 = await scraper.extractMetadata(page, videoUrl);
        const videoMetadata2 = await scraper.extractVideoMetadata(page, videoUrl);
        const result2 = {};
        if (creatorMetadata2) result2.creator = creatorMetadata2;
        if (videoMetadata2) result2.video = videoMetadata2;
        return Object.keys(result2).length > 0 ? result2 : null;
      }
      const browserType = this.config.browserType || "chromium";
      if (browserType === "chromium") {
        browserInstance = new ChromiumBrowser(this.logger);
      } else if (browserType === "firefox") {
        browserInstance = new FirefoxBrowser(this.logger);
      } else if (browserType === "brave") {
        browserInstance = new BraveBrowser(this.logger);
      } else {
        browserInstance = new ChromiumBrowser(this.logger);
      }
      await browserInstance.launch({
        headless: this.config.browserConfig?.headless ?? true,
        viewport: this.config.browserConfig?.viewport ?? { width: 1920, height: 1080 },
        ignoreHTTPSErrors: this.config.browserConfig?.ignoreHTTPSErrors ?? true,
        javaScriptEnabled: this.config.browserConfig?.javaScriptEnabled ?? true
      });
      page = await browserInstance.getPage();
      if (!page) {
        logAgent.log("Failed to get browser page", "error");
        return null;
      }
      this.setupPageForFastScraping(page);
      const videoMetadata = await scraper.extractVideoMetadata(page, videoUrl);
      const creatorMetadata = await scraper.extractMetadata(page, videoUrl);
      const result = {};
      if (creatorMetadata) result.creator = creatorMetadata;
      if (videoMetadata) result.video = videoMetadata;
      return Object.keys(result).length > 0 ? result : null;
    } catch (error) {
      logAgent.log(`Error extracting extended metadata: ${error}`, "error");
      return null;
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (error) {
        }
      }
      if (browserInstance) {
        try {
          await browserInstance.close();
        } catch (error) {
        }
      }
    }
  }
  async extractExtendedMetadataFromPage(page, videoUrl) {
    const logAgent = this.logger.agent("CreatorMetadataManager");
    try {
      const platform = CreatorMetadataScraper.detectPlatform(videoUrl);
      logAgent.log(`Detected platform: ${platform}`, "info");
      if (platform === "unknown") {
        logAgent.log(`Unknown platform for URL: ${videoUrl}`, "warn");
        return null;
      }
      const scraper = this.getScraperForPlatform(platform);
      if (!scraper) {
        return null;
      }
      const videoMetadata = await scraper.extractVideoMetadata(page, videoUrl);
      const creatorMetadata = await scraper.extractMetadata(page, videoUrl);
      const result = {};
      if (creatorMetadata) result.creator = creatorMetadata;
      if (videoMetadata) result.video = videoMetadata;
      if (creatorMetadata && videoMetadata && videoMetadata.creator_fields) {
        const creatorFields = videoMetadata.creator_fields;
        if (creatorFields.creator_open_id) creatorMetadata.creator_open_id = creatorFields.creator_open_id;
        if (creatorFields.creator_union_id) creatorMetadata.creator_union_id = creatorFields.creator_union_id;
        if (creatorFields.creator_avatar_url_100) creatorMetadata.creator_avatar_url_100 = creatorFields.creator_avatar_url_100;
        if (creatorFields.creator_avatar_large_url) creatorMetadata.creator_avatar_large_url = creatorFields.creator_avatar_large_url;
        if (creatorFields.creator_profile_deep_link) creatorMetadata.creator_profile_deep_link = creatorFields.creator_profile_deep_link;
        if (creatorFields.creator_following_count !== void 0) creatorMetadata.creator_following_count = creatorFields.creator_following_count;
        if (creatorFields.creator_likes_count !== void 0) creatorMetadata.creator_likes_count = creatorFields.creator_likes_count;
        if (creatorFields.creator_video_count !== void 0) creatorMetadata.creator_video_count = creatorFields.creator_video_count;
      }
      return Object.keys(result).length > 0 ? result : null;
    } catch (error) {
      logAgent.log(`Error extracting extended metadata: ${error}`, "error");
      return null;
    }
  }
};

// src/handlers/extractMetadata.ts
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
    const logger = new Logger("extractMetadata", invokeEvent);
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
    const manager = new CreatorMetadataManager(logger, {
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
    const logger = new Logger("extractExtendedMetadata", invokeEvent);
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
    const manager = new CreatorMetadataManager(logger, {
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
async function detectPlatform(e, args) {
  e.stopPropagation();
  try {
    const { url } = args;
    if (!url) {
      return { ok: false, error: "URL is required" };
    }
    const platform = CreatorMetadataScraper.detectPlatform(url);
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
init_FirefoxBrowser();

// src/helpers/DownloadHelper.ts
var fs3 = __toESM(require("fs"));
var path2 = __toESM(require("path"));
var DownloadHelper = class extends BaseHelper {
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
var path3 = require("path");
var index_default = VideoDownloader;
async function getInfo(e, url) {
  if (!url.startsWith("https://jav.guru")) return;
  e.stopPropagation();
  try {
    const simpleLogger = new Logger("getInfo", e.invokeEvent);
    const logAgent = simpleLogger.agent("TitleScraper");
    const { TitleScraper: TitleScraper2 } = await Promise.resolve().then(() => (init_TitleScraper(), TitleScraper_exports));
    const { FirefoxBrowser: FirefoxBrowser2 } = await Promise.resolve().then(() => (init_FirefoxBrowser(), FirefoxBrowser_exports));
    const titleScraper = new TitleScraper2(logAgent);
    const browser = new FirefoxBrowser2(simpleLogger);
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
  let completeLog = new Logger(downloadId, invokeEvent);
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
