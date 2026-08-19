// =====================================================
// TASKFLOW PRO - TASKS.JS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // DONNÉES PAR DÉFAUT
    // =====================================================

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


    // =====================================================
    // INITIALISATION LOCAL STORAGE
    // =====================================================

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


    // =====================================================
    // ÉLÉMENTS HTML
    // =====================================================

    const modal = document.getElementById("taskModal");
    const form = document.getElementById("taskForm");

    const newBtn = document.getElementById("newTaskBtn");
    const emptyBtn = document.getElementById("emptyNewTaskBtn");

    const closeBtn = document.getElementById("closeTaskModal");
    const cancelBtn = document.getElementById("cancelTaskBtn");

    const search = document.getElementById("taskSearch");
    const statusFilter = document.getElementById("statusFilter");
    const priorityFilter = document.getElementById("priorityFilter");
    const projectFilter = document.getElementById("projectFilter");

    const emptyState = document.getElementById("emptyTasks");


    // =====================================================
    // COLONNES DRAG & DROP
    // =====================================================

    const columns = {
        todo: document.getElementById("todoColumn"),

        "in-progress":
            document.getElementById("progressColumn"),

        paused:
            document.getElementById("pausedColumn"),

        completed:
            document.getElementById("completedColumn")
    };


    // =====================================================
    // UTILITAIRES LOCAL STORAGE
    // =====================================================

    function getTasks() {

        return JSON.parse(
            localStorage.getItem("tasks") || "[]"
        );

    }


    function getProjects() {

        return JSON.parse(
            localStorage.getItem("projects") || "[]"
        );

    }


    function getMembers() {

        return JSON.parse(
            localStorage.getItem("members") || "[]"
        );

    }


    function saveTasks(tasks) {

        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );

    }


    // =====================================================
    // MODALE
    // =====================================================

    function openModal(task = null) {

        form.reset();

        document.getElementById("taskId").value =
            task ? task.id : "";

        document.getElementById("modalTitle").textContent =
            task
                ? "Modifier la tâche"
                : "Nouvelle tâche";


        document.getElementById("taskStatus").value =
            task?.status || "todo";


        document.getElementById("taskPriority").value =
            task?.priority || "medium";


        if (task) {

            document.getElementById("taskTitle").value =
                task.title || "";


            document.getElementById("taskDescription").value =
                task.description || "";


            document.getElementById("taskTags").value =
                (task.tags || []).join(", ");


            document.getElementById("taskDeadline").value =
                task.deadline || "";

        }


        loadProjects(task?.project);

        loadMembers(task?.assignedTo);

        modal.classList.remove("hidden");

    }


    function closeModal() {

        modal.classList.add("hidden");

        form.reset();

        document.getElementById("taskId").value = "";

        document.getElementById("modalTitle").textContent =
            "Nouvelle tâche";

    }


    if (newBtn) {
        newBtn.addEventListener(
            "click",
            () => openModal()
        );
    }


    if (emptyBtn) {
        emptyBtn.addEventListener(
            "click",
            () => openModal()
        );
    }


    if (closeBtn) {
        closeBtn.addEventListener(
            "click",
            closeModal
        );
    }


    if (cancelBtn) {
        cancelBtn.addEventListener(
            "click",
            closeModal
        );
    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (event.target === modal) {
                    closeModal();
                }

            }
        );

    }


    // =====================================================
    // PROJETS
    // =====================================================

    function loadProjects(selected = "") {

        const projects = getProjects();

        const taskProject =
            document.getElementById("taskProject");

        projectFilter.innerHTML = `
            <option value="all">
                Tous les projets
            </option>

            ${projects.map(project => `
                <option value="${project.id}">
                    ${escapeHTML(project.name)}
                </option>
            `).join("")}
        `;


        taskProject.innerHTML = `
            <option value="">
                Aucun projet
            </option>

            ${projects.map(project => `
                <option
                    value="${project.id}"
                    ${
                        String(project.id) === String(selected)
                            ? "selected"
                            : ""
                    }
                >
                    ${escapeHTML(project.name)}
                </option>
            `).join("")}
        `;

    }


    // =====================================================
    // MEMBRES
    // =====================================================

    function loadMembers(selected = "") {

        const members = getMembers();

        const taskMember =
            document.getElementById("taskMember");


        taskMember.innerHTML = `
            <option value="">
                Non assignée
            </option>

            ${members.map(member => `
                <option
                    value="${member.id}"
                    ${
                        String(member.id) === String(selected)
                            ? "selected"
                            : ""
                    }
                >
                    ${escapeHTML(member.firstName)}
                    ${escapeHTML(member.lastName)}
                </option>
            `).join("")}
        `;

    }


    // =====================================================
    // ENREGISTRER UNE TÂCHE
    // =====================================================

    form.addEventListener("submit", event => {

        event.preventDefault();


        const id =
            document.getElementById("taskId").value;


        const existingTask =
            id
                ? getTasks().find(
                    task =>
                        String(task.id) === String(id)
                )
                : null;


        const task = {

            id:
                id
                    ? Number(id)
                    : Date.now(),

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
                    .filter(Boolean),

            deadline:
                document
                    .getElementById("taskDeadline")
                    .value,

            createdAt:
                existingTask?.createdAt ||
                new Date()
                    .toISOString()
                    .split("T")[0]
        };


        if (!task.title) {

            alert(
                "Veuillez saisir le titre de la tâche."
            );

            return;
        }


        if (!task.project) {

            alert(
                "Veuillez sélectionner un projet."
            );

            return;
        }


        const tasks = getTasks();


        if (id) {

            const index =
                tasks.findIndex(
                    task =>
                        String(task.id) === String(id)
                );


            if (index !== -1) {

                tasks[index] = task;

            }

        } else {

            tasks.unshift(task);

        }


        saveTasks(tasks);

        closeModal();

        renderTasks();

        alert(
            id
                ? "Tâche modifiée avec succès !"
                : "Tâche ajoutée avec succès !"
        );

    });


    // =====================================================
    // AFFICHAGE
    // =====================================================

    function renderTasks() {

        let tasks = getTasks();


        // ---------------------------------------------
        // FILTRES
        // ---------------------------------------------

        const text =
            search.value
                .toLowerCase()
                .trim();


        const selectedStatus =
            statusFilter.value;


        const selectedPriority =
            priorityFilter.value;


        const selectedProject =
            projectFilter.value;


        tasks = tasks.filter(task => {

            const matchesSearch =
                !text ||
                String(task.title || "")
                    .toLowerCase()
                    .includes(text) ||
                String(task.description || "")
                    .toLowerCase()
                    .includes(text);


            const matchesStatus =
                selectedStatus === "all" ||
                task.status === selectedStatus;


            const matchesPriority =
                selectedPriority === "all" ||
                task.priority === selectedPriority;


            const matchesProject =
                selectedProject === "all" ||
                String(task.project) ===
                String(selectedProject);


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesProject
            );

        });


        // ---------------------------------------------
        // VIDER LES COLONNES
        // ---------------------------------------------

        Object.values(columns).forEach(column => {

            if (column) {
                column.innerHTML = "";
            }

        });


        // ---------------------------------------------
        // AJOUTER LES TÂCHES DANS LES COLONNES
        // ---------------------------------------------

        tasks.forEach(task => {

            const column =
                columns[task.status];


            if (!column) {

                console.warn(
                    "Statut inconnu :",
                    task.status
                );

                return;

            }


            column.insertAdjacentHTML(
                "beforeend",
                createTaskCard(task)
            );

        });


        // ---------------------------------------------
        // STATISTIQUES
        // ---------------------------------------------

        updateStats();


        // ---------------------------------------------
        // COMPTEUR
        // ---------------------------------------------

        const taskCountText =
            document.getElementById(
                "taskCountText"
            );


        if (taskCountText) {

            taskCountText.textContent =
                `${tasks.length} tâche${tasks.length > 1 ? "s" : ""}`;

        }


        // ---------------------------------------------
        // ÉTAT VIDE
        // ---------------------------------------------

        const allTasks = getTasks();


        if (!allTasks.length) {

            emptyState.classList.remove("hidden");

        } else {

            emptyState.classList.add("hidden");

        }


        // ---------------------------------------------
        // DRAG & DROP
        // ---------------------------------------------

        activateDragAndDrop();

    }


    // =====================================================
    // CARTE TÂCHE
    // =====================================================

    function createTaskCard(task) {

        const project =
            getProjects().find(
                project =>
                    String(project.id) ===
                    String(task.project)
            );


        const member =
            getMembers().find(
                member =>
                    String(member.id) ===
                    String(task.assignedTo)
            );


        const statusData = {

            todo: [
                "À faire",
                "bg-orange-100 text-orange-700"
            ],

            "in-progress": [
                "En cours",
                "bg-blue-100 text-blue-700"
            ],

            paused: [
                "En pause",
                "bg-yellow-100 text-yellow-700"
            ],

            completed: [
                "Terminée",
                "bg-green-100 text-green-700"
            ]

        };


        const status =
            statusData[task.status] ||
            [
                "Inconnu",
                "bg-slate-100 text-slate-600"
            ];


        const priorityData = {

            low: [
                "Faible",
                "bg-slate-100 text-slate-600"
            ],

            medium: [
                "Moyenne",
                "bg-yellow-100 text-yellow-700"
            ],

            high: [
                "Haute",
                "bg-orange-100 text-orange-700"
            ],

            urgent: [
                "Urgente",
                "bg-red-100 text-red-700"
            ]

        };


        const priority =
            priorityData[task.priority] ||
            ["", ""];


        const late =
            task.deadline &&
            new Date(task.deadline) <
            new Date() &&
            task.status !== "completed";


        return `

            <div
                class="task-card bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-3 cursor-grab hover:shadow-md transition"
                draggable="true"
                data-task-id="${task.id}"
            >

                <!-- TITRE -->

                <div class="flex items-start justify-between gap-2">

                    <h3
                        class="
                            font-bold
                            text-sm
                            leading-5
                            ${
                                task.status === "completed"
                                    ? "line-through text-slate-400"
                                    : "text-slate-800"
                            }
                        "
                    >
                        ${escapeHTML(task.title)}
                    </h3>

                    <span
                        class="
                            flex-shrink-0
                            px-2
                            py-1
                            rounded-full
                            text-[10px]
                            font-semibold
                            ${priority[1]}
                        "
                    >
                        ${priority[0]}
                    </span>

                </div>


                <!-- DESCRIPTION -->

                <p
                    class="text-xs text-slate-500 mt-2 line-clamp-2"
                >
                    ${escapeHTML(
                        task.description ||
                        "Aucune description"
                    )}
                </p>


                <!-- PROJET -->

                <div class="mt-3">

                    <p class="text-[11px] text-slate-400">
                        Projet
                    </p>

                    <p class="text-xs font-semibold text-slate-700">
                        ${
                            project
                                ? escapeHTML(project.name)
                                : "Aucun projet"
                        }
                    </p>

                </div>


                <!-- MEMBRE -->

                <div class="mt-3">

                    <p class="text-[11px] text-slate-400">
                        Assigné à
                    </p>

                    <p class="text-xs font-semibold text-slate-700">
                        ${
                            member
                                ? escapeHTML(
                                    member.firstName +
                                    " " +
                                    member.lastName
                                )
                                : "Non assigné"
                        }
                    </p>

                </div>


                <!-- TAGS -->

                ${
                    task.tags?.length
                        ? `
                            <div class="flex flex-wrap gap-1 mt-3">

                                ${task.tags.map(tag => `

                                    <span
                                        class="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[10px]"
                                    >
                                        #${escapeHTML(tag)}
                                    </span>

                                `).join("")}

                            </div>
                        `
                        : ""
                }


                <!-- DEADLINE -->

                <div
                    class="
                        flex
                        justify-between
                        mt-4
                        pt-3
                        border-t
                        border-slate-100
                        text-xs
                        ${
                            late
                                ? "text-red-600"
                                : "text-slate-500"
                        }
                    "
                >

                    <span>
                        ${late ? "⚠️ En retard" : "📅 Deadline"}
                    </span>

                    <strong>
                        ${formatDate(task.deadline)}
                    </strong>

                </div>


                <!-- ACTIONS -->

                <div class="flex gap-2 mt-3">

                    ${
                        task.status === "completed"

                            ? `

                                <button
                                    onclick="reopenTask(${task.id})"
                                    class="flex-1 px-2 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100"
                                >
                                    ↩ Réouvrir
                                </button>

                            `

                            : `

                                <button
                                    onclick="completeTask(${task.id})"
                                    class="flex-1 px-2 py-2 rounded-lg bg-green-50 text-green-600 text-xs font-semibold hover:bg-green-100"
                                >
                                    ✓ Terminer
                                </button>

                            `
                    }


                    <button
                        onclick="editTask(${task.id})"
                        class="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100"
                    >
                        ✏
                    </button>


                    <button
                        onclick="deleteTask(${task.id})"
                        class="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
                    >
                        🗑
                    </button>

                </div>

            </div>

        `;

    }


    // =====================================================
    // DRAG & DROP
    // =====================================================

    function activateDragAndDrop() {

        const cards =
            document.querySelectorAll(
                ".task-card"
            );


        cards.forEach(card => {

            // -----------------------------------------
            // DRAG START
            // -----------------------------------------

            card.addEventListener(
                "dragstart",
                event => {

                    const taskId =
                        card.dataset.taskId;


                    event.dataTransfer.setData(
                        "text/plain",
                        taskId
                    );


                    event.dataTransfer.effectAllowed =
                        "move";


                    card.classList.add(
                        "opacity-50"
                    );

                }
            );


            // -----------------------------------------
            // DRAG END
            // -----------------------------------------

            card.addEventListener(
                "dragend",
                () => {

                    card.classList.remove(
                        "opacity-50"
                    );

                }
            );

        });


        // ---------------------------------------------
        // COLONNES
        // ---------------------------------------------

        Object.entries(columns).forEach(
            ([status, column]) => {

                if (!column) return;


                // DRAG OVER

                column.addEventListener(
                    "dragover",
                    event => {

                        event.preventDefault();

                        event.dataTransfer.dropEffect =
                            "move";


                        column.classList.add(
                            "bg-indigo-50"
                        );

                    }
                );


                // DRAG LEAVE

                column.addEventListener(
                    "dragleave",
                    event => {

                        if (
                            !column.contains(
                                event.relatedTarget
                            )
                        ) {

                            column.classList.remove(
                                "bg-indigo-50"
                            );

                        }

                    }
                );


                // DROP

                column.addEventListener(
                    "drop",
                    event => {

                        event.preventDefault();


                        column.classList.remove(
                            "bg-indigo-50"
                        );


                        const taskId =
                            event.dataTransfer.getData(
                                "text/plain"
                            );


                        if (!taskId) return;


                        changeTaskStatus(
                            taskId,
                            status
                        );

                    }
                );

            }
        );

    }


    // =====================================================
    // CHANGER LE STATUT
    // =====================================================

    function changeTaskStatus(
        taskId,
        newStatus
    ) {

        const tasks = getTasks();


        const task =
            tasks.find(
                task =>
                    String(task.id) ===
                    String(taskId)
            );


        if (!task) {

            console.error(
                "Tâche introuvable :",
                taskId
            );

            return;

        }


        // Si elle est déjà dans cette colonne
        if (task.status === newStatus) {

            renderTasks();

            return;

        }


        // Ancien statut
        const oldStatus =
            task.status;


        // Nouveau statut
        task.status =
            newStatus;


        // Sauvegarde localStorage
        saveTasks(tasks);


        console.log(
            `Tâche ${task.id} : ${oldStatus} → ${newStatus}`
        );


        // Actualiser le tableau
        renderTasks();


        // Statistiques recalculées
        updateStats();


        // Petit message
        showStatusMessage(
            `Tâche déplacée vers "${getStatusLabel(newStatus)}"`
        );

    }


    // =====================================================
    // LABEL STATUT
    // =====================================================

    function getStatusLabel(status) {

        const labels = {

            todo: "À faire",

            "in-progress": "En cours",

            paused: "En pause",

            completed: "Terminée"

        };


        return labels[status] || status;

    }


    // =====================================================
    // MESSAGE DE CONFIRMATION
    // =====================================================

    function showStatusMessage(message) {

        const oldMessage =
            document.getElementById(
                "dragStatusMessage"
            );


        if (oldMessage) {
            oldMessage.remove();
        }


        const div =
            document.createElement("div");


        div.id =
            "dragStatusMessage";


        div.className =
            `
                fixed
                bottom-6
                right-6
                z-[200]
                bg-slate-900
                text-white
                px-5
                py-3
                rounded-xl
                shadow-xl
                text-sm
                font-semibold
            `;


        div.textContent =
            "✓ " + message;


        document.body.appendChild(div);


        setTimeout(() => {

            div.remove();

        }, 2000);

    }


    // =====================================================
    // TERMINER
    // =====================================================

    window.completeTask = id => {

        changeTaskStatus(
            id,
            "completed"
        );

    };


    // =====================================================
    // RÉOUVRIR
    // =====================================================

    window.reopenTask = id => {

        changeTaskStatus(
            id,
            "todo"
        );

    };


    // =====================================================
    // SUPPRIMER
    // =====================================================

    window.deleteTask = id => {

        const tasks =
            getTasks();


        const task =
            tasks.find(
                task => task.id === id
            );


        if (!task) return;


        if (
            confirm(
                `Supprimer "${task.title}" ?`
            )
        ) {

            saveTasks(
                tasks.filter(
                    task => task.id !== id
                )
            );


            renderTasks();

        }

    };


    // =====================================================
    // MODIFIER
    // =====================================================

    window.editTask = id => {

        const task =
            getTasks().find(
                task => task.id === id
            );


        if (task) {

            openModal(task);

        }

    };


    // =====================================================
    // STATISTIQUES
    // =====================================================

    function updateStats() {

        const tasks =
            getTasks();


        const todo =
            tasks.filter(
                task => task.status === "todo"
            ).length;


        const progress =
            tasks.filter(
                task =>
                    task.status === "in-progress"
            ).length;


        const paused =
            tasks.filter(
                task =>
                    task.status === "paused"
            ).length;


        const completed =
            tasks.filter(
                task =>
                    task.status === "completed"
            ).length;


        // ---------------------------------------------
        // CARTES STATISTIQUES PRINCIPALES
        // ---------------------------------------------

        document.getElementById(
            "totalTasks"
        ).textContent =
            tasks.length;


        document.getElementById(
            "todoTasks"
        ).textContent =
            todo;


        document.getElementById(
            "progressTasks"
        ).textContent =
            progress;


        document.getElementById(
            "completedTasks"
        ).textContent =
            completed;


        // ---------------------------------------------
        // COMPTEURS COLONNES
        // ---------------------------------------------

        const todoCount =
            document.getElementById(
                "todoCount"
            );


        const progressCount =
            document.getElementById(
                "progressCount"
            );


        const pausedCount =
            document.getElementById(
                "pausedCount"
            );


        const completedCount =
            document.getElementById(
                "completedCount"
            );


        if (todoCount) {
            todoCount.textContent =
                todo;
        }


        if (progressCount) {
            progressCount.textContent =
                progress;
        }


        if (pausedCount) {
            pausedCount.textContent =
                paused;
        }


        if (completedCount) {
            completedCount.textContent =
                completed;
        }

    }


    // =====================================================
    // FILTRES
    // =====================================================

    if (search) {

        search.addEventListener(
            "input",
            renderTasks
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            renderTasks
        );

    }


    if (priorityFilter) {

        priorityFilter.addEventListener(
            "change",
            renderTasks
        );

    }


    if (projectFilter) {

        projectFilter.addEventListener(
            "change",
            renderTasks
        );

    }


    // =====================================================
    // DATE
    // =====================================================

    function formatDate(date) {

        if (!date) return "-";


        return new Date(date)
            .toLocaleDateString("fr-FR");

    }


    // =====================================================
    // SÉCURITÉ HTML
    // =====================================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // =====================================================
    // LANCEMENT
    // =====================================================

    loadProjects();

    loadMembers();

    renderTasks();

});