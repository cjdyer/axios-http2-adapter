"use strict";

import assert from "assert";
import http from "http";
import https from "https";
import path from "path";
import fs from "fs";
import url from "url";
import axios from "axios";
import adapter from "../../lib/http2-adapter.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("HTTP2 Adapter for Axios", function () {
    let axiosInstance;

    beforeEach(function () {
        axiosInstance = axios.create({
            adapter,
        });
    });

    it("should make a successful HTTP/2 request", async function () {
        const response = await axiosInstance.get("https://google.com");
        assert.strictEqual(response.status, 200);
    });

    it("should fallback to HTTP/1.1 if HTTP/2 is not supported", async function () {
        const options = {
            key: fs.readFileSync(path.join(__dirname, "key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
        };

        https
            .createServer(options, function (req, res) {
                res.end();
            })
            .listen(4444);

        const response = await axiosInstance.get("https://localhost:4444/", {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });

        assert.strictEqual(response.status, 200);
    });

    it("should fallback to HTTP/1.1 if HTTPS is not selected", async function () {
        http.createServer(function (req, res) {
            res.end();
        }).listen(3001);

        const response = await axiosInstance.get("http://localhost:3001/");

        assert.strictEqual(response.status, 200);
    });
});
