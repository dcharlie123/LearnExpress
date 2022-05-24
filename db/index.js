const mysql = require('mysql');
const { MYSQL_CONF } = require('./config');
function connect() {
  return mysql.createPool(MYSQL_CONF)
}

// 新建查询连接
function querySql(sql) {
  const pool = connect();
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if(err) reject(err)
      try {
        conn.query(sql, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        })
      } catch (e) {
        reject(e);
      } finally {
        // 释放连接
        conn.release()
      }
    })
  })
}

// 查询一条语句
function queryOne(sql) {
  return new Promise((resolve, reject) => {
    querySql(sql).then(res => {
      console.log('res===', res)
      if (res && res.length > 0) {
        resolve(res[0]);
      } else {
        resolve(null);
      }
    }).catch(err => {
      reject(err);
    })
  })
}

module.exports = {
  querySql,
  queryOne
}