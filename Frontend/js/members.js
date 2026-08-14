// ======================================================
// TASKFLOW PRO - MEMBERS
// ======================================================


let members = [];

let editingMemberId = null;


// ======================================================
// ELEMENTS
// ======================================================

const addMemberBtn =
    document.getElementById("addMemberBtn");

const memberModal =
    document.getElementById("memberModal");

const closeMemberModal =
    document.getElementById("closeMemberModal");

const cancelMemberBtn =
    document.getElementById("cancelMemberBtn");

const memberForm =
    document.getElementById("memberForm");

const membersContainer =
    document.getElementById("membersContainer");

const memberSearch =
    document.getElementById("memberSearch");

const modalTitle =
    document.getElementById("modalTitle");

const submitMemberBtn =
    document.getElementById("submitMemberBtn");


// ======================================================
// CHARGER LES MEMBRES
// ======================================================

function loadMembers() {

    try {

        members =
            JSON.parse(
                localStorage.getItem("members")
            ) || [];

    } catch (error) {

        console.error(
            "Erreur lors du chargement des membres :",
            error
        );

        members = [];

    }

}


// ======================================================
// SAUVEGARDER LES MEMBRES
// ======================================================

function saveMembers() {

    localStorage.setItem(
        "members",
        JSON.stringify(members)
    );

}


// ======================================================
// OUVRIR LA MODALE
// ======================================================

function openMemberModal() {

    editingMemberId = null;

    modalTitle.textContent =
        "Nouveau membre";

    submitMemberBtn.textContent =
        "Ajouter le membre";

    memberForm.reset();

    memberModal.classList.remove(
        "hidden"
    );

    memberModal.classList.add(
        "flex"
    );

}


// ======================================================
// FERMER LA MODALE
// ======================================================

function closeModal() {

    memberModal.classList.add(
        "hidden"
    );

    memberModal.classList.remove(
        "flex"
    );

    memberForm.reset();

    editingMemberId = null;

}


// ======================================================
// BOUTON NOUVEAU MEMBRE
// ======================================================

addMemberBtn.addEventListener(
    "click",
    openMemberModal
);


// ======================================================
// BOUTON X
// ======================================================

closeMemberModal.addEventListener(
    "click",
    closeModal
);


// ======================================================
// BOUTON ANNULER
// ======================================================

cancelMemberBtn.addEventListener(
    "click",
    closeModal
);


// ======================================================
// CLIQUER SUR LE FOND
// ======================================================

memberModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === memberModal
        ) {

            closeModal();

        }

    }
);


// ======================================================
// AJOUT / MODIFICATION
// ======================================================

memberForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const firstName =
            document
                .getElementById(
                    "memberFirstName"
                )
                .value
                .trim();


        const lastName =
            document
                .getElementById(
                    "memberLastName"
                )
                .value
                .trim();


        const email =
            document
                .getElementById(
                    "memberEmail"
                )
                .value
                .trim();


        const role =
            document
                .getElementById(
                    "memberRole"
                )
                .value;


        const avatar =
            document
                .getElementById(
                    "memberAvatar"
                )
                .value
                .trim();


        // ==========================================
        // MODIFICATION
        // ==========================================

        if (editingMemberId) {

            const index =
                members.findIndex(
                    member =>
                        member.id ===
                        editingMemberId
                );


            if (index !== -1) {

                members[index] = {

                    ...members[index],

                    firstName:
                        firstName,

                    lastName:
                        lastName,

                    email:
                        email,

                    role:
                        role,

                    avatar:
                        avatar

                };

            }

        }


        // ==========================================
        // NOUVEAU MEMBRE
        // ==========================================

        else {

            const newMember = {

                id:
                    "member_" +
                    Date.now(),

                firstName:
                    firstName,

                lastName:
                    lastName,

                email:
                    email,

                role:
                    role,

                avatar:
                    avatar,

                createdAt:
                    new Date().toISOString()

            };


            members.unshift(
                newMember
            );

        }


        // ==========================================
        // SAUVEGARDE
        // ==========================================

        saveMembers();


        // ==========================================
        // ACTUALISER
        // ==========================================

        renderMembers();


        // ==========================================
        // FERMER
        // ==========================================

        closeModal();

    }
);


// ======================================================
// AFFICHER LES MEMBRES
// ======================================================

function renderMembers(
    searchValue = ""
) {

    membersContainer.innerHTML = "";


    const search =
        searchValue
            .toLowerCase()
            .trim();


    const filteredMembers =
        members.filter(
            function (member) {

                const fullName =
                    `${member.firstName || ""} ${member.lastName || ""}`
                        .toLowerCase();


                const email =
                    (
                        member.email || ""
                    ).toLowerCase();


                const role =
                    (
                        member.role || ""
                    ).toLowerCase();


                return (

                    fullName.includes(
                        search
                    )

                    ||

                    email.includes(
                        search
                    )

                    ||

                    role.includes(
                        search
                    )

                );

            }
        );


    // ==================================================
    // AUCUN MEMBRE
    // ==================================================

    if (
        filteredMembers.length === 0
    ) {

        membersContainer.innerHTML = `

            <div class="col-span-3">

                <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center">

                    <div class="text-5xl mb-4">
                        👥
                    </div>

                    <h3 class="text-xl font-bold">
                        Aucun membre
                    </h3>

                    <p class="text-slate-500 mt-2">
                        Aucun membre ne correspond à votre recherche.
                    </p>

                </div>

            </div>

        `;

        updateStatistics();

        return;

    }


    // ==================================================
    // CARTES
    // ==================================================

    filteredMembers.forEach(
        function (member) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition";


            const initials =
                `${member.firstName?.charAt(0) || ""}${member.lastName?.charAt(0) || ""}`
                    .toUpperCase();


            let avatarHTML;


            if (
                member.avatar
            ) {

                avatarHTML = `

                    <img
                        src="${escapeHTML(member.avatar)}"
                        alt="Avatar"
                        class="w-16 h-16 rounded-full object-cover"
                        onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden'); this.nextElementSibling.classList.add('flex');"
                    >

                    <div
                        class="hidden w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 items-center justify-center text-xl font-bold"
                    >
                        ${initials}
                    </div>

                `;

            } else {

                avatarHTML = `

                    <div
                        class="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold"
                    >
                        ${initials}
                    </div>

                `;

            }


            card.innerHTML = `

                <div class="flex items-start gap-4">

                    ${avatarHTML}

                    <div class="min-w-0">

                        <h3 class="font-bold text-lg truncate">

                            ${escapeHTML(member.firstName)}
                            ${escapeHTML(member.lastName)}

                        </h3>

                        <p class="text-sm text-indigo-600">
                            ${escapeHTML(member.role)}
                        </p>

                    </div>

                </div>


                <div class="mt-6 space-y-3">

                    <div class="flex items-center gap-3 text-sm text-slate-500">

                        <span>✉</span>

                        <span class="truncate">

                            ${escapeHTML(member.email)}

                        </span>

                    </div>


                    <div class="flex items-center gap-3 text-sm text-slate-500">

                        <span>📅</span>

                        <span>

                            Créé le
                            ${formatDate(member.createdAt)}

                        </span>

                    </div>

                </div>


                <div class="flex gap-2 mt-6 pt-5 border-t">

                    <button
                        type="button"
                        class="edit-member flex-1 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-semibold"
                        data-id="${member.id}"
                    >
                        Modifier
                    </button>


                    <button
                        type="button"
                        class="delete-member flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold"
                        data-id="${member.id}"
                    >
                        Supprimer
                    </button>

                </div>

            `;


            membersContainer.appendChild(
                card
            );

        }
    );


    // ==================================================
    // BOUTONS MODIFIER
    // ==================================================

    document
        .querySelectorAll(".edit-member")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        editMember(
                            this.dataset.id
                        );

                    }
                );

            }
        );


    // ==================================================
    // BOUTONS SUPPRIMER
    // ==================================================

    document
        .querySelectorAll(".delete-member")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        deleteMember(
                            this.dataset.id
                        );

                    }
                );

            }
        );


    updateStatistics();

}


// ======================================================
// MODIFIER UN MEMBRE
// ======================================================

function editMember(id) {

    const member =
        members.find(
            function (member) {

                return member.id === id;

            }
        );


    if (!member) {

        return;

    }


    editingMemberId =
        id;


    modalTitle.textContent =
        "Modifier le membre";


    submitMemberBtn.textContent =
        "Enregistrer";


    document.getElementById(
        "memberFirstName"
    ).value =
        member.firstName || "";


    document.getElementById(
        "memberLastName"
    ).value =
        member.lastName || "";


    document.getElementById(
        "memberEmail"
    ).value =
        member.email || "";


    document.getElementById(
        "memberRole"
    ).value =
        member.role || "Autre";


    document.getElementById(
        "memberAvatar"
    ).value =
        member.avatar || "";


    memberModal.classList.remove(
        "hidden"
    );

    memberModal.classList.add(
        "flex"
    );

}


// ======================================================
// SUPPRIMER UN MEMBRE
// ======================================================

function deleteMember(id) {

    const member =
        members.find(
            function (member) {

                return member.id === id;

            }
        );


    if (!member) {

        return;

    }


    const confirmation =
        confirm(
            `Voulez-vous supprimer ${member.firstName} ${member.lastName} ?`
        );


    if (!confirmation) {

        return;

    }


    members =
        members.filter(
            function (member) {

                return member.id !== id;

            }
        );


    saveMembers();

    renderMembers(
        memberSearch.value
    );

}


// ======================================================
// STATISTIQUES
// ======================================================

function updateStatistics() {

    const total =
        members.length;


    const developers =
        members.filter(
            function (member) {

                return (
                    member.role ===
                    "Développeur"
                );

            }
        ).length;


    const designers =
        members.filter(
            function (member) {

                return (
                    member.role ===
                    "Designer"
                );

            }
        ).length;


    document.getElementById(
        "membersCount"
    ).textContent =
        total;


    document.getElementById(
        "developersCount"
    ).textContent =
        developers;


    document.getElementById(
        "designersCount"
    ).textContent =
        designers;

}


// ======================================================
// RECHERCHE
// ======================================================

memberSearch.addEventListener(
    "input",
    function () {

        renderMembers(
            this.value
        );

    }
);


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(date) {

    if (!date) {

        return "Date inconnue";

    }


    return new Date(
        date
    ).toLocaleDateString(
        "fr-FR"
    );

}


// ======================================================
// SECURISER LE TEXTE
// ======================================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value || "";


    return div.innerHTML;

}


// ======================================================
// DECONNEXION
// ======================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            const confirmation =
                confirm(
                    "Voulez-vous vraiment vous déconnecter ?"
                );


            if (confirmation) {

                localStorage.removeItem(
                    "isLoggedIn"
                );


                window.location.href =
                    "login.html";

            }

        }
    );

}


// ======================================================
// INITIALISATION
// ======================================================

loadMembers();

renderMembers();