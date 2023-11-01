// JavaScript
function showArtistsUsingInstrument(category, instrument) {
    // Charger les données depuis le fichier JSON
    d3.json("data/sorted_data.json").then(dataJson => {
        // Accéder à la catégorie correspondante dans les données
        const items = dataJson[category];

        // Vérifier si la catégorie a été trouvée
        if (!items) {
            alert(`Catégorie ${category} non trouvée dans les données.`);
            return;
        }

        const artists = items.filter(item => item.product_name === instrument)
                             .map(item => item.artist);

        // Afficher les artistes
        const listContainer = d3.select("#artist-list");
        listContainer.html(""); // Vider le conteneur

        if (artists.length > 0) {
            artists.forEach(artist => {
                const card = listContainer.append("div")
                    .attr("class", "card col-md-4 mt-2")
                    .style("width", "18rem");

                card.append("div")
                    .attr("class", "card-body")
                    .append("h5")
                    .attr("class", "card-title")
                    .text(artist);

                card.select(".card-body")
                    .append("button")
                    .attr("class", "btn btn-primary")
                    .text("Voir plus")
                    .on("click", function() {
                        // Ici, vous pouvez ajouter du code pour afficher plus d'informations sur l'artiste sélectionné
                        alert(`Vous avez cliqué sur ${artist}`);
                    });
            });
        } else {
            alert(`Aucun artiste trouvé utilisant ${instrument} dans la catégorie ${category}.`);
        }
    }).catch(error => {
        console.error("Erreur lors du chargement des données:", error);
    });
}