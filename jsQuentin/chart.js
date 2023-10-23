//////////////////////// A MODIFIER NON UTILISER POUR LE MOMENT/////////////////////////


//-----------------------------------------------------
// Parse file csv to data

// Déclaration de la variable contenant les données CSV
const data = [];

// Utilisation de l'API Fetch pour récupérer le fichier CSV
fetch('src\\data\\quentin_population_album.csv')
  .then(response => response.text())
  .then(csvData => {
    // Divisez les lignes du CSV en un tableau
    const lines = csvData.split('\n');
    
    // Supprimez l'en-tête s'il y en a un
    const header = lines[0].split(',');
    lines.shift();

    // Parcourez les lignes pour créer un tableau d'objets
    lines.forEach(line => {
      const values = line.split(',');
      const entry = {};

      header.forEach((key, index) => {
        entry[key] = values[index];
      });

      data.push(entry);
    });

    console.log(data);
    // À ce stade, les données CSV sont stockées dans la variable "data".
  })
  .catch(error => console.error(error));
//-----------------------------------------------------


const chart = (data) => {
    // Spécifiez les dimensions du graphique (à l'exception de la hauteur).
    const width = 928;
    const marginTop = 30;
    const marginRight = 10;
    const marginBottom = 0;
    const marginLeft = 30;
  
    // Déterminez les séries à empiler.
    const series = d3.stack()
      .keys(data.columns.slice(1)) // Utilisez les clés des colonnes de données, sauf la première
      .value(([, D], key) => D[key]) // Obtenez la valeur pour chaque clé de série et empilez
      (d3.group(data, d => d.state, d => d.année)); // Regroupez par pile puis clé de série
  
    // Calculez la hauteur à partir du nombre de piles.
    const height = series[0].length * 25 + marginTop + marginBottom;
  
    // Préparez les échelles pour les codages de position et de couleur.
    const x = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
      .range([marginLeft, width - marginRight]);
  
    const y = d3.scaleBand()
      .domain(data.map(d => d.state))
      .range([marginTop, height - marginBottom])
      .padding(0.08);
  
    const color = d3.scaleOrdinal()
      .domain(data.columns.slice(1))
      .range(d3.schemeSpectral[data.columns.slice(1).length])
      .unknown("#ccc");
  
    // Fonction pour formater la valeur dans l'infobulle.
    const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en");
  
    // Créez le conteneur SVG.
    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
  
    // Ajoutez un groupe pour chaque série, et un rectangle pour chaque élément de la série.
    svg.append("g")
      .selectAll()
      .data(series)
      .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(D => D.map(d => (d.key = D.key, d)))
      .join("rect")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d.data[0]))
      .attr("height", y.bandwidth())
      .attr("width", d => x(d[1]) - x(d[0]))
      .append("title")
      .text(d => `${d.data[0]} ${d.key}\n${formatValue(d.data[1])}`);
  
    // Ajoutez l'axe horizontal.
    svg.append("g")
      .attr("transform", `translate(0,${marginTop})`)
      .call(d3.axisTop(x).ticks(width / 100, "s"))
      .call(g => g.selectAll(".domain").remove());
  
    // Ajoutez l'axe vertical.
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call(g => g.selectAll(".domain").remove());
  
    // Retourne le graphique avec l'échelle de couleur en tant que propriété (pour la légende).
    return Object.assign(svg.node(), { scales: { color } });
  };
  


  // Plot.plot({
  //   x: {axis: "top", transform: (d) => d / 1e6},
  //   color: {scheme: "spectral"},
  //   marks: [Plot.barX(data, {y: "state", x: "population", fill: "age", sort: {color: null, y: "-x"}})]
  // })