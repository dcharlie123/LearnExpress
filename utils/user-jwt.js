const jwt = require('jsonwebtoken'); // 引入验证jsonwebtoken模块
const expressJwt = require('express-jwt'); // 引入express-jwt模块
const { PRIVATE_KEY, JWT_EXPIRED } = require("./constant");
const jwtAuth = expressJwt({
  secret: PRIVATE_KEY,
  credentialsRequired: true,
  algorithms: ['HS256'],
  getToken: (req) => {
    if (req.headers.authorization) {
      return req.headers.authorization
    } else if (req.query && req.query.token) {
      return req.query.token
    }
  }
}).unless({
  path: [
    {url: /^\/uploads\/.*/, method: 'GET' },
    '/',
    '/api/login',
    '/api/register',
    '/api/getVersion'
  ]
})

function getToken(req) {
  return new Promise((resolve, reject) => {
    const token = req.get("Authorization");
    if (!token) {
      reject({ error: "token is null" })
    } else {
      const info = jwt.verify(token, PRIVATE_KEY);
      resolve(info);
    }

  })
}

function setToken(username, userid) {
  const token = jwt.sign(
    // payload：签发的 token 里面要包含的一些数据。
    { username, userid },
    // 私钥
    PRIVATE_KEY,
    // 设置过期时间
    { expiresIn: JWT_EXPIRED }
  )
  return token;
}
module.exports = {
  jwtAuth,
  setToken,
  getToken
}