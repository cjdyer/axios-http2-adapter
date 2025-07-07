const http2Adapter = require("axios-h2-adapter");
const assert = require("assert");

assert.strictEqual(typeof http2Adapter, "function");

console.log("CommonJS import test passed");
