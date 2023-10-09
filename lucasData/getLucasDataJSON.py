from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import Graph, Literal, URIRef
from rdflib.namespace import Namespace
import json

# Définissez l'URL du point de terminaison SPARQL
sparql_endpoint = "http://wasabi.inria.fr/sparql"

# Créez une instance de SPARQLWrapper
sparql = SPARQLWrapper(sparql_endpoint)

# Définissez les Namespace
foaf = Namespace("http://xmlns.com/foaf/0.1/")
schema = Namespace("http://schema.org/")
wsb = Namespace("http://ns.inria.fr/wasabi/ontology/")

# Utilisez les préfixes dans votre requête SPARQL
query = """
PREFIX foaf:    <http://xmlns.com/foaf/0.1/>
PREFIX schema:  <http://schema.org/> 
PREFIX wsb:     <http://ns.inria.fr/wasabi/ontology/> 

SELECT ?subject ?name ?birth ?death (GROUP_CONCAT(?genre; separator=", ") as ?genres) ?city ?country from <http://ns.inria.fr/wasabi/graph/artists>
WHERE {
    ?subject schema:birthDate ?birth ;
             schema:genre ?genre ;
             foaf:name ?name ;
             wsb:location ?location .
    
    ?location wsb:city ?city ;
              wsb:country ?country .
             
             
    OPTIONAL {?subject schema:deathDate ?death .}
}
ORDER BY ?name
"""


# Définissez le format de réponse JSON
sparql.setReturnFormat(JSON)

# Exécutez la requête SPARQL
sparql.setQuery(query)
results = sparql.query().convert()

# Enregistrez le résultat au format JSON
output_file = "../src/data/lucas_data.json"

# Écrivez la liste d'artistes au format JSON dans le fichier de sortie
with open(output_file, "w", encoding="utf-8") as json_file:
    json.dump(results, json_file, ensure_ascii=False, indent=4)

print(f"Les données ont été enregistrées dans {output_file}")
