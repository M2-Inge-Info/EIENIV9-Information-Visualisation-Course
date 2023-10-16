import pandas as pd

# Chemin des fichiers CSV de sortie
solo_csv_file = "src\data\quentin_data_artist_solo.csv"
groupe_csv_file = "src\data\quentin_data_artist_groupe.csv"

# Charger les fichiers CSV en tant que DataFrames
df_solo = pd.read_csv(solo_csv_file, encoding='utf-8')
df_groupe = pd.read_csv(groupe_csv_file, encoding='utf-8')

# Ajouter une colonne "Nom du groupe" au DataFrame des artistes en solo
df_solo["Nom du groupe"] = "Null"

# Concaténer les deux DataFrames
concatenated_df = pd.concat([df_solo, df_groupe], ignore_index=True)

# Sauvegarder le DataFrame concaténé dans un nouveau fichier CSV
output_csv_file = "src\data\quentin_data_artists.csv"
concatenated_df.to_csv(output_csv_file, index=False, encoding='utf-8')

print(f"Les données ont été concaténées et enregistrées dans {output_csv_file}")
