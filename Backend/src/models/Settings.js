const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  theme: { type: String, default: "light" },
  showCompleted: { type: Boolean, default: true },
  showDescription: { type: Boolean, default: true },
  showPriority: { type: Boolean, default: true },
  confirmDelete: { type: Boolean, default: true }
});

module.exports = mongoose.model("Settings", settingsSchema);
