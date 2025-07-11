import {Ingredient} from '../../../types/types'
import {db} from '../db/db'
import {getFirstRow} from './utils'

const createNew = async (data: Omit<Ingredient, 'id'>) =>
  await getFirstRow(db('ingredient').insert(data, 'id'), 'id')

const getByName = async (name: Ingredient['name']) =>
  await getFirstRow(db('ingredient').where('name', name).select('id'))

const gotByName = async (name: Ingredient['name']) => {
  console.log('in gotByName ', name)
  const id = await getByName(name)
  console.log('getByName returned ', id)
  return id ? id : await createNew({name})
}

export const ingredientDao = {
  createNew,
  getByName,
  gotByName,
}
