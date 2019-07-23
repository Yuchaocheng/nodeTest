var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
/* 引入body-parser模块 解析post请求 */
const bodyParser = require('body-parser')
    //解决跨域
app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", '3.2.1');
        if (req.method == "OPTIONS") res.send(200); ///让options请求快速返回/
        else next();
    })
    /* 中间件 */
const jwt = require('jsonwebtoken')
const testFun = (req, res, next) => {
    /* 如果是登录的请求，不用验证token */
    if (req.path === '/login') {
        next()
        return
    }
    if (req.headers.cookie) {
        let cookieArr = req.headers.cookie.split(';');
        let reuslt = cookieArr.map(item => {
            let arr = item.split('=')
            return {
                name: arr[0].trim(), //去除两边的空格，确实会出现空格的情况，虽然我set的时候并没有空格
                value: arr[1],
            }
        });
        let tokenObj = reuslt.find(item => item.name === 'token')
        if (typeof tokenObj === 'undefined') {
            res.status(402).json({ error: 'token失效' });
            return
        }
        let token = tokenObj.value
        let secretOrPrivateKey = "suiyi"; // 这是加密的key（密钥） 
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
app.use(testFun);


/* 路由 */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studentsRouter = require('./routes/students')



/* 使用bodyParser，必须放在路由前，否则解析post方法在路由之后，这个就白写了 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/* 自带的 */
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/students', studentsRouter);


app.use(logger('dev'));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const query = require('./db/db.js')

module.exports = app;