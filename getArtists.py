from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import Graph, Literal, URIRef, RDF
from rdflib.namespace import FOAF

# Définissez l'URL du point de terminaison SPARQL
sparql_endpoint = "http://wasabi.inria.fr/sparql"

# Créez une instance de SPARQLWrapper
sparql = SPARQLWrapper(sparql_endpoint)

# Utilisez les préfixes dans votre requête SPARQL
query = """
PREFIX wsb: <http://ns.inria.fr/wasabi/ontology/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX schema: <http://schema.org/>

SELECT DISTINCT ?artist ?artistName ?artistType
WHERE {
  {
    ?artist a wsb:Artist_Person ;
            foaf:name ?artistName .
    BIND("Solo Music Artist" AS ?artistType)
  }
  UNION
  {
    ?artist a wsb:Artist_Group ;
            foaf:name ?artistName .
    BIND("Music Group" AS ?artistType)
  }
  UNION
  {
    ?artist a wsb:Choir ;
            foaf:name ?artistName .
    BIND("Choir" AS ?artistType)
  }
  UNION
  {
    ?artist a wsb:Orchestra ;
            foaf:name ?artistName .
    BIND("Orchestra" AS ?artistType)
  }
}
ORDER BY ?artistName
"""

# Définissez le format de réponse JSON
sparql.setReturnFormat(JSON)

# Exécutez la requête SPARQL
sparql.setQuery(query)
results = sparql.query().convert()

# Créez un graph RDF
g = Graph()

# Parcourez les résultats et ajoutez-les au graph RDF avec le type d'artiste
for result in results["results"]["bindings"]:
    artist_uri = URIRef(result["artist"]["value"])
    artist_name = Literal(result["artistName"]["value"])
    artist_type = Literal(result["artistType"]["value"])
    g.add((artist_uri, RDF.type, artist_type))
    g.add((artist_uri, FOAF.name, artist_name))

# Enregistrez le graph RDF dans un fichier TTL
g.serialize(destination='src/data/artist_data_with_types.ttl', format='turtle')

print("Les données avec les types d'artistes ont été enregistrées dans artist_data_with_types.ttl")
