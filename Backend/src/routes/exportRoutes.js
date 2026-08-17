const express = require("express");

const exportController = require("../controllers/ExportController");

const router = express.Router();

router.get("/", (req, res) => {
  exportController.exportData(req, res);
});

module.exports = router;