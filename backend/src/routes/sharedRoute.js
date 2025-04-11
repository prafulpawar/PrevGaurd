const express = require('express');
const router  = express.Router()
const {addsharedData,getsharedData,updatesharedData,deleteSharedData} = require('../controller/sharedDataController')
router.get('/api/data',getsharedData);
router.post('/api/data',addsharedData)
router.put('/api/data/:id',updatesharedData)
router.delete('/api/data/:id',deleteSharedData)
module.exports = router;