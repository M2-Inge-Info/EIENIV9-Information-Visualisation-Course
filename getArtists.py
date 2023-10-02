from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import Graph, Literal, URIRef
from rdflib.namespace import RDF, RDFS, FOAF
import csv

# Définissez l'URL du point de terminaison SPARQL
sparql_endpoint = "http://wasabi.inria.fr/sparql"

# Créez une instance de SPARQLWrapper
sparql = SPARQLWrapper(sparql_endpoint)

# Utilisez les préfixes dans votre requête SPARQL
query = """
PREFIX wsb: <http://ns.inria.fr/wasabi/ontology/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX schema: <http://schema.org/>

SELECT DISTINCT ?artist ?artistName ?artistType ?idArtistMusicBrainz ?idArtistDeezer ?idArtistDiscogs ?name ?genres ?labels ?recordLabel ?gender ?disambiguation ?endAreaId ?endAreaName ?endAreaDisambiguation ?ended ?begin ?end ?city ?country ?locationInfo ?deezerFans ?picture ?associatedMusicalArtist ?dbpAbstract ?dbpGenre ?subject ?rdf ?abstract ?nameVariations ?urls ?nameVariationsFold ?animuxPath ?animuxPathAmbiguous ?nameAccentFold
WHERE {
  ?artist a ?artistType .
  ?artist foaf:name ?artistName .
  OPTIONAL { ?artist wsb:id_artist_musicbrainz ?idArtistMusicBrainz }
  OPTIONAL { ?artist wsb:id_artist_deezer ?idArtistDeezer }
  OPTIONAL { ?artist wsb:id_artist_discogs ?idArtistDiscogs }
  OPTIONAL { ?artist wsb:name ?name }
  OPTIONAL { ?artist wsb:genres ?genres }
  OPTIONAL { ?artist wsb:labels ?labels }
  OPTIONAL { ?artist wsb:recordLabel ?recordLabel }
  OPTIONAL { ?artist wsb:gender ?gender }
  OPTIONAL { ?artist wsb:disambiguation ?disambiguation }
  OPTIONAL { ?artist wsb:endArea ?endAreaId .
             ?endAreaId wsb:name ?endAreaName .
             ?endAreaId wsb:disambiguation ?endAreaDisambiguation }
  OPTIONAL { ?artist wsb:lifeSpan ?lifeSpan .
             ?lifeSpan wsb:ended ?ended .
             ?lifeSpan wsb:begin ?begin .
             ?lifeSpan wsb:end ?end }
  OPTIONAL { ?artist wsb:location ?location .
             ?location wsb:id_city_musicbrainz ?cityId .
             ?cityId wsb:city ?city .
             ?cityId wsb:country ?country }
  OPTIONAL { ?artist wsb:locationInfo ?locationInfo }
  OPTIONAL { ?artist wsb:deezerFans ?deezerFans }
  OPTIONAL { ?artist wsb:picture ?picture }
  OPTIONAL { ?artist wsb:associatedMusicalArtist ?associatedMusicalArtist }
  OPTIONAL { ?artist wsb:dbpAbstract ?dbpAbstract }
  OPTIONAL { ?artist wsb:dbpGenre ?dbpGenre }
  OPTIONAL { ?artist wsb:subject ?subject }
  OPTIONAL { ?artist wsb:rdf ?rdf }
  OPTIONAL { ?artist wsb:abstract ?abstract }
  OPTIONAL { ?artist wsb:nameVariations ?nameVariations }
  OPTIONAL { ?artist wsb:urls ?urls }
  OPTIONAL { ?artist wsb:nameVariationsFold ?nameVariationsFold }
  OPTIONAL { ?artist wsb:animuxPath ?animuxPath }
  OPTIONAL { ?artist wsb:animuxPathAmbiguous ?animuxPathAmbiguous }
  OPTIONAL { ?artist wsb:nameAccentFold ?nameAccentFold }
}
ORDER BY ?artistName
"""

# Définissez le format de réponse JSON
sparql.setReturnFormat(JSON)

# Exécutez la requête SPARQL
sparql.setQuery(query)
results = sparql.query().convert()

# Créez un graph RDF pour stocker les données
g = Graph()

# Parcourez les résultats et ajoutez chaque triple au graph RDF
for result in results["results"]["bindings"]:
    artist = URIRef(result["artist"]["value"])
    artistName = Literal(result["artistName"]["value"])
    artistType = URIRef(result["artistType"]["value"])
    # Ajoutez d'autres variables ici...

    # Ajoutez les triples au graph
    g.add((artist, RDF.type, artistType))
    g.add((artist, FOAF.name, artistName))
    # Ajoutez d'autres triples ici...

# Enregistrez le graph RDF au format TTL
output_file = "src/data/artist_data_with_types.ttl"
g.serialize(destination=output_file, format="turtle")

print(f"Les données ont été enregistrées dans {output_file}")
