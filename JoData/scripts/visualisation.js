d3.json("py_data/genre_counts.json").then(function(data) {
    // Créer un tableau à partir des données
    var dataArray = Object.entries(data);

    // Configurer les dimensions du graphique Donut
    var width = 400;
    var height = 400;
    var radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var pie = d3.pie()
        .value(function(d) { return d[1]; });

    var arc = d3.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 20);

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var arcs = svg.selectAll("arc")
        .data(pie(dataArray))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function(d) { return color(d.data[0]); })
        .on("click", function(d) {
            // Ajoutez ici le code pour gérer l'interaction lorsque l'utilisateur clique sur un segment du Donut.
            console.log("Cliqué sur le segment : ", d.data[0]);
        });

    // Ajoutez des étiquettes à chaque segment (facultatif)
    arcs.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .text(function(d) { return d.data[0]; });

    // Légende
    var legend = d3.select("#legend");

    var legendItems = legend.selectAll(".legend-item")
        .data(dataArray)
        .enter()
        .append("div")
        .attr("class", "legend-item");

    legendItems.append("span")
        .style("background-color", function(d) { return color(d[0]); })
        .attr("class", "legend-color");

    legendItems.append("span")
        .attr("class", "legend-text")
        .text(function(d) { return d[0] + " - " + d[1]; });
}).catch(function(error) {
    console.error(error);
});