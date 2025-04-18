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

}, { timestamps: true }); // Add timestamps

const FolderModel = mongoose.model('Folder', folderSchema); 
module.exports = FolderModel;