import { applyFilters } from "./searchFunctions.js";
import { updateActiveFilters } from "./filterFunctions.js";
import { searchTag } from "../templates/tag.js";

export function addTag(tag) {
    //element dom où les tags seront ajoutés
    const tagsContainer = document.getElementById("tags");
    //tag converti en minuscule pour assurer une comparaison insensible à la casse
    const lowerTag = tag.toLowerCase();
    //on vérifie si le tag existe déjà dans le conteneur
    const existingTag = Array.from(tagsContainer.children).find(
        (element) => element.querySelector("p").textContent === lowerTag
    );
    //ajout du tag s'il n'existe pas
    if (!existingTag) {
        const tagHTML = searchTag(lowerTag);
        tagsContainer.innerHTML += tagHTML;
        //ajout de l'event clik sur chaque tag pour la suppression et mise à jour de la recherche
        const tagElements = tagsContainer.querySelectorAll(".tag");
        tagElements.forEach(tagElement => {
            tagElement.querySelector("i").addEventListener("click", () => {
                tagElement.remove();
                updateSearch();
            });
        });
        //mise à jour des filtres actifs
        updateActiveFilters(Array.from(tagsContainer.children).map(
            (element) => element.querySelector("p").textContent.toLowerCase()
        ));
    }
}

export function updateSearch(query) {
    //récupère l'élément conteneur des tags
    const tagsContainer = document.getElementById("tags");
    //convertit les enfants du conteneur de tags en un tableau
    const tags = Array.from(tagsContainer.children).map(
        (element) => element.querySelector("p").textContent.toLowerCase()
    );
    //met à jour les filtres actifs avec la liste des tags
    updateActiveFilters(tags);
    //applique les filtres aux recettes présentes dans l'élément avec l'ID "recipes"
    applyFilters(tags, document.getElementById("recipes"), query);
}