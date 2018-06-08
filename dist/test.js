'use strict';var _articleV = require('./bll/articleV2.js');var _articleV2 = _interopRequireDefault(_articleV);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const bll = new _articleV2.default();

//保存草稿箱
bll.saveArticleDraft(r => {console.log('saveArticleDraft-------------\n' + r);}, {
    title: 'testbll', content: 'testbllcontent', author: 'rex', createTime: new Date(), updateTime: new Date(), isMD: 1 });

// .then((id) => {
//     //发布文章
//     bll.publicArticle((r) => { console.log(r); }, id[0]);
// });

//发布文章
// bll.publicArticle((r) => { console.log(r); }, '5b19080e8587692cfdd0ff13');

//删除文章
// bll.delArticle('5b190d453c6d4c2f43c3cc8d').then((d)=>console.log(d));

//更新文章，将文章复制到草稿箱，并返回草稿箱数据 todo
// bll.updateArticle('5b190d453c6d4c2f43c3cc8d');


//获取个人草稿箱列表
// bll.getArticleDraftList('5b190d453c6d4c2f43c3cc8d').then((d)=>{console.log(d)});

//获取文章
// bll.getArticle('5b190d453c6d4c2f43c3cc8d').then((d)=>{console.log(d)});

//获取文章列表
// bll.getArticleDraftList().then(d=>{console.log(d)});


/*
1.保存草稿箱
2.发布文章
3.修改文章
4.删除文章
*/
//# sourceMappingURL=test.js.map