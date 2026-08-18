
// ======================================================
// TASKFLOW PRO
// GESTION DES PROJETS ARCHIVÉS
// ======================================================

// Vérification
console.log("archive.js chargé");


// ======================================================
// ÉLÉMENTS HTML
// ======================================================

const archiveContainer =
    document.getElementById("archiveContainer");

const archiveEmpty =
    document.getElementById("archiveEmpty");

const archiveSearch =
    document.getElementById("archiveSearch");


// ======================================================
// STOCKAGE LOCAL DES ARCHIVES
// ======================================================

// Cette variable contient les projets récupérés
// depuis le backend.
let archivedProjects = [];


// ======================================================
// RÉCUPÉRER LES PROJETS ARCHIVÉS
// ======================================================

async function loadArchivedProjects() {

    try {

        const projects = await getProjectsFromAPI();

        console.log("TOUS LES PROJETS :", projects);

        archivedProjects = projects;

        displayArchivedProjects(archivedProjects);

    } catch (error) {

        console.error("Erreur :", error);

    }
}


// ======================================================
// AFFICHER LES PROJETS ARCHIVÉS
// ======================================================

function displayArchivedProjects(projects) {

    archiveContainer.innerHTML = "";


    // Aucun projet
    if (!projects || projects.length === 0) {

        archiveEmpty.classList.remove("hidden");

        return;
    }


    // Il existe des projets
    archiveEmpty.classList.add("hidden");


    projects.forEach(project => {

        const card = document.createElement("div");

        card.className = `
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-6
            shadow-sm
            hover:shadow-md
            transition
        `;


        // --------------------------------------------------
        // DONNÉES DU PROJET
        // --------------------------------------------------

        const name =
            project.name ||
            project.title ||
            "Projet sans nom";

        const description =
            project.description ||
            "Aucune description disponible.";

        const createdAt =
            project.createdAt
                ? new Date(project.createdAt).toLocaleDateString("fr-FR")
                : "Date inconnue";


        // --------------------------------------------------
        // CARTE
        // --------------------------------------------------

        card.innerHTML = `

            <div class="flex items-start justify-between mb-4">

                <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl">
                    📦
                </div>

                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    Archivé
                </span>

            </div>


            <h3 class="text-lg font-bold text-slate-900 mb-2">
                ${escapeHTML(name)}
            </h3>


            <p class="text-sm text-slate-500 mb-4">
                ${escapeHTML(description)}
            </p>


            <div class="border-t border-slate-100 pt-4">

                <p class="text-xs text-slate-400">
                    Projet créé le
                </p>

                <p class="text-sm font-medium text-slate-700">
                    ${createdAt}
                </p>

            </div>


            <div class="flex gap-2 mt-5">

                <button
                    onclick="restoreProject('${project._id}')"
                    class="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                >
                    Restaurer
                </button>


                <button
                    onclick="deleteArchivedProject('${project._id}')"
                    class="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
                >
                    Supprimer
                </button>

            </div>

        `;


        archiveContainer.appendChild(card);

    });
}


// ======================================================
// RECHERCHE
// ======================================================

archiveSearch.addEventListener("input", function () {

    const search =
        this.value.toLowerCase().trim();


    const filteredProjects =
        archivedProjects.filter(project => {

            const name =
                (
                    project.name ||
                    project.title ||
                    ""
                ).toLowerCase();


            const description =
                (
                    project.description ||
                    ""
                ).toLowerCase();


            return (
                name.includes(search) ||
                description.includes(search)
            );

        });


    displayArchivedProjects(filteredProjects);

});


// ======================================================
// RESTAURER UN PROJET
// ======================================================

async function restoreProject(projectId) {

    const confirmation =
        confirm(
            "Voulez-vous restaurer ce projet ?"
        );


    if (!confirmation) {
        return;
    }


    try {

        /*
         * Adapte cette URL si ton backend utilise
         * une autre route.
         */

        const response = await fetch(
            `${API_URL}/projects/${projectId}/archive`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    archived: false
                })
            }
        );


        if (!response.ok) {

            throw new Error(
                "Impossible de restaurer le projet."
            );
        }


        alert("Projet restauré avec succès.");


        // Recharger les archives
        loadArchivedProjects();

    } catch (error) {

        console.error(error);

        alert(
            "Erreur lors de la restauration du projet."
        );
    }
}


// ======================================================
// SUPPRIMER UN PROJET ARCHIVÉ
// ======================================================

async function deleteArchivedProject(projectId) {

    const confirmation =
        confirm(
            "Voulez-vous supprimer définitivement ce projet ?"
        );


    if (!confirmation) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/projects/${projectId}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Impossible de supprimer le projet."
            );
        }


        alert("Projet supprimé avec succès.");


        // Recharger
        loadArchivedProjects();

    } catch (error) {

        console.error(error);

        alert(
            "Erreur lors de la suppression du projet."
        );
    }
}


// ======================================================
// PROTECTION CONTRE L'INJECTION HTML
// ======================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ======================================================
// LANCEMENT
// ======================================================

loadArchivedProjects();