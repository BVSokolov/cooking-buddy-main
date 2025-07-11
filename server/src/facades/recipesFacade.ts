import {recipeDao} from '../daos/recipeDao'
import {NewRecipeFormData} from '../../../types/types'
import {recipeTimeDao} from '../daos/recipeTimeDao'
import {recipeSectionDao} from '../daos/recipeSectionDao'
import {ingredientDao} from '../daos/ingredientDao'
import {recipeIngredientDao} from '../daos/recipeIngredientDao'
import {recipeStepDao} from '../daos/recipeStepDao'

const importRecipe = (source: string) => {
  console.log('asd in import', source)

  return {ingredients: ['test']}
}

const newRecipe = async (recipeData: NewRecipeFormData) => {
  console.log('asd in newRecipe FACADE')
  // when creating a new recipe we first create an entry in recipe table and get its id
  const {name, servings, time} = recipeData
  const recipeId = await recipeDao.createNew({name, servings})
  // then we create a row in the recipeTime table using recipe id (if any time values were provided only)
  console.log('creating recipe time ', recipeId, time)
  await recipeTimeDao.createNew({recipeId, ...time})
  // then (if there are any ingredient sections in the recipe) we create an entry for each section in the recipeSection table and return its id
  const {sections} = recipeData
  const sectionIndexToIdMap = {}
  sections.map(async ({name, position}) => {
    const sectionId = await recipeSectionDao.createNew({recipeId, name, position})
    sectionIndexToIdMap[position] = sectionId
  })
  // then we create each ingredient (if it doesn't exist) in the ingredient table and return its id
  // then using recipeId and ingredientId (and recipeSectionId if available)...
  // ...we create an entry for each ingredient in the recipeIngredient table along amount and UOM
  const {ingredients} = recipeData
  ingredients.map(async ({name, refId, sectionIndex, ...rest}) => {
    const ingredientId = await ingredientDao.gotByName(name)
    const recipeSectionId = sectionIndexToIdMap[sectionIndex]
    await recipeIngredientDao.createNew({recipeId, ingredientId, recipeSectionId, ...rest})
  })
  // then using recipeId we create an entry for each step in the recipeStep table
  const {steps} = recipeData
  steps.map(async ({text, position, sectionIndex}) => {
    // search and replace any ref strings with recipeIngredientId in text here when i implement that on frontend
    const recipeSectionId = sectionIndexToIdMap[sectionIndex]
    await recipeStepDao.createNew({recipeId, recipeSectionId, text, position})
  })
  return recipeId
}

const getById = async (id: string): Promise<any> => {
  const recipe = await recipeDao.getById(id)
  console.log('asd in getById FACADE recipe', id, recipe)
  return recipe
}

export const recipesFacade = {importRecipe, newRecipe, getById}
