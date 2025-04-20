const shareModel = require("../models/shareData");
const mongoose = require('mongoose');

module.exports.addsharedData = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Data Is Required"
            });
        }
        const {  appName,  emailUsed,  phoneUsed, locationAccess, notes } = req.body;
        console.log(req.body);
        const userId = req.user._id;

        const savedUser = await shareModel.create({
            appName,
            emailUsed,
            phoneUsed,
            locationAccess,
            notes,
            savedBy: userId
        });

        return res.status(200).json({
            savedUser,
            message: "User Register SucessFully"
        }); 
    } catch (error) {
        console.error("Error in adding data:", error);
        return res.status(500).json({
            message: "Error In Adding Data"
        });
    }
};

module.exports.getsharedData = async (req, res) => {
    try {
        const {_id} = req.user
        const data = await shareModel.find({ savedBy:_id }).select('-__v');

        res.status(200).json({
            data,
            message: "SuccessFully Data Is Get"
        });

    } catch (error) {
        console.error("Error in getting data:", error);
        return res.status(500).json({
            message: "Error In Getting Data"
        });
    }
};

module.exports.updatesharedData = async (req, res) => {
    try {
        const { id } = req.params;
        const { appName, emailUsed, phoneUsed, locationAccess, notes } = req.body;
        if (!id) {
            return res.status(400).json({
                message: "Invalid ID"
            });
        }

        const updatedData = await shareModel.findByIdAndUpdate(id, {
            appName,
            emailUsed,
            phoneUsed,
            locationAccess,
            notes
        }, { new: true });

        if (!updatedData) {
            return res.status(404).json({ message: "Data not found" });
        }

        return res.status(200).json({
            updatedData,
            message: "Successfully User Updated"
        });
    } catch (error) {
        console.error("Error in updating data:", error);
        return res.status(500).json({
            message: "Error In Update Data"
        });
    }
};

module.exports.deleteSharedData = async (req, res) => {
    try {
        const { id } = req.params;


        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
          
            console.error("Invalid ID format received:", id);
            return res.status(400).json({
                message: "Invalid ID format provided."
            });
        }
        console.log(id)
        console.log(req.params)
        const deletedSharedData = await shareModel.findByIdAndDelete(id);

        if (!deletedSharedData) {
            return res.status(404).json({
                message: "Invalid ID or Data not found"
            });
        }

        return res.status(200).json({
            message: "Item Is Deleted"
        });
    } catch (error) {
        console.error("Error in deleting data:", error);
        return res.status(500).json({
            message: "Error In Delete Data"
        });
    }
};
