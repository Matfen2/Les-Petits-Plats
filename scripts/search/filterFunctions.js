import { addTag, updateSearch } from "./tagFunctions.js";

let currentFilters = [];

//fonction pour initialiser un dropdown avec les événements
export function setupDropdown(dropdownId, selectId) {
    //dom elements du seelct
    const dropdownButton = document.getElementById(dropdownId);
    const selectContainer = document.getElementById(selectId);
    const input = selectContainer.querySelector(".select-input");
    const options = selectContainer.querySelector(".select-options");

    //ajoute un événement 'click' au bouton de dropdown pour afficher/masquer le conteneur de sélection
    dropdownButton.addEventListener("click", (event) => {
        event.preventDefault();
        selectContainer.classList.toggle("hidden");
        input.focus();
    });
    //ajoute un événement 'input' à l'entrée de recherche pour filtrer les options
    input.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();
        //récupère toutes les options
        const allOptions = options.querySelectorAll("li");
        allOptions.forEach(option => {
            //récupère le texte de l'option en minuscules
            const text = option.textContent.toLowerCase();
            if (text.includes(query)) {
                //affiche l'option si elle contient la query
                option.classList.remove("hidden");
            } else {
                //masque l'option sinon
                option.classList.add("hidden");
            }
        });
    });
    //ajoute un événement 'click' aux options pour gérer la sélection d'une option
    options.addEventListener("click", (event) => {
        //vérifie si l'élément cliqué est une option (LI)
        if (event.target.tagName === "LI") {
            //récupère le texte de l'option sélectionnée en minuscules
            const selectedOption = event.target.textContent.toLowerCase();
            //ajoute le tag correspondant à l'option sélectionnée
            addTag(selectedOption);
            //met à jour les filtres actifs
            updateActiveFilters();
            //met à jour la recherche
            updateSearch();
            //masque le conteneur de sélection
            selectContainer.classList.add("hidden");
            //vide l'entrée de recherche
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