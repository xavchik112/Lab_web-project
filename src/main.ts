import type {
  Category,
  Recipe,
  RecipeDraft,
  RecipeFilter,
  ReviewDraft,
  SortMode
} from "./types.js";
import { initialRecipes } from "./data.js";
import { loadRecipes, saveRecipes } from "./storage.js";
import {
  createRecipe,
  deleteRecipe,
  filterRecipes,
  getCategoryStats,
  toggleFavorite,
  updateRecipe
} from "./recipes.js";
import { addReview, toggleReviewLike } from "./reviews.js";
import {
  searchInput,
  categoryFilter,
  favoritesOnly,
  quickOnly,
  sortBy,
  resetFilters,
  categoryStats,
  recipeForm,
  recipeList,
  formMessage,
  renderRecipes,
  idInput,
  titleInput,
  categoryInput,
  servingsInput,
  timeInput,
  ingredientsInput,
  instructionsInput,
  imageInput,
  isValidImageUrl,
  fillFormForEdit,
  resetFormToCreate,
  cancelEditButton
} from "./ui.js";

let recipes: Recipe[] = loadRecipes() ?? initialRecipes;

function getFilter(): RecipeFilter {
  return {
    query: searchInput.value,
    category: categoryFilter.value as Category | "Все",
    favoritesOnly: favoritesOnly.checked,
    quickOnly: quickOnly.checked,
    sortBy: sortBy.value as SortMode
  };
}

function renderStats(): void {
  const stats = getCategoryStats(recipes);
  categoryStats.textContent =
    "Всего по категориям: " +
    stats.map((s) => `${s.category} — ${s.count}`).join(", ");
}

function render(): void {
  renderRecipes(filterRecipes(recipes, getFilter()));
  renderStats();
}

function persistAndRender(): void {
  saveRecipes(recipes);
  render();
}

searchInput.addEventListener("input", render);
categoryFilter.addEventListener("change", render);
favoritesOnly.addEventListener("change", render);
quickOnly.addEventListener("change", render);
sortBy.addEventListener("change", render);

resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "Все";
  favoritesOnly.checked = false;
  quickOnly.checked = false;
  sortBy.value = "default";
  render();
});

recipeList.addEventListener("click", (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const button = target.closest<HTMLButtonElement>("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;
  if (!id) return;

  if (action === "favorite") {
    recipes = toggleFavorite(recipes, id);
    persistAndRender();
  } else if (action === "delete") {
    const recipe = recipes.find((r) => r.id === id);
    const name = recipe ? `«${recipe.title}»` : "рецепт";
    if (!window.confirm(`Удалить ${name}? Действие необратимо.`)) return;
    recipes = deleteRecipe(recipes, id);
    if (idInput.value === id) {
      resetFormToCreate();
      formMessage.textContent = "";
      formMessage.className = "";
    }
    persistAndRender();
  } else if (action === "edit") {
    const recipe = recipes.find((r) => r.id === id);
    if (recipe) fillFormForEdit(recipe);
  } else if (action === "review-like") {
    const reviewId = button.dataset.reviewId;
    if (!reviewId) return;
    recipes = toggleReviewLike(recipes, id, reviewId);
    persistAndRender();
  }
});

recipeList.addEventListener("submit", (event: SubmitEvent) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (!form.classList.contains("review-form")) return;

  event.preventDefault();

  const recipeId = form.dataset.recipeId;
  if (!recipeId) return;

  const data = new FormData(form);
  const author = String(data.get("author") ?? "").trim();
  const text = String(data.get("text") ?? "").trim();
  const rating = Number(data.get("rating"));

  if (!author || !text) {
    window.alert("Заполните имя и текст отзыва.");
    return;
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    window.alert("Оценка должна быть от 1 до 5.");
    return;
  }

  const draft: ReviewDraft = { author, text, rating };
  recipes = addReview(recipes, recipeId, draft);
  persistAndRender();
});

recipeForm.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const servings = Number(servingsInput.value);
  const cookingTime = Number(timeInput.value);
  const ingredients = ingredientsInput.value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const instructions = instructionsInput.value.trim();
  const imageUrl = imageInput.value.trim();

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

  if (imageUrl && !isValidImageUrl(imageUrl)) {
    formMessage.textContent =
      "Ссылка на изображение должна начинаться с http:// или https://";
    formMessage.className = "error";
    return;
  }

  const draft: RecipeDraft = {
    title,
    category: categoryInput.value as Category,
    servings,
    cookingTime,
    ingredients,
    instructions,
    imageUrl: imageUrl || undefined
  };

  const editingId = idInput.value;

  if (editingId) {
    recipes = updateRecipe(recipes, editingId, draft);
    formMessage.textContent = "Изменения сохранены.";
  } else {
    recipes = [createRecipe(draft), ...recipes];
    formMessage.textContent = "Рецепт добавлен.";
  }

  formMessage.className = "success";
  resetFormToCreate();
  persistAndRender();
});

cancelEditButton.addEventListener("click", () => {
  resetFormToCreate();
  formMessage.textContent = "";
  formMessage.className = "";
});

render();