from selenium import webdriver
from bs4 import BeautifulSoup
import json
import time
import concurrent.futures

def fetch_image(instrument):
    try:
        # Construire l'URL de recherche
        search_url = base_url + instrument.replace(" ", "%20")

        # Accéder à la page de recherche
        driver = webdriver.Chrome()
        driver.get(search_url)

        # Attendre que la page soit chargée
        time.sleep(2)

        # Obtenir le HTML de la page
        html = driver.page_source

        # Utiliser BeautifulSoup pour analyser le HTML
        soup = BeautifulSoup(html, 'html.parser')

        # Trouver la première image dans les résultats de recherche
        first_image = soup.find("img", class_="mr-3 item-image")
        image_url = first_image["src"]

        # Fermer le navigateur
        driver.quit()

        print(f"Found image for {instrument}: {image_url}")
        return (instrument, image_url)

    except Exception as e:
        print(f"Failed to find image for {instrument}: {e}")
        return None

# Charger la liste des instruments à partir du fichier JSON
with open('instruments.json', 'r') as f:
    instruments = json.load(f)

# URL de base pour la recherche
base_url = "https://equipboard.com/search?search_term="

# Dictionnaire pour stocker les noms des instruments et les URL des images
instrument_images = {}

# Utiliser ThreadPoolExecutor pour effectuer des recherches en parallèle
with concurrent.futures.ThreadPoolExecutor() as executor:
    results = list(executor.map(fetch_image, instruments))

# Ajouter les résultats au dictionnaire
for result in results:
    if result:
        instrument_images[result[0]] = result[1]

# Sauvegarder les résultats dans un fichier JSON
with open('instrument_images.json', 'w') as f:
    json.dump(instrument_images, f, indent=4)

print("Scraping completed. Results saved to 'instrument_images.json'.")
