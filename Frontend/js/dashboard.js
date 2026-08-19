// ==========================================
// TASKFLOW PRO - DASHBOARD
// ==========================================


// ==========================================
// API
// ==========================================




// ==========================================
// PARAMÈTRES PAR DÉFAUT
// ==========================================

let dashboardSettings = {
    theme: "light",
    showCompleted: true,
    showDescription: true,
    showPriority: true,
    confirmDelete: true
};


// ==========================================
// RÉCUPÉRER LES PARAMÈTRES DU BACKEND
// ==========================================

async function loadDashboardSettings() {

    try {

        const response = await fetch(
            `${API_URL}/settings`
        );


        if (!response.ok) {

            throw new Error(
                `Erreur HTTP : ${response.status}`
            );

        }


        const settings =
            await response.json();


        console.log(
            "Paramètres récupérés :",
            settings
        );


        dashboardSettings = {
            theme: settings.theme || "light",

            showCompleted:
                settings.showCompleted !== undefined
                    ? settings.showCompleted
                    : true,

            showDescription:
                settings.showDescription !== undefined
                    ? settings.showDescription
                    : true,

            showPriority:
                settings.showPriority !== undefined
                    ? settings.showPriority
                    : true,

            confirmDelete:
                settings.confirmDelete !== undefined
                    ? settings.confirmDelete
                    : true
        };


        // Appliquer les paramètres
        applyTheme();


    } catch (error) {

        console.error(
            "Erreur lors du chargement des paramètres :",
            error
        );

    }

}


// ==========================================
// APPLIQUER LE THÈME
// ==========================================

function applyTheme() {

    if (dashboardSettings.theme === "dark") {

        document.body.classList.remove(
            "bg-slate-100",
            "text-slate-800"
        );


        document.body.classList.add(
            "bg-slate-900",
            "text-white"
        );

    } else {

        document.body.classList.remove(
            "bg-slate-900",
            "text-white"
        );


        document.body.classList.add(
            "bg-slate-100",
            "text-slate-800"
        );

    }

}


// ==========================================
// RÉCUPÉRER LES DONNÉES
// ==========================================

function getData(key) {

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    } catch (error) {

        console.error(
            "Erreur de lecture :",
            key,
            error
        );

        return [];

    }

}


// ==========================================
// CALCULER LE DASHBOARD
// ==========================================

function updateDashboard() {

    const projects =
        getData("projects");


    const tasks =
        getData("tasks");


    const members =
        getData("members");


    // ==========================================
    // PROJETS
    // ==========================================

    const totalProjects =
        projects.length;


    const activeProjects =
        projects.filter(project =>
            project.status === "active"
        ).length;


    const completedProjects =
        projects.filter(project =>
            project.status === "completed"
        ).length;


    // ==========================================
    // TÂCHES
    // ==========================================

    const totalTasks =
        tasks.length;


    const todoTasks =
        tasks.filter(task =>
            task.status === "todo"
        ).length;


    const progressTasks =
        tasks.filter(task =>
            task.status === "in-progress"
        ).length;


    const completedTasks =
        tasks.filter(task =>
            task.status === "completed"
        ).length;


    // ==========================================
    // TÂCHES EN RETARD
    // ==========================================

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const lateTasks =
        tasks.filter(task => {

            if (
                !task.deadline ||
                task.status === "completed"
            ) {

                return false;

            }


            const deadline =
                new Date(task.deadline);


            deadline.setHours(
                0,
                0,
                0,
                0
            );


            return deadline < today;

        }).length;


    // ==========================================
    // MEMBRES
    // ==========================================

    const totalMembers =
        members.length;

async function testMembers() {

    try {

        const response = await fetch(
           "https://taskflow-pro-u5yu.onrender.com/api/membres"
        );

        const data = await response.json();

        console.log("MEMBRES DU BACKEND :", data);

    } catch (error) {

        console.error(
            "Erreur membres :",
            error
        );

    }

}

testMembers();
    // ==========================================
    // PROGRESSION
    // ==========================================

    let progress = 0;


    if (totalTasks > 0) {

        progress =
            Math.round(
                (completedTasks / totalTasks) * 100
            );

    }


    // ==========================================
    // AFFICHAGE
    // ==========================================

    setText(
        "totalProjects",
        totalProjects
    );


    setText(
        "activeProjects",
        activeProjects
    );


    setText(
        "completedProjects",
        completedProjects
    );


    setText(
        "totalTasks",
        totalTasks
    );


    setText(
        "todoTasks",
        todoTasks
    );


    setText(
        "progressTasks",
        progressTasks
    );


    setText(
        "completedTasks",
        completedTasks
    );


    setText(
        "lateTasks",
        lateTasks
    );


    setText(
        "totalMembers",
        totalMembers
    );


    // ==========================================
    // PROGRESSION GLOBALE
    // ==========================================

    setText(
        "globalProgressPercent",
        progress + "%"
    );


    setText(
        "globalProgressText",
        `${completedTasks} tâche${completedTasks > 1 ? "s" : ""} terminée${completedTasks > 1 ? "s" : ""} sur ${totalTasks}`
    );


    const progressBar =
        document.getElementById(
            "globalProgressBar"
        );


    if (progressBar) {

        progressBar.style.width =
            progress + "%";

    }


    // ==========================================
    // PROJETS RÉCENTS
    // ==========================================

    displayRecentProjects(
        projects
    );


    // ==========================================
    // TÂCHES URGENTES
    // ==========================================

    displayUrgentTasks(
        tasks
    );

}


// ==========================================
// FONCTION AFFICHAGE TEXTE
// ==========================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


// ==========================================
// PROJETS RÉCENTS
// ==========================================

function displayRecentProjects(
    projects
) {

    const container =
        document.getElementById(
            "recentProjects"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (projects.length === 0) {

        container.innerHTML = `

            <div class="text-center py-8">

                <p class="text-slate-400">
                    Aucun projet pour le moment.
                </p>

                <a
                    href="projects.html"
                    class="inline-block mt-3 text-indigo-600 font-semibold"
                >
                    Créer un projet →
                </a>

            </div>

        `;

        return;

    }


    const recent =
        [...projects]
            .sort(
                (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
            )
            .slice(0, 5);


    recent.forEach(project => {

        const card =
            document.createElement("div");


        card.className =
            "border border-slate-200 rounded-xl p-4 mb-3";


        const statusText = {

            active: "Actif",

            completed: "Terminé",

            paused: "En pause"

        };


        // ======================================
        // DESCRIPTION
        // ======================================

        const descriptionHTML =
            dashboardSettings.showDescription
                ? `
                    <p class="text-sm text-slate-500 mt-1">
                        ${escapeHTML(
                            project.description ||
                            "Aucune description"
                        )}
                    </p>
                `
                : "";


        // ======================================
        // CARTE
        // ======================================

        card.innerHTML = `

            <div class="flex justify-between items-start">

                <div>

                    <h4 class="font-semibold">
                        ${escapeHTML(
                            project.name ||
                            "Projet sans nom"
                        )}
                    </h4>

                    ${descriptionHTML}

                </div>


                <span
                    class="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700"
                >
                    ${
                        statusText[project.status] ||
                        project.status ||
                        "Actif"
                    }
                </span>

            </div>


            <div class="mt-4">

                <div class="flex justify-between text-xs mb-1">

                    <span>
                        Progression
                    </span>

                    <span>
                        ${project.progress || 0}%
                    </span>

                </div>


                <div class="h-2 bg-slate-100 rounded-full">

                    <div
                        class="h-2 bg-indigo-600 rounded-full"
                        style="width:${project.progress || 0}%"
                    ></div>

                </div>

            </div>

        `;


        container.appendChild(card);

    });

}


// ==========================================
// TÂCHES URGENTES
// ==========================================

function displayUrgentTasks(
    tasks
) {

    const container =
        document.getElementById(
            "urgentTasks"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const urgent =
        tasks.filter(task => {

            // Si les tâches terminées
            // sont masquées dans les paramètres
            if (
                !dashboardSettings.showCompleted &&
                task.status === "completed"
            ) {

                return false;

            }


            if (
                task.status === "completed"
            ) {

                return false;

            }


            const isUrgent =
                task.priority === "urgent";


            let isLate = false;


            if (task.deadline) {

                const deadline =
                    new Date(task.deadline);


                deadline.setHours(
                    0,
                    0,
                    0,
                    0
                );


                isLate =
                    deadline < today;

            }


            return isUrgent || isLate;

        });


    if (urgent.length === 0) {

        container.innerHTML = `

            <div class="text-center py-8">

                <p class="text-slate-400">
                    Aucune tâche urgente 🎉
                </p>

            </div>

        `;

        return;

    }


    urgent
        .slice(0, 5)
        .forEach(task => {

            const element =
                document.createElement("div");


            element.className =
                "border border-red-100 bg-red-50 rounded-xl p-4 mb-3";


            // ======================================
            // PRIORITÉ
            // ======================================

            const priorityHTML =
                dashboardSettings.showPriority
                    ? `
                        <p class="text-xs text-slate-500 mt-1">
                            Priorité :
                            ${escapeHTML(
                                task.priority ||
                                "non définie"
                            )}
                        </p>
                    `
                    : "";


            element.innerHTML = `

                <div class="flex justify-between">

                    <div>

                        <h4 class="font-semibold">
                            ${escapeHTML(
                                task.title ||
                                "Tâche"
                            )}
                        </h4>

                        ${priorityHTML}

                    </div>


                    <span class="text-red-500">
                        !
                    </span>

                </div>


                ${
                    task.deadline
                    ?
                    `
                    <p class="text-xs text-red-500 mt-2">
                        Échéance :
                        ${formatDate(task.deadline)}
                    </p>
                    `
                    :
                    ""
                }

            `;


            container.appendChild(element);

        });

}


// ==========================================
// DATE
// ==========================================

function formatDate(
    date
) {

    if (!date) {

        return "";

    }


    const d =
        new Date(date);


    return d.toLocaleDateString(
        "fr-FR"
    );

}


// ==========================================
// SÉCURITÉ AFFICHAGE
// ==========================================

function escapeHTML(
    text
) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


// ==========================================
// LANCEMENT
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // 1. Charger les paramètres
        await loadDashboardSettings();

        // 2. Charger le Dashboard
        updateDashboard();

    }
);