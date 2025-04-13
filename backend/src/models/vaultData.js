const mongoose = require('mongoose');
const crypto = require('crypto'); // Needed for salt generation

const vaultSchema = new mongoose.Schema({
    password: { // Stores the HASHED vault password
        type: String,
        required: true // Vault must have a password
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
        unique: true // Only one vault per user
    },
    folders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder' // Correct ref name
    }],
    // Salt for deriving encryption key from password - STORE THIS
    salt: {
        type: String,
        required: true,
        default: () => crypto.randomBytes(16).toString('hex') // Generate salt on creation
    },
    locked: { // Optional: for temporary locking
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // Add timestamps

const VaultModel = mongoose.model('Vault', vaultSchema); // Capitalized name
module.exports = VaultModel;