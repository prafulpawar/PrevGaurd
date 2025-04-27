

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const VaultModel = require('../models/vaultData');
const FolderModel = require('../models/folderData');
const ItemModel = require('../models/ItemModel');

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const AUTH_TAG_LENGTH = 16; 

// --- Vault Registration ---
module.exports.registerVaultController = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user?._id;

        if (!userId) {
             return res.status(401).json({ message: "User not authenticated" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password is required and must be at least 6 characters long" });
        }

        const existingVault = await VaultModel.findOne({ userRef: userId });
        if (existingVault) {
            return res.status(409).json({ message: "Vault already exists for this user" });
        }

        const salt = crypto.randomBytes(SALT_LENGTH);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newVault = await VaultModel.create({
            password: hashedPassword,
            userRef: userId,
            salt: salt.toString('hex')
        });

        return res.status(201).json({
            message: "Vault Created Successfully",
            vaultId: newVault._id
        });

    } catch (error) {
        console.error("Error In Creation Of Vault:", error);
        return res.status(500).json({
            message: "Error In Creation Of Vault",
            error: error.message
        });
    }
};


module.exports.loginVaultController = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user?._id;

        if (!userId) {
             return res.status(401).json({ message: "User not authenticated" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const vault = await VaultModel.findOne({ userRef: userId });
        if (!vault) {
            return res.status(404).json({ message: "Vault not found for this user. Please register first." });
        }

        const passwordMatch = await bcrypt.compare(password, vault.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid vault password" });
        }


        return res.status(200).json({ message: "Successfully Logged In to Vault" });

    } catch (error) {
        console.error("Error during Vault Login:", error);
        return res.status(500).json({
            message: "Error during Vault Login",
            error: error.message
        });
    }
};


module.exports.folderVaultController = async (req, res) => {
     try {
        const userId = req.user?._id;
        const { folderName } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (!folderName || typeof folderName !== 'string' || folderName.trim().length === 0) {
            return res.status(400).json({ message: "Valid Folder Name is required" });
        }

        const vault = await VaultModel.findOne({ userRef: userId }).populate('folders');
        if (!vault) {
            return res.status(404).json({ message: "Vault not found for this user. Cannot create folder." });
        }

        const trimmedName = folderName.trim();
        const existingFolder = vault.folders.find(f => f.name.toLowerCase() === trimmedName.toLowerCase());
        if (existingFolder) {
             return res.status(409).json({ message: `Folder "${trimmedName}" already exists.` });
        }

        const newFolder = await FolderModel.create({ name: trimmedName });

        vault.folders.push(newFolder._id);
        await vault.save();

       
        return res.status(201).json({
            message: "Folder Created Successfully",
            folder: {
                _id: newFolder._id,
                name: newFolder.name,
                items: [] 
            }
        });

    } catch (error) {
        console.error("Folder Creation Failed:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Folder name might already exist." });
        }
        return res.status(500).json({
            message: "Folder Creation Failed",
            error: error.message
        });
    }
};


module.exports.itemVaultController = async (req, res) => {
     try {
        const userId = req.user?._id;
        const { folderId } = req.params;
        const { title, content, vaultPassword } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (!mongoose.Types.ObjectId.isValid(folderId)) {
             return res.status(400).json({ message: "Invalid Folder ID format" });
        }
        if (!title || typeof content !== 'string') { // Check content type explicitly
            return res.status(400).json({ message: "Title and content (as string) are required" });
        }
        if (!vaultPassword) {
             return res.status(400).json({ message: "Vault password is required to add items" });
        }

        const vault = await VaultModel.findOne({ userRef: userId });
        if (!vault || !vault.salt) {
            return res.status(404).json({ message: "Vault not found or configuration error (missing salt)." });
        }

        const isPasswordCorrect = await bcrypt.compare(vaultPassword, vault.password);
        if (!isPasswordCorrect) {
             return res.status(401).json({ message: "Incorrect vault password." });
        }

        // Validate folder exists and belongs to the user's vault
        const folder = await FolderModel.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: "Target folder not found." });
        }
        if (!vault.folders.map(id => id.toString()).includes(folderId)) {
             return res.status(403).json({ message: "Folder does not belong to this user's vault." });
        }

        // --- Encryption ---
        const derivedKey = crypto.scryptSync(vaultPassword, Buffer.from(vault.salt, 'hex'), KEY_LENGTH);
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, derivedKey, iv);

        let encryptedContent = cipher.update(content, 'utf8', 'hex');
        encryptedContent += cipher.final('hex');
        const authTag = cipher.getAuthTag();
       

        const newItem = await ItemModel.create({
            title: title.trim(),
            iv: iv.toString('hex'),
            encryptedContent: encryptedContent,
            authTag: authTag.toString('hex'),
            // folderRef: folderId // Optional: Add if direct queries by folder are needed outside the vault structure
        });

        folder.items.push(newItem._id);
        await folder.save();

        // Return only necessary non-sensitive data
        return res.status(201).json({
            message: "Item Added Successfully",
            item: {
                _id: newItem._id,
                title: newItem.title,
                createdAt: newItem.createdAt
            },
            folderId: folderId // Include folderId so frontend knows where to place it
        });

    } catch (error) {
        console.error("Item Creation/Encryption Failed:", error);
        if (error.code === 'ERR_CRYPTO_INVALID_IV') {
             return res.status(500).json({ message: "Encryption failed (IV issue)." });
        }
        return res.status(500).json({
            message: "Failed to add item to vault",
            error: error.message
        });
    }
};

// --- Fetch Vault Data (Folders and Item Metadata) ---
module.exports.getVaultDataController = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const vault = await VaultModel.findOne({ userRef: userId })
            .populate({
                path: 'folders',
                populate: {
                    path: 'items',
                    model: 'Item', // Ensure model name matches your ItemModel export name
                    select: '_id title createdAt' // Only fetch non-sensitive fields
                }
            })
            .select('folders _id salt'); // Select folders, id, and crucially the salt for client-side derivation checks (if needed) or future ops. Don't send password hash.

        if (!vault) {
            // This implies user exists but no vault is registered
            return res.status(404).json({ message: "Vault not found for this user. Needs registration." });
        }

        // Structure the data for the frontend
        const responseData = {
            vaultId: vault._id,
            // Salt might be useful if frontend needs to verify password before certain actions without hitting backend again
            // salt: vault.salt, // Consider implications before sending salt to client
            folders: vault.folders.map(folder => ({
                _id: folder._id,
                name: folder.name,
                items: folder.items.map(item => ({
                    _id: item._id,
                    title: item.title,
                    createdAt: item.createdAt
                })) // Ensure items is an array even if empty
            }))
        };

        return res.status(200).json(responseData);

    } catch (error) {
        console.error("Error Fetching Vault Data:", error);
        return res.status(500).json({
            message: "Error Fetching Vault Data",
            error: error.message
        });
    }
};

// --- Decrypt Item ---
module.exports.decryptItemController = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { itemId } = req.params;
        const { vaultPassword } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
             return res.status(400).json({ message: "Invalid Item ID format" });
        }
        if (!vaultPassword) {
             return res.status(400).json({ message: "Vault password is required to decrypt item" });
        }

        // 1. Find vault, verify password AND get salt
        const vault = await VaultModel.findOne({ userRef: userId }).select('+password +salt'); // Explicitly select needed fields
        if (!vault || !vault.salt || !vault.password) {
            return res.status(404).json({ message: "Vault not found or configuration error." });
        }

        const isPasswordCorrect = await bcrypt.compare(vaultPassword, vault.password);
        if (!isPasswordCorrect) {
             return res.status(401).json({ message: "Incorrect vault password." });
        }

        // 2. Find the item including encrypted fields
        const item = await ItemModel.findById(itemId).select('+encryptedContent +iv +authTag'); // Select all needed fields
        if (!item || !item.iv || !item.authTag || !item.encryptedContent) {
            return res.status(404).json({ message: "Item not found or missing encryption data." });
        }

        // 3. Security Check: Ensure item belongs to user's vault (optional but recommended)
        const folderContainingItem = await FolderModel.findOne({ items: itemId });
        if (!folderContainingItem || !vault.folders.map(id => id.toString()).includes(folderContainingItem._id.toString())) {
             return res.status(403).json({ message: "Access denied. Item does not belong to your vault." });
        }

        // 4. Decrypt
        const derivedKey = crypto.scryptSync(vaultPassword, Buffer.from(vault.salt, 'hex'), KEY_LENGTH);
        const iv = Buffer.from(item.iv, 'hex');
        const authTag = Buffer.from(item.authTag, 'hex');
        const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, derivedKey, iv);
        decipher.setAuthTag(authTag);

        let decryptedContent;
        try {
            decryptedContent = decipher.update(item.encryptedContent, 'hex', 'utf8');
            decryptedContent += decipher.final('utf8');
        } catch (decryptionError) {
             console.error("Decryption failed (likely auth tag mismatch):", decryptionError);
             // This is often due to wrong password OR corrupted data
             return res.status(401).json({ message: "Decryption failed. Incorrect password or data corrupted." });
        }


        return res.status(200).json({ decryptedContent: decryptedContent });

    } catch (error) {
        console.error("Item Decryption Failed:", error);
         // Catch potential Buffer errors or other unexpected issues
        if (error.code === 'ERR_CRYPTO_AEAD_BAD_TAG') {
            // This specific error was likely handled above, but catch just in case
             return res.status(401).json({ message: "Decryption failed. Incorrect password or data corrupted." });
        }
        return res.status(500).json({
            message: "Failed to decrypt item",
            error: "An unexpected error occurred during decryption." // Avoid sending detailed internal errors
        });
    }
};