export function recipeCard(recipe) {
    return `
    <a href="#" class="rounded-xl w-92 basis-[28%]">
        <div class="recipe bg-white rounded-xl flex flex-col mt-8  h-[800px] shadow-lg">
            <div class="relative flex-none h-[340px] overflow-hidden rounded-t-xl">
                <img src="./assets/recipes/${recipe.image}" alt="${recipe.name}" class="object-cover w-full h-full">
                <span class="absolute top-4 right-4 bg-yellow-300 px-4 py-1 rounded-full font-manrope text-md">${recipe.time} min</span>
            </div>
            <div class="recipe-content p-6 flex-grow mb-12">
                <div class="recipe-txt">
                    <h2 class="recipe-title font-anton text-xl mb-4">${recipe.name}</h2>
                    <div class="recipe-description font-manrope text-gray-600">
                        <p class="uppercase text-gray-300 mb-2">recette</p>
                        <p class="text-sm mb-6 line-clamp-4">${recipe.description}</p>
                    </div>
                </div>
                <div class="recipe-ingredients">
                    <p class="uppercase text-gray-300 mb-2">ingrédients</p>
                    <div class="grid grid-cols-2 gap-4">
                        ${recipe.ingredients.map(ingredient => `
                            <div class="ingredient font-manrope text-sm">
                                <p>${ingredient.ingredient}</p>
                                <p class="text-gray-400">${ingredient.quantity || ''} ${ingredient.unit || ''}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </a>
    `;
}