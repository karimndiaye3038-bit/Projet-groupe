// TaskFlow Pro - Settings

const defaults = {
    theme: "light",
    showCompleted: true,
    showDescription: true,
    showPriority: true,
    confirmDelete: true
};

function getSettings() {
    try {
        return {
            ...defaults,
            ...JSON.parse(localStorage.getItem("settings") || "{}")
        };
    } catch {
        return { ...defaults };
    }
}

function saveSettings(settings) {
    localStorage.setItem("settings", JSON.stringify(settings));
}

const $ = id => document.getElementById(id);

const themeLight = $("themeLight");
const themeDark = $("themeDark");
const themeSystem = $("themeSystem");
const showCompleted = $("showCompleted");
const showDescription = $("showDescription");
const showPriority = $("showPriority");
const confirmDelete = $("confirmDelete");
const exportBtn = $("exportBtn");
const importFile = $("importFile");
const resetBtn = $("resetBtn");
const toast = $("toast");
const toastMessage = $("toastMessage");

// Thème
function applyTheme(theme) {
    const dark = theme === "dark" ||
        (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", dark);
}

// Notification
function showToast(message, error = false) {
    if (!toast) return;

    toastMessage.textContent = message;
    toast.classList.toggle("toast-error", error);
    toast.classList.add("toast-visible");

    setTimeout(() => {
        toast.classList.remove("toast-visible");
    }, 3000);
}

// Charger les paramètres
function loadSettings() {
    const s = getSettings();

    if (themeLight) themeLight.checked = s.theme === "light";
    if (themeDark) themeDark.checked = s.theme === "dark";
    if (themeSystem) themeSystem.checked = s.theme === "system";

    if (showCompleted) showCompleted.checked = s.showCompleted;
    if (showDescription) showDescription.checked = s.showDescription;
    if (showPriority) showPriority.checked = s.showPriority;
    if (confirmDelete) confirmDelete.checked = s.confirmDelete;

    applyTheme(s.theme);
}

// Modifier un paramètre
function update(key, value) {
    const settings = getSettings();
    settings[key] = value;
    saveSettings(settings);
    showToast("Paramètre enregistré");
}

// Thèmes
themeLight?.addEventListener("change", () => {
    if (themeLight.checked) {
        update("theme", "light");
        applyTheme("light");
    }
});

themeDark?.addEventListener("change", () => {
    if (themeDark.checked) {
        update("theme", "dark");
        applyTheme("dark");
    }
});

themeSystem?.addEventListener("change", () => {
    if (themeSystem.checked) {
        update("theme", "system");
        applyTheme("system");
    }
});

// Affichage
showCompleted?.addEventListener("change", () =>
    update("showCompleted", showCompleted.checked)
);

showDescription?.addEventListener("change", () =>
    update("showDescription", showDescription.checked)
);

showPriority?.addEventListener("change", () =>
    update("showPriority", showPriority.checked)
);

// Suppression
confirmDelete?.addEventListener("change", () =>
    update("confirmDelete", confirmDelete.checked)
);

// Export
exportBtn?.addEventListener("click", () => {
    const data = {
        app: "TaskFlow Pro",
        version: 1,
        exportedAt: new Date().toISOString(),
        tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
        projects: JSON.parse(localStorage.getItem("projects") || "[]"),
        members: JSON.parse(localStorage.getItem("members") || "[]"),
        settings: getSettings()
    };

    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "taskflow-pro-backup.json";
    link.click();

    URL.revokeObjectURL(url);

    showToast("Données exportées avec succès");
});

// Import
importFile?.addEventListener("change", event => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = event => {
        try {
            const data = JSON.parse(event.target.result);

            if (
                !Array.isArray(data.tasks) ||
                !Array.isArray(data.projects) ||
                !Array.isArray(data.members)
            ) {
                throw new Error("Fichier invalide");
            }

            if (!confirm(
                "Les données actuelles seront remplacées. Continuer ?"
            )) return;

            localStorage.setItem("tasks", JSON.stringify(data.tasks));
            localStorage.setItem("projects", JSON.stringify(data.projects));
            localStorage.setItem("members", JSON.stringify(data.members));

            if (data.settings) {
                saveSettings({
                    ...defaults,
                    ...data.settings
                });
            }

            loadSettings();
            showToast("Données importées avec succès");

        } catch (error) {
            showToast("Fichier JSON invalide", true);
        }

        importFile.value = "";
    };

    reader.readAsText(file);
});

// Réinitialisation
resetBtn?.addEventListener("click", () => {
    if (!confirm(
        "⚠️ Toutes les tâches, projets, membres et paramètres seront supprimés. Continuer ?"
    )) return;

    localStorage.removeItem("tasks");
    localStorage.removeItem("projects");
    localStorage.removeItem("members");
    localStorage.removeItem("Parametre");

    saveSettings({ ...defaults });
    loadSettings();

    showToast("Données réinitialisées");
});

// Thème système
window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
        if (getSettings().theme === "system") {
            applyTheme("system");
        }
    });

// Initialisation
loadSettings();

