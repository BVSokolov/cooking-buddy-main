import {Ingredient} from '../../../types/types'
import {getFirstRow} from './utils'
import {DaoContext} from '../types/types'

const createNew = async (trx: DaoContext['trx'], data: Omit<Ingredient, 'id'>) =>
  await getFirstRow(trx('ingredient').insert(data, 'id'), 'id')

const getByName = async (db: DaoContext['db'], name: Ingredient['name']) => {
  if (!name) throw new Error(`expected string value for name, got ${name}`)
  return await getFirstRow(db('ingredient').where({name}), 'id')
}

const gotByName = async ({db, trx}: DaoContext, name: Ingredient['name']) => {
  const id = await getByName(db, name)
  return id ? id : await createNew(trx, {name})
}

export const ingredientDao = {
  createNew,
  getByName,
  gotByName,
}
