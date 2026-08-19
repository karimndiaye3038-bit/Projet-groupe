document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    if (!form) {
        console.error("❌ loginForm introuvable");
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document
            .getElementById("email")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value
            .trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {

            const response = await fetch(
                "https://taskflow-pro-u5yu.onrender.com/api/users/login",
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

            const data = await response.json();

            console.log("Réponse serveur :", data);

            if (!response.ok) {
                alert(
                    data.message ||
                    "Erreur lors de la connexion."
                );
                return;
            }

            // ==============================
            // CONNEXION RÉUSSIE
            // ==============================

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

            console.log(
                "✅ Utilisateur enregistré dans MongoDB"
            );

            // Redirection
            window.location.href = "index.html";

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