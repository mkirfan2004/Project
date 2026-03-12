const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  token: {
    type: String,
    required: true
  },

  expiresAt: {
    type: Date
  }

});

module.exports = mongoose.model("Token", tokenSchema);