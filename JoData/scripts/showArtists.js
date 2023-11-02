function showArtistsUsingInstrument(category, instrument) {
    // Charger les données depuis le fichier JSON
    d3.json("final_data.json").then(dataJson => {
        const artists = dataJson.filter(item => item.equipments.favorite.product_type === category && item.equipments.favorite.product_name === instrument);

        // Afficher les artistes
        const listContainer = d3.select("#artist-list");
        listContainer.html(""); // Vider le conteneur

        if (artists.length > 0) {
            artists.forEach(artistData => {
                const card = listContainer.append("div")
                    .attr("class", "card col-md-4 mt-2")
                    .style("width", "18rem");

                card.append("div")
                    .attr("class", "card-body")
                    .append("h5")
                    .attr("class", "card-title")
                    .text(artistData.artist);

                card.select(".card-body")
                    .append("p")
                    .attr("class", "card-text")
                    .text(`Équipement Favori: ${artistData.equipments.favorite.product_name}`);

                card.select(".card-body")
                    .append("button")
                    .attr("class", "btn btn-primary")
                    .text("Voir plus")
                    .on("click", function() {
                        displayArtistDetails(artistData.artist_node);
                    });
            });
        } else {
            alert(`Aucun artiste trouvé utilisant ${instrument} dans la catégorie ${category}.`);
        }
    }).catch(error => {
        console.error("Erreur lors du chargement des données:", error);
    });
}

async function displayArtistDetails(artistNode) {
    const data = await d3.json("final_data.json");
    const artist = data.find(a => a.artist_node === artistNode);

    if (artist) {
        const artistInfoDiv = d3.select('#artistInfo');
        const favoriteEquipmentDiv = d3.select('#favoriteEquipment');
        const otherEquipmentDiv = d3.select('#otherEquipment');

        // Affichage des informations de l'artiste
        artistInfoDiv.html(`<h2>${artist.artist}</h2><p>${artist.informations?.gender || 'Aucune information disponible'}</p>`);

        // Affichage de l'équipement favori
        favoriteEquipmentDiv.html(`<h3>Équipement Favori</h3><div class="row"><div class="col-md-3"><div class="card" style="width: 250px; height: 200px;"><div class="card-body"><p>${artist.equipments.favorite.product_name}</p></div><img src="${artist.equipments.favorite.product_img}" alt="${artist.equipments.favorite.product_name}" class="card-img-bottom"></div></div></div>`);

        // Affichage des autres équipements
        otherEquipmentDiv.html('<h3>Autres Équipements</h3><div class="row" id="otherEquipmentGrid"></div>');
        const otherEquipmentGrid = d3.select('#otherEquipmentGrid');
        artist.equipments.others.forEach(equipment => {
            const card = otherEquipmentGrid.append('div')
                .attr('class', 'col-md-3')
                .append('div')
                .attr('class', 'card')
                .style('width', '250px')
                .style('height', '250px');
            
            card.append('div')
                .attr('class', 'card-body')
                .append('p')
                .text(equipment.product_name);

            card.append('img')
                .attr('src', equipment.product_img)
                .attr('alt', equipment.product_name)
                .attr('class', 'card-img-bottom');
        });
    }
}
