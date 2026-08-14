const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },

    display: {
      type: String,
      enum: ["normal", "compact"],
      default: "normal",
    },

    confirmDelete: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);