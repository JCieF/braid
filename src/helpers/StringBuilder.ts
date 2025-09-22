export class StringBuilder {
    #strings: string[] = [];

    append(...texts: string[]) {
        this.#strings.push(...texts);
        return this;
    }

    clear() {
        this.#strings = [];
    }

    toString(sep: string = "\n") {
        return this.#strings.join(sep);
    }

    get length() {
        return this.toString().length;
    }
}

export class Logger extends StringBuilder {
    readonly downloadId: string;
    readonly invokeEvent: any;

    constructor(downloadId: string, invokeEvent: any) {
        super();

        this.downloadId = downloadId;
        this.invokeEvent = invokeEvent;
    }

    log(text: string, type: string) {
        this.append(`${text} @ ${type}`);
        this.invokeEvent.sender.send(this.downloadId, {
            data: text,
            completeLog: this.toString(),
        });

        return this;
    }

    agent(name: string) {
        return new LogAgent(name, this);
    }
}

export class LogAgent {
    readonly logger: Logger;
    readonly name: string;

    constructor(name: string, logger: Logger) {
        this.logger = logger;
        this.name = name;
    }

    log(text: string, type: string) {
        this.logger.log(`${this.name} - ${text}`, type);

        return this;
    }
}
