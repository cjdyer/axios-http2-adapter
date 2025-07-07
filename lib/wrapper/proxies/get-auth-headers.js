"use strict";

export default (self) => {
    const { username, password } = self.proxyOptions.url;

    if (username || password) {
        const data = `${username}:${password}`;
        const authorization = `Basic ${Buffer.from(data).toString("base64")}`;

        return {
            "proxy-authorization": authorization,
            authorization,
        };
    }

    return {};
};
