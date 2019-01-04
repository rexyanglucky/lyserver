import fs from "fs";
import path, { resolve } from 'path';

const CONTENT_DISPOSITION = "Content-Disposition";
const ENTER_STR = "Content-Disposition";
const FILENAME = "filename";
const FORMNAME = "name=";
const NEWLINE = "\r\n\r\n";
const NEWLINEONE = "\r\n";
let Content_Disposition_Byte = Buffer.from(CONTENT_DISPOSITION, 'utf8');
let NEWLINE_BYTE = Buffer.from(NEWLINE, 'utf8');
let NEWLINEONE_BYTE = Buffer.from(NEWLINEONE, 'utf8');

function FileForm() {
    this.FormList = [];
    this.CurForm = {}
}
/*
Horspool 算法实现的快速子串匹配，这里用于在大Buffer中查找小Buffer
src_buf =大Buffer,  sub_buf=要找的小Buffer, start_index=起始位置，默认为0
*/

Buffer.prototype.IndexOfExt = function (sub_buf, start_index) {
    let src_buf = this;
    if (!Buffer.isBuffer(src_buf) || !Buffer.isBuffer(sub_buf)) return -1;

    var src_len = src_buf.length, sub_len = sub_buf.length, idx = start_index - 0;

    if (isNaN(idx) || idx < 0) idx = 0; // default

    if (src_len == 0 || sub_len == 0 || idx + sub_len > src_len) return -1;

    // 如果只是查找单个字符
    if (sub_len == 1) {
        for (var i = idx, c = sub_buf[0]; i < src_len; i++)
            if (src_buf[i] == c) return i;
        return -1;
    }

    // 如果只是比较 src_buf 的尾部是否与 sub_buf 相等
    if (idx + sub_len == src_len) {
        var i = idx + sub_len - 1;
        var j = sub_len - 1;
        for (; j > -1 && src_buf[i] == sub_buf[j]; j-- , i--);
        return (j == -1) ? idx : -1;
    }

    // Horspool 搜索算法
    var skip = new Array(256);     // 构造跳转表
    for (var i = 0; i < 256; i++) skip[i] = sub_len;
    for (var i = 0; i < sub_len - 1; i++) skip[sub_buf[i]] = sub_len - i - 1;

    for (var k = idx + sub_len - 1; k < src_len; k += skip[src_buf[k]]) {
        var i = k;
        var j = sub_len - 1;
        for (; j > -1 && src_buf[i] == sub_buf[j]; j-- , i--); // 回溯比较
        if (j == -1) return i + 1;
    }
    return -1;
}
/**
  * 
  * @param {Buffer} data 接收到的post数据 
  * @param {httpRequest} req  
  */
FileForm.GetFromList = function (data, req) {
    let boundaryArr = req.headers['content-type'].split(';')[1].split('=');
    let boundary = '--' + boundaryArr[1];
    let boundaryByte = Buffer.from(boundary, 'utf8');
    let scanIndex = 0;
    let objList = new Array();
    while (scanIndex < data.length) {
        let findIndex = data.IndexOfExt(boundaryByte, scanIndex);
        //查找到boundary
        if (findIndex > -1) {
            //boundary 前已无内容要处理
            if (findIndex - scanIndex == 0) {
                //查找当前 Content-Disposition
                findIndex = data.IndexOfExt(Content_Disposition_Byte, scanIndex);
                if (findIndex > -1) {
                    let descEnd = data.IndexOfExt(NEWLINE_BYTE, findIndex);
                    let desc = data.toString('utf8', findIndex, descEnd);
                    findIndex = descEnd;
                    let obj = { name: null, 'Content-Disposition': null, filename: null, 'Content-Type': null, Content: null };
                    let reg = /Content-Disposition: (form-data); name="(\S+)"(?:; (filename)="(\S+[.]\S{3,4})"\s+Content-Type: (\S+))?/gi
                    desc.replace(reg, function (matchstr, contentDisposition, name, filename, filenameValue, fileType, starIndex, sourceString) {
                        obj.name = name;
                        obj['Content-Disposition'] = contentDisposition;
                        obj[filename] = filenameValue;
                        obj['Content-Type'] = fileType;
                    })


                    // findIndex = data.IndexOfExt(NEWLINE_BYTE, findIndex);
                    let realDataEnd = data.IndexOfExt(boundaryByte, findIndex);
                    let realDataLength = realDataEnd - findIndex - NEWLINE_BYTE.length - NEWLINEONE_BYTE.length;
                    let realDataByte = Buffer.alloc(realDataLength);

                    data.copy(realDataByte, 0, findIndex + NEWLINE_BYTE.length, findIndex + NEWLINE_BYTE.length+realDataByte.length);
                    findIndex = realDataEnd;
                    obj.Content = realDataByte;
                    if (obj['Content-Type']) {
                        obj.Content = realDataByte;
                    }
                    else {
                        obj.Content = realDataByte.toString('utf8');
                    }
                    objList.push(obj);
                }
            }
            //boundary 前还有内容，需要追加到上一个表单数据中
            else {
                //todo
                break;
            }
        }
        else {
            break;
        }
        scanIndex = findIndex;
    }

    return objList;

}
/**
 * 
 */
FileForm.prototype.HandleChunkFrom = function(data, header) {
    let boundaryArr = header.split(';')[1].split('=');
    let boundary = '--' + boundaryArr[1];
    let boundaryByte = Buffer.from(boundary, 'utf8');
    let scanIndex = 0;
    while (scanIndex < data.length) {
        let findIndex = data.IndexOfExt(boundaryByte, scanIndex);
        if (findIndex > -1) {
            //boundary 前已无内容要处理
            if (findIndex - scanIndex === 0){
                //查找当前 Content-Disposition
                findIndex = data.IndexOfExt(Content_Disposition_Byte, scanIndex);
                if (findIndex > -1) {
                    let descEnd = data.IndexOfExt(NEWLINE_BYTE, findIndex);
                    let desc = data.toString('utf8', findIndex, descEnd);
                    findIndex = descEnd;
                    let obj = { name: null, 'Content-Disposition': null, filename: null, 'Content-Type': null, Content: null };
                    let reg = /Content-Disposition: (form-data); name="(\S+)"(?:; (filename)="(\S+[.]\S{3,4})"\s+Content-Type: (\S+))?/gi
                    desc.replace(reg, function (matchstr, contentDisposition, name, filename, filenameValue, fileType, starIndex, sourceString) {
                        obj.name = name;
                        obj['Content-Disposition'] = contentDisposition;
                        obj[filename] = filenameValue;
                        obj['Content-Type'] = fileType;
                    })
                    this.CurForm = obj;
                    if (obj['Content-Type']) {
                        this.CurForm.temp  = path.resolve(__dirname, '../webserver/temp', new Date().getTime().toString() + '_temp' + this.CurForm.filename);
                    }
                    else {
                        obj.Content = Buffer.alloc(0);
                    }
                    this.FormList.push(obj);
                    findIndex = findIndex + NEWLINE_BYTE.length;
                    
                    // continue;
                    // // findIndex = data.IndexOfExt(NEWLINE_BYTE, findIndex);
                    // let realDataEnd = data.IndexOfExt(boundaryByte, findIndex);
                    
                    // let realDataLength = realDataEnd - findIndex - NEWLINE_BYTE.length - NEWLINEONE_BYTE.length;
                    // let realDataByte = Buffer.alloc(realDataLength);

                    // data.copy(realDataByte, 0, findIndex + NEWLINE_BYTE.length, findIndex + NEWLINE_BYTE.length+realDataByte.length);
                    // findIndex = realDataEnd;
                    // if (obj['Content-Type']) {
                    //     this.CurForm.temp  = path.resolve(__dirname, '../webserver/temp', new Date().getTime().toString() + '_temp' + this.CurForm.filename);
                    //     fs.appendFileSync(this.CurForm.temp, realDataByte);
                    // }
                    // else {
                    //     obj.Content = realDataByte;
                    // }
                    // this.FormList.push(obj);
                } else {
                    break;
                }
            } else {
                // 上一节点的数据内容
                let lastDataByte = Buffer.alloc(findIndex - scanIndex);
                data.copy(lastDataByte, 0, scanIndex, findIndex);
                let obj = this.CurForm;
                if (obj['Content-Type']) {
                    fs.appendFileSync(this.CurForm.temp, lastDataByte);
                }
                else {
                    obj.Content = Buffer.concat([obj.Content,lastDataByte]);
                }
            }
            scanIndex = findIndex;
         
        } else {
            //如果没有boundary 追加到上一节点
            let lastDataByte = Buffer.alloc(data.length - scanIndex);
            data.copy(lastDataByte, 0, scanIndex, data.length);
            let obj = this.CurForm;
            if (obj['Content-Type']) {
                fs.appendFileSync(this.CurForm.temp, lastDataByte);
            }
            else {
                obj.Content.concat([lastDataByte]);
            }
            break;
        }
    }
    console.log('chunk handle complete');
}

module.exports = FileForm;
