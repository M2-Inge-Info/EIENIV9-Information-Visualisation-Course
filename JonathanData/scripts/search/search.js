async function searchAndDisplayArtists() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const artistListDiv = document.getElementById('artistList');
    artistListDiv.innerHTML = ''; // Effacer les résultats précédents

    // Vérifiez si globalData est vide, si c'est le cas, chargez les données
    if (globalData.length === 0) {
        await fetchData();
    }

    // Utilisez globalData pour effectuer votre recherche
    const artistResults = globalData.filter(artist => 
        artist.artist.toLowerCase().includes(searchInput) ||
        artist.equipments.favorite.product_name.toLowerCase().includes(searchInput) ||
        artist.equipments.others.some(equipment => equipment.product_name.toLowerCase().includes(searchInput))
    );

    // Affichez les résultats dans artistListDiv
    if (artistResults.length > 0) {
        artistResults.forEach(artist => {
            const matchedEquipments = [
                artist.equipments.favorite.product_name,
                ...artist.equipments.others.map(equipment => equipment.product_name)
            ].filter(equipmentName => equipmentName.toLowerCase().includes(searchInput));

            const artistCard = document.createElement('div');
            artistCard.className = 'col-md-3 card mt-2';
            artistCard.innerHTML = `<div class="card-body">
                                        <h5 class="card-title">${artist.artist}</h5>
                                        <p class="card-text">Équipements correspondants : ${matchedEquipments.join(', ')}</p>
                                        <button class="btn btn-primary" id="${artist.artist_node}">Voir plus</button>
                                    </div>`;
            artistListDiv.appendChild(artistCard);

            // Ajouter l'écouteur d'événements
            document.getElementById(artist.artist_node).addEventListener('click', function() {
                dAD(artist.artist_node);
            });
        });
    } else {
        artistListDiv.innerHTML = '<p>Aucun artiste ou équipement trouvé correspondant à la recherche.</p>';
    }
}

function dAD(artistNode) {
    console.log("logl")
    // const data = await fetchData();
    const artist = globalData.find(a => a.artist_node === artistNode);
    const artistDetailsDiv = document.getElementById('artistDetailsSearch');
    console.log(artist)

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