const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/config')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
   username: {
       type: String,
       required: true
   },

   role: {
       type: String,
       enum: ["user", "admin"],
       default: "user"
   },

   email: {
       type: String,
      
       required: true
   },

   password: {
       type: String,
      
       required: true
   },

   image: {
       type: String,
       default: "https://www.vecteezy.com/vector-art/26619142-default-avatar-profile-icon-vector-of-social-media-user-photo-image"
   },

});

userSchema.methods.accessToken = function(){
  return jwt.sign({_id:this.id,email:this.email,user:this.username},process.env.ACCESS_TOKEN,{expiresIn:'20min'})
}

userSchema.methods.refershToken = function(){
 return jwt.sign({_id:this.id,email:this.email,user:this.username},process.env.REFERSH_TOKEN,{expiresIn:'7d'});

}


userSchema.statics.verifyAccessToken = function (token) {
    try {
        return jwt.verify(token,process.env.ACCESS_TOKEN);
    } catch (error) {
        return null; 
    }
};

userSchema.statics.verifyRefreshToken = function (token) {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN);
    } catch (error) {
        return null; 
    }
};

userSchema.statics.hashPassword = async function(password){
   return await bcrypt.hash(password,10)
}

userSchema.methods.comparePassoword = async function(password){
    return await bcrypt.compare(password,this.password)
}



const userModel = mongoose.model('User',userSchema);
module.exports  = userModel; 