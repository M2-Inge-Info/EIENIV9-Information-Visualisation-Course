


// Fonction pour créer une Pie Chart
function createPieChart(data, category, percentage) {
    const threshold = percentage / 100;

    // Triez les données en ordre décroissant
    const sortedData = data.sort((a, b) => b.count - a.count);
    let cumulativePercent = 0;
    
    // Filtrer les données pour ne conserver que celles qui cumulent à 20% du total
    const filteredData = sortedData.filter(d => {
        const currentPercent = d.count / sortedData.reduce((acc, datum) => acc + datum.count, 0);
        cumulativePercent += currentPercent;
        return cumulativePercent <= threshold;
    });

    const width = 928;
    const height = Math.min(width, 500);
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
        
        const pie = d3.pie().sort(null).value(d => d.count);
        const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 1);

    const arcLabel = d3.arc().innerRadius(arc.outerRadius()() * 0.8).outerRadius(arc.outerRadius()() * 0.8);
    const arcs = pie(filteredData);  // Utilisez filteredData au lieu de data

    const svg = d3.create("svg")
    .attr("id", `pie-chart-${category}`)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .style("width", "100%")   // Largeur à 100%
    .style("height", "auto")  // Hauteur à auto
    .style("font", "10px sans-serif");

        svg.append("g")
        .attr("stroke", "white")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.name}: ${d.data.count.toLocaleString("en-US")}`);

    // Ajoutez un écouteur d'événements de clic aux segments
    svg.selectAll("path")
        .on("click", function(event, d) {
            console.log(d.data)
            console.log(`Segment cliqué: ${d.data.name} avec une valeur de ${d.data.count}`);
            showArtistsUsingInstrument(category, d.data.name);
        });

    svg.append("g")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.count.toLocaleString("en-US")));


            

    return svg.node();
}