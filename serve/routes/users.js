var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var fs = require('fs')

var multipartMiddleware = multipart();
const query = require('../db/db')

/* GET users listing. */
/* 新增一个用户 */
router.post('/addUser', multipartMiddleware, async function(req, res, next) {
    let file = req.files.file
    let imgName = file.name
    let imgData = fs.readFileSync(file.path)
    let nameIsRepeated = false
    await new Promise(resolve => {
        query('select * from users', null, (err, result) => {
            if (err) {
                console.log(err, '获取用户表失败');
            } else {
                let searchUser = result.find(item => item.name === req.body.name)
                nameIsRepeated = typeof searchUser === 'undefined' ? false : true
                resolve()
            }
        })
    })
    if (nameIsRepeated) {
        res.json({
            ok: false,
            message: "用户名已存在"
        })
        res.end()
        return
    }
    await new Promise(resolve => {
        fs.writeFile(`./public/images/${imgName}`, imgData, err => {
            if (err) {
                console.log(err, 'err');
            } else {
                /* 删除原文件 */
                console.log('图片写入成功');
                fs.unlink(file.path, () => {})
                resolve()
            }
        })
    })
    let addSql = "insert into users (name,password,headImg) VALUES(?,?,?);"
    let sqlParams = [
        req.body.name,
        req.body.password,
        imgName,
    ]
    query(addSql, sqlParams, (err, result) => {
        if (err) {
            res.json({
                ok: false,
                message: "注册失败！"
            })
        } else {
            res.json({
                ok: true,
                message: "注册成功！"
            })
        }
        res.end()
    })
});


module.exports = router;