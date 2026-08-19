document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    if (!form) {
        console.error("loginForm introuvable");
        return;
    }

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        // Enregistrer simplement la connexion
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        // Aller au Dashboard
        window.location.href = "index.html";
    });

});