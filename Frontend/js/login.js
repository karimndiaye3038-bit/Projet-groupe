document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    if (!form) {
        console.error("❌ loginForm introuvable");
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "" || password === "") {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        // Enregistrer la connexion
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        console.log("✅ Connexion réussie");

        // Redirection vers l'application
        window.location.replace("index.html");
    });

});