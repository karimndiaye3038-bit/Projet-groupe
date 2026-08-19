const User = require("../models/User");

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

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur introuvable"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Mot de passe incorrect"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Connexion réussie",
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Erreur login :", error);

        return res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
};


// ==========================================
// INSCRIPTION
// ==========================================

const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            role
        } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs sont obligatoires"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Cet utilisateur existe déjà"
            });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role: role || "user"
        });

        return res.status(201).json({
            success: true,
            message: "Utilisateur enregistré",
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Erreur inscription :", error);

        return res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    login,
    register
};