import {recipeDao} from '../daos/recipeDao'
import {NewRecipeFormData} from '../../../types/types'
import {recipeTimeDao} from '../daos/recipeTimeDao'
import {recipeSectionDao} from '../daos/recipeSectionDao'
import {ingredientDao} from '../daos/ingredientDao'
import {recipeIngredientDao} from '../daos/recipeIngredientDao'
import {recipeStepDao} from '../daos/recipeStepDao'
import {db} from '../db/db'

const importRecipe = (source: string) => {
  console.log('asd in import', source)

  return {ingredients: ['test']}
}

const newRecipe = async (recipeData: NewRecipeFormData) => {
  const trx = await db.transaction()
  try {
    console.log('asd in newRecipe FACADE')
    // when creating a new recipe we first create an entry in recipe table and get its id
    const {name, servings, time} = recipeData
    const recipeId = await recipeDao.createNew(trx, {name, servings})

    // then we create a row in the recipeTime table using recipe id
    console.log('creating recipe time ', recipeId, time)
    await recipeTimeDao.createNew(trx, {recipeId, ...time})

    // then (if there are any ingredient sections in the recipe) we create an entry for each section in the recipeSection table and return its id
    const {sections} = recipeData
    const sectionIndexToIdMap = {}
    sections.map(async ({name, position}) => {
      const sectionId = await recipeSectionDao.createNew(trx, {recipeId, name, position})
      sectionIndexToIdMap[position] = sectionId
    })

    // then we create each ingredient (if it doesn't exist) in the ingredient table and return its id
    // then using recipeId and ingredientId (and recipeSectionId if available)...
    // ...we create an entry for each ingredient in the recipeIngredient table along amount and UOM
    const {ingredients} = recipeData
    try {
      ingredients.map(async ({name, refId, sectionIndex, ...rest}) => {
        await ingredientDao
          .gotByName(trx, name)
          .then(async (ingredientId) => {
            console.log('inside then, ingredient id ', ingredientId)
            const recipeSectionId = sectionIndexToIdMap[sectionIndex]
            await recipeIngredientDao.createNew(trx, {recipeId, ingredientId, recipeSectionId, ...rest})
          })
          .catch((error) => {
            console.log('got error in loop')
            throw error
          })
      })
    } catch (error) {
      console.log('ok got the error outside of the map')
    }

    // // then using recipeId we create an entry for each step in the recipeStep table
    // const {steps} = recipeData
    // steps.map(async ({text, position, sectionIndex}) => {
    //   // search and replace any ref strings with recipeIngredientId in text here when i implement that on frontend
    //   const recipeSectionId = sectionIndexToIdMap[sectionIndex]
    //   await recipeStepDao.createNew(trx, {recipeId, recipeSectionId, text, position}) //.then(trx.commit).catch(trx.rollback)
    // })

    await trx.commit()
    console.log('returning id whattt, gonna query for the recipe now ', recipeId)
    const recipeOther = await db('recipe').where({id: recipeId})
    console.log('recipeOther ', recipeOther)
    const recipe = await getById(recipeId)
    console.log('well slap my butt and call me Benny, there was no exception thrown ', JSON.stringify(recipe))

    return recipeId
  } catch (error) {
    console.log('got error, will rollback ', error)
    await trx.rollback()
    console.log('rolled back')
  }
}

const getById = async (id: string): Promise<any> => {
  const recipe = await recipeDao.getById(id)
  console.log('asd in getById FACADE recipe', id, recipe)
  return recipe
}

export const recipesFacade = {importRecipe, newRecipe, getById}
