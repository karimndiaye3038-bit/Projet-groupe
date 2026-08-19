const User = require("../models/User");


// ==========================================
// INSCRIPTION
// ==========================================

const register = async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;


        // Vérification
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Tous les champs sont obligatoires."
            });

        }


        // Vérifier si l'utilisateur existe
        const existingUser =
            await User.findOne({ email });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Cet email est déjà utilisé."
            });

        }


        // Créer utilisateur
        const user = await User.create({

            firstName,
            lastName,
            email,
            password

        });


        res.status(201).json({

            success: true,

            message: "Utilisateur créé avec succès.",

            user: {

                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email

            }

        });


    } catch (error) {

        console.error(
            "Erreur inscription :",
            error
        );

        res.status(500).json({

            success: false,

            message: "Erreur serveur."

        });

    }

};


// ==========================================
// CONNEXION
// ==========================================

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const user =
            await User.findOne({ email });


        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Email ou mot de passe incorrect."

            });

        }


        if (user.password !== password) {

            return res.status(401).json({

                success: false,

                message: "Email ou mot de passe incorrect."

            });

        }


        res.json({

            success: true,

            message: "Connexion réussie.",

            user: {

                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email

            }

        });


    } catch (error) {

        console.error(
            "Erreur connexion :",
            error
        );

        res.status(500).json({

            success: false,

            message: "Erreur serveur."

        });

    }

};


module.exports = {
    register,
    login
};