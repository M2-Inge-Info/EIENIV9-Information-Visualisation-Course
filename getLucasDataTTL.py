from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import Graph, Literal, URIRef
from rdflib.namespace import Namespace

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

# Créez un graph RDF pour stocker les données
g = Graph()

# Ajouter les namespaces au graph
g.bind("foaf", foaf)
g.bind("schema", schema)
g.bind("wsb", wsb)

# Parcourez les résultats et ajoutez chaque triple au graph RDF
for result in results["results"]["bindings"]:
    subject = URIRef(result["subject"]["value"])
    name = Literal(result["name"]["value"])
    birth = Literal(result["birth"]["value"])
    death = Literal("")
    genres = Literal(result["genres"]["value"])
    # location = Literal(result["location"]["value"])
    city = Literal(result["city"]["value"])
    country = Literal(result["country"]["value"])
    # Ajoutez d'autres variables ici...

    # Créez un artiste en tant qu'URI
    artist = URIRef(result["subject"]["value"])

    # Si la variable ?death existe, ajoutez le triple correspondant
    if "death" in result:
        death = Literal(result["death"]["value"])
        g.add((artist, schema.deathDate, death))

    # Ajoutez les triples au graph
    g.add((artist, foaf.name, name))
    g.add((artist, schema.birthDate, birth))
    g.add((artist, schema.genre, genres))
    g.add((artist, wsb.city, city))
    g.add((artist, wsb.country, country))
    # Ajoutez d'autres triples ici...


# Enregistrez le graph RDF au format TTL
output_file = "src/data/lucas_data.ttl"
g.serialize(destination=output_file, format="turtle")

print(f"Les données ont été enregistrées dans {output_file}")
