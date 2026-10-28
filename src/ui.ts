import type { Recipe } from "./types.js";

function requireElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Не найден элемент: ${selector}`);
  }
  return element;
}

export const searchInput = requireElement<HTMLInputElement>("#search");
export const categoryFilter = requireElement<HTMLSelectElement>("#category-filter");
export const favoritesOnly = requireElement<HTMLInputElement>("#favorites-only");
export const quickOnly = requireElement<HTMLInputElement>("#quick-only");
export const sortBy = requireElement<HTMLSelectElement>("#sort-by");
export const resetFilters = requireElement<HTMLButtonElement>("#reset-filters");
export const categoryStats = requireElement<HTMLParagraphElement>("#category-stats");

export const recipeForm = requireElement<HTMLFormElement>("#recipe-form");
export const recipeList = requireElement<HTMLDivElement>("#recipe-list");
export const formMessage = requireElement<HTMLParagraphElement>("#form-message");
export const resultsCount = requireElement<HTMLParagraphElement>("#results-count");

export const idInput = requireElement<HTMLInputElement>("#recipe-id");
export const titleInput = requireElement<HTMLInputElement>("#recipe-title");
export const categoryInput = requireElement<HTMLSelectElement>("#recipe-category");
export const servingsInput = requireElement<HTMLInputElement>("#recipe-servings");
export const timeInput = requireElement<HTMLInputElement>("#recipe-time");
export const ingredientsInput = requireElement<HTMLTextAreaElement>("#recipe-ingredients");
export const instructionsInput = requireElement<HTMLTextAreaElement>("#recipe-instructions");
export const imageInput = requireElement<HTMLInputElement>("#recipe-image");
export const submitButton = requireElement<HTMLButtonElement>("#submit-button");
export const cancelEditButton = requireElement<HTMLButtonElement>("#cancel-edit");

export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function renderRecipes(recipes: Recipe[]): void {
  recipeList.replaceChildren();
  resultsCount.textContent = `Найдено рецептов: ${recipes.length}`;

  if (recipes.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Ничего не найдено. Измените фильтр.";
    recipeList.append(empty);
    return;
  }

  for (const recipe of recipes) {
    const card = document.createElement("article");
    card.className = "recipe-card";

    if (recipe.imageUrl && isValidImageUrl(recipe.imageUrl)) {
      const img = document.createElement("img");
      img.src = recipe.imageUrl;
      img.alt = recipe.title;
      img.className = "recipe-image";
      img.loading = "lazy";
      card.append(img);
    }

    const title = document.createElement("h3");
    title.textContent = recipe.title;

    const meta = document.createElement("p");
    meta.textContent = `${recipe.category} · ${recipe.cookingTime} мин. · ${recipe.servings} порц.`;

    const ingredients = document.createElement("p");
    ingredients.textContent = `Ингредиенты: ${recipe.ingredients.join(", ")}`;

    const instructions = document.createElement("p");
    instructions.textContent = recipe.instructions;

    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.dataset.action = "favorite";
    favoriteButton.dataset.id = recipe.id;
    favoriteButton.textContent = recipe.favorite
      ? "★ Убрать из избранного"
      : "★ В избранное";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.dataset.action = "edit";
    editButton.dataset.id = recipe.id;
    editButton.textContent = "Редактировать";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = recipe.id;
    deleteButton.textContent = "Удалить";

    card.append(
      title,
      meta,
      ingredients,
      instructions,
      favoriteButton,
      editButton,
      deleteButton
    );
    recipeList.append(card);
  }
}

export function fillFormForEdit(recipe: Recipe): void {
  idInput.value = recipe.id;
  titleInput.value = recipe.title;
  categoryInput.value = recipe.category;
  servingsInput.value = String(recipe.servings);
  timeInput.value = String(recipe.cookingTime);
  ingredientsInput.value = recipe.ingredients.join(", ");
  instructionsInput.value = recipe.instructions;
  imageInput.value = recipe.imageUrl ?? "";

  submitButton.textContent = "Сохранить изменения";
  cancelEditButton.hidden = false;
  formMessage.textContent = `Редактирование: ${recipe.title}`;
  formMessage.className = "";

  recipeForm.scrollIntoView({ behavior: "smooth", block: "start" });
  titleInput.focus();
}

export function resetFormToCreate(): void {
  recipeForm.reset();
  idInput.value = "";
  submitButton.textContent = "Сохранить рецепт";
  cancelEditButton.hidden = true;
}