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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _StringBuilder_strings;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogAgent = exports.Logger = exports.StringBuilder = void 0;
var StringBuilder = /** @class */ (function () {
    function StringBuilder() {
        _StringBuilder_strings.set(this, []);
    }
    StringBuilder.prototype.append = function () {
        var _a;
        var texts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            texts[_i] = arguments[_i];
        }
        (_a = __classPrivateFieldGet(this, _StringBuilder_strings, "f")).push.apply(_a, texts);
        return this;
    };
    StringBuilder.prototype.clear = function () {
        __classPrivateFieldSet(this, _StringBuilder_strings, [], "f");
    };
    StringBuilder.prototype.toString = function (sep) {
        if (sep === void 0) { sep = "\n"; }
        return __classPrivateFieldGet(this, _StringBuilder_strings, "f").join(sep);
    };
    Object.defineProperty(StringBuilder.prototype, "length", {
        get: function () {
            return this.toString().length;
        },
        enumerable: false,
        configurable: true
    });
    return StringBuilder;
}());
exports.StringBuilder = StringBuilder;
_StringBuilder_strings = new WeakMap();
var Logger = /** @class */ (function (_super) {
    __extends(Logger, _super);
    function Logger(downloadId, invokeEvent) {
        var _this = _super.call(this) || this;
        _this.downloadId = downloadId;
        _this.invokeEvent = invokeEvent;
        return _this;
    }
    Logger.prototype.log = function (text, type) {
        this.append("".concat(text, " @ ").concat(type));
        this.invokeEvent.sender.send(this.downloadId, {
            data: text,
            completeLog: this.toString(),
        });
        return this;
    };
    Logger.prototype.agent = function (name) {
        return new LogAgent(name, this);
    };
    return Logger;
}(StringBuilder));
exports.Logger = Logger;
var LogAgent = /** @class */ (function () {
    function LogAgent(name, logger) {
        this.logger = logger;
        this.name = name;
    }
    LogAgent.prototype.log = function (text, type) {
        this.logger.log("".concat(this.name, " - ").concat(text), type);
        return this;
    };
    return LogAgent;
}());
exports.LogAgent = LogAgent;
