const express = require('express');
const router = express.Router();
const {registerUser,verfifyOtp,getOtpStatus,getUserInfo,logoutUser,loginUser}  = require('../controller/user.controller');
const rateLimiter = require('../middlewares/rateLimiter')
const {isAuth} = require('../middlewares/isAuth');

router.post('/auth/signup',rateLimiter,registerUser);
router.post('/verifyOtp',rateLimiter,verfifyOtp);
router.get("/otp-status", getOtpStatus);
router.post('/auth/login',loginUser)
router.get('/auth/me',isAuth,getUserInfo)
router.get('/auth/logout',logoutUser)

module.exports = router;