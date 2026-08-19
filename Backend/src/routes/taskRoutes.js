const express = require("express");

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controllers/TaskController");

const {
    validateTask
} = require("../middlewares/validation");

const router = express.Router();


// Créer une tâche
router.post(
    "/",
    validateTask,
    createTask
);


// Récupérer toutes les tâches
router.get(
    "/",
    getTasks
);


// Récupérer une tâche
router.get(
    "/:id",
    getTaskById
);


// Modifier une tâche
router.put(
    "/:id",
    updateTask
);


// Supprimer une tâche
router.delete(
    "/:id",
    deleteTask
);


module.exports = rout