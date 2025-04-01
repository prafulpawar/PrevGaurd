module.exports.userCreation = async(req,res)=>{
     try{
           const {username,email,password} =req.body;
           
     }
     catch(error){
        return res.status(401).json({
            message:"Error In Creation "
        })
     }
}