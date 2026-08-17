// =====================================================
// TASKFLOW PRO - TASKS.JS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // DONNÉES
    // ==============================

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
        { id: 1, name: "TaskFlow Pro" },
        { id: 2, name: "Site E-commerce" },
        { id: 3, name: "Application Mobile" }
    ];

    const defaultMembers = [
        { id: 1, firstName: "Fatou", lastName: "Diop", role: "Développeuse" },
        { id: 2, firstName: "Aminata", lastName: "Ndiaye", role: "Designer" },
        { id: 3, firstName: "Moussa", lastName: "Fall", role: "Chef de projet" }
    ];


    // ==============================
    // INITIALISATION
    // ==============================

    if (!localStorage.getItem("tasks")) {
        localStorage.setItem("tasks", JSON.stringify(defaultTasks));
    }

    if (!localStorage.getItem("projects")) {
        localStorage.setItem("projects", JSON.stringify(defaultProjects));
    }

    if (!localStorage.getItem("members")) {
        localStorage.setItem("members", JSON.stringify(defaultMembers));
    }


    // ==============================
    // ÉLÉMENTS HTML
    // ==============================

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


    // ==============================
    // UTILITAIRES
    // ==============================

    const getTasks = () =>
        JSON.parse(localStorage.getItem("tasks") || "[]");

    const getProjects = () =>
        JSON.parse(localStorage.getItem("projects") || "[]");

    const getMembers = () =>
        JSON.parse(localStorage.getItem("members") || "[]");

    const saveTasks = tasks =>
        localStorage.setItem("tasks", JSON.stringify(tasks));


    // ==============================
    // MODALE
    // ==============================

    function openModal(task = null) {

        form.reset();

        document.getElementById("taskId").value =
            task ? task.id : "";

        document.getElementById("modalTitle").textContent =
            task ? "Modifier la tâche" : "Nouvelle tâche";

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


    newBtn.addEventListener("click", () => openModal());
    emptyBtn.addEventListener("click", () => openModal());

    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);


    modal.addEventListener("click", e => {
        if (e.target === modal) closeModal();
    });


    // ==============================
    // PROJETS
    // ==============================

    function loadProjects(selected = "") {

        const projects = getProjects();

        document.getElementById("taskProject").innerHTML = `
            <option value="">Aucun projet</option>
            ${projects.map(p => `
                <option value="${p.id}"
                    ${String(p.id) === String(selected) ? "selected" : ""}>
                    ${escapeHTML(p.name)}
                </option>
            `).join("")}
        `;

        projectFilter.innerHTML = `
            <option value="all">Tous les projets</option>
            ${projects.map(p => `
                <option value="${p.id}">
                    ${escapeHTML(p.name)}
                </option>
            `).join("")}
        `;
    }


    // ==============================
    // MEMBRES
    // ==============================

    function loadMembers(selected = "") {

        const members = getMembers();

        document.getElementById("taskMember").innerHTML = `
            <option value="">Non assignée</option>
            ${members.map(m => `
                <option value="${m.id}"
                    ${String(m.id) === String(selected) ? "selected" : ""}>
                    ${escapeHTML(m.firstName)} ${escapeHTML(m.lastName)}
                </option>
            `).join("")}
        `;
    }


    // ==============================
    // ENREGISTRER
    // ==============================

    form.addEventListener("submit", e => {

        e.preventDefault();

        const id = document.getElementById("taskId").value;

        const task = {

            id: id ? Number(id) : Date.now(),

            title: document.getElementById("taskTitle").value.trim(),

            description:
                document.getElementById("taskDescription").value.trim(),

            status:
                document.getElementById("taskStatus").value,

            priority:
                document.getElementById("taskPriority").value,

            project:
                document.getElementById("taskProject").value,

            assignedTo:
                document.getElementById("taskMember").value,

            tags:
                document.getElementById("taskTags").value
                    .split(",")
                    .map(t => t.trim())
                    .filter(Boolean),

            deadline:
                document.getElementById("taskDeadline").value,

            createdAt:
                id
                    ? getTasks().find(t => String(t.id) === String(id))?.createdAt
                    : new Date().toISOString().split("T")[0]
        };


        if (!task.title) {
            alert("Veuillez saisir le titre de la tâche.");
            return;
        }


        if (!task.project) {
            alert("Veuillez sélectionner un projet.");
            return;
        }


        const tasks = getTasks();

        if (id) {

            const index = tasks.findIndex(
                t => String(t.id) === String(id)
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


    // ==============================
    // AFFICHAGE
    // ==============================

    function renderTasks() {

        let tasks = getTasks();

        const text = search.value.toLowerCase().trim();

        const status = statusFilter.value;
        const priority = priorityFilter.value;
        const project = projectFilter.value;


        tasks = tasks.filter(task => {

            const matchesSearch =
                !text ||
                task.title.toLowerCase().includes(text) ||
                (task.description || "").toLowerCase().includes(text);

            const matchesStatus =
                status === "all" ||
                task.status === status;

            const matchesPriority =
                priority === "all" ||
                task.priority === priority;

            const matchesProject =
                project === "all" ||
                String(task.project) === String(project);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesProject
            );
        });


        updateStats();


        if (!tasks.length) {

            container.innerHTML = "";

            emptyState.classList.remove("hidden");

            document.getElementById("taskCountText").textContent =
                "0 tâche";

            return;
        }


        emptyState.classList.add("hidden");

        document.getElementById("taskCountText").textContent =
            `${tasks.length} tâche${tasks.length > 1 ? "s" : ""}`;


        container.innerHTML = tasks.map(createTaskCard).join("");
    }


    // ==============================
    // CARTE
    // ==============================

    function createTaskCard(task) {

        const project = getProjects().find(
            p => String(p.id) === String(task.project)
        );

        const member = getMembers().find(
            m => String(m.id) === String(task.assignedTo)
        );


        const status = {
            todo: ["À faire", "bg-orange-100 text-orange-700"],
            "in-progress": ["En cours", "bg-blue-100 text-blue-700"],
            paused: ["En pause", "bg-yellow-100 text-yellow-700"],
            completed: ["Terminée", "bg-green-100 text-green-700"]
        }[task.status] || ["Inconnu", "bg-slate-100 text-slate-600"];


        const priority = {
            low: ["Low", "bg-slate-100 text-slate-600"],
            medium: ["Medium", "bg-yellow-100 text-yellow-700"],
            high: ["High", "bg-orange-100 text-orange-700"],
            urgent: ["Urgent", "bg-red-100 text-red-700"]
        }[task.priority] || ["", ""];


        const late =
            task.deadline &&
            new Date(task.deadline) < new Date() &&
            task.status !== "completed";


        return `
            <div class="p-6 border-b border-slate-200">

                <div class="flex justify-between gap-4">

                    <div>

                        <div class="flex items-center gap-2 flex-wrap">

                            <h3 class="text-lg font-bold
                                ${task.status === "completed"
                                    ? "line-through text-slate-400"
                                    : "text-slate-900"}">

                                ${escapeHTML(task.title)}

                            </h3>

                            <span class="px-3 py-1 rounded-full text-xs font-semibold ${priority[1]}">
                                ${priority[0]}
                            </span>

                        </div>

                        <p class="text-sm text-slate-500 mt-2">
                            ${escapeHTML(task.description || "Aucune description")}
                        </p>

                    </div>

                    <span class="h-fit px-3 py-1 rounded-full text-xs ${status[1]}">
                        ${status[0]}
                    </span>

                </div>


                <div class="grid md:grid-cols-2 gap-4 mt-5">

                    <div class="bg-slate-50 rounded-xl p-4">

                        <p class="text-xs text-slate-400">
                            Projet
                        </p>

                        <p class="font-semibold">
                            ${project ? escapeHTML(project.name) : "Aucun projet"}
                        </p>

                    </div>


                    <div class="bg-slate-50 rounded-xl p-4">

                        <p class="text-xs text-slate-400">
                            Assigné à
                        </p>

                        <p class="font-semibold">
                            ${member
                                ? escapeHTML(member.firstName + " " + member.lastName)
                                : "Non assigné"}
                        </p>

                    </div>

                </div>


                ${task.tags?.length ? `
                    <div class="flex flex-wrap gap-2 mt-4">
                        ${task.tags.map(tag => `
                            <span class="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs">
                                #${escapeHTML(tag)}
                            </span>
                        `).join("")}
                    </div>
                ` : ""}


                <div class="flex justify-between mt-5 text-sm
                    ${late ? "text-red-600" : "text-slate-500"}">

                    <span>
                        ${late ? "⚠️ En retard" : "📅 Deadline"}
                    </span>

                    <strong>
                        ${formatDate(task.deadline)}
                    </strong>

                </div>


                <div class="flex flex-wrap gap-2 mt-5 pt-5 border-t">

                    ${
                        task.status === "completed"
                        ? `
                            <button onclick="reopenTask(${task.id})"
                                class="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm">
                                ↩ Réouvrir
                            </button>
                        `
                        : `
                            <button onclick="completeTask(${task.id})"
                                class="px-3 py-2 rounded-lg bg-green-50 text-green-600 text-sm">
                                ✓ Terminer
                            </button>
                        `
                    }

                    <button onclick="editTask(${task.id})"
                        class="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm">
                        ✏ Modifier
                    </button>

                    <button onclick="deleteTask(${task.id})"
                        class="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm">
                        🗑 Supprimer
                    </button>

                </div>

            </div>
        `;
    }


    // ==============================
    // ACTIONS
    // ==============================

    window.completeTask = id => {

        const tasks = getTasks();

        const task = tasks.find(t => t.id === id);

        if (task) {
            task.status = "completed";
            saveTasks(tasks);
            renderTasks();
        }
    };


    window.reopenTask = id => {

        const tasks = getTasks();

        const task = tasks.find(t => t.id === id);

        if (task) {
            task.status = "todo";
            saveTasks(tasks);
            renderTasks();
        }
    };


    window.deleteTask = id => {

        const tasks = getTasks();

        const task = tasks.find(t => t.id === id);

        if (!task) return;

        if (confirm(`Supprimer "${task.title}" ?`)) {

            saveTasks(
                tasks.filter(t => t.id !== id)
            );

            renderTasks();
        }
    };


    window.editTask = id => {

        const task = getTasks().find(t => t.id === id);

        if (task) {
            openModal(task);
        }
    };


    // ==============================
    // STATISTIQUES
    // ==============================

    function updateStats() {

        const tasks = getTasks();

        document.getElementById("totalTasks").textContent =
            tasks.length;

        document.getElementById("todoTasks").textContent =
            tasks.filter(t => t.status === "todo").length;

        document.getElementById("progressTasks").textContent =
            tasks.filter(t => t.status === "in-progress").length;

        document.getElementById("completedTasks").textContent =
            tasks.filter(t => t.status === "completed").length;
    }


    // ==============================
    // FILTRES
    // ==============================

    search.addEventListener("input", renderTasks);

    statusFilter.addEventListener("change", renderTasks);

    priorityFilter.addEventListener("change", renderTasks);

    projectFilter.addEventListener("change", renderTasks);


    // ==============================
    // UTILITAIRES
    // ==============================

    function formatDate(date) {

        if (!date) return "-";

        return new Date(date).toLocaleDateString("fr-FR");
    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ==============================
    // LANCEMENT
    // ==============================

    loadProjects();

    loadMembers();

    renderTasks();

});