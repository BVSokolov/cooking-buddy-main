import {recipeDao} from '../daos/recipeDao'
import {NewRecipeFormData} from '../../../types/types'
import {recipeTimeDao} from '../daos/recipeTimeDao'
import {recipeSectionDao} from '../daos/recipeSectionDao'
import {ingredientDao} from '../daos/ingredientDao'
import {recipeIngredientDao} from '../daos/recipeIngredientDao'
import {recipeStepDao} from '../daos/recipeStepDao'
import {FacadeContext} from '../types/types'

const importRecipe = (source: string) => {
  console.log('asd in import', source)

  return {ingredients: ['test']}
}

const newRecipe = async ({db, trx}: FacadeContext, recipeData: NewRecipeFormData) => {
  // when creating a new recipe we first create an entry in recipe table and get its id
  const {name, servings, time} = recipeData
  const recipeId = await recipeDao.createNew(trx, {name, servings})

  // then we create a row in the recipeTime table using recipe id
  await recipeTimeDao.createNew(trx, {recipeId, ...time})

  // then (if there are any ingredient sections in the recipe) we create an entry for each section in the recipeSection table and return its id
  const {sections} = recipeData
  const sectionIndexToIdMap = {}
  for (const {name, position} of sections) {
    const sectionId = await recipeSectionDao.createNew(trx, {recipeId, name, position})
    sectionIndexToIdMap[position] = sectionId
  }

  // then we create each ingredient (if it doesn't exist) in the ingredient table and return its id
  // then using recipeId and ingredientId (and recipeSectionId if available)...
  // ...we create an entry for each ingredient in the recipeIngredient table along amount and UOM
  const {ingredients} = recipeData
  for (const {name, refId, sectionIndex, ...rest} of ingredients) {
    const ingredientId = await ingredientDao.gotByName({db, trx}, name)
    console.log('ingredient id ', ingredientId)
    const recipeSectionId = sectionIndexToIdMap[sectionIndex]
    await recipeIngredientDao.createNew(trx, {recipeId, ingredientId, recipeSectionId, ...rest})
  }

  // // then using recipeId we create an entry for each step in the recipeStep table
  const {steps} = recipeData
  for (const {text, position, sectionIndex} of steps) {
    // search and replace any ref strings with recipeIngredientId in text here when i implement that on frontend
    const recipeSectionId = sectionIndexToIdMap[sectionIndex]
    await recipeStepDao.createNew(trx, {recipeId, recipeSectionId, text, position}) //.then(trx.commit).catch(trx.rollback)
  }

  await trx.commit()
  return recipeId
}

const getById = async (db: FacadeContext['db'], id: string): Promise<any> => {
  const recipe = await recipeDao.getById(db, id)
  console.log('asd in getById FACADE recipe', id, recipe)
  return recipe
}

export const recipesFacade = {importRecipe, newRecipe, getById}
