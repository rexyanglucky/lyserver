"use strict";var _article = require("../../bll/article");var _article2 = _interopRequireDefault(_article);
var _stream = require("stream");
var _path = require("path");var _path2 = _interopRequireDefault(_path);
var _file = require("../../common/file");var _file2 = _interopRequireDefault(_file);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
/** @namespace  */
let articleController = {
    bll: new _article2.default(),


    /**
                                   * 添加文章
                                   * @param {*} req 
                                   * @param {*} res 
                                   * @param {*} router 
                                   * @param {Object} param 
                                   * {content:{type:string,desc:'内容'},
                                   * title:{type:string,desc:'标题'},
                                   * headImg:{type:[blob],desc:'图片'},
                                   * isMD:{type:boolean,desc:'是否是markdown'}}
                                   * @returns {object} {code:1,data:result}
                                   */
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
       * 获取文章详情
       * @param {*} req 
       * @param {*} res 
       * @param {*} router 
       * @param {string} id 文章ID
       * @returns {object} 
       * {content:{type:string,desc:'内容'},
       * title:{type:string,desc:'标题'},
       * headImg:{type:[blob],desc:'图片'},
       * isMD:{type:boolean,desc:'是否是markdown'}}
       */
    detial(req, res, router) {
        let id = router.param.id;
        this.bll.getArticle(result => {
            res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end(JSON.stringify({ code: 1, data: result }));
        }, id);
    },
    /**
       * 获取文章列表
       * @param {*} req 
       * @param {*} res 
       * @param {*} router 
       * @returns {object} {code:1,data:result}
       */
    list(req, res, router) {
        let param = router.param;
        this.bll.getArticleList(result => {
            let content = result.content ? result.content.replace(/<\/?.+?>/g, "") : "";
            content = content.length > 100 ? content.substr(0, 100) + '...' : content;

            res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end(JSON.stringify({ code: 1, data: result }));
        }, param);

    },
    /**
       * 删除文章
       * @param {*} req 
       * @param {*} res 
       * @param {*} router 
       * @param {string} id 文章ID
       */
    delete(req, res, router) {
        let id = router.param.id;
        this.bll.delArticle(result => {
            res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end(JSON.stringify({ code: 1, data: result }));
        }, id);
    } };

module.exports = articleController;
//# sourceMappingURL=articleController.js.map