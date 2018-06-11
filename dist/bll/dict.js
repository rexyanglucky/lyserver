'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _mongo = require('../db/mongo');var _mongo2 = _interopRequireDefault(_mongo);
var _mongodb = require('mongodb');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
class dictBll {
  constructor() {
    this.dbHelper = new _mongo2.default();
  }
  categorylist() {
    return new Promise((resolve, reject) => {
      this.dbHelper.QueryDB({
        collectionName: 'category', query: {}, callback: result => {
          resolve(result);} });

    });
  }
  topicslist() {
    return new Promise((resolve, reject) => {
      this.dbHelper.QueryDB({
        collectionName: 'topics', query: {}, callback: result => {
          resolve(result);} });

    });
  }
  addTopic(...data) {
    return new Promise((resolve, reject) => {
      this.dbHelper.InsertDB({
        collectionName: 'topics', data: data, callback: result => {
          resolve(result);
        } });

    });
  }

  addCategory(...data) {
    return new Promise((resolve, reject) => {
      this.dbHelper.InsertDB({
        collectionName: 'category', data: data, callback: result => {
          resolve(result);
        } });

    });
  }
  delCategory(...id) {
    return new Promise((resolve, reject) => {
      this.dbHelper.DeleteDB(
      {
        collectionName: 'category',
        query: { _id: (0, _mongodb.ObjectId)(id[0]) },
        callback: result => {resolve(result);} });


    });
  }}exports.default =

dictBll;
//# sourceMappingURL=dict.js.map