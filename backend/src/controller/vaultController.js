module.exports.createVaultController = async(req,res)=>{
    try{
         const {password} = req.body;
         if(!password){
              return res.status(400).json({
                message:"Can Not Get Password"
              })
         }
         // Hashing Of Password

    }
    catch(error){
        return res.status(400).json({
            message:"Error In Creation Of Vault"
        })
    }
}