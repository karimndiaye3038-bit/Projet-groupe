const API_URL = "http://localhost:5000/api/members";
const memberForm = document.getElementById("memberForm");
const memberModal = document.getElementById("memberModal");
const cancelMemberBtn = document.getElementById("cancelMemberBtn");
const submitMemberBtn = document.getElementById("submitMemberBtn");
const memberCountElement = document.getElementById("memberCount"); // compteur

let editingId = null; // null = ajout, sinon modification

// ======================================================
// CHARGER LES MEMBRES
// ======================================================
async function loadMembers() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const members = data.members;

  const container = document.getElementById("membersContainer");
  container.innerHTML = "";

  // Mettre à jour le compteur
  if (memberCountElement) {
    memberCountElement.textContent = members.length;
  }

  members.forEach(m => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl p-5 border shadow-sm";

    card.innerHTML = `
      <p class="font-semibold">${m.firstName} ${m.lastName}</p>
      <p class="text-sm text-slate-500">${m.email}</p>
      <p class="text-xs text-slate-400">${m.role}</p>
      <div class="flex gap-2 mt-3">
        <button class="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm" onclick="editMember('${m._id}')">Modifier</button>
        <button class="bg-red-600 text-white px-3 py-1 rounded-lg text-sm" onclick="deleteMember('${m._id}')">Supprimer</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// ======================================================
// AJOUTER OU MODIFIER UN MEMBRE
// ======================================================
memberForm.addEventListener("submit", async e => {
  e.preventDefault();

  const member = {
    identifier: Date.now().toString(), // identifiant unique
    firstName: document.getElementById("memberFirstName").value.trim(),
    lastName: document.getElementById("memberLastName").value.trim(),
    email: document.getElementById("memberEmail").value.trim(),
    role: document.getElementById("memberRole").value.toLowerCase(),
    avatar: document.getElementById("memberAvatar").value.trim()
  };

  const res = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, {
    method: editingId ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member)
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Erreur backend :", err.message);
    alert("Erreur : " + err.message);
    return;
  }

  editingId = null;
  memberModal.classList.add("hidden");
  memberForm.reset();
  loadMembers();
});

// ======================================================
// SUPPRIMER UN MEMBRE
// ======================================================
async function deleteMember(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    console.error("Erreur suppression :", err.message);
    alert("Erreur : " + err.message);
    return;
  }
  loadMembers();
}

// ======================================================
// MODIFIER UN MEMBRE
// ======================================================
function editMember(id) {
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(data => {
      const m = data.member;
      document.getElementById("memberFirstName").value = m.firstName;
      document.getElementById("memberLastName").value = m.lastName;
      document.getElementById("memberEmail").value = m.email;
      document.getElementById("memberRole").value = m.role;
      document.getElementById("memberAvatar").value = m.avatar || "";
      editingId = m._id;
      submitMemberBtn.textContent = "Modifier le membre";
      memberModal.classList.remove("hidden");
    });
}

// ======================================================
// GESTION MODALE
// ======================================================
document.getElementById("addMemberBtn").addEventListener("click", () => {
  editingId = null;
  submitMemberBtn.textContent = "Ajouter le membre";
  memberForm.reset();
  memberModal.classList.remove("hidden");
});

cancelMemberBtn.addEventListener("click", () => {
  editingId = null;
  memberModal.classList.add("hidden");
});

// ======================================================
// INITIALISATION
// ======================================================
loadMembers();
