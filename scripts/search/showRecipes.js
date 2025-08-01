import { createRecipeCard } from "../templates/createRecipeCard.js";

const recipesContainer = document.getElementById("recipes");

// Affiche toutes les cartes recette avec map + join
export function displayRecipes(recipesArray) {
  recipesContainer.innerHTML = recipesArray.map(createRecipeCard).join("");
}