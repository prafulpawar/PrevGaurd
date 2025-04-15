const express = require('express');
const router  = express.Router()
const {addsharedData,getsharedData,updatesharedData,deleteSharedData} = require('../controller/sharedDataController');
const { verifyAuth } = require('../middlewares/isAuth');
router.get('/api/data',verifyAuth , getsharedData);
router.post('/api/data', verifyAuth, addsharedData)
router.put('/api/data/:id',verifyAuth,updatesharedData)
router.delete('/api/data/:id',verifyAuth,deleteSharedData)
module.exports = router;