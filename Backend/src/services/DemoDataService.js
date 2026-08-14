const Project = require("../models/Project");
const Task = require("../models/Task");
const Member = require("../models/Member");

class DemoDataService {

  // ==========================================
  // INITIALISER LES DONNÉES DE DÉMONSTRATION
  // ==========================================

  async initializeDemoData() {
    const projectCount = await Project.countDocuments();
    const taskCount = await Task.countDocuments();
    const memberCount = await Member.countDocuments();

    // Si des données existent déjà
    if (
      projectCount > 0 ||
      taskCount > 0 ||
      memberCount > 0
    ) {
      return {
        created: false,
        message: "Les données existent déjà."
      };
    }

    // ==========================================
    // 5 MEMBRES
    // ==========================================

    const members = await Member.insertMany([
      {
        name: "Fatou",
        email: "fatou@taskflow.com",
        role: "Membre"
      },
      {
        name: "Karim",
        email: "karim@taskflow.com",
        role: "Administrateur"
      },
      {
        name: "Eva",
        email: "eva@taskflow.com",
        role: "Membre"
      },
      {
        name: "Moussa",
        email: "moussa@taskflow.com",
        role: "Membre"
      },
      {
        name: "Awa",
        email: "awa@taskflow.com",
        role: "Membre"
      }
    ]);

    // ==========================================
    // 3 PROJETS
    // ==========================================

    const projects = await Project.insertMany([
      {
        name: "Projet E-commerce",
        description: "Création d'une plateforme e-commerce",
        color: "#3B82F6",
        status: "Actif",
        startDate: new Date("2026-08-01"),
        deadline: new Date("2026-10-01"),
        archived: false
      },
      {
        name: "Application Mobile",
        description: "Développement d'une application mobile",
        color: "#10B981",
        status: "Actif",
        startDate: new Date("2026-08-05"),
        deadline: new Date("2026-11-01"),
        archived: false
      },
      {
        name: "Site Web",
        description: "Création du site web de l'entreprise",
        color: "#F59E0B",
        status: "Actif",
        startDate: new Date("2026-08-10"),
        deadline: new Date("2026-09-15"),
        archived: false
      }
    ]);

    // ==========================================
    // 12 TÂCHES
    // ==========================================

    const tasks = [];

    const statuses = [
      "À faire",
      "En cours",
      "En pause",
      "Terminé"
    ];

    const priorities = [
      "Faible",
      "Moyenne",
      "Haute",
      "Urgente"
    ];

    for (let i = 0; i < 12; i++) {

      tasks.push({
        title: `Tâche de démonstration ${i + 1}`,
        description: `Description de la tâche ${i + 1}`,

        project: projects[i % 3]._id,

        member: members[i % 5]._id,

        priority: priorities[i % 4],

        status: statuses[i % 4],

        deadline: new Date(
          Date.now() + (i + 1) * 24 * 60 * 60 * 1000
        )
      });
    }

    await Task.insertMany(tasks);

    return {
      created: true,
      message: "Données de démonstration créées avec succès.",
      projects: projects.length,
      tasks: tasks.length,
      members: members.length
    };
  }

  // ==========================================
  // RÉINITIALISER
  // ==========================================

  async resetDemoData() {

    await Task.deleteMany({});
    await Project.deleteMany({});
    await Member.deleteMany({});

    return await this.initializeDemoData();
  }
}

module.exports = new DemoDataService();