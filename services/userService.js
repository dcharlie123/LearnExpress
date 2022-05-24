const { querySql, queryOne } = require('../db/index');
const { validationResult } = require('express-validator');
const boom = require('boom');
const md5 = require('../utils/md5');
const { setToken } = require('../utils/user-jwt');
const {
  CODE_ERROR,
  CODE_SUCCESS
} = require('../utils/constant');
function login(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
    next(boom.badRequest(msg));
  } else {
    let { username, password } = req.body;
    password = md5(password);
    const query = `select * from users where username='${username}' and password='${password}'`;
    querySql(query)
      .then(user => {
        if (!user || user.length === 0) {
          res.json({
            code: CODE_ERROR,
            msg: '用户名或密码错误',
            data: null
          })
        } else {
          let [{ username, id: userid }] = user;
          const token = setToken(username, userid);
          res.json({
            code: CODE_SUCCESS,
            msg: '登录成功',
            data: {
              token,
              username
            }
          })
        }
      })
  }
}
function register(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { username, password } = req.body;
    // 查询是否注册过
    const query = `select id, username from users where username='${username}'`;
    queryOne(query).then(data => {
      if (data) {
        res.json({
          code: CODE_ERROR,
          msg: '用户已存在',
          data: null
        })
      } else {
        password = md5(password);
        const queryInsert = `insert into users(username, password) values('${username}', '${password}')`;
        querySql(queryInsert)
          .then(result => {
            if (!result || result.length === 0) {
              res.json({
                code: CODE_ERROR,
                msg: '注册失败',
                data: null
              })
            } else {
              const queryUser = `select * from users where username='${username}' and password='${password}'`;
              querySql(queryUser)
                .then(user => {
                  let [{ username, id: userid }] = user;
                  const token = setToken(username, userid);
                  res.json({
                    code: CODE_SUCCESS,
                    msg: '注册成功',
                    data: {
                      token,
                      username
                    }
                  })
                })
            }
          })
      }
    })
  }
}
module.exports = {
  login,
  register
}