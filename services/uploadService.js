const boom = require("boom");
const SIZELIMIT = 20000000;
const path = require("path");
var fs = require("fs");
var fse = require("fs-extra");

const { CODE_ERROR, CODE_SUCCESS, FILE_DIR } = require("../utils/constant");

function upload(req, res, next) {
  if (!req.file) {
    next(boom.badRequest("no file"));
    return;
  }
  const { size, mimetype, filename } = req.file;
  if (size >= SIZELIMIT) {
    next(boom.badRequest("file is too large"));
    return;
  }
  const url = `http://192.168.73.136:3000/uploads/${filename}`;
  res.json({
    code: CODE_SUCCESS,
    msg: "上传成功",
    data: {
      url,
    },
  });
}
function uploadBig(req, res, next) {
  if (!req.file) {
    next(boom.badRequest("no file"));
    return;
  }
  const { size, mimetype, filename } = req.file;
  if (size >= SIZELIMIT) {
    next(boom.badRequest("file is too large"));
    return;
  }
  res.json({
    code: CODE_SUCCESS,
    msg: "上传成功",
  });
}
async function merge(req, res, nex) {
  let { size, filename } = req.body;
  await mergeFileChunk(path.join(FILE_DIR, filename), filename, size);
  const url = `http://192.168.73.136:3000/uploads/${filename}`;
  res.json({
    code: CODE_SUCCESS,
    data: {
      url,
    },
    msg: "上传成功",
  });
}
const pipeStream = (path, writeStream) => {
  console.log(path);
  return new Promise((resolve) => {
    const readStream = fs.createReadStream(path);
    readStream.pipe(writeStream);
    readStream.on("end", () => {
      fs.unlinkSync(path);
      resolve();
    });
  });
};
const mergeFileChunk = async (filePath, filename, size) => {
  const chunkDir = path.join(FILE_DIR, filename.split(".")[0]);
  const chunkPaths = fs.readdirSync(chunkDir);
  if (!chunkPaths.length) return;
  chunkPaths.sort((a, b) => a - b);
  console.log("chunkPaths = ", chunkPaths);
  await Promise.all(
    chunkPaths.map((chunkPath, index) =>
      pipeStream(
        path.resolve(chunkDir, chunkPath),
        // 指定位置创建可写流
        fs.createWriteStream(filePath, {
          start: index * size,
          end: (index + 1) * size,
        })
      )
    )
  );
  // // 合并后删除保存切片的目录
  fs.rmdirSync(chunkDir);
};
module.exports = {
  upload,
  uploadBig,
  merge,
};
