"use strict";

import http from "http";
import https from "https";
import Http2OverHttpX from "./h2-over-hx.js";
import getAuthorizationHeaders from "./get-auth-headers.js";

const getStream = (request) =>
    new Promise((resolve, reject) => {
        const onConnect = (response, socket, head) => {
            socket.unshift(head);

            request.off("error", reject);
            resolve([socket, response.statusCode, response.statusMessage]);
        };

        request.once("error", reject);
        request.once("connect", onConnect);
    });

class Http2OverHttp extends Http2OverHttpX {
    async _getProxyStream(authority) {
        const { proxyOptions } = this;
        const { url, headers } = this.proxyOptions;

        const network = url.protocol === "https:" ? https : http;

        // `new URL('https://localhost/httpbin.org:443')` results in
        // a `/httpbin.org:443` path, which has an invalid leading slash.
        const request = network
            .request({
                ...proxyOptions,
                hostname: url.hostname,
                port: url.port,
                path: authority,
                headers: {
                    ...getAuthorizationHeaders(this),
                    ...headers,
                    host: authority,
                },
                method: "CONNECT",
            })
            .end();

        return getStream(request);
    }
}

const Http2OverHttps = Http2OverHttp;
export { Http2OverHttp, Http2OverHttps };
