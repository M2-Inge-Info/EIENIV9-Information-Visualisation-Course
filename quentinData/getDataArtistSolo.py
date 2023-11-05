import json
import csv

# Nom du fichier JSON d'entrée
input_file = "src\data\quentin_data_filtered.json"

# Nom du fichier CSV de sortie
output_file = "src\data\quentin_data_artist_solo.csv"

# Chargement du fichier JSON d'entrée 
with open(input_file, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Filtre des données pour n'inclure que cellesles où les artistes ne font pas parti d'un groupe "nbMembers" est égal à 0
filtered_solo_data = [item for item in data["results"]["bindings"] if "nbMembers" in item and (int(item["nbMembers"]["value"]) == 0 )]

# Création d'une liste de lignes pour le CSV
csv_lines = []

for item in filtered_solo_data:
    artist_names = item["nameSolo"]["value"].split("; ")
    title = item["title"]["value"]
    genre = item["genre"]["value"]
    release_date = item["date"]["value"]
    nb_members = "No"

    for artist_name in zip(artist_names):
        csv_lines.append([artist_name, title, genre, release_date, nb_members])

# Écrire les données dans un nouveau fichier CSV
with open(output_file, 'w', newline='', encoding='utf-8') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(["Nom de l'artiste", "Titre Album", "Genre", "Date de sortie", "Groupe"])
    csv_writer.writerows(csv_lines)

print(f"Les données ont été filtrées et enregistrées dans {output_file}")
