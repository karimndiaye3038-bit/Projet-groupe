const deadlineService = require("../services/DeadlineService");

class DeadlineController {

  // =====================================
  // ANALYSER UNE DEADLINE
  // =====================================

  analyzeDeadline(req, res) {
    try {

      const { deadline, status } = req.body;

      // Vérification
      if (!deadline) {
        return res.status(400).json({
          message: "La deadline est obligatoire."
        });
      }

      // Analyse
      const result = deadlineService.analyzeDeadline(
        deadline,
        status
      );

      return res.status(200).json({
        message: "Deadline analysée avec succès.",
        result
      });

    } catch (error) {

      console.error(
        "Erreur analyse deadline :",
        error
      );

      return res.status(500).json({
        message: "Erreur lors de l'analyse de la deadline.",
        error: error.message
      });
    }
  }
}

module.exports = new DeadlineController();