import DBHelper from '../db/mongo';
import {ObjectId} from 'mongodb';
class dictBll{
 constructor(){
    this.dbHelper=new DBHelper();
 }
 categorylist(){
  return new Promise((resolve,reject)=>{
     this.dbHelper.QueryDB({
	     collectionName:'category',query:{},callback:(result)=>{
	     resolve(result);}
     })
  })
 }
 topicslist(){
  return new Promise((resolve,reject)=>{
     this.dbHelper.QueryDB({
	     collectionName:'topics',query:{},callback:(result)=>{
	     resolve(result);}
     })
   })
 }
 addTopic(...data){
  return new Promise((resolve,reject)=>{
  this.dbHelper.InsertDB({
	  collectionName:'topics',data:data,callback:(result)=>{
	  resolve(result);
	  }
   })
  })
 }

 addCategory(...data){
  return new Promise((resolve,reject)=>{
  this.dbHelper.InsertDB({
	  collectionName:'category',data:data,callback:(result)=>{
	  resolve(result);
	  }
   })
  })
 }
 delCategory(...id){
   return new Promise((resolve,reject)=>{
   this.dbHelper.DeleteDB(
    {
      collectionName:'category',
      query:{_id:ObjectId(id[0])},
      callback:result=>{resolve(result);}
    }
   )
   })
 }
}
export default dictBll
