"use strict";var _article = require("../../bll/article");var _article2 = _interopRequireDefault(_article);
var _stream = require("stream");
var _path = require("path");var _path2 = _interopRequireDefault(_path);
var _file = require("../../common/file");var _file2 = _interopRequireDefault(_file);
var _http = require("http");var _http2 = _interopRequireDefault(_http);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
let controller = {
    bll: new _article2.default(),
    token: { accessToken: { code: '', expire: 7200, getTime: new Date() }, jsapi_ticket: { code: '', expire: 7200, getTime: new Date() } },
    getjsapiticket(req, res, router) {

        let now = new Date();
        if (token.jsapi_ticket.code && token.jsapi_ticket.getTime.getTime() + expire * 1000 <= now.getTime()) {
            res.end(JSON.stringify({ code: 1, data: token.jsapi_ticket.code }));
        } else
        {
            this.getAccesssToken().then(code => {
                let jsapiTicketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${code}&type=jsapi`;
                _http2.default.get(jsapiTicketUrl, function (req, res) {
                    let result = '';
                    req.on('data', function (data) {
                        result += data;
                    });
                    req.on('end', function () {
                        if (typeof result === "string") {
                            result = JSON.parse(result);
                        }
                        token.accessToken.code = result.ticket;
                        token.accessToken.expire = result.expires_in;
                        res.end(JSON.stringify({ code: 1, data: token.jsapi_ticket.code }));
                    });
                    req.on('error', function (err) {
                        res.end(JSON.stringify({ code: 0, data: err }));
                    });
                });
            });


        }

    },
    getAccesssToken() {
        return new Promise((resolve, reject) => {
            let accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx932146c9470bf79cAPPID&secret=a60a48b54ad07a20e8d67fa070e8632e`;
            let now = new Date();
            if (token.accessToken.code && token.accessToken.getTime.getTime() + expire * 1000 <= now.getTime()) {
                resolve(token.accessToken.code);
            } else
            {
                _http2.default.get(accessTokenUrl, function (req, res) {
                    let result = '';
                    req.on('data', function (data) {
                        result += data;
                    });
                    req.on('end', function () {
                        if (typeof result === "string") {
                            result = JSON.parse(result);
                        }
                        token.accessToken.code = result.access_token;
                        token.accessToken.expire = result.expires_in;
                        resolve(token.accessToken.code);

                    });
                    req.on('error', function (err) {
                        reject(err);
                    });
                });
            }
        });


    } };



module.exports = controller;
//# sourceMappingURL=token.js.map