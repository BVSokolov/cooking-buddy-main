import {RecipeStep} from '../../../types/types'
import {db} from '../db/db'
import {getFirstRow} from './utils'

const createNew = async (data: Omit<RecipeStep, 'id'>) =>
  await getFirstRow(db('recipeStep').insert(data, 'id'), 'id')

export const recipeStepDao = {
  createNew,
}
