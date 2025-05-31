import { getAdapter } from 'axios';
import * as http2 from 'http2-wrapper';
import { wrap } from 'follow-redirects';

export function createHTTP2Adapter(adapterConfig = {}) {
    return (config) => http2Adapter(config, adapterConfig);
}

async function http2Adapter(config, adapterConfig) {
    const adapter = getAdapter('http');

    if (await shouldUseHTTP2(config, adapterConfig)) {
        const http2Config = createHTTP2Config(config, adapterConfig);
        return adapter(http2Config);
    } else {
        return adapter(config);
    }
}

async function shouldUseHTTP2(config, adapterConfig) {
    if (adapterConfig.force) {
        return true;
    }
    return await isHTTP2Supported(config);
}

async function isHTTP2Supported(config) {
    const url = new URL(config.url, config.baseURL);

    // HTTP2 doesn't support not secured connection.
    if (!url.protocol.startsWith('https:')) {
        return false;
    }

    try {
        const res = await http2.auto.resolveProtocol({
            host: url.host,
            servername: url.hostname,
            port: url.port || 443,
            ALPNProtocols: ['h2', 'http/1.1'],
            rejectUnauthorized: false,
        });

        return res.alpnProtocol === 'h2';
    } catch (e) {
        return false;
    }
}

function createHTTP2Config(config, adapterConfig) {
    const requestWrappedWithRedirects = wrap({
        https: {
            request: (options, handleResponse) => {
                if (adapterConfig.agent) {
                    // @ts-expect-error Typing are not aware of agent prop, but it actually works
                    // https://github.com/szmarczak/http2-wrapper?tab=readme-ov-file#new-http2agentoptions
                    options.agent = adapterConfig.agent;
                }

                const req = http2.request(options, handleResponse);

                const origOn = req.on.bind(req);
                // Omit the socket.setKeepAlive axios action, as HTTP/2 sockets should not be manipulated directly.
                req.on = (name, ...args) => {
                    if (name != 'socket') {
                        return origOn(name, ...args);
                    }
                    return req;
                };
                return req;
            },
        },
    });

    return { ...config, transport: requestWrappedWithRedirects.https };
}
