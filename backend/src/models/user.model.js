const monggoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/config')
const bcrypt = require('bcrypt')
const userSchema = new monggoose.Schema({
     username:{
        type:String,
        minlength:['Minimum Length Is 6',6],
        maxlength:['Maximum Length Is 6',6],
        required:true
     },

     role:{
        type:String,
        enum:['user','admin'],
        default:'user',
     },

     email:{
        type:String,
        minlength:['Minimum Length Is 6',10],
        maxlength:['Maximum Length Is 6',50],
        required:true
     },
     password:{
        type:String,
        minlength:['Minimum Length Is 6',6],
        maxlength:['Maximum Length Is 6',20],
        required:true 
     },
     image:{
        type:String,
        default:"https://www.vecteezy.com/vector-art/26619142-default-avatar-profile-icon-vector-of-social-media-user-photo-image"    
     },
     refershToken:{
        type:String
     },
})

userSchema.methods.accessToken = function(){
  return jwt.sign({_id:this.id,email:this.email,user:this.username},config.accessToken,{expiresIn:'20min'})
}

userSchema.methods.refershToken = function(){
 return jwt.sign({_id:this.id,email:this.email,user:this.username},config.refershToken,{expiresIn:'7d'});

}

userSchema.statics.hashPassword = async function(password){
   return await bcrypt.hash(password,10)
}

userSchema.methods.comparePassoword = async function(password){
    return await bcrypt.compare(password,this.password)
}



const userModel = monggoose.model('User',userSchema);
module.exports  = userModel; 