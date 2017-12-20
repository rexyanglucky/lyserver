import fs from "fs";
import path, { resolve } from 'path';
import { Buffer } from "buffer";

class FileHelper {
    constructor() {

    }
    // static cdn() { return '//192.168.7.171:8001'; }
    /**
     * 保存文件 返回promise
     * @param {content, filename, encode = 'UTF8'} param0 
     */
    static WriteFile({ Content, filename, encode = 'UTF8' }) {
        let self = this;
        return new Promise((resolve, reject) => {
            let p = path.resolve(__dirname, '../webserver/uploadFile', filename);
            // let buff=Buffer.from(Content,'utf8');
            // fs.writeFile(p,buff, (err) => {
            //     if(err){reject(err);return;}
            //     let fileUrl = self.cdn() + '/' + 'uploadFile' + '/' + filename;
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
            let stream = fs.createWriteStream(p);
            stream.write(Content);
            
            // stream.write(Con)
            stream.end();
            stream.on("finish", function () {
                console.log('write finish');
                let fileUrl = 'uploadFile' + '/' + filename;
                resolve(fileUrl);
            })
            stream.on("error", function (err) { console.log(err.stack); reject(err); })
        })
    }

}
export default FileHelper;

// FileHelper.WriteFile({Content:'123',filename:'tt.png',encode:'UTF8'}).then((f)=>{console.log(f)});