var map = L.map('map').setView([47,2], 5);
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
    }).addTo(map);

// Utilisez un événement de zoomend pour surveiller les changements de niveau de zoom
map.on('zoomend', toggleLayers);

var layerVille = L.layerGroup();
var layerPays = L.layerGroup();

// Créer une fonction posant un marqueur pour une ville sur la carte au coordonnées passées en paramètre
function addMarkerCity(ville, pays, nbArtists, latitude, longitude) {
    // Créez un cercle noir comme marqueur
    var cercleNoir = L.circle([latitude, longitude], Math.log(nbArtists) * 1000 + 1000, {
        color: 'black', // Couleur de la bordure du cercle
        fillColor: 'red', // Couleur de remplissage du cercle
        fillOpacity: 0.15, // Opacité de remplissage (1 pour totalement opaque)
        weight: 1.5,
    }).addEventListener('mouseover', function() {
        map.closePopup();
        this.bindPopup(ville + ', ' + pays + '<br>' + nbArtists + ' artistes').openPopup();
    }).addTo(layerVille);
};


// Créer une fonction posant un marqueur pour un pays sur la carte au coordonnées passées en paramètre
function addMarkerCountry(pays, nbArtists, latitude, longitude) {
    // Créez un cercle noir comme marqueur
    var cercleNoir = L.circle([latitude, longitude], Math.log(nbArtists) * 25000 + 25000, {
        color: 'black', // Couleur de la bordure du cercle
        fillColor: 'red', // Couleur de remplissage du cercle
        fillOpacity: 0.25, // Opacité de remplissage (1 pour totalement opaque)
        weight: 1.5,
    }).addEventListener('mouseover', function() {
        map.closePopup();
        this.bindPopup(pays + '<br>' + nbArtists + ' artistes').openPopup();
    }).addEventListener('click', function() {
        zoomMostArtists(pays);
    }).addTo(layerPays);
}



// Chemin du fichier CSV city
var FileCities = 'src/data/lucas_data_cities_latlong.csv';

// Utilisation de l'API Fetch pour récupérer le fichier CSV
resultCity = fetch(FileCities)
    .then(response => response.text()) // Lire le contenu du fichier comme texte
    .then(data => {
        // Traitement du contenu du fichier CSV
        var lignes = data.split('\n'); // Sépare les lignes du CSV
        var resultats = [];

        // Parcourez les lignes pour extraire les données, chaque ligne correspond à un nouvel index dans le tableau "lignes"
        for (var i=1; i<lignes.length; i++) {
            var ligne = lignes[i].split(';').map(function(colonne) {
                return colonne.replace(/"/g, '').replace(/\r/g, '');
            });

            var ville = ligne[0];
            var pays = ligne[1];
            var nbArtists = ligne[2];
            var latitude = parseFloat(ligne[3]);
            var longitude = parseFloat(ligne[4]);

            // Ajoutez les données dans un tableau
            resultats.push([ville, pays, nbArtists, latitude, longitude]);
        }

        return resultats;
    })
    .catch(error => console.error('Une erreur s\'est produite :', error));


// Affichez les villes sur la carte dans une fonction
function createLayerCities() {
    resultCity.then(function(result) {
        for (var i=0; i<result.length; i++) {
            addMarkerCity(result[i][0], result[i][1], result[i][2], result[i][3], result[i][4]);
        }
    });
}


// Chemin du fichier CSV country
var FileCountries = 'src/data/lucas_data_countries_latlong.csv';

// Utilisation de l'API Fetch pour récupérer le fichier CSV
resultCountry = fetch(FileCountries)
    .then(response => response.text()) // Lire le contenu du fichier comme texte
    .then(data => {
        // Traitement du contenu du fichier CSV
        var lignes = data.split('\n'); // Sépare les lignes du CSV
        var resultats = [];

        // Parcourez les lignes pour extraire les données, chaque ligne correspond à un nouvel index dans le tableau "lignes"
        for (var i=1; i<lignes.length; i++) {
            var ligne = lignes[i].split(';').map(function(colonne) {
                return colonne.replace(/"/g, '').replace(/\r/g, '');
            });

            var pays = ligne[0];
            var nbArtists = ligne[1];
            var latitude = parseFloat(ligne[2]);
            var longitude = parseFloat(ligne[3]);

            // Ajoutez les données dans un tableau
            resultats.push([pays, nbArtists, latitude, longitude]);
        }

        return resultats;
    })
    .catch(error => console.error('Une erreur s\'est produite :', error));



// Afficher les pays sur la carte dans une fonction
function createLayerCountries() {
    resultCountry.then(function(result) {
        for (var i=0; i<result.length; i++) {
            addMarkerCountry(result[i][0], result[i][1], result[i][2], result[i][3]);
        }
    });
}


// Fonction pour zoomer sur la ville première ville de la liste d'un pays
function zoomMostArtists(pays) {
    resultCity.then(function(result) {
        i=0;
        while (result[i][1] != pays) {
            i++;
        }
        map.setView([result[i][3], result[i][4]], 10);
    });
}


    


// Fonction pour afficher les villes ou les pays en fonction du niveau de zoom
function toggleLayers() {
    console.log('Niveau de zoom : ' + map.getZoom());
    if (map.getZoom() > 6) {
        // Niveau de zoom inférieur à 8 : Afficher les villes, masquer les pays
        if (map.hasLayer(layerPays)) {
            map.removeLayer(layerPays);
        }
        if (!map.hasLayer(layerVille)) {
            layerVille.addTo(map);
        }
    } else {
        // Niveau de zoom supérieur ou égal à 8 : Afficher les pays, masquer les villes
        if (map.hasLayer(layerVille)) {
            map.removeLayer(layerVille);
        }
        if (!map.hasLayer(layerPays)) {
            map.addLayer(layerPays);
        }
    }
}

createLayerCities();
createLayerCountries();

// Appelez la fonction initialement pour afficher les couches en fonction du niveau de zoom initial
toggleLayers();








