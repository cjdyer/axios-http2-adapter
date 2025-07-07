"use strict";

export class ERR_INVALID_ARG_TYPE extends TypeError {
    constructor(argName, expectedTypes, receivedValue) {
        const type = argName.includes(".") ? "property" : "argument";
        const isManyTypes = Array.isArray(expectedTypes);
        const valid = isManyTypes
            ? `${expectedTypes
                  .slice(0, -1)
                  .join(", ")} or ${expectedTypes.slice(-1)}`
            : expectedTypes;

        super(
            `The "${argName}" ${type} must be ${
                isManyTypes ? "one of" : "of"
            } type ${valid}. Received ${typeof receivedValue}`
        );

        this.name = `${this.constructor.name} [ERR_INVALID_ARG_TYPE]`;
        this.code = "ERR_INVALID_ARG_TYPE";
    }
}

export class ERR_INVALID_PROTOCOL extends TypeError {
    constructor(actual, expected) {
        super(`Protocol "${actual}" not supported. Expected "${expected}"`);
        this.name = `${this.constructor.name} [ERR_INVALID_PROTOCOL]`;
        this.code = "ERR_INVALID_PROTOCOL";
    }
}

export class ERR_HTTP_HEADERS_SENT extends Error {
    constructor(action) {
        super(`Cannot ${action} headers after they are sent to the client`);
        this.name = `${this.constructor.name} [ERR_HTTP_HEADERS_SENT]`;
        this.code = "ERR_HTTP_HEADERS_SENT";
    }
}

export class ERR_INVALID_HTTP_TOKEN extends TypeError {
    constructor(name, token) {
        super(`${name} must be a valid HTTP token [${token}]`);
        this.name = `${this.constructor.name} [ERR_INVALID_HTTP_TOKEN]`;
        this.code = "ERR_INVALID_HTTP_TOKEN";
    }
}

export class ERR_HTTP_INVALID_HEADER_VALUE extends TypeError {
    constructor(value, name) {
        super(`Invalid value "${value} for header "${name}"`);
        this.name = `${this.constructor.name} [ERR_HTTP_INVALID_HEADER_VALUE]`;
        this.code = "ERR_HTTP_INVALID_HEADER_VALUE";
    }
}

export class ERR_INVALID_CHAR extends TypeError {
    constructor(location, char) {
        super(`Invalid character in ${location} [${char}]`);
        this.name = `${this.constructor.name} [ERR_INVALID_CHAR]`;
        this.code = "ERR_INVALID_CHAR";
    }
}

export class ERR_HTTP2_NO_SOCKET_MANIPULATION extends Error {
    constructor() {
        super(
            "HTTP/2 sockets should not be directly manipulated (e.g. read and written)"
        );
        this.name = `${this.constructor.name} [ERR_HTTP2_NO_SOCKET_MANIPULATION]`;
        this.code = "ERR_HTTP2_NO_SOCKET_MANIPULATION";
    }
}
