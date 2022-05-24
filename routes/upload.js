const express = require('express');
const path = require('path');
const multer = require('multer');
const uploadService = require('../services/uploadService');
const router = express.Router();
const dir = path.resolve(__dirname, '../uploads/')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})
var upload = multer({
  storage: storage
})
router.post('/uploadfile', upload.single('file'), uploadService.upload)


module.exports = router;