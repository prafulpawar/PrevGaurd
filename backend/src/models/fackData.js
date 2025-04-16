const mongoose = require('mongoose');
const fackSchema = new mongoose.Schema({
      savedAs:{
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
       savedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true, 
        index: true 
       }
})

const fackModel = mongoose.model('fackData',fackSchema);
module.exports = fackModel
