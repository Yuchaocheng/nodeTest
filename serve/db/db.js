const mysql = require('mysql')
const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: "123456",
        database: 'samp_db'
    })
    /* 封装数据库操作方法 query--用于增删改查 */
const query = (sql, sqlParams, callback) => {

    pool.getConnection((err, coon) => {
        if (err) {
            callback(err, null, null);
        } else {
            coon.query(sql, sqlParams, (qerr, vals, fields) => {
                //释放连接
                coon.release();
                //事件驱动回调
                callback(qerr, vals, fields)
            })
        }
    })
}
module.exports = query