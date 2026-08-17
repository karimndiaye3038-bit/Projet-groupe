// ==========================================
// VALIDATION TÂCHE
// ==========================================

function validateTask(req, res, next) {

  const {
    title,
    project,
    priority
  } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Le titre de la tâche est obligatoire."
    });
  }

  if (title.trim().length < 3) {
    return res.status(400).json({
      message: "Le titre doit contenir au moins 3 caractères."
    });
  }

  if (!project) {
    return res.status(400).json({
      message: "Le projet est obligatoire."
    });
  }

  if (!priority) {
    return res.status(400).json({
      message: "La priorité est obligatoire."
    });
  }

  const allowedPriorities = [
    "low",
    "medium",
    "high",
    "urgent"
  ];

  if (!allowedPriorities.includes(priority)) {
    return res.status(400).json({
      message: "La priorité est invalide."
    });
  }

  next();
}


// ==========================================
// VALIDATION MEMBRE
// ==========================================

function validateMember(req, res, next) {

  const {
    firstName,
    lastName,
    email,
    role
  } = req.body;

  if (!firstName) {
    return res.status(400).json({
      message: "Le prénom est obligatoire."
    });
  }

  if (!lastName) {
    return res.status(400).json({
      message: "Le nom est obligatoire."
    });
  }

  if (!email) {
    return res.status(400).json({
      message: "L'email est obligatoire."
    });
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "L'adresse email est invalide."
    });
  }

  if (!role) {
    return res.status(400).json({
      message: "Le rôle est obligatoire."
    });
  }

  next();
}


// ==========================================
// VALIDATION PROJET
// ==========================================

function validateProject(req, res, next) {

  const {
    name,
    deadline
  } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Le nom du projet est obligatoire."
    });
  }

  if (name.trim().length < 3) {
    return res.status(400).json({
      message: "Le nom doit contenir au moins 3 caractères."
    });
  }

  if (deadline) {

    const deadlineDate = new Date(deadline);

    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        message: "La deadline est invalide."
      });
    }
  }

  next();
}


module.exports = {
  validateTask,
  validateMember,
  validateProject
};