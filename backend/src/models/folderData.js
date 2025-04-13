const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item' // Correct ref name
    }],
    // userRef removed - folder belongs to a Vault, Vault belongs to User
    // You can get the user via the Vault if needed

    // Reference to the parent vault (optional but can be useful)
    // vaultRef: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Vault',
    //     required: true
    // }

}, { timestamps: true }); // Add timestamps

const FolderModel = mongoose.model('Folder', folderSchema); // Capitalized name
module.exports = FolderModel;