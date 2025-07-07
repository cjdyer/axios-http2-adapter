"use strict";

import stream from "stream";
import tls from "tls";

// Really awesome hack.
export default new tls.TLSSocket(new stream.PassThrough())._handle._parentWrap
    .constructor;
