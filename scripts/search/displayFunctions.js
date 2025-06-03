import { recipeCard } from "../templates/recipeCard.js";

// Affiche les recettes OU un message d’erreur s’il n’y en a aucune
export function displayRecipes(recipesFound, container, query = "", tags = []) {
    container.innerHTML = ""; // réinitialisation du contenu

    // Cas : aucune recette trouvée
    if (recipesFound.length === 0) {
        let errorMessage = "";

        // Selon ce que l’utilisateur a saisi, on adapte le message
        if (query.length > 0 && tags.length === 0) {
            errorMessage = query;
        } else if (query.length > 0 && tags.length > 0) {
            errorMessage = `${query}, ${tags.join(', ')}`;
        } else if (query.length === 0 && tags.length > 0) {
            errorMessage = tags.join(', ');
        }

        // On affiche un message personnalisé dans le DOM
        container.innerHTML = `
            <div class="no-recipes">
                <p class="font-manrope text-2xl">Aucune recette ne contient '${errorMessage}', vous pouvez chercher 'tarte aux pommes', 'poisson', etc.</p>
            </div>
        `;
    } else {
        // Cas : recettes trouvées → on injecte chaque carte HTML
        recipesFound.forEach(recipe => {
            const cardHTML = recipeCard(recipe);
            container.innerHTML += cardHTML;
        });
    }

    // Mise à jour du compteur en bas du champ de recherche
    const countRecipe = document.getElementById("recipe-count");
    countRecipe.textContent = `${recipesFound.length} recette(s)`;
}

// Met à jour seulement le compteur sans réafficher les cartes
export function updateRecipeCount(count) {
    const countRecipe = document.getElementById("recipe-count");
    countRecipe.textContent = `${count} recette(s)`;
}

// Met à jour dynamiquement les options de filtres selon les recettes affichées
export function updateFilters(filteredRecipes) {
    let ingredients = [], appliances = [], ustensils = [];

    // On récupère les valeurs présentes dans les recettes
    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredients.push(ing.ingredient.toLowerCase()));
        appliances.push(recipe.appliance.toLowerCase());
        recipe.ustensils.forEach(u => ustensils.push(u.toLowerCase()));
    });

    // On élimine les doublons avec Set
    ingredients = [...new Set(ingredients)];
    appliances = [...new Set(appliances)];
    ustensils = [...new Set(ustensils)];

    // On met à jour chaque liste déroulante
    updateSelectOptions("ingredients-select", ingredients);
    updateSelectOptions("appliances-select", appliances);
    updateSelectOptions("ustensils-select", ustensils);
}

// Injecte dynamiquement les <li> dans un menu déroulant
export function updateSelectOptions(selectId, options) {
    const selectElement = document.querySelector(`#${selectId} .select-options`);
    selectElement.innerHTML = ""; // vide les anciennes options

    // Crée un <li> pour chaque nouvelle option
    options.forEach(option => {
        const optionElement = document.createElement("li");
        optionElement.classList.add("p-4", "hover:bg-customYellow", "cursor-pointer");
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}
