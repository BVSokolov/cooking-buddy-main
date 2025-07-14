import {RecipeIngredient} from '../../../types/types'
import {DaoContext} from '../types/types'
import {getFirstRow} from './utils'

const createNew = async (trx: DaoContext['trx'], data: Omit<RecipeIngredient, 'id'>) =>
  await getFirstRow(trx('recipeIngredient').insert(data, 'id'), 'id')

export const recipeIngredientDao = {
  createNew,
}
