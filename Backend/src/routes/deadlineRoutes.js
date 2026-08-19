const express = require("express");

const router = express.Router();

const {
    getDeadlines,
    getDeadlineById,
    createDeadline,
    updateDeadline,
    updateDeadlineStatus,
    deleteDeadline
} = require("./src/controllers/deadlineController");

// GET toutes les deadlines
router.get("/", getDeadlines);

// GET une deadline
router.get("/:id", getDeadlineById);

// POST nouvelle deadline
router.post("/", createDeadline);

// PUT modifier
router.put("/:id", updateDeadline);

// PATCH statut
router.patch("/:id/status", updateDeadlineStatus);

// DELETE
router.delete("/:id", deleteDeadline);

module.exports = router;