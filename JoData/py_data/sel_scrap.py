from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import json

from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument('--ignore-certificate-errors')
chrome_options.add_argument('--ignore-ssl-errors')

driver = webdriver.Chrome(executable_path='chromedriver.exe', chrome_options=chrome_options)


URL = "https://equipboard.com/pros/adam-clayton"

driver.get(URL)

# Attendre que le premier élément avec la classe spécifiée soit chargé
wait = WebDriverWait(driver, 10)  # Attendre jusqu'à 10 secondes
item_card_element = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "eb-artist__item-card-container")))

# Obtenir le contenu de la page
page_content = driver.page_source
soup = BeautifulSoup(page_content, "html.parser")

# Trouver le premier élément avec la classe spécifiée
item_card = soup.find("div", class_="eb-artist__item-card-container position-relative")

# Extraire les informations
data = {
    "product_name": item_card.find("a", class_="font-weight-bold text-reset").text,
    "product_type": item_card.find("a", class_="text-muted").text,
    "product_img_url": item_card.find('img', class_="eb-img-lazy img-fluid")["src"],
    "alt_text": item_card.find('img', class_="eb-img-lazy img-fluid").get("alt", ""),
    "buy_links": {link.text: link["href"] for link in item_card.find_all("a", class_="eb-artist__item-card-buy-link")}
}

# Convertir le dictionnaire en JSON
json_data = json.dumps(data, indent=4)
print(json_data)

# Fermer le navigateur
driver.quit()
