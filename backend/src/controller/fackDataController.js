const fackModel = require('../models/fackData')
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
        addhar = false,
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

    if (addhar) {
        generatedData.aadhaar = generateFakeAadhaar();
    }

    if (address) {
        generatedData.address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, ${faker.location.zipCode()}`;
    }

    return generatedData;
}

module.exports.generateFackData = async (req, res) => {
    try {
        const options = req.body;
        if(options ==null){
           return res.status(200).json({
              message:"Null"
           })
        }
        const data = generateFakeUser(options);

        console.log("Generated data based on options:", data);

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

module.exports.deleteFackData = async (req, res) => {
    try {

    }
    catch (error) {
        return res.status(400).json({
            message: "Deletion Is Failed"
        })
    }
}

module.exports.saveFackData = async (req, res) => {
    try {
          const {name,email,aadhar,phone,pan,address} = req.body;
          const {user} = req.user;
          console.log(user)
        //   const savedData =await fackModel.create({
        //        name,
        //        email,
        //        aadhar,
        //        phone,
        //        pan,
        //        address,
        //        savedBy:_id
        //   })

          return res.status(200).json({
            savedData,
            message: "Data Saved SuccessFully"
        })

    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "SavingData Is Failed"
        })
    }
}
module.exports.deleteFackData = async(req,res) =>{
      try{

        const { id } = req.params;
        const { userId } = req.user;

           
           if(!id){
              
            return res.status(400).json({
                message: "Error In  Deleting User "
            })
           }

           if (!userId) {
          
           return res.status(401).json({ message: "Unauthorized: User information not found." });
          }

          const matchUser = await fackModel.findById()
            // finding users id 
           const deletedItem =await fackModel.findByIdAndDelete({_id: id,});
           return res.status(400).json({
            deletedItem,
            message: "Item Is Deleted"
        })
      }
      catch(error){
        console.log(error)
        return res.status(400).json({
            message: "Error In  Failed"
        })
      }
}