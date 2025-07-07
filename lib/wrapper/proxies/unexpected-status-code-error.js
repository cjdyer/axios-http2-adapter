"use strict";

export default class UnexpectedStatusCodeError extends Error {
    constructor(statusCode, statusMessage = "") {
        super(
            `The proxy server rejected the request with status code ${statusCode} (${
                statusMessage || "empty status message"
            })`
        );
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
    }
}
