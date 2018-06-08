'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.jsonResult = jsonResult;function jsonResult(res, result) {
    res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
    res.end(JSON.stringify(result));
}
//# sourceMappingURL=jsonResult.js.map