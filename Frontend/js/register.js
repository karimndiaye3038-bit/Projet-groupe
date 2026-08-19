document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");
    const message = document.getElementById("message");
    const registerBtn = document.getElementById("registerBtn");

    const API_URL =
        "https://taskflow-pro-u5yu.onrender.com/api/users";


    if (!form) {
        console.error("registerForm introuvable");
        return;
    }


    // ==========================================
    // AFFICHER UN MESSAGE
    // ==========================================

    function showMessage(text, type = "error") {

        message.textContent = text;

        message.classList.remove(
            "hidden",
            "bg-red-50",
            "text-red-600",
            "bg-green-50",
            "text-green-600"
        );

        if (type === "success") {

            message.classList.add(
                "bg-green-50",
                "text-green-600"
            );

        } else {

            message.classList.add(
                "bg-red-50",
                "text-red-600"
            );

        }
    }


    // ==========================================
    // INSCRIPTION
    // ==========================================

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const firstName =
            document.getElementById("firstName")
                .value
                .trim();

        const lastName =
            document.getElementById("lastName")
                .value
                .trim();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;

        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            showMessage(
                "Veuillez remplir tous les champs."
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Le mot de passe doit contenir au moins 6 caractères."
            );

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "Les mots de passe ne correspondent pas."
            );

            return;
        }


        // ==========================================
        // BOUTON
        // ==========================================

        registerBtn.disabled = true;

        registerBtn.textContent =
            "Création du compte...";


        try {

            const response = await fetch(
                `${API_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        password
                    })
                }
            );


            const data = await response.json();

            console.log(
                "Réponse inscription :",
                data
            );


            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Erreur lors de l'inscription."
                );

                return;
            }


            // ==========================================
            // INSCRIPTION RÉUSSIE
            // ==========================================

            showMessage(
                "Compte créé avec succès ! Redirection...",
                "success"
            );


            // Sauvegarder l'utilisateur
            if (data.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

            }


            // Redirection vers connexion
            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1500);


        } catch (error) {

            console.error(
                "Erreur inscription :",
                error
            );

            showMessage(
                "Impossible de communiquer avec le serveur."
            );

        } finally {

            registerBtn.disabled = false;

            registerBtn.textContent =
                "Créer mon compte";

        }

    });

});