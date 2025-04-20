const express = require('express');
const router = express.Router();

const {
    registerVaultController,
    loginVaultController,
    folderVaultController,
    itemVaultController
} = require('../controllers/vaultController');

const { verifyAuth } = require('../middlewares/isAuth');

router.post('/vault/register', verifyAuth, registerVaultController);

router.post('/vault/login', verifyAuth, loginVaultController);

router.post('/vault/folder', verifyAuth, folderVaultController);

router.post('/vault/item/:folderId', verifyAuth, itemVaultController);

module.exports = router;
