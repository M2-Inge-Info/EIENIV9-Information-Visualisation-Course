"""
Nom du fichier : scraper_favorite_equipement.py
Auteur : Jonathan
Licence : Walter White
Description : Ce script effectue du scraping web asynchrone pour extraire des informations sur l'équipement utilisé par des artistes musicaux.
Il utilise la bibliothèque aiohttp pour les requêtes HTTP asynchrones et BeautifulSoup pour le parsing HTML. Les informations
récupérées incluent le nom de l'artiste, le nom et le type de produit, une image du produit, et des liens d'achat.
Les données extraites sont ensuite sauvegardées dans un fichier JSON.
"""

import aiohttp
import asyncio
from bs4 import BeautifulSoup
import json
from urllib.parse import urlparse

def extract_artist_name(url):
    """
    Extrait le nom de l'artiste à partir de l'URL.
    
    Args:
        url (str): L'URL à partir de laquelle extraire le nom de l'artiste.
        
    Returns:
        str: Le nom de l'artiste.
    """
    path = urlparse(url).path  # Obtenez le chemin de l'URL, par exemple, '/pros/13-god'
    artist_slug = path.split('/')[-1]  # Divisez le chemin par '/' et prenez le dernier élément

    # Divisez la chaîne artist_slug sur le premier tiret
    parts = artist_slug.split('-', 1)
    
    if len(parts) == 2:
        first_name, last_name = parts
        # Convertissez le nom en majuscules
        last_name = last_name.upper()
    else:
        # Si aucun tiret n'est trouvé, utilisez toute la chaîne comme prénom et laissez le nom vide
        first_name = artist_slug
        last_name = ''
    return f'{first_name} {last_name}'


RETRY_COUNT = 3
DELAY = 1  # en secondes


async def fetch(session, url, headers):
    """
    Effectue une requête GET asynchrone à l'URL spécifiée.
    
    Args:
        session (aiohttp.ClientSession): La session client à utiliser pour la requête.
        url (str): L'URL à requêter.
        headers (dict): Les en-têtes à inclure dans la requête.
        
    Returns:
        str: Le contenu HTML de la page, ou None en cas d'échec.
    """
    for _ in range(RETRY_COUNT):
        try:
            async with session.get(url, headers=headers) as response:
                return await response.text()
        except aiohttp.ClientError as e:
            print(f"Error fetching {url}. Retrying...")
            await asyncio.sleep(DELAY)
    print(f"Failed to fetch {url} after {RETRY_COUNT} retries.")
    return None


async def extract_equipment_info(session, equipment_url, artist_node):
    """
    Extrait les informations sur l'équipement à partir de l'URL spécifiée.
    
    Args:
        session (aiohttp.ClientSession): La session client à utiliser pour la requête.
        equipment_url (str): L'URL de l'équipement à analyser.
        
    Returns:
        dict: Un dictionnaire contenant les informations extraites, ou None en cas d'échec.
    """
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        html = await fetch(session, equipment_url, HEADERS)
        if html is None:
            with open('failed_urls.txt', 'a') as f:
                f.write(equipment_url + '\n')
            return None

        soup = BeautifulSoup(html, 'html.parser')

        item_card = soup.find("div", class_="eb-artist__item-card-container position-relative")
        if not item_card:
            print(f"Failed to find item card for {equipment_url}")
            return None

        artist = extract_artist_name(equipment_url)

        product_name_element = item_card.find("a", class_="font-weight-bold text-reset")
        product_name = product_name_element.text if product_name_element else None

        product_type_element = item_card.find("a", class_="text-muted")
        product_type = product_type_element.text if product_type_element else None

        product_img = item_card.find('img', class_="eb-img-lazy img-fluid")

        data = {}
        if product_img:
            data["product_img_url"] = product_img["src"]
            data["alt_text"] = product_img.get("alt", "")
        else:
            print(f"No image found for {equipment_url}")

        buy_links = {}
        for link in item_card.find_all("a", class_="eb-artist__item-card-buy-link"):
            buy_links[link.text] = link["href"]

        data.update({
            "artist_node": artist_node['value'],  # Ajoutez cette ligne
            "artist": artist,
            "product_name": product_name,
            "product_type": product_type,
            "buy_links": buy_links
        })

        print(data)

        return data
    except Exception as e:
        print(f"Error processing {equipment_url}: {e}")
        with open('failed_urls.txt', 'a') as f:
            f.write(equipment_url + '\n')
        return None


async def main():
    """
    Fonction principale pour charger les URL des équipements, extraire les informations, et sauvegarder les données.
    """
    # Load equipment URLs from JSON
    with open('artists_equipment_page.json', 'r') as f:
        equipment_data = json.load(f)

    all_results = []
    async with aiohttp.ClientSession() as session:
        tasks = [extract_equipment_info(session, result['equipmentPage']['value'], result['artist']) for result in equipment_data['results']['bindings']]
        results = await asyncio.gather(*tasks)
        all_results.extend(filter(None, results))

    # Save results to a new JSON file
    with open('scraped_data.json', 'w') as f:
        json.dump(all_results, f, indent=4)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())