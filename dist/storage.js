const STORAGE_KEY = "culinary-recipes";
function isReview(value) {
    if (typeof value !== "object" || value === null)
        return false;
    const item = value;
    return (typeof item.id === "string" &&
        typeof item.author === "string" &&
        typeof item.text === "string" &&
        typeof item.rating === "number" &&
        typeof item.liked === "boolean" &&
        typeof item.createdAt === "string");
}
function isRecipe(value) {
    if (typeof value !== "object" || value === null)
        return false;
    const item = value;
    const imageOk = item.imageUrl === undefined || typeof item.imageUrl === "string";
    const reviewsOk = Array.isArray(item.reviews) && item.reviews.every(isReview);
    return (typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.category === "string" &&
        typeof item.servings === "number" &&
        typeof item.cookingTime === "number" &&
        Array.isArray(item.ingredients) &&
        item.ingredients.every((x) => typeof x === "string") &&
        typeof item.instructions === "string" &&
        typeof item.favorite === "boolean" &&
        imageOk &&
        reviewsOk);
}
export function loadRecipes() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null)
        return null;
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || !parsed.every(isRecipe)) {
            return null;
        }
        return parsed;
    }
    catch {
        return null;
    }
}
export function saveRecipes(recipes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}
