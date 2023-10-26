Exécuter les scipts suivants dans l'ordre pour filtrer les données et les mettre en forme:
- python3 getLucasDataJSON.py
- python3 verifyLucasDataJSON.py
- python3 countCityLucasData.py
- python3 addLatLongCityLucasData.py
- python3 countCountryLucasData.py
- python3 addLatLongCountryLucasData.py





getLucasDataJSON.py
Permet la récupéreration des données de Lucas et les mets dans un fichier JSON "lucas_data.json".


verifyLucasDataJSON.py
Permet la vérification rapide que les villes et pays récupérés existent bien séparément l'un de l'autre (d'où le "rapide").
Par exemple : Dakar France fonctionne car Dakar est une ville et France est un pays.
Créer un fichier JSON "lucas_data_filtered.json" avec les données filtrées.


countCityLucasData.py 
Permet de compter le nombre de villes ainsi que le nombre d'artiste y étant nés.
Créer un fichier CSV "lucas_data_cities.csv" avec les données calculées.


addLatLongCityLucasData.py 
Permet d'ajouter les coordonnées GPS des villes. De plus il permet de vérifier que les villes et leurs pays existe bien.
Par exemple : Dakar France ne fonctionne pas car Dakar n'est pas une ville de France mais du Sénégal.
Créer un fichier JSON "lucas_data_filtered2.json" avec les données filtrées.
Créer un fichier CSV "lucas_data_cities_latlong.csv" avec les données calculées.


countCountryLucasData.py
Permet de compter le nombre de pays ainsi que le nombre d'artiste y étant nés.
Créer un fichier CSV "lucas_data_countries.csv" avec les données calculées.


addLatLongCountryLucasData.py
Permet d'ajouter les coordonnées GPS des pays. De plus il permet de vérifier que les pays existe bien (au cas où même si normalement les données sont correctement filtrées à cette étape).
Créer un fichier JSON "lucas_data_filtered3.json" avec les données filtrées.
Créer un fichier CSV "lucas_data_countries_latlong.csv" avec les données calculées.





Le script getLucasDataTTL.py n'est pas utiliser pour le moment.


-------------------------------------------------------------------------
Date de naissance des artistes optionnelles ? Undefined accepté ? 2k échantillons corrects (DoB obligatoire).
Echelle logarithmique, ou extremum défini.
Jouer sur les niveaux de zoom
Colorier les pays en fonction du nombre d'artistes (circle).
Click sur un pays zoom sur la ville avec le plus d'artiste dans la ville.
Popup avec nom des artistes (plusieurs colonnes ci-besoin).
Click sur le nom dans le popup envoie sur la page Wasabi de l'artiste.
Click sur une ville / pays zoom sur la ville / pays.

Filtre par genre, age, vivant ou mort.
-------------------------------------------------------------------------


