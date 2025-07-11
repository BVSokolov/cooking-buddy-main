import {RecipeTime} from '../../../types/types'
import {db} from '../db/db'
import {getFirstRow} from './utils'

const createNew = async (data: Omit<RecipeTime, 'id'>) =>
  await getFirstRow(db('recipeTime').insert(data, 'id'), 'id')

export const recipeTimeDao = {
  createNew,
}
