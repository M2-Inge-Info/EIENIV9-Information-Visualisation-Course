"""
Nom du fichier : getArtistsInformations.py
Auteur : Jonathan
Licence : Walter White
Description :   Ce script charge des données d'artistes depuis un fichier JSON, filtre ces données, puis utilise une requête SPARQL pour récupérer des informations supplémentaires sur chaque artiste.
                Les données enrichies sont ensuite sauvegardées dans un nouveau fichier JSON.
"""

import json
from SPARQLWrapper import SPARQLWrapper, JSON

# Chargez les données du fichier JSON
with open('scraped_data.json', 'r') as f:
    data = json.load(f)

# Filtrez les données pour ne conserver que les éléments où product_name et product_type ne sont pas null
filtered_data = [item for item in data if item['product_name'] is not None and item['product_type'] is not None]

# Configurez SPARQLWrapper
sparql = SPARQLWrapper("http://wasabi.inria.fr/sparql")
sparql.setReturnFormat(JSON)

# Parcourez les données et exécutez la requête pour chaque artiste
for item in filtered_data:
    artist_node = item['artist_node']

    # Définissez la requête SPARQL
    query = f"""
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX schema: <http://schema.org/>
    PREFIX wsb: <http://ns.inria.fr/wasabi/ontology/>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX mo: <http://purl.org/ontology/mo/>

    SELECT ?artist ?equipmentPage ?abstract ?associatedMusicalArtist ?genre ?bbcPage ?allMusicPage ?amazonPage ?city ?country
           ?deezerArtistId ?deezerFans ?deezerPage ?discogsId ?facebookPage ?googlePlusPage ?iTunesPage ?instagramPage
           ?lastFmPage ?location ?musicbrainzId ?nameWithoutAccent ?pureVolumePage ?rateYourMusicPage ?realName ?recordLabel
           ?secondHandSongsPage ?soundCloudPage ?spotifyPage ?twitterPage ?wikiaPage ?wikidataPage ?youTubePage ?dctermsAbstract
           ?subject ?discogs ?homepage ?musicbrainz ?musicbrainzGuid ?myspace ?uuid ?wikipedia ?alternateName ?birthDate
           ?deathDate ?disambiguatingDescription ?dissolutionDate ?endDate ?foundingDate ?schemaGenre ?members ?startDate ?rdfType
           ?label ?sameAs ?gender ?name
    WHERE {{
        ?artist wsb:equipBoard_page ?equipmentPage .
        FILTER (str(?artist) = "{artist_node}")  # Ajout du filtre
        OPTIONAL {{ ?artist dbo:abstract ?abstract }} .
        OPTIONAL {{ ?artist dbo:associatedMusicalArtist ?associatedMusicalArtist }} .
        OPTIONAL {{ ?artist dbo:genre ?genre }} .
        OPTIONAL {{ ?artist wsb:BBC_page ?bbcPage }} .
        OPTIONAL {{ ?artist wsb:allMusic_page ?allMusicPage }} .
        OPTIONAL {{ ?artist wsb:amazon_page ?amazonPage }} .
        OPTIONAL {{ ?artist wsb:city ?city }} .
        OPTIONAL {{ ?artist wsb:country ?country }} .
        OPTIONAL {{ ?artist wsb:deezer_artist_id ?deezerArtistId }} .
        OPTIONAL {{ ?artist wsb:deezer_fans ?deezerFans }} .
        OPTIONAL {{ ?artist wsb:deezer_page ?deezerPage }} .
        OPTIONAL {{ ?artist wsb:discogs_id ?discogsId }} .
        OPTIONAL {{ ?artist wsb:facebook_page ?facebookPage }} .
        OPTIONAL {{ ?artist wsb:googlePlus_page ?googlePlusPage }} .
        OPTIONAL {{ ?artist wsb:iTunes_page ?iTunesPage }} .
        OPTIONAL {{ ?artist wsb:instagram_page ?instagramPage }} .
        OPTIONAL {{ ?artist wsb:lastFm_page ?lastFmPage }} .
        OPTIONAL {{ ?artist wsb:location ?location }} .
        OPTIONAL {{ ?artist wsb:musicbrainz_id ?musicbrainzId }} .
        OPTIONAL {{ ?artist wsb:name_without_accent ?nameWithoutAccent }} .
        OPTIONAL {{ ?artist wsb:pureVolume_page ?pureVolumePage }} .
        OPTIONAL {{ ?artist wsb:rateYourMusic_page ?rateYourMusicPage }} .
        OPTIONAL {{ ?artist wsb:real_name ?realName }} .
        OPTIONAL {{ ?artist wsb:record_label ?recordLabel }} .
        OPTIONAL {{ ?artist wsb:secondHandSongs_page ?secondHandSongsPage }} .
        OPTIONAL {{ ?artist wsb:soundCloud_page ?soundCloudPage }} .
        OPTIONAL {{ ?artist wsb:spotify_page ?spotifyPage }} .
        OPTIONAL {{ ?artist wsb:twitter_page ?twitterPage }} .
        OPTIONAL {{ ?artist wsb:wikia_page ?wikiaPage }} .
        OPTIONAL {{ ?artist wsb:wikidata_page ?wikidataPage }} .
        OPTIONAL {{ ?artist wsb:youTube_page ?youTubePage }} .
        OPTIONAL {{ ?artist dcterms:abstract ?dctermsAbstract }} .
        OPTIONAL {{ ?artist dcterms:subject ?subject }} .
        OPTIONAL {{ ?artist mo:discogs ?discogs }} .
        OPTIONAL {{ ?artist mo:homepage ?homepage }} .
        OPTIONAL {{ ?artist mo:musicbrainz ?musicbrainz }} .
        OPTIONAL {{ ?artist mo:musicbrainz_guid ?musicbrainzGuid }} .
        OPTIONAL {{ ?artist mo:myspace ?myspace }} .
        OPTIONAL {{ ?artist mo:uuid ?uuid }} .
        OPTIONAL {{ ?artist mo:wikipedia ?wikipedia }} .
        OPTIONAL {{ ?artist schema:alternateName ?alternateName }} .
        OPTIONAL {{ ?artist schema:birthDate ?birthDate }} .
        OPTIONAL {{ ?artist schema:deathDate ?deathDate }} .
        OPTIONAL {{ ?artist schema:disambiguatingDescription ?disambiguatingDescription }} .
        OPTIONAL {{ ?artist schema:dissolutionDate ?dissolutionDate }} .
        OPTIONAL {{ ?artist schema:endDate ?endDate }} .
        OPTIONAL {{ ?artist schema:foundingDate ?foundingDate }} .
        OPTIONAL {{ ?artist schema:genre ?schemaGenre }} .
        OPTIONAL {{ ?artist schema:members ?members }} .
        OPTIONAL {{ ?artist schema:startDate ?startDate }} .
        OPTIONAL {{ ?artist <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?rdfType }} .
        OPTIONAL {{ ?artist <http://www.w3.org/2000/01/rdf-schema#label> ?label }} .
        OPTIONAL {{ ?artist <http://www.w3.org/2002/07/owl#sameAs> ?sameAs }} .
        OPTIONAL {{ ?artist foaf:gender ?gender }} .
        OPTIONAL {{ ?artist foaf:name ?name }} .
    }}
    """
    # Exécutez la requête
    sparql.setQuery(query)
    results = sparql.query().convert()

    # Ajoutez les informations supplémentaires à l'élément
    item['informations'] = results['results']['bindings']

# Écrivez les résultats dans un nouveau fichier JSON
with open('artists_informations.json', 'w') as f:
    json.dump(filtered_data, f, indent=4)

print("Les données améliorées ont été sauvegardées dans 'artists_informations.json'.")
