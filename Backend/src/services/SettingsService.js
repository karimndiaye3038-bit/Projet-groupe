const Settings = require("../models/Settings");

class SettingsService {

  // Récupérer les paramètres
  async getSettings() {

    let settings = await Settings.findOne();

    // Si aucun paramètre n'existe
    if (!settings) {
      settings = await Settings.create({
        theme: "light",
        display: "normal",
        confirmDelete: true,
      });
    }

    return settings;
  }

  // Modifier les paramètres
  async updateSettings(data) {

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(data);
      return settings;
    }

    if (data.theme !== undefined) {
      settings.theme = data.theme;
    }

    if (data.display !== undefined) {
      settings.display = data.display;
    }

    if (data.confirmDelete !== undefined) {
      settings.confirmDelete = data.confirmDelete;
    }

    await settings.save();

    return settings;
  }
}

module.exports = new SettingsService();