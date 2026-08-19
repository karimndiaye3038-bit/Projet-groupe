// ======================================================
// TASKFLOW PRO
// AUTHENTIFICATION
// ======================================================


// ======================================================
// VÉRIFIER LA CONNEXION
// ======================================================

function checkAuthentication() {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {

        window.location.href =
            "../index.html";

    }

}


// ======================================================
// DÉCONNEXION
// ======================================================

function logout() {

    const confirmation = confirm(
        "Voulez-vous vraiment vous déconnecter ?"
    );

    if (!confirmation) {
        return;
    }


    // Supprimer les informations de connexion

    localStorage.removeItem(
        "isLoggedIn"
    );

    localStorage.removeItem(
        "userEmail"
    );


    // Retour à la connexion

    window.location.href =
        "./login.html";

}


// ======================================================
// INITIALISATION
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Bouton déconnexion

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );

        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                logout
            );

        }

    }
);