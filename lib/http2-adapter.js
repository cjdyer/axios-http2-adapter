"use strict";

import { getAdapter } from "axios";
import axiosHelpers from "./axios-functions.js";
import ClientRequest from "./wrapper/client-request.js";
import { wrap } from "follow-redirects";
import tls from "tls";

const { buildFullPath, kindOf, platform } = axiosHelpers;

/**
 * @param {tls.ConnectionOptions} options
 * @returns {Promise<boolean>} is http2 usage valid
 */
async function resolveHttp2ALPN(options = {}) {
    return await new Promise((resolve) => {
        const socket = tls.connect(options, () => {
            cleanup();
            resolve(socket.alpnProtocol === "h2");
        });

        const onFail = () => {
            cleanup();
            resolve(false);
        };

        const cleanup = () => {
            socket.off("timeout", onFail);
            socket.off("error", onFail);
        };

        socket.once("timeout", onFail);
        socket.once("error", onFail);
    });
}

const isHttp2AdapterSupported =
    typeof process !== "undefined" && kindOf(process) === "process";

export default isHttp2AdapterSupported &&
    (async (config) => {
        const httpAdapter = getAdapter("http");

        const fullPath = buildFullPath(
            config.baseURL,
            config.url,
            config.allowAbsoluteUrls
        );
        const parsed = new URL(
            fullPath,
            platform.hasBrowserEnv ? platform.origin : undefined
        );

        // http2 doesn't support unsecured connections
        if (parsed.protocol !== "https:") {
            return httpAdapter(config);
        }

        // Check for http2 support from the server
        const http2Support = await resolveHttp2ALPN({
            host: parsed.host,
            servername: parsed.hostname,
            port: parsed.port || 443,
            ALPNProtocols: ["h2", "http/1.1"],
            rejectUnauthorized: false,
        });

        if (http2Support === false) {
            return httpAdapter(config);
        }

        const requestRedirect = wrap({
            https: {
                request: (options, handleResponse) => {
                    const req = new ClientRequest(options, handleResponse);

                    const origOn = req.on.bind(req);
                    // Omit the socket.setKeepAlive axios action, as HTTP/2 sockets should not be manipulated directly.
                    req.on = (name, ...args) => {
                        if (name != "socket") {
                            return origOn(name, ...args);
                        }
                        return req;
                    };
                    return req;
                },
            },
        });

        return httpAdapter({
            ...config,
            transport: requestRedirect.https,
        });
    });
