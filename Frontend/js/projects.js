// ======================================================
// TASKFLOW PRO
// GESTION DES PROJETS - FRONTEND
// ======================================================


// ======================================================
// TÂCHES
// ======================================================

function getTasks() {

    return JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

}


// ======================================================
// ÉLÉMENTS HTML
// ======================================================

const modal =
    document.getElementById("projectModal");

const form =
    document.getElementById("projectForm");

const container =
    document.getElementById("projectsContainer");

const emptyState =
    document.getElementById("emptyState");

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


// ======================================================
// PROJETS
// ======================================================

// Les projets viennent maintenant de MongoDB

let projects = [];


// ======================================================
// CHARGER LES PROJETS DEPUIS LE BACKEND
// ======================================================

async function loadProjects() {

    try {

        projects =
            await getProjectsFromAPI();

        renderProjects();

        updateStatistics();

    } catch (error) {

        console.error(
            "Erreur chargement projets :",
            error
        );

        projects = [];

        renderProjects();

    }

}


// ======================================================
// OUVRIR MODALE
// ======================================================

if (openProjectModal) {

    openProjectModal.addEventListener(
        "click",
        function () {

            openCreateModal();

        }
    );

}


// ======================================================
// FERMER MODALE
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

            if (
                event.target === modal
            ) {

                closeModal();

            }

        }
    );

}


// ======================================================
// FERMER AVEC ESC
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

    modal.classList.add(
        "hidden"
    );

    modal.classList.remove(
        "flex"
    );

    form.reset();

    const projectId =
        document.getElementById(
            "projectId"
        );

    if (projectId) {

        projectId.value = "";

    }

    const modalTitle =
        document.getElementById(
            "modalTitle"
        );

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
        document.getElementById(
            "projectId"
        );

    if (projectId) {

        projectId.value = "";

    }

    const modalTitle =
        document.getElementById(
            "modalTitle"
        );

    if (modalTitle) {

        modalTitle.textContent =
            "Nouveau projet";

    }

    if (projectColor) {

        projectColor.value =
            "#4F46E5";

        updateColorText();

    }

    modal.classList.remove(
        "hidden"
    );

    modal.classList.add(
        "flex"
    );

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


            // ==========================================
            // RÉCUPÉRATION
            // ==========================================

            const id =
                document.getElementById(
                    "projectId"
                ).value;

        const name =
    document.getElementById("projectName").value.trim();

const description =
    document.getElementById("projectDescription").value.trim();

const color =
    document.getElementById("projectColor").value;

const status =
    document.getElementById("projectStatus").value;

const startDate =
    document.getElementById("projectStartDate").value;

const deadline =
    document.getElementById("projectDeadline").value;

const archived =
    document.getElementById(
        "projectArchive"
    ).checked;
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
            // DONNÉES À ENVOYER AU BACKEND
            // ==========================================
const projectData = {

    name: name,

    description: description,

    color: color,

    status: status,

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


                // ======================================
                // FERMER
                // ======================================

                closeModal();


                // ======================================
                // RECHARGER DEPUIS MONGODB
                // ======================================

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

function getProjectProgress(
    projectId
) {

    const tasks =
        getTasks().filter(
            task =>
                String(task.project) ===
                String(projectId)
        );


    if (
        tasks.length === 0
    ) {

        return 0;

    }


    const completed =
        tasks.filter(
            task =>
                task.status ===
                "completed"
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


    // ==========================================
    // RECHERCHE
    // ==========================================

    const searchInput =
        document.getElementById(
            "projectSearch"
        );

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    if (search) {

        filteredProjects =
            filteredProjects.filter(
                project => {

                    return (

                        (
                            project.name ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        (
                            project.description ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                    );

                }
            );

    }


    // ==========================================
    // FILTRE STATUT
    // ==========================================

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );

    const status =
        statusFilter
            ? statusFilter.value
            : "all";


    if (
        status !== "all"
    ) {

        filteredProjects =
            filteredProjects.filter(
                project =>
                    project.status ===
                    status
            );

    }


    // ==========================================
    // STATISTIQUES
    // ==========================================

    updateStatistics();


    // ==========================================
    // AUCUN PROJET
    // ==========================================

    if (
        filteredProjects.length === 0
    ) {

        container.innerHTML = "";

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );

        }

        return;

    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }


    // ==========================================
    // CARTES
    // ==========================================

    container.innerHTML =
        filteredProjects
            .map(
                project =>
                    createProjectCard(
                        project
                    )
            )
            .join("");

}


// ======================================================
// CARTE PROJET
// ======================================================

function createProjectCard(
    project
) {

    const projectId =
        project._id ||
        project.id;


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
                task.status ===
                "completed"
        ).length;


    const color =
        project.color ||
        "#4F46E5";


    const isLate =
        project.deadline &&
        new Date(project.deadline) <
        new Date() &&
        project.status !== "completed";


    const statusLabel =
        project.status === "completed"
            ? "Terminé"
            : "Actif";


    const statusClass =
        project.status === "completed"
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700";


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

                <div
                    class="flex justify-between gap-4"
                >

                    <div class="min-w-0">

                        <div
                            class="flex items-center gap-2"
                        >

                            <span
                                class="w-3 h-3 rounded-full flex-shrink-0"
                                style="background-color:${color}"
                            ></span>

                            <h3
                                class="font-bold text-xl truncate"
                            >
                                ${escapeHtml(
                                    project.name
                                )}
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


                    <div
                        class="flex flex-col items-end gap-2"
                    >

                        <span
                            class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusClass}"
                        >
                            ${statusLabel}
                        </span>


                        ${
                            project.archive
                                ? `
                                    <span
                                        class="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-semibold whitespace-nowrap"
                                    >
                                        📦 Archivé
                                    </span>
                                `
                                : ""
                        }

                    </div>

                </div>


                <!-- PROGRESSION -->

                <div class="mt-6">

                    <div
                        class="flex justify-between mb-2"
                    >

                        <span
                            class="text-sm text-slate-500"
                        >
                            Progression
                        </span>

                        <span
                            class="text-sm font-bold"
                        >
                            ${progress}%
                        </span>

                    </div>


                    <div
                        class="w-full h-3 bg-slate-100 rounded-full overflow-hidden"
                    >

                        <div
                            class="h-full rounded-full transition-all"
                            style="
                                width:${progress}%;
                                background-color:${color};
                            "
                        ></div>

                    </div>


                    <p
                        class="text-xs text-slate-400 mt-2"
                    >
                        ${completedTasks}
                        tâche(s) terminée(s) sur
                        ${tasks.length}
                    </p>

                </div>


                <!-- INFORMATIONS -->

                <div class="mt-6 space-y-3">


                    <!-- CRÉATION -->

                    <div
                        class="flex justify-between text-sm"
                    >

                        <span class="text-slate-500">
                            📅 Création
                        </span>

                        <span class="font-medium">
                            ${formatDate(
                                project.createdAt
                            )}
                        </span>

                    </div>


                    <!-- DEADLINE -->

                    <div
                        class="flex justify-between text-sm"
                    >

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
                            ${formatDate(
                                project.deadline
                            )}
                        </span>

                    </div>


                    <!-- COULEUR -->

                    <div
                        class="flex justify-between items-center text-sm"
                    >

                        <span class="text-slate-500">
                            🎨 Couleur
                        </span>

                        <div
                            class="flex items-center gap-2"
                        >

                            <span
                                class="w-5 h-5 rounded-full border border-slate-200"
                                style="background-color:${color}"
                            ></span>

                            <span
                                class="font-medium uppercase"
                            >
                                ${color}
                            </span>

                        </div>

                    </div>


                    <!-- ARCHIVE -->

                    <div
                        class="flex justify-between text-sm"
                    >

                        <span class="text-slate-500">
                            📦 Archive
                        </span>

                        <span class="font-medium">
                            ${
                                project.archive
                                    ? "Oui"
                                    : "Non"
                            }
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


                ${
                    !project.archive
                        ? `
                            <button
                                type="button"
                                onclick="archiveProject('${projectId}')"
                                class="w-full mt-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold"
                            >
                                📦 Archiver
                            </button>
                        `
                        : ""
                }

            </div>

        </div>

    `;

}


// ======================================================
// MODIFIER UN PROJET
// ======================================================

function editProject(
    id
) {

    const project =
        projects.find(
            project =>
                String(
                    project._id ||
                    project.id
                ) ===
                String(id)
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


    const archiveElement =
        document.getElementById(
            "projectArchive"
        );

    if (archiveElement) {

        archiveElement.checked =
            Boolean(
                project.archive
            );

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
// SUPPRIMER UN PROJET
// ======================================================

async function deleteProject(
    id
) {

    const project =
        projects.find(
            project =>
                String(
                    project._id ||
                    project.id
                ) ===
                String(id)
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

        await deleteProjectAPI(
            id
        );


        alert(
            "Projet supprimé avec succès ✅"
        );


        await loadProjects();

    } catch (error) {

        console.error(
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

async function archiveProject(
    id
) {

    const project =
        projects.find(
            project =>
                String(
                    project._id ||
                    project.id
                ) ===
                String(id)
        );


    if (!project) {

        return;

    }


    const confirmation =
        confirm(
            `Voulez-vous archiver le projet "${project.name}" ?`
        );


    if (!confirmation) {

        return;

    }


    try {

        await archiveProjectAPI(
            id
        );


        alert(
            "Projet archivé avec succès 📦"
        );


        await loadProjects();

    } catch (error) {

        console.error(
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
        projects.length;


    const active =
        projects.filter(
            project =>
                project.status ===
                "active"
        ).length;


    const completed =
        projects.filter(
            project =>
                project.status ===
                "completed"
        ).length;


    let average =
        0;


    if (
        total > 0
    ) {

        const totalProgress =
            projects.reduce(
                function (
                    sum,
                    project
                ) {

                    return (
                        sum +
                        getProjectProgress(
                            project._id ||
                            project.id
                        )
                    );

                },
                0
            );


        average =
            Math.round(
                totalProgress /
                total
            );

    }


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

    const averageElement =
        document.getElementById(
            "averageProgress"
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


    if (averageElement) {

        averageElement.textContent =
            `${average}%`;

    }

}


// ======================================================
// RECHERCHE
// ======================================================

const projectSearch =
    document.getElementById(
        "projectSearch"
    );


if (projectSearch) {

    projectSearch.addEventListener(
        "input",
        renderProjects
    );

}


// ======================================================
// FILTRE
// ======================================================

const statusFilter =
    document.getElementById(
        "statusFilter"
    );


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        renderProjects
    );

}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(
    date
) {

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
// SÉCURISER LE HTML
// ======================================================

function escapeHtml(
    value
) {

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

loadProjects();

updateColorText();