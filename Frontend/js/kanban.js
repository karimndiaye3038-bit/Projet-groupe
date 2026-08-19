const API_URL = "https://taskflow-pro-u5yu.onrender.com/api/tasks";

async function loadKanban() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Erreur serveur : ${response.status}`);
    }

    const data = await response.json();

    const tasks = Array.isArray(data)
      ? data
      : data.tasks || [];

    // Vider les colonnes
    document.getElementById("todo").innerHTML = "";
    document.getElementById("in_progress").innerHTML = "";
    document.getElementById("paused").innerHTML = "";
    document.getElementById("completed").innerHTML = "";

    // Afficher les tâches
    tasks.forEach(task => {

      const card = createTaskCard(task);

      if (task.status === "todo") {
        document.getElementById("todo").appendChild(card);
      }

      else if (task.status === "in_progress") {
        document
          .getElementById("in_progress")
          .appendChild(card);
      }

      else if (task.status === "paused") {
        document
          .getElementById("paused")
          .appendChild(card);
      }

      else if (task.status === "completed") {
        document
          .getElementById("completed")
          .appendChild(card);
      }

    });

    updateCounts();

  } catch (error) {

    console.error(
      "Erreur chargement Kanban :",
      error
    );

  }
}


function createTaskCard(task) {

  const card = document.createElement("div");

  card.className = `
    bg-white
    rounded-xl
    p-4
    shadow-sm
    border
    hover:shadow-md
    transition
  `;

  card.innerHTML = `
    <h3 class="font-semibold text-slate-800">
      ${task.title || "Sans titre"}
    </h3>

    <p class="text-sm text-slate-500 mt-2">
      ${task.description || ""}
    </p>

    ${
      task.priority
        ? `
          <span class="
            inline-block
            mt-3
            px-2
            py-1
            text-xs
            rounded-full
            bg-indigo-100
            text-indigo-700
          ">
            ${task.priority}
          </span>
        `
        : ""
    }
  `;

  return card;
}


function updateCounts() {

  document.getElementById("count-todo").textContent =
    document.getElementById("todo").children.length;

  document.getElementById("count-in_progress").textContent =
    document.getElementById("in_progress").children.length;

  document.getElementById("count-paused").textContent =
    document.getElementById("paused").children.length;

  document.getElementById("count-completed").textContent =
    document.getElementById("completed").children.length;
}


// Actualiser
document
  .getElementById("refreshBtn")
  ?.addEventListener("click", loadKanban);


// Chargement initial
loadKanban();