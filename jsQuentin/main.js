const margin = {
  top: 100,
  right: 30,
  bottom: 40,
  left: 200
},

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
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let stackedData = [];

d3.csv("src/data/quentin_population_album.csv").then(function (data) {
  const dataSum = d3.nest()
      .key(d => d.Genre)
      .key(d => d.année)
      .rollup(v => d3.sum(v, d => d["Nombre d'albums"]))
      .entries(data);

  stackedData = dataSum.map(d => {
      let obj = {
          Genre: d.key
      };
      d.values.forEach(v => obj[v.key] = v.value);
      return obj;
  });

  drawLegend();
  updateChart();
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

checkedYears.forEach(year => {
  svg.selectAll(".bar-" + year.replace(/[><]/g, ""))
  .data(displayData)
  .enter()
  .append("rect")
  .attr("class", "bar-" + year.replace(/[><]/g, ""))
  .attr("y", d => y(d.Genre))
  .attr("x", d => x(d3.sum(checkedYears.slice(0, checkedYears.indexOf(year)), key => d[key] || 0)))
  .attr("width", d => x(d[year] || 0))
  .attr("height", y.bandwidth())
  .attr("fill", colors(year))
  .on("mouseover", function(event, d) {
    showInfoBox(event, d.Genre, year, d[year]);
  })
  .on("mouseout", function() {
    hideInfoBox();
  });
});

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0,0)")
.call(d3.axisTop(x));

svg.append("g")
.attr("class", "y axis")
.call(d3.axisLeft(y));
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










