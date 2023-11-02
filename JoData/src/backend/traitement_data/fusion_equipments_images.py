import json

# Charger les données des fichiers JSON
with open('scraped_all_equipments.json', 'r') as f:
    equipments_data = json.load(f)

with open('instrument_images.json', 'r') as f:
    instrument_images = json.load(f)

# URL de l'image par défaut
default_image_url = "https://assets.equipboard.com/assets/item-eb-placeholder-s-975ec9e0dbc7270a8bf9a137db8eb0ffd775efcc0311606af5e086e516beee20.png"

# Parcourir les données des équipements, ajouter l'attribut product_img et supprimer buy_links
for artist_data in equipments_data:
    for category in ['favorite', 'others']:
        equipments = artist_data['equipments'][category]
        if category == 'favorite':
            equipments = [equipments]  # Convertir en liste pour une itération uniforme

        for equipment in equipments:
            product_name = equipment.get('product_name')
            # Rechercher l'image correspondante et l'ajouter, sinon utiliser l'image par défaut
            equipment['product_img'] = instrument_images.get(product_name, default_image_url)
            # Supprimer l'attribut buy_links
            if 'buy_links' in equipment:
                del equipment['buy_links']

# Sauvegarder les données mises à jour dans un nouveau fichier JSON
with open('updated_scraped_all_equipments.json', 'w') as f:
    json.dump(equipments_data, f, indent=4)

print("Data updated and saved to 'updated_scraped_all_equipments.json'.")
