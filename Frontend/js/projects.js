// ======================================================
// TASKFLOW PRO
// GESTION DES PROJETS
// ======================================================


// ================= DONNÉES PAR DÉFAUT =================

const defaultProjects = [
    {
        id: 1,
        name: "TaskFlow Pro",
        description: "Application de gestion de projets et de tâches.",
        status: "active",
        createdAt: "2026-08-10",
        deadline: "2026-08-30"
    },

    {
        id: 2,
        name: "Site E-commerce",
        description: "Création d'une plateforme e-commerce.",
        status: "active",
        createdAt: "2026-08-08",
        deadline: "2026-09-05"
    },

    {
        id: 3,
        name: "Application Mobile",
        description: "Développement d'une application mobile.",
        status: "completed",
        createdAt: "2026-08-05",
        deadline: "2026-08-12"
    }
];


// ================= INITIALISATION =================

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


// ================= RÉCUPÉRATION =================

function getProjects() {

    return JSON.parse(
        localStorage.getItem("projects")
    ) || [];

}


function getTasks() {

    return JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

}


// ================= SAUVEGARDE =================

function saveProjects(projects) {

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

}


// ================= ÉLÉMENTS =================

const modal =
    document.getElementById("projectModal");

const form =
    document.getElementById("projectForm");

const container =
    document.getElementById("projectsContainer");

const emptyState =
    document.getElementById("emptyState");


// ================= OUVRIR =================

document
    .getElementById("openProjectModal")
    .addEventListener(
        "click",
        openCreateModal
    );


// ================= FERMER =================

document
    .getElementById("closeProjectModal")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancelProject")
    .addEventListener(
        "click",
        closeModal
    );


function closeModal() {

    modal.classList.add("hidden");

    form.reset();

    document.getElementById("projectId").value = "";

    document.getElementById("modalTitle").textContent =
        "Nouveau projet";

}


// ================= CRÉATION =================

function openCreateModal() {

    form.reset();

    document.getElementById("projectId").value = "";

    document.getElementById("modalTitle").textContent =
        "Nouveau projet";

    modal.classList.remove("hidden");

}


// ================= SUBMIT =================

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            document.getElementById("projectId").value;


        const name =
            document
                .getElementById("projectName")
                .value
                .trim();


        const description =
            document
                .getElementById("projectDescription")
                .value
                .trim();


        const status =
            document
                .getElementById("projectStatus")
                .value;


        const deadline =
            document
                .getElementById("projectDeadline")
                .value;


        const projects =
            getProjects();


        // ================= MODIFICATION =================

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

                    name,
                    description,
                    status,
                    deadline

                };

            }

        }


        // ================= CRÉATION =================

        else {

            const newProject = {

                id: Date.now(),

                name,

                description,

                status,

                createdAt:
                    new Date()
                        .toISOString()
                        .split("T")[0],

                deadline

            };


            projects.unshift(newProject);

        }


        saveProjects(projects);

        closeModal();

        renderProjects();

    }
);


// ================= PROGRESSION =================

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
        (completed / tasks.length) * 100
    );

}


// ================= AFFICHAGE =================

function renderProjects() {

    let projects =
        getProjects();


    const search =
        document
            .getElementById("projectSearch")
            .value
            .trim()
            .toLowerCase();


    const status =
        document
            .getElementById("statusFilter")
            .value;


    // Recherche

    if (search) {

        projects =
            projects.filter(project => {

                return (

                    project.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    project.description
                        .toLowerCase()
                        .includes(search)

                );

            });

    }


    // Statut

    if (status !== "all") {

        projects =
            projects.filter(
                project =>
                    project.status === status
            );

    }


    updateStatistics();


    if (projects.length === 0) {

        container.innerHTML = "";

        emptyState.classList.remove("hidden");

        return;

    }


    emptyState.classList.add("hidden");


    container.innerHTML =
        projects
            .map(project =>
                createProjectCard(project)
            )
            .join("");

}


// ================= CARTE =================

function createProjectCard(project) {

    const progress =
        getProjectProgress(project.id);


    const projectTasks =
        getTasks().filter(
            task =>
                String(task.project) ===
                String(project.id)
        );


    const completedTasks =
        projectTasks.filter(
            task =>
                task.status === "completed"
        ).length;


    const isLate =
        new Date(project.deadline) <
            new Date() &&
        project.status !== "completed";


    const statusClass =
        project.status === "completed"

            ? "bg-green-100 text-green-700"

            : "bg-blue-100 text-blue-700";


    const statusLabel =
        project.status === "completed"

            ? "Terminé"

            : "Actif";


    return `

        <div
            class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition"
        >

            <!-- HEADER -->

            <div class="flex justify-between gap-4">

                <div>

                    <h3 class="text-xl font-bold text-slate-900">
                        ${escapeHtml(project.name)}
                    </h3>

                    <p class="text-sm text-slate-500 mt-2">
                        ${escapeHtml(
                            project.description ||
                            "Aucune description"
                        )}
                    </p>

                </div>


                <span
                    class="h-fit px-3 py-1 rounded-full text-xs font-semibold ${statusClass}"
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


                <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                    <div
                        class="h-full bg-indigo-600 rounded-full transition-all"
                        style="width:${progress}%"
                    ></div>

                </div>


                <p class="text-xs text-slate-400 mt-2">
                    ${completedTasks} tâche(s) terminée(s) sur ${projectTasks.length}
                </p>

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

            <div class="flex gap-2 mt-6 pt-5 border-t">

                <button
                    onclick="editProject(${project.id})"
                    class="flex-1 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm font-medium"
                >
                    ✏ Modifier
                </button>


                <button
                    onclick="deleteProject(${project.id})"
                    class="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
                >
                    🗑 Supprimer
                </button>

            </div>

        </div>

    `;

}


// ================= MODIFIER =================

function editProject(id) {

    const project =
        getProjects().find(
            project =>
                String(project.id) ===
                String(id)
        );


    if (!project) return;


    document.getElementById("projectId").value =
        project.id;


    document.getElementById("projectName").value =
        project.name;


    document.getElementById("projectDescription").value =
        project.description || "";


    document.getElementById("projectStatus").value =
        project.status;


    document.getElementById("projectDeadline").value =
        project.deadline;


    document.getElementById("modalTitle").textContent =
        "Modifier le projet";


    modal.classList.remove("hidden");

}


// ================= SUPPRIMER =================

function deleteProject(id) {

    const projects =
        getProjects();


    const project =
        projects.find(
            project =>
                String(project.id) ===
                String(id)
        );


    if (!project) return;


    const associatedTasks =
        getTasks().filter(
            task =>
                String(task.project) ===
                String(id)
        );


    let message =
        `Voulez-vous supprimer le projet "${project.name}" ?`;


    if (associatedTasks.length > 0) {

        message +=
            `\n\nAttention : ${associatedTasks.length} tâche(s) sont associées à ce projet.`;

    }


    if (!confirm(message)) {

        return;

    }


    const updatedProjects =
        projects.filter(
            project =>
                String(project.id) !==
                String(id)
        );


    saveProjects(updatedProjects);


    renderProjects();

}


// ================= STATISTIQUES =================

function updateStatistics() {

    const projects =
        getProjects();


    const total =
        projects.length;


    const active =
        projects.filter(
            project =>
                project.status === "active"
        ).length;


    const completed =
        projects.filter(
            project =>
                project.status === "completed"
        ).length;


    let average = 0;


    if (total > 0) {

        const totalProgress =
            projects.reduce(
                (sum, project) =>
                    sum +
                    getProjectProgress(project.id),
                0
            );


        average =
            Math.round(
                totalProgress / total
            );

    }


    document.getElementById(
        "totalProjects"
    ).textContent = total;


    document.getElementById(
        "activeProjects"
    ).textContent = active;


    document.getElementById(
        "completedProjects"
    ).textContent = completed;


    document.getElementById(
        "averageProgress"
    ).textContent = `${average}%`;

}


// ================= DATE =================

function formatDate(date) {

    if (!date) {

        return "-";

    }


    return new Date(date).toLocaleDateString(
        "fr-FR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


// ================= SÉCURITÉ =================

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


// ================= RECHERCHE =================

document
    .getElementById("projectSearch")
    .addEventListener(
        "input",
        renderProjects
    );


document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function() {

            document.getElementById(
                "projectSearch"
            ).value = this.value;

            renderProjects();

        }
    );


// ================= FILTRE =================

document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        renderProjects
    );


// ================= ESC =================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !modal.classList.contains("hidden")
        ) {

            closeModal();

        }

    }
);


// ================= INITIALISATION =================

function init() {

    initializeProjects();

    renderProjects();

}


init();