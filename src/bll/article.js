import DBHelper from "../db/mongo"
import { ObjectId } from 'mongodb';


class ArticleBll {
    constructor() {
        this.dbHelper = new DBHelper();
    }
    /**
     * 
     * @param {Array} data -要保存的文章数据 {title:"",content:"",author:"",createTime:new Date(),updateTime:new Date()}
     * @param {Function} callback -成功回调函数
     */
    saveArticle(callback, ...data) {
        this.dbHelper.InsertDB({
            collectionName: "article", data: data, callback: (result) => {
                callback(result.insertedIds);
            }
        });
    }
    /**
     * 获取文章
     * @param {Array} id 
     */
    getArticle(callback, ...id) {
        this.dbHelper.QueryDB({
            collectionName: "article", query: { _id: ObjectId(id[0]) }, callback: (result) => {
                callback(result);
            }
        });
    }
    /**
 * 获取文章
 * @param {Array} id 
 */
    //todo 根据post 条件获取列表
    getArticleList(callback, param) {
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

        this.dbHelper.QueryDB({
            collectionName: "article", query: {}, callback: (result) => {
                callback(result);
            }
        });
    }

    delArticle(callback, ...id) {
        this.dbHelper.DeleteDB({
            collectionName: "article", query: { _id: ObjectId(id[0]) }, callback: (result) => {
                callback(result);
            }
        })
    }
}
export default ArticleBll;