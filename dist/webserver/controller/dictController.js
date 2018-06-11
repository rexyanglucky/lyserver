"use strict";var _dict = require("../../bll/dict");var _dict2 = _interopRequireDefault(_dict);
var _jsonResult = require("../../common/jsonResult");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
/** @namespace  */
let dictController = {
    bll: new _dict2.default(),


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
        result => {
            (0, _jsonResult.jsonResult)(res, { code: 1, data: result });
        }).
        catch(err => {
            (0, _jsonResult.jsonResult)(res, { code: 4, data: err.stack });
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
        result => {
            (0, _jsonResult.jsonResult)(res, { code: 1, data: result });
        }).
        catch(err => {
            (0, _jsonResult.jsonResult)(res, { code: 4, data: err.stack });
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
        result => {
            (0, _jsonResult.jsonResult)(res, { code: 1, data: result });
        }).
        catch(err => {(0, _jsonResult.jsonResult)(res, { code: 4, data: err.stack });});

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
        result => {
            (0, _jsonResult.jsonResult)(res, { code: 1, data: result });
        }).
        catch(err => {(0, _jsonResult.jsonResult)(res, { code: 4, data: err.stack });});

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
            (0, _jsonResult.jsonResult)(res, { code: 1, data: result });
        });
    } };


module.exports = dictController;
//# sourceMappingURL=dictController.js.map