const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const bodyParser = require('body-parser');
//引入socket.js模块，否则它不会执行
const websocket = require('./socket.js')



//允许跨越
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", '3.2.1');
    if (req.method == "OPTIONS") res.send(200); ///让options请求快速返回/
    else next();
})

/* 中间件 */
const middleware = require('./middleware/index.js')
app.use(middleware.checkCookie);



/* 使用bodyParser，必须放在路由前，否则解析post方法在路由之后，这个就白写了 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/* 自带的 */
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));



/* 路由 */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const studentsRouter = require('./routes/students')

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/students', studentsRouter);


app.use(logger('dev'));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;