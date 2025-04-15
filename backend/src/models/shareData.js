const mongoose = require('mongoose');

const shareDataSchema = new mongoose.Schema({
  appName: {
    type: String,
  },
  emailUsed: {
    type: String,
  },
  phoneUsed: {
    type: String,
  },
  locationAccess: {
    type: String,
  },
  notes: {
    type: String,
  },
  savedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const shareModel = mongoose.model('shareData', shareDataSchema);
module.exports = shareModel;
