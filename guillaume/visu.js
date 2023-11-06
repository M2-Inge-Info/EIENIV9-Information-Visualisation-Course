
  const width = 1920;
  const height = 1080;

  

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const svg = d3.create("svg")
      .attr("width", "80%")
      .attr("height", "80%")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");



    svg.append("rect")
  .attr("width", "100%") // Utilisez 100% pour occuper toute la largeur de la fenêtre
  .attr("height", "100%") // Utilisez 100% pour occuper toute la hauteur de la fenêtre
  .attr("fill", "black");

  // Ajoutez un groupe (g) pour contenir tous les éléments de la visualisation
const g = svg.append("g");

// ...

const zoom = d3.zoom()
  .scaleExtent([0.001, 1000]) // Plage de zoom
  .on("zoom", zoomed);

// Appliquez la fonction de zoom à l'élément SVG
svg.call(zoom);

// Fonction pour gérer le zoom
function zoomed(event) {
  g.attr("transform", event.transform);
}




  document.getElementById("container").appendChild(svg.node());

  d3.json("data_d3.json").then(function (data) {
    d3.json("genre_counts.json").then(function (genreCount) {

    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    const genres = Object.keys(genreCount);

      
    

    nodes.forEach(node => {node.neighbors = new Set(node.related_artist)});


        // Créez une échelle linéaire pour la taille des nœuds en fonction de nb_fans.
    const nodeSizeScaleFans = d3.scaleLog()
        .domain([1, d3.max(nodes, d => d.nb_fans)])
        .range([0.05, 20]);

    // Créez une échelle linéaire pour la taille des nœuds en fonction de pagerank.
    const nodeSizeScalePageRank = d3.scaleLinear()
        .domain([d3.min(nodes, d => d.pagerank), d3.max(nodes, d => d.pagerank)])
        .range([0.5, 20]);

    const toggleSwitch = document.getElementById("toggleSwitch");
    let usePagerankSize = false;

    toggleSwitch.addEventListener("change", function () {
    usePagerankSize = !usePagerankSize;
    updateNodeSizesWithTransition();
    updateNodePositions()
    });

    function updateNodePositions() {
  // Itérez sur les nœuds et ajustez leurs positions en fonction de leur taille
  nodes.forEach(node => {
    // Nouvelle position x et y en fonction de la taille du nœud
    const newX = node.x + Math.random() * 10; // Exemple, vous pouvez ajuster cette logique
    const newY = node.y + Math.random() * 10; // Exemple, vous pouvez ajuster cette logique

    // Assurez-vous que la nouvelle position reste à l'intérieur des limites de l'écran
    node.x = Math.max(0, Math.min(width, newX));
    node.y = Math.max(0, Math.min(height, newY));
  });

  // Mettez à jour les positions des nœuds dans la simulation de force
  simulation.nodes(nodes).alpha(1).restart();
}


    function updateNodeSizesWithTransition() {
    const sizeScale = usePagerankSize ? nodeSizeScalePageRank : nodeSizeScaleFans;

    // Créez une transition pour la mise à jour de la taille des nœuds.
    node.transition()
        .duration(500) // Durée de la transition en millisecondes
        .attr("r", d => sizeScale(usePagerankSize ? d.pagerank : d.nb_fans))
        .on("end", function () {
        // La transition est terminée.
        // Vous pouvez ajouter des actions supplémentaires ici si nécessaire.
        });
    }




    // Fonction pour mettre à jour les tailles des nœuds en fonction de l'état actuel.
    function updateNodeSizes() {
        const sizeScale = usePagerankSize ? nodeSizeScalePageRank : nodeSizeScaleFans;

        // Met à jour la taille des nœuds en fonction de la nouvelle échelle.
        node.attr("r", d => sizeScale(usePagerankSize ? d.pagerank : d.nb_fans));
    }

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.node))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

        const nodeGroup = svg.append("g");

    
        const link = svg.append("g")
    .attr("stroke", "none") // Supprimez la couleur de trait
  .selectAll()
  .data(links)
  .enter()
  .append("line")
    .attr("stroke-width", d => Math.sqrt(d.value))
    .attr("stroke", function (d) {
      // Créez un dégradé de couleur du lien en fonction de la source et de la cible
      const sourceColor = d3.color(color(d.source.popular_genre));
      const targetColor = d3.color(color(d.target.popular_genre));

      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradient-" + d.index)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", sourceColor.toString());

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", targetColor.toString());

      return `url(#gradient-${d.index})`;
    });


    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .enter()
    .append("circle")
        .attr("r", d => nodeSizeScaleFans(d.nb_fans)) // Utilisez l'échelle logarithmique pour définir la taille en fonction de nb_fans
        .attr("fill", d => d3.color(color(d.popular_genre)).copy({ opacity: 0.6 })); // Ajoutez la transparence ici

    node.append("title")
        .text(d => d.node);


    // Ajoutez des événements de survol aux nœuds
    node.on("mouseover", function (event, d) {

    // Réglez l'opacité des nœuds en fonction du survol
    node.transition()
        .duration(200)
        .attr("opacity", d2 => (d2 === d ? 1 :  (d.neighbors.has(d2.node) ? 0.8 : 0.2))); // Nœuds voisins à 0.8, les autres à 0.2

    // Réglez l'opacité des liens en fonction du survol
    link.transition()
        .duration(200)
        .attr("opacity", link => (link.source === d || link.target === d ? 1 : 0.2)); // Liens vers des nœuds voisins à 0.8, les autres à 0.2

    // Affichez les informations du nœud (genres et nb_fans) à un emplacement souhaité
    const infoBox = document.getElementById("infoBox");
    infoBox.innerHTML = `
        <h2>${d.node}</h2>
        <div>Genres: ${d.genres.map(genre => `<span style="color: ${getColorForGenre(genre)}">${genre}</span>`).join(', ')}</div>
        <div>Fans: ${d.nb_fans}</div>
        <div>Voisins:</div>
        <ul>
        ${Array.from(d.neighbors).map(neighbor => `<li>${neighbor}</li>`).join('')}
        </ul>
    `;
});

// Gestionnaire d'événement pour le bouton de recherche
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", function () {
    const searchTerm = document.getElementById("nodeSearch").value.toLowerCase();

    // Recherchez le nœud correspondant au terme de recherche
    const matchingNode = nodes.find(node => node.node.toLowerCase() === searchTerm);

    if (matchingNode) {
        // Simulez un clic sur le nœud correspondant
        subgraph(matchingNode);    }
});


    // Rétablissez l'opacité normale des nœuds et des liens lorsqu'on ne survole plus un nœud
    node.on("mouseout", function () {
    // Rétablissez l'opacité normale de tous les nœuds
    node.transition()
        .duration(200)
        .attr("opacity", 1);

    // Rétablissez l'opacité normale de tous les liens
    link.transition()
        .duration(200)
        .attr("opacity", 0.6); // Réglez la valeur d'opacité par défaut des liens

    // Effacez les informations du nœud
    const infoBox = document.getElementById("infoBox");
    infoBox.innerHTML = "";
    });

    node.call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));


      
    // Triez les genres en fonction du comptage
const sortedGenres = Object.keys(genreCount).sort((a, b) => genreCount[b] - genreCount[a]);

// Créez des boutons triés pour chaque genre
const legendContainer = document.getElementById("genre-list");
sortedGenres.forEach(genre => {
    const genreButton = document.createElement("button");
    genreButton.textContent = genre;
    genreButton.style.backgroundColor = getColorForGenre(genre); // Utilisez la couleur associée dans D3
    legendContainer.appendChild(genreButton);
});

// Associez des événements aux boutons pour le filtrage avec sélection multiple
const genreButtons = document.querySelectorAll("#genre-list button");
genreButtons.forEach(button => {
    button.addEventListener("click", toggleGenreFilter);
});

// function toggleGenreFilter(event) {
//     const isActive = event.target.classList.toggle("active");

//     // Filtrer les nœuds en fonction des boutons sélectionnés
//     node.attr("display", d => {
//         const selectedGenres = Array.from(document.querySelectorAll("#genre-list button.active")).map(button => button.textContent);
//         return selectedGenres.length === 0 || selectedGenres.some(selectedGenre => d.genres.includes(selectedGenre)) ? "block" : "none";
//     });
// }

// Créez une copie de sauvegarde des nœuds et des liens
let nodesBackup = [...nodes];
let linksBackup = [...links];

function toggleGenreFilter(event) {
    const isActive = event.target.classList.toggle("active");
    const activeButtons = document.querySelectorAll("#genre-list button.active");
    const selectedGenres = Array.from(activeButtons).map(button => button.textContent);

    // Filtrer les nœuds et les liens en fonction des genres sélectionnés
    const filteredNodes = selectedGenres.length === 0 ? nodes : nodes.filter(node => selectedGenres.some(genre => node.genres.includes(genre)));
    const filteredNodeIds = new Set(filteredNodes.map(node => node.node));
    const filteredLinks = selectedGenres.length === 0 ? links : links.filter(link => filteredNodeIds.has(link.source.node) && filteredNodeIds.has(link.target.node));

    // Mettez à jour la simulation avec les nœuds et les liens filtrés
    simulation.nodes(filteredNodes);
    simulation.force("link", d3.forceLink(filteredLinks).id(d => d.node));

    // Affichez uniquement les nœuds et les liens filtrés
    node.attr("display", d => selectedGenres.length === 0 || filteredNodeIds.has(d.node) ? "block" : "none");
    link.attr("display", d => selectedGenres.length === 0 || (filteredNodeIds.has(d.source.node) && filteredNodeIds.has(d.target.node)) ? "block" : "none");

    // Redémarrez la simulation
    simulation.alpha(1).restart();
}


function getColorForGenre(genre) {
    return d3.color(color(genre)).toString();
}
    

    function ticked() {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    }

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }


    function subgraph(d){
        const k = parseInt(document.getElementById("distanceSlider").value);
    
        // Calculez les nœuds à une distance maximale k
        const nodesToShow = []; // Les nœuds à montrer
    
        // Utilisez une fonction récursive pour parcourir les voisins à une distance maximale k
        function findNodes(node, depth) {
            if (depth <= k) {
                nodesToShow.push(node);
                node.neighbors.forEach(neighbor => {
                    if (!nodesToShow.includes(neighbor)) {
                        findNodes(nodes.find(n => n.node === neighbor), depth + 1);
                    }
                });
            }
        }
    
        findNodes(d, 0);
    
        // Calculez les liens entre les nœuds à une distance maximale k
        const linksToShow = links.filter(link => nodesToShow.includes(nodes.find(n => n.node === link.source.node)) && nodesToShow.includes(nodes.find(n => n.node === link.target.node)));
    
        // Mettez à jour l'affichage avec les nœuds et les liens calculés
        node.attr("display", d => nodesToShow.includes(d) ? "block" : "none");
        link.attr("display", link => linksToShow.includes(link) ? "block" : "none");
        node.style("opacity", d2 => d2 == d ? 1 : 0.8); // Opacité de 1 si le nœud est dans nodesToShow, sinon opacité de 0
        link.style("opacity", link => linksToShow.includes(link) ? 1 : 0); // Opacité de 1 si le lien est dans linksToShow, sinon opacité de 0
    };

node.on("click", function (event, d) {
    subgraph(d);
})


// Gestionnaire d'événement pour la barre de défilement
const distanceSlider = document.getElementById("distanceSlider");
const distanceValue = document.getElementById("distanceValue");
distanceSlider.addEventListener("input", function () {
    const k = parseInt(distanceSlider.value);
    distanceValue.textContent = k;
});




    // Définir les limites de la zone de visualisation
    const minX = 0;
    const minY = 0;
    const maxX = width;
    const maxY = height;

    // Créer les forces forceX et forceY pour maintenir les nœuds à l'intérieur des limites
    const forceX = d3.forceX(width/2).strength(0.1);
    const forceY = d3.forceY(height/1.5).strength(0.1);

    // Ajouter les forces de barrière à la simulation
    simulation.force("x", forceX);
    simulation.force("y", forceY);

    // Définir les limites des positions x et y des nœuds
    nodes.forEach(node => {
    node.x = Math.max(minX, Math.min(maxX, node.x));
    node.y = Math.max(minY, Math.min(maxY, node.y));
    });

  });
  });