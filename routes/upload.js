const express = require('express');
const multer = require('multer');
const uploadService = require('../services/uploadService');
const router = express.Router();
const {FILE_DIR} = require('../utils/constant.js')
const fse = require('fs-extra');
const fs=require('fs');


// 用于检测是否存在用于存放文件的路径，不存在则创建路径
const createFolder = function(folder){
  try{
      fs.accessSync(folder);
  }catch(e){
      fs.mkdirSync(folder);
  }
};
createFolder(FILE_DIR);


//普通文件上传
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, FILE_DIR)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})
var upload = multer({
  storage: storage
})
router.post('/uploadfile', upload.single('file'), uploadService.upload)


// 分片上传
var storageBig = multer.diskStorage({
  destination: function(req,file,cb){
      // 用于进行复杂的路径配置，此处考虑分片上传，先将分片文件保存在临时目录中
      let [fname,index,fext] = file.originalname.split(".");
      let chunkDir = `${FILE_DIR}/${fname}`;
      if(!fse.existsSync(chunkDir)){
          fse.mkdirsSync(chunkDir);
      }
      cb(null,chunkDir); //内部提供的回调函数 
  },
  filename: function(req,file,cb){
      // 根据上传的文件名，按分片顺序用分片索引命名，
      // 由于是分片文件，请不要加扩展名，在最后文件合并的时候再添加扩展名
      let fname = file.originalname;
      cb(null,fname.split('.')[1]);

  }
})

var uploadBig = multer({storage: storageBig});// multer实例

// 分片上传文件
router.post('/uploadfile-big', uploadBig.single('file'), uploadService.uploadBig)
// 合并分片
router.post("/mergeChunks",uploadService.merge)
module.exports = router;