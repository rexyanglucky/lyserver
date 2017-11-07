'use strict';Object.defineProperty(exports, "__esModule", { value: true });


var _mongodb = require('mongodb');
const DB_CONN_STR = 'mongodb://localhost:27017/lyapp'; /*
                                                        author:mongo helper
                                                       */class MongodbHelper {constructor() {

    } // console.log(MongoClient);
    /**
     * 连接数据库
     * @param {callback} callback 
     */
    Connect(callback) {
        console.log("start connect");
        _mongodb.MongoClient.connect(DB_CONN_STR, (err, db) => {
            console.log("connected");
            //调用业务处理逻辑，并将处理结果回调，关闭连接
            callback(db, (err, result, cb) => {
                db.close();
                if (err) {
                    console.log("Error:" + err);
                } else
                {
                    console.log(result);
                }
                if (cb) {
                    cb(result);
                }


            });
        });
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
                    } else
                    {
                        completeCallback(err, result, callback);
                        console.log("insert successful");
                    }
                });
            } else
            {
                console.error("collectionName is unvlidate");
            }
        }
        this.Connect(c);
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
                    } else
                    {
                        completeCallback(err, result, callback);
                        console.log("Delete successful");
                    }
                });
            } else
            {
                console.error("collectionName is unvlidate");
            }
        }
        this.Connect(c);

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
                    } else
                    {
                        completeCallback(err, result, callback);
                        console.log("update successful");
                    }
                });
            } else
            {
                console.error("collectionName is unvlidate");
            }
        }
        this.Connect(c);
    }
    /**
       * 查询数据
       * @param {*} param0 
       */
    QueryDB({ collectionName, query, callback }) {
        function c(db, completeCallback) {
            if (collectionName && query) {
                let collection = db.collection(collectionName);
                collection.find(query).sort({ updateTime: 1 }).limit.toArray((err, result) => {
                    ////查询成功回调
                    if (err) {
                        completeCallback(err, result, callback);
                    } else
                    {
                        completeCallback(err, result, callback);
                        console.log("query successful");
                    }
                });
            } else
            {
                console.error("collectionName is unvlidate");
            }
        }
        this.Connect(c);

    }
    /**
      * 查询数据
      * @param {*} param0 
      */
    QueryDBList({ collectionName, query, callback }) {
        function c(db, completeCallback) {
            if (collectionName && query) {
                let collection = db.collection(collectionName);
                collection.find(query).sort({ updateTime: 1 }).limit.toArray((err, result) => {
                    ////查询成功回调
                    if (err) {
                        completeCallback(err, result, callback);
                    } else
                    {
                        completeCallback(err, result, callback);
                        console.log("query successful");
                    }
                });
            } else
            {
                console.error("collectionName is unvlidate");
            }
        }
        this.Connect(c);

    }}exports.default =

MongodbHelper;
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
//# sourceMappingURL=mongo.js.map