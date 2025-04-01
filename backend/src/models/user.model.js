const monggoose = require('mongoose');
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
     refershToken:{
        type:String
     }
})






const userModel = monggoose.model('User',userSchema);
module.exports  = userModel; 