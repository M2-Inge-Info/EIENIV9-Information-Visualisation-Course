// Chemin du fichier CSV city
var FileCities = 'src/data/lucas_data_cities_latlong.csv';

// Chemin du fichier CSV country
var FileCountries = 'src/data/lucas_data_countries_latlong.csv';

// Chemin du fichier JSON artists
var FileArtists = 'src/data/lucas_data_filtered3.json';


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



// Utilisation de l'API Fetch pour récupérer le fichier CSV
var resultCity = fetch(FileCities)
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



// Utilisation de l'API Fetch pour récupérer le fichier CSV
var resultCountry = fetch(FileCountries)
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




var resultArtists = fetch(FileArtists)
    .then(response => response.json())
    .then(data => {
        data = data.results.bindings;
        resultats = [];

        var date = new Date();
        dateYear = date.getFullYear();
        dateMonth = date.getMonth() + 1;
        dateDay = date.getDate();

        for (var i=0; i<data.length; i++) {
            var subject = data[i].subject.value;
            var name = data[i].name.value;
            var birth = data[i].birth.value;

            if(data[i].death != undefined && data[i].death != null){
                var death = data[i].death.value;
                var year = death.substring(0, 4) - birth.substring(0, 4);
                var month = death.substring(5, 7) - birth.substring(5, 7);
                var day = death.substring(8, 10) - birth.substring(8, 10);
                if (month < 0 || (month == 0 && day < 0)) {
                    year--;
                }
                var age = year;                
            }
            else{
                var death = "Alive";
                var year = dateYear - birth.substring(0, 4);
                var month = dateMonth - birth.substring(5, 7);
                var day = dateDay - birth.substring(8, 10);
                if (month < 0 || (month == 0 && day < 0)) {
                    year--;
                }
                var age = year;
            }

            var genres = data[i].genres.value;
            var city = data[i].city.value;
            var country = data[i].country.value;

            resultats.push([subject, name, birth, death, age, genres, city, country]);
            // console.log(resultats[i]);
        }
        return resultats;
    })
    .catch(error => console.error('Une erreur s\'est produite :', error));



var minAge = 150;
var maxAge = 0;
var genreCounts = {}; // Utilisez un objet pour compter les occurrences de chaque genre

var ageSlider = document.getElementById("age-slider");
var selectedAgeRange = document.getElementById("selected-age-range");
var genreSelect = document.getElementById("genre-select");
var aliveCheckbox = document.getElementById("alive-checkbox");
var deadCheckbox = document.getElementById("dead-checkbox");


resultArtists.then(function(result) {
    result.forEach((artist) => {
        if (artist[4] < minAge) {
            minAge = artist[4];
        }
        if (artist[4] > maxAge) {
            maxAge = artist[4];
        }

        const genres = artist[5].split(', ');
        genres.forEach((genre) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
    });

    // Maintenant que les valeurs sont mises à jour, vous pouvez initialiser le curseur d'âge et le select de genre
    const ageRange = [minAge, maxAge];

    noUiSlider.create(ageSlider, {
        start: ageRange,
        connect: true,
        step: 1,
        range: {
            'min': minAge,
            'max': maxAge
        }
    });

    ageSlider.noUiSlider.on('update', function (values, handle) {
        const ageMin = parseInt(values[0]);
        const ageMax = parseInt(values[1]);
        selectedAgeRange.textContent = `Plage d'âge sélectionnée : ${ageMin} - ${ageMax} ans`;
        // Lors de l'initialisation du curseur, applyFilters() était appelé 2 fois et provoquait un bug
        if(ageMin != minAge || ageMax != maxAge){
            getValuesAge(ageMin, ageMax);
            applyFilters();
        }
    });

    // Triez les genres par ordre alphabétique
    const sortedGenres = Object.keys(genreCounts).sort();

    sortedGenres.forEach((genre) => {
        const option = document.createElement('option');
        option.value = genre;
        option.text = genre;
        genreSelect.appendChild(option);
    });
});


genreSelect.addEventListener("change", function () {
    applyFilters();
});

aliveCheckbox.addEventListener("change", function () {
    applyFilters();
});

deadCheckbox.addEventListener("change", function () {
    applyFilters();
});

function getValuesAge(min, max) {
    minAge = parseInt(min);
    maxAge = parseInt(max);
    // console.log(minAge + " " + maxAge);
}

var filteredCity;
var filteredCountry;
var filteredArtists;

function applyFilters() {
    map.closePopup();

    // Récupérer les valeurs des filtres
    const genre = genreSelect.value;
    const alive = aliveCheckbox.checked;
    const dead = deadCheckbox.checked;
    // console.log(minAge + " " + maxAge + " " + genre + " " + alive + " " + dead);

    // Si les filtres ont changé, mettez à jour les résultats filtrés

    // Filtrer les artistes en fonction des valeurs des filtres
    filteredArtists = resultArtists.then(function(result) {
        return result.filter((artist) => {
            return artist[4] >= minAge && artist[4] <= maxAge && (artist[5].includes(genre) || genre == "Tous") && ((artist[3] == "Alive" && alive) || (artist[3] != "Alive" && dead));
        });
    });

    // Afficher le nombre de résultats dans le HTML
    filteredArtists.then(function(result) {
        document.getElementById("results-count").innerHTML = result.length + " artistes correspondants aux filtres";
    });


    // Copie resultCity et resultCountry dans resultCityCopy et resultCountryCopy
    var resultCityCopy = resultCity.then(function(result) {
        return result.slice();
    });
    var resultCountryCopy = resultCountry.then(function(result) {
        return result.slice();
    });

    // Modifier le nombre d'artiste dans les villes de resultCity en fonction des artistes filtrés dans filteredArtists
    filteredCity = filteredArtists.then(function(result) {
        return resultCityCopy.then(function(resultCityCopy) {
            for (var i=0; i<resultCityCopy.length; i++) {
                resultCityCopy[i][2] = 0;
            }
            cityMap = new Map();
            for (var i=0; i<result.length; i++){
                var key = strUcFirst(result[i][6]) + strUcFirst(result[i][7]);
                if (cityMap.has(key)){
                    cityMap.set(key, cityMap.get(key) + 1);
                }
                else{
                    cityMap.set(key, 1);
                }
            }
            for (var i=0; i<resultCityCopy.length; i++) {
                var key = strUcFirst(resultCityCopy[i][0]) + strUcFirst(resultCityCopy[i][1]);
                if (cityMap.has(key)){
                    resultCityCopy[i][2] = cityMap.get(key);
                }
                else{
                    resultCityCopy.splice(i, 1);
                    i--;
                }
            }

            // On trie le tableau par nombre d'artistes
            resultCityCopy.sort(function(a, b) {
                return b[2] - a[2];
            });

            return resultCityCopy;
        });
    });

    // Modifier le nombre d'artiste dans les pays de resultCountry en fonction des artistes filtrés dans filteredArtists
    filteredCountry = filteredArtists.then(function(result) {
        return resultCountryCopy.then(function(resultCountryCopy) {
            for (var i=0; i<resultCountryCopy.length; i++) {
                resultCountryCopy[i][1] = 0;
            }
            countryMap = new Map();
            for (var i=0; i<result.length; i++){
                var key = strUcFirst(result[i][7]);
                if (countryMap.has(key)){
                    countryMap.set(key, countryMap.get(key) + 1);
                }
                else{
                    countryMap.set(key, 1);
                }
            }
            for (var i=0; i<resultCountryCopy.length; i++) {
                var key = strUcFirst(resultCountryCopy[i][0]);
                if (countryMap.has(key)){
                    resultCountryCopy[i][1] = countryMap.get(key);
                }
                else{
                    resultCountryCopy.splice(i, 1);
                    i--;
                }
            }

            // On trie le tableau par nombre d'artistes
            resultCountryCopy.sort(function(a, b) {
                return b[1] - a[1];
            });

            return resultCountryCopy;
        });
    });

    // filteredCity.then(function(result) {
    //     console.log(result);
    // });

    // filteredCountry.then(function(result) {
    //     console.log(result);
    // });
    
    displayFilters();
}


// Fonction pour afficher les villes filtrées sur la carte
function displayFilters() {
    map.removeLayer(layerVille);
    map.removeLayer(layerPays);

    layerPays = L.layerGroup();
    createLayerCountries();

    layerVille = L.layerGroup();
    createLayerCities();

    toggleLayers();
}



var artistSearchInput = document.getElementById("artist-search");

artistSearchInput.addEventListener("focus", function() {
    // Lorsque la barre de recherche est sélectionnée, supprimez le placeholder
    artistSearchInput.removeAttribute("placeholder");
});

artistSearchInput.addEventListener("blur", function() {
    // Lorsque la barre de recherche perd le focus et est vide, rétablissez le placeholder
    if (artistSearchInput.value.trim() === "") {
        artistSearchInput.setAttribute("placeholder", "Saisir un artiste (Prénom Nom)");
    }
});


function setupArtistSearch() {
    var artistSearchInput = document.getElementById("artist-search");
    var artistSuggestionsDatalist = document.getElementById("artist-suggestions");
    var searchButton = document.getElementById("search-button");
  
    artistSearchInput.addEventListener("input", function() {
        var artistSearchResults = document.getElementById("artist-search-results");
        artistSearchResults.innerHTML = '';

        // Obtenez le texte entré dans la barre de recherche
        var searchQuery = strUcFirst(artistSearchInput.value.trim());
        
        // Effacez les anciennes suggestions
        artistSuggestionsDatalist.innerHTML = '';
    
        // Parcourez les données des artistes pour trouver des correspondances
        filteredArtists.then(function(artist) {
            for(i=0; i<artist.length; i++) {
                var artistName = strUcFirst(artist[i][1]); // Utilisez l'index 1 pour le nom de l'artiste
                // console.log(artistName);
                if (searchQuery === "") {
                    // Si la barre de recherche est vide, ne montrez aucune suggestion
                    var suggestionOption = document.createElement("option");
                    suggestionOption.text = artistName;
                    suggestionOption.value = artistName;
                    suggestionOption.classList.add("suggestion");
                    artistSuggestionsDatalist.appendChild(suggestionOption);
                } else if (artistName.includes(searchQuery)) {
                    // Créez une nouvelle option pour la datalist avec la suggestion d'artiste
                    var suggestionOption = document.createElement("option");
                    suggestionOption.text = artistName;
                    suggestionOption.value = artistName;
                    suggestionOption.classList.add("suggestion");
                    artistSuggestionsDatalist.appendChild(suggestionOption);
                    // console.log(artist[i]);
                }
            }
        });
    });
  
    // Ajoutez un gestionnaire d'événements pour effectuer la recherche lorsque l'utilisateur appuie sur "Entrée"
    artistSearchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            performArtistSearch(artistSearchInput.value);
        }
    });

    // Ajoutez un gestionnaire d'événements pour effectuer la recherche lorsque le bouton est cliqué
    searchButton.addEventListener("click", function() {
        var query = artistSearchInput.value.trim();
        performArtistSearch(query);
    });
}


function performArtistSearch(query) {
    // Filtrer les artistes en fonction du nom de l'artiste (index 1 dans les données)
    var results = filteredArtists.then(function(artist) {
        // Retourne les résultats de la promesse
        return artist.filter(function(artist) {
            return strUcFirst(artist[1]) === strUcFirst(query);
        });
    });

    // results.then(function(result) {
    //     console.log(result.length);
    // });
    
    results.then(function(result) {
        if (result.length < 1) {
            // Si aucun résultat n'est trouvé, affichez un message d'erreur
            var artistSearchResults = document.getElementById("artist-search-results");
            artistSearchResults.innerHTML = '<p class="error">Aucun artiste trouvé</p>';
        }
        else if (result.length > 1) {
            // Si plusieurs résultats sont trouvés, affichez un message d'erreur
            var artistSearchResults = document.getElementById("artist-search-results");
            artistSearchResults.innerHTML = '<p class="error">' + result.length + ' artistes trouvés</p>';
        } else {
            // Affichez les résultats
            var artistSearchResults = document.getElementById("artist-search-results");
            artistSearchResults.innerHTML = '<p class="success">1 artiste trouvé, consulter la carte</p>';

            // Remplacer le contenu de la barre de recherche par le nom de l'artiste trouvé
            var artistSearchInput = document.getElementById("artist-search");
            artistSearchInput.value = result[0][1];

            var artistCity = result[0][6];
            var artistCountry = result[0][7];
            // console.log(artistCity + ', ' + artistCountry);
            zoomOnCity(artistCity, artistCountry);
        }
    });

    // Cacher les suggestions
    var artistSuggestionsDatalist = document.getElementById("artist-suggestions");
    artistSuggestionsDatalist.innerHTML = '';
}
  
  



// Met toutes les premières lettres en majuscule d'une chaîne de caractères
function strUcFirst(a) {
    return (a+'').replace(/^(.)|\s(.)/g, function($1) { return $1.toUpperCase(); });
}


listeArtistePays = function(pays) {
    return new Promise(function(resolve, reject) {
        filteredCity.then(function(result) {
            var tableauVilles = '<table class="centered-table">'; // Créez une variable pour stocker la liste des villes
            var villeCount = 0; // Compteur pour suivre le nombre de villes ajoutés
            var resultArray = [];
            var nbVillePays = 0;

            // Récupérer la liste de ville présente dans le pays
            for (var i = 0; i < result.length; i++) {
                if (strUcFirst(result[i][1]) === strUcFirst(pays)) {
                    resultArray.push(result[i]);
                }
            }

            nbVillePays = resultArray.length;

            // On récupère les 10 premières villes
            if (resultArray.length > 10) {
                resultArray = resultArray.slice(0, 10);
            }

            // On regle le nombre de colonnes en fonction du nombre de villes (2 colonnes si plus de 5 villes)
            if (resultArray.length % 2 == 1 && resultArray.length > 5) {
                nbVilleColonne = resultArray.length + 1;
            }
            
            // Créez un tableau HTML avec deux colonnes : nom de la ville et nombre d'artistes
            tableauVilles += '<tr><th>Ville</th><th>Nombre d\'artistes</th></tr>';
            for (var i = 0; i < resultArray.length; i++) {
                tableauVilles += '<tr><td><button class="ville-button">' + strUcFirst(resultArray[i][0]) + '</button></td><td>' + resultArray[i][2] + '</td></tr>';
                villeCount++;
            }
            
            // Fermez la dernière colonne ouverte
            if (villeCount > 0) {
                tableauVilles += '</table>';
            }

            var resultObject = {
                tableau: tableauVilles,
                nbVilles: nbVillePays
            };

            resolve(resultObject);
        });
    });
}


function listeArtisteVille(ville, pays, artists) {
    return new Promise(function(resolve, reject) {
        filteredArtists.then(function(result) {
            var artistList = '<div class="artist-columns"><div class="artist-column1">'; // Créez une variable pour stocker la liste d'artistes
            var artistCount = 0; // Compteur pour suivre le nombre d'artistes ajoutés

            // On regle le nombre de colonnes en fonction du nombre d'artistes (2 colonnes si plus de 5 artistes)
            if (artists % 2 == 1 && artists > 5) {
                artists++;
            }

            for (var i = 0; i < result.length; i++) {
                if (strUcFirst(result[i][6]) === strUcFirst(ville) && strUcFirst(result[i][7]) === strUcFirst(pays)) {
                    artistList += '<a href="' + result[i][0] + '">' + result[i][1] + '</a></br>';
                    artistCount++;

                    if (artistCount == artists/2 && artists > 5) {
                        artistList += '</div><div class="artist-column2">';
                    }
                }
            }

            // Fermez la dernière colonne ouverte
            if (artistCount > 0) {
                artistList += '</div></div>';
            }

            resolve(artistList);
        });
    });
}



// Créer une fonction posant un marqueur pour une ville sur la carte au coordonnées passées en paramètre
function addMarkerCity(ville, pays, nbArtists, latitude, longitude) {
    // Créez un cercle noir comme marqueur
    var cercleNoir = L.circle([latitude, longitude], Math.log(nbArtists) * 1000 + 1000, {
        color: 'black', // Couleur de la bordure du cercle
        fillColor: 'red', // Couleur de remplissage du cercle
        fillOpacity: 0.15, // Opacité de remplissage (1 pour totalement opaque)
        weight: 1.5,
        ville: ville,
        pays: pays,
    }).addEventListener('mouseover', function() {
        map.closePopup();
        var self = this; // Stockez une référence à "this"
        listeArtisteVille(ville, pays, nbArtists).then(function(artistList) {
            self.bindPopup('<h3 class="popup">' + strUcFirst(ville) + ', <button class="pays-button">' + strUcFirst(pays) + '</button></h3><h5>' + nbArtists + ' artistes</h5>' + artistList).openPopup();
        });
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
        pays: pays,
    }).addEventListener('mouseover', function() {
        map.closePopup();
        var self = this; // Stockez une référence à "this"
        listeArtistePays(pays).then(function(resultObject) {
            self.bindPopup('<h3 class="popup">' + strUcFirst(pays) + '</h3><h5>' + resultObject.nbVilles + ' villes, ' + nbArtists + ' artistes</h5>' + resultObject.tableau).openPopup();
        });
    }).addEventListener('click', function() {
        zoomMostArtists(pays);
    }).addTo(layerPays);
}



// Afficher les pays sur la carte dans une fonction
function createLayerCountries() {
    filteredCountry.then(function(result) {
        for (var i=0; i<result.length; i++) {
            addMarkerCountry(result[i][0], result[i][1], result[i][2], result[i][3]);
        }
    });
}

// Affichez les villes sur la carte dans une fonction
function createLayerCities() {
    filteredCity.then(function(result) {
        for (var i=0; i<result.length; i++) {
            addMarkerCity(result[i][0], result[i][1], result[i][2], result[i][3], result[i][4]);
        }
    });
}

// Fonction pour zoomer sur la ville première ville de la liste d'un pays
function zoomMostArtists(pays) {
    filteredCity.then(function(result) {
        i=0;
        while (strUcFirst(result[i][1]) != strUcFirst(pays)) {
            i++;
        }
        map.setView([result[i][3], result[i][4]], 10);
        // open popup de la ville sélectionnée (ville = result[i][0], pays = result[i][1])
        listeArtisteVille(result[i][0], result[i][1], result[i][2]).then(function(artistList) {
            L.popup({closeOnClick: false})
                .setLatLng([result[i][3], result[i][4]])
                .setContent('<h3 class="popup">' + strUcFirst(result[i][0]) + ', <button class="pays-button">' + strUcFirst(pays) + '</button></h3><h5>' + result[i][2] + ' artistes</h5>' + artistList)
                .openOn(map);
        });
    });
}


// Fonction pour zoomer sur une ville
function zoomOnCity(ville, pays) {
    filteredCity.then(function(result) {
        i=0;
        while (strUcFirst(result[i][0]) != strUcFirst(ville) || strUcFirst(result[i][1]) != strUcFirst(pays)) {
            i++;
        }
        map.setView([result[i][3], result[i][4]], 10);
        // open popup de la ville sélectionnée (ville = result[i][0], pays = result[i][1])
        listeArtisteVille(result[i][0], result[i][1], result[i][2]).then(function(artistList) {
            L.popup({closeOnClick: false})
                .setLatLng([result[i][3], result[i][4]])
                .setContent('<h3 class="popup">' + strUcFirst(ville) + ', <button class="pays-button">' + strUcFirst(pays) + '</button></h3><h5>' + result[i][2] + ' artistes</h5>' + artistList)
                .openOn(map);
        });
    });
}


// Fonction pour zoomer sur un pays
function zoomOnPays(pays) {
    filteredCountry.then(function(result) {
        i=0;
        while (strUcFirst(result[i][0]) != strUcFirst(pays)) {
            i++;
        }
        map.setView([result[i][2], result[i][3]], 5);
        // open popup du pays sélectionné (pays = result[i][0])
        listeArtistePays(result[i][0]).then(function(resultObject) {
            L.popup({closeOnClick: false})
                .setLatLng([result[i][2], result[i][3]])
                .setContent('<h3 class="popup">' + strUcFirst(pays) + '</h3><h5>' + resultObject.nbVilles + ' villes, ' + result[i][1] + ' artistes</h5>' + resultObject.tableau)
                .openOn(map);
        });
    });
}



// Ajouter des event listeners aux boutons ".ville-button"
document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('ville-button')) {
        var ville = e.target.innerHTML;
        var divPays = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0];
        var pays = divPays.innerHTML;
        // console.log(ville + ', ' + pays);
        zoomOnCity(ville, pays);
    }
});

// Ajouter des event listeners aux boutons ".pays-button"
document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('pays-button')) {
        var pays = e.target.innerHTML;
        zoomOnPays(pays);
    }
});

    


// Fonction pour afficher les villes ou les pays en fonction du niveau de zoom
function toggleLayers() {
    // console.log('Niveau de zoom : ' + map.getZoom());
    if (map.getZoom() > 6) {
        // Niveau de zoom inférieur à 8 : Afficher les villes, masquer les pays
        if (map.hasLayer(layerPays)) {
            map.removeLayer(layerPays);
        }
        if (!map.hasLayer(layerVille)) {
            map.addLayer(layerVille);
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


// Appelé applyFilters() lorsque la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    applyFilters();
    setupArtistSearch();
});

