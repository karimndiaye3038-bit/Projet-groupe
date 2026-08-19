const User = require("../models/User");

// =====================================================
// CONNEXION
// =====================================================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe obligatoires.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Chercher l'utilisateur
    let user = await User.findOne({
      email: normalizedEmail,
    });

    // =================================================
    // SI L'UTILISATEUR N'EXISTE PAS
    // ON LE CRÉE
    // =================================================

    if (!user) {
      user = await User.create({
        email: normalizedEmail,
        password: password,
        role: "user",
        lastLogin: new Date(),
      });

      console.log("✅ Nouvel utilisateur créé :", user.email);
    } else {
      // =================================================
      // UTILISATEUR EXISTANT
      // =================================================

      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Email ou mot de passe incorrect.",
        });
      }

      user.lastLogin = new Date();

      await user.save();

      console.log("✅ Connexion utilisateur :", user.email);
    }

    // =================================================
    // NE PAS ENVOYER LE MOT DE PASSE
    // =================================================

    res.status(200).json({
      success: true,
      message: "Connexion réussie.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("❌ Erreur connexion :", error);

    res.status(500).json({
      success: false,
      message: "Erreur serveur.",
      error: error.message,
    });
  }
};