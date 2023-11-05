import pandas as pd

# Path des fichiers CSV de sortie
solo_csv_file = "src\data\quentin_data_artist_solo.csv"
groupe_csv_file = "src\data\quentin_data_artist_groupe.csv"

# Chargement des fichiers CSV en DataFrames
df_solo = pd.read_csv(solo_csv_file, encoding='utf-8')
df_groupe = pd.read_csv(groupe_csv_file, encoding='utf-8')

# Ajout de la colonne "Nom du groupe" au DataFrame
df_solo["Nom du groupe"] = "Null"

# Concaténation des deux DataFrames
concatenated_df = pd.concat([df_solo, df_groupe], ignore_index=True)

# Sauvegarde du DataFrame concaténé 
output_csv_file = "src\data\quentin_data_artists.csv"
concatenated_df.to_csv(output_csv_file, index=False, encoding='utf-8')

print(f"Les données ont été concaténées et enregistrées dans {output_csv_file}")
