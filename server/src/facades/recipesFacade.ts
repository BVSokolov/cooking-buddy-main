import {recipesDao} from '../daos/recipeDao'
import {NewRecipeFormData} from '../../../types/types'
import {recipeTimeDao} from '../daos/recipeTimeDao'

const importRecipe = (source: string) => {
  console.log('asd in import', source)

  return {ingredients: ['test']}
}

const newRecipe = async (recipeData: NewRecipeFormData) => {
  console.log('asd in newRecipe FACADE', recipeData)
  // when creating a new recipe we first create an entry in recipe table and get its id
  const {name, servings, time} = recipeData
  const recipeId = await recipesDao.createNew({name, servings})
  // then we create a row in the recipeTime table using recipe id (if any time values were provided only)
  const recipeTimeId = recipeTimeDao.createNew({recipeId, ...time})
  // then we create each ingredient (if it doesn't exist) in the ingredient table and return its id

  // then (if there are any ingredient sections in the recipe) we create an entry for each section in the recipeSection table and return its id
  // then using recipeId and ingredientId (and recipeSectionId if available)...
  // ...we create an entry for each ingredient in the recipeIngredient table along amount and UOM
  // then using recipeId we create an entry for each step in the recipeStep table
  return await recipesDao.createNew(recipeData)
}

const getById = async (id: string): Promise<any> => {
  const recipe = await recipesDao.getById(id)
  console.log('asd in getById FACADE recipe', id, recipe)
  return recipe
}

export const recipesFacade = {importRecipe, newRecipe, getById}
