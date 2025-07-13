import {db} from '../db/db'
import {Recipe} from '../../../types/types'
import {getFirstRow} from './utils'
import {Knex} from 'knex'

const getAll = async () => await db('recipe').select(['id', 'name'])

const getById = async (id: string) => await getFirstRow(db('recipe').where({id}))

const createNew = async (trx: Knex.Transaction, data: Omit<Recipe, 'id'>) =>
  await getFirstRow(trx('recipe').insert(data, 'id'), 'id')

export const recipeDao = {
  getAll,
  getById,
  createNew,
}
