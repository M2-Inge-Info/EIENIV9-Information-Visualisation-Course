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
    