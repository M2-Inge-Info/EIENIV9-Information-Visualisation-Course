from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import Graph, Literal, URIRef
from rdflib.namespace import Namespace
import json

# URL de la terminaison SPARQL
sparql_endpoint = "http://wasabi.inria.fr/sparql"

# Création de l'instance de SPARQLWrapper
sparql = SPARQLWrapper(sparql_endpoint)

# Les namespaces
foaf = Namespace("http://xmlns.com/foaf/0.1/")
schema = Namespace("http://schema.org/")
wsb = Namespace("http://ns.inria.fr/wasabi/ontology/")

#  Les préfixes dans la requête SPARQL
query = """
PREFIX wsb: <http://ns.inria.fr/wasabi/ontology/> 
PREFIX mo: <http://purl.org/ontology/mo/> 
PREFIX schema: <http://schema.org/> 

SELECT ?subject ?title ?genre ?date ?performer ?artistType (COUNT(?members) as ?nbMembers) ?nameSolo (GROUP_CONCAT(?name; separator="; ") as ?names)
FROM <http://ns.inria.fr/wasabi/graph/albums> FROM <http://ns.inria.fr/wasabi/graph/artists>
WHERE {
    ?subject <http://purl.org/ontology/mo/genre> ?genre ;
             <http://purl.org/dc/terms/title> ?title ;
             <http://schema.org/releaseDate> ?date ;
             mo:performer ?performer .

    {
        ?performer a ?artistType ;
                   <http://xmlns.com/foaf/0.1/name> ?nameSolo ;
                   schema:members ?members .

        ?members <http://xmlns.com/foaf/0.1/name> ?name .

        FILTER (?artistType = wsb:Artist_Group)
    }
    UNION
    {
        ?performer a ?artistType ;
                   <http://xmlns.com/foaf/0.1/name> ?nameSolo .

        FILTER (?artistType = wsb:Artist_Person || ?artistType = wsb:Choir || ?artistType = wsb:Orchestra) 
    }

}
GROUP BY ?subject ?title ?genre ?date ?performer ?artistType ?nameSolo
ORDER BY ?subject
"""


# Format de réponse JSON
sparql.setReturnFormat(JSON)

# Exécution de la requête SPARQL
sparql.setQuery(query)
results = sparql.query().convert()


# Résultat au format JSON
output_file = 'src\data\quentin_data.json'
# Liste d'artistes au format JSON en output
with open(output_file, "w", encoding="utf-8") as json_file:
    json.dump(results, json_file, ensure_ascii=False, indent=4)

print(f"Les données ont été enregistrées dans {output_file}")
