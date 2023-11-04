# Les étapes du backend 

Step 1 : Requête SPARQL - getArtistsEquipmentPage.py
Récupérer avec une requête SPARQLles inforamtions des équipements pages de tous les artistes
artists_equipment_page.json

Step 2 : Scraper les instruments pour chaque page d'artiste
    - Scraper l'instrument favorite (scraper_favorite_equipement.py) - Inutile
    - Scraper tous les instruments en mettant l'instrument favorite et les autres. (scraper_all_equipements.py)
    - Mettre les urls qui ont échoué dans un fichier "failed_urls.txt"
    - Mettre les données en succées dans un fichier json "scraped_all_equipments.json"

Step 3 : Récupérer les informations des artistes qui ont pu être scrapé.
Récupérer les informations avec une requête SPARQL (getArtistsInformations.py)
Filtrer les artistes qui ont un équipement avec une valeur de null ce qui signifie qu'il n'as pas pu récupérer l'instrument 
artists_informations.json

Step 4 : Récupérer les images de chaque instrument
Pour ceci l'utilisation du scraping au step 2 n'était pas possible cela mettait énormement de temps donc je suis passé par une approche plus simple. 
J'ai récupérer les instruments par rapport au fichier "scraped_all_equipments.json". J'ai filtrer pour ne pas avoir plusieurs instruments avec le même nom.
Ensuite j'ai créer un fichier "instruments.json" qui contient tous les instruments.
Et j'ai scrapé les sources des images par rapport à chaque instruments (instruments_images.json)

Step 5 : Fusion des données
Pour fusionner les données j'ai d'abord fusionner les informations des équipements avec les sources de leurs images. (updated_scraped_all_equipments.json)
Ensuite j'ai fusionner tous les équipements avec les informations de leurs artistes défini. (final_updated_data_no_duplicates.json)

Step 6 : Traitement des données pour la visualisation
    - 

Step 7 : Création de la visualiation en frontend
    -


-- Report 

