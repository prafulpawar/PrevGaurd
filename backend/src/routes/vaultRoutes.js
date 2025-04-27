// const express = require('express');
// const router = express.Router();

// const {
//     registerVaultController,
//     loginVaultController,
//     folderVaultController,
//     itemVaultController
// } = require('../controller/vaultController');

// const { verifyAuth } = require('../middlewares/isAuth');

// router.post('/vault/register', verifyAuth, registerVaultController);

// router.post('/vault/login', verifyAuth, loginVaultController);

// router.post('/vault/folder', verifyAuth, folderVaultController);

// router.post('/vault/item/:folderId', verifyAuth, itemVaultController);

// module.exports = router;

const express = require('express');
const router = express.Router();

const {
    registerVaultController,
    loginVaultController,
    folderVaultController,
    itemVaultController,
    getVaultDataController, // Added
    decryptItemController   // Added
} = require('../controller/vaultController');

const { verifyAuth } = require('../middlewares/isAuth'); // Assuming middleware path

// Vault Setup & Login
router.post('/vault/register', verifyAuth, registerVaultController);
router.post('/vault/login', verifyAuth, loginVaultController);

// Fetch Vault Structure (after login)
router.get('/vault/data', verifyAuth, getVaultDataController); // Added GET route

// Folder Management
router.post('/vault/folder', verifyAuth, folderVaultController);

// Item Management
router.post('/vault/item/:folderId', verifyAuth, itemVaultController);
router.post('/vault/item/decrypt/:itemId', verifyAuth, decryptItemController); // Added POST route for decryption (needs password in body)

module.exports = router;