export type Recipe = {
  id: string
  name: string
  content: {
    ingredients: {
      [key: string]: {id: string; name: string; value: string}
    }
    instructions: string[]
  }
}

export type NewRecipeFormData = {
  name: string
  timeInAdvance: string
  timePrep: string
  timeCook: string
  timeTotal: string
  servings: string
  ingredients: Array<{
    name: string
    amount: string
  }>
  steps: Array<{
    value: string
  }>
}

// i have to make four tables next - ingredient, recipeIngredient, recipeSection and recipeStep

// ingredient columns will be id, name
// recipeSection coulmns will be id, recipeId, name
// recipeIngredient columns will be id, ingredientId, recipeSectionId, recipeId, amount: int, unit of measurement: enum - amount...
// ... will be a dropdown on UI side so it's always a positive number, UOM will be enum
// recipeStep columns will be id, recipeId, recipeSectionId, number (as in step number, first, second etc), text

// when creating a new recipe we first create an entry in recipe table
// then we create each ingredient (if it doesn't exist) in the ingredient table and return its id
// then (if there are any ingredient sections in the recipe) we create an entry for each section in the recipeSection table and return its id
// then using recipeId and ingredientId (and recipeSectionId if available)...
// ...we create an entry for each ingredient in the recipeIngredient table along amount and UOM
// then using recipeId we create an entry for each step in the recipeStep table
export type NewRecipeData = {
  name: string
  timeInAdvance: string
  timePrep: string
  timeCook: string
  timeTotal: string
  servings: string
}
