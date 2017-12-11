"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _fs = require("fs");var _fs2 = _interopRequireDefault(_fs);
var _path = require("path");var _path2 = _interopRequireDefault(_path);
var _buffer = require("buffer");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

class FileHelper {
    constructor() {

    }
    static cdn() {return '//192.168.7.171:8001';}
    /**
                                                   * 保存文件 返回promise
                                                   * @param {content, filename, encode = 'UTF8'} param0 
                                                   */
    static WriteFile({ Content, filename, encode = 'UTF8' }) {
        let self = this;
        return new Promise((resolve, reject) => {
            console.log(__dirname);
            console.log(__filename);
            let p = _path2.default.resolve(__dirname, '../webserver/uploadFile', filename);
            // console.log(p);
            // let buff=Buffer.from(Content,'utf8');
            // fs.writeFile(p,buff, (err) => {
            //     if(err){reject(err);return;}
            //     let fileUrl = self.cdn() + '/' + 'uploadFile' + '/' + filename;
            //     console.log(fileUrl);
            //     resolve(fileUrl);
            // })
            // stream.bytesWritten
            // var realContent;
            // if ((typeof Content) === "string") {
            //     realContent = Buffer.from(Content, 'UTF8')
            // }
            // else {
            // realContent = Content;
            // }
            let stream = _fs2.default.createWriteStream(p);
            stream.write(Content);

            // stream.write(Con)
            stream.end();
            stream.on("finish", function () {
                console.log('write finish');
                let fileUrl = self.cdn() + '/' + 'uploadFile' + '/' + filename;
                resolve(fileUrl);
            });
            stream.on("error", function (err) {console.log(err.stack);reject(err);});
        });
    }}exports.default =


FileHelper;

// FileHelper.WriteFile({Content:'123',filename:'tt.png',encode:'UTF8'}).then((f)=>{console.log(f)});
//# sourceMappingURL=file.js.map