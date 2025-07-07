"use strict";

import { URL } from "url";
import checkType from "../utils/check-type.js";

export default (self, proxyOptions) => {
    checkType("proxyOptions", proxyOptions, ["object"]);
    checkType("proxyOptions.headers", proxyOptions.headers, [
        "object",
        "undefined",
    ]);
    checkType("proxyOptions.raw", proxyOptions.raw, ["boolean", "undefined"]);
    checkType("proxyOptions.url", proxyOptions.url, [URL, "string"]);

    const url = new URL(proxyOptions.url);

    self.proxyOptions = {
        raw: true,
        ...proxyOptions,
        headers: { ...proxyOptions.headers },
        url,
    };
};
