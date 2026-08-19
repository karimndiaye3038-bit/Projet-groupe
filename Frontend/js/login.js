document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    if (!form) {
        console.error("loginForm introuvable");
        return;
    }

    const API_URL =
        "https://taskflow-pro-u5yu.onrender.com/api/users";

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {

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

            const data = await response.json();

            console.log("Réponse serveur :", data);

            if (!response.ok) {

                alert(
                    data.message ||
                    "Impossible de se connecter."
                );

                return;
            }

            // ==============================
            // SESSION
            // ==============================

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            localStorage.setItem(
                "userId",
                data.user.id
            );

            localStorage.setItem(
                "userEmail",
                data.user.email
            );

            // ==============================
            // REDIRECTION
            // ==============================

            window.location.href =
                "index.html";

        } catch (error) {

            console.error(
                "Erreur connexion :",
                error
            );

            alert(
                "Impossible de communiquer avec le serveur."
            );
        }
    });
});