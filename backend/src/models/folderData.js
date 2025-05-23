const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item' 
    }],

}, { timestamps: true });

const FolderModel = mongoose.model('Folder', folderSchema); 
module.exports = FolderModel;