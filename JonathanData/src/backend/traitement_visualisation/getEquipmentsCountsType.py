import json
from collections import defaultdict, Counter

# Charger les données à partir du fichier JSON
with open('../final_updated_data_no_duplicates.json', 'r') as f:
    data = json.load(f)

# Initialiser un dictionnaire pour stocker les résultats
equipment_counts_type = defaultdict(lambda: {'count': 0, 'instruments': {}})

# Parcourir chaque artiste et leurs équipements
for artist in data:
    favorite_equipment = artist['equipments']['favorite']
    product_type = favorite_equipment['product_type']
    product_name = favorite_equipment['product_name']

    # Mettre à jour le décompte et la liste des instruments pour ce type de produit
    equipment_counts_type[product_type]['count'] += 1
    if product_name in equipment_counts_type[product_type]['instruments']:
        equipment_counts_type[product_type]['instruments'][product_name] += 1
    else:
        equipment_counts_type[product_type]['instruments'][product_name] = 1

# Convertir defaultdict en dict pour la sérialisation JSON
equipment_counts_type = dict(equipment_counts_type)

# Sauvegarder les résultats dans un fichier JSON
with open('equipment_counts_type.json', 'w') as f:
    json.dump(equipment_counts_type, f, indent=4)

print("Processing completed. Results saved to 'equipment_counts_type.json'.")
