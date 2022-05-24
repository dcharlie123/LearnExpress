const boom = require('boom');
const SIZELIMIT = 20000000;
const {
  CODE_ERROR,
  CODE_SUCCESS
} = require('../utils/constant');

function upload(req, res, next){
  if(!req.file){
    next(boom.badRequest('no file'));
    return;
  }
  const { size, mimetype, filename } = req.file;
  if (size >= SIZELIMIT) {
    next(boom.badRequest('file is too large'));
    return;
  }
  console.log()
  const url = `http://192.168.73.136:3000/uploads/${req.file.filename}`
  res.json({
    code: CODE_SUCCESS,
    msg: '上传成功',
    data: {
      url
    }
  })
}
module.exports={
  upload
}