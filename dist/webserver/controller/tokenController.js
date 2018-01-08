"use strict";var _article = require("../../bll/article");var _article2 = _interopRequireDefault(_article);
var _stream = require("stream");
var _path = require("path");var _path2 = _interopRequireDefault(_path);
var _file = require("../../common/file");var _file2 = _interopRequireDefault(_file);
var _https = require("https");var _https2 = _interopRequireDefault(_https);
var _crypto = require("crypto");var _crypto2 = _interopRequireDefault(_crypto);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}


let controller = {
    bll: new _article2.default(),
    token: { accessToken: { code: '', expire: 7200, getTime: new Date() }, jsapi_ticket: { code: '', expire: 7200, getTime: new Date() } },
    getshareconfig(req, res, router) {
        let url = router.param.url;
        if (!url) {
            res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end(JSON.stringify({ code: 2, data: '参数错误' }));
            return false;
        }
        let timeStamp = parseInt(new Date().getTime() / 1000);
        let noncestr = "xiaoliangyu";
        // let appid = 'wx932146c9470bf79c';
        // let appSecret = 'a60a48b54ad07a20e8d67fa070e8632e';
        let appid = 'wx5be5cfaafdd810b4';
        let appSecret = 'd4624c36b6795d1d99dcf0547af5443d';

        this.getSignature(appid, appSecret, noncestr, timeStamp, url).then(data => {
            let result = { timestamp: timeStamp, nonceStr: noncestr, signature: data, appId: appid };
            res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end(JSON.stringify({ code: 1, data: result }));
        });

    },
    getJsapiTicket(appid, appSecret) {
        return new Promise((resolve, reject) => {
            let now = new Date();
            let token = this.token;
            if (token.jsapi_ticket.code && token.jsapi_ticket.getTime.getTime() + token.jsapi_ticket.expire * 1000 >= now.getTime()) {
                resolve(token.jsapi_ticket.code);
            } else
            {
                this.getAccesssToken(appid, appSecret).then(code => {
                    let jsapiTicketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${code}&type=jsapi`;
                    _https2.default.get(jsapiTicketUrl, function (treq, tres) {
                        let result = '';
                        treq.on('data', function (data) {
                            result += data;
                        });
                        treq.on('end', function () {
                            if (typeof result === "string") {
                                result = JSON.parse(result);
                            }
                            token.jsapi_ticket.code = result.ticket;
                            token.jsapi_ticket.expire = result.expires_in;
                            token.jsapi_ticket.getTime = new Date();
                            resolve(token.jsapi_ticket.code);

                        });
                        treq.on('error', function (err) {
                            reject(err);
                        });
                    });
                });


            }
        });


    },
    getAccesssToken(appId, appSecret) {
        let token = this.token;
        return new Promise((resolve, reject) => {
            // let accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx932146c9470bf79c&secret=a60a48b54ad07a20e8d67fa070e8632e`;
            let accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
            let now = new Date();
            if (token.accessToken.code && token.accessToken.getTime.getTime() + token.accessToken.expire * 1000 >= now.getTime()) {
                resolve(token.accessToken.code);
            } else
            {
                _https2.default.get(accessTokenUrl, function (treq, tres) {
                    let result = '';
                    treq.on('data', function (data) {
                        result += data;
                    });
                    treq.on('end', function () {
                        if (typeof result === "string") {
                            result = JSON.parse(result);
                        }
                        token.accessToken.code = result.access_token;
                        token.accessToken.expire = result.expires_in;
                        token.accessToken.getTime = new Date();
                        resolve(token.accessToken.code);

                    });
                    treq.on('error', function (err) {
                        reject(err);
                    });
                });
            }
        });


    },
    getSignature(appid, appSecret, nonceStr, timeStamp, url) {
        return new Promise((resolve, reject) => {
            this.getJsapiTicket(appid, appSecret).then(jsapi_ticket => {
                let signValue = "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + nonceStr + "&timestamp=" + timeStamp + "&url=" + url;
                let sha1 = _crypto2.default.createHash('sha1');
                sha1.update(signValue);
                let signature = sha1.digest('hex');
                resolve(signature);
            }).catch(err => {reject(err);});
        });
    } };




// controller.propotype.token={ accessToken: { code: '', expire: 7200, getTime: new Date() }, jsapi_ticket: { code: '', expire: 7200, getTime: new Date() } };
module.exports = controller;
//# sourceMappingURL=tokenController.js.map