export function createReview(draft) {
    return {
        ...draft,
        id: crypto.randomUUID(),
        liked: false,
        createdAt: new Date().toISOString()
    };
}
export function addReview(recipes, recipeId, draft) {
    const review = createReview(draft);
    return recipes.map((recipe) => recipe.id === recipeId
        ? { ...recipe, reviews: [...recipe.reviews, review] }
        : recipe);
}
export function toggleReviewLike(recipes, recipeId, reviewId) {
    return recipes.map((recipe) => {
        if (recipe.id !== recipeId)
            return recipe;
        return {
            ...recipe,
            reviews: recipe.reviews.map((review) => review.id === reviewId ? { ...review, liked: !review.liked } : review)
        };
    });
}
export function getReviewCount(recipe) {
    return recipe.reviews.length;
}
export function getAverageRating(recipe) {
    if (recipe.reviews.length === 0)
        return null;
    const sum = recipe.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / recipe.reviews.length) * 10) / 10;
}
