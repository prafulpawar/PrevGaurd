const monggoose = require('mongoose');
const userSchema = new monggoose.Schema({
     username:{
        type:String,
        minlength:['Minimum Length Is 6',6],
        maxlength:['Maximum Length Is 6',6],
        required:true
     }
})

const userModel = monggoose.model('User',userSchema);
module.exports  = userModel; 