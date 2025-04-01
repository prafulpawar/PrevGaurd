const mongoose = require('mongoose');
const config = require('../config/config');
const connectDB = async(req,res)=>{
      try{
         
           const db = await mongoose.connect(config.MONGO_URI);
           console.log(`Connected To Database `)
      }
      catch(error){
          console.log(error);
      }
}

module.exports = connectDB;