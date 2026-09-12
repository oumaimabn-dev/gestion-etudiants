const mongoose = require("mongoose");

const enseignantSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  etablissement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Etablissement",
    required: true,
  },
  directorId: {
  type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Enseignant", enseignantSchema);
