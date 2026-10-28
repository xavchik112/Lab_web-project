import type {
  Category,
  Recipe,
  RecipeDraft,
  RecipeFilter
} from "./types.js";

export const ALL_CATEGORIES: Category[] = ["Завтрак", "Обед", "Ужин", "Десерт"];

export function createRecipe(draft: RecipeDraft): Recipe {
  return {
    ...draft,
    id: crypto.randomUUID(),
    favorite: false
  };
}

export function updateRecipe(
  recipes: Recipe[],
  id: string,
  patch: Partial<RecipeDraft>
): Recipe[] {
  return recipes.map((recipe) => {
    if (recipe.id !== id) return recipe;
    const { imageUrl, ...rest } = patch;
    const base: Recipe = { ...recipe, ...rest };
    if (imageUrl === undefined || imageUrl === "") {
      delete (base as { imageUrl?: string }).imageUrl;
    } else {
      base.imageUrl = imageUrl;
    }
    return base;
  });
}

export function toggleFavorite(recipes: Recipe[], id: string): Recipe[] {
  return recipes.map((recipe) =>
    recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe
  );
}

export function deleteRecipe(recipes: Recipe[], id: string): Recipe[] {
  return recipes.filter((recipe) => recipe.id !== id);
}

export function filterRecipes(recipes: Recipe[], filter: RecipeFilter): Recipe[] {
  const query = filter.query.trim().toLowerCase();

  const filtered = recipes.filter((recipe) => {
    const matchesQuery = query === "" || recipe.title.toLowerCase().includes(query);
    const matchesCategory =
      filter.category === "Все" || recipe.category === filter.category;
    const matchesFavorites = !filter.favoritesOnly || recipe.favorite;
    const matchesQuick = !filter.quickOnly || recipe.cookingTime <= 30;

    return matchesQuery && matchesCategory && matchesFavorites && matchesQuick;
  });

  switch (filter.sortBy) {
    case "time-asc":
      return [...filtered].sort((a, b) => a.cookingTime - b.cookingTime);
    case "time-desc":
      return [...filtered].sort((a, b) => b.cookingTime - a.cookingTime);
    case "title-asc":
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title, "ru"));
    default:
      return filtered;
  }
}

export function getCategoryStats(
  recipes: Recipe[]
): Array<{ category: Category; count: number }> {
  return ALL_CATEGORIES.map((category) => ({
    category,
    count: recipes.filter((r) => r.category === category).length
  }));
}