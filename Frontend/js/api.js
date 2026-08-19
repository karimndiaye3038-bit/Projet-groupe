// ======================================================
// TASKFLOW PRO
// API - COMMUNICATION AVEC LE BACKEND
// ======================================================

const API_URL = "https://taskflow-pro-u5yu.onrender.com/api";

// ======================================================
// RÉCUPÉRER LES PROJETS
// ======================================================

async function getProjectsFromAPI() {

    const response = await fetch(
        `${API_URL}/projects`
    );

    if (!response.ok) {
 
        throw new Error(
            `Erreur HTTP : ${response.status}`
        );

    }

    return await response.json();

}


// ======================================================
// CRÉER UN PROJET
// ======================================================

async function createProjectAPI(project) {

    const response = await fetch(
        `${API_URL}/projects`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(project)
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Erreur lors de la création du projet."
        );

    }

    return data;

}


// ======================================================
// MODIFIER UN PROJET
// ======================================================

async function updateProjectAPI(
    id,
    project
) {

    const response = await fetch(
        `${API_URL}/projects/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(project)
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Erreur lors de la modification."
        );

    }

    return data;

}


// ======================================================
// SUPPRIMER UN PROJET
// ======================================================

async function deleteProjectAPI(id) {

    const response = await fetch(
        `${API_URL}/projects/${id}`,
        {
            method: "DELETE"
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Erreur lors de la suppression."
        );

    }

    return data;

}


// ======================================================
// ARCHIVER UN PROJET
// ======================================================

async function archiveProjectAPI(id) {

    const response = await fetch(
        `${API_URL}/projects/${id}/archive`,
        {
            method: "PATCH"
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Erreur lors de l'archivage."
        );

    }

    return data;

}


// ======================================================
// TEST BACKEND
// ======================================================

async function testBackend() {

    try {

        const response =
            await fetch(
                `${API_URL}/projects`
            );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }

        console.log(
            "Backend connecté ✅"
        );

    } catch (error) {

        console.error(
            "Backend non connecté ❌",
            error
        );

    }

}

testBackend();