import fs from "fs";
import path, { resolve } from 'path';
import { Buffer } from "buffer";

class FileHelper {
    constructor() {
       
    }
    static cdn(){return '//192.168.7.171:8001';}
    /**
     * 保存文件 返回promise
     * @param {content, filename, encode = 'UTF8'} param0 
     */
    static WriteFile({ Content, filename, encode = 'UTF8' }) {
        let self=this;
        return new Promise((resolve, reject) => {
            console.log(__dirname);
            console.log(__filename);
            let p = path.resolve(__dirname, '../webserver/uploadFile', filename);
            // console.log(p);
            // let buff=Buffer.from(Content,'utf8');
            // fs.writeFile(p,buff, (err) => {
            //     if(err){reject(err);return;}
            //     let fileUrl = self.cdn() + '/' + 'uploadFile' + '/' + filename;
            //     console.log(fileUrl);
            //     resolve(fileUrl);
            // })
// stream.bytesWritten
            let stream = fs.createWriteStream(p);
            stream.write(Content, 'UTF8');
            stream.end();
            stream.on("finish", function () {
                console.log('write finish');
                let fileUrl = self.cdn() + '/' + 'uploadFile' + '/' + filename;
                resolve(fileUrl);
            })
            stream.on("error", function (err) { console.log(err.stack);reject(err); })
        })
    }

}
export default FileHelper;

// FileHelper.WriteFile({Content:'123',filename:'tt.png',encode:'UTF8'}).then((f)=>{console.log(f)});