var express = require('express');
var router = express.Router();
const query = require('../db/db')
const jwt = require('jsonwebtoken')
const Base64 = require('../plugin/base64').Base64

function resFun() {}
/* GET home page. */
router.get('/', function(req, res) {
    res.send('Welcome Express!');
});
/* 登录 */
router.post('/login', (req, res) => {
    //取出数据库中所有的用户
    let name = req.body.name;
    let password = req.body.password //加密的密码
    let currentPswd = Base64.decode(password) //解密的密码
    query('select * from users', null, (err, result) => {
        if (err) {
            res.json({
                ok: false,
                message: '登录失败'
            })
        } else {
            let message = "";
            let token = "";
            let ok = null;
            let user = result.find(item => item.name === name)
            if (typeof user === "undefined") {
                message = "此用户不存在"
                ok = false;
            } else {
                if (user.password === currentPswd) {
                    message = "登录成功"
                    ok = true;
                    let content = { name: req.body.name }; // 要生成token的主题信息
                    let secretOrPrivateKey = 'key100' // 这是加密的key（密钥）
                    token = jwt.sign(content, secretOrPrivateKey, {
                        expiresIn: 60 * 60 * 1 // 1小时过期
                    });
                } else {
                    message = "密码不正确"
                    ok = false;
                }
            }
            res.json({
                ok,
                message,
                token: token || null
            })
        }
        res.end()
    })
});
/* 页面刷新时验证身份,没有被中间件拦截就是通过验证了 */
router.get('/check', (req, res) => {
    res.send({
        ok: true
    })
})

module.exports = router;