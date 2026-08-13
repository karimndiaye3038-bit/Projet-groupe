const Project = require("../models/Project");

class ProjectService {

  // =====================================
  // CRÉER UN PROJET
  // =====================================

  async createProject(data) {
    const project = await Project.create(data);

    return project;
  }

  // =====================================
  // RÉCUPÉRER TOUS LES PROJETS
  // =====================================

  async getProjects() {
    const projects = await Project.find()
      .sort({ createdAt: -1 });

    return projects;
  }

  // =====================================
  // RÉCUPÉRER UN PROJET
  // =====================================

  async getProjectById(id) {
    const project = await Project.findById(id);

    return project;
  }

  // =====================================
  // MODIFIER UN PROJET
  // =====================================

  async updateProject(id, data) {
    const project = await Project.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    return project;
  }

  // =====================================
  // SUPPRIMER UN PROJET
  // =====================================

  async deleteProject(id) {
    const project = await Project.findByIdAndDelete(id);

    return project;
  }

  // =====================================
  // ARCHIVER UN PROJET
  // =====================================

  async archiveProject(id) {
    const project = await Project.findByIdAndUpdate(
      id,
      {
        archived: true,
        status: "Archivé",
      },
      {
        new: true,
      }
    );

    return project;
  }
}

module.exports = new ProjectService();