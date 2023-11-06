from SPARQLWrapper import SPARQLWrapper, JSON
import json

def query_sparql(sparql_endpoint, query):
    sparql = SPARQLWrapper(sparql_endpoint)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(query)

    try:
        results = sparql.query().convert()
        return results
    except Exception as e:
        print(f"Erreur lors de la requête SPARQL : {str(e)}")
        return None

def save_results_to_json(results, output_file):
    if results:
        with open(output_file, "w", encoding="utf-8") as json_file:
            json.dump(results, json_file, ensure_ascii=False, indent=4)
        print(f"Les données ont été enregistrées dans {output_file}")
    else:
        print("Aucun résultat à enregistrer.")

if __name__ == "__main__":
    sparql_endpoint = "http://wasabi.inria.fr/sparql"
    query = """
        PREFIX foaf:    <http://xmlns.com/foaf/0.1/>
        PREFIX schema:  <http://schema.org/>
        PREFIX wsb:     <http://ns.inria.fr/wasabi/ontology/>
        PREFIX dbo:     <http://dbpedia.org/ontology/>

        SELECT ?subject ?name ?related ?birth (GROUP_CONCAT(?genre; separator=", ") as ?genres) ?city ?country ?deezerFans
        FROM <http://ns.inria.fr/wasabi/graph/artists>
        WHERE {
            ?subject schema:genre ?genre ;
                    foaf:name ?name ;
                    wsb:deezer_fans ?deezerFans .

            OPTIONAL { ?subject dbo:associatedMusicalArtist ?related . }
        }
        ORDER BY DESC(?deezerFans)
    """

    output_file = "../src/data/guillaume_data.json"

    results = query_sparql(sparql_endpoint, query)
    save_results_to_json(results, output_file)

