const exportService = require("../services/ExportService");

class ExportController {

  async exportData(req, res) {

    try {

      const data = await exportService.exportData();

      // Date actuelle
      const date = new Date()
        .toISOString()
        .split("T")[0];

      const fileName =
        `taskflow-backup-${date}.json`;

      // Indiquer au navigateur qu'il s'agit
      // d'un fichier à télécharger
      res.setHeader(
        "Content-Type",
        "application/json"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      res.status(200).json(data);

    } catch (error) {

      console.error(
        "Erreur export :",
        error
      );

      res.status(500).json({
        message: "Erreur lors de l'export des données.",
        error: error.message
      });
    }
  }
}

module.exports = new ExportController();