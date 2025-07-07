"use strict";

import { ERR_INVALID_HTTP_TOKEN } from "./errors.js";
import { isRequestPseudoHeader } from "./is-request-pseudo-header.js";

const isValidHttpToken = /^[\^`\-\w!#$%&*+.|~]+$/;

export default function validateHeaderName(name) {
    if (
        typeof name !== "string" ||
        (!isValidHttpToken.test(name) && !isRequestPseudoHeader(name))
    ) {
        throw new ERR_INVALID_HTTP_TOKEN("Header name", name);
    }
}
