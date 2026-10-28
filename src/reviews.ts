import type { Recipe, Review, ReviewDraft } from "./types.js";

export function createReview(draft: ReviewDraft): Review {
  return {
    ...draft,
    id: crypto.randomUUID(),
    liked: false,
    createdAt: new Date().toISOString()
  };
}

export function addReview(
  recipes: Recipe[],
  recipeId: string,
  draft: ReviewDraft
): Recipe[] {
  const review = createReview(draft);
  return recipes.map((recipe) =>
    recipe.id === recipeId
      ? { ...recipe, reviews: [...recipe.reviews, review] }
      : recipe
  );
}

export function toggleReviewLike(
  recipes: Recipe[],
  recipeId: string,
  reviewId: string
): Recipe[] {
  return recipes.map((recipe) => {
    if (recipe.id !== recipeId) return recipe;
    return {
      ...recipe,
      reviews: recipe.reviews.map((review) =>
        review.id === reviewId ? { ...review, liked: !review.liked } : review
      )
    };
  });
}

export function getReviewCount(recipe: Recipe): number {
  return recipe.reviews.length;
}

export function getAverageRating(recipe: Recipe): number | null {
  if (recipe.reviews.length === 0) return null;
  const sum = recipe.reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / recipe.reviews.length) * 10) / 10;
}