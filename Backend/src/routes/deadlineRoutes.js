const express = require("express");

const {
  analyzeDeadline
} = require("../controllers/DeadlineController");

const router = express.Router();

router.get("/:id", analyzeDeadline);

module.exports = router;