import { Route, Request } from "playwright";
import { AdBlocker } from "../utils/AdBlocker.js";
import { LogAgent, Logger } from "../helpers/StringBuilder.js";

export class RouteHandler {
    private adBlocker: AdBlocker;
    private logger: LogAgent;

    constructor(logger: Logger) {
        this.adBlocker = new AdBlocker();
        this.logger = logger.agent("RouteHandler");
    }

    async handleRoute(route: Route, request: Request): Promise<void> {
        const url = request.url();

        if (this.adBlocker.blockWebsites(url)) {
            this.logger.log(`Blocked: ${url}`, "debug");
            await route.abort();
        } else {
            await route.continue();
        }
    }

    getAdBlocker(): AdBlocker {
        return this.adBlocker;
    }
}
