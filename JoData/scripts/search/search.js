async function fetchData() {
    const response = await fetch('final_data.json');
    const data = await response.json();
    return data;
}

async function searchAndDisplayArtists() {
    const data = await fetchData();
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const artistListDiv = document.getElementById('artistList');
    artistListDiv.innerHTML = ''; // Clear previous results

    // Search for artists and instruments
    const artistResults = data.filter(a => a.artist.toLowerCase().includes(searchInput));
    const instrumentResults = data.flatMap(a => [...a.equipments.others, a.equipments.favorite])
                                  .filter(e => e.product_name.toLowerCase().includes(searchInput));

    // Display artists
    artistResults.forEach(artist => {
        const artistCard = document.createElement('div');
        artistCard.className = 'col-md-3 card mt-2';
        artistCard.innerHTML = `<div class="card-body"><h5 class="card-title">${artist.artist}</h5><button class="btn btn-primary" onclick="displayArtistDetails('${artist.artist_node}')">Voir plus</button></div>`;
        artistListDiv.appendChild(artistCard);
    });

    // Track instruments to avoid duplicates
    const addedInstruments = new Set();

    // Display instruments
    instrumentResults.forEach(instrument => {
        if (!addedInstruments.has(instrument.product_name)) {
            const instrumentCard = document.createElement('div');
            instrumentCard.className = 'col-md-3 card mt-2';
            instrumentCard.innerHTML = `<div class="card-body"><h5 class="card-title">${instrument.product_name}</h5><img src="${instrument.product_img}" alt="${instrument.product_name}" style="width: 100px; height: 100px;"><button class="btn btn-primary mt-2" onclick="showArtistsUsingInstrument('${instrument.product_type}', '${instrument.product_name}')">Artistes qui utilisent</button></div>`;
            artistListDiv.appendChild(instrumentCard);

            // Add to the set to avoid duplicates
            addedInstruments.add(instrument.product_name);
        }
    });
}


async function displayArtistDetails(artistNode) {
    const data = await fetchData();
    const artist = data.find(a => a.artist_node === artistNode);
    const artistDetailsDiv = document.getElementById('artistDetails');
    const searchInput = document.getElementById('searchInput');

    // Display artist details
    if (artist) {
        artistDetailsDiv.innerHTML = `<h2>${artist.artist}</h2><p>${artist.informations.abstract || ''}</p>`;
        artistDetailsDiv.innerHTML += `<h3>Équipement Favori</h3><p>${artist.equipments.favorite.product_name}</p><img src="${artist.equipments.favorite.product_img}" alt="${artist.equipments.favorite.product_name}">`;
        artistDetailsDiv.innerHTML += `<h3>Autres Équipements</h3>`;
        artist.equipments.others.forEach(equipment => {
            artistDetailsDiv.innerHTML += `<p>${equipment.product_name}</p><img src="${equipment.product_img}" alt="${equipment.product_name}">`;
        });

        // Set the search input to the artist's name and trigger the input event
        searchInput.value = artist.artist;
        searchInput.dispatchEvent(new Event('input'));
    } else {
        artistDetailsDiv.innerHTML = '<p>Artiste non trouvé</p>';
    }
}


// Charger les données depuis le fichier JSON
d3.json("final_data.json").then(data => {
    // Filtrer les données pour s'assurer que toutes les propriétés nécessaires sont présentes
    const filteredData = data.filter(d => d.informations && d.informations.subject);

    // Préparer les données pour le diagramme en donut
    const genres = d3.rollups(filteredData, v => v.length, d => d.informations.subject);
    const pieData = genres.map(([key, value]) => ({ key, value }));

    // Créer le diagramme en donut
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(radius - 100).outerRadius(radius);

    const g = svg.selectAll(".arc")
        .data(pie(pieData))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", d => color(d.data.key))
        .on("click", function(event, d) {
            displayEquipment(d.data.key);
        });

    g.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(d => d.data.key);

    // Fonction pour afficher les équipements pour un genre musical donné
    function displayEquipment(genre) {
        const equipmentListDiv = d3.select("#equipment-list");
        equipmentListDiv.html(`<h3>${genre}</h3>`);

        const artists = data.filter(d => d.informations && d.informations.subject === genre);
        artists.forEach(artist => {
            equipmentListDiv.append("p").text(`Artist: ${artist.artist}`);
            equipmentListDiv.append("p").text(`Favorite Equipment: ${artist.equipments.favorite.product_name}`);
            equipmentListDiv.append("img").attr("src", artist.equipments.favorite.product_img).attr("width", 100);
            equipmentListDiv.append("hr");
        });
    }
}).catch(error => {
    console.error("Erreur lors du chargement des données:", error);
});