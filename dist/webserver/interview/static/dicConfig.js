export default  {
    api: {
        // QA
        //host:'http://campusrd2.zhaopin.com:8097/api/',
        //DEV
        /* host:'http://campusrdiapi.zhaopin.com:8098/api/',
        host1:'http://campusrd2.zhaopin.com:8097/api/', */
        controllers: {
            //QA
            examRoom: 'ExamRoom',
            //DEV
            //examRoom:'InterviewExamRoom',
        },
        //QA 登录
        //svip:'http://campusrd2.zhaopin.com:8097/api/',
        //正式 登录
        svip: 'http://svip.zhaopin.com/api/',
        host: 'http://svip.zhaopin.com/api/',
        host1: 'http://svip.zhaopin.com/api/'
    },
    codeDic: [
        { '0': '失败' },
        { '1': '成功' }
    ],
    localStorageKey: {
        //考场搜索记录 key
        search_exam_key: 'search_exam_key',
        //候选人搜索记录 key
        search_resume_key: 'search_resume_key'
    },
    doMain: {
        url: 'http://campusimage.zhaopin.com/pic/'
    }

}
