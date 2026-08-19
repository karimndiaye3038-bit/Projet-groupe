const mongoose = require("mongoose");

const deadlineSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        // Si la deadline appartient à une tâche
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null
        },

        date: {
            type: Date,
            required: true
        },

        priority: {
            type: String,
            enum: [
                "low",
                "medium",
                "high",
                "urgent"
            ],
            default: "medium"
        },

        status: {
            type: String,
            enum: [
                "todo",
                "in-progress",
                "completed"
            ],
            default: "todo"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Deadline",
    deadlineSchema
);