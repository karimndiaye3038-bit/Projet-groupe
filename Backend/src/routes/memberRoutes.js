const express = require("express");

const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require("../controllers/memberController");

const router = express.Router();

// Créer un membre
router.post("/", createMember);

// Consulter tous les membres
router.get("/", getMembers);

// Consulter un membre
router.get("/:id", getMemberById);

// Modifier un membre
router.put("/:id", updateMember);

// Supprimer un membre
router.delete("/:id", deleteMember);

module.exports = router;