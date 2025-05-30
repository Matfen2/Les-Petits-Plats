import { applyFilters } from "./searchFunctions.js";
import { updateActiveFilters } from "./filterFunctions.js";
import { searchTag } from "../templates/tag.js";

// Ajout d’un tag (ex: "concombre") dans l’interface
export function addTag(tag) {
    const tagsContainer = document.getElementById("tags");
    const lowerTag = tag.toLowerCase();

    // Vérifie si ce tag est déjà sélectionné
    const existingTag = Array.from(tagsContainer.children).find(
        (element) => element.querySelector("p").textContent === lowerTag
    );

    // Si ce n'est pas le cas, on l’ajoute en HTML
    if (!existingTag) {
        const tagHTML = searchTag(lowerTag); // génère le HTML du tag
        tagsContainer.innerHTML += tagHTML;

        // Ajoute l'événement de suppression (clic sur croix)
        tagsContainer.querySelectorAll(".tag").forEach(tagElement => {
            tagElement.querySelector("i").addEventListener("click", () => {
                tagElement.remove();
                updateSearch(); // relance le filtre après suppression
            });
        });

        // Met à jour les filtres actifs (liste de tous les tags sélectionnés)
        updateActiveFilters([...tagsContainer.children].map(
            el => el.querySelector("p").textContent.toLowerCase()
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