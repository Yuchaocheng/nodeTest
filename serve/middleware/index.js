/* 全局中间件 */
const jwt = require('jsonwebtoken')

function getCookie(cookie, name) {
    let cookieArr = cookie.split(';');
    let reuslt = cookieArr.map(item => {
        let arr = item.split('=')
        return {
            name: arr[0].trim(), //去除两边的空格，确实会出现空格的情况，虽然我set的时候并没有空格
            value: arr[1],
        }
    });
    let cookieObj = reuslt.find(item => item.name === name)
    if (typeof cookieObj === 'undefined') {
        return false
    } else {
        return cookieObj.value
    }

}
const checkCookie = (req, res, next) => {
    /* 如果是登录或者注册的请求，不用验证token */
    if (req.path === '/login' || '/users/addUser') {
        next()
        return
    }
    if (req.headers.cookie) {
        let token = getCookie(req.headers.cookie, 'token')
        if (token === false) {
            res.status(402).json({ error: 'token失效' });
            return
        }
        let secretOrPrivateKey = "key100"; // 这是加密的key（密钥）
        jwt.verify(token, secretOrPrivateKey, function(err, decode) {
            if (err) { //  时间失效的时候/ 伪造的token
                res.status(402).json({ error: 'token失效' });
            } else {
                next()
            }
        })
    } else {
        res.status(402).json({ error: 'token失效' });
    }

}
module.exports = {
    checkCookie,
    getCookie
}