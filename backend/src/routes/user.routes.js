const express = require('express');
const router = express.Router();
const {registerUser,verfifyOtp}  = require('../controller/user.controller');
const {rateLimiter} = require('../middlewares/rateLimiter')

router.post('/register',rateLimiter,registerUser);
router.post('/verifyOtp',rateLimiter,verfifyOtp);

module.exports = router;