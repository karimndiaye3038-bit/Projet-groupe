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

// ==============================
// CRÉER UNE TÂCHE
// ==============================
router.post("/", validateTask, createTask);

// ==============================
// RÉCUPÉRER TOUTES LES TÂCHES
// ==============================
router.get("/", getTasks);

// ==============================
// RÉCUPÉRER UNE TÂCHE
// ==============================
router.get("/:id", getTaskById);

// ==============================
// MODIFIER UNE TÂCHE
// ==============================
router.put("/:id", updateTask);

// ==============================
// SUPPRIMER UNE TÂCHE
// ==============================
router.delete("/:id", deleteTask);

// ==============================
// EXPORT
// ==============================
module.exports = router;