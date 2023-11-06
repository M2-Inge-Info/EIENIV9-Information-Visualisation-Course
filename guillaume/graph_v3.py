import json
import networkx as nx
import matplotlib.pyplot as plt
import random

# Constantes
NB_TOP_ARTIST = 1000

def load_data(file_path):
    # Charger les données JSON
    with open(file_path, "r", encoding="utf-8") as json_file:
        data = json.load(json_file)
    return data

def create_graph(data):
    # Créer un graphe vide
    artist_graph = nx.Graph()

    genre_dict = {}
    results = data["results"]["bindings"]

    # Première étape : Enregistrez tous les nœuds existants et leurs genres
    for result in results:
        name = result["name"]["value"].replace(" ", "_")
        nb_fans = int(result["deezerFans"]["value"])
        genres = result.get("genres", {"value": ""})["value"].split(", ")
        related = result.get("related", {}).get("value", "")
        artist_graph.add_node(name, genres=genres, nb_fans=nb_fans)
        genre_dict[name] = genres

    # Deuxième étape : Ajoutez des arêtes entre les nœuds existants
    for result in results:
        name = result["name"]["value"].replace(" ", "_")
        related = result.get("related", {}).get("value", "")
        if related:
            edges = [(name, artist.replace(" ", "_")) for artist in related.split(", ") if artist_graph.has_node(artist.replace(" ", "_"))]
            artist_graph.add_edges_from(edges)

    return artist_graph, genre_dict

def calculate_pagerank(artist_graph):
    # Calculer le PageRank
    pagerank_dict = nx.pagerank(artist_graph)
    return pagerank_dict

def get_artist_color(artist_node, genre_colors, genre_counts):
    genres = artist_graph.nodes[artist_node].get('genres', [])
    if genres:
        popular_genre = max(genres, key=lambda genre: genre_counts.get(genre, 0))
        artist_graph.nodes[artist_node]['popular_genre'] = popular_genre
        return genre_colors[popular_genre]
    else:
        artist_graph.nodes[artist_node]['popular_genre'] = None
        return (0, 0, 0)

# Fonction pour afficher le nombre d'artistes par genre musical
def display_genre_counts(artist_graph):
    genre_counts = {}
    for node in artist_graph.nodes(data=True):
        genres = node[1].get('genres', [])
        for genre in genres:
            genre_counts[genre] = genre_counts.get(genre, 0) + 1

    # for genre, count in genre_counts.items():
    #     print(f"{genre}: {count}")

    with open("genre_counts.json", "w") as json_file:
        json.dump(genre_counts, json_file)
    return genre_counts



# Fonction pour créer un sous-graphe avec les meilleurs artistes en termes de PageRank
def subgraph_best_pagerank(artist_graph, pagerank_dict):
    top_artists = sorted(pagerank_dict, key=pagerank_dict.get, reverse=True)[:NB_TOP_ARTIST]
    nodes_to_include = top_artists[:]

    for node in top_artists:
        neighbors = list(artist_graph.neighbors(node))
        nodes_to_include.extend(neighbors)

    nodes_to_include = list(set(nodes_to_include))
    subgraph = artist_graph.subgraph(nodes_to_include)

    return subgraph

# Fonction pour créer un sous-graphe avec les artistes ayant le plus de fans
def subgraph_most_fans(artist_graph):
    artist_nodes = list(artist_graph.nodes(data=True))
    # print(artist_nodes[:100])
    artist_nodes.sort(key=lambda x: x[1].get('nb_fans', 0), reverse=True)
    # print(artist_nodes[:100])

    top_artists = [node[0] for node in artist_nodes[:NB_TOP_ARTIST]]
    #print(top_artists)
    nodes_to_include = top_artists[:]

    for node in top_artists:
        neighbors = list(artist_graph.neighbors(node))
        nodes_to_include.extend(neighbors)

    nodes_to_include = list(set(nodes_to_include))
    subgraph = artist_graph.subgraph(nodes_to_include)

    return subgraph

# Fonction pour créer un sous-graphe qui est l'union des deux sous-graphes
def create_combined_subgraph(artist_graph, pagerank_dict):
    subgraph_pagerank = subgraph_best_pagerank(artist_graph, pagerank_dict)
    subgraph_fans = subgraph_most_fans(artist_graph)
    combined_subgraph = nx.compose(subgraph_pagerank, subgraph_fans)

    return combined_subgraph

def get_largest_connected_component(subgraph):
    connected_components = list(nx.connected_components(subgraph))

    if len(connected_components) == 0:
        # Aucune composante connectée trouvée
        return None

    # Trouver la plus grande composante connectée
    largest_component = max(connected_components, key=len)

    # Créer un sous-graphe basé sur la plus grande composante
    largest_subgraph = subgraph.subgraph(largest_component)

    return largest_subgraph



# Fonction pour détecter les communautés avec l'algorithme Girvan-Newman
def detect_communities(subgraph):
    communities_generator = nx.community.girvan_newman(subgraph)
    top_level_communities = next(communities_generator)
    community_map = {}

    for i, community_set in enumerate(top_level_communities):
        for node in community_set:
            community_map[node] = i

    return community_map

# Fonction pour générer les données des nœuds
def generate_node_data(subgraph, pagerank_dict, genre_counts, community_map):
    nodes_data = []
    
    for node, attributes in subgraph.nodes(data=True):
        genres = attributes.get('genres', [])
        popular_genre = max(genres, key=lambda genre: genre_counts.get(genre, 0))
        pagerank = pagerank_dict[node]
        nb_fans = attributes.get('nb_fans', None)
        #community_group = community_map.get(node, None)
        
        # Obtenir les voisins (artistes liés) du nœud
        neighbors = list(subgraph.neighbors(node))
        
        node_data = {
            "node": node,
            "genres": genres,
            "popular_genre": popular_genre,
            "pagerank": pagerank,
            "nb_fans": nb_fans,
            "related_artist": neighbors
            #"community_group": community_group
        }
        
        nodes_data.append(node_data)
    
    return nodes_data


def generate_link_data(subgraph):
    # Créer un dictionnaire pour stocker les liens (edges)
    links = []

    # Obtenir les liens du sous-graphe
    for edge in subgraph.edges():
        source = edge[0]
        target = edge[1]
        links.append({"source": source, "target": target})

    return links

def save_d3_data_to_json(nodes, links, filename):
    # Créer un dictionnaire contenant les nodes et links
    d3_data = {"nodes": nodes, "links": links}

    # Enregistrer les données D3 dans un fichier JSON
    with open(filename, "w") as json_file:
        json.dump(d3_data, json_file, indent=4)

# Fonction pour tracer le sous-graphe avec les couleurs
def plot_subgraph(subgraph, node_data):
    genre_colors = {genre: (random.random(), random.random(), random.random()) for genre in genre_counts.keys()}
    plt.figure(figsize=(12, 12))
    pos = nx.spring_layout(subgraph)
    # node_colors = [get_artist_color(node_data[node]['node'], genre_colors, genre_counts) for node in subgraph.nodes()]
    node_colors = [get_artist_color(node, genre_colors, genre_counts) for node in subgraph.nodes()]


    nx.draw(subgraph, pos, node_size=300, node_color=node_colors, cmap=plt.cm.get_cmap('viridis'), with_labels=False)
    plt.title(f"Graphe des {NB_TOP_ARTIST} artistes avec le plus grand PageRank et leurs voisins")
    plt.show()

def plot_subgraph_with_community_colors(subgraph, community_map):
    # Créer une liste de couleurs distinctes pour chaque communauté
    community_colors = {i: (random.random(), random.random(), random.random()) for i in set(community_map.values())}

    # Créer une liste de couleurs pour chaque nœud en fonction de sa communauté
    node_colors = [community_colors[community_map[node]] for node in subgraph.nodes()]

    plt.figure(figsize=(12, 12))
    pos = nx.spring_layout(subgraph)

    # Tracer le sous-graphe en utilisant les couleurs des communautés
    nx.draw(subgraph, pos, node_size=300, node_color=node_colors, cmap=plt.cm.get_cmap('viridis'), with_labels=False)

    plt.title(f"Graphe des {NB_TOP_ARTIST} artistes avec le plus grand PageRank et leurs voisins (couleurs de la communauté)")
    plt.show()


# Charger les données
data = load_data("../src/data/guillaume_data.json")

# Créer le graphe
artist_graph, genre_dict = create_graph(data)

# Calculer le PageRank
pagerank_dict = calculate_pagerank(artist_graph)

# Afficher le nombre d'artistes par genre musical
genre_counts = display_genre_counts(artist_graph)

# Créer le sous-graphe avec les meilleurs artistes en termes de PageRank
#subgraph_pagerank = subgraph_best_pagerank(artist_graph, pagerank_dict)

# Créer le sous-graphe avec les artistes ayant le plus de fans
subgraph_fans = subgraph_most_fans(artist_graph)

# Créer le sous-graphe qui est l'union des deux sous-graphes
#combined_subgraph = create_combined_subgraph(artist_graph, pagerank_dict)

# Obtenez la composante principale du sous-graphe combiné
#largest_component_subgraph = get_largest_connected_component(combined_subgraph)
largest_component_subgraph = get_largest_connected_component(subgraph_fans)


# Détecter les communautés avec l'algorithme Girvan-Newman
community_map = [] #detect_communities(largest_component_subgraph)

# Générer les données des nœuds
nodes_data = generate_node_data(largest_component_subgraph, pagerank_dict, genre_counts, community_map)

# Générer les données des liens
links_data = generate_link_data(largest_component_subgraph)

# Enregistrement des données D3 dans un fichier JSON
save_d3_data_to_json(nodes_data, links_data, "data_d3.json")

#display_genre_counts(largest_component_subgraph)

# Tracer le sous-graphe en utilisant les couleurs associées
#plot_subgraph(combined_subgraph, nodes_data)

# Tracer le sous-graphe en utilisant les couleurs des communautés
#plot_subgraph_with_community_colors(largest_component_subgraph, community_map)
