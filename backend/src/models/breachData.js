const mongoose = require('mongoose');
const breachDataSchema = new mongoose.Schema({
      email:{
           type:String,
      },
      leakedAt:{
            type:String
      },
      website:{
            type:String
      },
      date:{
        type:Number
      }

})

const breachModel = mongoose.model('breach',breachDataSchema);
module.exports = breachModel;