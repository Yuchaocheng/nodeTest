var express = require('express');
var router = express.Router();
//引入数据库连接池，防止数据库超过最大连接数
const query = require('../db/db')

/* 新增or修改 */
router.use('/add', (req, res) => {
    let addSql = "INSERT INTO students (name,sex,age,telphone) VALUES(?,?,?,?);"
    let editSql = `update students set name = ?,sex = ?,age= ?,telphone= ? where id = ${req.body.id}`
    let sql = req.body.id ? editSql : addSql
    let sqlParams = [
        req.body.name,
        req.body.sex,
        req.body.age,
        req.body.telphone,
    ]
    query(sql, sqlParams, (err, result) => {
        if (err) {
            res.json({
                ok: false,
                message: req.body.id ? '修改失败！' : "添加失败！"
            })
        } else {
            res.json({
                ok: true,
                id: result.insertId,
                message: req.body.id ? '修改成功！' : "添加成功！"
            })
        }
        res.end()
    })
});
/* 删除 */
router.post('/delete', (req, res) => {
    let delSql = "delete from students where id=" + req.body.id;
    query(delSql, null, (err, rows, fields) => {
        if (err) {
            res.json({
                ok: false,
                message: '删除失败！',
                error: err
            })
        } else {
            res.json({
                ok: true,
                message: '删除成功！'
            })
        }
        res.end()
    })
});
/* 分页查询 */
router.post('/query', (req, res) => {
    let pageNo = req.body.pageNo;
    let pageSize = req.body.pageSize;
    let start = (pageNo - 1) * pageSize;
    let length = pageSize;
    /* 查询的时候必须将数据库数据全部查出，否则就不知道这个表格的total数量了 */
    // let sql = "select * from students limit " + start + ',' + length   //按条件查询
    let sql = "select * from students ORDER BY updateTime DESC" //查出所有数据，按更新时间排序
    query(sql, null, (err, rows, fields) => {
        if (err) {
            res.json({
                ok: false,
                message: '查询失败！',
                info: null
            })
        } else {
            /* 将从数据库查出来的所有表格数据过滤，取出需要的 */
            let total = rows.length
            let result = rows.splice(start, length);
            /* 如果查询结果为0，并且页码大于1，就让页码退一位 */
            if (result.length === 0 && pageNo > 1) {
                pageNo -= 1
                result = rows.splice((pageNo - 1) * pageSize, length)
            }
            res.json({
                ok: true,
                message: "查询成功！",
                info: {
                    data: result,
                    pageNo: pageNo,
                    total
                }
            })
        }
    })
});
/* 按id查询 */
router.post('/findById', (req, res) => {
    console.log(1111);
    let findSql = "select * from students where id = " + req.body.id
    query(findSql, null, (err, rows, fields) => {
        if (err) {
            res.json({
                ok: false,
                message: '查询失败！',
                error: err
            })
        } else {
            res.json({
                ok: true,
                info: rows[0],
                message: '查询成功！'
            })
        }
        res.end()
    })
})
module.exports = router;