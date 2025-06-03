// Importation des modules nécessaires
import recipes from "./../data/recipes.js"; // les données JSON contenant 50 recettes
import { initializeDropdowns, mainSearch, applyFilters } from "./search/searchFunctions.js";
import { displayRecipes } from "./search/displayFunctions.js";
import { updateSearch } from "./search/tagFunctions.js";
import { clearActiveFilters } from "./search/filterFunctions.js";

// Code exécuté une fois que le DOM est entièrement chargé
document.addEventListener("DOMContentLoaded", () => {
    // Sélection des éléments du DOM utiles pour l’interaction
    const recipesContainer = document.getElementById("recipes");
    const inputSearch = document.getElementById("search");
    const searchForm = document.getElementById("search-form");

    // Chargement initial des dropdowns (ingrédients, ustensiles, appareils)
    initializeDropdowns();

    // Fonction utilitaire pour récupérer les tags actifs présents dans l’interface
    const getActiveTags = () => {
        const tagsContainer = document.getElementById("tags");
        return Array.from(tagsContainer.children).map(
            (element) => element.querySelector("p").textContent.toLowerCase()
        );
    };

    // Fonction de protection : empêche l’injection HTML via les champs utilisateur
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

    // Fonction principale qui gère toute la logique de recherche + filtres
    const performSearch = (query, tags = []) => {
        const checkedInput = escapeHtml(query); // on nettoie la requête
        console.log("PerformSearch - Input vérifié:", checkedInput);

        // Si la requête est suffisante ou des tags sont présents, on lance la recherche
        if (checkedInput.length >= 3 || tags.length > 0) {
            console.log("PerformSearch - Query ou tags valides. Query:", checkedInput, "Tags:", tags);
            mainSearch(checkedInput, recipesContainer);                      // recherche principale
            applyFilters(tags, recipesContainer, checkedInput);              // filtre par tags
            updateSearch(checkedInput);                                      // mise à jour visuelle
        } else {
            // Si la requête est trop courte et aucun tag → on affiche tout
            console.log("PerformSearch - Query trop petite, affichage de toutes les recettes");
            displayRecipes(recipes, recipesContainer, checkedInput, []);
            clearActiveFilters(); // on réinitialise tous les filtres
        }
    };

    // Fonction qui récupère la valeur du champ input et appelle performSearch()
    const handleSearch = () => {
        const query = inputSearch.value.trim();
        console.log("HandleSearch - Query:", query);
        performSearch(query, getActiveTags()); // lancement de la recherche avec les tags actifs
    };

    // Lorsqu’on soumet le formulaire de recherche
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault(); // empêche le rechargement de la page
        handleSearch();         // exécute la recherche
    });

    // À chaque saisie dans le champ de recherche
    inputSearch.addEventListener("input", () => {
        handleSearch(); // recherche dynamique en temps réel
    });

    // Lorsqu’un tag est sélectionné dans un menu déroulant
    document.querySelectorAll(".select-options").forEach(selectOptions => {
        selectOptions.addEventListener("click", (event) => {
            const selectedTag = event.target.textContent.trim(); // on récupère le texte cliqué
            performSearch(inputSearch.value.trim(), [selectedTag, ...getActiveTags()]);
        });
    });

    // Affichage initial de toutes les recettes au chargement de la page
    displayRecipes(recipes, recipesContainer);
});
