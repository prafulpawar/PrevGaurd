const mongoose = require('mongoose');

const dataBreach = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // unique index ki jarurat nhi hai
    },
    leakedAt: {
        type: String,
        required: true
    },
    websites: {
        type: [String],
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});



const BreachModel = mongoose.model('dataBreach', dataBreach, 'dataBreach');
module.exports = BreachModel;