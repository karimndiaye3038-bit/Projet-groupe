const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../src/controllers/taskController");
const {
  validateTask
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