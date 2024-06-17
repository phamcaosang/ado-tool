"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64Encode = void 0;
var buffer_1 = require("buffer");
var base64Encode = function (x) {
    return buffer_1.Buffer.from(x).toString("base64");
};
exports.base64Encode = base64Encode;
