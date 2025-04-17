const mongoose = require('mongoose');
const fackSchema = new mongoose.Schema({
      savedBy:{
        type:String
       },
       name:{
          type:String,
       },
       email:{
           type:String
       },
       phone:{
           type:String
       },
       pan:{
        type:String
       },
       aadhar:{
         type:String
       },
       address:{
         type:String
       },
       savedAs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true, 
        index: true 
       }
})

const fackModel = mongoose.model('fackData',fackSchema);
module.exports = fackModel
