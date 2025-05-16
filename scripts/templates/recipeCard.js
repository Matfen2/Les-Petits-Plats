export function recipeCard(recipe) {
    return `
    <a href="#" class="rounded-xl w-full md:basis-[45%] lg:basis-[35%] xl:basis-[28%]">
        <div class="recipe bg-white rounded-xl flex flex-col h-auto md:h-[700px] shadow-lg">
    <div class="relative flex-none h-[150px] md:h-[243px] overflow-hidden rounded-t-xl">
        <img src="./assets/recipes/${recipe.image}" alt="${recipe.name}" class="object-cover w-full h-full">
        <span class="absolute top-4 right-4 bg-yellow-300 px-2 py-1 rounded-full font-manrope text-xs">${recipe.time} min</span>
    </div>
    <div class="recipe-content p-8 flex-1 md:flex-grow overflow-y-auto"> 
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