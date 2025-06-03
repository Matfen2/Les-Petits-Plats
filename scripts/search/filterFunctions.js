import { addTag, updateSearch } from "./tagFunctions.js";

let currentFilters = []; // Stocke les tags sélectionnés

// Initialise le comportement d’un dropdown (ingrédients, appareils, ustensiles)
export function setupDropdown(dropdownId, selectId) {
    const dropdownButton = document.getElementById(dropdownId);       // bouton bleu
    const selectContainer = document.getElementById(selectId);        // menu déroulant
    const input = selectContainer.querySelector(".select-input");     // champ texte à l'intérieur
    const options = selectContainer.querySelector(".select-options"); // liste <ul> des options

    // Quand on clique sur le bouton, on ouvre/ferme le menu
    dropdownButton.addEventListener("click", (event) => {
        event.preventDefault();
        selectContainer.classList.toggle("hidden");
        input.focus(); // on met le focus pour taper directement
    });

    // Filtrage dynamique des <li> à l'intérieur du menu déroulant
    input.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();
        const allOptions = options.querySelectorAll("li");

        allOptions.forEach(option => {
            const text = option.textContent.toLowerCase();
            option.classList.toggle("hidden", !text.includes(query)); // cache les <li> qui ne matchent pas
        });
    });

    // Quand l’utilisateur clique sur une option, on crée un tag
    options.addEventListener("click", (event) => {
        if (event.target.tagName === "LI") {
            const selectedOption = event.target.textContent.toLowerCase();
            addTag(selectedOption);      // crée le tag visuellement
            updateActiveFilters();       // met à jour les filtres internes
            updateSearch();              // relance la recherche
            selectContainer.classList.add("hidden");
            input.value = "";            // reset du champ input
        }
    });
}

// Récupère tous les tags actifs visuellement
export function updateActiveFilters() {
    const tagsContainer = document.getElementById("tags");
    currentFilters = Array.from(tagsContainer.children).map(
        (element) => element.querySelector("p").textContent.toLowerCase()
    );
}

// Réinitialise les filtres actifs
export function clearActiveFilters() {
    currentFilters = [];
}
