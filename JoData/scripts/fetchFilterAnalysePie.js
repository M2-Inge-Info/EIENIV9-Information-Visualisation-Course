// Définir le SVG et le groupe une seule fois, en dehors de la fonction fetchDataAndVisualize
const width = 300;
const height = 300;
const radius = Math.min(width, height) / 2;
const color = d3.scaleOrdinal(d3.schemeCategory10);
const pie = d3.pie().value(d => d.count);
const path = d3.arc().outerRadius(radius).innerRadius(radius - 50);

const svg = d3.select("#donut-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


async function fetchDataAndVisualize() {
    const response = await fetch('final_data.json');
    const data = await response.json();

    const gender = document.getElementById("genderFilter").value;
    const startDate = document.getElementById("yearFilter").value;

    // ... (le reste de votre code reste le même jusqu'à la création de pieData)
    const filteredData = data.filter(artist => 
        artist.informations &&
        (!gender || artist.informations.gender === gender) &&
        (!startDate || artist.informations.startDate >= startDate)
    );

    const favoriteEquipments = filteredData.map(artist => artist.equipments.favorite);

    // Créer un objet pour compter la fréquence de chaque type d'équipement
    const equipmentFrequency = {};
    favoriteEquipments.forEach(equipment => {
        const type = equipment.product_type;
        equipmentFrequency[type] = (equipmentFrequency[type] || 0) + 1;
    });

    // Créer un tableau de données pour le graphique circulaire
    const pieData = Object.entries(equipmentFrequency).map(([key, value]) => ({
        type: key,
        count: value
    }));

    // Mettre à jour les arcs du graphique circulaire
    const arc = svg.selectAll(".arc")
        .data(pie(pieData))
        .join("g")
        .attr("class", "arc");

    arc.selectAll("path")
        .data(d => [d])
        .join("path")
        .attr("d", path)
        .attr("fill", d => color(d.data.type));

    arc.selectAll("text")
        .data(d => [d])
        .join("text")
        .attr("transform", d => "translate(" + path.centroid(d) + ")")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(d => d.data.type);

    // Afficher la liste d'équipements
    const equipmentListDiv = document.getElementById("equipment-list");
    equipmentListDiv.innerHTML = ""; // Effacer la liste précédente

    // Créer une div pour contenir les cartes avec un défilement vertical
    const scrollableDiv = document.createElement("div");
    scrollableDiv.style.maxHeight = "400px";  // Ajustez la hauteur maximale comme vous le souhaitez
    scrollableDiv.style.overflowY = "auto";
    scrollableDiv.style.padding = "10px";
    scrollableDiv.style.border = "1px solid #ddd";  // Optionnel: Ajouter une bordure
    scrollableDiv.style.borderRadius = "5px";  // Optionnel: Ajouter un bord arrondi

    favoriteEquipments.forEach(equipment => {
        const card = document.createElement("div");
        card.classList.add("card", "mb-3");
        
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = equipment.product_name;
        
        const cardSubtitle = document.createElement("h6");
        cardSubtitle.classList.add("card-subtitle", "mb-2", "text-muted");
        cardSubtitle.textContent = equipment.product_type;
        
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardSubtitle);
        card.appendChild(cardBody);
        scrollableDiv.appendChild(card);
    });

    equipmentListDiv.appendChild(scrollableDiv);

}

const genderFilter = document.getElementById("genderFilter");
const yearFilter = document.getElementById("yearFilter");

// Ajouter des gestionnaires d'événements pour mettre à jour la visualisation lors de la modification des filtres
genderFilter.addEventListener("change", fetchDataAndVisualize);
yearFilter.addEventListener("change", fetchDataAndVisualize);


// Appeler la fonction lors du chargement de la page
fetchDataAndVisualize();