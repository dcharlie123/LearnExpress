const path = require('path')
module.exports = {
  CODE_ERROR: -1, // 请求响应失败code码
  CODE_SUCCESS: 0, // 请求响应成功code码
  CODE_TOKEN_EXPIRED: 401, // 授权失败
  PRIVATE_KEY: 'node_token', // 自定义jwt加密的私钥
  JWT_EXPIRED: 60 * 60 * 24, // 过期时间24小时
  FILE_DIR:path.resolve(__dirname,'../uploads/')
} 