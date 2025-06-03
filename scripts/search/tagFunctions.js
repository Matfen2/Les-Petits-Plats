import { applyFilters } from "./searchFunctions.js";
import { updateActiveFilters } from "./filterFunctions.js";
import { searchTag } from "../templates/tag.js";

// Ajout d’un tag dans l’interface
export function addTag(tag) {
    const tagsContainer = document.getElementById("tags");
    const lowerTag = tag.toLowerCase();

    // Vérifie si ce tag est déjà présent pour éviter les doublons
    const existingTag = Array.from(tagsContainer.children).find(
        (element) => element.querySelector("p").textContent === lowerTag
    );

    // Si le tag n'existe pas encore, on l'ajoute
    if (!existingTag) {
        const tagHTML = searchTag(lowerTag); // génère le HTML <div class="tag">...</div>
        tagsContainer.innerHTML += tagHTML;

        // On ajoute un événement à chaque croix pour pouvoir supprimer le tag
        tagsContainer.querySelectorAll(".tag").forEach(tagElement => {
            tagElement.querySelector("i").addEventListener("click", () => {
                tagElement.remove();            // suppression du tag visuellement
                updateSearch();                 // relance la recherche après suppression
            });
        });

        // On met à jour la liste des tags actifs
        updateActiveFilters([...tagsContainer.children].map(
            el => el.querySelector("p").textContent.toLowerCase()
        ));
    }
}

// Mise à jour complète de la recherche (avec ou sans query dans le champ principal)
export function updateSearch(query) {
    const tagsContainer = document.getElementById("tags");

    // On récupère tous les tags actifs
    const tags = Array.from(tagsContainer.children).map(
        (element) => element.querySelector("p").textContent.toLowerCase()
    );

    // Mise à jour des filtres actifs
    updateActiveFilters(tags);

    // Relance l'affichage avec filtres actifs
    applyFilters(tags, document.getElementById("recipes"), query);
}
