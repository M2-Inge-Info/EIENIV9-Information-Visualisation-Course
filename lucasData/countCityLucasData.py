import json
import pandas as pd
import csv

fileJSON = "../src/data/lucas_data_filtered.json"
fileCSV = "../src/data/lucas_data_cities.csv"

# Charger le fichier JSON dans une structure de données Python
with open(fileJSON, 'r', encoding='utf-8') as json_file:
    data_json = json.load(json_file)

# Créer un DataFrame vide
df = pd.DataFrame(columns=['city', 'country', 'nbArtists'])

# Parcourir les données JSON et compter le nombre d'artiste par ville et pays
for artiste in data_json.get('results').get('bindings'):

    # Récupérer la ville et le pays de l'artiste
    ville_artiste = artiste.get('city').get('value').lower()
    pays_artiste = artiste.get('country').get('value').lower()

    # Vérifier si la ville de l'artiste est présente dans le DataFrame
    if ville_artiste in df['city'].values:
        # Récupérer l'index de la ville
        index = df.index[df['city'] == ville_artiste].tolist()[0]
        # Incrémenter le nombre d'artiste
        df.at[index, 'nbArtists'] += 1
    else:
        # Ajouter la ville et le pays dans le DataFrame avec pandas.concat en gardant l'index
        df = pd.concat([df, pd.DataFrame([[ville_artiste, pays_artiste, 1]], columns=['city', 'country', 'nbArtists'])], ignore_index=True)


# Trier le DataFrame par nombre d'artiste
df = df.sort_values(by=['nbArtists'], ascending=False)

# Enregistrer le DataFrame dans un fichier CSV
df.to_csv(fileCSV, sep=';', index=False, quoting=csv.QUOTE_ALL)

# Afficher le DataFrame
print(df.head(5))

# Afficher la taille du DataFrame
print(df.shape)