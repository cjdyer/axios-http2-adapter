"use strict";

import { isIP } from "net";
import assert from "assert";

const getHost = (host) => {
    if (host[0] === "[") {
        const idx = host.indexOf("]");

        assert(idx !== -1);
        return host.slice(1, idx);
    }

    const idx = host.indexOf(":");
    if (idx === -1) {
        return host;
    }

    return host.slice(0, idx);
};

export default (host) => {
    const servername = getHost(host);

    if (isIP(servername)) {
        return "";
    }

    return servername;
};
