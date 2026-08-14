document.addEventListener("DOMContentLoaded", function () {

    console.log("TASKFLOW PRO JS CHARGÉ");

    // =====================================================
    // OUTILS
    // =====================================================

    function get(id) {
        return document.getElementById(id);
    }

    function showModal(modal) {

        if (!modal) return;

        modal.classList.remove("hidden");
        modal.classList.add("flex");
    }

    function hideModal(modal) {

        if (!modal) return;

        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }

    function escapeHTML(value) {

        return String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function formatDate(date) {

        if (!date) {
            return "Non définie";
        }

        const d = new Date(date);

        if (isNaN(d.getTime())) {
            return "Non définie";
        }

        return d.toLocaleDateString("fr-FR");
    }


    // =====================================================
    // PROJETS
    // =====================================================

    let projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    const projectModal = get("projectModal");
    const projectForm = get("projectForm");

    const openProject =
        get("openProjectModal");

    const closeProject =
        get("closeProjectModal");

    const cancelProject =
        get("cancelProject");

    const projectsContainer =
        get("projectsContainer");


    // -----------------------------------------------------
    // OUVRIR PROJET
    // -----------------------------------------------------

    if (openProject) {

        openProject.addEventListener("click", function () {

            console.log("NOUVEAU PROJET");

            if (projectForm) {
                projectForm.reset();
            }

            if (get("projectId")) {
                get("projectId").value = "";
            }

            if (get("projectProgress")) {
                get("projectProgress").value = 0;
            }

            if (get("progressValue")) {
                get("progressValue").textContent = "0%";
            }

            if (get("projectStatus")) {
                get("projectStatus").value = "active";
            }

            if (get("projectModalTitle")) {
                get("projectModalTitle").textContent =
                    "Nouveau projet";
            }

            showModal(projectModal);

        });

    }


    // -----------------------------------------------------
    // FERMER PROJET
    // -----------------------------------------------------

    if (closeProject) {

        closeProject.addEventListener(
            "click",
            function () {
                hideModal(projectModal);
            }
        );

    }


    if (cancelProject) {

        cancelProject.addEventListener(
            "click",
            function () {
                hideModal(projectModal);
            }
        );

    }


    // -----------------------------------------------------
    // PROGRESSION
    // -----------------------------------------------------

    if (get("projectProgress")) {

        get("projectProgress").addEventListener(
            "input",
            function () {

                if (get("progressValue")) {

                    get("progressValue").textContent =
                        this.value + "%";

                }

            }
        );

    }


    // -----------------------------------------------------
    // ENREGISTRER PROJET
    // -----------------------------------------------------

    if (projectForm) {

        projectForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const id =
                    get("projectId")?.value;

                const name =
                    get("projectName")?.value.trim();

                const description =
                    get("projectDescription")?.value.trim();

                const status =
                    get("projectStatus")?.value;

                const progress =
                    Number(
                        get("projectProgress")?.value || 0
                    );

                const deadline =
                    get("projectDeadline")?.value;


                if (!name) {

                    alert(
                        "Le nom du projet est obligatoire."
                    );

                    return;
                }


                // MODIFICATION

                if (id) {

                    const project =
                        projects.find(
                            p =>
                                String(p.id) ===
                                String(id)
                        );

                    if (project) {

                        project.name =
                            name;

                        project.description =
                            description;

                        project.status =
                            status;

                        project.progress =
                            progress;

                        project.deadline =
                            deadline;

                    }

                }

                // CREATION

                else {

                    projects.unshift({

                        id: Date.now(),

                        name,

                        description,

                        status,

                        progress,

                        deadline,

                        createdAt:
                            new Date().toISOString()

                    });

                }


                localStorage.setItem(
                    "projects",
                    JSON.stringify(projects)
                );


                renderProjects();

                hideModal(projectModal);

            }
        );

    }


    // -----------------------------------------------------
    // AFFICHAGE PROJETS
    // -----------------------------------------------------

    function renderProjects() {

        if (!projectsContainer) {
            return;
        }


        if (projects.length === 0) {

            projectsContainer.innerHTML = `

                <div class="col-span-full bg-white border rounded-xl p-10 text-center">

                    <div class="text-5xl mb-4">
                        📁
                    </div>

                    <h3 class="text-lg font-semibold">
                        Aucun projet
                    </h3>

                    <p class="text-gray-500 text-sm mt-2">
                        Cliquez sur "Nouveau projet".
                    </p>

                </div>

            `;

            return;
        }


        projectsContainer.innerHTML =
            projects.map(project => `

                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                    <div class="flex justify-between items-start">

                        <div>

                            <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                                📁
                            </div>

                            <h3 class="text-lg font-bold">
                                ${escapeHTML(project.name)}
                            </h3>

                        </div>

                        <span class="px-3 py-1 rounded-full text-xs
                            ${
                                project.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }
                        ">

                            ${
                                project.status === "completed"
                                ? "Terminé"
                                : "Actif"
                            }

                        </span>

                    </div>


                    <p class="text-sm text-gray-500 mt-3">

                        ${
                            escapeHTML(
                                project.description ||
                                "Aucune description"
                            )
                        }

                    </p>


                    <div class="mt-6">

                        <div class="flex justify-between mb-2">

                            <span class="text-sm text-gray-500">
                                Progression
                            </span>

                            <span class="font-semibold">
                                ${project.progress}%
                            </span>

                        </div>


                        <div class="h-2.5 bg-gray-200 rounded-full">

                            <div
                                class="h-2.5 bg-indigo-600 rounded-full"
                                style="width:${project.progress}%"
                            ></div>

                        </div>

                    </div>


                    <div class="grid grid-cols-2 gap-3 mt-6">

                        <div class="bg-gray-50 p-3 rounded-lg">

                            <p class="text-xs text-gray-400">
                                Créé le
                            </p>

                            <p class="text-sm mt-1">
                                ${formatDate(project.createdAt)}
                            </p>

                        </div>


                        <div class="bg-gray-50 p-3 rounded-lg">

                            <p class="text-xs text-gray-400">
                                Deadline
                            </p>

                            <p class="text-sm mt-1">
                                ${formatDate(project.deadline)}
                            </p>

                        </div>

                    </div>


                    <div class="flex justify-end gap-2 mt-6 pt-4 border-t">

                        <button
                            type="button"
                            class="edit-project px-3 py-2 bg-blue-100 text-blue-700 rounded-lg"
                            data-id="${project.id}"
                        >
                            ✏️ Modifier
                        </button>


                        <button
                            type="button"
                            class="delete-project px-3 py-2 bg-red-100 text-red-700 rounded-lg"
                            data-id="${project.id}"
                        >
                            🗑️ Supprimer
                        </button>

                    </div>

                </div>

            `).join("");

    }


    // -----------------------------------------------------
    // ACTIONS PROJETS
    // -----------------------------------------------------

    if (projectsContainer) {

        projectsContainer.addEventListener(
            "click",
            function (event) {

                const edit =
                    event.target.closest(
                        ".edit-project"
                    );

                const del =
                    event.target.closest(
                        ".delete-project"
                    );


                // MODIFIER

                if (edit) {

                    const project =
                        projects.find(
                            p =>
                                String(p.id) ===
                                String(edit.dataset.id)
                        );

                    if (!project) return;


                    get("projectId").value =
                        project.id;

                    get("projectName").value =
                        project.name;

                    get("projectDescription").value =
                        project.description || "";

                    get("projectStatus").value =
                        project.status;

                    get("projectProgress").value =
                        project.progress;

                    get("projectDeadline").value =
                        project.deadline || "";


                    if (get("progressValue")) {

                        get("progressValue").textContent =
                            project.progress + "%";

                    }


                    if (get("projectModalTitle")) {

                        get("projectModalTitle").textContent =
                            "Modifier le projet";

                    }


                    showModal(projectModal);

                }


                // SUPPRIMER

                if (del) {

                    if (
                        !confirm(
                            "Voulez-vous supprimer ce projet ?"
                        )
                    ) {
                        return;
                    }


                    projects =
                        projects.filter(
                            p =>
                                String(p.id) !==
                                String(del.dataset.id)
                        );


                    localStorage.setItem(
                        "projects",
                        JSON.stringify(projects)
                    );


                    renderProjects();

                }

            }
        );

    }


    renderProjects();


    // =====================================================
    // MEMBRES
    // =====================================================

    let members =
        JSON.parse(localStorage.getItem("members")) || [];


    const memberModal =
        get("memberModal");

    const memberForm =
        get("memberForm");

    const openMember =
        get("openMemberModal");

    const closeMember =
        get("closeMemberModal");

    const cancelMember =
        get("cancelMember");

    const membersContainer =
        get("membersContainer");


    // -----------------------------------------------------
    // OUVRIR MEMBRE
    // -----------------------------------------------------

    if (openMember) {

        openMember.addEventListener(
            "click",
            function () {

                console.log("NOUVEAU MEMBRE");

                if (memberForm) {
                    memberForm.reset();
                }

                if (get("memberId")) {
                    get("memberId").value = "";
                }

                if (get("avatarPreview")) {
                    get("avatarPreview").textContent = "?";
                }

                if (get("memberModalTitle")) {

                    get("memberModalTitle").textContent =
                        "Nouveau membre";

                }

                showModal(memberModal);

            }
        );

    }


    // -----------------------------------------------------
    // FERMER MEMBRE
    // -----------------------------------------------------

    if (closeMember) {

        closeMember.addEventListener(
            "click",
            function () {
                hideModal(memberModal);
            }
        );

    }


    if (cancelMember) {

        cancelMember.addEventListener(
            "click",
            function () {
                hideModal(memberModal);
            }
        );

    }


    // -----------------------------------------------------
    // AVATAR
    // -----------------------------------------------------

    function updateAvatar() {

        if (!get("avatarPreview")) return;


        const first =
            get("memberFirstName")?.value.trim() || "";

        const last =
            get("memberLastName")?.value.trim() || "";


        get("avatarPreview").textContent =
            (
                first.charAt(0) +
                last.charAt(0)
            ).toUpperCase() || "?";

    }


    get("memberFirstName")?.addEventListener(
        "input",
        updateAvatar
    );

    get("memberLastName")?.addEventListener(
        "input",
        updateAvatar
    );


    // -----------------------------------------------------
    // ENREGISTRER MEMBRE
    // -----------------------------------------------------

    if (memberForm) {

        memberForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const id =
                    get("memberId")?.value;

                const firstName =
                    get("memberFirstName")?.value.trim();

                const lastName =
                    get("memberLastName")?.value.trim();

                const email =
                    get("memberEmail")?.value.trim();

                const role =
                    get("memberRole")?.value;

                const avatar =
                    get("memberAvatar")?.value.trim();


                if (
                    !firstName ||
                    !lastName ||
                    !email ||
                    !role
                ) {

                    alert(
                        "Veuillez remplir les champs obligatoires."
                    );

                    return;
                }


                if (id) {

                    const member =
                        members.find(
                            m =>
                                String(m.id) ===
                                String(id)
                        );

                    if (member) {

                        member.firstName =
                            firstName;

                        member.lastName =
                            lastName;

                        member.email =
                            email;

                        member.role =
                            role;

                        member.avatar =
                            avatar;

                    }

                }

                else {

                    members.unshift({

                        id: Date.now(),

                        firstName,

                        lastName,

                        email,

                        role,

                        avatar,

                        createdAt:
                            new Date().toISOString()

                    });

                }


                localStorage.setItem(
                    "members",
                    JSON.stringify(members)
                );


                renderMembers();

                hideModal(memberModal);

            }
        );

    }


    // -----------------------------------------------------
    // AFFICHAGE MEMBRES
    // -----------------------------------------------------

    function renderMembers() {

        if (!membersContainer) {
            return;
        }


        if (members.length === 0) {

            membersContainer.innerHTML = `

                <div class="col-span-full bg-white border rounded-xl p-10 text-center">

                    <div class="text-5xl mb-4">
                        👥
                    </div>

                    <h3 class="text-lg font-semibold">
                        Aucun membre
                    </h3>

                    <p class="text-gray-500 text-sm mt-2">
                        Cliquez sur "Nouveau membre".
                    </p>

                </div>

            `;

            return;
        }


        membersContainer.innerHTML =
            members.map(member => {

                const initials =
                    (
                        (member.firstName || "")
                            .charAt(0) +
                        (member.lastName || "")
                            .charAt(0)
                    ).toUpperCase();


                return `

                    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

                        <div class="flex items-center gap-4">

                            ${
                                member.avatar

                                ? `

                                    <img
                                        src="${escapeHTML(member.avatar)}"
                                        class="w-16 h-16 rounded-full object-cover"
                                    >

                                `

                                : `

                                    <div class="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">

                                        ${initials || "?"}

                                    </div>

                                `
                            }


                            <div>

                                <h3 class="font-bold text-lg">

                                    ${escapeHTML(member.firstName)}
                                    ${escapeHTML(member.lastName)}

                                </h3>


                                <p class="text-indigo-600 text-sm">

                                    ${escapeHTML(member.role)}

                                </p>

                            </div>

                        </div>


                        <div class="mt-6 space-y-3 text-sm">

                            <p>
                                ✉️ ${escapeHTML(member.email)}
                            </p>

                            <p>
                                🆔 ${member.id}
                            </p>

                            <p>
                                📅 ${formatDate(member.createdAt)}
                            </p>

                        </div>


                        <div class="flex justify-end gap-2 mt-6 pt-4 border-t">

                            <button
                                type="button"
                                class="edit-member px-3 py-2 bg-blue-100 text-blue-700 rounded-lg"
                                data-id="${member.id}"
                            >
                                ✏️ Modifier
                            </button>


                            <button
                                type="button"
                                class="delete-member px-3 py-2 bg-red-100 text-red-700 rounded-lg"
                                data-id="${member.id}"
                            >
                                🗑️ Supprimer
                            </button>

                        </div>

                    </div>

                `;

            }).join("");

    }


    // -----------------------------------------------------
    // ACTIONS MEMBRES
    // -----------------------------------------------------

    if (membersContainer) {

        membersContainer.addEventListener(
            "click",
            function (event) {

                const edit =
                    event.target.closest(
                        ".edit-member"
                    );

                const del =
                    event.target.closest(
                        ".delete-member"
                    );


                if (edit) {

                    const member =
                        members.find(
                            m =>
                                String(m.id) ===
                                String(edit.dataset.id)
                        );


                    if (!member) return;


                    get("memberId").value =
                        member.id;

                    get("memberFirstName").value =
                        member.firstName;

                    get("memberLastName").value =
                        member.lastName;

                    get("memberEmail").value =
                        member.email;

                    get("memberRole").value =
                        member.role;

                    get("memberAvatar").value =
                        member.avatar || "";


                    updateAvatar();


                    get("memberModalTitle").textContent =
                        "Modifier le membre";


                    showModal(memberModal);

                }


                if (del) {

                    if (
                        !confirm(
                            "Voulez-vous supprimer ce membre ?"
                        )
                    ) {
                        return;
                    }


                    members =
                        members.filter(
                            m =>
                                String(m.id) !==
                                String(del.dataset.id)
                        );


                    localStorage.setItem(
                        "members",
                        JSON.stringify(members)
                    );


                    renderMembers();

                }

            }
        );

    }


    renderMembers();


    // =====================================================
    // TÂCHES
    // =====================================================

    let tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];


    const taskModal =
        get("taskModal");

    const taskForm =
        get("taskForm");

    const openTask =
        get("openTaskModal");

    const closeTask =
        get("closeTaskModal");

    const cancelTask =
        get("cancelTask");

    const tasksContainer =
        get("tasksContainer");


    // -----------------------------------------------------
    // CHARGER PROJETS
    // -----------------------------------------------------

    function loadTaskProjects() {

        const select =
            get("taskProject");

        if (!select) return;


        select.innerHTML = `
            <option value="">
                Sélectionner un projet
            </option>
        `;


        projects =
            JSON.parse(
                localStorage.getItem("projects")
            ) || [];


        projects.forEach(project => {

            select.innerHTML += `

                <option value="${project.id}">
                    ${escapeHTML(project.name)}
                </option>

            `;

        });

    }


    // -----------------------------------------------------
    // CHARGER MEMBRES
    // -----------------------------------------------------

    function loadTaskMembers() {

        const select =
            get("taskMember");

        if (!select) return;


        select.innerHTML = `
            <option value="">
                Non assignée
            </option>
        `;


        members =
            JSON.parse(
                localStorage.getItem("members")
            ) || [];


        members.forEach(member => {

            select.innerHTML += `

                <option value="${member.id}">

                    ${escapeHTML(member.firstName)}
                    ${escapeHTML(member.lastName)}

                </option>

            `;

        });

    }


    // -----------------------------------------------------
    // OUVRIR TÂCHE
    // -----------------------------------------------------

    if (openTask) {

        openTask.addEventListener(
            "click",
            function () {

                console.log("NOUVELLE TÂCHE");

                if (taskForm) {
                    taskForm.reset();
                }

                if (get("taskId")) {
                    get("taskId").value = "";
                }

                if (get("taskStatus")) {
                    get("taskStatus").value = "todo";
                }

                if (get("taskPriority")) {
                    get("taskPriority").value = "medium";
                }

                if (get("taskModalTitle")) {

                    get("taskModalTitle").textContent =
                        "Nouvelle tâche";

                }

                loadTaskProjects();

                loadTaskMembers();

                showModal(taskModal);

            }
        );

    }


    // -----------------------------------------------------
    // FERMER TÂCHE
    // -----------------------------------------------------

    if (closeTask) {

        closeTask.addEventListener(
            "click",
            function () {
                hideModal(taskModal);
            }
        );

    }


    if (cancelTask) {

        cancelTask.addEventListener(
            "click",
            function () {
                hideModal(taskModal);
            }
        );

    }


    // -----------------------------------------------------
    // ENREGISTRER TÂCHE
    // -----------------------------------------------------

    if (taskForm) {

        taskForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const id =
                    get("taskId")?.value;

                const title =
                    get("taskTitle")?.value.trim();

                const description =
                    get("taskDescription")?.value.trim();

                const status =
                    get("taskStatus")?.value;

                const priority =
                    get("taskPriority")?.value;

                const projectId =
                    get("taskProject")?.value || "";

                const memberId =
                    get("taskMember")?.value || "";

                const tags =
                    (
                        get("taskTags")?.value ||
                        ""
                    )
                        .split(",")
                        .map(tag => tag.trim())
                        .filter(Boolean);

                const deadline =
                    get("taskDeadline")?.value || "";


                if (!title) {

                    alert(
                        "Le titre de la tâche est obligatoire."
                    );

                    return;
                }


                if (id) {

                    const task =
                        tasks.find(
                            t =>
                                String(t.id) ===
                                String(id)
                        );


                    if (task) {

                        task.title =
                            title;

                        task.description =
                            description;

                        task.status =
                            status;

                        task.priority =
                            priority;

                        task.projectId =
                            projectId;

                        task.memberId =
                            memberId;

                        task.tags =
                            tags;

                        task.deadline =
                            deadline;

                    }

                }

                else {

                    tasks.unshift({

                        id: Date.now(),

                        title,

                        description,

                        status,

                        priority,

                        projectId,

                        memberId,

                        tags,

                        deadline,

                        createdAt:
                            new Date().toISOString()

                    });

                }


                localStorage.setItem(
                    "tasks",
                    JSON.stringify(tasks)
                );


                renderTasks();

                hideModal(taskModal);

            }
        );

    }


    // -----------------------------------------------------
    // AFFICHAGE TÂCHES
    // -----------------------------------------------------

    function renderTasks() {

        if (!tasksContainer) {
            return;
        }


        if (tasks.length === 0) {

            tasksContainer.innerHTML = `

                <div class="bg-white border rounded-xl p-10 text-center">

                    <div class="text-5xl mb-4">
                        ✓
                    </div>

                    <h3 class="text-lg font-semibold">
                        Aucune tâche
                    </h3>

                    <p class="text-gray-500 text-sm mt-2">
                        Cliquez sur "Nouvelle tâche".
                    </p>

                </div>

            `;

            return;
        }


        projects =
            JSON.parse(
                localStorage.getItem("projects")
            ) || [];


        members =
            JSON.parse(
                localStorage.getItem("members")
            ) || [];


        tasksContainer.innerHTML =
            tasks.map(task => {

                const project =
                    projects.find(
                        p =>
                            String(p.id) ===
                            String(task.projectId)
                    );


                const member =
                    members.find(
                        m =>
                            String(m.id) ===
                            String(task.memberId)
                    );


                return `

                    <div class="bg-white border rounded-xl p-6 shadow-sm">

                        <div class="flex justify-between gap-4">

                            <div>

                                <div class="flex gap-2 mb-3">

                                    <span class="px-3 py-1 rounded-full text-xs
                                        ${
                                            task.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : task.status === "in-progress"
                                            ? "bg-blue-100 text-blue-700"
                                            : task.status === "paused"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-700"
                                        }
                                    ">

                                        ${
                                            task.status === "completed"
                                            ? "Terminée"
                                            : task.status === "in-progress"
                                            ? "En cours"
                                            : task.status === "paused"
                                            ? "En pause"
                                            : "À faire"
                                        }

                                    </span>


                                    <span class="px-3 py-1 rounded-full text-xs
                                        ${
                                            task.priority === "urgent"
                                            ? "bg-red-100 text-red-700"
                                            : task.priority === "high"
                                            ? "bg-orange-100 text-orange-700"
                                            : task.priority === "medium"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-700"
                                        }
                                    ">

                                        ${escapeHTML(task.priority)}

                                    </span>

                                </div>


                                <h3 class="text-lg font-bold">
                                    ${escapeHTML(task.title)}
                                </h3>


                                <p class="text-sm text-gray-500 mt-2">
                                    ${escapeHTML(task.description)}
                                </p>

                            </div>


                            <div class="flex gap-2">

                                <button
                                    type="button"
                                    class="edit-task w-9 h-9 bg-blue-100 text-blue-700 rounded-lg"
                                    data-id="${task.id}"
                                >
                                    ✏️
                                </button>


                                <button
                                    type="button"
                                    class="delete-task w-9 h-9 bg-red-100 text-red-700 rounded-lg"
                                    data-id="${task.id}"
                                >
                                    🗑️
                                </button>

                            </div>

                        </div>


                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">

                            <div class="bg-gray-50 rounded-lg p-3">

                                <p class="text-xs text-gray-400">
                                    Projet
                                </p>

                                <p class="text-sm font-medium mt-1">
                                    📁
                                    ${
                                        project
                                        ? escapeHTML(project.name)
                                        : "Aucun projet"
                                    }
                                </p>

                            </div>


                            <div class="bg-gray-50 rounded-lg p-3">

                                <p class="text-xs text-gray-400">
                                    Membre
                                </p>

                                <p class="text-sm font-medium mt-1">
                                    👤
                                    ${
                                        member
                                        ? escapeHTML(
                                            member.firstName +
                                            " " +
                                            member.lastName
                                        )
                                        : "Non assignée"
                                    }
                                </p>

                            </div>


                            <div class="bg-gray-50 rounded-lg p-3">

                                <p class="text-xs text-gray-400">
                                    Deadline
                                </p>

                                <p class="text-sm font-medium mt-1">
                                    📅 ${formatDate(task.deadline)}
                                </p>

                            </div>

                        </div>


                        <div class="flex justify-end mt-5 pt-4 border-t">

                            ${
                                task.status !== "completed"

                                ? `

                                    <button
                                        type="button"
                                        class="complete-task px-4 py-2 bg-green-100 text-green-700 rounded-lg"
                                        data-id="${task.id}"
                                    >
                                        ✓ Terminer
                                    </button>

                                `

                                : `

                                    <button
                                        type="button"
                                        class="reopen-task px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg"
                                        data-id="${task.id}"
                                    >
                                        ↩ Réouvrir
                                    </button>

                                `
                            }

                        </div>

                    </div>

                `;

            }).join("");

    }


    // -----------------------------------------------------
    // ACTIONS TÂCHES
    // -----------------------------------------------------

    if (tasksContainer) {

        tasksContainer.addEventListener(
            "click",
            function (event) {

                const edit =
                    event.target.closest(
                        ".edit-task"
                    );

                const del =
                    event.target.closest(
                        ".delete-task"
                    );

                const complete =
                    event.target.closest(
                        ".complete-task"
                    );

                const reopen =
                    event.target.closest(
                        ".reopen-task"
                    );


                // MODIFIER

                if (edit) {

                    const task =
                        tasks.find(
                            t =>
                                String(t.id) ===
                                String(edit.dataset.id)
                        );


                    if (!task) return;


                    loadTaskProjects();

                    loadTaskMembers();


                    get("taskId").value =
                        task.id;

                    get("taskTitle").value =
                        task.title;

                    get("taskDescription").value =
                        task.description || "";

                    get("taskStatus").value =
                        task.status;

                    get("taskPriority").value =
                        task.priority;

                    get("taskProject").value =
                        task.projectId || "";

                    get("taskMember").value =
                        task.memberId || "";

                    get("taskTags").value =
                        (task.tags || []).join(", ");

                    get("taskDeadline").value =
                        task.deadline || "";


                    get("taskModalTitle").textContent =
                        "Modifier la tâche";


                    showModal(taskModal);

                }


                // SUPPRIMER

                if (del) {

                    if (
                        !confirm(
                            "Voulez-vous supprimer cette tâche ?"
                        )
                    ) {
                        return;
                    }


                    tasks =
                        tasks.filter(
                            t =>
                                String(t.id) !==
                                String(del.dataset.id)
                        );


                    localStorage.setItem(
                        "tasks",
                        JSON.stringify(tasks)
                    );


                    renderTasks();

                }


                // TERMINER

                if (complete) {

                    const task =
                        tasks.find(
                            t =>
                                String(t.id) ===
                                String(
                                    complete.dataset.id
                                )
                        );


                    if (task) {

                        task.status =
                            "completed";


                        localStorage.setItem(
                            "tasks",
                            JSON.stringify(tasks)
                        );


                        renderTasks();

                    }

                }


                // RÉOUVRIR

                if (reopen) {

                    const task =
                        tasks.find(
                            t =>
                                String(t.id) ===
                                String(
                                    reopen.dataset.id
                                )
                        );


                    if (task) {

                        task.status =
                            "todo";


                        localStorage.setItem(
                            "tasks",
                            JSON.stringify(tasks)
                        );


                        renderTasks();

                    }

                }

            }
        );

    }


    renderTasks();


    // =====================================================
    // RECHERCHE PROJET
    // =====================================================

    get("projectSearch")?.addEventListener(
        "input",
        function () {

            const value =
                this.value.toLowerCase();


            document
                .querySelectorAll(
                    "#projectsContainer > div"
                )
                .forEach(card => {

                    card.style.display =
                        card.textContent
                            .toLowerCase()
                            .includes(value)
                            ? ""
                            : "none";

                });

        }
    );


    // =====================================================
    // RECHERCHE MEMBRE
    // =====================================================

    get("memberSearch")?.addEventListener(
        "input",
        function () {

            const value =
                this.value.toLowerCase();


            document
                .querySelectorAll(
                    "#membersContainer > div"
                )
                .forEach(card => {

                    card.style.display =
                        card.textContent
                            .toLowerCase()
                            .includes(value)
                            ? ""
                            : "none";

                });

        }
    );


    // =====================================================
    // RECHERCHE TÂCHE
    // =====================================================

    get("taskSearch")?.addEventListener(
        "input",
        function () {

            const value =
                this.value.toLowerCase();


            document
                .querySelectorAll(
                    "#tasksContainer > div"
                )
                .forEach(card => {

                    card.style.display =
                        card.textContent
                            .toLowerCase()
                            .includes(value)
                            ? ""
                            : "none";

                });

        }
    );


    console.log(
        "TASKFLOW PRO : INITIALISATION TERMINÉE"
    );

});