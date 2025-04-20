const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose'); 
const VaultModel = require('../models/vaultData');
const FolderModel = require('../models/folderData');
const ItemModel = require('../models/itemData');


const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;

module.exports.registerVaultController = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user?._id;

        if (!userId) {
             return res.status(401).json({ message: "User not authenticated" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({
                message: "Password is required and must be at least 6 characters long"
            });
        }

        const existingVault = await VaultModel.findOne({ userRef: userId });
        if (existingVault) {
            return res.status(409).json({
                message: "Vault already exists for this user"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newVault = await VaultModel.create({
            password: hashedPassword,
            userRef: userId
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
            return res.status(404).json({
                message: "Vault not found for this user. Please register first."
            });
        }

        const passwordMatch = await bcrypt.compare(password, vault.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid vault password"
            });
        }


        return res.status(200).json({
            message: "Successfully Logged In to Vault"
        });

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

        const vault = await VaultModel.findOne({ userRef: userId });
        if (!vault) {
            return res.status(404).json({ message: "Vault not found for this user. Cannot create folder." });
        }


        const newFolder = await FolderModel.create({
            name: folderName.trim(),
            
        });

        vault.folders.push(newFolder._id);
        await vault.save();

        return res.status(201).json({
            message: "Folder Created Successfully",
            folder: {
                _id: newFolder._id,
                name: newFolder.name
            }
        });

    } catch (error) {
        console.error("Folder Creation Failed:", error);
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
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }
        if (!vaultPassword) {
             return res.status(400).json({ message: "Vault password is required to add items" });
        }

        const vault = await VaultModel.findOne({ userRef: userId });
        if (!vault) {
            return res.status(404).json({ message: "Vault not found for user." });
        }
      
        if (!vault.salt) {
            console.error("Vault Salt is missing for user:", userId);
            return res.status(500).json({ message: "Vault configuration error (missing salt)." });
        }
        const isPasswordCorrect = await bcrypt.compare(vaultPassword, vault.password);
        if (!isPasswordCorrect) {
             return res.status(401).json({ message: "Incorrect vault password." });
        }

        const folder = await FolderModel.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: "Target folder not found." });
        }
        if (!vault.folders.map(id => id.toString()).includes(folderId)) {
             return res.status(403).json({ message: "Folder does not belong to this user's vault." });
        }


        const derivedKey = crypto.scryptSync(vaultPassword, Buffer.from(vault.salt, 'hex'), KEY_LENGTH);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, derivedKey, iv);

        let encrypted = cipher.update(content, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();


        const newItem = await ItemModel.create({
            title,
            iv: iv.toString('hex'),
            encryptedContent: encrypted,
            authTag: authTag.toString('hex'),
           
        });

        folder.items.push(newItem._id);
        await folder.save();

        return res.status(201).json({
            message: "Item Added Successfully",
            item: {
                _id: newItem._id,
                title: newItem.title,
                createdAt: newItem.createdAt
            }
        });

    } catch (error) {
        console.error("Item Creation/Encryption Failed:", error);
        return res.status(500).json({
            message: "Failed to add item to vault",
            error: error.message
        });
    }
};