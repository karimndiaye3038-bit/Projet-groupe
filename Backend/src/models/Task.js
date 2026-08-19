// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       default: "",
//     },

//     status: {
//       type: String,
//       enum: ["todo", "in-progress", "paused", "completed"],
//       default: "todo",
//     },

//     priority: {
//       type: String,
//       enum: ["low", "medium", "high", "urgent"],
//       default: "medium",
//     },

//     project: {
//       type: String,
//       required: true,
//     },

//     assignedMember: {
//       type: String,
//       required: true,
//     },

//     tags: {
//       type: [String],
//       default: [],
//     },

//     deadline: {
//       type: Date,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Task", taskSchema);