'use strict';var _article = require('../../bll/article');var _article2 = _interopRequireDefault(_article);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
console.log(_article2.default);
let controller = {
    bll: new _article2.default(),

    add(req, res, router) {
        let param = router.param;
        param.createTime = new Date().toUTCString();
        param.updateTime = new Date().toUTCString();
        console.log(param);
        this.bll.saveArticle(
        result => {
            res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end(JSON.stringify({ code: 1, data: result }));
        },
        // {
        //     title: "公交卡",
        //     content: "公交卡好蓝啊",
        //     author: "rex",
        //     createTime: new Date().toUTCString(),
        //     updateTime: new Date().toUTCString()
        // }
        param);

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

    } };



module.exports = controller;
//# sourceMappingURL=articleController.js.map