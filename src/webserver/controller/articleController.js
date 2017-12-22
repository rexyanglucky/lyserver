import { default as Bll } from "../../bll/article";
import { Stream } from "stream";
import path from 'path';
import FileHelper from "../../common/file"
let controller = {
    bll: new Bll(),

    add(req, res, router) {
        let param = router.param;
        param.createTime = new Date().toUTCString();
        param.updateTime = new Date().toUTCString();
        if (router.files && router.files.length > 0) {
            let promiseList = router.files.map((item, index, arr) => { 
                return FileHelper.WriteFile(item).then((url) => {
                    param[item.name] = url;
                })
            });
            let self = this;
            Promise.all(promiseList).then(() => {
                self.bll.saveArticle(
                    (result) => {
                        res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
                        res.end(JSON.stringify({ code: 1, data: result }));
                    },
                    param
                );
            }).catch(err=>{
                res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
                res.end(JSON.stringify({ code: 1, data: err.stack }));
            })

        }
        else {
            console.log(param);
            this.bll.saveArticle(
                (result) => {
                    res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
                    res.end(JSON.stringify({ code: 1, data: result }));
                },
                param
            );
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
        this.bll.getArticle((result) => {
            res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end(JSON.stringify({ code: 1, data: result }));
        }, id)
    },
    list(req, res, router) {
        let param = router.param;
        this.bll.getArticleList((result) => {
            res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end(JSON.stringify({ code: 1, data: result }));
        }, param);

    },
    delete(req, res, router) {
        let id = router.param.id;
        this.bll.delArticle((result) => {
            res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
            res.end(JSON.stringify({ code: 1, data: result }));
        }, id)
    }


}
module.exports = controller;