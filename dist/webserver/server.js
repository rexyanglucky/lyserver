"use strict";var http = require('http');
var url = require("url"); //url模块
var fs = require("fs"); //文件系统模块
var p = require("path"); //路径
var querystring = require("querystring"); //参数  
var Router = require("./router"); //自定义路由
var FileFrom = require("../common/fileForm");
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
                // res.setHeader("Content-Type", "application/json;charset=utf-8");
                var router = new Router();
                if (req.method === "GET") {
                    let purl = url.parse(req.url);
                    router.param = querystring.parse(purl.query);
                    router.resolveUrl(req.url);
                    router.redirectAction(req, res);
                } else
                if (req.method === "POST") {
                    var arr = [];
                    req.on("data", d => {arr.push(d);console.log(d);});
                    req.on("end", () => {

                        //判断请求是否包含文件
                        //TODO 接收大文件时，一次性存入内存性能太低
                        if (req.headers['content-type'].indexOf('multipart/form-data') > -1) {
                            let bufferData = Buffer.concat(arr);
                            let objList = FileFrom.GetFromList(bufferData, req);
                            // let data = bufferData.toString(), ret;
                            // // let contentType = req.headers['content-type'].split(';');
                            // let boundaryArr = req.headers['content-type'].split(';')[1].split('=');
                            // let boundary = '--' + boundaryArr[1];
                            // let formItemArr = data.split(boundary);
                            // let objList = formItemArr.map((item, index, arr) => {
                            //     let reg = /Content-Disposition: (form-data); name="(\S+)"(?:; (filename)="(\S+[.]\S{3,4})"\s+Content-Type: (\S+))?/gi
                            //     // item.replace(/Content-Disposition: (form-data); name="(\s+)"; (filename)="(\s+[.]\s{3-4})"/)
                            //     let obj = { name: null, 'Content-Disposition': null, filename: null, 'Content-Type': null, Content: null };
                            //     let carr = item.split('\r\n\r\n');
                            //     let cdisc = carr[0];
                            //     cdisc.replace(reg, function (matchstr, contentDisposition, name, filename, filenameValue, fileType, starIndex, sourceString) {
                            //         obj.name = name;
                            //         obj['Content-Disposition'] = contentDisposition;
                            //         obj[filename] = filenameValue;
                            //         obj['Content-Type'] = fileType;
                            //     })
                            //     carr.splice(0, 1);
                            //     let cvalue = carr.join('');
                            //     obj.Content = cvalue.substr(0, cvalue.length - '\r\n'.length);
                            //     return obj;
                            // })
                            // console.log(objList);
                            router.files = [];
                            objList.map((item, index, arr) => {
                                if (item.name) {
                                    if (item.filename) {
                                        router.files.push(item);
                                    } else
                                    {
                                        router.param[item.name] = item.Content;
                                    }
                                }
                            });
                            // router.files = [];
                            // router.files.push({Content:data,filename:'b.txt'});
                        } else
                        {
                            let data = Buffer.concat(arr).toString(),ret;
                            try {
                                ret = JSON.parse(data);
                            } catch (err) {}
                            req.body = ret;
                            router.param = ret;
                        }
                        router.resolveUrl(req.url);
                        router.redirectAction(req, res);
                    });
                } else
                if (req.method === "OPTIONS") {
                    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
                    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, accept, origin, content-type");
                    res.setHeader("X-Powered-By", ' 3.2.1');
                    res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
                    res.end("OPTIONS");
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