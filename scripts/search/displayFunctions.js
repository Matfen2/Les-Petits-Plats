import { recipeCard } from "../templates/recipeCard.js";

export function displayRecipes(recipesFound, container, query = "", tags = []) {
    container.innerHTML = "";
    console.log("Query dans displayRecipes:", query);
    console.log("Tags dans displayRecipes:", tags);
    console.log("Recipes trouvées:", recipesFound);
    console.log(recipesFound.length);

    // Vérifier si aucune recette n'a été trouvée
    if (recipesFound.length === 0) {
        let errorMessage = "";
        console.log("displayRecipes - Aucune recette trouvée pour Query:", query);

        // Cas 1: Aucun résultat pour la query seule
        if (query.length > 0 && tags.length === 0) {
            errorMessage = query;
        }
        // Cas 2: Aucun résultat pour la query avec des tags
        else if (query.length > 0 && tags.length > 0) {
            errorMessage = `${query}, ${tags.join(', ')}`;
        }
        // Cas 3: Aucun résultat pour les tags seuls
        else if (query.length === 0 && tags.length > 0) {
            errorMessage = tags.join(', ');
        }

        // Affichage du message d'erreur
        container.innerHTML = `
            <div class="no-recipes">
                <p class="font-manrope text-2xl">Aucune recette ne contient '${errorMessage}', vous pouvez chercher 'tarte aux pommes', 'poisson', etc.</p>
            </div>
        `;
        console.log(container.innerHTML);
    } else {
        // Affichage des recettes trouvées
        recipesFound.forEach(recipe => {
            const cardHTML = recipeCard(recipe);
            container.innerHTML += cardHTML;
        });
    }

    // Mise à jour du compteur de recettes
    const countRecipe = document.getElementById("recipe-count");
    countRecipe.textContent = `${recipesFound.length} recette(s)`;
}


export function updateRecipeCount(count) {
    const countRecipe = document.getElementById("recipe-count");
    countRecipe.textContent = `${count} recette(s)`;
}

// Met à jour dynamiquement les options visibles dans les dropdowns
export function updateFilters(filteredRecipes) {
    let ingredients = [], appliances = [], ustensils = [];

    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredients.push(ing.ingredient.toLowerCase()));
        appliances.push(recipe.appliance.toLowerCase());
        recipe.ustensils.forEach(u => ustensils.push(u.toLowerCase()));
    });

    // Suppression des doublons avec Set
    ingredients = [...new Set(ingredients)];
    appliances = [...new Set(appliances)];
    ustensils = [...new Set(ustensils)];

    // Mise à jour des listes déroulantes
    updateSelectOptions("ingredients-select", ingredients);
    updateSelectOptions("appliances-select", appliances);
    updateSelectOptions("ustensils-select", ustensils);
}

export function updateSelectOptions(selectId, options) {
    //dom element qui conteint les toptions du dropdown
    const selectElement = document.querySelector(`#${selectId} .select-options`);
    //vide le contenu HTML de l'élément pour supprimer toutes les anciennes options
    selectElement.innerHTML = "";
    //ajoute les nouvelles options
    options.forEach(option => {
        //crée un nouvel élément <li> pour chaque option
        const optionElement = document.createElement("li");
        //ajoute les classes CSS à l'élément <li>
        optionElement.classList.add("p-4", "hover:bg-customYellow", "cursor-pointer");
        //définit le texte de l'élément <li> à l'option actuelle
        optionElement.textContent = option;
        //ajoute l'élément <li> au conteneur des options
        selectElement.appendChild(optionElement);
    });
}