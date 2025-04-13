const mongoose = require('mongoose')
const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'itemSchema' 
    }],
     userRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
    },
    
});


const folderModel = mongoose.model('folderSchema',folderSchema);
module.exports  = folderModel;