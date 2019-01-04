import FileHelper from "../../common/file";
import {jsonResult} from "../../common/jsonResult"
/** @namespace  */
let testController = {
    add(req, res, router) {
        let param = router.param;
        if (router.files && router.files.length > 0) {
            let promiseList = router.files.map((item, index, arr) => {
                return FileHelper.WriteFile(item).then((url) => {
                    param[item.name] = url;
                })
            });
            Promise.all(promiseList).then(() => {
                jsonResult(res, { code: 1, data: result })
            }).catch(err => {
                jsonResult(res, { code: 4, data: err.stack })
            })
        }
        else {
            jsonResult(res, { code: 4, data: '文件为空' })
        }
    },
}
module.exports = testController;