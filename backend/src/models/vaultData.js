const mongoose = require('mongoose');
const vaultSchema = new mongoose.Schema({
    password:{
        type:String
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    folders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'folderSchema' 
    }],
    locked: {
        type: Boolean,
        default: false
    }
});

const VaultModel = mongoose.model('Vault', vaultSchema);
module.exports = VaultModel;