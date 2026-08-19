
// ======================================================
// TASKFLOW PRO - SETTINGS
// FRONTEND ↔ BACKEND
// ======================================================

const API_URL = "https://taskflow-pro-u5yu.onrender.com/api";


// ======================================================
// PARAMÈTRES PAR DÉFAUT
// ======================================================

const defaults = {
    theme: "light",
    showCompleted: true,
    showDescription: true,
    showPriority: true,
    confirmDelete: true
};


// ======================================================
// ÉLÉMENTS HTML
// ======================================================

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


// ======================================================
// PARAMÈTRES EN MÉMOIRE
// ======================================================

let currentSettings = {
    ...defaults
};


// ======================================================
// RÉCUPÉRER LES PARAMÈTRES DEPUIS MONGODB
// ======================================================

async function getSettings() {

    try {

        const response = await fetch(
            `${API_URL}/settings`
        );


        if (!response.ok) {

            throw new Error(
                "Impossible de récupérer les paramètres"
            );

        }


        const data =
            await response.json();


        console.log(
            "Paramètres reçus du backend :",
            data
        );


        currentSettings = {
            ...defaults,
            ...data
        };


        return currentSettings;


    } catch (error) {

        console.error(
            "Erreur récupération paramètres :",
            error
        );


        // En cas d'erreur,
        // utiliser les paramètres par défaut

        currentSettings = {
            ...defaults
        };


        return currentSettings;
    }
}


// ======================================================
// SAUVEGARDER LES PARAMÈTRES DANS MONGODB
// ======================================================

async function saveSettings(settings) {

    try {

        const response = await fetch(
            `${API_URL}/settings`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(settings)
            }
        );


        if (!response.ok) {

            throw new Error(
                "Impossible de sauvegarder les paramètres"
            );

        }


        const data =
            await response.json();


        console.log(
            "Paramètres sauvegardés :",
            data
        );


        currentSettings = {
            ...currentSettings,
            ...settings
        };


        return data;


    } catch (error) {

        console.error(
            "Erreur sauvegarde paramètres :",
            error
        );


        throw error;
    }
}


// ======================================================
// APPLIQUER LE THÈME
// ======================================================

function applyTheme(theme) {

    const dark =
        theme === "dark" ||
        (
            theme === "system" &&
            window
                .matchMedia(
                    "(prefers-color-scheme: dark)"
                )
                .matches
        );


    document.documentElement.classList.toggle(
        "dark",
        dark
    );


    // Sauvegarde locale uniquement
    // pour restaurer rapidement le thème

    localStorage.setItem(
        "theme",
        theme
    );
}


// ======================================================
// NOTIFICATION
// ======================================================

function showToast(
    message,
    error = false
) {

    if (!toast) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.toggle(
        "toast-error",
        error
    );


    toast.classList.add(
        "toast-visible"
    );


    setTimeout(() => {

        toast.classList.remove(
            "toast-visible"
        );

    }, 3000);
}


// ======================================================
// AFFICHER LES PARAMÈTRES
// ======================================================

function displaySettings(s) {

    if (themeLight) {

        themeLight.checked =
            s.theme === "light";

    }


    if (themeDark) {

        themeDark.checked =
            s.theme === "dark";

    }


    if (themeSystem) {

        themeSystem.checked =
            s.theme === "system";

    }


    if (showCompleted) {

        showCompleted.checked =
            s.showCompleted;

    }


    if (showDescription) {

        showDescription.checked =
            s.showDescription;

    }


    if (showPriority) {

        showPriority.checked =
            s.showPriority;

    }


    if (confirmDelete) {

        confirmDelete.checked =
            s.confirmDelete;

    }


    applyTheme(
        s.theme
    );
}


// ======================================================
// CHARGER LES PARAMÈTRES
// ======================================================

async function loadSettings() {

    const settings =
        await getSettings();


    displaySettings(
        settings
    );
}


// ======================================================
// MODIFIER UN PARAMÈTRE
// ======================================================

async function update(
    key,
    value
) {

    try {

        const newSettings = {
            ...currentSettings,
            [key]: value
        };


        await saveSettings(
            newSettings
        );


        showToast(
            "Paramètre enregistré ✅"
        );


    } catch (error) {

        showToast(
            "Erreur lors de l'enregistrement",
            true
        );

    }
}


// ======================================================
// THÈME LIGHT
// ======================================================

themeLight?.addEventListener(
    "change",
    async () => {

        if (themeLight.checked) {

            applyTheme("light");

            await update(
                "theme",
                "light"
            );
        }

    }
);


// ======================================================
// THÈME DARK
// ======================================================

themeDark?.addEventListener(
    "change",
    async () => {

        if (themeDark.checked) {

            applyTheme("dark");

            await update(
                "theme",
                "dark"
            );
        }

    }
);


// ======================================================
// THÈME SYSTEM
// ======================================================

themeSystem?.addEventListener(
    "change",
    async () => {

        if (themeSystem.checked) {

            applyTheme("system");

            await update(
                "theme",
                "system"
            );
        }

    }
);


// ======================================================
// AFFICHAGE
// ======================================================

showCompleted?.addEventListener(
    "change",
    () =>
        update(
            "showCompleted",
            showCompleted.checked
        )
);


showDescription?.addEventListener(
    "change",
    () =>
        update(
            "showDescription",
            showDescription.checked
        )
);


showPriority?.addEventListener(
    "change",
    () =>
        update(
            "showPriority",
            showPriority.checked
        )
);


// ======================================================
// CONFIRMATION SUPPRESSION
// ======================================================

confirmDelete?.addEventListener(
    "change",
    () =>
        update(
            "confirmDelete",
            confirmDelete.checked
        )
);


// ======================================================
// EXPORT
// ======================================================

exportBtn?.addEventListener(
    "click",
    async () => {

        try {

            const response =
                await fetch(
                    `${API_URL}/export`
                );


            if (!response.ok) {

                throw new Error(
                    "Erreur lors de l'export"
                );

            }


            const data =
                await response.json();


            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            data,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;


            link.download =
                "taskflow-backup-2026-08-13.json";


            link.click();


            URL.revokeObjectURL(
                url
            );


            showToast(
                "Données exportées avec succès ✅"
            );


        } catch (error) {

            console.error(
                error
            );


            showToast(
                "Erreur lors de l'export",
                true
            );

        }

    }
);


// ======================================================
// IMPORT
// ======================================================

importFile?.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            async event => {

                try {

                    const data =
                        JSON.parse(
                            event.target.result
                        );


                    if (
                        !Array.isArray(
                            data.tasks
                        ) ||
                        !Array.isArray(
                            data.projects
                        ) ||
                        !Array.isArray(
                            data.members
                        )
                    ) {

                        throw new Error(
                            "Fichier invalide"
                        );

                    }


                    if (
                        !confirm(
                            "Les données actuelles seront remplacées. Continuer ?"
                        )
                    ) {

                        return;
                    }


                    // Pour l'instant :
                    // conserver ton fonctionnement local
                    // pour l'import.

                    localStorage.setItem(
                        "tasks",
                        JSON.stringify(
                            data.tasks
                        )
                    );


                    localStorage.setItem(
                        "projects",
                        JSON.stringify(
                            data.projects
                        )
                    );


                    localStorage.setItem(
                        "members",
                        JSON.stringify(
                            data.members
                        )
                    );


                    if (data.settings) {

                        await saveSettings({
                            ...defaults,
                            ...data.settings
                        });

                    }


                    await loadSettings();


                    showToast(
                        "Données importées avec succès ✅"
                    );


                } catch (error) {

                    console.error(
                        error
                    );


                    showToast(
                        "Fichier JSON invalide",
                        true
                    );

                }


                importFile.value = "";

            };


        reader.readAsText(
            file
        );

    }
);


// ======================================================
// RÉINITIALISATION
// ======================================================

resetBtn?.addEventListener(
    "click",
    async () => {

        if (
            !confirm(
                "⚠️ Toutes les tâches, projets, membres et paramètres seront supprimés. Continuer ?"
            )
        ) {

            return;
        }


        try {

            // Ici on garde les suppressions
            // existantes du frontend.

            localStorage.removeItem(
                "tasks"
            );

            localStorage.removeItem(
                "projects"
            );

            localStorage.removeItem(
                "members"
            );


            // Réinitialiser les paramètres
            // dans MongoDB

            await saveSettings(
                {
                    ...defaults
                }
            );


            await loadSettings();


            showToast(
                "Paramètres réinitialisés ✅"
            );


        } catch (error) {

            console.error(
                error
            );


            showToast(
                "Erreur lors de la réinitialisation",
                true
            );

        }

    }
);


// ======================================================
// THÈME SYSTÈME
// ======================================================

window
    .matchMedia(
        "(prefers-color-scheme: dark)"
    )
    .addEventListener(
        "change",
        () => {

            if (
                currentSettings.theme ===
                "system"
            ) {

                applyTheme(
                    "system"
                );

            }

        }
    );


// ======================================================
// INITIALISATION
// ======================================================

loadSettings();

