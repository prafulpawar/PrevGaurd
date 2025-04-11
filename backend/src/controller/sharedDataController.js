module.exports.addsharedData = async(req,res)=>{
    try{
          const {} = req.body;
    }
    catch(error){
        return res.status(400).json({
            message:"Error In Adding Data"
        })
    }
}

module.exports.getsharedData = async(req,res)=>{
      try{

      }
      catch(error){
        return res.status(400).json({
            message:"Error In Getting Data"
        })
      }
}


module.exports.updatesharedData = async(req,res)=>{
     try{

     }
     catch(error){
        return res.status(400).json({
            message:"Error In Update Data"
        })
     }
}

module.exports.deleteSharedData = async(req,res)=>{
    try{

    }
    catch(error){
       return res.status(400).json({
           message:"Error In Delete Data"
       })
    }
}