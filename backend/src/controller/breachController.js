const axios = require('axios');

module.exports.brechController = async (req, res) => {
    try {
        const { emailData } = req.query.email;

       
        const response = await axios.get(`https://api.xposedornot.com/v1/check-email/${emailData}`);
        const BreachData = response.data;
         console.log(emailData)
    
        return res.status(200).json({
            BreachData,
            message: "Successfully fetched breach data"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            message: "Error in getting breach data",
            error: error.message
        });
    }
};
