import pandas as pd

# Charger le fichier CSV d'entrée
df = pd.read_csv("src\data\quentin_data_artists.csv")

# Créer une nouvelle colonne pour la tranche d'âge en fonction de la date de sortie
df['année'] = pd.cut(pd.to_datetime(df['Date de sortie']).dt.year, 
                              bins=[0, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 9999], 
                              labels=['<1950', '1950-1960', '1960-1970', '1970-1980', '1980-1990', '1990-2000', '2000-2010', '2010-2020', '>2020'])

# Regrouper et compter le nombre d'albums par genre et tranche d'âge
result_df = df.groupby(['Genre', 'année']).size().reset_index(name='Nombre d\'albums')
result_df = result_df.rename(columns={'Titre Album': 'Nombre d\'albums'})

##### Filtrer les lignes où "Nombre d'albums" est supérieur à 0 #####
## result_df = result_df.query('`Nombre d\'albums` > 0')

# Sauvegarder le DataFrame résultant dans un fichier CSV
result_df.to_csv("src\data\quentin_population_album.csv", index=False)

print("Fichier de sortie généré avec succès.")
