const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: [
        "développeur",
        "designer",
        "chef de projet",
        "product manager",
        "testeur",
        "autre",
      ],
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    
  }
  
);

module.exports = mongoose.model("Member", memberSchema);