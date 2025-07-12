import {db} from '../db/db'
import {Recipe} from '../../../types/types'
import {getFirstRow} from './utils'

const getAll = async () => await db('recipe').select(['id', 'name'])

const getById = async (id: string) =>
  await getFirstRow(db('recipe').select(['id', 'name', 'servings']).where({id}))

const createNew = async (data: Omit<Recipe, 'id'>) => await getFirstRow(db('recipe').insert(data, 'id'), 'id')

export const recipeDao = {
  getAll,
  getById,
  createNew,
}
