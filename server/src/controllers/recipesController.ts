import {Context} from 'koa'
import {recipesDao} from '../daos/recipeDao'
import {recipesFacade} from '../facades/recipesFacade'
import {NewRecipeData, NewRecipeFormData} from '../../../types/types'

const getRecipes = async (ctx: Context) => {
  ctx.status = 200
  ctx.body = await recipesDao.getAll()
  return ctx
}

const getRecipe = async (ctx: Context) => {
  const {recipeId} = ctx.params
  ctx.status = 200
  ctx.body = await recipesDao.getById(recipeId)
  return ctx
}

type NewRecipeEndpointCtx = Context & {
  body: NewRecipeFormData
}
const newRecipe = async (ctx: NewRecipeEndpointCtx) => {
  const recipeData = ctx.body
  console.log('asd ENDPOINT', recipeData)
  // call facade which calls dao which stores new recipe and returns id to facade and then back here
  // get recipe id from facade and get recipe from dao to return as response body (alongside id)
  const recipeId = await recipesFacade.newRecipe(recipeData)
  console.log('asd in ENDPOINT new recipeId is', recipeId)
  // ctx.body = await recipesDao.getById(recipeId)
  const recipe = await recipesFacade.getById(recipeId)
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
