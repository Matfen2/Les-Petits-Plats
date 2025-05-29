import recipes from "../data/recipes.js";
import { recipeCard } from "./templates/recipeCard.js";

document.addEventListener("DOMContentLoaded", () => {
    //récupération du conteneur html
    const recipesContainer = document.getElementById("recipes");

    //pour chaque recette dans recipes.js, on crée une carte (template)
    recipes.forEach(recipe => {
        const recipeCardHtml = recipeCard(recipe);

        //on injecte la card dans le conteneur
        recipesContainer.innerHTML += recipeCardHtml
    })
});