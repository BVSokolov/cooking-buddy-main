import {Knex} from 'knex'
import {RecipeTime} from '../../../types/types'
import {db} from '../db/db'
import {getFirstRow} from './utils'

const createNew = async (trx: Knex.Transaction, data: Omit<RecipeTime, 'id'>) =>
  await getFirstRow(trx('recipeTime').insert(data, 'id'), 'id')

export const recipeTimeDao = {
  createNew,
}
