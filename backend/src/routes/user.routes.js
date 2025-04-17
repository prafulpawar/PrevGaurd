const express = require('express');
const router = express.Router();
const {registerUser,verfifyOtp,getOtpStatus,getUserInfo,logoutUser,loginUser}  = require('../controller/user.controller');
const rateLimiter = require('../middlewares/rateLimiter')
const { verifyAuth }  = require('../middlewares/isAuth');const multer = require('multer');
const upload = multer(); // using memoryStorage by default


router.post('/auth/signup',upload.single('profileImage'), registerUser);

router.post('/auth/verifyOtp',rateLimiter,verfifyOtp);
router.get("/auth/otp-status", getOtpStatus);



router.post('/auth/login',loginUser)

router.get('/auth/me',verifyAuth ,getUserInfo);

router.get('/auth/logout',logoutUser)

module.exports = router;