const express = require("express");

const demoDataController =
  require("../controllers/DemoDataController");

const router = express.Router();

// Initialiser les données
router.post(
  "/initialize",
  (req, res) => {
    demoDataController.initialize(req, res);
  }
);

// Réinitialiser les données
router.post(
  "/reset",
  (req, res) => {
    demoDataController.reset(req, res);
  }
);

module.exports = router;