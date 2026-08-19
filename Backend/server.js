const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./src/config/db");

// ==============================
// MODELS
// ==============================

const Project = require("./src/models/Project");

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

// ==============================
// CONTROLLERS
// ==============================

const projectController = require("./src/controllers/ProjectController");
const deadlineController = require("./src/controllers/DeadlineController");

// ==============================
// ENV
// ==============================

dotenv.config();

// ==============================
// APPLICATION
// ==============================

const app = express();

// ==============================
// MIDDLEWARES
// ==============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

// ==============================
// CONNEXION MONGODB
// ==============================

connectDB();

// ==============================
// FRONTEND
// ==============================

const frontendPath = path.join(__dirname, "../Frontend");

console.log("Frontend :", frontendPath);

app.use(express.static(frontendPath));

// ==============================
// ROUTE ACCUEIL
// ==============================

app.get("/", (req, res) => {
  res.sendFile(
    path.join(frontendPath, "index.html")
  );
});

// ==============================
// ROUTES API
// ==============================

// Demo Data
app.use(
  "/api/demo-data",
  demoDataRoutes
);

// Export
app.use(
  "/api/export",
  exportRoutes
);

// Settings
app.use(
  "/api/settings",
  settingsRoutes
);

// Statistics
app.use(
  "/api/statistics",
  statisticsRoutes
);

// Tasks
app.use(
  "/api/tasks",
  taskRoutes
);

// Members
app.use(
  "/api/members",
  memberRoutes
);

// Deadlines
app.use(
  "/api/deadlines",
  deadlineRoutes
);

// ==============================
// ROUTES PROJETS
// ==============================

// Créer un projet
app.post(
  "/api/projects",
  (req, res) => {
    projectController.createProject(req, res);
  }
);

// Récupérer tous les projets
app.get(
  "/api/projects",
  (req, res) => {
    projectController.getProjects(req, res);
  }
);

// Récupérer un projet
app.get(
  "/api/projects/:id",
  (req, res) => {
    projectController.getProjectById(req, res);
  }
);

// Modifier un projet
app.put(
  "/api/projects/:id",
  (req, res) => {
    projectController.updateProject(req, res);
  }
);

// Supprimer un projet
app.delete(
  "/api/projects/:id",
  (req, res) => {
    projectController.deleteProject(req, res);
  }
);

// Archiver un projet
app.patch(
  "/api/projects/:id/archive",
  (req, res) => {
    projectController.archiveProject(req, res);
  }
);

// ==============================
// PROJETS ARCHIVÉS
// ==============================

app.get(
  "/api/projects/archived",
  async (req, res) => {
    try {

      const projects = await Project.find({
        archived: true
      });

      res.status(200).json({
        success: true,
        projects
      });

    } catch (error) {

      console.error(
        "Erreur projets archivés :",
        error
      );

      res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message
      });
    }
  }
);

// ==============================
// ANALYSER UNE DEADLINE
// ==============================

app.post(
  "/api/deadlines/analyze",
  (req, res) => {
    deadlineController.analyzeDeadline(
      req,
      res
    );
  }
);

// ==============================
// ROUTE TEST API
// ==============================

app.get(
  "/api",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "API TaskFlow fonctionne",
      routes: {
        members: "/api/members",
        tasks: "/api/tasks",
        projects: "/api/projects",
        deadlines: "/api/deadlines",
        statistics: "/api/statistics"
      }
    });
  }
);

// ==============================
// GESTION DES ERREURS
// ==============================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message: "Route introuvable",
      path: req.originalUrl
    });
  }
);

// ==============================
// SERVEUR
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Serveur démarré sur le port ${PORT}`
    );
  }
);