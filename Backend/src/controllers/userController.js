const User = require("../models/User");

// ==========================================
// INSCRIPTION
// ==========================================

const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email et mot de passe obligatoires"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Cet utilisateur existe déjà"
            });
        }

        const user = await User.create({
            name: name || "",
            email: email.toLowerCase(),
            password
        });

        return res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error("Erreur inscription :", error);

        return res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
        });
    }
};


// ==========================================
// CONNEXION
// ==========================================

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email et mot de passe obligatoires"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect"
            });
        }

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

        console.error("Erreur connexion :", error);

        return res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
        });
    }
};


module.exports = {
    register,
    login
};