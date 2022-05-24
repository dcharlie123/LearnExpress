const express = require('express');
const userRouter = require('./users');
const listRouter = require('./list');
const uploadRouter= require('./upload');
const router = express.Router();
const { jwtAuth } = require('../utils/user-jwt');
router.use(jwtAuth)
router.use('/api', userRouter);
router.use('/api', listRouter);
router.use('/api', uploadRouter);

router.use((err, req, res, next) => {
  // console.log('err', err);
  if (err && err.name === 'UnauthorizedError') {
    const { status = 401, message } = err;
    res.status(status).json({
      code: status,
      msg: message,
      data: null
    })
  } else {

    const { output } = err || {};
    // 错误码和错误信息
    const errCode = (output && output.statusCode) || 500;
    const errMsg = (output && output.payload && output.payload.message) || err.error;
    res.status(errCode).json({
      code: errCode,
      msg: errMsg,
      data: null
    })
  }
})
module.exports = router;