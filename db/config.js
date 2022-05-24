const env = process.env.NODE_ENV // 环境参数
let MYSQL_CONF;
if(env==='dev'){
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3306',
    database: 'nodesql',
    connectionLimit:200
  }
}
if(env==='test'){
  MYSQL_CONF = {
    host: 'localhost',
    user: 'testsql',
    password: 'tPrMxyjTDmC6Zzbd',
    port: '3306',
    database: 'testsql',
    connectionLimit:200
  }
}

module.exports = {
  MYSQL_CONF
}