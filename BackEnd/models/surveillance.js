const mongoose = require("mongoose");

const surveillanceSchema = new mongoose.Schema({
  enseignant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enseignant",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  heures: {
    type: Number,
    required: true,
  },
  minutes: {
    type: Number,
    required: true,
  },
  periode: {
    type: String,
    enum: ["الصباح", "المساء"],
    required: true,
  },
  director: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User", 
  required: true,
}

});

module.exports = mongoose.model("Surveillance", surveillanceSchema);
