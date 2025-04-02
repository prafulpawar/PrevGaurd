const express = require('express');
const router = express.Router();

const {registerUser,verfifyOtp}  = require('../controller/user.controller');
router.post('/register',registerUser);
router.post('/verifyOtp',verfifyOtp);

module.exports = router;