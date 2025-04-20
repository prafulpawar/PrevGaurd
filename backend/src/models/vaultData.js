const mongoose = require('mongoose');
const crypto = require('crypto'); 

const vaultSchema = new mongoose.Schema({
    password: { 
        type: String,
        required: true 
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    folders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder' 
    }],
   
    salt: {
        type: String,
        required: true,
        default: () => crypto.randomBytes(16).toString('hex') 
    },
    locked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); 

const VaultModel = mongoose.model('Vault', vaultSchema); 
module.exports = VaultModel;