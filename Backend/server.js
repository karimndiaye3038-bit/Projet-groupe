const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./src/config/db");

// ==============================
// ROUTES
// ==============================

const demoDataRoutes = require("./src/routes/demoDataRoutes");
const statisticsRoutes = require("./src/routes/statisticsRoutes");
const exportRoutes = require("./src/routes/exportRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");
const deadlineRoutes = require("./src/routes/deadlineRoutes");
const memberRoutes = require("./src/routes/memberRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const projectController = require("./src/controllers/ProjectController");
const deadlineController = require("./src/controllers/DeadlineController");

dotenv.config();

// ==============================
// APPLICATION
// ==============================

const app = express();

app.use(cors());
app.use(express.json());

// ==============================
// CONNEXION MONGODB
// ==============================

connectDB();

// ==============================
// ROUTE ACCUEIL
// ==============================

app.get("/", (req, res) => {
  res.json({
    message: "API Gestion des tâches",
  });
});

// ==============================
// ROUTES
// ==============================

// Demo Data
app.use("/api/demo-data", demoDataRoutes);

// Export
app.use("/api/export", exportRoutes);

// Settings
app.use("/api/settings", settingsRoutes);

// Statistics
app.use("/api/statistics", statisticsRoutes);

// Tasks
app.use("/api/tasks", taskRoutes);

// Members
app.use("/api/members", memberRoutes);

// Deadlines
app.use("/api/deadlines", deadlineRoutes);

// ==============================
// ROUTES PROJETS
// ==============================

// Créer un projet
app.post("/api/projects", (req, res) => {
  projectController.createProject(req, res);
});

// Récupérer tous les projets
app.get("/api/projects", (req, res) => {
  projectController.getProjects(req, res);
});

// Récupérer un projet
app.get("/api/projects/:id", (req, res) => {
  projectController.getProjectById(req, res);
});

// Modifier un projet
app.put("/api/projects/:id", (req, res) => {
  projectController.updateProject(req, res);
});

// Supprimer un projet
app.delete("/api/projects/:id", (req, res) => {
  projectController.deleteProject(req, res);
});

// Archiver un projet
app.patch("/api/projects/:id/archive", (req, res) => {
  projectController.archiveProject(req, res);
});

// ==============================
// ANALYSER UNE DEADLINE
// ==============================

app.post("/api/deadlines/analyze", (req, res) => {
  deadlineController.analyzeDeadline(req, res);
});

// ==============================
// SERVEUR
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});