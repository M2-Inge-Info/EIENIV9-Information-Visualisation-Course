function showArtistsUsingInstrument(category, instrument) {
    console.log(category)
    console.log(instrument)
    // Charger les données depuis le fichier JSON
    d3.json("final_data.json").then(dataJson => {
        const data = dataJson
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
                        displayArtistDetails(artistData.artist_node, data);
                    });
            });
        } else {
            alert(`Aucun artiste trouvé utilisant ${instrument} dans la catégorie ${category}.`);
        }
    }).catch(error => {
        console.error("Erreur lors du chargement des données:", error);
    });
}

async function displayArtistDetails(artistNode, data) {
    // const data = await fetchData();
    const artist = data.find(a => a.artist_node === artistNode);
    const artistDetailsDiv = document.getElementById('artistDetails');

    if (!artistDetailsDiv) {
        console.error("L'élément avec l'ID 'artistDetails' n'existe pas dans le DOM.");
        return;
    }

    if (artist) {
        // Informations de l'artiste
        let artistInfoHtml = '<h2 class="mb-4">Informations sur l\'artiste</h2>';
        artistInfoHtml += '<div class="card mb-4"><div class="card-body">';
        Object.entries(artist.informations).forEach(([key, value]) => {
            artistInfoHtml += `<p class="mb-2"><strong class="text-capitalize">${key.replace('_', ' ')}:</strong> ${value}</p>`;
        });
        artistInfoHtml += '</div></div>';
        artistDetailsDiv.innerHTML = artistInfoHtml;

        // Équipement favori
        artistDetailsDiv.innerHTML += `<div class="mb-4"><h3>Équipement Favori</h3><p>${artist.equipments.favorite.product_name}</p><img src="${artist.equipments.favorite.product_img}" alt="${artist.equipments.favorite.product_name}" class="img-fluid rounded"></div>`;

        // Autres équipements
        const otherEquipmentHtml = artist.equipments.others.map(equipment => {
            return `<div class="col-md-3 card mt-2 mb-4">
                        <div class="card-body">
                            <p class="card-text">${equipment.product_name}</p>
                            <img src="${equipment.product_img}" alt="${equipment.product_name}" class="img-fluid rounded">
                        </div>
                    </div>`;
        }).join('');

        artistDetailsDiv.innerHTML += `<div class="mb-4"><h3 class="mb-3">Autres Équipements</h3><div class="row">${otherEquipmentHtml}</div></div>`;

        // Set the search input to the artist's name and trigger the input event
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = artist.artist;
            searchInput.dispatchEvent(new Event('input'));
        }
    } else {
        artistDetailsDiv.innerHTML = '<p>Artiste non trouvé</p>';
    }
}
