// Importation de l'affichage des recettes et de la génération des balises visuelles (tags jaunes)
import { displayRecipes } from "./showRecipes.js";
import { searchTag } from "../templates/tagRecipes.js";

// Sélections des éléments du DOM pour les dropdowns et la zone de tags
const tagsContainer = document.getElementById("tags");
const ingredientsSelect = document.getElementById("ingredients-select");
const ustensilsSelect = document.getElementById("ustensils-select");
const appliancesSelect = document.getElementById("appliances-select");

// Sélections des listes <ul> à l’intérieur de chaque dropdown
const ingredientsList = ingredientsSelect.querySelector("ul");
const ustensilsList = ustensilsSelect.querySelector("ul");
const appliancesList = appliancesSelect.querySelector("ul");

// Sélections des champs <input> de recherche dans les dropdowns
const ingredientsInput = ingredientsSelect.querySelector("input");
const ustensilsInput = ustensilsSelect.querySelector("input");
const appliancesInput = appliancesSelect.querySelector("input");

// Stockage des tags sélectionnés (ingrédients, ustensiles, appareils)
let selectedTags = [];

// Fonction principale appelée à chaque mise à jour de l'affichage de recettes
export function searchTags(allRecipes) {
  updateAdvancedLists(allRecipes); 
  addDropdownFiltering(); 

  // Gère les clics sur les éléments <li> dans les listes (ajout de tags)
  [ingredientsList, ustensilsList, appliancesList].forEach(list =>
    bindListClick(list, allRecipes)
  );

  bindTagDeletion(allRecipes); // Gère les clics sur la croix des tags pour les supprimer
}

// Active la recherche en direct dans les dropdowns
function addDropdownFiltering() {
  ingredientsInput.oninput = () => filterDropdown(ingredientsInput.value, ingredientsList);
  ustensilsInput.oninput = () => filterDropdown(ustensilsInput.value, ustensilsList);
  appliancesInput.oninput = () => filterDropdown(appliancesInput.value, appliancesList);
}

// Quand on clique sur un <li> d’un dropdown, on crée un tag jaune et on filtre les recettes
function bindListClick(list, recipes) {
  list.onclick = (e) => {
    if (e.target.tagName === "LI") {
      const tagText = e.target.textContent;
      if (!selectedTags.includes(tagText)) {
        selectedTags.push(tagText); 
        tagsContainer.innerHTML += searchTag(tagText);
        filterByTags(recipes); 
      }
    }
  };
}

// Supprime un tag jaune quand on clique sur la croix, et met à jour le filtrage
function bindTagDeletion(recipes) {
  tagsContainer.onclick = (e) => {
    if (e.target.tagName === "I") {
      const tagText = e.target.closest(".tag").querySelector("p").textContent;
      selectedTags = selectedTags.filter(tag => tag !== tagText); 
      e.target.closest(".tag").remove(); 
      filterByTags(recipes); 
    }
  };
}

// Applique un filtre strict : chaque tag actif doit être trouvé dans la recette
function filterByTags(recipes) {
  const filtered = recipes.filter(recipe => {
    return selectedTags.every(tag => {
      const tagLower = tag.toLowerCase();
      const ingredients = recipe.ingredients.map(i => i.ingredient.toLowerCase());
      const ustensils = recipe.ustensils.map(u => u.toLowerCase());
      const appliance = recipe.appliance.toLowerCase();

      // Une recette passe si le tag est présent dans au moins un des trois champs
      return (
        ingredients.includes(tagLower) ||
        ustensils.includes(tagLower) ||
        appliance.includes(tagLower)
      );
    });
  });

  displayRecipes(filtered); // Affiche les recettes filtrées
  updateAdvancedLists(filtered); 
  document.getElementById("recipe-count").textContent =
    `${filtered.length} recette${filtered.length > 1 ? "s" : ""}`;
}

// Met à jour dynamiquement les listes dropdowns en fonction des recettes affichées
function updateAdvancedLists(recipes) {
  const ingredients = [...new Set(recipes.flatMap(r => r.ingredients.map(i => i.ingredient)))];
  const ustensils = [...new Set(recipes.flatMap(r => r.ustensils))];
  const appliances = [...new Set(recipes.map(r => r.appliance))];

  fillList(ingredientsList, ingredients.sort());
  fillList(ustensilsList, ustensils.sort());
  fillList(appliancesList, appliances.sort());

  // Configure les comportements de type "ouvrir/fermer" sur chaque bouton dropdown
  setTimeout(() => {
    setupDropdownToggle("dropdownSearchButtonIngredients", ingredientsSelect);
    setupDropdownToggle("dropdownSearchButtonUstensils", ustensilsSelect);
    setupDropdownToggle("dropdownSearchButtonAppliances", appliancesSelect);
  }, 0);
}

// Affiche ou masque les <li> dans un dropdown selon la saisie
function filterDropdown(query, list) {
  [...list.children].forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(query.toLowerCase()) ? "" : "none";
  });
}

// Vide et remplit une <ul> avec les nouveaux éléments de filtrage
function fillList(list, items) {
  list.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    li.className = "cursor-pointer hover:bg-customYellow px-2 py-1 rounded";
    list.appendChild(li);
  });
}

// Gère l'ouverture / fermeture de chaque menu dropdown (Ingrédients, Ustensiles, Appareils)
function setupDropdownToggle(buttonId, container) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  const svg = button.querySelector("svg");

  button.onclick = () => {
    // Ferme tous les dropdowns sauf celui sélectionné
    [ingredientsSelect, ustensilsSelect, appliancesSelect].forEach(drop => {
      if (drop !== container) drop.classList.replace("scale-y-100", "scale-y-0");
    });

    // Réinitialise l'état des icônes fléchées
    document.querySelectorAll("#dropdown-form svg").forEach(icon => {
      if (icon !== svg) icon.classList.remove("rotate-180");
    });

    // Ouvre ou ferme le menu actif
    container.classList.toggle("scale-y-0");
    container.classList.toggle("scale-y-100");
    svg.classList.toggle("rotate-180");
  };
}
