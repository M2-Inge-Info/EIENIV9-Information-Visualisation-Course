



// Charger les données depuis g.json
d3.json("data/equipment_counts.json").then(data => {
    const processedData = Object.entries(data).map(([category, items]) => {
      return {
        category,
        total: Object.values(items).reduce((acc, val) => acc + val, 0)
      };
    });
  
    const width = 1200;  // Ajuster la largeur pour inclure la légende
    const height = 928;
    const innerRadius = 180;
    const outerRadius = Math.min(width, height) / 2 - 100;  // Ajuster le rayon externe
  
    const svg = d3.select("#radial-bar-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 3},${height / 2})`);  // Ajuster la position du graphique

    const x = d3.scaleBand()
      .domain(processedData.map(d => d.category))
      .range([0, 2 * Math.PI])
      .align(0);
  
    const y = d3.scaleRadial()
      .domain([0, d3.max(processedData, d => d.total)])
      .range([innerRadius, outerRadius]);
  
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(d => y(d.total))
      .startAngle(d => x(d.category))
      .endAngle(d => x(d.category) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius);
  
    // Ajouter des lignes circulaires pour chaque 25%
    const yAxis = g => g
    .attr("text-anchor", "middle")
    .call(g => g.append("g")
    .selectAll("g")
    .data(y.ticks(4).slice(1)) // 4 ticks pour 25%, 50%, 75%, et 100%
    .enter().append("g")
    .attr("fill", "none")
    .call(g => g.append("circle")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.5)
        .attr("r", y))
    .call(g => g.append("text")
        .attr("y", d => -y(d))
        .attr("dy", "0.35em")
        .attr("stroke", "#fff")
        .attr("stroke-width", 5)
        .text(y.tickFormat(4, "%"))
    )
    .call(g => g.append("text")
        .attr("y", d => -y(d))
        .attr("dy", "0.35em")
        .text(y.tickFormat(4, "%"))
    )
    );

    svg.append("g")
    .call(yAxis);

    svg.selectAll("path")
      .data(processedData)
      .enter().append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);
  
    svg.append("g")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(processedData)
      .enter().append("text")
      .attr("transform", d => `
        rotate(${((x(d.category) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
        translate(${y(d.total) + 10},0)
        ${x(d.category) + x.bandwidth() / 2 + Math.PI / 2 > Math.PI ? "rotate(180)" : ""}
      `)
      .attr("dy", "0.35em")
      .text(d => d.category.split(' ').map(word => word[0]).join('')); // Acronyme
  
    // Ajouter une légende triée
    const legend = svg.append("g")
    .attr("transform", `translate(${outerRadius + 50}, ${-outerRadius})`)  // Ajuster la position de la légende
    .selectAll("g")
    .data(processedData.sort((a, b) => b.total - a.total))
    .enter().append("g")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);

    legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", "0.35em")
    .text(d => `${d.category} (${d.total})`);
// Fonction pour mettre à jour le graphique
function updateChart(threshold) {
    const filteredData = processedData.filter(d => d.total >= threshold);

    // Mettre à jour les arcs
    const paths = svg.selectAll("path")
    .data(filteredData, d => d.category);

    paths.enter().append("path")
    .merge(paths)
    .attr("d", arc)
    .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
    .on("click", function(event, d) {
        console.log(d.category);
        const categoryData = getCategoryData(data, d.category);
        const pieChartContainer = document.getElementById("pie-chart-container");
    
        // Videz le conteneur de la pie chart
        while (pieChartContainer.firstChild) {
            pieChartContainer.removeChild(pieChartContainer.firstChild);
        }
    
        // Créez et ajoutez la nouvelle pie chart
        const pieChart = createPieChart(categoryData, d.category);
        pieChartContainer.appendChild(pieChart);
    });

    paths.exit().remove();

    // Mettre à jour les étiquettes de texte
    const labels = svg.select("g[text-anchor='middle']").selectAll("text")
        .data(filteredData, d => d.category);

    labels.enter().append("text")
        .merge(labels)
        .attr("transform", d => `
            rotate(${((x(d.category) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
            translate(${y(d.total) + 10},0)
            ${x(d.category) + x.bandwidth() / 2 + Math.PI / 2 > Math.PI ? "rotate(180)" : ""}
        `)
        .attr("dy", "0.35em")
        .text(d => d.category.split(' ').map(word => word[0]).join(''));

    labels.exit().remove();

    // Mettre à jour la légende
    const legendGroups = legend.selectAll("g")
        .data(filteredData.sort((a, b) => b.total - a.total), d => d.category);

    legendGroups.exit().remove();

    const legendGroupsEnter = legendGroups.enter().append("g");

    legendGroupsEnter.append("rect")
        .attr("width", 18)
        .attr("height", 18);

    legendGroupsEnter.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", "0.35em");

    const legendGroupsMerge = legendGroupsEnter.merge(legendGroups);

    legendGroupsMerge
        .attr("transform", (d, i) => `translate(0, ${i * 20})`)
        .select("rect")
        .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);

    legendGroupsMerge.select("text")
        .text(d => `${d.category} (${d.total})`);
}

// Écouter les changements sur l'input range
d3.select("#threshold").on("input", function() {
    const threshold = +this.value;
    d3.select("#threshold-value").text(threshold);
    updateChart(threshold);
});

// Appeler updateChart avec la valeur initiale du seuil
updateChart(+d3.select("#threshold").property("value"));
  

  });
  