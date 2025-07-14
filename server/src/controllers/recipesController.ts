import {recipeDao} from '../daos/recipeDao'
import {recipesFacade} from '../facades/recipesFacade'
import {NewRecipeFormData} from '../../../types/types'
import {EndpointContext} from '../types/types'

const getRecipes = async (ctx: EndpointContext) => {
  const {db} = ctx
  ctx.status = 200
  ctx.body = await recipeDao.getAll(db)
  return ctx
}

const getRecipe = async (ctx: EndpointContext) => {
  const {recipeId} = ctx.params
  const {db} = ctx
  ctx.status = 200
  ctx.body = await recipeDao.getById(db, recipeId)
  return ctx
}

type NewRecipeEndpointCtx = EndpointContext & {
  body: NewRecipeFormData
}
const newRecipe = async (ctx: NewRecipeEndpointCtx) => {
  const recipeData = ctx.body
  const {db, trx} = ctx
  console.log('asd ENDPOINT')
  // call facade which calls dao which stores new recipe and returns id to facade and then back here
  // get recipe id from facade and get recipe from dao to return as response body (alongside id)
  const recipeId = await recipesFacade.newRecipe({db, trx}, recipeData)
  console.log('asd in ENDPOINT new recipeId is', recipeId)
  // ctx.body = await recipesDao.getById(recipeId)
  const recipe = await recipesFacade.getById(db, recipeId)
  console.log('in ENDPOINT recipe is', recipe)
  ctx.response.body = JSON.stringify(recipe)
  ctx.status = 200
  return ctx
}

export const recipesController = {
  getRecipes,
  getRecipe,
  newRecipe,
}
