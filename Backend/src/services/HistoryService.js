const TaskHistory = require("../models/TaskHistory");

class HistoryService {

  // =====================================
  // AJOUTER UN ÉVÉNEMENT
  // =====================================

  async addHistory(data) {
    return await TaskHistory.create(data);
  }

  // =====================================
  // RÉCUPÉRER L'HISTORIQUE D'UNE TÂCHE
  // =====================================

  async getTaskHistory(taskId) {
    return await TaskHistory
      .find({ taskId })
      .sort({ createdAt: 1 });
  }

  // =====================================
  // SUPPRIMER L'HISTORIQUE D'UNE TÂCHE
  // =====================================

  async deleteTaskHistory(taskId) {
    return await TaskHistory.deleteMany({
      taskId,
    });
  }
}

module.exports = new HistoryService();