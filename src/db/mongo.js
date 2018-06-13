/*
 author:mongo helper
*/
import { MongoClient } from 'mongodb';
// const DB_CONN_STR = 'mongodb://localhost:27017/lyapp';
// const DB_CONN_STR = 'mongodb://rex:rex123@127.0.0.1:27017/lyapp';
const DB_CONN_STR = 'mongodb://rex:rex123@47.96.6.140:27017/lyapp';

class MongodbHelper {
    constructor() {
        // console.log(MongoClient);
    }

    /**
     * 连接数据库
     * @param {successCallBack} successCallBack 连接成功回调
     * @param {errCallBack} errCallBack         连接失败回调
     */
    Connect(successCallBack, errCallBack) {
        console.log("start connect");
        MongoClient.connect(DB_CONN_STR, (err, db) => {
            if (err) {
                console.log("connect failed");
                errCallBack && errCallBack(err);
            }
            else {
                console.log("connected");
                //调用业务处理逻辑，并将处理结果回调，关闭连接
                try {
                    successCallBack(db, (err, result, cb) => {
                        db.close();
                        if (err) {
                            console.log("Error:" + err);
                            cb && cb(err)
                        }
                        else {
                            cb && cb(result);
                        }
                    });
                }
                catch (e) {
                    console.log(e);
                }
            }
        })

    }
    /**
     * 插入数据
     * @param {*} param0 
     */
    InsertDB({ collectionName, data, callback }) {
        function c(db, completeCallback) {
            if (collectionName && data) {
                let collection = db.collection(collectionName);
                collection.insert(data, (err, result) => {
                    //插入成功回调
                    if (err) {
                        completeCallback(err, result, callback);
                    }
                    else {
                        completeCallback(err, result, callback);
                        console.log("insert successful");
                    }
                });
            }
            else {
                console.error("collectionName is unvlidate");
            }
        }
        //前台传递过来的回调函数，用于将连接异常返回给前台
        this.Connect(c, callback);
    }
    /**
     * 删除数据
     * @param {*} param0 
     */
    DeleteDB({ collectionName, query = "", callback }) {
        function c(db, completeCallback) {
            if (collectionName && query) {
                let collection = db.collection(collectionName);
                collection.remove(query, (err, result) => {
                    ////删除成功回调
                    if (err) {
                        completeCallback(err, result, callback);
                    }
                    else {
                        completeCallback(err, result, callback);
                        console.log("Delete successful");
                    }
                });
            }
            else {
                console.error("collectionName is unvlidate");
            }
        }
        this.Connect(c, callback);

    }
    /**
   * 更改数据
   * @param {*} param0 
   */
    UpdateDB({ collectionName, data, query = "", callback }) {
        function c(db, completeCallback) {
            if (collectionName && data) {
                let collection = db.collection(collectionName);
                collection.update(query, data, (err, result) => {
                    //插入成功回调
                    if (err) {
                        completeCallback(err, result, callback);
                    }
                    else {
                        completeCallback(err, result, callback);
                        console.log("update successful");
                    }
                });
            }
            else {
                console.error("collectionName is unvlidate");
            }
        }
        this.Connect(c, callback);
    }
    /**
     * 查询数据
     * @param {*} param0 
     */
    QueryDB({ collectionName, query, projection, callback, limit = 1000, skip = 0 }) {
        function c(db, completeCallback) {
            if (collectionName && query) {
                let collection = db.collection(collectionName);
                collection.find(query, projection).sort({ updateTime: -1 }).limit(limit).skip(skip).toArray((err, result) => {
                    ////查询成功回调
                    if (err) {
                        completeCallback(err, result, callback);
                    }
                    else {
                        completeCallback(err, result, callback);
                        console.log("query successful");
                    }
                });
            }
            else {
                console.error("collectionName is unvlidate");
            }
        }
        this.Connect(c, callback);

    }
    /**
   * 查询数据
   * @param {*} param0 
   */
    QueryDBList({ collectionName, query, callback }) {
        function c(db, completeCallback) {
            if (collectionName && query) {
                let collection = db.collection(collectionName);
                collection.find(query).sort({ updateTime: 1 }).toArray((err, result) => {
                    ////查询成功回调
                    if (err) {
                        completeCallback(err, result, callback);
                    }
                    else {
                        completeCallback(err, result, callback);
                        console.log("query successful");
                    }
                });
            }
            else {
                console.error("collectionName is unvlidate");
            }
        }
        this.Connect(c, callback);

    }
}
export default MongodbHelper;
//#region test
// var m = new MongodbHelper();
// m.InsertDB("abc","abc");
//  m.DeleteDB({ collectionName: "abc", query: { content: 'update' } });
// m.InsertDB({
//     collectionName: "abc", data: [{ name: "frist", content: "1124524545" },
//     { name: "frist", content: "1124524545" },
//     { name: "frist", content: "1124524545" },
//     { name: "frist", content: "1124524545" }]
// });

// m.QueryDB({ collectionName: "abc", query: { name: 'frist' } });
// m.UpdateDB({ collectionName: "abc", data: [{ $set: { content: "update" } }], query: {} });
//#endregion
