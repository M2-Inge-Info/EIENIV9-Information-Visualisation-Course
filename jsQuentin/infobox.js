let infoBox = d3.select("body")
    .append("div")
    .attr("class", "infobox")
    .style("position", "absolute")
    .style("right", "20px")
    .style("padding", "10px")
    .style("background", "rgba(255, 255, 255, 0.9)")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("visibility", "hidden");

function showInfoBox(event, genre, year, albumCount) {
    let topPosition = event.pageY + 10;
    if (topPosition + infoBox.node().offsetHeight > window.innerHeight) {
        topPosition = event.pageY - infoBox.node().offsetHeight - 10;
    }

    infoBox
        .style("top", topPosition + "px")
        .html(`
            <strong>Genre:</strong> ${genre}<br>
            <strong>Année:</strong> ${year}<br>
            <strong>Nombre d'albums:</strong> ${albumCount}
        `)
        .style("visibility", "visible");
}

function hideInfoBox() {
    infoBox.style("visibility", "hidden");
}
