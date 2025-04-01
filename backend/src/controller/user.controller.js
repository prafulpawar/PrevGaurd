const userModel = require("../models/user.model");

module.exports.userCreation = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "All Fields Must Be Required"
            })
        }
        // find if user exists 
        const isExists = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        })

        // if exists
        if (isExists) {
            return res.status(401).json({
                messae: "User Is Alredy Exists"
            })
        }

         // Now Send OTP 
         

        // hashpassword
        const EncPassowrd = await userModel.hashPassword(password);

        // not exists then lets create the user
        const user = await userModel.create({
            username,
            email,
            password:EncPassowrd
        });

        // now accessToken 
        const accessToken  = user.accessToken();
        const refershToken = user.refershToken();
        

    }
    catch (error) {
        return res.status(401).json({
            message: "Error In Creation "
        })
    }
}