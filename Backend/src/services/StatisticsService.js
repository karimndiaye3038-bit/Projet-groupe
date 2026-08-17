const Task = require("../models/Task");
const Project = require("../models/Project");

class StatisticsService {

  async getStatistics() {

    const tasks = await Task.find().lean();
    const projects = await Project.find().lean();

    // ==========================================
    // TOTAL
    // ==========================================

    const total = tasks.length;

    // ==========================================
    // STATUTS
    // ==========================================

    const todo = tasks.filter(
      task => task.status === "todo"
    ).length;

    const inProgress = tasks.filter(
      task => task.status === "in-progress"
    ).length;

    const paused = tasks.filter(
      task => task.status === "paused"
    ).length;

    const completed = tasks.filter(
      task => task.status === "completed"
    ).length;

    // ==========================================
    // TÂCHES EN RETARD
    // ==========================================

    const now = new Date();

    const overdue = tasks.filter(task => {

      if (task.status === "completed") {
        return false;
      }

      return new Date(task.deadline) < now;

    }).length;

    // ==========================================
    // PRIORITÉS
    // ==========================================

    const low = tasks.filter(
      task => task.priority === "low"
    ).length;

    const medium = tasks.filter(
      task => task.priority === "medium"
    ).length;

    const high = tasks.filter(
      task => task.priority === "high"
    ).length;

    const urgent = tasks.filter(
      task => task.priority === "urgent"
    ).length;

    // ==========================================
    // PROGRESSION DES PROJETS
    // ==========================================

    const projectStatistics = projects.map(project => {

      const projectTasks = tasks.filter(
        task => String(task.project) === String(project._id)
      );

      const totalTasks = projectTasks.length;

      const completedTasks = projectTasks.filter(
        task => task.status === "completed"
      ).length;

      let progress = 0;

      if (totalTasks > 0) {
        progress =
          Math.round(
            (completedTasks / totalTasks) * 100
          );
      }

      return {
        projectId: project._id,
        name: project.name,
        totalTasks,
        completedTasks,
        progress
      };
    });

    return {

      tasks: {
        total,
        todo,
        inProgress,
        paused,
        completed,
        overdue
      },

      priorities: {
        low,
        medium,
        high,
        urgent
      },

      projects: projectStatistics

    };
  }
}

module.exports = new StatisticsService();