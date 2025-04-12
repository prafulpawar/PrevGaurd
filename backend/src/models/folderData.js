const mongoose = require('mongoose')

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [itemSchema]
});


const itemModel = mongoose.model('itemSchema',itemSchema);
module.exports  = itemModel;