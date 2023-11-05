import pandas as pd

# Chargement du fichier CSV
df = pd.read_csv("src/data/quentin_data_artists.csv")

# Mettre valeurs 'Null' par NaN pour plus tard
df = df.replace('Null', pd.NA)

# Group par 'Titre Album' et 'Date de sortie' (au cas où deux albums différents ont le même titre) et concaténer les noms des artistes
df_grouped = df.groupby(['Titre Album', 'Date de sortie']).agg({
    'Nom de l\'artiste': lambda x: ', '.join(x),
    'Genre': 'first',
    'Groupe': 'first',
    'Nom du groupe': 'first'
}).reset_index()

# Suppression des parenthèses et des guillemets simples autour des noms d'artistes
df_grouped['Nom de l\'artiste'] = df_grouped['Nom de l\'artiste'].str.replace(r"[(')]", "")

# 'Date de sortie' en datetime
df_grouped['Date de sortie'] = pd.to_datetime(df_grouped['Date de sortie'], errors='coerce')

# Création d'une nouvelle colonne pour la tranche d'âge en fonction de l'année de sortie
df_grouped['année'] = pd.cut(df_grouped['Date de sortie'].dt.year, 
                             bins=[0, 1970, 1980, 1990, 2000, 2010, 2020, 9999], 
                             labels=['<1970', '1970-1980', '1980-1990', '1990-2000', '2000-2010', '2010-2020', '>2020'])

# Résultat dans un nouveau fichier CSV
df_grouped.to_csv("src/data/quentin_data_artistsUnique.csv", index=False)
