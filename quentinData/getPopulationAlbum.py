import pandas as pd

# Charger le fichier CSV d'entrée
df = pd.read_csv("src\data\quentin_data_artists.csv")

# Créer une nouvelle colonne pour la tranche d'âge en fonction de la date de sortie
df['année'] = pd.cut(pd.to_datetime(df['Date de sortie']).dt.year, 
                     bins=[0, 1970, 1980, 1990, 2000, 2010, 2020, 9999], 
                     labels=['<1970', '1970-1980', '1980-1990', '1990-2000', '2000-2010', '2010-2020', '>2020'])

# Regrouper et compter le nombre d'albums par genre et tranche d'âge
result_df = df.groupby(['Genre', 'année']).size().reset_index(name='Nombre d\'albums')
result_df = result_df.rename(columns={'Titre Album': 'Nombre d\'albums'})

# Réorganiser les tranches d'âge dans l'ordre souhaité
result_df['année'] = pd.Categorical(result_df['année'], 
                                    categories=['<1970', '1970-1980', '1980-1990', '1990-2000', '2000-2010', '2010-2020', '>2020'], 
                                    ordered=True)

# Filtrer les entrées où le Nombre d'albums est 0
result_df = result_df[result_df['Nombre d\'albums'] > 0]

# Trier le DataFrame résultant en fonction de l'année
result_df = result_df.sort_values(by='année')

# Sauvegarder le DataFrame résultant dans un fichier CSV
result_df.to_csv("src\data\quentin_population_album.csv", index=False)

print("Fichier de sortie généré avec succès.")