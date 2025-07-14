import {RecipeStep} from '../../../types/types'
import {DaoContext} from '../types/types'
import {getFirstRow} from './utils'

const createNew = async (trx: DaoContext['trx'], data: Omit<RecipeStep, 'id'>) =>
  await getFirstRow(trx('recipeStep').insert(data, 'id'), 'id')

export const recipeStepDao = {
  createNew,
}
