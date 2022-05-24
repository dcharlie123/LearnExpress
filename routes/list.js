const express = require('express');
const listService = require('../services/listService')
const router = express.Router();
router.post('/addItem',(req, res, next)=>{
  
})
router.post('/deleteItem', (req, res, next)=>{})
router.get('/getList', listService.getList)
router.get('/getVersion', (req, res, next)=>{
  res.json({
    env:process.env.NODE_ENV
  })
})
module.exports = router;