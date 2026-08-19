// ======================================================
// TASKFLOW PRO - LOGIN
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    if (!form) {
        console.error("❌ loginForm introuvable");
        return;
    }

    // ==================================================
    // API
    // ==================================================

    const API_URL =
        "https://taskflow-pro-u5yu.onrender.com/api/users";


    // ==================================================
    // CONNEXION
    // ==================================================

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const emailInput =
            document.getElementById("email");

        const passwordInput =
            document.getElementById("password");


        if (!emailInput || !passwordInput) {
            console.error(
                "❌ Champs email ou password introuvables"
            );
            return;
        }


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value.trim();


        // ==================================================
        // VALIDATION
        // ==================================================

        if (!email || !password) {

            alert(
                "Veuillez remplir tous les champs."
            );

            return;
        }


        try {

            console.log("🔄 Connexion en cours...");


            // ==================================================
            // APPEL BACKEND
            // ==================================================

            const response = await fetch(
                `${API_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            // ==================================================
            // RÉPONSE
            // ==================================================

            const data =
                await response.json();


            console.log(
                "Réponse serveur :",
                data
            );


            // ==================================================
            // ERREUR
            // ==================================================

            if (!response.ok || !data.success) {

                alert(
                    data.message ||
                    "Email ou mot de passe incorrect."
                );

                return;
            }


            // ==================================================
            // CONNEXION RÉUSSIE
            // ==================================================

            console.log(
                "✅ Connexion réussie"
            );


            // ==================================================
            // SAUVEGARDER L'UTILISATEUR
            // ==================================================

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );


            localStorage.setItem(
                "userEmail",
                data.user.email
            );


            localStorage.setItem(
                "userId",
                data.user.id
            );


            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            console.log(
                "👤 Utilisateur connecté :",
                data.user
            );


            // ==================================================
            // REDIRECTION
            // ==================================================

            window.location.href =
                "index.html";


        } catch (error) {

            console.error(
                "❌ Erreur connexion :",
                error
            );


            alert(
                "Impossible de communiquer avec le serveur."
            );

        }

    });

});