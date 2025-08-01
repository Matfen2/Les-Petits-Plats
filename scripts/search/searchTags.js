import { displayRecipes } from "./showRecipes.js";
import { searchTag } from "../templates/tagRecipes.js";

// Sélection des éléments DOM pour les tags et les listes déroulantes
const tagsContainer = document.getElementById("tags");
const ingredientsSelect = document.getElementById("ingredients-select");
const ustensilsSelect = document.getElementById("ustensils-select");
const appliancesSelect = document.getElementById("appliances-select");

// Accès aux <ul> de chaque dropdown
const ingredientsList = ingredientsSelect.querySelector("ul");
const ustensilsList = ustensilsSelect.querySelector("ul");
const appliancesList = appliancesSelect.querySelector("ul");

// Accès aux <input> de filtrage à l'intérieur des dropdowns
const ingredientsInput = ingredientsSelect.querySelector("input");
const ustensilsInput = ustensilsSelect.querySelector("input");
const appliancesInput = appliancesSelect.querySelector("input");

let selectedTags = []; // Stocke les tags jaunes actifs

// Fonction principale appelée à chaque affichage de recettes
export function searchTags(allRecipes) {
  updateAdvancedLists(allRecipes); // Génère les dropdowns dynamiques

  addDropdownFiltering(); // Active le filtrage des <li> dans chaque dropdown

  // Gère le clic sur chaque <li> de liste
  bindListClick(ingredientsList, allRecipes);
  bindListClick(ustensilsList, allRecipes);
  bindListClick(appliancesList, allRecipes);

  // Gère le clic sur la croix d’un tag jaune
  bindTagDeletion(allRecipes);
}

// Active les filtres dynamiques dans chaque champ <input>
function addDropdownFiltering() {
  ingredientsInput.oninput = () => filterDropdown(ingredientsInput.value, ingredientsList);
  ustensilsInput.oninput = () => filterDropdown(ustensilsInput.value, ustensilsList);
  appliancesInput.oninput = () => filterDropdown(appliancesInput.value, appliancesList);
}

// Gère le clic sur un <li> pour créer un tag jaune et filtrer les recettes
function bindListClick(list, recipes) {
  list.onclick = (e) => {
    if (e.target.tagName === "LI") {
      const tagText = e.target.textContent;
      if (!selectedTags.includes(tagText)) {
        selectedTags.push(tagText);
        tagsContainer.innerHTML += searchTag(tagText); // génère le tag visuel
        filterByTags(recipes); // filtre les recettes selon les tags actifs
      }
    }
  };
}

// Supprime un tag si l’utilisateur clique sur sa croix
function bindTagDeletion(recipes) {
  tagsContainer.onclick = (e) => {
    if (e.target.tagName === "I") {
      const tagDiv = e.target.closest(".tag");
      const tagText = tagDiv.querySelector("p").textContent;
      selectedTags = selectedTags.filter(tag => tag !== tagText); // maj tableau
      tagDiv.remove(); // supprime le tag visuel
      filterByTags(recipes); // relance le filtre
    }
  };
}

// Filtre les recettes selon TOUS les tags actifs
function filterByTags(recipes) {
  const filtered = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    let match = true;

    for (let j = 0; j < selectedTags.length; j++) {
      const tag = selectedTags[j].toLowerCase();
      const ingredients = recipe.ingredients.map(ing => ing.ingredient.toLowerCase()).join(" ");
      const ustensils = recipe.ustensils.join(" ").toLowerCase();
      const appliance = recipe.appliance.toLowerCase();

      // Si aucun champ ne contient le tag → recette exclue
      if (!(ingredients.includes(tag) || ustensils.includes(tag) || appliance.includes(tag))) {
        match = false;
        break;
      }
    }

    if (match) filtered.push(recipe); // on garde la recette si tous les tags sont respectés
  }

  displayRecipes(filtered);             // Affiche les cartes filtrées
  updateAdvancedLists(filtered);        // Met à jour les dropdowns dynamiques
  document.getElementById("recipe-count").textContent =
    `${filtered.length} recette${filtered.length > 1 ? "s" : ""}`; // compteur
}

// Met à jour les listes des dropdowns selon les recettes affichées
function updateAdvancedLists(recipes) {
  const ingredients = new Set();
  const ustensils = new Set();
  const appliances = new Set();

  // Ajoute les éléments uniques dans les Sets
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    for (let j = 0; j < recipe.ingredients.length; j++) {
      ingredients.add(recipe.ingredients[j].ingredient);
    }
    for (let j = 0; j < recipe.ustensils.length; j++) {
      ustensils.add(recipe.ustensils[j]);
    }
    appliances.add(recipe.appliance);
  }

  // Trie et insère les éléments dans leurs listes respectives
  fillList(ingredientsList, Array.from(ingredients).sort());
  fillList(ustensilsList, Array.from(ustensils).sort());
  fillList(appliancesList, Array.from(appliances).sort());

  // Active les comportements dropdown
  setTimeout(() => {
    setupDropdownToggle("dropdownSearchButtonIngredients", ingredientsSelect);
    setupDropdownToggle("dropdownSearchButtonUstensils", ustensilsSelect);
    setupDropdownToggle("dropdownSearchButtonAppliances", appliancesSelect);
  }, 0);
}

// Affiche ou masque les <li> selon la recherche
function filterDropdown(query, list) {
  const items = list.children;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.style.display = item.textContent.toLowerCase().includes(query.toLowerCase()) ? "" : "none";
  }
}

// Remplit un <ul> avec une liste d’éléments <li>
function fillList(list, items) {
  list.innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    const li = document.createElement("li");
    li.textContent = items[i];
    li.className = "cursor-pointer hover:bg-customYellow px-2 py-1 rounded";
    list.appendChild(li);
  }
}

// Gère l'ouverture et la fermeture des menus dropdown
function setupDropdownToggle(buttonId, container) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  const svg = button.querySelector("svg");

  button.onclick = () => {
    const allDropdowns = [ingredientsSelect, ustensilsSelect, appliancesSelect];

    for (let i = 0; i < allDropdowns.length; i++) {
      if (allDropdowns[i] !== container) {
        allDropdowns[i].classList.remove("scale-y-100");
        allDropdowns[i].classList.add("scale-y-0");
      }
    }

    document.querySelectorAll("#dropdown-form svg").forEach(icon => {
      if (icon !== svg) icon.classList.remove("rotate-180");
    });

    // Toggle ouverture / fermeture
    if (container.classList.contains("scale-y-0")) {
      container.classList.replace("scale-y-0", "scale-y-100");
      svg.classList.add("rotate-180");
    } else {
      container.classList.replace("scale-y-100", "scale-y-0");
      svg.classList.remove("rotate-180");
    }
  };
}
