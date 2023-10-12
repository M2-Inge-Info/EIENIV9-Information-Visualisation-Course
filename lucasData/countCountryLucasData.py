# Compte le nombre d'artiste par pays à partir du fichier csv lucas_data_cities_latlong.csv et enregistre la liste de pays et le nombre d'artiste dans le fichier lucas_data_countries.csv.


import pandas as pd
import csv

fileCSV = "../src/data/lucas_data_cities_latlong.csv"
fileCSV2 = "../src/data/lucas_data_countries.csv"

# Charger le fichier CSV dans un DataFrame
df_cities = pd.read_csv(fileCSV, sep=';')

# Créer un DataFrame vide
df = pd.DataFrame(columns=['country', 'nbArtists'])

# Parcourir les données et compter le nombre d'artiste par ville et pays

for index, row in df_cities.iterrows():
    # Récupérer le pays de l'artiste
    pays_artiste = row['country']

    # Vérifier si le pays de l'artiste est présent dans le DataFrame
    if pays_artiste in df['country'].values:
        # Récupérer l'index du pays
        index = df.index[df['country'] == pays_artiste].tolist()[0]
        # Incrémenter le nombre d'artiste
        df.at[index, 'nbArtists'] += row['nbArtists']
    else:
        # Ajouter le pays dans le DataFrame avec pandas.concat en gardant l'index
        df = pd.concat([df, pd.DataFrame([[pays_artiste, row['nbArtists']]], columns=['country', 'nbArtists'])], ignore_index=True)


# Trier le DataFrame par nombre d'artiste
df = df.sort_values(by=['nbArtists'], ascending=False)

# Enregistrer le DataFrame dans un fichier CSV
df.to_csv(fileCSV2, sep=';', index=False, quoting=csv.QUOTE_ALL)

# Afficher le DataFrame
print(df.head(5))

# Afficher la taille du DataFrame
print(df.shape)