const express = require('express');
const router = express.Router();
const {getAllSavedFackData,deleteFackData,saveFackData,generateFackData,getSavedFackData} = require('../controller/fackDataController')
const { verifyAuth } = require('../middlewares/isAuth')

router.post('/fack-data-generate',verifyAuth,generateFackData);
router.post('/fack-data',verifyAuth,saveFackData);

router.delete('/fack-data/:id',verifyAuth,deleteFackData)
router.get('/fack-data-allpost',verifyAuth,getAllSavedFackData)
module.exports = router;