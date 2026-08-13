const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./src/config/db");
const projectController = require("./src/controllers/ProjectController");
const deadlineController =
  require("./src/controllers/DeadlineController");
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ==============================
// ROUTE ACCUEIL
// ==============================

app.get("/", (req, res) => {
  res.json({
    message: "API Gestion des tâches",
  });
});

// ==============================
// ROUTES PROJETS
// ==============================

// 6.1 Créer un projet
app.post("/api/projects", (req, res) => {
  projectController.createProject(req, res);
});
// ==============================
// GESTION DES DEADLINES
// ==============================

app.post("/api/deadlines/analyze", (req, res) => {
  deadlineController.analyzeDeadline(req, res);
});

// Récupérer tous les projets
app.get("/api/projects", (req, res) => {
  projectController.getProjects(req, res);
});

// Récupérer un projet
app.get("/api/projects/:id", (req, res) => {
  projectController.getProjectById(req, res);
});

// 6.2 Modifier un projet
app.put("/api/projects/:id", (req, res) => {
  projectController.updateProject(req, res);
});

// 6.3 Supprimer un projet
app.delete("/api/projects/:id", (req, res) => {
  projectController.deleteProject(req, res);
});

// 6.4 Archiver un projet
app.patch("/api/projects/:id/archive", (req, res) => {
  projectController.archiveProject(req, res);
});

// ==============================
// SERVEUR
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});