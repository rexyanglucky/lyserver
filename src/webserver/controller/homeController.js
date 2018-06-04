let controller={
    index(req,res,router){
        res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
        res.end(router.area+"controller"+router.controller+"action"+router.action);
    }
}

 module.exports=controller;
// export default controller;