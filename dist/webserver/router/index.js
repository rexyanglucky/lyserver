"use strict";var path = require("path");
var rurl = require("url"); //路由模块
var fs = require("fs"); //文件系统模块
class Router {
    // __proto__:Object.prototype,
    constructor() {
        this.area = "";
        this.controller = "home";
        this.action = "index";
        this.param = {};
    }
    /**
       * 解析URL 获取area,controller,action
       * @param {String} url -请求的url路径
       */
    //todo 根据参数或者特性来判断路由
    resolveUrl(url) {
        let rthis = this;
        let purl = rurl.parse(url);
        let originurl = purl.pathname;
        originurl = originurl.charAt(0) == "/" ? originurl.substring(1) : originurl;
        let arr = originurl.split('/');
        if (arr.length > 1) {
            rthis.area = arr.length > 2 ? arr[0] : "";
            rthis.controller = arr.length > 2 ? arr[1] : arr[0];
            rthis.action = arr.length > 2 ? arr[2] : arr[1];
        } else
        if (arr.length > 0) {rthis.controller = arr[0];}

    }
    /**
       * 渲染action
       * @param {IncomingMessage} req - 请求信息
       * @param {ServerResponse} res - 响应信息
       */
    redirectAction(req, res) {
        var rthis = this;
        //能否找到Action
        var findAction = false;
        var actionPath = path.resolve(__dirname, "..", rthis.area, "controller", rthis.controller + "Controller") + ".js";
        if (fs.existsSync(path.join(actionPath))) {
            var controllerFile = require(actionPath);
            if (controllerFile.hasOwnProperty(rthis.action)) {
                findAction = true;
            }
        }

        if (findAction) {
            var actionMethod = controllerFile[rthis.action];
            actionMethod.call(controllerFile, req, res, rthis);

            // actionMethod(req, res, rthis);
        } else
        {
            res.writeHead(500, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end("controller or action not config");
        }

    }}


module.exports = Router;
//# sourceMappingURL=index.js.map