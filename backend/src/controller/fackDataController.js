import fackModel from "../models/fackData";

module.exports.generateFackData = async(req,res)=>{
     try{
           const {name,email,phone,pan,addhar,address}= req.body;
     }
     catch(error){
         return res.status(400).json({
              message:"Generation Is Failed"
         })
     }
}