// Fonction pour extraire les données de la catégorie sélectionnée
function getCategoryData(dataJson, category) {
    const categoryData = dataJson[category];
    return Object.keys(categoryData).map(name => ({ name, value: categoryData[name] }));
}