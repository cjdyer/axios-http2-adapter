# axios-http2-adapter

An HTTP/2-capable adapter for [Axios](https://github.com/axios/axios), providing automatic fallback
to HTTP/1.1 when HTTP/2 is unsupported or unavailable.

## ✨ Features

- Uses the HTTP/2 protocol for supported HTTPS endpoints
- Automatically falls back to HTTP/1.1 (over HTTPS or HTTP) when needed
- Seamlessly integrates with existing `axios` instances
- Compatible with both browser-like and Node.js environments

## 📦 Installation

```bash
npm install axios-h2-adapter
```

## 🚀 Usage
```js
import axios from "axios";
import adapter from "axios-h2-adapter";

const axiosInstance = axios.create({
  adapter,
});

const res = await axiosInstance.get("https://example.com");
console.log(res.status); // 200
```

You can also pass adapter inline:

```js
const res = await axios.get("https://example.com", {
  adapter,
});
```

## 🔍 Fallback Behavior

If the server supports HTTP/2, requests will use it automatically.

If HTTP/2 is not supported, it will gracefully fall back to HTTP/1.1.

Works for both HTTPS and HTTP requests (though HTTP/2 only applies to HTTPS).

## ✅ Tests

To run tests:

```bash
npm install
npm test
```
