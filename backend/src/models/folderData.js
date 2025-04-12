const mongoose = require('mongoose')

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [itemSchema]
});


const folderModel = mongoose.model('folderSchema',folderSchema);
module.exports  = folderModel;