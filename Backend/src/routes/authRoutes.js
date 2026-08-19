const express = require("express");

const {
  login,
} = require("../controllers/authController");

const router = express.Router();

// Connexion
router.post("/login", login);

module.exports = router;