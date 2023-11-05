import json

# Charger les données du fichier JSON
with open('final_data.json', 'r') as f:
    data = json.load(f)

# Ensemble pour stocker les clés uniques
unique_keys = set()

# Parcourir chaque artiste et extraire les clés de 'informations'
for artist in data:
    if 'informations' in artist:
        for key in artist['informations'].keys():
            unique_keys.add(key)

# Sauvegarder les clés uniques dans un fichier JSON
with open('unique_keys.json', 'w') as f:
    json.dump(list(unique_keys), f)

print("Les clés uniques ont été sauvegardées dans 'unique_keys.json'")
