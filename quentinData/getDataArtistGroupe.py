import json
import csv

# Nom du fichier JSON d'entrée
input_file = "src\data\quentin_data_filtered.json"

# Nom du fichier CSV de sortie
output_file = "src\data\quentin_data_artist_groupe.csv"

# Charger le contenu du fichier JSON d'entrée en spécifiant l'encodage
with open(input_file, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Filtrer les données pour n'inclure que celles où "nbMembers" est égal à 0 ou supérieur à 1
filtered_data = [item for item in data["results"]["bindings"] if "nbMembers" in item and (int(item["nbMembers"]["value"]) > 1 )]

# Créer une liste de lignes pour le CSV
csv_lines = []

for item in filtered_data:
    artist_names = item["names"]["value"].split("; ")
    birthdays = item["births"]["value"].split("; ")
    title = item["title"]["value"]
    genre = item["genre"]["value"]
    release_date = item["date"]["value"]

    for artist_name, birthday in zip(artist_names, birthdays):
        csv_lines.append([artist_name, birthday, title, genre, release_date])

# Écrire les données dans un fichier CSV
with open(output_file, 'w', newline='', encoding='utf-8') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(["Nom de l'artiste", "Date d'anniversaire", "Titre", "Genre", "Date de sortie"])
    csv_writer.writerows(csv_lines)

print(f"Les données ont été filtrées et enregistrées dans {output_file}")
