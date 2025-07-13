import {Knex} from 'knex'
import {RecipeSection} from '../../../types/types'
import {db} from '../db/db'
import {getFirstRow} from './utils'

const createNew = async (trx: Knex.Transaction, data: Omit<RecipeSection, 'id'>) =>
  await getFirstRow(trx('recipeSection').insert(data, 'id'), 'id')

export const recipeSectionDao = {
  createNew,
}
