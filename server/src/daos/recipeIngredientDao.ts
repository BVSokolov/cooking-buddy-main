import {RecipeIngredient} from '../../../types/types'
import {db} from '../db/db'
import {getFirstRow} from './utils'

const createNew = async (data: Omit<RecipeIngredient, 'id'>) =>
  await getFirstRow(db('recipeIngredient').insert(data, 'id'), 'id')

export const recipeIngredientDao = {
  createNew,
}
