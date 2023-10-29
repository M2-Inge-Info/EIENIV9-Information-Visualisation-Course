import pandas as pd

# Charger le fichier CSV d'entrée
df = pd.read_csv("src\data\quentin_data_artists.csv")

# Convertir la colonne 'Date de sortie' en datetime
df['Date de sortie'] = pd.to_datetime(df['Date de sortie'])

# Créer une nouvelle colonne pour la tranche d'âge en fonction de la date de sortie
df['année'] = pd.cut(df['Date de sortie'].dt.year, 
                     bins=[0, 1970, 1980, 1990, 2000, 2010, 2020, 9999], 
                     labels=['<1970', '1970-1980', '1980-1990', '1990-2000', '2000-2010', '2010-2020', '>2020'])

# Supprimer les doublons basés sur 'Titre Album' et 'Date de sortie'
df = df.drop_duplicates(subset=['Titre Album', 'Date de sortie'])

# Regrouper et compter le nombre d'albums par genre et tranche d'âge
result_df = df.groupby(['Genre', 'année'], observed=True).size().reset_index(name='Nombre d\'albums')

# Réorganiser les tranches d'âge dans l'ordre souhaité
result_df['année'] = pd.Categorical(result_df['année'], 
                                    categories=['<1970', '1970-1980', '1980-1990', '1990-2000', '2000-2010', '2010-2020', '>2020'], 
                                    ordered=True)

# Trier le DataFrame résultant en fonction de l'année et du genre
result_df = result_df.sort_values(by=['année', 'Genre'])

# Sauvegarder le DataFrame résultant dans un fichier CSV
result_df.to_csv("src\data\quentin_population_album.csv", index=False)

print("Fichier de sortie généré avec succès.")
