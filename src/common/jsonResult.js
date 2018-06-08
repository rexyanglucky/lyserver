export function jsonResult(res,result) {
    res.writeHead(200, { 'Content-Type': 'text/plain;charset:utf-8' });
    res.end(JSON.stringify(result));
}
