// Importe la fonction qui affiche les recettes filtrées
import { displayRecipes } from "./showRecipes.js";

// Importe la fonction qui gère les tags et les dropdowns dynamiques
import { searchTags } from "./searchTags.js";

// Sélectionne les éléments HTML du champ de recherche, du conteneur des recettes et du compteur
const searchInput = document.getElementById("search");
const recipesContainer = document.getElementById("recipes");
const count = document.getElementById("recipe-count");

// Fonction utilitaire : transforme un tableau d’ingrédients en une seule string en minuscules
const getIngredientsString = (ingredientsArray) =>
  ingredientsArray.map(i => i.ingredient.toLowerCase()).join(" ");

// Vérifie si une recette correspond à la requête utilisateur
const recipeMatchesQuery = (recipe, query) => {
  return (
    recipe.name.toLowerCase().includes(query) ||               
    recipe.description.toLowerCase().includes(query) ||        
    getIngredientsString(recipe.ingredients).includes(query)   
  );
};

// Fonction principale appelée à chaque saisie dans le champ de recherche
export function searchRecipes(recipes) {
  searchInput.addEventListener("input", () => {
    // Nettoie et met en minuscule la requête de l'utilisateur
    const query = searchInput.value.toLowerCase().trim();

    // Si la recherche contient moins de 3 caractères, on affiche toutes les recettes
    if (query.length < 3) {
      displayRecipes(recipes);        
      searchTags(recipes);            
      count.textContent = `${recipes.length} recettes`; 
      return;
    }

    // Sinon, on filtre les recettes avec .filter() + fonction de correspondance
    const filteredRecipes = recipes.filter(recipe =>
      recipeMatchesQuery(recipe, query)
    );

    // Si aucun résultat, on affiche un message d’erreur
    if (filteredRecipes.length === 0) {
      recipesContainer.innerHTML = `
        <p class="text-xl text-center mt-10 mb-10 font-manrope text-gray-600">
          Aucune recette ne contient « ${query} », vous pouvez essayer « tarte aux pommes », « poisson », etc.
        </p>`;
      count.textContent = "0 recette";
    } else {
      // Sinon, on affiche les recettes filtrées + tags dynamiques à jour
      displayRecipes(filteredRecipes);                    
      searchTags(filteredRecipes);                        
      count.textContent = `${filteredRecipes.length} recette${filteredRecipes.length > 1 ? "s" : ""}`;
    }
  });
}
