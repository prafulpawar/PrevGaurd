const mongoose = require('mongoose');

const shareDataSchema = new mongoose.Schema({
    appName:{
       type:String
    }, 
    emailUsed:{
        type:Boolean
    },
     phoneUsed:{
         type:Boolean
    }, 
    locationAccess:{
         type:Boolean
    },
    notes:{
         type:String
    },
    savedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true, 
    }
    
})

const shareModel = ('shareData',shareDataSchema);
module.exports = shareModel