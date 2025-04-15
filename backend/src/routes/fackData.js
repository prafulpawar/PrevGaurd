const express = require('express');
const router = express.Router();
const {deleteFackData,saveFackData,generateFackData,getSavedFackData} = require('../controller/fackDataController')
const { verifyAuth } = require('../middlewares/isAuth')

router.get('/fack-data',verifyAuth,generateFackData);
router.post('/fack-data',verifyAuth,saveFackData);
router.delete('/fack-data/:id',verifyAuth,deleteFackData)
router.get('/fack-data/saved', verifyAuth, getSavedFackData);

module.exports = router;