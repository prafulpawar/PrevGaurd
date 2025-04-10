const express = require('express');
const router = express.Router();
const {deleteFackData,saveFackData,generateFackData} = require('../controller/fackDataController')
const { verifyAuth } = require('../middlewares/isAuth')

router.get('/fack-data',verifyAuth,generateFackData);
router.post('/fack-data',verifyAuth,saveFackData);
router.post('/fack-data/:id',verifyAuth,deleteFackData)

module.exports = router;