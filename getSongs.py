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

SELECT DISTINCT ?song ?songTitle ?songType
WHERE {
  {
    ?song a wsb:Song ;
         dcterms:title ?songTitle .
    BIND("Song" AS ?songType)
  }
}
ORDER BY ?songTitle
"""

# Définissez le format de réponse JSON
sparql.setReturnFormat(JSON)

# Exécutez la requête SPARQL
sparql.setQuery(query)
results = sparql.query().convert()

# Créez un graph RDF
g = Graph()

# Parcourez les résultats et ajoutez-les au graph RDF avec le type de chanson
for result in results["results"]["bindings"]:
    song_uri = URIRef(result["song"]["value"])
    song_title = Literal(result["songTitle"]["value"])
    song_type = Literal(result["songType"]["value"])
    g.add((song_uri, RDF.type, song_type))
    g.add((song_uri, DCTERMS.title, song_title))

# Enregistrez le graph RDF dans un fichier TTL
g.serialize(destination='src/data/song_data_with_types.ttl', format='turtle')

print("Les données avec les types de chansons ont été enregistrées dans song_data_with_types.ttl")
