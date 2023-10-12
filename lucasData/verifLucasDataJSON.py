import pandas as pd
import json

fileCities = "../csv/geonames-all-cities-with-a-population-1000.csv"
fileJSON = "../src/data/lucas_data.json"
fileJSON2 = "../src/data/lucas_data_filtered.json"

# Charger le fichier CSV dans un DataFrame
df_csv = pd.read_csv(fileCities, sep=';')

# Charger le fichier JSON dans une structure de données Python
with open(fileJSON, 'r', encoding='utf-8') as json_file:
    data_json = json.load(json_file)

# Affiche la longueur de data_json
print("Villes récupérées:", len(data_json.get('results').get('bindings')))

# Créer un ensemble des villes et pays à partir du DataFrame CSV pour une recherche plus efficace
villes_csv_set = set(df_csv['Name'].str.lower())
pays_csv_set = set(df_csv['Country name EN'].str.lower())

# Pour chaque nom de ville en ASCII (ASCII Name) dans le CSV, ajouter la ville dans l'ensemble (si elle n'existe pas)
villesASCII_csv_set = set(df_csv['ASCII Name'].str.lower())
for ville in villesASCII_csv_set:
    if ville not in villes_csv_set:
        villes_csv_set.add(ville)
        # print(ville)


cityMiss=0
countryMiss=0

# Parcourir les données JSON et vérifier la présence de chaque ville dans le CSV
for artiste in data_json.get('results').get('bindings'):
    ville_artiste = artiste.get('city').get('value').lower()
    pays_artiste = artiste.get('country').get('value').lower()
    
    # Vérifier si la ville de l'artiste est présente dans le CSV
    if ville_artiste not in villes_csv_set:
        # Supprimer l'artiste et toutes ces données du fichier JSON
        data_json.get('results').get('bindings').remove(artiste)

        # print(f"La ville {ville_artiste} n'est pas présente dans le CSV.")
        cityMiss+=1
    else:
        if pays_artiste not in pays_csv_set:
            # Supprimer l'artiste et toutes ces données du fichier JSON
            data_json.get('results').get('bindings').remove(artiste)

            # print(f"Le pays {pays_artiste} n'est pas présent dans le CSV.")
            countryMiss+=1

# Affiche la longueur de data_json
print("Villes filtrées:", len(data_json.get('results').get('bindings')))
print("Villes manquantes:", cityMiss)
print("Pays manquants:", countryMiss)

# Créé un nouveau fichier JSON avec les données filtrées
with open(fileJSON2, 'w', encoding='utf-8') as json_file:
    json.dump(data_json, json_file, ensure_ascii=False, indent=4)
