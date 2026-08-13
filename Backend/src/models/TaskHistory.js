const mongoose = require("mongoose");

const taskHistorySchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    oldValue: {
      type: String,
      default: null,
    },

    newValue: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      required: true,
    },

    user: {
      type: String,
      default: "Utilisateur",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TaskHistory",
  taskHistorySchema
);