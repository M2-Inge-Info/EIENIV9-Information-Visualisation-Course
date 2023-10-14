import json

# Nom du fichier JSON d'entrée
input_file = "src\data\quentin_data.json"

# Nom du fichier de sortie filtré
output_file = "src\data\quentin_data_filtered.json"

# Charger le contenu du fichier JSON d'entrée en spécifiant l'encodage
with open(input_file, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Filtrer les données en excluant celles où "births" est vide ou contient uniquement des crochets vides
filtered_data = {"head": data["head"], "results": {}}
filtered_results = {"distinct": data["results"]["distinct"], "ordered": data["results"]["ordered"], "bindings": []}

for item in data["results"]["bindings"]:
    if "births" in item and item["births"]["value"] and "[]" not in item["births"]["value"]:
        filtered_results["bindings"].append(item)

filtered_data["results"] = filtered_results

# Écrire les données filtrées dans un nouveau fichier JSON
with open(output_file, 'w', encoding='utf-8') as file:
    json.dump(filtered_data, file, ensure_ascii=False, indent=4)

print("Les données ont été filtrées avec succès et enregistrées dans", output_file)


