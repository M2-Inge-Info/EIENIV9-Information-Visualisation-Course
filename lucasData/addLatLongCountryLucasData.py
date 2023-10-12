import pandas as pd
import csv
import json

fileCountries = "../csv/world_country_and_usa_states_latitude_and_longitude_values.csv"
fileCSV = "../src/data/lucas_data_countries.csv"
fileCSV2 = "../src/data/lucas_data_countries_latlong.csv"

fileData = "../src/data/lucas_data_filtered2.json"
fileData2 = "../src/data/lucas_data_filtered3.json"

# Charger le fichier JSON dans une structure de données Python
with open(fileData, 'r', encoding='utf-8') as json_file:
    data_json = json.load(json_file)

# Charger les fichiers CSV dans des DataFrame
df_countries = pd.read_csv(fileCountries, sep=';')
df_data = pd.read_csv(fileCSV, sep=';')

# Créer un DataFrame vide
df_LatLon = pd.DataFrame(columns=['country', 'nbArtists', 'latitude', 'longitude'])

coordinatesMiss = 0
countriesMiss = 0

i = 0
total = len(df_data)
oldPercent = 0

# Parcourir les données et compter le nombre d'artiste par pays
for index, row in df_data.iterrows():
    i += 1
    # Afficher le pourcentage de progression
    percent = int(i/total*100)
    if percent >= oldPercent+5:
        oldPercent = percent
        # Affiche une barre de progression avec 20 carractères espacés de 5%
        print('---------------------------------------------------', 'Progression: ', '[' + '='*int(percent/5) + ' '*(20-int(percent/5)) + ']', percent, '%', '--------------------------------------------------')

    # Récupérer le pays de l'artiste
    pays_artiste = row['country']

    # Récupérer les coordonnées du pays (dans les colonnes 'latitude' et 'longitude').
    try:
        latitude = df_countries.loc[df_countries['country'].str.lower() == pays_artiste]['latitude'].values[0]
        longitude = df_countries.loc[df_countries['country'].str.lower() == pays_artiste]['longitude'].values[0]

        # Ajouter le pays dans le DataFrame avec pandas.concat en gardant l'index
        df_LatLon = pd.concat([df_LatLon, pd.DataFrame([[pays_artiste, row['nbArtists'], latitude, longitude]], columns=['country', 'nbArtists', 'latitude', 'longitude'])], ignore_index=True)

    except(IndexError):
        print("Erreur: ", pays_artiste)

        # Supprimer du fichier json les artistes ayant un pays non trouvé
        for artiste in data_json.get('results').get('bindings'):
            if artiste.get('country').get('value').lower() == pays_artiste:
                data_json.get('results').get('bindings').remove(artiste)
        
        coordinatesMiss += row['nbArtists']
        countriesMiss += 1

# Enregistrer le fichier json
with open(fileData2, 'w', encoding='utf-8') as json_file:
    json.dump(data_json, json_file, indent=4)

# Enregistrer le DataFrame dans un fichier CSV
df_LatLon.to_csv(fileCSV2, sep=';', index=False, quoting=csv.QUOTE_ALL)

# Afficher le DataFrame
print(df_LatLon.head(5))

# Afficher la taille du DataFrame
print(df_LatLon.shape)

# Afficher le nombre d'artistes sans coordonnées
print("Nombre d'artistes sans coordonnées: ", coordinatesMiss)

# Afficher le nombre de pays sans coordonnées
print("Nombre de pays sans coordonnées: ", countriesMiss)



