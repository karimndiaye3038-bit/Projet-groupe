
const express = require("express");

const deadlineController =
  require("../controllers/DeadlineController");

const router = express.Router();

// Analyser une deadline
router.post("/analyze", (req, res) => {
  deadlineController.analyzeDeadline(req, res);
});

module.exports = router;
