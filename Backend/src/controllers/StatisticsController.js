const statisticsService =
  require("../services/StatisticsService");

class StatisticsController {

  async getStatistics(req, res) {

    try {

      const statistics =
        await statisticsService.getStatistics();

      res.status(200).json(statistics);

    } catch (error) {

      res.status(500).json({
        message: "Erreur lors du calcul des statistiques.",
        error: error.message
      });

    }
  }
}

module.exports = new StatisticsController();