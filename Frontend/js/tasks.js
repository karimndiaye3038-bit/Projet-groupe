// ======================================================
// TASKFLOW PRO
// GESTION DES TÂCHES
// ======================================================


// ======================================================
// DONNÉES PAR DÉFAUT
// ======================================================

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
        deadline: "2026-08-20",
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
        deadline: "2026-08-25",
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
        deadline: "2026-08-28",
        createdAt: "2026-08-12"
    }
];


// ======================================================
// PROJETS PAR DÉFAUT
// ======================================================

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


// ======================================================
// MEMBRES PAR DÉFAUT
// ======================================================

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


// ======================================================
// INITIALISATION
// ======================================================

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


// ======================================================
// RÉCUPÉRER LES TÂCHES
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
// SAUVEGARDER LES TÂCHES
// ======================================================

function saveTasks(tasks) {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ======================================================
// RÉCUPÉRER PROJETS
// ======================================================

function getProjects() {

    try {

        return JSON.parse(
            localStorage.getItem("projects")
        ) || [];

    } catch {

        return [];

    }

}


// ======================================================
// RÉCUPÉRER MEMBRES
// ======================================================

function getMembers() {

    try {

        return JSON.parse(
            localStorage.getItem("members")
        ) || [];

    } catch {

        return [];

    }

}


// ======================================================
// ÉLÉMENTS HTML
// ======================================================

const modal =
    document.getElementById("taskModal");

const form =
    document.getElementById("taskForm");

const tasksContainer =
    document.getElementById("tasksContainer");

const emptyState =
    document.getElementById("emptyState");

const openTaskModal =
    document.getElementById("openTaskModal");

const closeTaskModal =
    document.getElementById("closeTaskModal");

const cancelTask =
    document.getElementById("cancelTask");


// ======================================================
// OUVRIR MODALE
// ======================================================

openTaskModal.addEventListener(
    "click",
    function () {

        openCreateModal();

    }
);


// ======================================================
// FERMER MODALE
// ======================================================

closeTaskModal.addEventListener(
    "click",
    closeModal
);


cancelTask.addEventListener(
    "click",
    closeModal
);


// ======================================================
// FERMER EN CLIQUANT EN DEHORS
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
        "taskId"
    ).value = "";

    document.getElementById(
        "taskModalTitle"
    ).textContent =
        "Nouvelle tâche";

}


// ======================================================
// OUVRIR MODALE CRÉATION
// ======================================================

function openCreateModal() {

    form.reset();

    document.getElementById(
        "taskId"
    ).value = "";

    document.getElementById(
        "taskModalTitle"
    ).textContent =
        "Nouvelle tâche";


    document.getElementById(
        "taskStatus"
    ).value =
        "todo";


    document.getElementById(
        "taskPriority"
    ).value =
        "medium";


    populateProjects();

    populateMembers();


    modal.classList.remove(
        "hidden"
    );

    modal.classList.add(
        "flex"
    );

}


// ======================================================
// REMPLIR PROJETS
// ======================================================

function populateProjects(
    selectedId = ""
) {

    const select =
        document.getElementById(
            "taskProject"
        );


    const projects =
        getProjects();


    select.innerHTML = `
        <option value="">
            Sélectionner un projet
        </option>
    `;


    projects.forEach(
        function (project) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                project.id;


            option.textContent =
                project.name;


            if (
                String(project.id) ===
                String(selectedId)
            ) {

                option.selected =
                    true;

            }


            select.appendChild(
                option
            );

        }
    );


    populateProjectFilter();

}


// ======================================================
// REMPLIR MEMBRES
// ======================================================

function populateMembers(
    selectedId = ""
) {

    const select =
        document.getElementById(
            "taskMember"
        );


    const members =
        getMembers();


    select.innerHTML = `
        <option value="">
            Non assignée
        </option>
    `;


    members.forEach(
        function (member) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                member.id;


            option.textContent =
                `${member.firstName} ${member.lastName}`;


            if (
                String(member.id) ===
                String(selectedId)
            ) {

                option.selected =
                    true;

            }


            select.appendChild(
                option
            );

        }
    );

}


// ======================================================
// FILTRE PROJETS
// ======================================================

function populateProjectFilter() {

    const select =
        document.getElementById(
            "filterProject"
        );


    const currentValue =
        select.value;


    const projects =
        getProjects();


    select.innerHTML = `
        <option value="all">
            Tous les projets
        </option>
    `;


    projects.forEach(
        function (project) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                project.id;


            option.textContent =
                project.name;


            select.appendChild(
                option
            );

        }
    );


    if (
        projects.some(
            project =>
                String(project.id) ===
                String(currentValue)
        )
    ) {

        select.value =
            currentValue;

    }

}


// ======================================================
// ENREGISTREMENT
// ======================================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // ------------------------------------------
        // RÉCUPÉRATION
        // ------------------------------------------

        const taskId =
            document.getElementById(
                "taskId"
            ).value;


        const title =
            document.getElementById(
                "taskTitle"
            ).value.trim();


        const description =
            document.getElementById(
                "taskDescription"
            ).value.trim();


        const status =
            document.getElementById(
                "taskStatus"
            ).value;


        const priority =
            document.getElementById(
                "taskPriority"
            ).value;


        const project =
            document.getElementById(
                "taskProject"
            ).value;


        const assignedTo =
            document.getElementById(
                "taskMember"
            ).value;


        const tags =
            document.getElementById(
                "taskTags"
            ).value
                .split(",")
                .map(
                    tag =>
                        tag.trim()
                )
                .filter(
                    tag =>
                        tag !== ""
                );


        const deadline =
            document.getElementById(
                "taskDeadline"
            ).value;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (!title) {

            alert(
                "Veuillez saisir le titre de la tâche."
            );

            return;

        }


        if (!project) {

            alert(
                "Veuillez sélectionner un projet."
            );

            return;

        }


        // ------------------------------------------
        // DONNÉES
        // ------------------------------------------

        const taskData = {

            title:
                title,

            description:
                description,

            status:
                status,

            priority:
                priority,

            project:
                project,

            assignedTo:
                assignedTo,

            tags:
                tags,

            deadline:
                deadline

        };


        const tasks =
            getTasks();


        // ==================================================
        // MODIFICATION
        // ==================================================

        if (taskId) {

            const index =
                tasks.findIndex(
                    task =>
                        String(task.id) ===
                        String(taskId)
                );


            if (
                index === -1
            ) {

                alert(
                    "Tâche introuvable."
                );

                return;

            }


            tasks[index] = {

                ...tasks[index],

                ...taskData

            };


            saveTasks(
                tasks
            );


            closeModal();


            renderTasks();


            alert(
                "Tâche modifiée avec succès !"
            );


            return;

        }


        // ==================================================
        // CRÉATION
        // ==================================================

        const newTask = {

            id:
                Date.now(),

            ...taskData,

            createdAt:
                new Date()
                    .toISOString()
                    .split("T")[0]

        };


        // AJOUT EN PREMIÈRE POSITION

        tasks.unshift(
            newTask
        );


        // SAUVEGARDE

        saveTasks(
            tasks
        );


        // VÉRIFICATION

        console.log(
            "Tâche enregistrée :",
            newTask
        );

        console.log(
            "Toutes les tâches :",
            getTasks()
        );


        // FERMER

        closeModal();


        // ACTUALISER

        renderTasks();


        // MESSAGE

        alert(
            "Tâche ajoutée avec succès !"
        );

    }
);


// ======================================================
// AFFICHER LES TÂCHES
// ======================================================

function renderTasks() {

    let tasks =
        getTasks();


    // ------------------------------------------
    // RECHERCHE
    // ------------------------------------------

    const search =
        document.getElementById(
            "taskSearch"
        ).value
            .trim()
            .toLowerCase();


    // ------------------------------------------
    // FILTRE STATUT
    // ------------------------------------------

    const status =
        document.getElementById(
            "filterStatus"
        ).value;


    // ------------------------------------------
    // FILTRE PRIORITÉ
    // ------------------------------------------

    const priority =
        document.getElementById(
            "filterPriority"
        ).value;


    // ------------------------------------------
    // FILTRE PROJET
    // ------------------------------------------

    const project =
        document.getElementById(
            "filterProject"
        ).value;


    // ------------------------------------------
    // TRI
    // ------------------------------------------

    const sort =
        document.getElementById(
            "sortTasks"
        ).value;


    // ==================================================
    // RECHERCHE
    // ==================================================

    if (search) {

        tasks =
            tasks.filter(
                function (task) {

                    const text = `

                        ${task.title}

                        ${task.description}

                        ${task.priority}

                        ${task.status}

                        ${(task.tags || []).join(" ")}

                    `.toLowerCase();


                    return text.includes(
                        search
                    );

                }
            );

    }


    // ==================================================
    // STATUT
    // ==================================================

    if (
        status !== "all"
    ) {

        tasks =
            tasks.filter(
                task =>
                    task.status ===
                    status
            );

    }


    // ==================================================
    // PRIORITÉ
    // ==================================================

    if (
        priority !== "all"
    ) {

        tasks =
            tasks.filter(
                task =>
                    task.priority ===
                    priority
            );

    }


    // ==================================================
    // PROJET
    // ==================================================

    if (
        project !== "all"
    ) {

        tasks =
            tasks.filter(
                task =>
                    String(task.project) ===
                    String(project)
            );

    }


    // ==================================================
    // TRI
    // ==================================================

    if (
        sort === "newest"
    ) {

        tasks.sort(
            function (a, b) {

                return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                );

            }
        );

    }


    if (
        sort === "oldest"
    ) {

        tasks.sort(
            function (a, b) {

                return (
                    new Date(a.createdAt) -
                    new Date(b.createdAt)
                );

            }
        );

    }


    if (
        sort === "deadline"
    ) {

        tasks.sort(
            function (a, b) {

                if (!a.deadline)
                    return 1;

                if (!b.deadline)
                    return -1;

                return (
                    new Date(a.deadline) -
                    new Date(b.deadline)
                );

            }
        );

    }


    if (
        sort === "priority"
    ) {

        const order = {

            urgent: 1,

            high: 2,

            medium: 3,

            low: 4

        };


        tasks.sort(
            function (a, b) {

                return (
                    (order[a.priority] || 99) -
                    (order[b.priority] || 99)
                );

            }
        );

    }


    // ==================================================
    // STATISTIQUES
    // ==================================================

    updateTaskStats();


    // ==================================================
    // AUCUNE TÂCHE
    // ==================================================

    if (
        tasks.length === 0
    ) {

        tasksContainer.innerHTML =
            "";

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    emptyState.classList.add(
        "hidden"
    );


    // ==================================================
    // AFFICHAGE
    // ==================================================

    tasksContainer.innerHTML =
        tasks
            .map(
                task =>
                    createTaskCard(
                        task
                    )
            )
            .join("");

}


// ======================================================
// CARTE TÂCHE
// ======================================================

function createTaskCard(
    task
) {

    const projects =
        getProjects();


    const members =
        getMembers();


    const project =
        projects.find(
            item =>
                String(item.id) ===
                String(task.project)
        );


    const member =
        members.find(
            item =>
                String(item.id) ===
                String(task.assignedTo)
        );


    const statusInfo =
        getStatusInfo(
            task.status
        );


    const priorityInfo =
        getPriorityInfo(
            task.priority
        );


    // ------------------------------------------
    // RETARD
    // ------------------------------------------

    const isLate =
        task.deadline &&
        new Date(
            task.deadline
        ) < new Date() &&
        task.status !== "completed";


    return `

        <div
            class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition"
        >


            <!-- TOP -->

            <div
                class="flex justify-between gap-5"
            >


                <div
                    class="flex-1 min-w-0"
                >

                    <div
                        class="flex items-center gap-3 flex-wrap"
                    >

                        <h3
                            class="
                                font-bold
                                text-lg
                                text-slate-900
                                ${
                                    task.status === "completed"
                                        ? "line-through text-slate-400"
                                        : ""
                                }
                            "
                        >

                            ${escapeHtml(
                                task.title
                            )}

                        </h3>


                        <span
                            class="
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


                    <p
                        class="text-sm text-slate-500 mt-2"
                    >

                        ${escapeHtml(
                            task.description ||
                            "Aucune description"
                        )}

                    </p>

                </div>


                <!-- STATUT -->

                <span
                    class="
                        h-fit
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        whitespace-nowrap
                        ${statusInfo.class}
                    "
                >

                    ${statusInfo.label}

                </span>

            </div>



            <!-- PROJET / MEMBRE -->

            <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5"
            >


                <div
                    class="bg-slate-50 rounded-xl p-4"
                >

                    <p
                        class="text-xs text-slate-400"
                    >
                        Projet
                    </p>

                    <p
                        class="text-sm font-semibold mt-1"
                    >

                        ${
                            project
                                ? escapeHtml(
                                    project.name
                                )
                                : "Aucun projet"
                        }

                    </p>

                </div>


                <div
                    class="bg-slate-50 rounded-xl p-4"
                >

                    <p
                        class="text-xs text-slate-400"
                    >
                        Assigné à
                    </p>

                    <p
                        class="text-sm font-semibold mt-1"
                    >

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
                task.tags &&
                task.tags.length
                    ? `

                        <div
                            class="flex flex-wrap gap-2 mt-4"
                        >

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
                                .join("")
                            }

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


                <span
                    class="font-semibold"
                >

                    ${formatDate(
                        task.deadline
                    )}

                </span>

            </div>



            <!-- ACTIONS -->

            <div
                class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5 pt-5 border-t"
            >


                ${
                    task.status === "completed"

                        ? `

                            <button
                                type="button"
                                onclick="reopenTask(${task.id})"
                                class="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium"
                            >

                                ↩ Réouvrir

                            </button>

                        `

                        : `

                            <button
                                type="button"
                                onclick="completeTask(${task.id})"
                                class="px-3 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-sm font-medium"
                            >

                                ✓ Terminer

                            </button>

                        `
                }


                <button
                    type="button"
                    onclick="editTask(${task.id})"
                    class="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm font-medium"
                >

                    ✏ Modifier

                </button>


                <button
                    type="button"
                    onclick="deleteTask(${task.id})"
                    class="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
                >

                    🗑 Supprimer

                </button>


                <button
                    type="button"
                    onclick="duplicateTask(${task.id})"
                    class="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm font-medium"
                >

                    ⧉ Dupliquer

                </button>

            </div>

        </div>

    `;

}


// ======================================================
// TERMINER
// ======================================================

function completeTask(
    id
) {

    const tasks =
        getTasks();


    const task =
        tasks.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!task) {

        return;

    }


    task.status =
        "completed";


    saveTasks(
        tasks
    );


    renderTasks();

}


// ======================================================
// RÉOUVRIR
// ======================================================

function reopenTask(
    id
) {

    const tasks =
        getTasks();


    const task =
        tasks.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!task) {

        return;

    }


    task.status =
        "todo";


    saveTasks(
        tasks
    );


    renderTasks();

}


// ======================================================
// SUPPRIMER
// ======================================================

function deleteTask(
    id
) {

    const tasks =
        getTasks();


    const task =
        tasks.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!task) {

        return;

    }


    const confirmed =
        confirm(
            `Voulez-vous vraiment supprimer "${task.title}" ?`
        );


    if (!confirmed) {

        return;

    }


    const newTasks =
        tasks.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    saveTasks(
        newTasks
    );


    renderTasks();

}


// ======================================================
// MODIFIER
// ======================================================

function editTask(
    id
) {

    const task =
        getTasks().find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!task) {

        return;

    }


    document.getElementById(
        "taskId"
    ).value =
        task.id;


    document.getElementById(
        "taskTitle"
    ).value =
        task.title;


    document.getElementById(
        "taskDescription"
    ).value =
        task.description || "";


    document.getElementById(
        "taskStatus"
    ).value =
        task.status;


    document.getElementById(
        "taskPriority"
    ).value =
        task.priority;


    document.getElementById(
        "taskTags"
    ).value =
        (task.tags || []).join(
            ", "
        );


    document.getElementById(
        "taskDeadline"
    ).value =
        task.deadline || "";


    populateProjects(
        task.project
    );


    populateMembers(
        task.assignedTo
    );


    document.getElementById(
        "taskModalTitle"
    ).textContent =
        "Modifier la tâche";


    modal.classList.remove(
        "hidden"
    );

    modal.classList.add(
        "flex"
    );

}


// ======================================================
// DUPLIQUER
// ======================================================

function duplicateTask(
    id
) {

    const tasks =
        getTasks();


    const task =
        tasks.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!task) {

        return;

    }


    const copy = {

        ...task,

        id:
            Date.now(),

        title:
            `${task.title} - Copie`,

        status:
            "todo",

        createdAt:
            new Date()
                .toISOString()
                .split("T")[0]

    };


    tasks.unshift(
        copy
    );


    saveTasks(
        tasks
    );


    renderTasks();

}


// ======================================================
// STATISTIQUES
// ======================================================

function updateTaskStats() {

    const tasks =
        getTasks();


    document.getElementById(
        "taskTotal"
    ).textContent =
        tasks.length;


    document.getElementById(
        "taskTodo"
    ).textContent =
        tasks.filter(
            task =>
                task.status === "todo"
        ).length;


    document.getElementById(
        "taskProgress"
    ).textContent =
        tasks.filter(
            task =>
                task.status === "in-progress"
        ).length;


    document.getElementById(
        "taskCompleted"
    ).textContent =
        tasks.filter(
            task =>
                task.status === "completed"
        ).length;

}


// ======================================================
// STATUT
// ======================================================

function getStatusInfo(
    status
) {

    const statuses = {

        todo: {

            label:
                "À faire",

            class:
                "bg-orange-100 text-orange-700"

        },

        "in-progress": {

            label:
                "En cours",

            class:
                "bg-blue-100 text-blue-700"

        },

        paused: {

            label:
                "En pause",

            class:
                "bg-yellow-100 text-yellow-700"

        },

        completed: {

            label:
                "Terminée",

            class:
                "bg-green-100 text-green-700"

        }

    };


    return (
        statuses[status] ||
        {

            label:
                status || "Inconnu",

            class:
                "bg-slate-100 text-slate-600"

        }
    );

}


// ======================================================
// PRIORITÉ
// ======================================================

function getPriorityInfo(
    priority
) {

    const priorities = {

        low: {

            label:
                "Low",

            class:
                "bg-slate-100 text-slate-600"

        },

        medium: {

            label:
                "Medium",

            class:
                "bg-yellow-100 text-yellow-700"

        },

        high: {

            label:
                "High",

            class:
                "bg-orange-100 text-orange-700"

        },

        urgent: {

            label:
                "Urgent",

            class:
                "bg-red-100 text-red-700"

        }

    };


    return (
        priorities[priority] ||
        {

            label:
                priority || "Inconnue",

            class:
                "bg-slate-100 text-slate-600"

        }
    );

}


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

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric"

        }
    );

}


// ======================================================
// SÉCURITÉ HTML
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
// ÉVÉNEMENTS DES FILTRES
// ======================================================

document.getElementById(
    "taskSearch"
).addEventListener(
    "input",
    renderTasks
);


document.getElementById(
    "filterStatus"
).addEventListener(
    "change",
    renderTasks
);


document.getElementById(
    "filterPriority"
).addEventListener(
    "change",
    renderTasks
);


document.getElementById(
    "filterProject"
).addEventListener(
    "change",
    renderTasks
);


document.getElementById(
    "sortTasks"
).addEventListener(
    "change",
    renderTasks
);


// ======================================================
// ESC POUR FERMER
// ======================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            !modal.classList.contains(
                "hidden"
            )
        ) {

            closeModal();

        }

    }
);


// ======================================================
// INITIALISATION
// ======================================================

function init() {

    initializeData();

    populateProjects();

    populateMembers();

    populateProjectFilter();

    renderTasks();

}


init();