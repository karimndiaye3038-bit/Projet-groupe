const Project = require("../models/Project");
const Task = require("../models/Task");
const Member = require("../models/Member");
const TaskHistory = require("../models/TaskHistory");

class ExportService {

  async exportData() {

    // Récupérer les projets
    const projects = await Project.find().lean();

    // Récupérer les tâches
    const tasks = await Task.find().lean();

    // Récupérer les membres
    const members = await Member.find().lean();

    // Récupérer l'historique
    const history = await TaskHistory.find().lean();

    // Paramètres
    const settings = {
      theme: "light",
      display: "normal",
      confirmDelete: true
    };

    return {
      exportDate: new Date().toISOString(),

      projects,

      tasks,

      members,

      settings,

      history
    };
  }
}

module.exports = new ExportService();
