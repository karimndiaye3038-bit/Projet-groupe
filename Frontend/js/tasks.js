// =====================================================
// TASKFLOW PRO - TASKS.JS
// Connexion Frontend <-> Backend <-> MongoDB
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // API
    // =====================================================

    const API_URL =
        "https://taskflow-pro-u5yu.onrender.com/api/tasks";

    // =====================================================
    // ÉLÉMENTS HTML
    // =====================================================

    const modal = document.getElementById("taskModal");
    const form = document.getElementById("taskForm");
    const container = document.getElementById("tasksContainer");

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
    // DONNÉES
    // =====================================================

    let tasks = [];
    let projects = [];
    let members = [];

    // =====================================================
    // CHARGER LES TÂCHES
    // =====================================================

    async function loadTasks() {

        try {

            container.innerHTML = `
                <div class="p-8 text-center text-slate-500">
                    Chargement des tâches...
                </div>
            `;

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    `Erreur serveur : ${response.status}`
                );
            }

            const data = await response.json();

            console.log("Réponse tâches :", data);

            tasks = Array.isArray(data)
                ? data
                : data.tasks || [];

            renderTasks();

        } catch (error) {

            console.error(
                "Erreur lors du chargement des tâches :",
                error
            );

            container.innerHTML = `
                <div class="p-8 text-center">
                    <p class="text-red-500 font-semibold">
                        Impossible de charger les tâches.
                    </p>

                    <p class="text-sm text-slate-500 mt-2">
                        Vérifiez que le serveur backend fonctionne.
                    </p>
                </div>
            `;
        }
    }

    // =====================================================
    // CHARGER LES PROJETS
    // =====================================================

    async function loadProjects(selected = "") {

        try {

            const response = await fetch(
                "https://taskflow-pro-u5yu.onrender.com/api/projects"
            );

            if (!response.ok) {
                throw new Error(
                    `Erreur projets : ${response.status}`
                );
            }

            const data = await response.json();

            projects = Array.isArray(data)
                ? data
                : data.projects || [];

            const projectSelect =
                document.getElementById("taskProject");

            if (projectSelect) {

                projectSelect.innerHTML = `
                    <option value="">
                        Sélectionner un projet
                    </option>

                    ${projects.map(project => `
                        <option
                            value="${escapeHTML(
                                project._id || project.id
                            )}"
                            ${
                                String(project._id || project.id)
                                === String(selected)
                                    ? "selected"
                                    : ""
                            }
                        >
                            ${escapeHTML(
                                project.name ||
                                project.title ||
                                "Projet sans nom"
                            )}
                        </option>
                    `).join("")}
                `;
            }

            if (projectFilter) {

                projectFilter.innerHTML = `
                    <option value="all">
                        Tous les projets
                    </option>

                    ${projects.map(project => `
                        <option
                            value="${escapeHTML(
                                project._id || project.id
                            )}"
                        >
                            ${escapeHTML(
                                project.name ||
                                project.title ||
                                "Projet sans nom"
                            )}
                        </option>
                    `).join("")}
                `;
            }

        } catch (error) {

            console.error(
                "Erreur chargement projets :",
                error
            );

        }
    }

    // =====================================================
    // CHARGER LES MEMBRES
    // =====================================================

    async function loadMembers(selected = "") {

        try {

            const response = await fetch(
                "https://taskflow-pro-u5yu.onrender.com/api/members"
            );

            if (!response.ok) {
                throw new Error(
                    `Erreur membres : ${response.status}`
                );
            }

            const data = await response.json();

            members = Array.isArray(data)
                ? data
                : data.members || [];

            const memberSelect =
                document.getElementById("taskMember");

            if (!memberSelect) {
                return;
            }

            memberSelect.innerHTML = `
                <option value="">
                    Sélectionner un membre
                </option>

                ${members.map(member => `
                    <option
                        value="${escapeHTML(
                            member._id || member.id
                        )}"
                        ${
                            String(member._id || member.id)
                            === String(selected)
                                ? "selected"
                                : ""
                        }
                    >
                        ${escapeHTML(
                            `${member.firstName || ""} ${member.lastName || ""}`.trim()
                        )}
                    </option>
                `).join("")}
            `;

        } catch (error) {

            console.error(
                "Erreur chargement membres :",
                error
            );

        }
    }

    // =====================================================
    // OUVRIR MODALE
    // =====================================================

    async function openModal(task = null) {

        if (!form || !modal) {
            return;
        }

        form.reset();

        const taskId =
            document.getElementById("taskId");

        const modalTitle =
            document.getElementById("modalTitle");

        const taskStatus =
            document.getElementById("taskStatus");

        const taskPriority =
            document.getElementById("taskPriority");

        const taskTitle =
            document.getElementById("taskTitle");

        const taskDescription =
            document.getElementById("taskDescription");

        const taskTags =
            document.getElementById("taskTags");

        const taskDeadline =
            document.getElementById("taskDeadline");

        if (taskId) {
            taskId.value =
                task ? task._id : "";
        }

        if (modalTitle) {
            modalTitle.textContent =
                task
                    ? "Modifier la tâche"
                    : "Nouvelle tâche";
        }

        if (taskStatus) {
            taskStatus.value =
                task?.status || "todo";
        }

        if (taskPriority) {
            taskPriority.value =
                task?.priority || "medium";
        }

        if (task) {

            if (taskTitle) {
                taskTitle.value =
                    task.title || "";
            }

            if (taskDescription) {
                taskDescription.value =
                    task.description || "";
            }

            if (taskTags) {
                taskTags.value =
                    (task.tags || []).join(", ");
            }

            if (taskDeadline) {

                taskDeadline.value =
                    task.deadline
                        ? formatDateForInput(task.deadline)
                        : "";
            }

        }

        await loadProjects(
            task?.project || ""
        );

        await loadMembers(
            task?.assignedMember || ""
        );

        modal.classList.remove("hidden");
    }

    // =====================================================
    // FERMER MODALE
    // =====================================================

    function closeModal() {

        if (!modal || !form) {
            return;
        }

        modal.classList.add("hidden");

        form.reset();

        const taskId =
            document.getElementById("taskId");

        const modalTitle =
            document.getElementById("modalTitle");

        if (taskId) {
            taskId.value = "";
        }

        if (modalTitle) {
            modalTitle.textContent =
                "Nouvelle tâche";
        }
    }

    // =====================================================
    // BOUTONS MODALE
    // =====================================================

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
    // CRÉER / MODIFIER UNE TÂCHE
    // =====================================================

    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const id =
                    document.getElementById("taskId")?.value;

                const title =
                    document.getElementById("taskTitle")?.value
                        .trim();

                const description =
                    document.getElementById("taskDescription")?.value
                        .trim();

                const status =
                    document.getElementById("taskStatus")?.value;

                const priority =
                    document.getElementById("taskPriority")?.value;

                const project =
                    document.getElementById("taskProject")?.value;

                const assignedMember =
                    document.getElementById("taskMember")?.value;

                const tags =
                    document.getElementById("taskTags")?.value
                        .split(",")
                        .map(tag => tag.trim())
                        .filter(Boolean);

                const deadline =
                    document.getElementById("taskDeadline")?.value;

                // ==============================
                // VALIDATION
                // ==============================

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

                if (!assignedMember) {
                    alert(
                        "Veuillez sélectionner un membre."
                    );
                    return;
                }

                if (!deadline) {
                    alert(
                        "Veuillez sélectionner une deadline."
                    );
                    return;
                }

                // ==============================
                // DONNÉES POUR MONGODB
                // ==============================

                const taskData = {

                    title,

                    description,

                    status:
                        status || "todo",

                    priority:
                        priority || "medium",

                    project,

                    assignedMember,

                    tags,

                    deadline

                };

                try {

                    const url = id
                        ? `${API_URL}/${id}`
                        : API_URL;

                    const method = id
                        ? "PUT"
                        : "POST";

                    console.log(
                        "Envoi tâche :",
                        taskData
                    );

                    const response =
                        await fetch(
                            url,
                            {
                                method,

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(taskData)
                            }
                        );

                    const data =
                        await response.json();

                    console.log(
                        "Réponse backend :",
                        data
                    );

                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Erreur lors de l'enregistrement de la tâche."
                        );
                    }

                    closeModal();

                    await loadTasks();

                    alert(
                        id
                            ? "Tâche modifiée avec succès !"
                            : "Tâche créée avec succès !"
                    );

                } catch (error) {

                    console.error(
                        "Erreur enregistrement tâche :",
                        error
                    );

                    alert(
                        error.message ||
                        "Impossible de communiquer avec le serveur."
                    );
                }

            }
        );
    }

    // =====================================================
    // AFFICHER LES TÂCHES
    // =====================================================

    function renderTasks() {

        if (!container) {
            return;
        }

        let filteredTasks =
            [...tasks];

        const text =
            search?.value
                .toLowerCase()
                .trim() || "";

        const status =
            statusFilter?.value || "all";

        const priority =
            priorityFilter?.value || "all";

        const project =
            projectFilter?.value || "all";

        filteredTasks =
            filteredTasks.filter(task => {

                const matchesSearch =
                    !text ||
                    (task.title || "")
                        .toLowerCase()
                        .includes(text) ||
                    (task.description || "")
                        .toLowerCase()
                        .includes(text);

                const matchesStatus =
                    status === "all" ||
                    task.status === status;

                const matchesPriority =
                    priority === "all" ||
                    task.priority === priority;

                const matchesProject =
                    project === "all" ||
                    String(task.project) ===
                    String(project);

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority &&
                    matchesProject
                );
            });

        updateStats();

        if (!filteredTasks.length) {

            container.innerHTML = "";

            if (emptyState) {
                emptyState.classList.remove("hidden");
            }

            const count =
                document.getElementById(
                    "taskCountText"
                );

            if (count) {
                count.textContent =
                    "0 tâche";
            }

            return;
        }

        if (emptyState) {
            emptyState.classList.add("hidden");
        }

        const count =
            document.getElementById(
                "taskCountText"
            );

        if (count) {

            count.textContent =
                `${filteredTasks.length} tâche${
                    filteredTasks.length > 1
                        ? "s"
                        : ""
                }`;
        }

        container.innerHTML =
            filteredTasks
                .map(createTaskCard)
                .join("");
    }

    // =====================================================
    // CARTE TÂCHE
    // =====================================================

    function createTaskCard(task) {

        const project =
            projects.find(
                project =>
                    String(
                        project._id ||
                        project.id
                    ) ===
                    String(task.project)
            );

        const member =
            members.find(
                member =>
                    String(
                        member._id ||
                        member.id
                    ) ===
                    String(
                        task.assignedMember
                    )
            );

        const statusMap = {

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

        const priorityMap = {

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

        const status =
            statusMap[task.status] ||
            [
                "Inconnu",
                "bg-slate-100 text-slate-600"
            ];

        const priority =
            priorityMap[task.priority] ||
            [
                "",
                ""
            ];

        const late =
            task.deadline &&
            new Date(task.deadline) <
            new Date() &&
            task.status !== "completed";

        const memberName =
            member
                ? `${member.firstName || ""} ${
                    member.lastName || ""
                }`.trim()
                : "Non assigné";

        const projectName =
            project
                ? project.name ||
                  project.title ||
                  "Projet"
                : "Aucun projet";

        return `

            <div
                class="p-6 border-b border-slate-200 bg-white"
            >

                <div
                    class="flex justify-between gap-4"
                >

                    <div>

                        <div
                            class="flex items-center gap-2 flex-wrap"
                        >

                            <h3
                                class="
                                    text-lg
                                    font-bold
                                    ${
                                        task.status ===
                                        "completed"
                                            ? "line-through text-slate-400"
                                            : "text-slate-900"
                                    }
                                "
                            >
                                ${escapeHTML(task.title)}
                            </h3>

                            <span
                                class="
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs
                                    font-semibold
                                    ${priority[1]}
                                "
                            >
                                ${priority[0]}
                            </span>

                        </div>

                        <p
                            class="
                                text-sm
                                text-slate-500
                                mt-2
                            "
                        >
                            ${
                                escapeHTML(
                                    task.description ||
                                    "Aucune description"
                                )
                            }
                        </p>

                    </div>

                    <span
                        class="
                            h-fit
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            ${status[1]}
                        "
                    >
                        ${status[0]}
                    </span>

                </div>

                <div
                    class="
                        grid
                        md:grid-cols-2
                        gap-4
                        mt-5
                    "
                >

                    <div
                        class="
                            bg-slate-50
                            rounded-xl
                            p-4
                        "
                    >

                        <p
                            class="
                                text-xs
                                text-slate-400
                            "
                        >
                            Projet
                        </p>

                        <p class="font-semibold">
                            ${escapeHTML(projectName)}
                        </p>

                    </div>

                    <div
                        class="
                            bg-slate-50
                            rounded-xl
                            p-4
                        "
                    >

                        <p
                            class="
                                text-xs
                                text-slate-400
                            "
                        >
                            Assigné à
                        </p>

                        <p class="font-semibold">
                            ${escapeHTML(memberName)}
                        </p>

                    </div>

                </div>

                ${
                    task.tags &&
                    task.tags.length
                        ? `
                            <div
                                class="
                                    flex
                                    flex-wrap
                                    gap-2
                                    mt-4
                                "
                            >

                                ${task.tags
                                    .map(
                                        tag => `
                                            <span
                                                class="
                                                    px-2
                                                    py-1
                                                    bg-indigo-50
                                                    text-indigo-600
                                                    rounded-lg
                                                    text-xs
                                                "
                                            >
                                                #${escapeHTML(tag)}
                                            </span>
                                        `
                                    )
                                    .join("")}

                            </div>
                        `
                        : ""
                }

                <div
                    class="
                        flex
                        justify-between
                        mt-5
                        text-sm
                        ${
                            late
                                ? "text-red-600"
                                : "text-slate-500"
                        }
                    "
                >

                    <span>
                        ${
                            late
                                ? "⚠️ En retard"
                                : "📅 Deadline"
                        }
                    </span>

                    <strong>
                        ${formatDate(task.deadline)}
                    </strong>

                </div>

                <div
                    class="
                        flex
                        flex-wrap
                        gap-2
                        mt-5
                        pt-5
                        border-t
                    "
                >

                    ${
                        task.status ===
                        "completed"

                            ? `
                                <button
                                    onclick="reopenTask('${task._id}')"
                                    class="
                                        px-3
                                        py-2
                                        rounded-lg
                                        bg-blue-50
                                        text-blue-600
                                        text-sm
                                    "
                                >
                                    ↩ Réouvrir
                                </button>
                            `

                            : `
                                <button
                                    onclick="completeTask('${task._id}')"
                                    class="
                                        px-3
                                        py-2
                                        rounded-lg
                                        bg-green-50
                                        text-green-600
                                        text-sm
                                    "
                                >
                                    ✓ Terminer
                                </button>
                            `
                    }

                    <button
                        onclick="editTask('${task._id}')"
                        class="
                            px-3
                            py-2
                            rounded-lg
                            bg-indigo-50
                            text-indigo-600
                            text-sm
                        "
                    >
                        ✏ Modifier
                    </button>

                    <button
                        onclick="deleteTask('${task._id}')"
                        class="
                            px-3
                            py-2
                            rounded-lg
                            bg-red-50
                            text-red-600
                            text-sm
                        "
                    >
                        🗑 Supprimer
                    </button>

                </div>

            </div>
        `;
    }

    // =====================================================
    // TERMINER UNE TÂCHE
    // =====================================================

    window.completeTask =
        async function (id) {

            try {

                const response =
                    await fetch(
                        `${API_URL}/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    status:
                                        "completed"
                                })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Impossible de terminer la tâche."
                    );
                }

                await loadTasks();

            } catch (error) {

                console.error(error);

                alert(
                    error.message
                );
            }
        };

    // =====================================================
    // RÉOUVRIR UNE TÂCHE
    // =====================================================

    window.reopenTask =
        async function (id) {

            try {

                const response =
                    await fetch(
                        `${API_URL}/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    status: "todo"
                                })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Impossible de réouvrir la tâche."
                    );
                }

                await loadTasks();

            } catch (error) {

                console.error(error);

                alert(
                    error.message
                );
            }
        };

    // =====================================================
    // SUPPRIMER
    // =====================================================

    window.deleteTask =
        async function (id) {

            const task =
                tasks.find(
                    task =>
                        String(task._id) ===
                        String(id)
                );

            if (!task) {
                return;
            }

            if (
                !confirm(
                    `Supprimer "${task.title}" ?`
                )
            ) {
                return;
            }

            try {

                const response =
                    await fetch(
                        `${API_URL}/${id}`,
                        {
                            method: "DELETE"
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Impossible de supprimer la tâche."
                    );
                }

                await loadTasks();

            } catch (error) {

                console.error(error);

                alert(
                    error.message
                );
            }
        };

    // =====================================================
    // MODIFIER
    // =====================================================

    window.editTask =
        function (id) {

            const task =
                tasks.find(
                    task =>
                        String(task._id) ===
                        String(id)
                );

            if (task) {
                openModal(task);
            }
        };

    // =====================================================
    // STATISTIQUES
    // =====================================================

    function updateStats() {

        const total =
            document.getElementById(
                "totalTasks"
            );

        const todo =
            document.getElementById(
                "todoTasks"
            );

        const progress =
            document.getElementById(
                "progressTasks"
            );

        const completed =
            document.getElementById(
                "completedTasks"
            );

        if (total) {
            total.textContent =
                tasks.length;
        }

        if (todo) {

            todo.textContent =
                tasks.filter(
                    task =>
                        task.status ===
                        "todo"
                ).length;
        }

        if (progress) {

            progress.textContent =
                tasks.filter(
                    task =>
                        task.status ===
                        "in-progress"
                ).length;
        }

        if (completed) {

            completed.textContent =
                tasks.filter(
                    task =>
                        task.status ===
                        "completed"
                ).length;
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
    // UTILITAIRES
    // =====================================================

    function formatDate(date) {

        if (!date) {
            return "-";
        }

        return new Date(date)
            .toLocaleDateString("fr-FR");
    }

    function formatDateForInput(date) {

        if (!date) {
            return "";
        }

        const d =
            new Date(date);

        if (Number.isNaN(d.getTime())) {
            return "";
        }

        return d
            .toISOString()
            .split("T")[0];
    }

    function escapeHTML(value) {

        return String(value ?? "")
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

    // =====================================================
    // INITIALISATION
    // =====================================================

    async function init() {

        await Promise.all([
            loadProjects(),
            loadMembers(),
            loadTasks()
        ]);

    }

    init();

});