"use strict";

import { getAdapter } from "axios";
import utils from "axios/unsafe/utils.js";
import buildFullPath from "axios/unsafe/core/buildFullPath.js";
import platform from "axios/unsafe/platform/index.js";
import followRedirects from "follow-redirects";
import http2 from "http2";
import tls from "tls";
import stream from "stream";

const { wrapRequest } = followRedirects;

function resolveALPN(options = {}) {
    return new Promise((resolve) => {
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

const sessionCache = new Map();

function getSession(origin) {
    if (sessionCache.has(origin)) {
        return sessionCache.get(origin);
    }

    const session = http2.connect(origin);

    session.on("error", () => {
        session.destroy();
        sessionCache.delete(origin);
    });

    sessionCache.set(origin, session);
    return session;
}

const isHttp2AdapterSupported =
    typeof process !== "undefined" && utils.kindOf(process) === "process";

// false is fallback to axios 'http' adapter
export default isHttp2AdapterSupported &&
    (async (config) => {
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
            return false;
        }

        // Check for http2 support from the server
        const http2Support = await resolveALPN({
            host: parsed.host,
            servername: parsed.hostname,
            port: parsed.port || 443,
            ALPNProtocols: ["h2", "http/1.1"],
            rejectUnauthorized: false,
        });

        if (http2Support === false) {
            return false;
        }

        const requestRedirect = wrapRequest({
            https: {
                request: (options, handleResponse) => {
                    const { protocol, hostname, port, path, headers, method } =
                        options;
                    const origin = `${protocol}//${hostname}${
                        port ? `:${port}` : ""
                    }`;

                    const session = getSession(origin);

                    const reqHeaders = {
                        ":method": method,
                        ":path": path,
                        ...headers,
                    };

                    const req = session.request(reqHeaders);

                    req.on("response", (headers) => {
                        const statusCode = headers[":status"];
                        const responseHeaders = { ...headers };
                        delete responseHeaders[":status"];

                        const res = new stream.Readable();
                        res.statusCode = statusCode;
                        res.headers = responseHeaders;
                        res._read = () => {};
                        req.pipe(res);
                        handleResponse(res);
                    });

                    req.on("error", (err) => {
                        req.destroy(err);
                    });

                    // Axios attaches `.on('socket')` for keep-alive, which HTTP/2 doesn't support
                    const origOn = req.on.bind(req);
                    req.on = (event, ...args) => {
                        if (event !== "socket") {
                            return origOn(event, ...args);
                        }
                        return req;
                    };

                    return req;
                },
            },
        });

        const httpAdapter = getAdapter("http");

        return httpAdapter({
            ...config,
            transport: requestRedirect.https,
        });
    });
