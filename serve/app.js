var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var middleware = require('./middleware/index.js')
const bodyParser = require('body-parser')
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
app.use(middleware.checkCookie);


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