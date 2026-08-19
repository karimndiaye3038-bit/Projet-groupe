const User = require("../models/User");


// =====================================================
// INSCRIPTION
// =====================================================

const register = async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;


        // Vérifier les champs
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


        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Cet email est déjà utilisé."
            });

        }


        // Créer l'utilisateur
        const user = await User.create({

            firstName: firstName.trim(),

            lastName: lastName.trim(),

            email: email.toLowerCase().trim(),

            password: password

        });


        console.log(
            "✅ Utilisateur créé :",
            user.email
        );


        return res.status(201).json({

            success: true,

            message: "Compte créé avec succès.",

            user: {

                id: user._id,

                firstName: user.firstName,

                lastName: user.lastName,

                email: user.email

            }

        });


    } catch (error) {

        console.error(
            "❌ Erreur inscription :",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Erreur serveur."

        });

    }

};


// =====================================================
// CONNEXION
// =====================================================

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Vérification
        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email et mot de passe obligatoires."

            });

        }


        // Rechercher l'utilisateur
        const user = await User.findOne({

            email: email.toLowerCase().trim()

        });


        // Utilisateur inexistant
        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Email ou mot de passe incorrect."

            });

        }


        // Vérifier le mot de passe
        if (user.password !== password) {

            return res.status(401).json({

                success: false,

                message:
                    "Email ou mot de passe incorrect."

            });

        }


        console.log(
            "✅ Connexion :",
            user.email
        );


        // Réponse
        return res.status(200).json({

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
            "❌ Erreur connexion :",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Erreur serveur."

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    register,

    login

};