const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    encryptedContent: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const itemModel = mongoose.model('itemSchema',itemSchema);
module.exports  = itemModel;