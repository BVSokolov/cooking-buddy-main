import {Knex} from 'knex'
import {RecipeStep} from '../../../types/types'
import {db} from '../db/db'
import {getFirstRow} from './utils'

const createNew = async (trx: Knex.Transaction, data: Omit<RecipeStep, 'id'>) =>
  await getFirstRow(trx('recipeStep').insert(data, 'id'), 'id')

export const recipeStepDao = {
  createNew,
}
