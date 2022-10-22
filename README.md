
![Logo](https://www.polytech-reseau.org/wp-content/uploads/2021/03/cropped-logo_reseau_Polytech.png)



# SEO Projet DEV
## Sujet
Analyse SERP pour la caractérisation de la difficulté SEO des mots-clés
Ce sujet est lien avec la thématique du SEO ou "Search Engine Optimization". Le SEO recoupe un ensemble de problématiques comme l'indexation des portails / sites web pour l'accessibilité par les moteurs de recherche, l'optimisation du codage pour les performances en accès, la gestion du référencement par "backlink" et métriques de caractérisation, l'analyse de trafic / accès aux sites web (e.g. Google Analytics), etc. Parmi ces problématiques, la caractérisation de mots-clés est essentielle avant toute production / publication de contenu sur le Web. Celle-ci vise à établir la pertinence de l'usage de mots-clés pour un site Web donné selon deux critères principaux (i.) le trafic associé aux mots-clés (relatif et/ou absolu obtenu via des outils comme Google Trends et/ou Ahrefs) et (ii.) la difficulté SEO des mots-clés.

Ce projet est  particulièrement en lien avec la difficulté SEO des mots-clés. Celle-ci a pour objectif de caractériser la difficulté des mots-clés ou, en d'autres termes, définir à quel point il serait difficile de classer un site web (e.g. en haut de la page de résultats d'un moteur de recherche comme Google) à partir des mots-clés visés. Il existe de nombreuses plateformes / outils proposant des scores de difficulté SEO pour les mots-clés comme Ahrefs,  SEMrush, SEOquake et Serpstat. Ces scores sont des métriques internes aux plateformes / outils appliquant des recettes de calcul en mode "boite noire". Ils sont le plus souvent peu ou pas exploitables pour une analyse fine de la difficulté SEO. Par exemple, ils reflètent mal la difficulté SEO des mots-clés dits "de niche", ils ne peuvent gérer une analyse par recoupement (tous les mots-clés attraits à un sujet donné), il ne peuvent différentier les cas de polysémie (e.g. Rose le prénom, Rose la couleur, Rose la fleur), etc.

De façon à pallier à ce problème, une possibilité de recourir directement à une analyse SERP (Search Engine Result Page) à partir des requêtes composées par les mots-clés. Cette analyse peut se faire par expertise utilisateur ou automatiquement. On se propose dans ce projet de mettre en place un outil d'analyse SERP pour la caractérisation de la difficulté SEO des mots-clés. Plusieurs points pourront être abordés:

## CDC
- 	Extraction d'une liste de mots-clés avec trafic associé par lecture CVS
-	Lancement de requêtes par simulation de l'interaction utilisateur (e.g. via PyAutoGUI)
-	Extraction des SERP (e.g. via SEOQuake)
-	Analyse SERP par recoupement des noms de domaine et/ou classement (SemRush Rank Domain Authority)

## Installation


```bash
  npm install puppeteer
```

```bash
  npm install
```
    
## Documentation

Avant toute chose, il a fallu extraire la liste des mots du csv pour les mettre dans un json qui sera plus facilement interprété par le programme que vous trouverez ici. Pour ce faire le code ci-dessous nous a permis d'extraire les mots-clés du CSV et de les enregistrer dans le bon format.
```js
const fs = require('fs');
const output = require('./data/output.json');

(()=> {
    fs.readFile('./data/data.csv', 'utf8', (err, data) => {
        data.split('\n').forEach(ligne => {
            output.push(ligne.split(';')[0]);

            fs.writeFile('./data/output.json',
                JSON.stringify(output, null, 1), 'utf8',
                (err) => {
                    if (err) { console.log(err); }
                }
            );
        })
    })
})();
```


Le code va effectuer une recherche web sur google pour chaque mot-clé et retourner les résultats de la recherche dans le json en les rangeant par noms de domaines :
```json
"https://www.netflix.com": {
  "motsClesDetectes": [
   "H",
   "Friends",
   "Toc Toc ",
   "Riverdale"
  ],
  "liensExacts": [
   "https://www.netflix.com/fr/title/81270678",
   "https://www.netflix.com/ca-fr/title/80241387",
   "https://www.netflix.com/fr/title/70153404",
   "https://www.netflix.com/fr/title/80233962",
   "https://www.netflix.com/fr/title/80133311",
   "https://www.netflix.com/ca-fr/title/80133311",
   "https://www.netflix.com/fr/title/81270678",
   "https://www.netflix.com/ca-fr/title/80241387"
  ]
```
On sait ainsi quels noms de domaines sont associés à quels mots-clés.
Le lien exact du résultat de la recherche est également ajouté.

## Badges
![js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

![js](https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
