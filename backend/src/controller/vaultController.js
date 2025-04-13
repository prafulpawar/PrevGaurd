const bcrypt  = require('bcryptjs');
const VaultModel = require('../models/vaultData');
const folderModel = require('../models/folderData');

module.exports.registerVaultController = async(req,res)=>{
    try{
         const {password} = req.body;
         const {userId} = req.body._id;

         if(!password){
              return res.status(400).json({
                message:"Can Not Get Password"
              })
         }
        const hashedPassword = await bcrypt.hash(password,10);
        const vaultUser = await VaultModel.create({
              password:hashedPassword,
              userRef:userId
        })

        return res.status(200).json({
            message:"User Created SuccessFully"
        })
    }
    catch(error){
        return res.status(400).json({
            message:"Error In Creation Of Vault"
        })
    }
}

module.exports.loginVaultController = async(req,res)=>{
         const {password} = req.body;
         //cheking password
         const {userId} = req.user;

         // Match User

         const match = await VaultModel.findById({_id:userId});
         if(!match){
             return res.status(400).json({
                message:"Error In Finding User"
             })
         }
         
         // on a succesfull match do one thing
         const passwordMatch = await bcrypt.compare(password,match.password);
      
         return res.status(200).json({
            passwordMatch,
            message:"Sucessfully Login"
         })
}

module.exports.folderVaultController = async(req,res)=>{
     try{
        const {userId} = req.user._id,
        const {folderName} = req.body;
   
        const folderCreation = await folderModel.create({
               name:folderName,
               userRef:userId,
        })
        return res.status(200).json({
            folderCreation,
            message:"Folder Created SucessFully..."
        })
     }
      catch(error){
          return res.status(400).json({
            message:"Folder Creation Failed"
          })
      }
}

module.exports.itemVaultController = async(req,res)=>{
     try{
          const {folder,item} = req.body;
          

     }
     catch(error){
        return res.status(200).json({
            message:"Item Is Not Added Error"
        })
     }
}