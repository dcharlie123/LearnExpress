const { querySql, queryOne } = require('../db/index');
const {
  CODE_ERROR,
  CODE_SUCCESS
} = require('../utils/constant');
function getList(req, res, next) {
  let { pageSize = 10, pageNo = 1 } = req.query;
  let sqlStr = `SELECT d.id,d.title FROM list d`
  querySql(sqlStr).then((data) => {
    let total = data.length;
    let n = (pageNo - 1) * pageSize;
    sqlStr += ` limit ${n}, ${pageSize}`;
    querySql(sqlStr).then((data) => {
      res.json({
        data: {
          total,
          pageNo: Number(pageNo),
          pageSize: Number(pageSize),
          data
        },
        code: CODE_SUCCESS,
        msg: '成功',
      });
    })
  })

}
module.exports = {
  getList
}