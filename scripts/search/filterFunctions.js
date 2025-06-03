// On importe les fonctions pour gérer les tags et relancer la recherche
import { addTag, updateSearch } from "./tagFunctions.js";

// Variable globale pour stocker les tags sélectionnés
// eslint-disable-next-line no-unused-vars
let currentFilters = [];

// Fonction pour initialiser le comportement d’un menu déroulant
export function setupDropdown(dropdownId, selectId) {
    // Sélection des éléments HTML : bouton, container, champ input, et liste des options
    const dropdownButton = document.getElementById(dropdownId);
    const selectContainer = document.getElementById(selectId);
    const input = selectContainer.querySelector(".select-input");
    const options = selectContainer.querySelector(".select-options");

    // Quand on clique sur le bouton de dropdown : on ouvre ou on ferme le menu
    dropdownButton.addEventListener("click", (event) => {
        event.preventDefault(); // empêche le comportement par défaut (utile si dans un <form>)
        selectContainer.classList.toggle("hidden"); // affiche ou masque le menu
        input.focus(); // place automatiquement le curseur dans le champ de saisie
    });

    // Quand l’utilisateur tape dans le champ de recherche
    input.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase(); // normalisation
        const allOptions = options.querySelectorAll("li"); // on sélectionne toutes les options

        // Pour chaque option, on vérifie si elle contient la requête
        allOptions.forEach(option => {
            const text = option.textContent.toLowerCase(); // on récupère le texte en minuscule

            if (text.includes(query)) {
                option.classList.remove("hidden"); // on l’affiche
            } else {
                option.classList.add("hidden"); // on la masque sinon
            }
        });
    });

    // Si on clique sur une option du menu (élément LI)
    options.addEventListener("click", (event) => {
        if (event.target.tagName === "LI") {
            const selectedOption = event.target.textContent.toLowerCase(); // normalisation

            addTag(selectedOption);         // Ajout visuel du tag
            updateActiveFilters();          // Met à jour la variable `currentFilters`
            updateSearch();                 // Relance la recherche filtrée
            selectContainer.classList.add("hidden"); // on ferme le menu
            input.value = "";               // on vide le champ de saisie
        }
    });
}

// Fonction pour récupérer tous les tags sélectionnés visuellement dans l’interface
export function updateActiveFilters() {
    const tagsContainer = document.getElementById("tags");

    // On récupère le texte de chaque tag <p>, converti en minuscule
    currentFilters = Array.from(tagsContainer.children).map(
        (element) => element.querySelector("p").textContent.toLowerCase()
    );
}

// 🧹 Fonction pour vider la liste des filtres actifs (utile pour un reset)
export function clearActiveFilters() {
    currentFilters = [];
}
