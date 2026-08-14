const express = require("express");

const statisticsController =
  require("../controllers/StatisticsController");

const router = express.Router();

router.get("/", (req, res) => {
  statisticsController.getStatistics(req, res);
});

module.exports = router;