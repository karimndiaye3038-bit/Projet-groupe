const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./src/config/db");

// =====================================================
// ROUTES
// =====================================================

const userRoutes = require("./src/routes/userRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const memberRoutes = require("./src/routes/memberRoutes");
const deadlineRoutes = require("./src/routes/deadlineRoutes");
const demoDataRoutes = require("./src/routes/demoDataRoutes");
const statisticsRoutes = require("./src/routes/statisticsRoutes");
const exportRoutes = require("./src/routes/exportRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");

// =====================================================
// CONTROLLERS
// =====================================================

const projectController = require("./src/controllers/ProjectController");

// =====================================================
// MODELS
// =====================================================

const Project = require("./src/models/Project");

// =====================================================
// APPLICATION
// =====================================================

const app = express();

// =====================================================
// MIDDLEWARES
// =====================================================

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());

// =====================================================
// CONNEXION MONGODB
// =====================================================

connectDB();

// =====================================================
// FRONTEND
// =====================================================

const frontendPath = path.join(__dirname, "../Frontend");

console.log("Frontend :", frontendPath);

app.use(express.static(frontendPath));

// =====================================================
// ACCUEIL
// =====================================================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(frontendPath, "index.html")
    );
});

// =====================================================
// TEST API
// =====================================================

app.get("/api/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TaskFlow API fonctionne correctement"
    });
});

// =====================================================
// AUTHENTIFICATION / UTILISATEURS
// =====================================================

app.use(
    "/api/users",
    userRoutes
);

// =====================================================
// TÂCHES
// =====================================================

app.use(
    "/api/tasks",
    taskRoutes
);

// =====================================================
// MEMBRES
// =====================================================

app.use(
    "/api/members",
    memberRoutes
);

// =====================================================
// DEADLINES
// =====================================================

app.use(
    "/api/deadlines",
    deadlineRoutes
);

// =====================================================
// DEMO DATA
// =====================================================

app.use(
    "/api/demo-data",
    demoDataRoutes
);

// =====================================================
// STATISTIQUES
// =====================================================

app.use(
    "/api/statistics",
    statisticsRoutes
);

// =====================================================
// EXPORT
// =====================================================

app.use(
    "/api/export",
    exportRoutes
);

// =====================================================
// SETTINGS
// =====================================================

app.use(
    "/api/settings",
    settingsRoutes
);

// =====================================================
// PROJETS
// =====================================================

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

// =====================================================
// PROJETS ARCHIVÉS
// =====================================================

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

// =====================================================
// ROUTE 404 API
// =====================================================

app.use(
    "/api",
    (req, res) => {

        res.status(404).json({
            success: false,
            message: "Route API introuvable",
            path: req.originalUrl
        });

    }
);

// =====================================================
// GESTION DES ERREURS
// =====================================================

app.use(
    (error, req, res, next) => {

        console.error(
            "Erreur serveur :",
            error
        );

        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur"
        });

    }
);

// =====================================================
// SERVEUR
// =====================================================

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