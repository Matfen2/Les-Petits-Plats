export function createRecipeCard(recipe) {
  let ingredientsHTML = "";
  for (let i = 0; i < recipe.ingredients.length; i++) {
    const ing = recipe.ingredients[i];
    ingredientsHTML += `
      <div class="text-sm font-manrope">
        <p class="text-gray-900">${ing.ingredient}</p>
        <p class="text-gray-400">${ing.quantity || ''} ${ing.unit || ''}</p>
      </div>
    `;
  }

  return `
    <a href="#" class="rounded-2xl basis-[31%] mt-8">
      <div class="recipe bg-white rounded-xl flex flex-col h-[800px] shadow-lg">
        <div class="relative flex-none h-[343px] overflow-hidden rounded-t-xl">
          <img src="./assets/recipes/${recipe.image}" alt="${recipe.name}" class="object-cover w-full h-full">
          <span class="absolute top-8 right-6 bg-yellow-400 px-5 py-1 rounded-full font-manrope text-md">${recipe.time} min</span>
        </div>
        <div class="recipe-content p-8 flex-grow">
          <div class="recipe-txt">
            <h2 class="recipe-title font-anton text-xl mb-4">${recipe.name}</h2>
            <div class="recipe-description">
              <p class="uppercase text-gray-400 font-medium text-sm tracking-wide mb-3">recette</p>
              <p class="text-sm mb-6 line-clamp-4 font-manrope text-gray-600">${recipe.description}</p>
            </div>
          </div>
          <div class="recipe-ingredients">
            <p class="uppercase text-gray-400 font-medium text-sm tracking-wide mb-2">ingrédients</p>
            <div class="grid grid-cols-2 gap-y-4 mt-4">
              ${ingredientsHTML}
            </div>
          </div>
        </div>
      </div>
    </a>
  `;
}
