const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
    },

    startDate: {
      type: Date,
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);