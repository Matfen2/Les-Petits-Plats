// Importation des données de recettes (JSON) et des fonctions d’affichage et de filtre
import recipes from "../../data/recipes.js";
import { displayRecipes, updateRecipeCount, updateFilters, updateSelectOptions } from "./displayFunctions.js";
import { setupDropdown } from "./filterFunctions.js";

// Variable globale contenant les résultats de recherche filtrés
let searchResults;

// Fonction principale de recherche déclenchée par l'utilisateur
export function mainSearch(query, container) {
    console.log("Recherche principale - Query:", query); // pour debug
    searchResults = []; // Réinitialisation des résultats

    // Si la recherche contient au moins 3 caractères
    if (query.length >= 3) {
        const queryLower = query.trim().toLowerCase(); // On nettoie et uniformise la requête

        // On parcourt chaque recette du tableau
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];

            // On vérifie si la requête est contenue dans le nom, la description ou les ingrédients
            const nameMatch = recipe.name.toLowerCase().includes(queryLower);
            const descriptionMatch = recipe.description.toLowerCase().includes(queryLower);
            const ingredientsMatch = recipe.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase().includes(queryLower)
            );

            // Si au moins une correspondance est trouvée, on garde la recette
            if (nameMatch || descriptionMatch || ingredientsMatch) {
                searchResults.push(recipe);
            }
        }
    } else {
        // Si aucun mot-clé saisi, on affiche toutes les recettes
        searchResults = recipes.slice(); // copie complète du tableau d'origine
    }

    console.log("Résultats après recherche principale:", searchResults);
    console.log("mainSearch - Appel de displayRecipes avec query:", query);

    // On affiche les résultats dans la section des recettes
    displayRecipes(searchResults, container, query);
    updateRecipeCount(searchResults.length);      // 🧮 Mise à jour du compteur de recettes
    updateFilters(searchResults);                 // 🔁 Mise à jour des dropdowns
}

// Fonction pour initialiser les dropdowns (ingrédients, appareils, ustensiles)
export function initializeDropdowns() {
    // Récupération des valeurs uniques pour chaque type
    const ingredients = collectUniqueValues(recipes, "ingredients");
    const appliances  = collectUniqueValues(recipes, "appliance");
    const ustensils   = collectUniqueValues(recipes, "ustensils");

    // Injection des options dans chaque dropdown
    updateSelectOptions("ingredients-select", ingredients);
    updateSelectOptions("appliances-select", appliances);
    updateSelectOptions("ustensils-select", ustensils);

    // Ajout des écouteurs pour ouvrir/fermer et interagir avec les menus déroulants
    setupDropdown("dropdownSearchButtonIngredients", "ingredients-select");
    setupDropdown("dropdownSearchButtonUstensils", "ustensils-select");
    setupDropdown("dropdownSearchButtonAppliances", "appliances-select");
}

// Fonction pour appliquer les tags sélectionnés comme filtres supplémentaires
export function applyFilters(tags, container, query = "") {
    // On part des résultats de recherche principale
    let filteredRecipes = [...searchResults];

    // Si des tags sont actifs
    if (tags.length > 0) {
        // Pour chaque tag sélectionné
        tags.forEach(tag => {
            filteredRecipes = filteredRecipes.filter(recipe =>
                // On teste si le tag correspond à un ingrédient
                recipe.ingredients.some(ingredient =>
                    ingredient.ingredient.toLowerCase().includes(tag)
                ) ||
                // ... ou à un ustensile
                recipe.ustensils.some(ustensil =>
                    ustensil.toLowerCase().includes(tag)
                ) ||
                // ... ou à l'appareil
                recipe.appliance.toLowerCase().includes(tag)
            );
        });
    }

    // On affiche les résultats filtrés
    displayRecipes(filteredRecipes, container, query, tags);
    updateRecipeCount(filteredRecipes.length);    // Met à jour le compteur
    updateFilters(filteredRecipes);               // Met à jour les listes déroulantes
}

// Fonction générique pour récupérer toutes les valeurs uniques selon le type
function collectUniqueValues(recipes, type) {
    const valuesSet = new Set(); // Utilisation d’un Set pour éviter les doublons

    // On parcourt toutes les recettes
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

    // On retourne un tableau de valeurs uniques
    return Array.from(valuesSet);
}
