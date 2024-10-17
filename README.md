### Documentation Technique : Exercice Frontend 'Listing de vidéos'

#### Structure du projet
Le projet utilise **React** avec **TypeScript** pour créer une interface utilisateur interactive et performante. Le site est principalement conçu pour gérer une liste de films, permettant aux utilisateurs d'effectuer des actions spécifiques comme le filtrage par catégories et la gestion des "like/dislike".

#### Fonctionnalités principales

1. **Affichage de la liste des films avec aperçu visuel :**
   - J'ai ajouté une propriété `image` dans la classe `Movie` pour rendre la présentation des films plus attrayante. Chaque film affiche une image associée, ce qui améliore l'expérience visuelle de l'utilisateur.
   - En plus de l'image, j'ai étendu la classe `Movie` avec les propriétés **like** et **dislike**, permettant aux utilisateurs d'interagir directement avec les films, en fonction de leurs préférences.

2. **Header Carrousel :**
   - J'ai intégré un **header carrousel** qui permet de faire défiler les films actuellement filtrés par catégorie. Le carrousel montre le film sélectionné en grand format avec des boutons pour naviguer entre les films (gauche et droite). 
   - Ce carrousel n'apparaît que si au moins un film est disponible dans la liste filtrée, et il est mis à jour dynamiquement lorsque des films sont supprimés ou ajoutés.
   - Lorsque tous les films sont supprimés, le carrousel disparaît et affiche un message personnalisé avec mon nom ("Emmanuel NGBAME") pour une petite touche personnelle.

3. **Fonctionnalités de Like/Dislike :**
   - Le système de **like/dislike** fonctionne de manière similaire aux boutons que l'on trouve sur des plateformes comme **YouTube**.
   - Un utilisateur peut soit liker un film, soit disliker un film, mais pas les deux en même temps.
   - Le système est conçu pour être **exclusif** : lorsqu'un utilisateur clique sur "like", cela augmente le compteur de "likes" du film, et s'il avait déjà liké le film, cela retire son like. Le même principe s'applique aux "dislikes".
   - De plus, les actions de **like/dislike** mettent à jour dynamiquement la liste copiée des films sans interférer avec la liste d'origine, garantissant que la synchronisation est maintenue.

4. **Suppression de films :**
   - Les utilisateurs peuvent supprimer un film en appuyant sur le bouton rouge de suppression. Une fois le film supprimé, il disparaît de la liste visible et du carrousel.
   - Si un film est supprimé, il n'apparaît plus dans les résultats de filtrage ou dans la pagination. 
   - Le système est conçu pour maintenir la cohérence : un film supprimé n'est plus pris en compte dans les filtres ou la pagination, garantissant une expérience fluide et sans erreur.

5. **Filtrage par catégorie :**
   - L'utilisateur peut filtrer la liste des films en sélectionnant une ou plusieurs catégories via un **multi-select** dynamique. Les catégories sont générées automatiquement en fonction des films disponibles.
   - Si tous les films d'une catégorie sont supprimés, cette catégorie disparaît également du multi-select, assurant une interface utilisateur propre et à jour.
   - Les films sont mis à jour dynamiquement après chaque action (like/dislike/suppression) pour refléter les nouvelles données filtrées.

6. **Pagination :**
   - Le site prend en charge la **pagination**, permettant à l'utilisateur de choisir combien de films afficher par page (4, 8, ou 12).
   - Les boutons **Précédent/Suivant** sont dynamiquement activés ou désactivés en fonction du nombre total de films disponibles et du nombre sélectionné à afficher par page. Si le nombre de films est inférieur au nombre sélectionné, les boutons sont désactivés.

7. **Gestion des états asynchrones :**
   - Le chargement des films à partir de `movies.js` est effectué de manière **asynchrone**, garantissant une performance optimale même lorsque les données sont chargées depuis une source externe.
   - Le système utilise le **useState** et le **useEffect** de React pour manipuler les données, les mettre à jour en temps réel et garantir que les modifications (likes, dislikes, suppression, filtres) soient appliquées et reflétées correctement dans l'interface utilisateur.

#### Conclusion
Ce projet met en place un système complet de gestion de films, alliant **interactivité**, **design dynamique** et **efficacité** dans le traitement des données. Le carrousel dans le header ajoute une touche visuelle captivante, tandis que les fonctionnalités de like/dislike, de filtrage, et de suppression offrent une expérience utilisateur riche et engageante. 

Merci encore pour le challenge ! J'espère que ce projet montre non seulement mes compétences techniques, mais aussi mon souci du détail et mon envie de créer des interfaces attrayantes. Je serais ravi de rejoindre votre équipe prochainement !
