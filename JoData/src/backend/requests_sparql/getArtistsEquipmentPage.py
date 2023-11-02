from SPARQLWrapper import SPARQLWrapper, JSON
import json

sparql = SPARQLWrapper("http://wasabi.inria.fr/sparql")
sparql.setQuery("""
    PREFIX wsb: <http://ns.inria.fr/wasabi/ontology/> 

    SELECT ?artist ?equipmentPage FROM <http://ns.inria.fr/wasabi/graph/artists>
    WHERE {
        ?artist wsb:equipBoard_page ?equipmentPage .
    }
""")
sparql.setReturnFormat(JSON)
results = sparql.query().convert()

# Save to JSON file
with open('artists_equipment_page.json', 'w') as f:
    json.dump(results, f, indent=4)