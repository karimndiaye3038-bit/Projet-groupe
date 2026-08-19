const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const {
  validateTask,
} = require("../middlewares/validation");

const router = express.Router();

// ================================
// CRÉER UNE TÂCHE
// ================================
router.post("/", validateTask, createTask);

// ================================
// AFFICHER TOUTES LES TÂCHES
// ================================
router.get("/", getTasks);

// ================================
// AFFICHER UNE TÂCHE
// ================================
router.get("/:id", getTaskById);

// ================================
// MODIFIER UNE TÂCHE
// ================================
router.put("/:id", updateTask);

// ================================
// SUPPRIMER UNE TÂCHE
// ================================
router.delete("/:id", deleteTask);

module.exports = router;