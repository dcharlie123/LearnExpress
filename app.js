const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index.js');

const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors());
app.use('/', routes);
app.use('/uploads', express.static(__dirname + '/uploads'))
app.listen(3000, () => {
  console.log('服务已启动')
})

