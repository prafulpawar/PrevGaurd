const mongoose = require('mongoose');
const config = require('../config/config');
const connectDB = async(req,res)=>{
      try{
          console.log(config.MONO_URI)
           const db = await mongoose.connect(config.MONGO_URI);
           console.log(`Connected To Database ${db}`)
      }
      catch(error){
          console.log(error);
      }
}

module.exports = connectDB;