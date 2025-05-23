const express = require('express');
const router = express.Router();

const {
    registerVaultController,
    loginVaultController,
    folderVaultController,
    itemVaultController,
    getVaultDataController, 
    decryptItemController   
} = require('../controller/vaultController');

const { verifyAuth } = require('../middlewares/isAuth'); 

// Vault Setup & Login
router.post('/vault/register', verifyAuth, registerVaultController);
router.post('/vault/login', verifyAuth, loginVaultController);

// Fetch Vault Structure (after login)
router.get('/vault/data', verifyAuth, getVaultDataController);

// Folder Management
router.post('/vault/folder', verifyAuth, folderVaultController);

// Item Management
router.post('/vault/item/:folderId', verifyAuth, itemVaultController);
router.post('/vault/item/decrypt/:itemId', verifyAuth, decryptItemController); 

module.exports = router;