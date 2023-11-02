import json

# Charger les données des fichiers JSON
with open('updated_scraped_all_equipments.json', 'r') as f:
    equipments_data = json.load(f)

with open('artists_informations.json', 'r') as f:
    artists_info = json.load(f)

# Créer un dictionnaire pour faciliter la recherche des informations de l'artiste
artist_info_dict = {}
for artist_info in artists_info:
    artist_node = artist_info['artist_node']
    
    # Fusionner les informations de l'artiste en éliminant les doublons
    merged_info = {}
    for info_set in artist_info['informations']:
        simplified_info = {key: info['value'] for key, info in info_set.items()}
        for key, value in simplified_info.items():
            if key not in merged_info or merged_info[key] == value:
                merged_info[key] = value
    
    # Utiliser le nom de l'artiste en minuscules comme clé
    normalized_artist_name = artist_info['artist'].lower()
    if normalized_artist_name not in artist_info_dict:
        artist_info_dict[normalized_artist_name] = merged_info

# Ajouter les informations de l'artiste à chaque entrée dans equipments_data
final_data = []
existing_artists = set()
for artist_data in equipments_data:
    artist_name = artist_data['artist']
    normalized_artist_name = artist_name.lower()
    
    if normalized_artist_name not in existing_artists:
        if normalized_artist_name in artist_info_dict:
            artist_data['informations'] = artist_info_dict[normalized_artist_name]
        final_data.append(artist_data)
        existing_artists.add(normalized_artist_name)

# Sauvegarder les données mises à jour dans un nouveau fichier JSON
with open('final_updated_data_no_duplicates.json', 'w') as f:
    json.dump(final_data, f, indent=4)

print("Data updated and duplicates removed. Results saved to 'final_updated_data_no_duplicates.json'.")
