const demoDataService = require("../services/DemoDataService");

class DemoDataController {

  // Initialiser les données
  async initialize(req, res) {

    try {

      const result =
        await demoDataService.initializeDemoData();

      res.status(200).json(result);

    } catch (error) {

      res.status(500).json({
        message: "Erreur lors de l'initialisation des données.",
        error: error.message
      });

    }
  }

  // Réinitialiser les données
  async reset(req, res) {

    try {

      const result =
        await demoDataService.resetDemoData();

      res.status(200).json({
        message: "Données réinitialisées avec succès.",
        result
      });

    } catch (error) {

      res.status(500).json({
        message: "Erreur lors de la réinitialisation.",
        error: error.message
      });

    }
  }
}

module.exports = new DemoDataController();