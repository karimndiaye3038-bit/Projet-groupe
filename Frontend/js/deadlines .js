// ============================================================
// TASKFLOW PRO
// GESTION DES DEADLINES
// ============================================================


// ============================================================
// DONNÉES
// ============================================================

let deadlines =
    JSON.parse(localStorage.getItem("deadlines")) || [];


// ============================================================
// ÉLÉMENTS HTML
// ============================================================

const modal =
    document.getElementById("deadlineModal");

const openBtn =
    document.getElementById("addDeadlineBtn");

const closeBtn =
    document.getElementById("closeDeadlineModal");

const cancelBtn =
    document.getElementById("cancelDeadlineBtn");

const form =
    document.getElementById("deadlineForm");

const container =
    document.getElementById("deadlinesContainer");


// ============================================================
// OUVRIR MODAL
// ============================================================

openBtn.addEventListener("click", function () {

    modal.classList.remove("hidden");

    modal.classList.add("flex");

});


// ============================================================
// FERMER MODAL
// ============================================================

function closeModal() {

    modal.classList.add("hidden");

    modal.classList.remove("flex");

    form.reset();

}


closeBtn.addEventListener(
    "click",
    closeModal
);


cancelBtn.addEventListener(
    "click",
    closeModal
);


// Fermer en cliquant à l'extérieur

modal.addEventListener(
    "click",
    function (event) {

        if (event.target === modal) {

            closeModal();

        }

    }
);


// ============================================================
// SAUVEGARDER
// ============================================================

function saveDeadlines() {

    localStorage.setItem(
        "deadlines",
        JSON.stringify(deadlines)
    );

}


// ============================================================
// DATE DU JOUR
// ============================================================

function getToday() {

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    return today;

}


// ============================================================
// CALCULER LE NOMBRE DE JOURS
// ============================================================

function getDaysRemaining(date) {

    const today =
        getToday();

    const deadline =
        new Date(
            date + "T00:00:00"
        );

    const difference =
        deadline.getTime() -
        today.getTime();

    return Math.round(
        difference /
        (1000 * 60 * 60 * 24)
    );

}


// ============================================================
// ANALYSER LA DEADLINE
// ============================================================

function analyzeDeadline(deadline) {

    // -------------------------
    // TERMINÉE
    // -------------------------

    if (
        deadline.status === "completed"
        ||
        deadline.completed === true
    ) {

        return {

            type: "completed",

            icon: "✅",

            label: "Terminée",

            badge:
                "bg-indigo-100 text-indigo-700"

        };

    }


    const days =
        getDaysRemaining(
            deadline.date
        );


    // -------------------------
    // EN RETARD
    // -------------------------

    if (days < 0) {

        const retard =
            Math.abs(days);

        return {

            type: "late",

            icon: "🔴",

            label:
                `En retard de ${retard} jour${retard > 1 ? "s" : ""}`,

            badge:
                "bg-red-100 text-red-700"

        };

    }


    // -------------------------
    // AUJOURD'HUI
    // -------------------------

    if (days === 0) {

        return {

            type: "today",

            icon: "🔴",

            label:
                "Échéance aujourd'hui",

            badge:
                "bg-red-100 text-red-700"

        };

    }


    // -------------------------
    // ÉCHÉANCE PROCHE
    // -------------------------

    if (days <= 3) {

        return {

            type: "soon",

            icon: "🟠",

            label:
                `Échéance dans ${days} jour${days > 1 ? "s" : ""}`,

            badge:
                "bg-orange-100 text-orange-700"

        };

    }


    // -------------------------
    // EN AVANCE
    // -------------------------

    return {

        type: "advance",

        icon: "🟢",

        label:
            `Échéance dans ${days} jours`,

        badge:
            "bg-green-100 text-green-700"

    };

}


// ============================================================
// FORMATTER DATE
// ============================================================

function formatDate(date) {

    if (!date) {

        return "Date inconnue";

    }


    const formatted =
        new Date(
            date + "T00:00:00"
        );


    return formatted.toLocaleDateString(
        "fr-FR",
        {

            day: "2-digit",

            month: "long",

            year: "numeric"

        }
    );

}


// ============================================================
// PRIORITÉ
// ============================================================

function getPriorityLabel(priority) {

    switch (priority) {

        case "low":
            return "Faible";

        case "medium":
            return "Moyenne";

        case "high":
            return "Haute";

        case "urgent":
            return "Urgente";

        default:
            return "Moyenne";

    }

}


// ============================================================
// COULEUR PRIORITÉ
// ============================================================

function getPriorityClass(priority) {

    switch (priority) {

        case "urgent":

            return "bg-red-100 text-red-700";

        case "high":

            return "bg-orange-100 text-orange-700";

        case "medium":

            return "bg-yellow-100 text-yellow-700";

        case "low":

            return "bg-green-100 text-green-700";

        default:

            return "bg-slate-100 text-slate-700";

    }

}


// ============================================================
// STATUT
// ============================================================

function getStatusLabel(status) {

    switch (status) {

        case "todo":
            return "À faire";

        case "in-progress":
            return "En cours";

        case "completed":
            return "Terminée";

        default:
            return "À faire";

    }

}


// ============================================================
// AFFICHER LES DEADLINES
// ============================================================

function renderDeadlines(
    list = deadlines
) {

    container.innerHTML = "";


    // -------------------------
    // AUCUNE DEADLINE
    // -------------------------

    if (list.length === 0) {

        container.innerHTML = `

            <div
                class="col-span-full
                       bg-white
                       border border-slate-200
                       rounded-2xl
                       p-10
                       text-center"
            >

                <div class="text-5xl mb-4">
                    📅
                </div>

                <h3
                    class="text-xl
                           font-bold
                           text-slate-700"
                >
                    Aucune deadline
                </h3>

                <p
                    class="text-slate-400
                           mt-2"
                >
                    Ajoutez une deadline
                    pour commencer.
                </p>

            </div>

        `;

        return;

    }


    // -------------------------
    // AFFICHAGE
    // -------------------------

    list.forEach(
        function (deadline) {

            const analysis =
                analyzeDeadline(
                    deadline
                );


            const priority =
                getPriorityLabel(
                    deadline.priority
                );


            const priorityClass =
                getPriorityClass(
                    deadline.priority
                );


            const status =
                getStatusLabel(
                    deadline.status
                );


            container.innerHTML += `

                <div
                    class="bg-white
                           border
                           border-slate-200
                           rounded-2xl
                           shadow-sm
                           overflow-hidden
                           hover:shadow-md
                           transition"
                >

                    <!-- CONTENU -->

                    <div class="p-5">

                        <!-- TITRE -->

                        <div
                            class="flex
                                   justify-between
                                   items-start
                                   gap-4"
                        >

                            <div>

                                <h3
                                    class="text-lg
                                           font-bold
                                           text-slate-800"
                                >
                                    ${escapeHTML(
                                        deadline.title
                                    )}
                                </h3>

                                <p
                                    class="text-sm
                                           text-slate-400
                                           mt-1"
                                >
                                    📅
                                    ${formatDate(
                                        deadline.date
                                    )}
                                </p>

                            </div>


                            <div class="text-2xl">

                                ${analysis.icon}

                            </div>

                        </div>


                        <!-- DESCRIPTION -->

                        ${
                            deadline.description
                            ?
                            `
                            <p
                                class="text-sm
                                       text-slate-500
                                       mt-4"
                            >
                                ${escapeHTML(
                                    deadline.description
                                )}
                            </p>
                            `
                            :
                            ""
                        }


                        <!-- STATUT DEADLINE -->

                        <div
                            class="mt-4
                                   rounded-xl
                                   p-3
                                   ${analysis.badge}"
                        >

                            <p
                                class="font-semibold"
                            >

                                ${analysis.label}

                            </p>

                        </div>


                        <!-- INFORMATIONS -->

                        <div
                            class="flex
                                   flex-wrap
                                   gap-2
                                   mt-4"
                        >

                            <span
                                class="px-3 py-1
                                       rounded-full
                                       text-xs
                                       font-semibold
                                       ${priorityClass}"
                            >

                                Priorité :
                                ${priority}

                            </span>


                            <span
                                class="px-3 py-1
                                       rounded-full
                                       text-xs
                                       font-semibold
                                       bg-slate-100
                                       text-slate-600"
                            >

                                ${status}

                            </span>

                        </div>

                    </div>


                    <!-- ACTIONS -->

                    <div
                        class="border-t
                               bg-slate-50
                               px-5 py-3
                               flex
                               justify-between
                               items-center"
                    >

                        <button
                            onclick="
                                toggleCompleted(
                                    ${deadline.id}
                                )
                            "
                            class="text-sm
                                   font-semibold
                                   text-green-600
                                   hover:text-green-800"
                        >

                            ${
                                deadline.status === "completed"
                                ?
                                "↩ Réouvrir"
                                :
                                "✓ Terminer"
                            }

                        </button>


                        <div class="flex gap-3">

                            <button
                                onclick="
                                    editDeadline(
                                        ${deadline.id}
                                    )
                                "
                                class="text-sm
                                       font-semibold
                                       text-indigo-600
                                       hover:text-indigo-800"
                            >

                                Modifier

                            </button>


                            <button
                                onclick="
                                    deleteDeadline(
                                        ${deadline.id}
                                    )
                                "
                                class="text-sm
                                       font-semibold
                                       text-red-600
                                       hover:text-red-800"
                            >

                                Supprimer

                            </button>

                        </div>

                    </div>

                </div>

            `;

        }
    );

}


// ============================================================
// ÉCHAPPER HTML
// ============================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text || "";

    return div.innerHTML;

}


// ============================================================
// AJOUTER DEADLINE
// ============================================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            document
                .getElementById(
                    "deadlineTitle"
                )
                .value
                .trim();


        const description =
            document
                .getElementById(
                    "deadlineDescription"
                )
                .value
                .trim();


        const date =
            document
                .getElementById(
                    "deadlineDate"
                )
                .value;


        const priority =
            document
                .getElementById(
                    "deadlinePriority"
                )
                .value;


        const status =
            document
                .getElementById(
                    "deadlineStatus"
                )
                .value;


        // Vérification

        if (!title) {

            alert(
                "Veuillez saisir le nom de la tâche."
            );

            return;

        }


        if (!date) {

            alert(
                "Veuillez sélectionner une date."
            );

            return;

        }


        // -------------------------
        // NOUVELLE DEADLINE
        // -------------------------

        const newDeadline = {

            id: Date.now(),

            title: title,

            description: description,

            date: date,

            priority: priority,

            status: status,

            completed:
                status === "completed",

            createdAt:
                new Date().toISOString()

        };


        deadlines.push(
            newDeadline
        );


        saveDeadlines();


        renderAll();


        closeModal();

    }
);


// ============================================================
// SUPPRIMER
// ============================================================

function deleteDeadline(id) {

    const confirmation =
        confirm(
            "Voulez-vous vraiment supprimer cette deadline ?"
        );


    if (!confirmation) {

        return;

    }


    deadlines =
        deadlines.filter(
            deadline =>
                deadline.id !== id
        );


    saveDeadlines();


    renderAll();

}


// ============================================================
// TERMINER / RÉOUVRIR
// ============================================================

function toggleCompleted(id) {

    const deadline =
        deadlines.find(
            item =>
                item.id === id
        );


    if (!deadline) {

        return;

    }


    if (
        deadline.status === "completed"
    ) {

        deadline.status =
            "todo";

        deadline.completed =
            false;

    }
    else {

        deadline.status =
            "completed";

        deadline.completed =
            true;

    }


    saveDeadlines();


    renderAll();

}


// ============================================================
// MODIFIER
// ============================================================

function editDeadline(id) {

    const deadline =
        deadlines.find(
            item =>
                item.id === id
        );


    if (!deadline) {

        return;

    }


    document.getElementById(
        "deadlineTitle"
    ).value =
        deadline.title;


    document.getElementById(
        "deadlineDescription"
    ).value =
        deadline.description || "";


    document.getElementById(
        "deadlineDate"
    ).value =
        deadline.date;


    document.getElementById(
        "deadlinePriority"
    ).value =
        deadline.priority;


    document.getElementById(
        "deadlineStatus"
    ).value =
        deadline.status;


    modal.classList.remove(
        "hidden"
    );

    modal.classList.add(
        "flex"
    );


    // On retire temporairement
    // la deadline originale

    deadlines =
        deadlines.filter(
            item =>
                item.id !== id
        );


    saveDeadlines();

}


// ============================================================
// FILTRAGE
// ============================================================

document
    .querySelectorAll(".filter-btn")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const filter =
                        this.dataset.filter;


                    let filtered =
                        deadlines;


                    if (
                        filter !== "all"
                    ) {

                        filtered =
                            deadlines.filter(
                                function (deadline) {

                                    return (
                                        analyzeDeadline(
                                            deadline
                                        ).type
                                        ===
                                        filter
                                    );

                                }
                            );

                    }


                    // Bouton actif

                    document
                        .querySelectorAll(
                            ".filter-btn"
                        )
                        .forEach(
                            btn => {

                                btn.classList.remove(
                                    "bg-indigo-600",
                                    "text-white"
                                );

                                btn.classList.add(
                                    "bg-slate-100"
                                );

                            }
                        );


                    this.classList.remove(
                        "bg-slate-100"
                    );

                    this.classList.add(
                        "bg-indigo-600",
                        "text-white"
                    );


                    renderDeadlines(
                        filtered
                    );

                }
            );

        }
    );


// ============================================================
// STATISTIQUES
// ============================================================

function updateStatistics() {

    let late = 0;

    let soon = 0;

    let advance = 0;

    let completed = 0;


    deadlines.forEach(
        function (deadline) {

            const type =
                analyzeDeadline(
                    deadline
                ).type;


            if (
                type === "late"
            ) {

                late++;

            }


            if (
                type === "today"
                ||
                type === "soon"
            ) {

                soon++;

            }


            if (
                type === "advance"
            ) {

                advance++;

            }


            if (
                type === "completed"
            ) {

                completed++;

            }

        }
    );


    document.getElementById(
        "lateCount"
    ).textContent =
        late;


    document.getElementById(
        "soonCount"
    ).textContent =
        soon;


    document.getElementById(
        "advanceCount"
    ).textContent =
        advance;


    document.getElementById(
        "completedCount"
    ).textContent =
        completed;

}


// ============================================================
// RENDU GLOBAL
// ============================================================

function renderAll() {

    renderDeadlines();

    updateStatistics();

}


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderAll();

    }
);


// ============================================================
// ACTUALISATION AUTOMATIQUE
// ============================================================

// Les dates sont recalculées toutes les minutes.

setInterval(
    function () {

        renderAll();

    },
    60000
);