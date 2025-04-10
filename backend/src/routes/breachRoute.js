const express = require('express');
const router  = express.Router();
const {brechController} = require('../controller/breachController');

router.get('/breach/check',brechController)

module.exports = router;