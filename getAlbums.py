from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import Graph, Literal, URIRef, RDF
from rdflib.namespace import DCTERMS

# Définissez l'URL du point de terminaison SPARQL
sparql_endpoint = "http://wasabi.inria.fr/sparql"

# Créez une instance de SPARQLWrapper
sparql = SPARQLWrapper(sparql_endpoint)

# Utilisez les préfixes dans votre requête SPARQL
query = """
PREFIX wsb: <http://ns.inria.fr/wasabi/ontology/>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT DISTINCT ?album ?albumTitle ?albumType
WHERE {
  {
    ?album a wsb:Album ;
          dcterms:title ?albumTitle .
    BIND("Album" AS ?albumType)
  }
}
ORDER BY ?albumTitle
"""

# Définissez le format de réponse JSON
sparql.setReturnFormat(JSON)

# Exécutez la requête SPARQL
sparql.setQuery(query)
results = sparql.query().convert()

# Créez un graph RDF
g = Graph()

# Parcourez les résultats et ajoutez-les au graph RDF avec le type d'album
for result in results["results"]["bindings"]:
    album_uri = URIRef(result["album"]["value"])
    album_title = Literal(result["albumTitle"]["value"])
    album_type = Literal(result["albumType"]["value"])
    g.add((album_uri, RDF.type, album_type))
    g.add((album_uri, DCTERMS.title, album_title))

# Enregistrez le graph RDF dans un fichier TTL
g.serialize(destination='src/data/album_data_with_types.ttl', format='turtle')

print("Les données avec les types d'albums ont été enregistrées dans album_data_with_types.ttl")
