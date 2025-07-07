"use strict";

import { globalAgent } from "../agent.js";
import Http2OverHttpX from "./h2-over-hx.js";
import getAuthorizationHeaders from "./get-auth-headers.js";

const getStatusCode = (stream) =>
    new Promise((resolve, reject) => {
        stream.once("error", reject);
        stream.once("response", (headers) => {
            stream.off("error", reject);
            resolve(headers[":status"]);
        });
    });

class Http2OverHttp2 extends Http2OverHttpX {
    async _getProxyStream(authority) {
        const { proxyOptions } = this;

        const headers = {
            ...getAuthorizationHeaders(this),
            ...proxyOptions.headers,
            ":method": "CONNECT",
            ":authority": authority,
        };

        const stream = await globalAgent.request(
            proxyOptions.url,
            proxyOptions,
            headers
        );
        const statusCode = await getStatusCode(stream);

        return [stream, statusCode, ""];
    }
}

export default Http2OverHttp2;
