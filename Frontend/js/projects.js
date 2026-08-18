// ======================================================
// TASKFLOW PRO
// GESTION DES PROJETS
// ======================================================


// ======================================================
// ÉLÉMENTS HTML
// ======================================================

const modal = document.getElementById("projectModal");
const form = document.getElementById("projectForm");
const container = document.getElementById("projectsContainer");
const emptyState = document.getElementById("emptyState");

const openProjectModal =
    document.getElementById("openProjectModal");

const closeProjectModal =
    document.getElementById("closeProjectModal");

const cancelProject =
    document.getElementById("cancelProject");

const projectColor =
    document.getElementById("projectColor");

const colorValue =
    document.getElementById("colorValue");

const projectSearch =
    document.getElementById("projectSearch");

const statusFilter =
    document.getElementById("statusFilter");


// ======================================================
// PROJETS
// ======================================================

let projects = [];


// ======================================================
// TÂCHES
// ======================================================

function getTasks() {

    try {

        return JSON.parse(
            localStorage.getItem("tasks")
        ) || [];

    } catch (error) {

        console.error(
            "Erreur lecture tâches :",
            error
        );

        return [];

    }

}


// ======================================================
// VÉRIFIER SI UN PROJET EST ARCHIVÉ
// ======================================================

function isProjectArchived(project) {

    return project.archived === true;

}


// ======================================================
// CHARGER LES PROJETS
// ======================================================

async function loadProjects() {

    try {

        const result =
            await getProjectsFromAPI();

        projects =
            Array.isArray(result)
                ? result
                : [];

        renderProjects();

        updateStatistics();

    } catch (error) {

        console.error(
            "Erreur chargement projets :",
            error
        );

        projects = [];

        renderProjects();

        alert(
            "Impossible de charger les projets."
        );

    }

}


// ======================================================
// OUVRIR LA MODALE
// ======================================================

if (openProjectModal) {

    openProjectModal.addEventListener(
        "click",
        openCreateModal
    );

}


// ======================================================
// FERMER LA MODALE
// ======================================================

if (closeProjectModal) {

    closeProjectModal.addEventListener(
        "click",
        closeModal
    );

}


if (cancelProject) {

    cancelProject.addEventListener(
        "click",
        closeModal
    );

}


// ======================================================
// CLIQUER À L'EXTÉRIEUR
// ======================================================

if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                closeModal();

            }

        }
    );

}


// ======================================================
// ESC
// ======================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            modal &&
            !modal.classList.contains("hidden")
        ) {

            closeModal();

        }

    }
);


// ======================================================
// FERMER MODALE
// ======================================================

function closeModal() {

    if (!modal || !form) {

        return;

    }

    modal.classList.add("hidden");
    modal.classList.remove("flex");

    form.reset();

    const projectId =
        document.getElementById("projectId");

    if (projectId) {

        projectId.value = "";

    }

    const modalTitle =
        document.getElementById("modalTitle");

    if (modalTitle) {

        modalTitle.textContent =
            "Nouveau projet";

    }

    if (projectColor) {

        projectColor.value =
            "#4F46E5";

        updateColorText();

    }

}


// ======================================================
// OUVRIR CRÉATION
// ======================================================

function openCreateModal() {

    if (!modal || !form) {

        return;

    }

    form.reset();

    const projectId =
        document.getElementById("projectId");

    if (projectId) {

        projectId.value = "";

    }

    const modalTitle =
        document.getElementById("modalTitle");

    if (modalTitle) {

        modalTitle.textContent =
            "Nouveau projet";

    }

    if (projectColor) {

        projectColor.value =
            "#4F46E5";

        updateColorText();

    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");

}


// ======================================================
// COULEUR
// ======================================================

if (projectColor) {

    projectColor.addEventListener(
        "input",
        updateColorText
    );

}


function updateColorText() {

    if (
        projectColor &&
        colorValue
    ) {

        colorValue.textContent =
            projectColor.value.toUpperCase();

    }

}


// ======================================================
// CRÉATION / MODIFICATION
// ======================================================

if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const id =
                document.getElementById(
                    "projectId"
                ).value;

            const name =
                document.getElementById(
                    "projectName"
                ).value.trim();

            const description =
                document.getElementById(
                    "projectDescription"
                ).value.trim();

            const status =
                document.getElementById(
                    "projectStatus"
                ).value;

            const deadline =
                document.getElementById(
                    "projectDeadline"
                ).value;

            const startDate =
                document.getElementById(
                    "projectStartDate"
                ).value;

            const color =
                document.getElementById(
                    "projectColor"
                ).value;

            const archiveCheckbox =
                document.getElementById(
                    "projectArchive"
                );

            const archived =
                archiveCheckbox
                    ? archiveCheckbox.checked
                    : false;


            // ==========================================
            // VALIDATION
            // ==========================================

            if (!name) {

                alert(
                    "Veuillez saisir le nom du projet."
                );

                return;

            }


            // ==========================================
            // DONNÉES
            // ==========================================

            const projectData = {

                name: name,

                description: description,

                status: status,

                color: color,

                startDate: startDate,

                deadline: deadline,

                archived: archived

            };


            try {

                // ======================================
                // MODIFICATION
                // ======================================

                if (id) {

                    await updateProjectAPI(
                        id,
                        projectData
                    );

                    alert(
                        "Projet modifié avec succès ✅"
                    );

                }

                // ======================================
                // CRÉATION
                // ======================================

                else {

                    await createProjectAPI(
                        projectData
                    );

                    alert(
                        "Projet créé avec succès ✅"
                    );

                }


                closeModal();

                await loadProjects();


            } catch (error) {

                console.error(
                    "Erreur projet :",
                    error
                );

                alert(
                    error.message ||
                    "Une erreur est survenue."
                );

            }

        }
    );

}


// ======================================================
// PROGRESSION
// ======================================================

function getProjectProgress(projectId) {

    const tasks =
        getTasks().filter(
            task =>
                String(task.project) ===
                String(projectId)
        );


    if (tasks.length === 0) {

        return 0;

    }


    const completed =
        tasks.filter(
            task =>
                task.status === "completed"
        ).length;


    return Math.round(
        (
            completed /
            tasks.length
        ) * 100
    );

}


// ======================================================
// AFFICHER LES PROJETS
// ======================================================

function renderProjects() {

    if (!container) {

        return;

    }


    let filteredProjects =
        [...projects];


    // ==================================================
    // IMPORTANT :
    // LES PROJETS ARCHIVÉS NE SONT PAS AFFICHÉS
    // ==================================================

    filteredProjects =
        filteredProjects.filter(
            project =>
                !isProjectArchived(project)
        );


    // ==================================================
    // RECHERCHE
    // ==================================================

    const search =
        projectSearch
            ? projectSearch.value
                .trim()
                .toLowerCase()
            : "";


    if (search) {

        filteredProjects =
            filteredProjects.filter(
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
    // FILTRE STATUT
    // ==================================================

    const filter =
        statusFilter
            ? statusFilter.value
            : "all";


    if (filter === "active") {

        filteredProjects =
            filteredProjects.filter(
                project =>
                    project.status === "active" ||
                    project.status === "Actif"
            );

    }


    if (filter === "completed") {

        filteredProjects =
            filteredProjects.filter(
                project =>
                    project.status === "completed" ||
                    project.status === "Terminé"
            );

    }


    // ==================================================
    // AUCUN PROJET
    // ==================================================

    if (filteredProjects.length === 0) {

        container.innerHTML = "";

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );

            emptyState.querySelector("h3").textContent =
                "Aucun projet trouvé";

            emptyState.querySelector("p").textContent =
                "Les projets archivés ne sont plus affichés ici.";

        }

        return;

    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }


    // ==================================================
    // AFFICHER LES CARTES
    // ==================================================

    container.innerHTML =
        filteredProjects
            .map(
                project =>
                    createProjectCard(project)
            )
            .join("");

}


// ======================================================
// CARTE PROJET
// ======================================================

function createProjectCard(project) {

    const projectId =
        project._id ||
        project.id;


    // Sécurité :
    // un projet archivé ne doit jamais être affiché

    if (isProjectArchived(project)) {

        return "";

    }


    const progress =
        getProjectProgress(
            projectId
        );


    const tasks =
        getTasks().filter(
            task =>
                String(task.project) ===
                String(projectId)
        );


    const completedTasks =
        tasks.filter(
            task =>
                task.status === "completed"
        ).length;


    const color =
        project.color ||
        "#4F46E5";


    const isCompleted =
        project.status === "completed" ||
        project.status === "Terminé";


    const isLate =
        project.deadline &&
        new Date(project.deadline) < new Date() &&
        !isCompleted;


    // ==================================================
    // STATUT
    // ==================================================

    let statusLabel;
    let statusClass;


    if (isCompleted) {

        statusLabel =
            "✓ Terminé";

        statusClass =
            "bg-green-100 text-green-700";

    } else {

        statusLabel =
            "● Actif";

        statusClass =
            "bg-blue-100 text-blue-700";

    }


    return `

        <div
            class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden"
        >

            <!-- COULEUR -->

            <div
                class="h-2"
                style="background-color:${color}"
            ></div>


            <div class="p-6">


                <!-- TITRE -->

                <div class="flex justify-between gap-4">

                    <div class="min-w-0">

                        <div class="flex items-center gap-2">

                            <span
                                class="w-3 h-3 rounded-full flex-shrink-0"
                                style="background-color:${color}"
                            ></span>

                            <h3
                                class="font-bold text-xl truncate"
                            >
                                ${escapeHtml(project.name)}
                            </h3>

                        </div>


                        <p
                            class="text-sm text-slate-500 mt-2 line-clamp-2"
                        >
                            ${
                                escapeHtml(
                                    project.description ||
                                    "Aucune description"
                                )
                            }
                        </p>

                    </div>


                    <!-- STATUT -->

                    <span
                        class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap h-fit ${statusClass}"
                    >
                        ${statusLabel}
                    </span>

                </div>


                <!-- PROGRESSION -->

                <div class="mt-6">

                    <div class="flex justify-between mb-2">

                        <span class="text-sm text-slate-500">
                            Progression
                        </span>

                        <span class="text-sm font-bold">
                            ${progress}%
                        </span>

                    </div>


                    <div
                        class="w-full h-3 bg-slate-100 rounded-full overflow-hidden"
                    >

                        <div
                            class="h-full rounded-full"
                            style="
                                width:${progress}%;
                                background-color:${color};
                            "
                        ></div>

                    </div>


                    <p class="text-xs text-slate-400 mt-2">

                        ${completedTasks}
                        tâche(s) terminée(s) sur
                        ${tasks.length}

                    </p>

                </div>


                <!-- INFORMATIONS -->

                <div class="mt-6 space-y-3">


                    <!-- CRÉATION -->

                    <div class="flex justify-between text-sm">

                        <span class="text-slate-500">
                            📅 Création
                        </span>

                        <span class="font-medium">
                            ${formatDate(project.createdAt)}
                        </span>

                    </div>


                    <!-- DÉBUT -->

                    <div class="flex justify-between text-sm">

                        <span class="text-slate-500">
                            🚀 Début
                        </span>

                        <span class="font-medium">
                            ${formatDate(project.startDate)}
                        </span>

                    </div>


                    <!-- DEADLINE -->

                    <div class="flex justify-between text-sm">

                        <span class="text-slate-500">

                            ${
                                isLate
                                    ? "⚠️ Deadline"
                                    : "📅 Deadline"
                            }

                        </span>

                        <span
                            class="${
                                isLate
                                    ? "text-red-600 font-bold"
                                    : "font-medium"
                            }"
                        >
                            ${formatDate(project.deadline)}
                        </span>

                    </div>

                </div>


                <!-- ACTIONS -->

                <div
                    class="flex gap-2 mt-6 pt-5 border-t border-slate-200"
                >

                    <button
                        type="button"
                        onclick="editProject('${projectId}')"
                        class="flex-1 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm font-semibold"
                    >
                        ✏ Modifier
                    </button>


                    <button
                        type="button"
                        onclick="deleteProject('${projectId}')"
                        class="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold"
                    >
                        🗑 Supprimer
                    </button>

                </div>


                <!-- ARCHIVER -->

                <button
                    type="button"
                    onclick="archiveProject('${projectId}')"
                    class="w-full mt-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold"
                >
                    📦 Archiver
                </button>


            </div>

        </div>

    `;

}


// ======================================================
// MODIFIER UN PROJET
// ======================================================

function editProject(id) {

    const project =
        projects.find(
            project =>
                String(
                    project._id ||
                    project.id
                ) === String(id)
        );


    if (!project) {

        alert(
            "Projet introuvable."
        );

        return;

    }


    document.getElementById(
        "projectId"
    ).value =
        project._id ||
        project.id;


    document.getElementById(
        "projectName"
    ).value =
        project.name || "";


    document.getElementById(
        "projectDescription"
    ).value =
        project.description || "";


    document.getElementById(
        "projectStatus"
    ).value =
        project.status || "active";


    const startDate =
        document.getElementById(
            "projectStartDate"
        );

    if (startDate) {

        startDate.value =
            project.startDate
                ? String(
                    project.startDate
                ).substring(0, 10)
                : "";

    }


    const deadline =
        document.getElementById(
            "projectDeadline"
        );

    if (deadline) {

        deadline.value =
            project.deadline
                ? String(
                    project.deadline
                ).substring(0, 10)
                : "";

    }


    if (projectColor) {

        projectColor.value =
            project.color ||
            "#4F46E5";

        updateColorText();

    }


    const archiveCheckbox =
        document.getElementById(
            "projectArchive"
        );

    if (archiveCheckbox) {

        archiveCheckbox.checked =
            isProjectArchived(project);

    }


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Modifier le projet";


    modal.classList.remove(
        "hidden"
    );

    modal.classList.add(
        "flex"
    );

}


// ======================================================
// SUPPRIMER
// ======================================================

async function deleteProject(id) {

    const project =
        projects.find(
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
            `Voulez-vous supprimer le projet "${project.name}" ?`
        );


    if (!confirmation) {

        return;

    }


    try {

        await deleteProjectAPI(id);

        alert(
            "Projet supprimé avec succès ✅"
        );

        await loadProjects();

    } catch (error) {

        console.error(
            "Erreur suppression :",
            error
        );

        alert(
            error.message ||
            "Erreur lors de la suppression."
        );

    }

}


// ======================================================
// ARCHIVER UN PROJET
// ======================================================

async function archiveProject(id) {

    const project =
        projects.find(
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
            `Voulez-vous archiver "${project.name}" ?`
        );


    if (!confirmation) {

        return;

    }


    try {

        // Appel backend
        const result =
            await archiveProjectAPI(id);


        console.log(
            "Projet archivé :",
            result
        );


        // ==================================================
        // IMPORTANT
        // On modifie immédiatement le tableau local
        // ==================================================

        projects =
            projects.filter(
                project =>
                    String(
                        project._id ||
                        project.id
                    ) !== String(id)
            );


        // ==================================================
        // On réaffiche la liste
        // Le projet archivé disparaît immédiatement
        // ==================================================

        renderProjects();

        updateStatistics();


        alert(
            "Projet archivé avec succès 📦"
        );


    } catch (error) {

        console.error(
            "Erreur archivage :",
            error
        );

        alert(
            error.message ||
            "Erreur lors de l'archivage."
        );

    }

}


// ======================================================
// STATISTIQUES
// ======================================================

function updateStatistics() {

    const total =
        projects.filter(
            project =>
                !isProjectArchived(project)
        ).length;


    const active =
        projects.filter(
            project =>
                !isProjectArchived(project) &&
                (
                    project.status === "active" ||
                    project.status === "Actif"
                )
        ).length;


    const completed =
        projects.filter(
            project =>
                !isProjectArchived(project) &&
                (
                    project.status === "completed" ||
                    project.status === "Terminé"
                )
        ).length;


    const totalElement =
        document.getElementById(
            "totalProjects"
        );


    const activeElement =
        document.getElementById(
            "activeProjects"
        );


    const completedElement =
        document.getElementById(
            "completedProjects"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (activeElement) {

        activeElement.textContent =
            active;

    }


    if (completedElement) {

        completedElement.textContent =
            completed;

    }

}


// ======================================================
// RECHERCHE
// ======================================================

if (projectSearch) {

    projectSearch.addEventListener(
        "input",
        renderProjects
    );

}


// ======================================================
// FILTRE
// ======================================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        renderProjects
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

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ======================================================
// DÉCONNEXION
// ======================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            const confirmation =
                confirm(
                    "Voulez-vous vraiment vous déconnecter ?"
                );


            if (confirmation) {

                localStorage.removeItem(
                    "isLoggedIn"
                );

                window.location.href =
                    "login.html";

            }

        }
    );

}


// ======================================================
// INITIALISATION
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateColorText();

        loadProjects();

    }
);