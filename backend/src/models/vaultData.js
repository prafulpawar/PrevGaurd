const mongoose = require('mongoose');



const vaultSchema = new mongoose.Schema({
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    folders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'folderSchema' 
    }],
    attempts: {
        type: Number,
        default: 0
    },
    locked: {
        type: Boolean,
        default: false
    }
});


const Vault = mongoose.model('Vault', vaultSchema);


module.exports = Vault;
