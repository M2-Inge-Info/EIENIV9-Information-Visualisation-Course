const DONUT_PARAMETERS = {
    width: 800, 
    height: 600, 
    radius: Math.min(800, 600) / 2
}

const triDataByCount = (data, percentage) => {
    let dataArray = Object.entries(data);

    // Tri des données par compte décroissant
    dataArray.sort((a, b) => b[1] - a[1]);

    // Calcul du nombre d'éléments à inclure
    let numItems = Math.round((percentage / 100) * dataArray.length);

    // Prendre le top percentage% des éléments
    let filteredDataArray = dataArray.slice(0, numItems);
    return filteredDataArray
}

let svg, pie, arc, color, arcs, legend;

const initChart = () => {
    const { width, height, radius } = DONUT_PARAMETERS;

    color = d3.scaleOrdinal(d3.schemeSet3);
    pie = d3.pie().value(function(d) { return d[1]; });
    arc = d3.arc().innerRadius(radius - 100).outerRadius(radius - 20);

    svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    legend = d3.select("#legend")
        .append("svg")
        .attr("width", 300)
        .attr("height", height);
};

let selectedArc = null;  // Variable pour stocker l'arc sélectionné

const updateChart = (filteredDataArray) => {
    // Supprimez les données existantes
    svg.selectAll(".arc").remove();
    legend.selectAll(".legend-item").remove();

    arcs = svg.selectAll("arc")
        .data(pie(filteredDataArray))
        .enter()
        .append("g")
        .attr("class", "arc")
        .on("mouseover", function(event, d) {
            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background", "#fff")
                .style("padding", "5px")
                .style("border", "1px solid #000")
                .style("border-radius", "5px")
                .text(d.data[0] + ": " + d.data[1]);
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            d3.select(".tooltip").remove();
        })
        .on("click", function(event, d) {
            if (d && d.data) {
                console.log("Cliqué sur le segment : ", d.data[0]);
            }
        });

    arcs.on("click", function(event, d) {
        if (d && d.data) {
            console.log("Cliqué sur le segment : ", d.data[0]);
    
            // Réinitialisez la couleur de l'arc précédemment sélectionné
            if (selectedArc) {
                selectedArc.attr("fill", function(d) { return color(d.data[0]); });
            }
    
            // Mettez à jour la couleur de l'arc cliqué
            d3.select(this).select("path").attr("fill", "steelblue");
    
            // Stockez l'arc sélectionné
            selectedArc = d3.select(this).select("path");
    
            // Affichez les éléments pour le genre sélectionné
            displayEquipementDetails(d.data[0]);
        }
    });
        
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function(d) { return color(d.data[0]); });

    arcs.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .text(function(d) { return d.data[0]; });

    var legendItems = legend.selectAll(".legend-item")
        .data(filteredDataArray)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", function(d, i) { return "translate(0," + (i * 20) + ")"; });

    legendItems.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d) { return color(d[0]); });

    legendItems.append("text")
        .attr("x", 20)
        .attr("y", 10)
        .text(function(d) { return d[0] + " - " + d[1]; });
};


const createDonutCountGenre = (percentage) => {
    d3.json("data/genre_counts.json").then(function(data) {
        let filteredDataArray = triDataByCount(data, percentage);
        updateChart(filteredDataArray);
    })
    .catch(function(error) {
        console.error(error);
    });
};


const displayEquipementDetails = (genre) => {
    d3.json("data/equipment_counts.json").then(function(data) {
        let equipementDetailsDiv = d3.select("#equipement-details");
        equipementDetailsDiv.html("");  // Effacer les détails des équipements existants

        if (data[genre]) {
            equipementDetailsDiv.append("h3").text(genre);

            let equipementList = equipementDetailsDiv.append("ul");
            Object.entries(data[genre]).forEach(([equipementName, count]) => {
                equipementList.append("li").text(`${equipementName}: ${count}`);
            });
        } else {
            equipementDetailsDiv.append("p").text("Aucun équipement trouvé pour le genre : " + genre);
        }
    })
    .catch(function(error) {
        console.error(error);
        d3.select("#equipement-details").append("p").text("Erreur lors de la récupération des données des équipements.");
    });
};



document.getElementById('percentageSlider').addEventListener('input', function() {
    var percentage = this.value;
    document.getElementById('percentageValue').textContent = percentage + '%';
    createDonutCountGenre(percentage);
});

const initBase = () => {
    initChart();
    createDonutCountGenre(10);
};

initBase();

document.getElementById('percentageSlider').addEventListener('input', function() {
    var percentage = this.value;
    document.getElementById('percentageValue').textContent = percentage + '%';
    createDonutCountGenre(percentage);
});
