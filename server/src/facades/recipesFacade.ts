import {recipesDao} from '../daos/recipesDao'
import {NewRecipeData} from '../../../types/types'

const importRecipe = (source: string) => {
  console.log('asd in import', source)

  return {ingredients: ['test']}
}

const newRecipe = async (recipeData: NewRecipeData) => {
  console.log('asd in newRecipe FACADE', recipeData)
  return await recipesDao.createNew(recipeData)
}

const getById = async (id: string): Promise<any> => {
  const recipe = await recipesDao.getById(id)
  console.log('asd in getById FACADE recipe', id, recipe)
  return recipe
}

export const recipesFacade = {importRecipe, newRecipe, getById}
