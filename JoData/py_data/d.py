import json

# Charger les données depuis scraped_data.json
with open('scraped_data.json', 'r') as f:
    scraped_data = json.load(f)

# Créer un dictionnaire pour stocker les données triées par genre et compter le nombre d'éléments
sorted_data = {}
genre_counts = {}

for item in scraped_data:
    product_type = item.get('product_type')
    if product_type:
        # Si le genre existe, ajoutez l'élément au dictionnaire trié
        if product_type not in sorted_data:
            sorted_data[product_type] = []
            genre_counts[product_type] = 0
        sorted_data[product_type].append(item)
        genre_counts[product_type] += 1

# Enregistrer les données triées au format JSON
with open('sorted_data.json', 'w') as f:
    json.dump(sorted_data, f, indent=4)

# Enregistrer les comptes de genre au format JSON
with open('genre_counts.json', 'w') as f:
    json.dump(genre_counts, f, indent=4)
