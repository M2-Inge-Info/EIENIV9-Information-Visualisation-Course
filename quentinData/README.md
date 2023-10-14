Exécuter les scipts suivants dans l'ordre pour filtrer les données et les mettre en forme:
- python3 getQuentinDataJSON.py
- python3 verifyQuentinDataJSON.py




getQuentinDataJSON.py
Permet la récupéreration des données de Quentin et les mets dans un fichier JSON "quentin_data.json".
(Date de naissance parfois NULL pour les membres d'un groupe, nbMembers = 0 si pas un groupe)


verifyQuentinDataJSON.py
Permet de garder les données où la valeur Birthday est renseigné et non vide.
Par exemple : Si la valeur Birthday est nulle ("value": "[]; []"), alors on ne la garde pas dans le fichier output.
Créer un fichier JSON "quentin_data_filtered.json" avec les données filtrées.