"""
Nom du fichier : getArtistsEquipmentPage.py
Auteur : Jonathan
Licence : Walter White
Description : Ce script utilise SPARQL pour récupérer les pages d'équipement d'artistes depuis une base de données, et sauvegarde les résultats dans un fichier JSON.
"""

from SPARQLWrapper import SPARQLWrapper, JSON
import json

# Initialise la connexion au point d'accès SPARQL
sparql = SPARQLWrapper("http://wasabi.inria.fr/sparql")

# Définit la requête SPARQL pour récupérer les artistes et leurs pages d'équipement
sparql.setQuery("""
    PREFIX wsb: <http://ns.inria.fr/wasabi/ontology/> 

    SELECT ?artist ?equipmentPage FROM <http://ns.inria.fr/wasabi/graph/artists>
    WHERE {
        ?artist wsb:equipBoard_page ?equipmentPage .
    }
""")

# Définit le format de retour des résultats en JSON
sparql.setReturnFormat(JSON)

# Exécute la requête et récupère les résultats
results = sparql.query().convert()

# Sauvegarde les résultats dans un fichier JSON
with open('artists_equipment_page.json', 'w') as f:
    json.dump(results, f, indent=4)
