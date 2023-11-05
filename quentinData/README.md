Exécuter les scipts suivants dans l'ordre pour filtrer les données et les mettre en forme:
- python3 getQuentinDataJSON.py
- python3 verifyQuentinDataJSON.py
- python3 getDataArtistGroupe.py
- python3 getDataArtistSolo.py
- python3 getDataArtists.py

- python3 getPopulationAlbum.py
- python3 getDataArtistsUnique.py


getQuentinDataJSON.py
Permet la récupéreration des données de Quentin et les mets dans un fichier JSON "quentin_data.json".
(Date de naissance parfois NULL pour les membres d'un groupe, nbMembers = 0 si pas un groupe)


verifyQuentinDataJSON.py
Permet de garder les données où la valeur Birthday est renseigné et non vide.
Par exemple : Si la valeur Birthday est nulle ("value": "[]; []"), alors on ne la garde pas dans le fichier output.
Créer un fichier JSON "quentin_data_filtered.json" avec les données filtrées.

getDataArtistGroupe.py
Affiche les donnéess souhaiter pour la visualisation dans un CV pour les artistes se trouvant dans un groupe

getDataArtistSolo.py
Affiche les donnéess souhaiter pour la visualisation dans un CV pour les artistes solo

getDataArtists.py
Affiche les donnéess souhaiter pour la visualisation dans un CV pour tous les artistes en spécifiant s'ils se trouvent dans un groupe ou non



getPopulationAlbum.py
Permet de récupérer les données souhaiter pour la visualisation des barres dans un fichier CSV
On trie alors les albums par année de sortie et on compte le nombre d'albums par année
On obtient alors un fichier CSV "populationAlbum.csv" avec les données souhaiter pour la visualisation des barres

getDataArtistsUnique.py
Permet de récupérer les données souhaiter pour une visualisation supplémentaire sur les albums qui n'a pas pu être implémenté
