// ======================================================
// TASKFLOW PRO
// GESTION DES TÂCHES
// ======================================================


// ================= DONNÉES PAR DÉFAUT =================

const defaultTasks = [
    {
        id: 1,
        title: "Créer la page d'accueil",
        description: "Développer la homepage de TaskFlow Pro",
        status: "completed",
        priority: "high",
        project: 1,
        assignedTo: 1,
        tags: ["frontend", "ui"],
        deadline: "2026-08-15",
        createdAt: "2026-08-10"
    },

    {
        id: 2,
        title: "Créer le Dashboard",
        description: "Créer les statistiques du dashboard",
        status: "in-progress",
        priority: "urgent",
        project: 1,
        assignedTo: 1,
        tags: ["dashboard"],
        deadline: "2026-08-14",
        createdAt: "2026-08-11"
    },

    {
        id: 3,
        title: "Corriger le formulaire",
        description: "Corriger les erreurs du formulaire",
        status: "todo",
        priority: "urgent",
        project: 2,
        assignedTo: 2,
        tags: ["bug"],
        deadline: "2026-08-13",
        createdAt: "2026-08-12"
    }
];


const defaultProjects = [
    {
        id: 1,
        name: "TaskFlow Pro"
    },

    {
        id: 2,
        name: "Site E-commerce"
    },

    {
        id: 3,
        name: "Application Mobile"
    }
];


const defaultMembers = [
    {
        id: 1,
        firstName: "Fatou",
        lastName: "Diop",
        role: "Développeuse"
    },

    {
        id: 2,
        firstName: "Aminata",
        lastName: "Ndiaye",
        role: "Designer"
    },

    {
        id: 3,
        firstName: "Moussa",
        lastName: "Fall",
        role: "Chef de projet"
    }
];


// ================= INITIALISATION =================

function initializeData() {

    if (!localStorage.getItem("tasks")) {

        localStorage.setItem(
            "tasks",
            JSON.stringify(defaultTasks)
        );

    }

    if (!localStorage.getItem("projects")) {

        localStorage.setItem(
            "projects",
            JSON.stringify(defaultProjects)
        );

    }

    if (!localStorage.getItem("members")) {

        localStorage.setItem(
            "members",
            JSON.stringify(defaultMembers)
        );

    }

}


// ================= RÉCUPÉRATION =================

function getTasks() {

    return JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

}


function getProjects() {

    return JSON.parse(
        localStorage.getItem("projects")
    ) || [];

}


function getMembers() {

    return JSON.parse(
        localStorage.getItem("members")
    ) || [];

}


// ================= SAUVEGARDE =================

function saveTasks(tasks) {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ================= ÉLÉMENTS =================

const modal =
    document.getElementById("taskModal");

const form =
    document.getElementById("taskForm");

const tasksContainer =
    document.getElementById("tasksContainer");

const emptyState =
    document.getElementById("emptyState");


// ================= OUVRIR MODAL =================

document
    .getElementById("openTaskModal")
    .addEventListener("click", () => {

        openCreateModal();

    });


// ================= FERMER MODAL =================

document
    .getElementById("closeTaskModal")
    .addEventListener("click", closeModal);


document
    .getElementById("cancelTask")
    .addEventListener("click", closeModal);


function closeModal() {

    modal.classList.add("hidden");

    form.reset();

    document.getElementById("taskId").value = "";

    document.getElementById("modalTitle").textContent =
        "Nouvelle tâche";

}


// ================= MODAL CRÉATION =================

function openCreateModal() {

    form.reset();

    document.getElementById("taskId").value = "";

    document.getElementById("modalTitle").textContent =
        "Nouvelle tâche";

    populateProjects();

    populateMembers();

    modal.classList.remove("hidden");

}


// ================= PROJETS =================

function populateProjects(selectedId = "") {

    const select =
        document.getElementById("taskProject");

    const projects = getProjects();

    select.innerHTML = `
        <option value="">
            Sélectionner un projet
        </option>
    `;


    projects.forEach(project => {

        const option =
            document.createElement("option");

        option.value = project.id;

        option.textContent = project.name;

        if (
            String(project.id) ===
            String(selectedId)
        ) {

            option.selected = true;

        }

        select.appendChild(option);

    });

}


// ================= MEMBRES =================

function populateMembers(selectedId = "") {

    const select =
        document.getElementById("taskMember");

    const members = getMembers();


    select.innerHTML = `
        <option value="">
            Aucun membre
        </option>
    `;


    members.forEach(member => {

        const option =
            document.createElement("option");

        option.value = member.id;

        option.textContent =
            `${member.firstName} ${member.lastName}`;

        if (
            String(member.id) ===
            String(selectedId)
        ) {

            option.selected = true;

        }

        select.appendChild(option);

    });

}


// ================= SUBMIT =================

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const taskId =
            document.getElementById("taskId").value;


        const taskData = {

            title:
                document
                    .getElementById("taskTitle")
                    .value
                    .trim(),

            description:
                document
                    .getElementById("taskDescription")
                    .value
                    .trim(),

            status:
                document
                    .getElementById("taskStatus")
                    .value,

            priority:
                document
                    .getElementById("taskPriority")
                    .value,

            project:
                document
                    .getElementById("taskProject")
                    .value,

            assignedTo:
                document
                    .getElementById("taskMember")
                    .value,

            tags:
                document
                    .getElementById("taskTags")
                    .value
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(tag => tag !== ""),

            deadline:
                document
                    .getElementById("taskDeadline")
                    .value

        };


        // ================= MODIFICATION =================

        if (taskId) {

            const tasks = getTasks();

            const index =
                tasks.findIndex(
                    task =>
                        String(task.id) ===
                        String(taskId)
                );


            if (index !== -1) {

                tasks[index] = {

                    ...tasks[index],

                    ...taskData

                };

                saveTasks(tasks);

            }

        }

        // ================= CRÉATION =================

        else {

            const tasks = getTasks();

            const newTask = {

                id: Date.now(),

                ...taskData,

                createdAt:
                    new Date()
                        .toISOString()
                        .split("T")[0]

            };


            tasks.unshift(newTask);

            saveTasks(tasks);

        }


        closeModal();

        renderTasks();

    }
);


// ================= AFFICHAGE =================

function renderTasks() {

    let tasks = getTasks();


    const search =
        document
            .getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();


    const status =
        document
            .getElementById("statusFilter")
            .value;


    const priority =
        document
            .getElementById("priorityFilter")
            .value;


    const sort =
        document
            .getElementById("sortFilter")
            .value;


    // Recherche

    if (search) {

        tasks = tasks.filter(task => {

            const text = `

                ${task.title}
                ${task.description}
                ${task.priority}
                ${task.status}
                ${(task.tags || []).join(" ")}

            `.toLowerCase();


            return text.includes(search);

        });

    }


    // Statut

    if (status !== "all") {

        tasks = tasks.filter(
            task =>
                task.status === status
        );

    }


    // Priorité

    if (priority !== "all") {

        tasks = tasks.filter(
            task =>
                task.priority === priority
        );

    }


    // Tri

    if (sort === "newest") {

        tasks.sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

    }


    if (sort === "oldest") {

        tasks.sort(
            (a, b) =>
                new Date(a.createdAt) -
                new Date(b.createdAt)
        );

    }


    if (sort === "deadline") {

        tasks.sort(
            (a, b) =>
                new Date(a.deadline) -
                new Date(b.deadline)
        );

    }


    if (sort === "priority") {

        const order = {
            urgent: 1,
            high: 2,
            medium: 3,
            low: 4
        };

        tasks.sort(
            (a, b) =>
                order[a.priority] -
                order[b.priority]
        );

    }


    updateTaskStats(tasks);


    if (tasks.length === 0) {

        tasksContainer.innerHTML = "";

        emptyState.classList.remove("hidden");

        return;

    }


    emptyState.classList.add("hidden");


    tasksContainer.innerHTML =
        tasks
            .map(task => createTaskCard(task))
            .join("");

}


// ================= CARTE TÂCHE =================

function createTaskCard(task) {

    const projects =
        getProjects();

    const members =
        getMembers();


    const project =
        projects.find(
            project =>
                String(project.id) ===
                String(task.project)
        );


    const member =
        members.find(
            member =>
                String(member.id) ===
                String(task.assignedTo)
        );


    const statusInfo =
        getStatusInfo(task.status);

    const priorityInfo =
        getPriorityInfo(task.priority);


    const isLate =
        new Date(task.deadline) <
            new Date() &&
        task.status !== "completed";


    return `

        <div
            class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition"
        >

            <!-- TOP -->

            <div class="flex justify-between gap-4">

                <div class="min-w-0">

                    <h3 class="
                        font-bold
                        text-lg
                        text-slate-900
                        ${task.status === "completed"
                            ? "line-through text-slate-400"
                            : ""}
                    ">
                        ${escapeHtml(task.title)}
                    </h3>

                    <p class="text-sm text-slate-500 mt-2">
                        ${escapeHtml(task.description || "Aucune description")}
                    </p>

                </div>


                <!-- PRIORITÉ -->

                <span
                    class="
                        h-fit
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${priorityInfo.class}
                    "
                >
                    ${priorityInfo.label}
                </span>

            </div>


            <!-- STATUT -->

            <div class="mt-4">

                <span
                    class="
                        inline-flex
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        ${statusInfo.class}
                    "
                >
                    ${statusInfo.label}
                </span>

            </div>


            <!-- PROJET / MEMBRE -->

            <div class="grid grid-cols-2 gap-3 mt-5">

                <div class="bg-slate-50 rounded-xl p-3">

                    <p class="text-xs text-slate-400">
                        Projet
                    </p>

                    <p class="text-sm font-semibold mt-1">
                        ${project
                            ? escapeHtml(project.name)
                            : "Aucun projet"}
                    </p>

                </div>


                <div class="bg-slate-50 rounded-xl p-3">

                    <p class="text-xs text-slate-400">
                        Assigné à
                    </p>

                    <p class="text-sm font-semibold mt-1">

                        ${
                            member
                                ? escapeHtml(
                                    `${member.firstName} ${member.lastName}`
                                  )
                                : "Non assigné"
                        }

                    </p>

                </div>

            </div>


            <!-- TAGS -->

            ${
                task.tags && task.tags.length
                    ? `

                        <div class="flex flex-wrap gap-2 mt-4">

                            ${task.tags
                                .map(
                                    tag => `
                                        <span
                                            class="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs"
                                        >
                                            #${escapeHtml(tag)}
                                        </span>
                                    `
                                )
                                .join("")}

                        </div>

                    `
                    : ""
            }


            <!-- DEADLINE -->

            <div
                class="
                    mt-5
                    flex
                    justify-between
                    items-center
                    text-sm
                    ${
                        isLate
                            ? "text-red-600"
                            : "text-slate-500"
                    }
                "
            >

                <span>

                    ${
                        isLate
                            ? "⚠️ En retard"
                            : "📅 Deadline"
                    }

                </span>

                <span class="font-semibold">
                    ${formatDate(task.deadline)}
                </span>

            </div>


            <!-- ACTIONS -->

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-5 border-t">

                ${
                    task.status === "completed"

                        ? `

                            <button
                                onclick="reopenTask(${task.id})"
                                class="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium"
                            >
                                ↩ Réouvrir
                            </button>

                        `

                        : `

                            <button
                                onclick="completeTask(${task.id})"
                                class="px-3 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-sm font-medium"
                            >
                                ✓ Terminer
                            </button>

                        `
                }


                <button
                    onclick="editTask(${task.id})"
                    class="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm font-medium"
                >
                    ✏ Modifier
                </button>


                <button
                    onclick="deleteTask(${task.id})"
                    class="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
                >
                    🗑 Supprimer
                </button>


                <button
                    onclick="duplicateTask(${task.id})"
                    class="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm font-medium"
                >
                    ⧉ Dupliquer
                </button>

            </div>

        </div>

    `;

}


// ================= TERMINER =================

function completeTask(id) {

    const tasks = getTasks();


    const task =
        tasks.find(
            task =>
                String(task.id) ===
                String(id)
        );


    if (!task) return;


    task.status = "completed";


    saveTasks(tasks);

    renderTasks();

}


// ================= RÉOUVRIR =================

function reopenTask(id) {

    const tasks = getTasks();


    const task =
        tasks.find(
            task =>
                String(task.id) ===
                String(id)
        );


    if (!task) return;


    task.status = "todo";


    saveTasks(tasks);

    renderTasks();

}


// ================= SUPPRIMER =================

function deleteTask(id) {

    const task =
        getTasks().find(
            task =>
                String(task.id) ===
                String(id)
        );


    if (!task) return;


    const confirmed =
        confirm(
            `Voulez-vous vraiment supprimer "${task.title}" ?`
        );


    if (!confirmed) return;


    const tasks =
        getTasks().filter(
            task =>
                String(task.id) !==
                String(id)
        );


    saveTasks(tasks);

    renderTasks();

}


// ================= MODIFIER =================

function editTask(id) {

    const task =
        getTasks().find(
            task =>
                String(task.id) ===
                String(id)
        );


    if (!task) return;


    document.getElementById("taskId").value =
        task.id;

    document.getElementById("taskTitle").value =
        task.title;

    document.getElementById("taskDescription").value =
        task.description || "";

    document.getElementById("taskStatus").value =
        task.status;

    document.getElementById("taskPriority").value =
        task.priority;

    document.getElementById("taskTags").value =
        (task.tags || []).join(", ");

    document.getElementById("taskDeadline").value =
        task.deadline;


    populateProjects(task.project);

    populateMembers(task.assignedTo);


    document.getElementById("modalTitle").textContent =
        "Modifier la tâche";


    modal.classList.remove("hidden");

}


// ================= DUPLIQUER =================

function duplicateTask(id) {

    const tasks = getTasks();


    const task =
        tasks.find(
            task =>
                String(task.id) ===
                String(id)
        );


    if (!task) return;


    const copy = {

        ...task,

        id: Date.now(),

        title:
            `${task.title} - Copie`,

        status: "todo",

        createdAt:
            new Date()
                .toISOString()
                .split("T")[0]

    };


    tasks.unshift(copy);

    saveTasks(tasks);

    renderTasks();

}


// ================= STATISTIQUES =================

function updateTaskStats(tasks) {

    /*
        Attention :
        Ici on calcule les statistiques
        sur toutes les tâches et non uniquement
        les tâches filtrées.
    */

    const allTasks = getTasks();


    document.getElementById("taskTotal").textContent =
        allTasks.length;


    document.getElementById("taskTodo").textContent =
        allTasks.filter(
            task => task.status === "todo"
        ).length;


    document.getElementById("taskProgress").textContent =
        allTasks.filter(
            task => task.status === "in-progress"
        ).length;


    document.getElementById("taskCompleted").textContent =
        allTasks.filter(
            task => task.status === "completed"
        ).length;

}


// ================= STATUT =================

function getStatusInfo(status) {

    const statuses = {

        todo: {
            label: "À faire",
            class: "bg-orange-100 text-orange-700"
        },

        "in-progress": {
            label: "En cours",
            class: "bg-blue-100 text-blue-700"
        },

        paused: {
            label: "En pause",
            class: "bg-yellow-100 text-yellow-700"
        },

        completed: {
            label: "Terminée",
            class: "bg-green-100 text-green-700"
        }

    };


    return (
        statuses[status] ||
        {
            label: status,
            class: "bg-slate-100 text-slate-600"
        }
    );

}


// ================= PRIORITÉ =================

function getPriorityInfo(priority) {

    const priorities = {

        low: {
            label: "Low",
            class: "bg-slate-100 text-slate-600"
        },

        medium: {
            label: "Medium",
            class: "bg-yellow-100 text-yellow-700"
        },

        high: {
            label: "High",
            class: "bg-orange-100 text-orange-700"
        },

        urgent: {
            label: "Urgent",
            class: "bg-red-100 text-red-700"
        }

    };


    return (
        priorities[priority] ||
        {
            label: priority,
            class: "bg-slate-100 text-slate-600"
        }
    );

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

    if (value === null || value === undefined) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ================= FILTRES =================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        renderTasks
    );


document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        renderTasks
    );


document
    .getElementById("priorityFilter")
    .addEventListener(
        "change",
        renderTasks
    );


document
    .getElementById("sortFilter")
    .addEventListener(
        "change",
        renderTasks
    );


// ================= FERMER AVEC ESC =================

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


// ================= DÉMARRAGE =================

function init() {

    initializeData();

    populateProjects();

    populateMembers();

    renderTasks();

}


init();