import { displayRecipes } from "./showRecipes.js";
import { searchTags } from "./searchTags.js";

// Sélection des éléments HTML nécessaires
const searchInput = document.getElementById("search");
const recipesContainer = document.getElementById("recipes");
const count = document.getElementById("recipe-count");

// Fonction réutilisable qui transforme un tableau d’ingrédients en une chaîne de texte minuscule pour faciliter la recherche
function getIngredientsString(ingredientsArray) {
  let ingredientsStr = "";
  for (let j = 0; j < ingredientsArray.length; j++) {
    ingredientsStr += ingredientsArray[j].ingredient.toLowerCase() + " ";
  }
  return ingredientsStr.trim();
}

// Fonction qui retourne true si la recette correspond à la recherche en vérifiant le nom, la description ou les ingrédients
function recipeMatchesQuery(recipe, query) {
  const name = recipe.name.toLowerCase();
  const description = recipe.description.toLowerCase();
  const ingredients = getIngredientsString(recipe.ingredients);

  return (
    name.includes(query) ||
    description.includes(query) ||
    ingredients.includes(query)
  );
}

// Fonction principale appelée lors de chaque frappe clavier dans la barre de recherche
export function searchRecipes(recipes) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim(); // Nettoie et prépare le texte saisi

    // Si la recherche est trop courte (< 3 caractères), on réinitialise l’affichage
    if (query.length < 3) {
      displayRecipes(recipes);               
      searchTags(recipes);                   
      count.textContent = `${recipes.length} recettes`; 
      return;
    }

    // Sinon, on filtre les recettes manuellement avec une boucle
    const filteredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
      if (recipeMatchesQuery(recipes[i], query)) {
        filteredRecipes.push(recipes[i]);
      }
    }

    // Si aucun résultat, afficher un message d’erreur personnalisé
    if (filteredRecipes.length === 0) {
      recipesContainer.innerHTML = `
        <p class="text-xl text-center mt-10 mb-10 font-manrope text-gray-600">
          Aucune recette ne contient « ${query} », vous pouvez essayer « tarte aux pommes », « poisson », etc.
        </p>`;
      count.textContent = `0 recette`;
    } else {
      // Sinon, afficher les résultats filtrés et mettre à jour les tags
      displayRecipes(filteredRecipes);
      searchTags(filteredRecipes);
      count.textContent = `${filteredRecipes.length} recette${filteredRecipes.length > 1 ? "s" : ""}`;
    }

    console.log("Recettes filtrées:", filteredRecipes);
  });
}
