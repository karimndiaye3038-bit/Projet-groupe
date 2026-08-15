const Project = require("../models/Project");
const Task = require("../models/Task");
const Member = require("../models/Member");

const getDashboard = async (req, res) => {
  try {
    // ==============================
    // DATE ACTUELLE
    // ==============================

    const now = new Date();

    // ==============================
    // STATISTIQUES PROJETS
    // ==============================

    const totalProjects = await Project.countDocuments();

    const activeProjects = await Project.countDocuments({
      status: "active",
    });

    const completedProjects = await Project.countDocuments({
      status: "completed",
    });

    // ==============================
    // STATISTIQUES TÂCHES
    // ==============================

    const totalTasks = await Task.countDocuments();

    const todoTasks = await Task.countDocuments({
      status: "todo",
    });

    const inProgressTasks = await Task.countDocuments({
      status: "in-progress",
    });

    const completedTasks = await Task.countDocuments({
      status: "completed",
    });

    // ==============================
    // TÂCHES EN RETARD
    // ==============================

    const overdueTasks = await Task.countDocuments({
      deadline: { $lt: now },
      status: { $ne: "completed" },
    });

    // ==============================
    // NOMBRE DE MEMBRES
    // ==============================

    const totalMembers = await Member.countDocuments();

    // ==============================
    // PROGRESSION GLOBALE
    // ==============================

    let globalProgress = 0;

    if (totalTasks > 0) {
      globalProgress = Math.round(
        (completedTasks / totalTasks) * 100
      );
    }

    // ==============================
    // PROJETS RÉCENTS
    // ==============================

    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Calcul de la progression de chaque projet

    const projectsWithProgress = await Promise.all(
      recentProjects.map(async (project) => {
        const totalProjectTasks = await Task.countDocuments({
          project: project._id,
        });

        const completedProjectTasks = await Task.countDocuments({
          project: project._id,
          status: "completed",
        });

        let progress = 0;

        if (totalProjectTasks > 0) {
          progress = Math.round(
            (completedProjectTasks / totalProjectTasks) * 100
          );
        }

        return {
          ...project,
          progress,
          totalTasks: totalProjectTasks,
          completedTasks: completedProjectTasks,
        };
      })
    );

    // ==============================
    // TÂCHES URGENTES
    // ==============================

    const urgentTasks = await Task.find({
      $or: [
        {
          priority: "urgent",
          status: { $ne: "completed" },
        },
        {
          deadline: { $lt: now },
          status: { $ne: "completed" },
        },
      ],
    })
      .populate("project", "name")
      .populate("assignedTo", "firstName lastName email")
      .sort({ deadline: 1 })
      .limit(10)
      .lean();

    // ==============================
    // RÉPONSE
    // ==============================

    res.status(200).json({
      success: true,

      data: {
        statistics: {
          projects: {
            total: totalProjects,
            active: activeProjects,
            completed: completedProjects,
          },

          tasks: {
            total: totalTasks,
            todo: todoTasks,
            inProgress: inProgressTasks,
            completed: completedTasks,
            overdue: overdueTasks,
          },

          members: {
            total: totalMembers,
          },
        },

        globalProgress,

        recentProjects: projectsWithProgress,

        urgentTasks,
      },
    });
  } catch (error) {
    console.error("Erreur Dashboard :", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors du chargement du Dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};