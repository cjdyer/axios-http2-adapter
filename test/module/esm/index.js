import assert from "assert";
import http2Adapter from "axios-h2-adapter";

assert.strictEqual(typeof http2Adapter, "function");

console.log("ESM importing test passed");
