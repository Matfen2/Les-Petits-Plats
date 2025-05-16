import recipes from "./../data/recipes.js";
import { initializeDropdowns, mainSearch, applyFilters } from "./search/searchFunctions.js";
import { displayRecipes } from "./search/displayFunctions.js";
import { updateSearch } from "./search/tagFunctions.js";
import { clearActiveFilters } from "./search/filterFunctions.js";

document.addEventListener("DOMContentLoaded", () => {
    const recipesContainer = document.getElementById("recipes");
    const inputSearch = document.getElementById("search");
    const searchForm = document.getElementById("search-form");

    // Chargement initial des dropdowns avec les données des recettes
    initializeDropdowns();

    const getActiveTags = () => {
        const tagsContainer = document.getElementById("tags");
        return Array.from(tagsContainer.children).map(
            (element) => element.querySelector("p").textContent.toLowerCase()
        );
    };

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

    const performSearch = (query, tags = []) => {
        const checkedInput = escapeHtml(query);
        console.log("PerformSearch - Input verifié:", checkedInput);
        if (checkedInput.length >= 3 || tags.length > 0) {
            console.log("PerformSearch - Query ou tags valides. Query:", checkedInput, "Tags:", tags);
            mainSearch(checkedInput, recipesContainer);
            //on passe la query pr appliquer les filtres
            applyFilters(tags, recipesContainer, checkedInput);
            updateSearch(checkedInput);
        } else {
            console.log("PerformSearch - Query trop petite, display de toutes les recettes");
            displayRecipes(recipes, recipesContainer, checkedInput, []);
            clearActiveFilters();
        }
    };

    const handleSearch = () => {
        const query = inputSearch.value.trim();
        console.log("HandleSearch - Query:", query);
        performSearch(query, getActiveTags());
    };

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        handleSearch();
    });

    inputSearch.addEventListener("input", () => {
        handleSearch();
    });

    document.querySelectorAll(".select-options").forEach(selectOptions => {
        selectOptions.addEventListener("click", (event) => {
            const selectedTag = event.target.textContent.trim();
            performSearch(inputSearch.value.trim(), [selectedTag, ...getActiveTags()]);
        });
    });

    displayRecipes(recipes, recipesContainer);
});