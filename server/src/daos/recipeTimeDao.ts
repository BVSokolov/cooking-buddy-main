import {RecipeTime} from '../../../types/types'
import {DaoContext} from '../types/types'
import {getFirstRow} from './utils'

const createNew = async (trx: DaoContext['trx'], data: Omit<RecipeTime, 'id'>) =>
  await getFirstRow(trx('recipeTime').insert(data, 'id'), 'id')

export const recipeTimeDao = {
  createNew,
}
