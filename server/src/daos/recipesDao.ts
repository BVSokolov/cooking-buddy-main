import {QueryBuilder} from 'knex'
import {db} from '../db/db'

const getFirstRow = async (queryFn: QueryBuilder, column?: string) => {
  console.log('in getFirstRow DAO column is', column)
  const res = await queryFn
  console.log('asd in DAO result is', res)
  return column ? res[0][column] : res[0]
}

const getAll = async () => await db('recipe').select(['id', 'name'])

const getById = async (id: string) => await getFirstRow(db('recipe').select(['id', 'name']).where({id}))

type NewRecipeData = {
  name: string
}
const createNew = async (data: NewRecipeData) => await getFirstRow(db('recipe').insert(data, 'id'), 'id')

export const recipesDao = {
  getAll,
  getById,
  createNew,
}
