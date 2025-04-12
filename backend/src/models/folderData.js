const mongoose = require('mongoose')
const itemSchema = require('./ItemModel')
const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'itemSchema' 
    }]
});


const folderModel = mongoose.model('folderSchema',folderSchema);
module.exports  = folderModel;