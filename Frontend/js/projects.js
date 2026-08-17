// ======================================================
// TASKFLOW PRO
// GESTION DES PROJETS
// ======================================================


// ======================================================
// PROJETS PAR DÉFAUT
// ======================================================

const defaultProjects = [

    {
        id: 1,
        name: "TaskFlow Pro",
        description: "Application de gestion de projets et de tâches.",
        status: "active",
        color: "#4F46E5",
        archive: false,
        createdAt: "2026-08-10",
        deadline: "2026-08-30"
    },

    {
        id: 2,
        name: "Site E-commerce",
        description: "Création d'une plateforme e-commerce.",
        status: "active",
        color: "#0EA5E9",
        archive: false,
        createdAt: "2026-08-08",
        deadline: "2026-09-05"
    },

    {
        id: 3,
        name: "Application Mobile",
        description: "Développement d'une application mobile.",
        status: "completed",
        color: "#22C55E",
        archive: false,
        createdAt: "2026-08-05",
        deadline: "2026-08-12"
    }

];


// ======================================================
// INITIALISATION
// ======================================================

function initializeProjects() {

    if (!localStorage.getItem("projects")) {

        localStorage.setItem(
            "projects",
            JSON.stringify(defaultProjects)
        );

    }

    if (!localStorage.getItem("tasks")) {

        localStorage.setItem(
            "tasks",
            JSON.stringify([])
        );

    }

}


// ======================================================
// RÉCUPÉRER LES PROJETS
// ======================================================

function getProjects() {

    return JSON.parse(
        localStorage.getItem("projects")
    ) || [];

}


// ======================================================
// RÉCUPÉRER LES TÂCHES
// ======================================================

function getTasks() {

    return JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

}


// ======================================================
// SAUVEGARDER
// ======================================================

function saveProjects(projects) {

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

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


// ======================================================
// OUVRIR MODALE
// ======================================================

openProjectModal.addEventListener(
    "click",
    function () {

        openCreateModal();

    }
);


// ======================================================
// FERMER MODALE
// ======================================================

closeProjectModal.addEventListener(
    "click",
    closeModal
);


cancelProject.addEventListener(
    "click",
    closeModal
);


// ======================================================
// FERMER EN CLIQUANT À L'EXTÉRIEUR
// ======================================================

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


// ======================================================
// FERMER AVEC ESC
// ======================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
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

    modal.classList.add(
        "hidden"
    );

    modal.classList.remove(
        "flex"
    );

    form.reset();

    document.getElementById(
        "projectId"
    ).value = "";

    document.getElementById(
        "modalTitle"
    ).textContent =
        "Nouveau projet";

    const color =
        document.getElementById(
            "projectColor"
        );

    if (color) {

        color.value =
            "#4F46E5";

        updateColorText();

    }

}


// ======================================================
// OUVRIR CRÉATION
// ======================================================

function openCreateModal() {

    form.reset();

    document.getElementById(
        "projectId"
    ).value = "";

    document.getElementById(
        "modalTitle"
    ).textContent =
        "Nouveau projet";

    const color =
        document.getElementById(
            "projectColor"
        );

    if (color) {

        color.value =
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

const projectColor =
    document.getElementById(
        "projectColor"
    );

const colorValue =
    document.getElementById(
        "colorValue"
    );


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

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // ------------------------------------------
        // RÉCUPÉRATION
        // ------------------------------------------

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


        const color =
            document.getElementById(
                "projectColor"
            ).value;


        const archive =
            document.getElementById(
                "projectArchive"
            ).checked;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (!name) {

            alert(
                "Veuillez saisir le nom du projet."
            );

            return;

        }


        // ------------------------------------------
        // PROJETS
        // ------------------------------------------

        const projects =
            getProjects();


        // ------------------------------------------
        // MODIFICATION
        // ------------------------------------------

        if (id) {

            const index =
                projects.findIndex(
                    project =>
                        String(project.id) ===
                        String(id)
                );


            if (index !== -1) {

                projects[index] = {

                    ...projects[index],

                    name:
                        name,

                    description:
                        description,

                    status:
                        status,

                    deadline:
                        deadline,

                    color:
                        color,

                    archive:
                        archive

                };

            }

        }


        // ------------------------------------------
        // CRÉATION
        // ------------------------------------------

        else {

            const newProject = {

                id:
                    Date.now(),

                name:
                    name,

                description:
                    description,

                status:
                    status,

                color:
                    color,

                archive:
                    archive,

                createdAt:
                    new Date()
                        .toISOString()
                        .split("T")[0],

                deadline:
                    deadline

            };


            projects.unshift(
                newProject
            );

        }


        // ------------------------------------------
        // SAUVEGARDE
        // ------------------------------------------

        saveProjects(
            projects
        );


        // ------------------------------------------
        // FERMER
        // ------------------------------------------

        closeModal();


        // ------------------------------------------
        // ACTUALISER
        // ------------------------------------------

        renderProjects();

    }
);


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

    let projects =
        getProjects();


    const search =
        document.getElementById(
            "projectSearch"
        ).value
        .trim()
        .toLowerCase();


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    // ------------------------------------------
    // RECHERCHE
    // ------------------------------------------

    if (search) {

        projects =
            projects.filter(
                project => {

                    return (

                        project.name
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


    // ------------------------------------------
    // FILTRE
    // ------------------------------------------

    if (
        status !== "all"
    ) {

        projects =
            projects.filter(
                project =>
                    project.status ===
                    status
            );

    }


    updateStatistics();


    // ------------------------------------------
    // AUCUN PROJET
    // ------------------------------------------

    if (
        projects.length === 0
    ) {

        container.innerHTML = "";

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    emptyState.classList.add(
        "hidden"
    );


    // ------------------------------------------
    // CARTES
    // ------------------------------------------

    container.innerHTML =
        projects
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

    const progress =
        getProjectProgress(
            project.id
        );


    const tasks =
        getTasks().filter(
            task =>
                String(task.project) ===
                String(project.id)
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
                            ${formatDate(project.createdAt)}
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
                            ${formatDate(project.deadline)}
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

                </div>



                <!-- ACTIONS -->

                <div
                    class="flex gap-2 mt-6 pt-5 border-t border-slate-200"
                >

                    <button
                        type="button"
                        onclick="editProject(${project.id})"
                        class="flex-1 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm font-semibold"
                    >
                        ✏ Modifier
                    </button>


                    <button
                        type="button"
                        onclick="deleteProject(${project.id})"
                        class="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold"
                    >
                        🗑 Supprimer
                    </button>

                </div>

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
        getProjects().find(
            project =>
                String(project.id) ===
                String(id)
        );


    if (!project) {

        return;

    }


    document.getElementById(
        "projectId"
    ).value =
        project.id;


    document.getElementById(
        "projectName"
    ).value =
        project.name;


    document.getElementById(
        "projectDescription"
    ).value =
        project.description || "";


    document.getElementById(
        "projectStatus"
    ).value =
        project.status;


    document.getElementById(
        "projectDeadline"
    ).value =
        project.deadline || "";


    document.getElementById(
        "projectColor"
    ).value =
        project.color || "#4F46E5";


    document.getElementById(
        "projectArchive"
    ).checked =
        Boolean(project.archive);


    updateColorText();


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

function deleteProject(
    id
) {

    const projects =
        getProjects();


    const project =
        projects.find(
            project =>
                String(project.id) ===
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


    const updatedProjects =
        projects.filter(
            project =>
                String(project.id) !==
                String(id)
        );


    saveProjects(
        updatedProjects
    );


    renderProjects();

}


// ======================================================
// STATISTIQUES
// ======================================================

function updateStatistics() {

    const projects =
        getProjects();


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


    document.getElementById(
        "totalProjects"
    ).textContent =
        total;


    document.getElementById(
        "activeProjects"
    ).textContent =
        active;


    document.getElementById(
        "completedProjects"
    ).textContent =
        completed;


    document.getElementById(
        "averageProgress"
    ).textContent =
        `${average}%`;

}


// ======================================================
// RECHERCHE
// ======================================================

document
    .getElementById(
        "projectSearch"
    )
    .addEventListener(
        "input",
        renderProjects
    );


// ======================================================
// FILTRE
// ======================================================

document
    .getElementById(
        "statusFilter"
    )
    .addEventListener(
        "change",
        renderProjects
    );


// ======================================================
// DATE
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

initializeProjects();

renderProjects();

updateColorText();