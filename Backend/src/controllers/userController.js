const User = require("../models/User");

// =====================================================
// CONNEXION
// =====================================================

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email et mot de passe obligatoires"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Chercher l'utilisateur dans MongoDB
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur introuvable"
            });
        }

        // Vérifier le mot de passe
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Mot de passe incorrect"
            });
        }

        // Connexion réussie
        return res.status(200).json({
            success: true,
            message: "Connexion réussie",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error(
            "Erreur connexion :",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
        });
    }
};

module.exports = {
    login
};