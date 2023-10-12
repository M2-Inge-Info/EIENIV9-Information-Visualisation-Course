import pandas as pd
import csv
import json

fileCities = "../csv/geonames-all-cities-with-a-population-1000.csv"
fileCSV = "../src/data/lucas_data_cities.csv"
fileCSV2 = "../src/data/lucas_data_cities_latlong.csv"

fileData = "../src/data/lucas_data_filtered.json"
fileData2 = "../src/data/lucas_data_filtered2.json"

# Charger le fichier JSON dans une structure de données Python
with open(fileData, 'r', encoding='utf-8') as json_file:
    data_json = json.load(json_file)

# Charger les fichiers CSV dans des DataFrame
df_cities = pd.read_csv(fileCities, sep=';')
df_data = pd.read_csv(fileCSV, sep=';')

# Créer un DataFrame vide
df_LatLon = pd.DataFrame(columns=['city', 'country', 'nbArtists', 'latitude', 'longitude'])

coordinatesMiss = 0
citiesMiss = 0

i = 0
total = len(df_data)
oldPercent = 0

# Parcourir les données et compter le nombre d'artiste par ville et pays
for index, row in df_data.iterrows():
    i += 1
    # Afficher le pourcentage de progression
    percent = int(i/total*100)
    if percent >= oldPercent+5:
        oldPercent = percent
        # Affiche une barre de progression avec 20 carractères espacés de 5%
        print('---------------------------------------------------', 'Progression: ', '[' + '='*int(percent/5) + ' '*(20-int(percent/5)) + ']', percent, '%', '--------------------------------------------------')

    # Récupérer la ville et le pays de l'artiste
    ville_artiste = row['city']
    pays_artiste = row['country']

    # Récupérer les coordonnées de la ville (dans la colonne 'Coordinates' en format 'latitude,longitude').
    try:
        coordonnees = df_cities.loc[(((df_cities['Name'].str.lower() == ville_artiste) | (df_cities['ASCII Name'].str.lower() == ville_artiste)) & (df_cities['Country name EN'].str.lower() == pays_artiste))]['Coordinates'].values[0]

        latitude = coordonnees.split(', ')[0]
        longitude = coordonnees.split(', ')[1]

        # Ajouter la ville et le pays dans le DataFrame avec pandas.concat en gardant l'index
        df_LatLon = pd.concat([df_LatLon, pd.DataFrame([[ville_artiste, pays_artiste, row['nbArtists'], latitude, longitude]], columns=['city', 'country', 'nbArtists', 'latitude', 'longitude'])], ignore_index=True)

    except(IndexError):
        print("Erreur: ", ville_artiste, pays_artiste)

        # Supprimer du fichier json les artistes ayant une ville et un pays non trouvés
        for artiste in data_json.get('results').get('bindings'):
            if artiste.get('city').get('value').lower() == ville_artiste and artiste.get('country').get('value').lower() == pays_artiste:
                data_json.get('results').get('bindings').remove(artiste)
        
        coordinatesMiss += row['nbArtists']
        citiesMiss += 1
        

# Enregistrer le fichier json
with open(fileData2, 'w', encoding='utf-8') as json_file:
    json.dump(data_json, json_file, ensure_ascii=False, indent=4)

# Enregistrer le DataFrame dans un fichier CSV
df_LatLon.to_csv(fileCSV2, sep=';', index=False, quoting=csv.QUOTE_ALL)

# Afficher le DataFrame
print(df_LatLon.head(5))

# Afficher la taille du DataFrame
print(df_LatLon.shape)

# Afficher le nombre d'artistes sans coordonnées
print("Nombre d'artistes sans coordonnées: ", coordinatesMiss)

# Afficher le nombre de villes sans coordonnées
print("Nombre de villes sans coordonnées: ", citiesMiss)