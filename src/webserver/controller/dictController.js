import { default as Bll } from "../../bll/dict";
import { jsonResult } from "../../common/jsonResult"
/** @namespace  */
let dictController = {
    bll: new Bll(),


    /**
     * 添加标签
     * @param {*} req 
     * @param {*} res 
     * @param {*} router 
     * @param {Object} param 
     * @returns {object} {code:1,data:result}
     */
    addTopic(req, res, router) {
        let param = router.param;
        this.bll.addTopic(param).then(
            (result) => {
                jsonResult(res, { code: 1, data: result })
            }
        ).catch(err => {
            jsonResult(res, { code: 4, data: err.stack })
        });

    },
    /**
     * 添加分类
     * @param {*} req 
     * @param {*} res 
     * @param {*} router 
     */
    addCategory(req, res, router) {
        let param = router.param;
        this.bll.addCategory(param).then(
            (result) => {
                jsonResult(res, { code: 1, data: result })
            }
        ).catch(err => {
            jsonResult(res, { code: 4, data: err.stack })
        });

    },
    /**
     * 获取标签列表
     * @param {*} req 
     * @param {*} res 
     * @param {*} router 
     * @returns {object} {code:1,data:result}
     */
    topicslist(req, res, router) {
        let param = router.param;
        this.bll.topicslist(param).then(
            (result) => {
                jsonResult(res, { code: 1, data: result })
            }
        ).catch(err => { jsonResult(res, { code: 4, data: err.stack }) });

    },
    /**
     * 获取分类列表
     * @param {*} req 
     * @param {*} res 
     * @param {*} router 
     */
    categorylist(req, res, router) {
        let param = router.param;
        this.bll.categorylist(param).then(
            (result) => {
                jsonResult(res, { code: 1, data: result })
            }
        ).catch(err => { jsonResult(res, { code: 4, data: err.stack }) });

    },

    /**
     * 删除分类
     * @param {*} req 
     * @param {*} res 
     * @param {*} router 
     * @param {string} id 文章ID
     */
    deleteCategroy(req, res, router) {
        let id = router.param.id;
        this.bll.delCategory(id).then(result => {
            jsonResult(res, { code: 1, data: result })
        });
    }

}
module.exports = dictController;