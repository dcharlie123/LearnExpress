const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userService = require('../services/userService');

const validator = [
  body('username').isString().withMessage('用户名类型错误'),
  body('password').isLength({ min: 6 }).withMessage('密码类型太短了')
]

router.post('/login', validator, userService.login)
router.post('/register', validator, userService.register)

module.exports = router;