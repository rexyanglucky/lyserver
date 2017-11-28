"use strict";var http = require('http');
var url = require("url"); //url模块
var fs = require("fs"); //文件系统模块
var p = require("path"); //路径
var querystring = require("querystring"); //参数  
var Router = require("./router"); //自定义路由

var MIME = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml",
    "htc": "text/x-component",
    "svg": "image/svg+xml" };

http.createServer(function (req, res) {
    if (req.url != "/favicon.ico") {
        var path = url.parse(req.url).path;
        if (path == "/") {
            path = "/index.html";
        }
        var fpath = p.join(__dirname, path);
        fs.exists(fpath, function (r) {
            if (r) {
                var t = fpath.substring(fpath.lastIndexOf(".") + 1).toLowerCase();
                switch (t) {
                    case "html":
                    case "htc":
                        setHtml(fpath, req, res);
                        break;
                    default:
                        setFile(fpath, req, res);
                        break;}


            } else
            {
                //todo 可为每个请求创建单独的上下文存储路由相关信息，目前暂且使用全局router
                //可测试多个请求下router值变化问题
                res.setHeader("Access-Control-Allow-Origin", "*");
                var router = new Router();
                if (req.method === "GET") {
                    let purl = url.parse(req.url);
                    router.param = querystring.parse(purl.query);
                    router.resolveUrl(req.url);
                    router.redirectAction(req, res);
                } else
                if (req.method === "POST") {
                    var arr = [];
                    req.on("data", d => {arr.push(d);});
                    req.on("end", () => {
                        let data = Buffer.concat(arr).toString(),ret;
                        try {
                            ret = JSON.parse(data);
                        } catch (err) {}
                        req.body = ret;
                        router.param = ret;
                        router.resolveUrl(req.url);
                        router.redirectAction(req, res);
                    });
                }

            }

        });

    } else
    {
        res.writeHead(200);
        res.end("favicon.ico");
    }

}).listen(8001);
console.log("http://127.0.0.1:8001");
/**
                                       * 设置html
                                       * @param {String} 文件路径 
                                       * @param {req} request 
                                       * @param {res} response 
                                       */
function setHtml(path, req, res) {
    fs.readFile(path, function (err, data) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end("加载文件失败");
        } else
        {
            var t = path.substring(path.lastIndexOf(".") + 1);
            if (MIME.hasOwnProperty(t)) {
                res.writeHead(200, { 'Content-Type': MIME[t] });
                res.end(data.toString());
            } else
            {
                res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
                res.end("文件类型错误" + t);
            }
        }

    });
}
/**
   * 处理二进制文件
   * @param {String} path 
   * @param {req} req 
   * @param {res} res 
   */
function setFile(path, req, res) {
    var data = fs.readFileSync(path, "binary");
    var t = path.substring(path.lastIndexOf(".") + 1);
    if (MIME.hasOwnProperty(t)) {
        res.writeHead(200, { 'Content-Type': MIME[t] });
        res.end(data, "binary");
    } else
    {
        res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
        res.end("文件类型错误" + t);
    }
}

function sleep(sleepTime) {
    for (var start = +new Date(); +new Date() - start <= sleepTime;) {}
}
//# sourceMappingURL=server.js.map