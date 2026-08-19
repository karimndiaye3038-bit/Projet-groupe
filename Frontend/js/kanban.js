// ======================================================
// TASKFLOW PRO - KANBAN
// Drag & Drop des tâches
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // API
    // ==================================================

    const API_URL = "https://taskflow-pro-u5yu.onrender.com/api/tasks";


    // ==================================================
    // COLONNES
    // ==================================================

    const columns = {
        todo: document.getElementById("todo"),
        "in-progress": document.getElementById("in_progress"),
        paused: document.getElementById("paused"),
        completed: document.getElementById("completed")
    };


    // ==================================================
    // COMPTEURS
    // ==================================================

    const counters = {
        todo: document.getElementById("count-todo"),
        "in-progress": document.getElementById("count-in_progress"),
        paused: document.getElementById("count-paused"),
        completed: document.getElementById("count-completed")
    };


    // ==================================================
    // MESSAGE
    // ==================================================

    const messageElement =
        document.getElementById("kanbanMessage");


    function showMessage(message, type = "success") {

        if (!messageElement) return;

        messageElement.className =
            "mb-6 p-4 rounded-xl";

        if (type === "success") {
            messageElement.classList.add(
                "bg-green-100",
                "text-green-700"
            );
        } else {
            messageElement.classList.add(
                "bg-red-100",
                "text-red-700"
            );
        }

        messageElement.textContent = message;

        setTimeout(() => {
            messageElement.classList.add("hidden");
        }, 3000);
    }


    // ==================================================
    // CHARGER LES TÂCHES
    // ==================================================

    async function loadTasks() {

        try {

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    `Erreur serveur : ${response.status}`
                );
            }

            const data = await response.json();

            console.log(
                "Tâches reçues :",
                data
            );

            const tasks = Array.isArray(data)
                ? data
                : data.tasks || [];

            renderKanban(tasks);

        } catch (error) {

            console.error(
                "Erreur chargement tâches :",
                error
            );

            showMessage(
                "Impossible de charger les tâches.",
                "error"
            );
        }
    }


    // ==================================================
    // AFFICHER LE KANBAN
    // ==================================================

    function renderKanban(tasks) {

        // Vider les colonnes

        Object.values(columns).forEach(column => {

            if (column) {
                column.innerHTML = "";
            }

        });


        // Réinitialiser les compteurs

        Object.values(counters).forEach(counter => {

            if (counter) {
                counter.textContent = "0";
            }

        });


        // Ajouter les tâches

        tasks.forEach(task => {

            let status = task.status;

            // Compatibilité avec différents noms

            if (status === "in_progress") {
                status = "in-progress";
            }

            if (!columns[status]) {
                status = "todo";
            }


            const card = createTaskCard(task);

            columns[status].appendChild(card);

            counters[status].textContent =
                Number(counters[status].textContent) + 1;
        });


        // Activer le drag & drop

        enableDragAndDrop();
    }


    // ==================================================
    // CRÉER UNE CARTE
    // ==================================================

    function createTaskCard(task) {

        const card = document.createElement("div");

        card.className = `
            bg-white
            rounded-xl
            p-4
            shadow-sm
            border
            border-slate-200
            cursor-grab
            hover:shadow-md
            transition
        `;

        card.draggable = true;

        // ID de la tâche

        card.dataset.taskId = task._id;


        const priorityClasses = {

            low: "bg-slate-100 text-slate-600",

            medium: "bg-yellow-100 text-yellow-700",

            high: "bg-orange-100 text-orange-700",

            urgent: "bg-red-100 text-red-700"

        };


        const priorityLabels = {

            low: "Faible",

            medium: "Moyenne",

            high: "Haute",

            urgent: "Urgente"

        };


        const priorityClass =
            priorityClasses[task.priority]
            || "bg-slate-100 text-slate-600";


        const priorityLabel =
            priorityLabels[task.priority]
            || task.priority
            || "Moyenne";


        card.innerHTML = `

            <!-- TITRE -->

            <div class="flex justify-between gap-2">

                <h3 class="
                    font-bold
                    text-slate-800
                    text-sm
                ">
                    ${escapeHTML(task.title)}
                </h3>

            </div>


            <!-- DESCRIPTION -->

            <p class="
                text-xs
                text-slate-500
                mt-2
                line-clamp-3
            ">
                ${escapeHTML(
                    task.description ||
                    "Aucune description"
                )}
            </p>


            <!-- PRIORITÉ -->

            <div class="mt-3">

                <span class="
                    inline-block
                    px-2
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    ${priorityClass}
                ">
                    ${priorityLabel}
                </span>

            </div>


            <!-- DEADLINE -->

            <div class="
                mt-3
                text-xs
                text-slate-400
            ">

                📅 ${
                    task.deadline
                        ? formatDate(task.deadline)
                        : "Pas de deadline"
                }

            </div>


            <!-- DRAG INDICATOR -->

            <div class="
                mt-3
                pt-3
                border-t
                text-xs
                text-slate-400
            ">

                ⋮⋮ Glisser pour déplacer

            </div>

        `;


        // ==================================================
        // DRAG START
        // ==================================================

        card.addEventListener(
            "dragstart",
            event => {

                event.dataTransfer.effectAllowed =
                    "move";

                event.dataTransfer.setData(
                    "text/plain",
                    task._id
                );

                card.classList.add(
                    "opacity-50",
                    "scale-95"
                );
            }
        );


        // ==================================================
        // DRAG END
        // ==================================================

        card.addEventListener(
            "dragend",
            () => {

                card.classList.remove(
                    "opacity-50",
                    "scale-95"
                );

                document
                    .querySelectorAll(".kanban-drag-over")
                    .forEach(element => {

                        element.classList.remove(
                            "kanban-drag-over"
                        );

                    });
            }
        );


        return card;
    }


    // ==================================================
    // ACTIVER DRAG & DROP
    // ==================================================

    function enableDragAndDrop() {

        Object.entries(columns).forEach(
            ([status, column]) => {

                if (!column) return;


                // Autoriser le drop

                column.addEventListener(
                    "dragover",
                    event => {

                        event.preventDefault();

                        event.dataTransfer.dropEffect =
                            "move";

                        column.classList.add(
                            "kanban-drag-over"
                        );
                    }
                );


                // Retirer le style

                column.addEventListener(
                    "dragleave",
                    event => {

                        if (
                            !column.contains(
                                event.relatedTarget
                            )
                        ) {

                            column.classList.remove(
                                "kanban-drag-over"
                            );

                        }
                    }
                );


                // DROP

                column.addEventListener(
                    "drop",
                    async event => {

                        event.preventDefault();

                        column.classList.remove(
                            "kanban-drag-over"
                        );


                        const taskId =
                            event.dataTransfer.getData(
                                "text/plain"
                            );


                        if (!taskId) {
                            return;
                        }


                        // Mettre à jour le backend

                        await updateTaskStatus(
                            taskId,
                            status
                        );

                    }
                );

            }
        );
    }


    // ==================================================
    // MODIFIER LE STATUS DANS LE BACKEND
    // ==================================================

    async function updateTaskStatus(
        taskId,
        newStatus
    ) {

        try {

            const response = await fetch(
                `${API_URL}/${taskId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Impossible de modifier la tâche."
                );

            }


            console.log(
                "Status modifié :",
                data
            );


            showMessage(
                "Tâche déplacée avec succès."
            );


            // Recharger le Kanban

            await loadTasks();

        } catch (error) {

            console.error(
                "Erreur déplacement :",
                error
            );


            showMessage(
                "Impossible de déplacer la tâche.",
                "error"
            );
        }
    }


    // ==================================================
    // DATE
    // ==================================================

    function formatDate(date) {

        if (!date) {
            return "-";
        }

        return new Date(date)
            .toLocaleDateString("fr-FR");
    }


    // ==================================================
    // PROTECTION HTML
    // ==================================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ==================================================
    // BOUTON ACTUALISER
    // ==================================================

    const refreshBtn =
        document.getElementById("refreshBtn");

    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            loadTasks
        );

    }


    // ==================================================
    // STYLE DRAG & DROP
    // ==================================================

    const style =
        document.createElement("style");

    style.textContent = `

        .kanban-drag-over {
            outline: 3px dashed #6366f1;
            outline-offset: -3px;
            background-color: #eef2ff !important;
        }

        [draggable="true"] {
            user-select: none;
        }

        [draggable="true"]:active {
            cursor: grabbing;
        }

    `;

    document.head.appendChild(style);


    // ==================================================
    // DÉMARRAGE
    // ==================================================

    loadTasks();

});