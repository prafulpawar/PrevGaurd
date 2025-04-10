const express = require('express');
const router = express.Router();
const {deleteFackData,saveFackData,generateFackData} = require('../controller/fackDataController')
const { verifyAuth } = require('../middlewares/isAuth')

router.get('/fack-data',verifyAuth,generateFackData);
router.post('/fack-data',verifyAuth,saveFackData);
router.delete('/fack-data/:id',deleteFackData)

module.exports = router;