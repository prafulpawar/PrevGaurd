const bcrypt  = require('bcryptjs');
const VaultModel = require('../models/vaultData');

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

module.exports.