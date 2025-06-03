// Importation des données et fonctions utiles
import recipes from "../../data/recipes.js"; // JSON contenant les 50 recettes
import {
  displayRecipes,        // Fonction qui affiche les recettes dans le DOM
  updateRecipeCount,     // Met à jour le compteur de recettes affichées
  updateFilters,         // Met à jour les dropdowns selon les recettes visibles
  updateSelectOptions    // Injecte les options uniques dans chaque dropdown
} from "./displayFunctions.js";

import { setupDropdown } from "./filterFunctions.js"; // Gère les comportements des menus déroulants

// Variable pour stocker les résultats de recherche courants
let searchResults = [];


// ===========================
// Fonction principale de recherche
// ===========================
export function mainSearch(query, container) {
    // Réinitialisation des résultats à toutes les recettes
    searchResults = recipes;

    //  Si l'utilisateur tape au moins 3 caractères
    if (query.length >= 3) {
        const queryLower = query.trim().toLowerCase(); 
        // .trim() supprime les espaces superflus au début/fin
        // .toLowerCase() standardise la casse pour éviter les erreurs de comparaison

        // Filtrage avec .filter() sur le tableau complet
        searchResults = recipes.filter(recipe => {
            // On compare 3 éléments : nom, description, ingrédients
            const nameMatch = recipe.name.toLowerCase().includes(queryLower);
            const descriptionMatch = recipe.description.toLowerCase().includes(queryLower);
            const ingredientsMatch = recipe.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase().includes(queryLower)
            );

            // On garde la recette si au moins un des 3 champs correspond
            return nameMatch || descriptionMatch || ingredientsMatch;
        });
    }

    // Affichage des recettes ou message d’erreur
    displayRecipes(searchResults, container, query);
    updateRecipeCount(searchResults.length);        // Mise à jour du compteur
    updateFilters(searchResults);                   // Mise à jour des dropdowns
}


// ===========================
// Initialisation des menus déroulants
// ===========================
export function initializeDropdowns() {
    // Récupération des valeurs uniques
    const ingredients = collectUniqueValues(recipes, "ingredients");
    const appliances  = collectUniqueValues(recipes, "appliance");
    const ustensils   = collectUniqueValues(recipes, "ustensils");

    // Injection des options dans chaque <select>
    updateSelectOptions("ingredients-select", ingredients);
    updateSelectOptions("appliances-select", appliances);
    updateSelectOptions("ustensils-select", ustensils);

    // ⚙️ Initialisation du comportement interactif de chaque dropdown
    setupDropdown("dropdownSearchButtonIngredients", "ingredients-select");
    setupDropdown("dropdownSearchButtonUstensils", "ustensils-select");
    setupDropdown("dropdownSearchButtonAppliances", "appliances-select");
}


// ===========================
// Application des filtres (tags actifs)
// ===========================
export function applyFilters(tags, container, query = "") {
    // Copie défensive des résultats pour ne pas altérer la source
    let filteredRecipes = [...searchResults];

    // Pour chaque tag actif, on filtre les recettes
    tags.forEach(tag => {
        filteredRecipes = filteredRecipes.filter(recipe =>
            // Une recette est conservée si :
            recipe.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase().includes(tag)
            ) ||
            recipe.ustensils.some(ustensil =>
                ustensil.toLowerCase().includes(tag)
            ) ||
            recipe.appliance.toLowerCase().includes(tag)
        );
    });

    // Affichage des recettes filtrées et mise à jour du compteur
    displayRecipes(filteredRecipes, container, query, tags);
    updateRecipeCount(filteredRecipes.length);
    updateFilters(filteredRecipes);
}


// ===========================
// Fonctions de collecte des valeurs uniques
// ===========================
function collectUniqueValues(recipes, type) {
    const valuesSet = new Set();

    recipes.forEach(recipe => {
        if (type === "ingredients") {
            recipe.ingredients.forEach(ing =>
                valuesSet.add(ing.ingredient.toLowerCase())
            );
        } else if (type === "ustensils") {
            recipe.ustensils.forEach(ust =>
                valuesSet.add(ust.toLowerCase())
            );
        } else if (type === "appliance") {
            valuesSet.add(recipe.appliance.toLowerCase());
        }
    });

    return Array.from(valuesSet); // Conversion Set → Array
}

