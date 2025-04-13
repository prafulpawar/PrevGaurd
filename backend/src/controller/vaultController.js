const bcrypt  = require('bcryptjs')
module.exports.createVaultController = async(req,res)=>{
    try{
         const {password} = req.body;
         if(!password){
              return res.status(400).json({
                message:"Can Not Get Password"
              })
         }
         // Hashing Of Password
        const hashedPassword = await bcrypt.hash(password,10);
    }
    catch(error){
        return res.status(400).json({
            message:"Error In Creation Of Vault"
        })
    }
}