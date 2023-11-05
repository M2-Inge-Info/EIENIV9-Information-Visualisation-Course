  // Fonction pour obtenir les données de la catégorie
  function getCategoryData(data, category) {
    return Object.entries(data[category].instruments).map(([name, count]) => {
      return { name, count };
    });
  }