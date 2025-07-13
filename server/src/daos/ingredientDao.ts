import {Knex} from 'knex'
import {Ingredient} from '../../../types/types'
import {db} from '../db/db'
import {getFirstRow} from './utils'

const createNew = async (trx: Knex.Transaction, data: Omit<Ingredient, 'id'>) =>
  await getFirstRow(trx('ingredient').insert(data, 'id'), 'id')

const getByName = async (name: Ingredient['name']) => await getFirstRow(db('ingredient').where({name}), 'id')

const gotByName = async (trx: Knex.Transaction, name: Ingredient['name']) => {
  if (!name) throw new Error(`expected string value for name, got ${name}`)

  console.log('in gotByName ', name)
  const id = await getByName(name)
  console.log('getByName returned ', id)
  return id ? id : await createNew(trx, {name})
}

export const ingredientDao = {
  createNew,
  getByName,
  gotByName,
}
