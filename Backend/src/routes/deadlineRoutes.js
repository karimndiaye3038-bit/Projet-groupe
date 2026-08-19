const express = require("express");

const router = express.Router();

// Contrôleur des deadlines
const {
    getDeadlines,
    getDeadlineById,
    createDeadline,
    updateDeadline,
    updateDeadlineStatus,
    deleteDeadline
} = require("../controllers/DeadlineController");

// ==========================================
// GET toutes les deadlines
// GET /api/deadlines
// ==========================================
router.get("/", getDeadlines);

// ==========================================
// GET une deadline
// GET /api/deadlines/:id
// ==========================================
router.get("/:id", getDeadlineById);

// ==========================================
// POST nouvelle deadline
// POST /api/deadlines
// ==========================================
router.post("/", createDeadline);

// ==========================================
// PUT modifier une deadline
// PUT /api/deadlines/:id
// ==========================================
router.put("/:id", updateDeadline);

// ==========================================
// PATCH modifier le statut
// PATCH /api/deadlines/:id/status
// ==========================================
router.patch("/:id/status", updateDeadlineStatus);

// ==========================================
// DELETE une deadline
// DELETE /api/deadlines/:id
// ==========================================
router.delete("/:id", deleteDeadline);

module.exports = router;