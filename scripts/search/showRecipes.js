import { createRecipeCard } from "../templates/createRecipeCard.js";

const recipesContainer = document.getElementById("recipes");

// Fonction d’affichage des cartes de recettes dans le DOM
export function displayRecipes(recipesArray) {
  recipesContainer.innerHTML = "";

  // Parcourt manuellement le tableau 
  for (let i = 0; i < recipesArray.length; i++) {
    const recipe = recipesArray[i]; 
    const cardHTML = createRecipeCard(recipe); 
    recipesContainer.innerHTML += cardHTML; 
  }
}
