const Settings = require("../models/Settings");

class SettingsService {
  async getSettings() {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        theme: "light",
        showCompleted: true,
        showDescription: true,
        showPriority: true,
        confirmDelete: true
      });
    }
    return settings;
  }

  async updateSettings(data) {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(data);
      return settings;
    }

    if (data.theme !== undefined) settings.theme = data.theme;
    if (data.showCompleted !== undefined) settings.showCompleted = data.showCompleted;
    if (data.showDescription !== undefined) settings.showDescription = data.showDescription;
    if (data.showPriority !== undefined) settings.showPriority = data.showPriority;
    if (data.confirmDelete !== undefined) settings.confirmDelete = data.confirmDelete;

    await settings.save();
    return settings;
  }
}

module.exports = new SettingsService();
