const fackModel = require('../models/fackData');
const { faker } = require('@faker-js/faker');

function generateFakePAN() {
    const letters = faker.string.alpha({ length: 5, casing: 'upper' });
    const digits = faker.number.int({ min: 1000, max: 9999 }).toString();
    const lastLetter = faker.string.alpha({ length: 1, casing: 'upper' });
    return letters + digits + lastLetter;
}

function generateFakeAadhaar() {
    let aadhaar = '';
    for (let i = 0; i < 3; i++) {
        const part = faker.number.int({ min: 0, max: 9999 }).toString().padStart(4, '0');
        aadhaar += part + ' ';
    }
    return aadhaar.trim();
}

function generateFakeUser(options) {
    const {
        name = false,
        email = false,
        phone = false,
        pan = false,
        aadhar = false, 
        address = false
    } = options;

    const generatedData = {};

    if (name) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        generatedData.name = `${firstName} ${lastName}`;
    }

    if (email) {
        const firstNameForEmail = generatedData.name ? generatedData.name.split(' ')[0] : undefined;
        const lastNameForEmail = generatedData.name ? generatedData.name.split(' ')[1] : undefined;
        generatedData.email = faker.internet.email({ firstName: firstNameForEmail, lastName: lastNameForEmail });
    }

    if (phone) {
        generatedData.phone = faker.phone.number('+91##########');
    }

    if (pan) {
        generatedData.pan = generateFakePAN();
    }

    if (aadhar) { // Corrected key
        generatedData.aadhar = generateFakeAadhaar(); // Corrected key
    }

    if (address) {
        generatedData.address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, ${faker.location.zipCode()}`;
    }

    return generatedData;
}

module.exports.generateFackData = async (req, res) => {
    try {
        const options = req.body;
        if (!options) {
            return res.status(400).json({
                message: "Options are required."
            });
        }
        const data = generateFakeUser(options);
        return res.status(200).json({
            message: "Data generated successfully based on provided options.",
            data: data
        });

    } catch (error) {
        console.error("Error during data generation:", error);
        return res.status(500).json({
            message: "Generation Failed due to an internal error."
        });
    }
};

module.exports.saveFackData = async (req, res) => {
    try {
        const { name, email, aadhar, phone, pan, address ,savedBy  } = req.body; 
       
       
        const userId = req.user._id;
       
        const savedData = await fackModel.create({
            savedAs:userId,
            name,
            email,
            aadhar, 
            phone,
            pan,
            address,
            savedBy,
        });

        return res.status(200).json({
            savedData,
            message: "Data Saved SuccessFully"
        });

    } catch (error) {
        console.error("Error saving data:", error);
        return res.status(500).json({
            message: "SavingData Is Failed"
        });
    }
};

module.exports.deleteFackData = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        if (!id) {
            return res.status(400).json({
                message: "Error In Deleting User: ID is required."
            });
        }
        const deletedItem = await fackModel.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                message: "Invalid Id or Item not found."
            });
        }

        return res.status(200).json({
            deletedItem,
            message: "Item Is Deleted"
        });
    } catch (error) {
        console.error("Error deleting data:", error);
        return res.status(500).json({
            message: "Error In Deleting Data"
        });
    }
};


module.exports.getAllSavedFackData = async(req,res)=>{
    try {
        const userId = req.user._id; 
         
        const data = await fackModel.find({ savedAs: userId }).select(' -__v'); 
        return res.status(200).json({
            data,
            message:"Successfully Fetched Saved Fake Data"
        });
    } catch (error) {
        console.error("Error fetching saved fake data:", error);
        return res.status(500).json({ message: "Failed to fetch saved fake data" });
    }
}