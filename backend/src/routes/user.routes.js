const express = require('express');
const router = express.Router();
const {registerUser,verfifyOtp,getOtpStatus}  = require('../controller/user.controller');
const rateLimiter = require('../middlewares/rateLimiter')

router.post('/register',rateLimiter,registerUser);
router.post('/verifyOtp',rateLimiter,verfifyOtp);
router.get("/otp-status", getOtpStatus);

module.exports = router;