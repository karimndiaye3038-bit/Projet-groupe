const projectService = require("../services/ProjectService");

class ProjectController {

  // ==========================
  // 6.1 CRÉER UN PROJET
  // ==========================

  async createProject(req, res) {
    try {
      const {
        name,
        description,
        color,
        status,
        startDate,
        deadline,
      } = req.body;

      // Vérification des champs
      if (
        !name ||
        !description ||
        !color ||
        !startDate ||
        !deadline
      ) {
        return res.status(400).json({
          message: "Tous les champs sont obligatoires.",
        });
      }

      const project = await projectService.createProject({
        name,
        description,
        color,
        status,
        startDate,
        deadline,
      });

      return res.status(201).json({
        message: "Projet créé avec succès.",
        project,
      });

    } catch (error) {
      console.error("Erreur création projet :", error);

      return res.status(500).json({
        message: "Erreur lors de la création du projet.",
        error: error.message,
      });
    }
  }

  // ==========================
  // RÉCUPÉRER LES PROJETS
  // ==========================

  async getProjects(req, res) {
    try {
      const projects = await projectService.getProjects();

      return res.status(200).json(projects);

    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de la récupération des projets.",
        error: error.message,
      });
    }
  }

  // ==========================
  // RÉCUPÉRER UN PROJET
  // ==========================

  async getProjectById(req, res) {
    try {
      const project = await projectService.getProjectById(
        req.params.id
      );

      if (!project) {
        return res.status(404).json({
          message: "Projet introuvable.",
        });
      }

      return res.status(200).json(project);

    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de la récupération du projet.",
        error: error.message,
      });
    }
  }

  // ==========================
  // 6.2 MODIFIER
  // ==========================

  async updateProject(req, res) {
    try {
      const project = await projectService.updateProject(
        req.params.id,
        req.body
      );

      if (!project) {
        return res.status(404).json({
          message: "Projet introuvable.",
        });
      }

      return res.status(200).json({
        message: "Projet modifié avec succès.",
        project,
      });

    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de la modification du projet.",
        error: error.message,
      });
    }
  }

  // ==========================
  // 6.3 SUPPRIMER
  // ==========================

  async deleteProject(req, res) {
    try {
      const project = await projectService.deleteProject(
        req.params.id
      );

      if (!project) {
        return res.status(404).json({
          message: "Projet introuvable.",
        });
      }

      return res.status(200).json({
        message: "Projet supprimé avec succès.",
      });

    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de la suppression du projet.",
        error: error.message,
      });
    }
  }

  // ==========================
  // 6.4 ARCHIVER
  // ==========================

  async archiveProject(req, res) {
    try {
      const project = await projectService.archiveProject(
        req.params.id
      );

      if (!project) {
        return res.status(404).json({
          message: "Projet introuvable.",
        });
      }

      return res.status(200).json({
        message: "Projet archivé avec succès.",
        project,
      });

    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de l'archivage du projet.",
        error: error.message,
      });
    }
  }
}

module.exports = new ProjectController();