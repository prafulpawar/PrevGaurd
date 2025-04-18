const express = require('express');
const router  = express.Router()
const {addsharedData,getsharedData,updatesharedData,deleteSharedData} = require('../controller/sharedDataController');
const { verifyAuth } = require('../middlewares/isAuth');

router.get('/dash/data',verifyAuth , getsharedData);
router.post('/dash/data', verifyAuth, addsharedData)
router.put('/dash/data/:id',verifyAuth,updatesharedData)
router.delete('/dash/data/:id',verifyAuth,deleteSharedData)

module.exports = router;