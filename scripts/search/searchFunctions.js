import recipes from "../../data/recipes.js";
import { displayRecipes, updateRecipeCount, updateFilters, updateSelectOptions } from "./displayFunctions.js";
import { setupDropdown } from "./filterFunctions.js";

let searchResults = [];


// Fonction principale pour effectuer la recherche
export function mainSearch(query, container) {
    // On part de toutes les recettes
    searchResults = recipes;

    // Si l'utilisateur tape au moins 3 caractères
    if (query.length >= 3) {
        const queryLower = query.trim().toLowerCase();

        // Filtrage des recettes avec .filter()
        // On cherche une correspondance dans : nom, description, ingrédients
        searchResults = recipes.filter(recipe => {
            const nameMatch = recipe.name.toLowerCase().includes(queryLower);
            const descriptionMatch = recipe.description.toLowerCase().includes(queryLower);
            const ingredientsMatch = recipe.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase().includes(queryLower)
            );
            return nameMatch || descriptionMatch || ingredientsMatch;
        });
    }

    // Affichage des recettes ou message d'erreur si aucune
    displayRecipes(searchResults, container, query);
    updateRecipeCount(searchResults.length);
    updateFilters(searchResults); // Met à jour les options des dropdowns
}


//fonction pour initialiser chaque dropdown avec les données des recettes
export function initializeDropdowns() {
    const ingredients = collectUniqueIngredients(recipes);
    const appliances = collectUniqueAppliances(recipes);
    const ustensils = collectUniqueUstensils(recipes);

    updateSelectOptions("ingredients-select", ingredients);
    updateSelectOptions("appliances-select", appliances);
    updateSelectOptions("ustensils-select", ustensils);

    //initialisation des écouteurs pour les dropdowns
    setupDropdown("dropdownSearchButtonIngredients", "ingredients-select");
    setupDropdown("dropdownSearchButtonUstensils", "ustensils-select");
    setupDropdown("dropdownSearchButtonAppliances", "appliances-select");
}

//applique les filtres actifs aux résultats de recherche
export function applyFilters(tags, container, query = "") {
    //copie les résultats de recherche pour éviter de modifier l'original
    let filteredRecipes = [...searchResults];
    //applique les filtres de tags sur les recettes
    tags.forEach(tag => {
        filteredRecipes = filteredRecipes.filter(recipe =>
            //garde les recettes où au moins un ingrédient/ustensil/appareil contient le tag
            recipe.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase().includes(tag)
            ) ||
            recipe.ustensils.some(ustensil =>
                ustensil.toLowerCase().includes(tag)
            ) ||
            recipe.appliance.toLowerCase().includes(tag)
        );
    });
    //affiche les recettes filtrées dans le conteneur spécifié
    displayRecipes(filteredRecipes, container, query, tags);
    //met à jour le nombre de recettes filtrées
    updateRecipeCount(filteredRecipes.length);
    updateFilters(filteredRecipes);
}



//fonction pour collecter tous les ingrédients uniques
function collectUniqueIngredients(recipes) {
    //création d'un nvl ensemble Set
    const ingredientsSet = new Set();
    //filtrage des doublons
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => ingredientsSet.add(ingredient.ingredient.toLowerCase()));
    });
    //convertion de cet ensemble en tableau
    return Array.from(ingredientsSet);
}

//fonction pour collecter tous les appareils uniques
function collectUniqueAppliances(recipes) {
    const appliancesSet = new Set();
    recipes.forEach(recipe => appliancesSet.add(recipe.appliance.toLowerCase()));
    return Array.from(appliancesSet);
}

//fonction pour collecter tous les ustensiles uniques
function collectUniqueUstensils(recipes) {
    const ustensilsSet = new Set();
    recipes.forEach(recipe => {
        recipe.ustensils.forEach(ustensil => ustensilsSet.add(ustensil.toLowerCase()));
    });
    return Array.from(ustensilsSet);
}