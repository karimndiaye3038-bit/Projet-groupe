// ======================================================
// TASKFLOW PRO
// PROJETS ARCHIVÉS
// ======================================================

const archiveContainer =
    document.getElementById("archiveContainer");

const archiveEmpty =
    document.getElementById("archiveEmpty");

const archiveSearch =
    document.getElementById("archiveSearch");


let archivedProjects = [];


// ======================================================
// VÉRIFIER ARCHIVAGE
// ======================================================

function isArchived(project) {

    return project.archived === true;

}


// ======================================================
// CHARGER LES PROJETS ARCHIVÉS
// ======================================================

async function loadArchivedProjects() {

    try {

        const projects =
            await getProjectsFromAPI();


        archivedProjects =
            projects.filter(
                project =>
                    isArchived(project)
            );


        renderArchivedProjects();


    } catch (error) {

        console.error(
            "Erreur chargement archives :",
            error
        );

        archiveContainer.innerHTML = "";

        archiveEmpty.classList.remove("hidden");

    }

}


// ======================================================
// AFFICHER LES ARCHIVES
// ======================================================

function renderArchivedProjects() {

    if (!archiveContainer) {

        return;

    }


    let projects =
        [...archivedProjects];


    // ==================================================
    // RECHERCHE
    // ==================================================

    const search =
        archiveSearch
            ? archiveSearch.value
                .trim()
                .toLowerCase()
            : "";


    if (search) {

        projects =
            projects.filter(
                project => {

                    const name =
                        (
                            project.name ||
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

                }
            );

    }


    // ==================================================
    // AUCUN PROJET
    // ==================================================

    if (projects.length === 0) {

        archiveContainer.innerHTML = "";

        archiveEmpty.classList.remove(
            "hidden"
        );

        return;

    }


    archiveEmpty.classList.add(
        "hidden"
    );


    // ==================================================
    // CARTES
    // ==================================================

    archiveContainer.innerHTML =
        projects
            .map(
                project =>
                    createArchivedCard(project)
            )
            .join("");

}


// ======================================================
// CARTE ARCHIVÉE
// ======================================================

function createArchivedCard(project) {

    const projectId =
        project._id ||
        project.id;


    const color =
        project.color ||
        "#4F46E5";


    return `

        <div
            class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >

            <!-- COULEUR -->

            <div
                class="h-2"
                style="background-color:${color}"
            ></div>


            <div class="p-6">

                <!-- TITRE -->

                <div class="flex justify-between gap-3">

                    <div>

                        <h3 class="text-xl font-bold">
                            ${escapeHtml(project.name)}
                        </h3>

                        <p class="text-sm text-slate-500 mt-2">
                            ${
                                escapeHtml(
                                    project.description ||
                                    "Aucune description"
                                )
                            }
                        </p>

                    </div>


                    <span
                        class="h-fit px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                        📦 Archivé
                    </span>

                </div>


                <!-- INFORMATIONS -->

                <div class="mt-6 space-y-3">

                    <div class="flex justify-between text-sm">

                        <span class="text-slate-500">
                            📅 Création
                        </span>

                        <span class="font-medium">
                            ${formatDate(project.createdAt)}
                        </span>

                    </div>


                    <div class="flex justify-between text-sm">

                        <span class="text-slate-500">
                            🚀 Début
                        </span>

                        <span class="font-medium">
                            ${formatDate(project.startDate)}
                        </span>

                    </div>


                    <div class="flex justify-between text-sm">

                        <span class="text-slate-500">
                            📅 Deadline
                        </span>

                        <span class="font-medium">
                            ${formatDate(project.deadline)}
                        </span>

                    </div>


                    <div class="flex justify-between items-center text-sm">

                        <span class="text-slate-500">
                            🎨 Couleur
                        </span>

                        <div class="flex items-center gap-2">

                            <span
                                class="w-5 h-5 rounded-full border"
                                style="background-color:${color}"
                            ></span>

                            <span class="font-medium">
                                ${color}
                            </span>

                        </div>

                    </div>

                </div>


                <!-- ACTIONS -->

                <div class="mt-6 pt-5 border-t border-slate-200">

                    <button
                        type="button"
                        onclick="deleteArchivedProject('${projectId}')"
                        class="w-full px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold"
                    >
                        🗑 Supprimer définitivement
                    </button>

                </div>

            </div>

        </div>

    `;

}


// ======================================================
// SUPPRIMER UNE ARCHIVE
// ======================================================

async function deleteArchivedProject(id) {

    const project =
        archivedProjects.find(
            project =>
                String(
                    project._id ||
                    project.id
                ) === String(id)
        );


    if (!project) {

        return;

    }


    const confirmation =
        confirm(
            `Voulez-vous supprimer définitivement "${project.name}" ?`
        );


    if (!confirmation) {

        return;

    }


    try {

        await deleteProjectAPI(id);


        alert(
            "Projet supprimé définitivement ✅"
        );


        await loadArchivedProjects();


    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Erreur lors de la suppression."
        );

    }

}


// ======================================================
// RECHERCHE
// ======================================================

if (archiveSearch) {

    archiveSearch.addEventListener(
        "input",
        renderArchivedProjects
    );

}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(date) {

    if (!date) {

        return "-";

    }


    const dateObject =
        new Date(date);


    if (
        Number.isNaN(
            dateObject.getTime()
        )
    ) {

        return "-";

    }


    return dateObject.toLocaleDateString(
        "fr-FR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


// ======================================================
// SÉCURITÉ HTML
// ======================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================================
// INITIALISATION
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadArchivedProjects();

    }
);