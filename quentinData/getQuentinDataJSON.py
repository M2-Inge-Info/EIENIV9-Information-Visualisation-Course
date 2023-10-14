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
PREFIX wsb: <http://ns.inria.fr/wasabi/ontology/> 
PREFIX mo: <http://purl.org/ontology/mo/> 
PREFIX schema: <http://schema.org/> 

SELECT ?subject ?title ?genre ?date ?performer ?artistType (COUNT(?members) as ?nbMembers) (GROUP_CONCAT(?name; separator="; ") as ?names) (GROUP_CONCAT(?birth; separator="; ") as ?births) 
from <http://ns.inria.fr/wasabi/graph/albums> from <http://ns.inria.fr/wasabi/graph/artists>
WHERE {
    ?subject <http://purl.org/ontology/mo/genre> ?genre ;
             <http://purl.org/dc/terms/title> ?title ;
             <http://schema.org/releaseDate> ?date ;
             mo:performer ?performer .

    {
        ?performer a ?artistType ;
                   schema:members ?members .

        ?members <http://xmlns.com/foaf/0.1/name> ?name ;
                 <http://schema.org/birthDate> ?birth .

        FILTER (?artistType = wsb:Artist_Group)
    }
    UNION
    {
        ?performer a ?artistType ;
                   <http://xmlns.com/foaf/0.1/name> ?name ;
                   <http://schema.org/birthDate> ?birth .

        FILTER (?artistType = wsb:Artist_Person || ?artistType = wsb:Choir || ?artistType = wsb:Orchestra) 
    }

}
ORDER BY ?subject
LIMIT 1000 OFFSET 5000
"""


# Définissez le format de réponse JSON
sparql.setReturnFormat(JSON)

# Exécutez la requête SPARQL
sparql.setQuery(query)
results = sparql.query().convert()

# Enregistrez le résultat au format JSON
output_file = 'src\data\quentin_data.json'
# Écrivez la liste d'artistes au format JSON dans le fichier de sortie
with open(output_file, "w", encoding="utf-8") as json_file:
    json.dump(results, json_file, ensure_ascii=False, indent=4)

print(f"Les données ont été enregistrées dans {output_file}")
