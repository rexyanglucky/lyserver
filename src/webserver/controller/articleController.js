import { default as Bll } from "../../bll/articleV2";
import { Stream } from "stream";
import path from 'path';
import FileHelper from "../../common/file";
import {jsonResult} from "../../common/jsonResult"
/** @namespace  */
let articleController = {
    bll: new Bll(),


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
                return FileHelper.WriteFile(item).then((url) => {
                    param[item.name] = url;
                })
            });
            let self = this;
            Promise.all(promiseList).then(() => {
                self.bll.saveArticle(
                    (result) => {
                        jsonResult(res, { code: 1, data: result })
                    },
                    param
                );
            }).catch(err => {

                jsonResult(res, { code: 4, data: err.stack })
            })
        }
        else {
            this.bll.saveArticle(
                (result) => {

                    jsonResult(res, { code: 1, data: result })
                },
                param
            );
        }
    },
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
    addDraft(req, res, router) {
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
                self.bll.saveArticleDraft(param).then(
                    (result) => {
                        jsonResult(res, { code: 1, data: result })
                    }
                )
            }).catch(err => {
                jsonResult(res, { code: 4, data: err.stack })
            })
        }
        else {
            this.bll.saveArticleDraft(param).then(
                (result) => {
                    jsonResult(res, { code: 1, data: result })
                }
            ).catch(err => {
                jsonResult(res, { code: 4, data: err.stack })
            })
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
        this.bll.getArticle(id).then(result => {
            jsonResult(res, { code: 1, data: result })
        });
    },
    /**
     * 发布文章
     * @param {*} req 
     * @param {*} res 
     * @param {*} router 
     */
    public(req, res, router) {
        let id = router.param.id;
        this.bll.publicArticle(id).then(result => {
            jsonResult(res, { code: 1, data: result });
        }).catch(err => {
            jsonResult(res, { code: 4, data: err.stack })
        })
    },
    /**
     * 获取草稿箱文章详情
     * @param {*} req 
     * @param {*} res 
     * @param {*} router 
     */
    draftDetial(req, res, router) {
        let id = router.param.id;
        this.bll.getArticleDraft(id).then(result => {
            jsonResult(res, { code: 1, data: result })
        });
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
        this.bll.getArticleList(param).then(
            (result) => {
                let content = result.content ? result.content.replace(/<\/?.+?>/g, "") : "";
                content = content.length > 100 ? content.substr(0, 100) + '...' : content;
                jsonResult(res, { code: 1, data: result })
            }
        );

    },
       /**
 * 获取草稿箱文章列表
 * @param {*} req 
 * @param {*} res 
 * @param {*} router 
 * @returns {object} {code:1,data:result}
 */
draftlist(req, res, router) {
    let param = router.param;
    this.bll.getArticleDraftList(param).then(
        (result) => {
            let content = result.content ? result.content.replace(/<\/?.+?>/g, "") : "";
            content = content.length > 100 ? content.substr(0, 100) + '...' : content;
            jsonResult(res, { code: 1, data: result })
        }
    );

},
      /**
 * 获取历史文章列表 统计还原用
 * @param {*} req 
 * @param {*} res 
 * @param {*} router 
 * @returns {object} {code:1,data:result}
 */
historylist(req, res, router) {
    let param = router.param;
    this.bll.getArticleHistoryList(param).then(
        (result) => {
            let content = result.content ? result.content.replace(/<\/?.+?>/g, "") : "";
            content = content.length > 100 ? content.substr(0, 100) + '...' : content;
            jsonResult(res, { code: 1, data: result })
        }
    );

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
        this.bll.delArticle(id).then(result => {
            jsonResult(res, { code: 1, data: result })
        });
    },
    /**
     * 更新文档 点击更新时触发
     * @param {*} req 
     * @param {*} res 
     * @param {*} router 
     */
    update(req,res,router){
        let id=router.param.id;
        this.bll.updateArticle(id).then(result=>{
            jsonResult(res, { code: 1, data: result })
        })
    }

    
}
module.exports = articleController;