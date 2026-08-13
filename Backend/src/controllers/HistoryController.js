const historyService = require("../services/HistoryService");

class HistoryController {

  // =====================================
  // AJOUTER UN ÉVÉNEMENT
  // =====================================

  async addHistory(req, res) {
    try {

      const {
        taskId,
        action,
        oldValue,
        newValue,
        description,
        user,
      } = req.body;

      if (!taskId || !action || !description) {
        return res.status(400).json({
          message:
            "taskId, action et description sont obligatoires.",
        });
      }

      const history =
        await historyService.addHistory({
          taskId,
          action,
          oldValue,
          newValue,
          description,
          user,
        });

      return res.status(201).json({
        message: "Historique enregistré avec succès.",
        history,
      });

    } catch (error) {

      console.error(
        "Erreur historique :",
        error
      );

      return res.status(500).json({
        message:
          "Erreur lors de l'enregistrement de l'historique.",
        error: error.message,
      });
    }
  }

  // =====================================
  // RÉCUPÉRER L'HISTORIQUE
  // =====================================

  async getTaskHistory(req, res) {
    try {

      const history =
        await historyService.getTaskHistory(
          req.params.taskId
        );

      return res.status(200).json({
        taskId: req.params.taskId,
        history,
      });

    } catch (error) {

      return res.status(500).json({
        message:
          "Erreur lors de la récupération de l'historique.",
        error: error.message,
      });
    }
  }
}

module.exports = new HistoryController();