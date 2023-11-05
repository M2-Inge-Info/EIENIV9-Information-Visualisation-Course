let globalData = [];  // Déclaration de la variable globale pour stocker les données

async function fetchData() {
    try {
        const response = await fetch('final_data.json');
        const data = await response.json();
        globalData = data;  // Stocker les données dans globalData
        return data
    } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
    }
}