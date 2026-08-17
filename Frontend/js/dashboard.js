// ==========================================
// TASKFLOW PRO - DASHBOARD
// ==========================================


// Récupérer les données
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

    const projects = getData("projects");

    const tasks = getData("tasks");

    const members = getData("members");


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
    // TACHES
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
    // TACHES EN RETARD
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


    // ==========================================
    // PROGRESSION GLOBALE
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
    // PROGRESSION
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
    // PROJETS RECENTS
    // ==========================================

    displayRecentProjects(
        projects
    );


    // ==========================================
    // TACHES URGENTES
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
// PROJETS RECENTS
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


        card.innerHTML = `

            <div class="flex justify-between items-start">

                <div>

                    <h4 class="font-semibold">
                        ${escapeHTML(project.name || "Projet sans nom")}
                    </h4>

                    <p class="text-sm text-slate-500 mt-1">
                        ${escapeHTML(project.description || "Aucune description")}
                    </p>

                </div>

                <span
                    class="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700"
                >
                    ${statusText[project.status] || project.status || "Actif"}
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
// TACHES URGENTES
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


            element.innerHTML = `

                <div class="flex justify-between">

                    <div>

                        <h4 class="font-semibold">
                            ${escapeHTML(task.title || "Tâche")}
                        </h4>

                        <p class="text-xs text-slate-500 mt-1">
                            Priorité :
                            ${task.priority || "non définie"}
                        </p>

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
// SECURITE AFFICHAGE
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
    () => {

        updateDashboard();

    }
);