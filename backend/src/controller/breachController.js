const BreachModel = require("../models/breachData");
module.exports.brechController = async (req, res) => {
    try {
        const { email } = req.body;
        const breachedData = await BreachModel.findOne({ email }).select('-date -__v ')
        if(breachedData === null){
              
        }
        return res.status(200).json({
            breachedData,
            message: "SuccessFully"
        })
    }
    catch (error) {
        console.log(error)
        return res.status(
            400
        ).json({
            message: "Error In Getting Data"
        })
    }
}