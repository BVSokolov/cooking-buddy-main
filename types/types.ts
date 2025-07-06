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

// i have to make two tables next - recipeIngredient and recipeStep
// recipeIngredient columns will be id, recipeId, name, amount
// recipeStep columns will be id, recipeId, number (as in step number, first, second etc), text
// when creating a new recipe we first create it
// then using its id we create an entry for each ingredient in the recipeIngredient table
// then using its id we create an entry for each step in the recipeStep table
export type NewRecipeData = {
  name: string
  timeInAdvance: string
  timePrep: string
  timeCook: string
  timeTotal: string
  servings: string
}
