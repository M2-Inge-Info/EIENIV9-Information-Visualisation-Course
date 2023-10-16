import requests
from bs4 import BeautifulSoup
import json

URL = "https://equipboard.com/pros/adam-clayton"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

response = requests.get(URL, headers=HEADERS)
soup = BeautifulSoup(response.content, "html.parser")

# Trouver le premier élément avec la classe spécifiée
item_card = soup.find("div", class_="eb-artist__item-card-container position-relative")

# Extraire les informations
product_name = item_card.find("a", class_="font-weight-bold text-reset").text

product_type = item_card.find("a", class_="text-muted").text

# Trouver l'image avec la classe spécifiée
product_img = item_card.find('img', class_="eb-img-lazy img-fluid")

# Initialiser un dictionnaire pour stocker les informations
data = {}

# Vérifier si l'image a été trouvée
if product_img:
    # Extraire l'URL de l'image
    data["product_img_url"] = product_img["src"]

    # Si vous souhaitez extraire d'autres attributs de l'image, vous pouvez le faire de la même manière.
    # Par exemple, pour extraire l'attribut 'alt' :
    data["alt_text"] = product_img.get("alt", "")  # Utilisez get pour éviter les erreurs si l'attribut n'existe pas

    # Convertir le dictionnaire en JSON
    json_data = json.dumps(data, indent=4)
    print(json_data)
else:
    print("Aucune image avec la classe spécifiée trouvée.")

# Extraire les liens d'achat
buy_links = {}
for link in item_card.find_all("a", class_="eb-artist__item-card-buy-link"):
    buy_links[link.text] = link["href"]

# Créer un dictionnaire pour stocker les informations
data = {
    "product_name": product_name,
    "product_link": product_type,
}

# Convertir le dictionnaire en JSON
json_data = json.dumps(data, indent=4)

print(json_data)
