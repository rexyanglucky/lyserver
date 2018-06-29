import DBHelper from "../db/mongo"
import { ObjectId } from 'mongodb';


class ArticleBll {
    constructor() {
        this.dbHelper = new DBHelper();
    }
    //#region 草稿操作
    /**
     * 
     * @param {Array} data -要保存的文章数据 {title:"",content:"",author:"",createTime:new Date(),updateTime:new Date()}
     */
    saveArticleDraft(...data) {
        return new Promise((resolve, reject) => {
            data.forEach(item => {
                if(item._id){
                    item._id = ObjectId(item._id);
                }
            });
            this.dbHelper.InsertDB({
                collectionName: "articleDraft", data: data, callback: (result) => {
                    resolve(result.insertedIds);
                }
            });
            
        })
        // this.dbHelper.InsertDB({
        //     collectionName: "articleDraft", data: data, callback: (result) => {
        //         callback(result.insertedIds);
        //     }
        // });
    }
    delArticleDraft(...id) {
        return new Promise((resolve, reject) => {
            this.dbHelper.DeleteDB({
                collectionName: "articleDraft", query: { _id: ObjectId(id[0]) }, callback: (result) => {
                    // callback(result);
                    resolve(result);
                }
            })
        })

    }
    /**
     * 根据ID获取草稿箱
     * @param {*} id 
     */
    getArticleDraft(...id) {
        return new Promise((resolve, reject) => {
            this.dbHelper.QueryDB({
                collectionName: "articleDraft", query: { _id: ObjectId(id[0]) }, callback: (result) => {
                    // callback(result);
                    resolve(result);
                }
            });
        })
    }
    /**
     * 获取草稿箱列表
     * @param {Array} id 
     */
    getArticleDraftList() {
        return new Promise((resolve, reject) => {
            this.dbHelper.QueryDB({
                collectionName: "article", query: {}, projection: { isMD: 0, createTime: 0 }, callback: (result) => {
                    resolve(result);
                }
            });
        });
    }
    //#endregion

    //#region online 文章操作
    /**
     * 获取文章
     * @param {Array} id 
     */
    getArticle(...id) {
        this.addVisitCount(id[0]);
        return new Promise((resolve, reject) => {
            this.dbHelper.QueryDB({
                collectionName: "article", query: { _id: ObjectId(id[0]) }, callback: (result) => {
                    // callback(result);
                    resolve(result);
                }
            });
        })
    }
    /**
     * 添加文章访问量 异步
     * @param {string} id 文章ID
     */
    addVisitCount(id) {
        try {
            this.dbHelper.UpdateDB({
                collectionName: 'article',
                data: { $inc : {'vcount' : 1} },
                query: { _id: ObjectId(id) },
                callback: result => { console.log('visit count') }
            })
        }
        catch (err) {
            console.log('add visit' + err.stack);
        }
    }

    /**
     * 获取文章列表
     * @param {Array} id 
     */
    //todo 根据post 条件获取列表
    getArticleList(param) {
        // let query = { where: {}, sort: {}, page: { currentPage: 1, pageSize: 10 } };
        // if (param) {
        //     if (param.author) {
        //         query.where[author] = param.author;
        //     }
        //     if (param.startDate) {
        //         query.where[crateTime] = { "$gte": param.startDate };
        //     }
        //     if (param.endDate) {
        //         query.where[crateTime] = { "$lte": param.endDate };
        //     }
        //     if (param.currentPage) {
        //         query.page[currentPage] = param.currentPage;
        //     }
        //     if (param.pageSize) {
        //         query.page[pageSize] = param.pageSize;
        //     }
        // }

        return new Promise((resolve, reject) => {
            this.dbHelper.QueryDB({
                collectionName: "article", query: {}, projection: { isMD: 0, createTime: 0 }, callback: (result) => {
                    // callback(result);
                    resolve(result);
                }
            });
        });
    }

    delArticle(...id) {
        const delPromise = new Promise((resolve, reject) => {
            this.dbHelper.DeleteDB({
                collectionName: "article", query: { _id: ObjectId(id[0]) }, callback: (result) => {
                    resolve()
                }
            })
        }
        );
        return delPromise.then(() => { this._updateArticleHistory(id[0]) }).catch(err => {
            console.log(err);
        });
    }
    /**
     * 从草稿箱复制数据到文章表 私有
     * @param {Array} data 文章详情
     */
    _saveArticle(data) {
        return new Promise((resolve, reject) => {
            this.dbHelper.InsertDB({
                collectionName: "article", data: data, callback: (result) => {
                    resolve(data);
                }
            });
        })

    }
    /**
     * 将指定草稿发布为文章
     * @param {string} id 
     */
    publicArticle(...id) {
        // const data= await this.getArticleDraft(id);
        // await this.saveArticle(data);
        // await this.saveArticleHistory(data);
        // await this.delArticleDraft(id);
        id = id[0];
        return this.getArticleDraft(id).then((data) => this._saveArticle(data))
            .then((data) => { this._saveArticleHistory(data) })
            .then(() => this.delArticleDraft(id));
    }
    /**
     * 更新文章，点击编辑时触发
     * @param {string} id 
     */
    updateArticle(...id) {
        id = id[0];
        //将文章复制到草稿箱，并返回数据详情，保存时将原文覆盖
        return this.getArticle(id)
            .then((data) => { this.saveArticleDraft(data) })
            .catch((err) => {
                console.log(err);
            });
    }
    //#endregion

    //#region 文章历史记录相关操作
    /**
     * 保存文章历史记录 私有
     * @param {object} data 文章对象 
     */
    _saveArticleHistory(data) {
        data[0].realid = data[0]._id;
        data[0].state = 'online';
        return new Promise((resolve, reject) => {
            this.dbHelper.InsertDB({
                collectionName: "articleHistory", data: data, callback: (result) => {
                    resolve();
                }
            });
        })

    }

    /**
     * 更新文章历史记录 私有
     * @param {string} realid 与线上文章关联ID 
     * @param {*} set 
     */
    _updateArticleHistory(realid, set) {
        return new Promise((resolve, reject) => {
            this.dbHelper.UpdateDB({
                collectionName: 'articleHistory',
                data: { $set: { state: 'offline' } },
                query: { realid: ObjectId(realid) },
                callback: (result) => {
                    resolve(result);
                }
            })
        });
    }
    /**
     * 获取历史文章列表
     * @param {Array} id 
     */
    getArticleHistoryList() {
        return new Promise((resolve, reject) => {
            this.dbHelper.QueryDB({
                collectionName: "articleHistory", query: {}, projection: { isMD: 0, createTime: 0 }, callback: (result) => {
                    resolve(result);
                }
            });
        });
    }
    //#endregion
}
export default ArticleBll;