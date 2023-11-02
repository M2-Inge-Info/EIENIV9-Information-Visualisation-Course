import json

# Supposons que vos données sont stockées dans un fichier 'data.json'
with open('scraped_all_equipments.json', 'r') as f:
    data = json.load(f)

# Créer une liste pour stocker les noms des instruments
instruments = []

# Parcourir chaque artiste dans les données
for artist_data in data:
    # Extraire les équipements favoris et autres
    favorite_equipment = artist_data['equipments']['favorite']
    other_equipments = artist_data['equipments']['others']

    # Ajouter le nom de l'équipement favori à la liste
    if favorite_equipment and 'product_name' in favorite_equipment:
        instruments.append(favorite_equipment['product_name'])

    # Ajouter les noms des autres équipements à la liste
    for equipment in other_equipments:
        if 'product_name' in equipment:
            instruments.append(equipment['product_name'])

# Sauvegarder la liste des instruments dans un fichier JSON
with open('instruments.json', 'w') as f:
    json.dump(instruments, f, indent=4)

print("La liste des instruments a été sauvegardée dans 'instruments.json'.")
