"use strict";var _article = require("../../bll/article");var _article2 = _interopRequireDefault(_article);
var _stream = require("stream");
var _path = require("path");var _path2 = _interopRequireDefault(_path);
var _file = require("../../common/file");var _file2 = _interopRequireDefault(_file);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
let controller = {
    bll: new _article2.default(),

    add(req, res, router) {
        let param = router.param;
        param.createTime = new Date().toUTCString();
        param.updateTime = new Date().toUTCString();
        if (router.files && router.files.length > 0) {
            let promiseList = router.files.map((item, index, arr) => {
                return _file2.default.WriteFile(item).then(url => {
                    param[item.name] = url;
                });
            });
            console.log(param);
            let self = this;
            Promise.all(promiseList).then(() => {
                self.bll.saveArticle(
                result => {
                    res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
                    res.end(JSON.stringify({ code: 1, data: result }));
                },
                param);

            }).catch(err => {
                res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
                res.end(JSON.stringify({ code: 1, data: err.stack }));
            });

        } else
        {
            console.log(param);
            this.bll.saveArticle(
            result => {
                res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
                res.end(JSON.stringify({ code: 1, data: result }));
            },
            param);

        }
    },
    /**
        * 查看文章详情
        * @param {*} req 
        * @param {*} res 
        * @param {*} router 
        */
    detial(req, res, router) {
        let id = router.param.id;
        this.bll.getArticle(result => {
            res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end(JSON.stringify({ code: 1, data: result }));
        }, id);
    },
    list(req, res, router) {
        let param = router.param;
        this.bll.getArticleList(result => {
            res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end(JSON.stringify({ code: 1, data: result }));
        }, param);

    },
    delete(req, res, router) {
        let id = router.param.id;
        this.bll.delArticle(result => {
            res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end(JSON.stringify({ code: 1, data: result }));
        }, id);
    } };



module.exports = controller;
//# sourceMappingURL=articleController.js.map