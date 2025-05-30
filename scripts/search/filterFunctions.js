import { addTag, updateSearch } from "./tagFunctions.js";

let currentFilters = [];

//fonction pour initialiser un dropdown avec les événements
export function setupDropdown(dropdownId, selectId) {
    const dropdownButton = document.getElementById(dropdownId); // bouton cliquable
    const selectContainer = document.getElementById(selectId); // menu déroulant
    const input = selectContainer.querySelector(".select-input"); // champ texte interne
    const options = selectContainer.querySelector(".select-options"); // liste d'options

    // Lorsqu'on clique sur le bouton, on affiche/masque le menu
    dropdownButton.addEventListener("click", (event) => {
        event.preventDefault();
        selectContainer.classList.toggle("hidden");
        input.focus();
    });

    // Filtrage dynamique des options du dropdown quand on tape du texte
    input.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();
        const allOptions = options.querySelectorAll("li");
        allOptions.forEach(option => {
            const text = option.textContent.toLowerCase();
            option.classList.toggle("hidden", !text.includes(query));
        });
    });

    // Sélection d'une option => ajoute un tag + relance la recherche
    options.addEventListener("click", (event) => {
        if (event.target.tagName === "LI") {
            const selectedOption = event.target.textContent.toLowerCase();
            addTag(selectedOption); // fonction dans tagFunctions
            updateActiveFilters();
            updateSearch();
            selectContainer.classList.add("hidden");
            input.value = "";
        }
    });
}

//mise à jour des filtres actifs
export function updateActiveFilters() {
    const tagsContainer = document.getElementById("tags");
    currentFilters = Array.from(tagsContainer.children).map(
        (element) => element.querySelector("p").textContent.toLowerCase()
    );
}

export function clearActiveFilters() {
    currentFilters = [];
}