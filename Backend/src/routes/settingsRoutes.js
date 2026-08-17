const express = require("express");

const settingsController =
  require("../controllers/SettingsController");

const router = express.Router();

// Récupérer les paramètres
router.get("/", (req, res) => {
  settingsController.getSettings(req, res);
});

// Modifier les paramètres
router.put("/", (req, res) => {
  settingsController.updateSettings(req, res);
});

module.exports = router;