const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/TaskController");

const {
  validateTask,
} = require("../middlewares/validation");

const router = express.Router();

// Créer une tâche
router.post("/", validateTask, createTask);

// Afficher toutes les tâches
router.get("/", getTasks);

// Afficher une tâche
router.get("/:id", getTaskById);

// Modifier une tâche
router.put("/:id", updateTask);

// Supprimer une tâche
router.delete("/:id", deleteTask);

module.exports = router;

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