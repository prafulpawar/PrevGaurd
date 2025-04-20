const shareModel = require("../models/shareData");
const mongoose = require('mongoose');


const getUserDataAndRisk = async (userId) => {
    const data = await shareModel.find({ savedBy: userId }).select('-__v');
    const calculatedRiskScore = calculateDataRisk(data);
    return { data, riskScore: calculatedRiskScore.toString() };
};


const calculateDataRisk = (applications) => {
    if (!applications || applications.length === 0) {
        return 0;
    }

    let totalRawRisk = 0;

    const riskPoints = {
        email: 5,
        phone: 10,
        location: 25,
        notes: 5
    };

    applications.forEach(app => {
        let appRisk = 0;

        if (app.emailUsed) {
            appRisk += riskPoints.email;
        }
        if (app.phoneUsed) {
            appRisk += riskPoints.phone;
        }
        if (app.locationAccess === 'yes') {
            appRisk += riskPoints.location;
        }
        // Check if notes field exists and has content (not just null/undefined)
        if (app.notes && app.notes.length > 0) {
             appRisk += riskPoints.notes;
        }

        totalRawRisk += appRisk;
    });

    
    const maxPossibleRawScore = 250;


    let riskPercentage = (totalRawRisk / maxPossibleRawScore) * 100;

    riskPercentage = Math.min(100, riskPercentage);
    riskPercentage = Math.max(0, riskPercentage);

    riskPercentage = Math.round(riskPercentage);

    return riskPercentage;
};

module.exports.getsharedData = async (req, res) => {
    try {
        const {_id: userId} = req.user;

        const {data, riskScore} = await getUserDataAndRisk(userId);


        res.status(200).json({
            data,
            message: "SuccessFully Data Is Get",
            riskScore: riskScore
        });

    } catch (error) {
        console.error("Error in getting data:", error);
        return res.status(500).json({
            message: "Error In Getting Data",
            riskScore: 0
        });
    }
};

module.exports.addsharedData = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Data Is Required",
                riskScore: 0
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

       
        const {data, riskScore} = await getUserDataAndRisk(userId);

        return res.status(200).json({
            savedUser, 
            data, 
            message: "User Register SucessFully",
            riskScore: riskScore 
        });
    } catch (error) {
        console.error("Error in adding data:", error);
        return res.status(500).json({
            message: "Error In Adding Data",
            riskScore: 0
        });
    }
};


module.exports.updatesharedData = async (req, res) => {
    try {
        const { id } = req.params;
        const { appName, emailUsed, phoneUsed, locationAccess, notes } = req.body;
        const userId = req.user._id;


     
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
             console.error("Invalid ID format received for update:", id);
            return res.status(400).json({
                message: "Invalid ID format provided.",
                riskScore: 0
            });
        }

        const updatedData = await shareModel.findByIdAndUpdate(id, {
            appName,
            emailUsed,
            phoneUsed,
            locationAccess,
            notes
        }, { new: true }).select('-__v');

        if (!updatedData) {
           
            return res.status(404).json({
                 message: "Data not found",
                 riskScore: 0
            });
        }

      
        const {data, riskScore} = await getUserDataAndRisk(userId);


        return res.status(200).json({
            updatedData, 
            data, 
            message: "Successfully User Updated",
            riskScore: riskScore
        });
    } catch (error) {
        console.error("Error in updating data:", error);
        return res.status(500).json({
            message: "Error In Update Data",
            riskScore: 0
        });
    }
};

module.exports.deleteSharedData = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

     
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
             console.error("Invalid ID format received for deletion:", id);
            return res.status(400).json({
                message: "Invalid ID format provided.",
                riskScore: 0
            });
        }
        console.log(`Attempting to delete item with ID: ${id}`);


        const deletedSharedData = await shareModel.findByIdAndDelete(id);

        if (!deletedSharedData) {
            
            return res.status(404).json({
                message: "Data not found.",
                riskScore: 0
            });
        }

       
         const {data, riskScore} = await getUserDataAndRisk(userId);


        return res.status(200).json({
            message: "Item Is Deleted",
            data, // Return the remaining data
            riskScore: riskScore
        });
    } catch (error) {
        console.error("Error in deleting data:", error);
        return res.status(500).json({
            message: "Error In Delete Data",
            riskScore: 0
        });
    }
};