const mongoose = require('mongoose');
const fackSchema = new mongoose.Schema({
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
       }
})

const fackModel = mongoose.model('fackData',fackSchema);
module.exports = fackModel
