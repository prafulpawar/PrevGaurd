const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
   
    iv: {
        type: String,
        required: true
    },
    encryptedContent: {
        type: String,
        required: true
    },
    authTag: {
        type: String, 
        required: true
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ItemModel = mongoose.model('Item', itemSchema); // Capitalized name
module.exports = ItemModel;