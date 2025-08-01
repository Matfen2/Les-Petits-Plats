import { displayRecipes } from "./search/showRecipes.js";
import recipes from "../data/recipes.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Recettes chargées :", recipes);

  // 1. Affichage initial de toutes les cartes recettes
  displayRecipes(recipes);
  document.getElementById("recipe-count").textContent = `${recipes.length} recettes`;

  // 2. Activation de la recherche par mots-clés

  // 3. Activation des dropdowns et tags dynamiques
});
