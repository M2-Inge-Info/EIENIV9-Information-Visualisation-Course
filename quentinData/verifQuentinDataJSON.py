import json
import re

# Fichier JSON d'entrée
input_file = "src/data/quentin_data.json"

# Fichier de sortie filtré
output_file = "src/data/quentin_data_filtered.json"

# Expression régulière pour détecter les caractères spéciaux
regex = re.compile('[^a-zA-Z0-9 \-]')

# Chargement du contenu du fichier JSON d'entrée
with open(input_file, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Filtre des données pour exclure les valeurs vides dans "Genre", "Date de sortie" et "Titre" et les genres qui contiennent des caractères spéciaux
filtered_data = {"head": data["head"], "results": {}}
filtered_results = {"distinct": data["results"]["distinct"], "ordered": data["results"]["ordered"], "bindings": []}

for item in data["results"]["bindings"]:
    genre = item.get("genre", {}).get("value", "")
    if (all(item.get(col) and item[col].get("value") for col in ["genre", "date", "title"]) and
            not regex.search(genre)):
        filtered_results["bindings"].append(item)

filtered_data["results"] = filtered_results

# Données filtrées dans un nouveau fichier JSON
with open(output_file, 'w', encoding='utf-8') as file:
    json.dump(filtered_data, file, ensure_ascii=False, indent=4)

print("Les données ont été filtrées avec succès et enregistrées dans", output_file)
