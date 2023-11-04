const margin = { top: 100, right: 30, bottom: 40, left: 200 },
      width = 1200 - margin.left - margin.right,
      height = 5000 - margin.top - margin.bottom;

const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleBand().range([height, 0]).padding(0.1);

const colors = d3.scaleOrdinal()
  .domain(['<1970', '1970-1980', '1980-1990', '1990-2000', '2000-2010', '2010-2020', '>2020'])
  .range(['rgba(230, 57, 70, 0.8)', 'rgba(244, 162, 97, 0.8)', 'rgba(252, 191, 73, 0.8)', 'rgba(252, 236, 87, 0.8)', 'rgba(153, 217, 140, 0.8)', 'rgba(82, 182, 154, 0.8)', 'rgba(69, 123, 157, 0.8)']);

const svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

let stackedData = [];

d3.csv("src/data/quentin_population_album.csv").then(function (data) {
  const groupByGenre = d3.group(data, d => d.Genre);
  const dataSum = Array.from(groupByGenre, ([key, value]) => {
    const sumByYear = Array.from(d3.group(value, d => d.année), ([key, value]) => ({
      key,
      value: d3.sum(value, d => d["Nombre d'albums"])
    }));
    const result = { Genre: key };
    sumByYear.forEach(({ key, value }) => {
      result[key] = value;
    });
    return result;
  });

  stackedData = dataSum;

  drawLegend();
  updateChart();
});



let albumData = [];

d3.csv("src/data/quentin_data_artistsUnique.csv").then(function (data) {
  albumData = data;
});




function createColorCheckboxes() {
  const container = d3.select("#color-checkboxes");
  colors.domain().forEach(year => {
      let div = container.append("div");
      div.append("input")
          .attr("type", "checkbox")
          .attr("id", "checkbox-" + year.replace(/[><]/g, ""))
          .attr("checked", true)
          .on("change", updateChart);
      div.append("label")
          .attr("for", "checkbox-" + year.replace(/[><]/g, ""))
          .text(year);
  });
}




let infoBox = d3.select("body")
    .append("div")
    .attr("class", "infobox")
    .style("position", "absolute")
    .style("padding", "10px")
    .style("background", "rgba(255, 255, 255, 0.9)")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("visibility", "hidden")
    .style("max-width", "250px")
    .style("word-wrap", "break-word");

    function showInfoBox(event, genre, year, albumCount, htmlContent) {
        if (htmlContent) {
          infoBox.html(htmlContent);
        } else {
        console.log("Genre: ", genre);
        console.log("Année: ", year);
        console.log("Nombre d'albums: ", albumCount);
    
        let x = event.pageX;
        let y = event.pageY;
    
        // Afficher temporairement l'infobox pour calculer sa largeur
        infoBox.style("visibility", "visible");
    
        let infoBoxWidth = infoBox.node().getBoundingClientRect().width;
        let pageWidth = window.innerWidth;
    
        // Si l'infobox dépasse la largeur de la page, ajustez la position X
        if (x + infoBoxWidth + 30 > pageWidth) {
            x = x - infoBoxWidth - 20;
        }
    
        infoBox
            .style("left", x + 10 + "px")
            .style("top", y + 10 + "px")
            .html(`
                <strong>Genre:</strong> ${genre}<br>
                <strong>Année:</strong> ${year}<br>
                <strong>Nombre d'albums:</strong> ${albumCount}
            `);
    }
}

    function hideInfoBox() {
        infoBox.style("visibility", "hidden");
    }







    let clickPopup = d3.select("body")
    .append("div")
    .attr("class", "click-popup")
    .style("position", "absolute")
    .style("padding", "10px")
    .style("background", "white")
    .style("border", "1px solid black")
    .style("visibility", "hidden");

    clickPopup.append("span")
    .attr("class", "close-btn")
    .style("position", "absolute")
    .style("top", "0")
    .style("right", "5px")
    .style("cursor", "pointer")
    .style("font-size", "16px") // Assurez-vous que la taille de la police est assez grande
    .style("font-weight", "bold") // Rendre la croix plus visible
    .text("x")
    .on("click", function() {
        hideClickPopup();
        d3.selectAll(".bar").style("stroke", null).style("stroke-width", null);
    });
    




  
    function hideClickPopup() {
      d3.select('.click-popup')
        .style('visibility', 'hidden');
    }

    

    function showClickPopup(event, genre) {
      let x = event.pageX + 20; // Ajoutez une valeur pour déplacer à droite
      let y = event.pageY;
  
      // Effacez le contenu précédent de la fenêtre contextuelle
      clickPopup.html("");
  
      // Ajoutez le bouton de fermeture
      clickPopup.append("span")
          .attr("class", "close-btn")
          .style("position", "absolute")
          .style("top", "0")
          .style("right", "5px")
          .style("cursor", "pointer")
          .style("font-size", "16px")
          .style("font-weight", "bold")
          .text("x")
          .on("click", function() {
            hideClickPopup();
            d3.selectAll(".bar").style("stroke", null).style("stroke-width", null);
            d3.select('.albums-popup').style("visibility", "hidden");  // Cacher la fenêtre contextuelle des albums
        });
  
      // Affichez la liste des albums pour le genre sélectionné
      showAlbumTitles(genre);
  
      // Affichez la fenêtre contextuelle
      clickPopup
          .style("left", x + "px")
          .style("top", y + "px")
          .style("visibility", "visible");
  }






function updateChart() {
  svg.selectAll("*").remove();

  let sortOrder = d3.select("#sortOrder").node().value;
  let numRows = d3.select("#numRows").node().value;

  if (numRows === "all") {
    numRows = stackedData.length;
  } else {
    numRows = parseInt(numRows);
  }

  // Tri selon l'ordre choisi
  switch (sortOrder) {
    case "alpha":
      stackedData.sort((a, b) => d3.ascending(a.Genre, b.Genre));
      break;
    case "desc": 
      stackedData.sort((a, b) => d3.descending(d3.sum(Object.values(a)), d3.sum(Object.values(b))));
      break;
    case "asc": 
      stackedData.sort((a, b) => d3.ascending(d3.sum(Object.values(a)), d3.sum(Object.values(b))));
      break;
  }

  let checkedYears = [];
  colors.domain().forEach(year => {
    if (d3.select("#checkbox-" + year.replace(/[><]/g, "")).property("checked")) {
      checkedYears.push(year);
    }
  });

  // Pour avoir les `n` premiers éléments en haut, nous filtrons après le tri
  let displayData = stackedData.slice(0, numRows);

  y.domain(displayData.map(d => d.Genre).reverse());
  x.domain([0, d3.max(displayData, d => d3.sum(checkedYears, key => d[key] || 0))]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisTop(x));

  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));

  // Groupe pour les barres
  const barGroups = svg.selectAll(".bar-group")
    .data(displayData)
    .enter().append("g")
    .attr("class", "bar-group")
    .attr("transform", d => `translate(0, ${y(d.Genre)})`);

    barGroups.on("click", function(event, d) {
      const genre = d.Genre;
      showAlbumTitles(genre);
      showClickPopup(event); // Ajoutez ceci pour montrer la popup lors du clic
  });

  checkedYears.forEach(year => {
    barGroups.append("rect")
      .attr("class", "bar-" + year.replace(/[><]/g, ""))  
      .attr("x", d => x(d3.sum(checkedYears.slice(0, checkedYears.indexOf(year)), key => d[key] || 0)))
      .attr("width", d => x(d[year] || 0) - x(0))
      .attr("height", y.bandwidth())
      .attr("fill", colors(year))
      .on("mouseover", function(event, d) {
        d3.select(event.currentTarget).style("stroke", "black").style("stroke-width", "2px");
        const genre = d.Genre;
        const albumCount = d[year] || 0;
        showInfoBox(event, genre, year, albumCount);
    })
    .on("mouseout", function(event) {
        d3.select(event.currentTarget).style("stroke", null).style("stroke-width", null);
        hideInfoBox();
    });
  });
}

function showAlbumTitles(genre) {
  // Filtrer les albums par genre
  const filteredAlbums = albumData.filter(album => album.Genre === genre);

  // Vérifier si la fenêtre contextuelle existe déjà, sinon créez-la
  let albumsContainer = d3.select('.albums-popup');
  if (albumsContainer.empty()) {
    albumsContainer = d3.select("body").append("div")
      .attr("class", "albums-popup")
      .style("position", "absolute")
      .style("padding", "10px")
      .style("background", "white")
      .style("border", "1px solid black")
      .style("visibility", "hidden");
  }

  // Effacer le contenu précédent
  albumsContainer.html('');

  // Ajouter un titre pour la liste
  albumsContainer.append('h3').text(`Albums de genre : ${genre}`);

  // Créer une liste des titres d'albums
  const albumsList = albumsContainer.append('ul');
  filteredAlbums.forEach(album => {
    albumsList.append('li').text(album.Title);
  });

  // Montrer la fenêtre contextuelle
  albumsContainer.style("visibility", "visible");
}


function drawLegend() {
  const legendRectSize = 15;
  const legendSpacing = 20;
  const legendWidth = 380;
  const legendHeight = 60;

  const legendSvg = d3.select("#legend-container").append("svg")
      .attr("width", legendWidth)
      .attr("height", legendHeight);

  const legendItems = legendSvg.selectAll(".legendItem")
      .data(colors.domain())
      .enter()
      .append("g")
      .attr("class", "legendItem")
      .attr("transform", (d, i) => `translate(${i * (legendWidth / colors.domain().length)}, 0)`);

  legendItems.append("rect")
      .attr("x", 0)
      .attr("y", 20)
      .attr("width", legendWidth / colors.domain().length - 5)
      .attr("height", 15)
      .attr("fill", d => colors(d));

  legendItems.append("text")
      .attr("x", (legendWidth / colors.domain().length) / 2)
      .attr("y", 48)
      .attr("text-anchor", "middle")
      .style("font-size", "0.65em")
      .text(d => d);

  legendSvg.append("text")
      .attr("x", legendWidth / 2)
      .attr("y", 13)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", "1.25em")
      .style("fill", "black")
      .text("Année de sortie de l'album");
}


createColorCheckboxes();
updateChart();

