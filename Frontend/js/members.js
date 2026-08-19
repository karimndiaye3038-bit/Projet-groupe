// ======================================================
// API MEMBRES
// ======================================================
const API_URL = "https://taskflow-pro-u5yu.onrender.com/api";

// ======================================================
// ÉLÉMENTS HTML
// ======================================================

const memberForm = document.getElementById("memberForm");
const memberModal = document.getElementById("memberModal");
const cancelMemberBtn = document.getElementById("cancelMemberBtn");
const submitMemberBtn = document.getElementById("submitMemberBtn");
const memberCountElement = document.getElementById("memberCount");
const membersContainer = document.getElementById("membersContainer");
const addMemberBtn = document.getElementById("addMemberBtn");


// ======================================================
// ID DU MEMBRE EN COURS DE MODIFICATION
// null = ajout
// ID = modification
// ======================================================

let editingId = null;


// ======================================================
// CHARGER LES MEMBRES
// ======================================================

async function loadMembers() {
  try {
    const res = await fetch(API_URL);

    // Vérifier la réponse HTTP
    if (!res.ok) {
      throw new Error(`Erreur serveur : ${res.status}`);
    }

    const data = await res.json();

    console.log("Réponse API membres :", data);

    // ==================================================
    // RÉCUPÉRER LE TABLEAU DES MEMBRES
    // Compatible avec :
    // { members: [...] }
    // ou
    // [...]
    // ==================================================

    const members = Array.isArray(data)
      ? data
      : Array.isArray(data.members)
        ? data.members
        : [];


    // ==================================================
    // VÉRIFIER LE CONTENEUR
    // ==================================================

    if (!membersContainer) {
      console.error(
        "L'élément #membersContainer est introuvable."
      );
      return;
    }


    // ==================================================
    // VIDER L'AFFICHAGE
    // ==================================================

    membersContainer.innerHTML = "";


    // ==================================================
    // METTRE À JOUR LE COMPTEUR
    // ==================================================

    if (memberCountElement) {
      memberCountElement.textContent = members.length;
    }


    // ==================================================
    // SI AUCUN MEMBRE
    // ==================================================

    if (members.length === 0) {

      membersContainer.innerHTML = `
        <div class="col-span-full text-center py-10">
          <p class="text-slate-500">
            Aucun membre enregistré.
          </p>
        </div>
      `;

      return;
    }


    // ==================================================
    // AFFICHER LES MEMBRES
    // ==================================================

    members.forEach(member => {

      const card = document.createElement("div");

      card.className =
        "bg-white rounded-xl p-5 border shadow-sm";


      // Avatar
      const avatar = member.avatar
        ? `
          <img
            src="${member.avatar}"
            alt="${member.firstName || ""}"
            class="w-12 h-12 rounded-full object-cover"
          >
        `
        : `
          <div
            class="w-12 h-12 rounded-full bg-indigo-100
                   flex items-center justify-center
                   text-indigo-600 font-bold"
          >
            ${(member.firstName || "?").charAt(0).toUpperCase()}
          </div>
        `;


      card.innerHTML = `

        <div class="flex items-center gap-3">

          ${avatar}

          <div>
            <p class="font-semibold text-slate-800">
              ${member.firstName || ""} ${member.lastName || ""}
            </p>

            <p class="text-sm text-slate-500">
              ${member.email || ""}
            </p>

            <p class="text-xs text-slate-400 capitalize">
              ${member.role || ""}
            </p>
          </div>

        </div>


        <div class="flex gap-2 mt-4">

          <button
            class="bg-indigo-600 hover:bg-indigo-700
                   text-white px-3 py-1 rounded-lg text-sm"
            onclick="editMember('${member._id}')"
          >
            Modifier
          </button>


          <button
            class="bg-red-600 hover:bg-red-700
                   text-white px-3 py-1 rounded-lg text-sm"
            onclick="deleteMember('${member._id}')"
          >
            Supprimer
          </button>

        </div>
      `;


      membersContainer.appendChild(card);
    });

  } catch (error) {

    console.error(
      "Erreur lors du chargement des membres :",
      error
    );

    if (membersContainer) {
      membersContainer.innerHTML = `
        <div class="col-span-full text-center py-10">
          <p class="text-red-500">
            Impossible de charger les membres.
          </p>
        </div>
      `;
    }

    if (memberCountElement) {
      memberCountElement.textContent = "0";
    }
  }
}


// ======================================================
// AJOUTER OU MODIFIER UN MEMBRE
// ======================================================

memberForm.addEventListener("submit", async (e) => {

  e.preventDefault();


  // ==================================================
  // RÉCUPÉRER LES VALEURS DU FORMULAIRE
  // ==================================================

  const member = {

    // Pour un nouvel ajout uniquement
    identifier: Date.now().toString(),

    firstName:
      document
        .getElementById("memberFirstName")
        .value
        .trim(),

    lastName:
      document
        .getElementById("memberLastName")
        .value
        .trim(),

    email:
      document
        .getElementById("memberEmail")
        .value
        .trim(),

    role:
      document
        .getElementById("memberRole")
        .value
        .toLowerCase(),

    avatar:
      document
        .getElementById("memberAvatar")
        .value
        .trim()
  };


  // ==================================================
  // VÉRIFICATION SIMPLE
  // ==================================================

  if (
    !member.firstName ||
    !member.lastName ||
    !member.email ||
    !member.role
  ) {

    alert("Veuillez remplir tous les champs obligatoires.");

    return;
  }


  try {

    // ==================================================
    // URL ET MÉTHODE
    // ==================================================

    const url = editingId
      ? `${API_URL}/${editingId}`
      : API_URL;

    const method = editingId
      ? "PUT"
      : "POST";


    // ==================================================
    // ENVOYER AU BACKEND
    // ==================================================

    const res = await fetch(url, {

      method,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(member)

    });


    // ==================================================
    // RÉCUPÉRER LA RÉPONSE
    // ==================================================

    const data = await res.json();


    // ==================================================
    // GÉRER LES ERREURS
    // ==================================================

    if (!res.ok) {

      console.error(
        "Erreur backend :",
        data
      );

      alert(
        "Erreur : " +
        (data.message || "Une erreur est survenue.")
      );

      return;
    }


    // ==================================================
    // SUCCÈS
    // ==================================================

    console.log(
      "Membre enregistré :",
      data
    );


    editingId = null;


    // Fermer la modal
    if (memberModal) {
      memberModal.classList.add("hidden");
    }


    // Réinitialiser le formulaire
    memberForm.reset();


    // Remettre le bouton en mode ajout
    if (submitMemberBtn) {
      submitMemberBtn.textContent = "Ajouter le membre";
    }


    // Recharger les membres
    await loadMembers();

  } catch (error) {

    console.error(
      "Erreur lors de l'enregistrement :",
      error
    );

    alert(
      "Impossible de communiquer avec le serveur."
    );
  }

});


// ======================================================
// SUPPRIMER UN MEMBRE
// ======================================================

async function deleteMember(id) {

  // Confirmation
  const confirmation = confirm(
    "Voulez-vous vraiment supprimer ce membre ?"
  );

  if (!confirmation) {
    return;
  }


  try {

    const res = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE"
      }
    );


    const data = await res.json();


    // ==================================================
    // ERREUR
    // ==================================================

    if (!res.ok) {

      console.error(
        "Erreur suppression :",
        data
      );

      alert(
        "Erreur : " +
        (data.message || "Impossible de supprimer le membre.")
      );

      return;
    }


    // ==================================================
    // SUCCÈS
    // ==================================================

    console.log(
      "Membre supprimé :",
      data
    );


    // Recharger la liste
    await loadMembers();

  } catch (error) {

    console.error(
      "Erreur suppression :",
      error
    );

    alert(
      "Impossible de communiquer avec le serveur."
    );
  }
}


// ======================================================
// MODIFIER UN MEMBRE
// ======================================================

async function editMember(id) {

  try {

    const res = await fetch(
      `${API_URL}/${id}`
    );


    const data = await res.json();


    // ==================================================
    // ERREUR
    // ==================================================

    if (!res.ok) {

      console.error(
        "Erreur récupération membre :",
        data
      );

      alert(
        "Erreur : " +
        (data.message || "Membre introuvable.")
      );

      return;
    }


    // ==================================================
    // RÉCUPÉRER LE MEMBRE
    // ==================================================

    const member = data.member;


    if (!member) {

      alert(
        "Les informations du membre sont introuvables."
      );

      return;
    }


    // ==================================================
    // REMPLIR LE FORMULAIRE
    // ==================================================

    document.getElementById(
      "memberFirstName"
    ).value = member.firstName || "";


    document.getElementById(
      "memberLastName"
    ).value = member.lastName || "";


    document.getElementById(
      "memberEmail"
    ).value = member.email || "";


    document.getElementById(
      "memberRole"
    ).value = member.role || "";


    document.getElementById(
      "memberAvatar"
    ).value = member.avatar || "";


    // ==================================================
    // PASSER EN MODE MODIFICATION
    // ==================================================

    editingId = member._id;


    if (submitMemberBtn) {
      submitMemberBtn.textContent =
        "Modifier le membre";
    }


    // ==================================================
    // OUVRIR LA MODALE
    // ==================================================

    if (memberModal) {
      memberModal.classList.remove("hidden");
    }

  } catch (error) {

    console.error(
      "Erreur modification :",
      error
    );

    alert(
      "Impossible de récupérer le membre."
    );
  }
}


// ======================================================
// OUVRIR LA MODALE POUR AJOUTER
// ======================================================

if (addMemberBtn) {

  addMemberBtn.addEventListener(
    "click",
    () => {

      editingId = null;


      memberForm.reset();


      if (submitMemberBtn) {
        submitMemberBtn.textContent =
          "Ajouter le membre";
      }


      memberModal.classList.remove("hidden");

    }
  );

}


// ======================================================
// ANNULER
// ======================================================

if (cancelMemberBtn) {

  cancelMemberBtn.addEventListener(
    "click",
    () => {

      editingId = null;

      memberForm.reset();

      if (submitMemberBtn) {
        submitMemberBtn.textContent =
          "Ajouter le membre";
      }

      memberModal.classList.add("hidden");

    }
  );

}


// ======================================================
// INITIALISATION
// ======================================================

loadMembers();