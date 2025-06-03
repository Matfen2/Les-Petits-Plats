// Importation des fonctions nécessaires
import { applyFilters } from "./searchFunctions.js";         // pour relancer le moteur de recherche avec les tags
import { updateActiveFilters } from "./filterFunctions.js";  // pour mettre à jour la liste des tags actifs
import { searchTag } from "../templates/tag.js";             // pour générer le HTML d’un tag visuel

// Fonction pour ajouter un tag dans l'interface et relancer la recherche
export function addTag(tag) {
    // On récupère le conteneur HTML des tags
    const tagsContainer = document.getElementById("tags");

    // On convertit le tag en minuscule pour éviter les doublons de casse
    const lowerTag = tag.toLowerCase();

    // Vérifie si le tag est déjà présent dans le DOM
    const existingTag = Array.from(tagsContainer.children).find(
        (element) => element.querySelector("p").textContent === lowerTag
    );

    // Si le tag n'existe pas, on le crée
    if (!existingTag) {
        // On génère le HTML du tag avec la fonction template
        const tagHTML = searchTag(lowerTag);

        // On l’ajoute dans le container
        tagsContainer.innerHTML += tagHTML;

        // Pour chaque tag présent, on ajoute un eventListener sur la croix de suppression
        const tagElements = tagsContainer.querySelectorAll(".tag");
        tagElements.forEach(tagElement => {
            tagElement.querySelector("i").addEventListener("click", () => {
                tagElement.remove();     // Supprime visuellement le tag
                updateSearch();          // Relance la recherche avec les tags restants
            });
        });

        // On met à jour la liste des tags actifs (texte uniquement, en minuscules)
        updateActiveFilters(Array.from(tagsContainer.children).map(
            (element) => element.querySelector("p").textContent.toLowerCase()
        ));
    }
}

// Fonction déclenchée après ajout ou suppression d’un tag
export function updateSearch(query) {
    // On récupère tous les tags visuellement présents dans le DOM
    const tagsContainer = document.getElementById("tags");

    // On extrait les textes de chaque tag, en les normalisant en minuscules
    const tags = Array.from(tagsContainer.children).map(
        (element) => element.querySelector("p").textContent.toLowerCase()
    );

    // Mise à jour interne des filtres actifs
    updateActiveFilters(tags);

    // Relance du moteur de recherche avec les filtres actifs
    applyFilters(tags, document.getElementById("recipes"), query);
}
