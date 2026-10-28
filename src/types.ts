export type Category = "Завтрак" | "Обед" | "Ужин" | "Десерт";

export interface Recipe {
  readonly id: string;
  title: string;
  category: Category;
  servings: number;
  cookingTime: number;
  ingredients: string[];
  instructions: string;
  favorite: boolean;
  imageUrl?: string;
}

export type RecipeDraft = Omit<Recipe, "id" | "favorite">;

export type SortMode = "default" | "time-asc" | "time-desc" | "title-asc";

export type RecipeFilter = {
  query: string;
  category: Category | "Все";
  favoritesOnly: boolean;
  quickOnly: boolean;
  sortBy: SortMode;
};