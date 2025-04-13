const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    // Store IV and Auth Tag separately for AES-GCM
    iv: {
        type: String, // Store as hex
        required: true
    },
    encryptedContent: {
        type: String, // Store encrypted data as hex
        required: true
    },
    authTag: {
        type: String, // Store auth tag as hex
        required: true
    },
    // Reference to the parent folder (optional but can be useful)
    // folderRef: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Folder',
    //     required: true
    // }
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ItemModel = mongoose.model('Item', itemSchema); // Capitalized name
module.exports = ItemModel;