class DeadlineService {

  analyzeDeadline(deadline, taskStatus) {

    // Vérifier la deadline
    if (!deadline) {
      return {
        status: "INCONNU",
        message: "Aucune deadline définie"
      };
    }

    // =====================================
    // TÂCHE TERMINÉE
    // =====================================

    if (
      taskStatus === "TERMINÉ" ||
      taskStatus === "TERMINE" ||
      taskStatus === "completed"
    ) {
      return {
        status: "TERMINEE",
        message: "Terminée"
      };
    }

    // =====================================
    // CALCUL DES DATES
    // =====================================

    const today = new Date();
    const deadlineDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const difference =
      deadlineDate.getTime() - today.getTime();

    const daysRemaining = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    // =====================================
    // EN RETARD
    // =====================================

    if (daysRemaining < 0) {

      const daysLate = Math.abs(daysRemaining);

      return {
        status: "EN_RETARD",
        message: `En retard de ${daysLate} jour${daysLate > 1 ? "s" : ""}`,
        daysLate
      };
    }

    // =====================================
    // AUJOURD'HUI
    // =====================================

    if (daysRemaining === 0) {

      return {
        status: "ECHEANCE_AUJOURD_HUI",
        message: "Échéance aujourd'hui",
        daysRemaining: 0
      };
    }

    // =====================================
    // DEMAIN
    // =====================================

    if (daysRemaining === 1) {

      return {
        status: "ECHEANCE_PROCHE",
        message: "Échéance demain",
        daysRemaining: 1
      };
    }

    // =====================================
    // ÉCHÉANCE PROCHE
    // =====================================

    if (daysRemaining <= 7) {

      return {
        status: "ECHEANCE_PROCHE",
        message: `Échéance dans ${daysRemaining} jours`,
        daysRemaining
      };
    }

    // =====================================
    // EN AVANCE
    // =====================================

    return {
      status: "EN_AVANCE",
      message: `Échéance dans ${daysRemaining} jours`,
      daysRemaining
    };
  }
}

module.exports = new DeadlineService();