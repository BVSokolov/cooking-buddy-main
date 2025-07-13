import {Knex} from 'knex'
import {RecipeIngredient} from '../../../types/types'
import {db} from '../db/db'
import {getFirstRow} from './utils'

const createNew = async (trx: Knex.Transaction, data: Omit<RecipeIngredient, 'id'>) =>
  await getFirstRow(trx('recipeIngredient').insert(data, 'id'), 'id')

export const recipeIngredientDao = {
  createNew,
}
