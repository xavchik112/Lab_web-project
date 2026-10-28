import { initialRecipes } from "./data.js";
import { loadRecipes, saveRecipes } from "./storage.js";
import { createRecipe, deleteRecipe, filterRecipes, toggleFavorite } from "./recipes.js";
import { searchInput, categoryFilter, favoritesOnly, recipeForm, recipeList, formMessage, renderRecipes } from "./ui.js";
let recipes = loadRecipes() ?? initialRecipes;
function getFilter() {
    return {
        query: searchInput.value,
        category: categoryFilter.value,
        favoritesOnly: favoritesOnly.checked
    };
}
function render() {
    renderRecipes(filterRecipes(recipes, getFilter()));
}
function persistAndRender() {
    saveRecipes(recipes);
    render();
}
searchInput.addEventListener("input", render);
categoryFilter.addEventListener("change", render);
favoritesOnly.addEventListener("change", render);
recipeList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement))
        return;
    const button = target.closest("button[data-action]");
    if (!button)
        return;
    const id = button.dataset.id;
    const action = button.dataset.action;
    if (!id)
        return;
    if (action === "favorite") {
        recipes = toggleFavorite(recipes, id);
    }
    else if (action === "delete") {
        recipes = deleteRecipe(recipes, id);
    }
    else {
        return;
    }
    persistAndRender();
});
recipeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const titleInput = document.querySelector("#recipe-title");
    const categoryInput = document.querySelector("#recipe-category");
    const servingsInput = document.querySelector("#recipe-servings");
    const timeInput = document.querySelector("#recipe-time");
    const ingredientsInput = document.querySelector("#recipe-ingredients");
    const instructionsInput = document.querySelector("#recipe-instructions");
    if (!titleInput || !categoryInput || !servingsInput || !timeInput ||
        !ingredientsInput || !instructionsInput) {
        formMessage.textContent = "Ошибка разметки формы.";
        formMessage.className = "error";
        return;
    }
    const title = titleInput.value.trim();
    const servings = Number(servingsInput.value);
    const cookingTime = Number(timeInput.value);
    const ingredients = ingredientsInput.value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    const instructions = instructionsInput.value.trim();
    if (!title || !instructions || ingredients.length === 0) {
        formMessage.textContent = "Заполните все поля формы.";
        formMessage.className = "error";
        return;
    }
    if (!Number.isFinite(servings) || servings < 1 || servings > 30) {
        formMessage.textContent = "Количество порций должно быть от 1 до 30.";
        formMessage.className = "error";
        return;
    }
    if (!Number.isFinite(cookingTime) || cookingTime < 1 || cookingTime > 600) {
        formMessage.textContent = "Время должно быть от 1 до 600 минут.";
        formMessage.className = "error";
        return;
    }
    const draft = {
        title,
        category: categoryInput.value,
        servings,
        cookingTime,
        ingredients,
        instructions
    };
    recipes = [createRecipe(draft), ...recipes];
    recipeForm.reset();
    formMessage.textContent = "Рецепт добавлен.";
    formMessage.className = "success";
    persistAndRender();
});
render();
