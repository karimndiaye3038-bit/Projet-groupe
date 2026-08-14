const settingsService = require("../services/SettingsService");

class SettingsController {

  // GET /api/settings
  async getSettings(req, res) {

    try {

      const settings =
        await settingsService.getSettings();

      res.status(200).json(settings);

    } catch (error) {

      res.status(500).json({
        message: "Erreur lors de la récupération des paramètres.",
        error: error.message,
      });

    }
  }

  // PUT /api/settings
  async updateSettings(req, res) {

    try {

      const settings =
        await settingsService.updateSettings(req.body);

      res.status(200).json({
        message: "Paramètres modifiés avec succès.",
        settings,
      });

    } catch (error) {

      res.status(500).json({
        message: "Erreur lors de la modification des paramètres.",
        error: error.message,
      });

    }
  }
}

module.exports = new SettingsController();