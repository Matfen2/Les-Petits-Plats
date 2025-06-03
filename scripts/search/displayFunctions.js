// On importe la fonction qui génère le HTML d'une carte recette
import { recipeCard } from "../templates/recipeCard.js";

// Fonction principale pour afficher les recettes ou un message si aucune trouvée
export function displayRecipes(recipesFound, container, query = "", tags = []) {
    // On vide le conteneur HTML avant d'afficher les résultats
    container.innerHTML = "";

    // Log pour le debug : ce qui est saisi et ce qui est trouvé
    console.log("Query dans displayRecipes:", query);
    console.log("Tags dans displayRecipes:", tags);
    console.log("Recipes trouvées:", recipesFound);
    console.log(recipesFound.length);

    // Si aucune recette trouvée
    if (recipesFound.length === 0) {
        let errorMessage = "";

        console.log("displayRecipes - Aucune recette trouvée pour Query:", query);

        // Cas 1 : seule la requête principale a été saisie
        if (query.length > 0 && tags.length === 0) {
            errorMessage = query;
        }
        // Cas 2 : requête principale + tags actifs
        else if (query.length > 0 && tags.length > 0) {
            errorMessage = `${query}, ${tags.join(', ')}`;
        }
        // Cas 3 : uniquement des tags actifs
        else if (query.length === 0 && tags.length > 0) {
            errorMessage = tags.join(', ');
        }

        // On affiche dynamiquement un message d’erreur personnalisé dans le DOM
        container.innerHTML = `
            <div class="no-recipes">
                <p class="font-manrope text-2xl">
                    Aucune recette ne contient '${errorMessage}', vous pouvez chercher 'tarte aux pommes', 'poisson', etc.
                </p>
            </div>
        `;
        console.log(container.innerHTML);
    } else {
        // Si des recettes sont trouvées, on les affiche une par une
        recipesFound.forEach(recipe => {
            const cardHTML = recipeCard(recipe);   // On génère la carte HTML
            container.innerHTML += cardHTML;       // On l'ajoute dans le DOM
        });
    }

    // Mise à jour dynamique du compteur de recettes affichées
    const countRecipe = document.getElementById("recipe-count");
    countRecipe.textContent = `${recipesFound.length} recette(s)`;
}

// Met à jour uniquement le nombre de recettes affichées (utile pour éviter de tout réafficher)
export function updateRecipeCount(count) {
    const countRecipe = document.getElementById("recipe-count");
    countRecipe.textContent = `${count} recette(s)`;
}

// Met à jour dynamiquement les options disponibles dans les filtres dropdowns
export function updateFilters(filteredRecipes) {
    // Initialisation de tableaux pour ingrédients, appareils et ustensiles
    let ingredients = [];
    let appliances = [];
    let ustensils = [];

    // Extraction manuelle des données pour chaque recette filtrée
    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient =>
            ingredients.push(ingredient.ingredient.toLowerCase())
        );
        appliances.push(recipe.appliance.toLowerCase());
        recipe.ustensils.forEach(ustensil =>
            ustensils.push(ustensil.toLowerCase())
        );
    });

    // Suppression des doublons avec Set et reconversion en tableau
    ingredients = [...new Set(ingredients)];
    appliances = [...new Set(appliances)];
    ustensils = [...new Set(ustensils)];

    // Mise à jour de chaque menu déroulant avec les nouvelles options
    updateSelectOptions("ingredients-select", ingredients);
    updateSelectOptions("appliances-select", appliances);
    updateSelectOptions("ustensils-select", ustensils);
}

// Met à jour les <li> dans un menu déroulant donné
export function updateSelectOptions(selectId, options) {
    // On cible l’élément UL qui contient les options du menu
    const selectElement = document.querySelector(`#${selectId} .select-options`);

    // On supprime les anciennes options pour les remplacer
    selectElement.innerHTML = "";

    // Pour chaque valeur à afficher...
    options.forEach(option => {
        const optionElement = document.createElement("li"); // Création d’un <li>
        optionElement.classList.add("p-4", "hover:bg-customYellow", "cursor-pointer"); // Ajout des classes CSS
        optionElement.textContent = option; // On insère le texte dans le <li>
        selectElement.appendChild(optionElement); // On ajoute l’élément au menu
    });
}
