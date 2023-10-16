import aiohttp
import asyncio
from bs4 import BeautifulSoup
import json

RETRY_COUNT = 3
DELAY = 1  # en secondes

async def fetch(session, url, headers):
    for _ in range(RETRY_COUNT):
        try:
            async with session.get(url, headers=headers) as response:
                return await response.text()
        except aiohttp.ClientError as e:
            print(f"Error fetching {url}. Retrying...")
            await asyncio.sleep(DELAY)
    print(f"Failed to fetch {url} after {RETRY_COUNT} retries.")
    return None

async def extract_equipment_info(session, equipment_url):
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
    # Load equipment URLs from JSON
    with open('equipments_types.json', 'r') as f:
        equipment_data = json.load(f)

    all_results = []
    async with aiohttp.ClientSession() as session:
        tasks = [extract_equipment_info(session, result['equipmentPage']['value']) for result in equipment_data['results']['bindings']]
        results = await asyncio.gather(*tasks)
        all_results.extend(filter(None, results))

    # Save results to a new JSON file
    with open('scraped_data.json', 'w') as f:
        json.dump(all_results, f, indent=4)

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
