const mongoose = require('mongoose');

const etablissementSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  etablissement: {
    type: String,
    required: true,
  },
  directorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  
});

module.exports = mongoose.model('Etablissement', etablissementSchema);
