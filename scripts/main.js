// Importation des modules nécessaires
import recipes from "./../data/recipes.js"; // données JSON avec 50 recettes
import { initializeDropdowns, mainSearch, applyFilters } from "./search/searchFunctions.js"; // moteur de recherche et filtres
import { displayRecipes } from "./search/displayFunctions.js"; // affichage des recettes
import { updateSearch } from "./search/tagFunctions.js"; // gestion des tags sélectionnés
import { clearActiveFilters } from "./search/filterFunctions.js"; // réinitialisation des filtres

// Exécution une fois que tout le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
    // Récupération des éléments HTML clés
    const recipesContainer = document.getElementById("recipes"); // zone d'affichage des recettes
    const inputSearch = document.getElementById("search");       // champ de recherche
    const searchForm = document.getElementById("search-form");   // formulaire englobant

    // Initialisation des menus déroulants (dropdowns)
    initializeDropdowns();

    // Fonction utilitaire pour récupérer tous les tags sélectionnés
    const getActiveTags = () => {
        const tagsContainer = document.getElementById("tags");
        return Array.from(tagsContainer.children).map(
            (element) => element.querySelector("p").textContent.toLowerCase()
        );
    };

    // Fonction pour sécuriser la requête utilisateur contre les injections HTML
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) { return map[m]; });
    }

    // Fonction qui déclenche la recherche (requête principale + tags)
    const performSearch = (query, tags = []) => {
        const checkedInput = escapeHtml(query); // nettoyage de la saisie
        console.log("PerformSearch - Input vérifié:", checkedInput);

        // Si la recherche est suffisante ou des tags sont sélectionnés
        if (checkedInput.length >= 3 || tags.length > 0) {
            console.log("PerformSearch - Query ou tags valides. Query:", checkedInput, "Tags:", tags);

            // 1. Recherche principale
            mainSearch(checkedInput, recipesContainer);

            // 2. Application des filtres par tags
            applyFilters(tags, recipesContainer, checkedInput);

            // 3. Mise à jour de l'affichage des tags dans le DOM
            updateSearch(checkedInput);
        } else {
            // Cas : rien de saisi et aucun tag → affichage de toutes les recettes
            console.log("PerformSearch - Query trop petite, affichage de toutes les recettes");
            displayRecipes(recipes, recipesContainer, checkedInput, []);
            clearActiveFilters(); // reset des filtres actifs
        }
    };

    // Fonction déclenchée à chaque modification dans le champ recherche
    const handleSearch = () => {
        const query = inputSearch.value;
        console.log("HandleSearch - Query:", query);
        performSearch(query, getActiveTags());
    };

    // Si l’utilisateur soumet le formulaire
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault(); // empêche le rechargement de la page
        handleSearch();
    });

    // À chaque frappe dans le champ de recherche (recherche instantanée)
    inputSearch.addEventListener("input", () => {
        handleSearch();
    });

    // Lorsqu’un utilisateur clique sur un élément d’un dropdown
    document.querySelectorAll(".select-options").forEach(selectOptions => {
        selectOptions.addEventListener("click", (event) => {
            const selectedTag = event.target.textContent.trim();
            // On relance la recherche avec le tag cliqué + ceux déjà actifs
            performSearch(inputSearch.value.trim(), [selectedTag, ...getActiveTags()]);
        });
    });

    // Lors du chargement initial, toutes les recettes sont affichées
    displayRecipes(recipes, recipesContainer);
});
