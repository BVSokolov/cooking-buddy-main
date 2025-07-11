import {RecipeSection} from '../../../types/types'
import {db} from '../db/db'
import {getFirstRow} from './utils'

const createNew = async (data: Omit<RecipeSection, 'id'>) =>
  await getFirstRow(db('recipeSection').insert(data, 'id'), 'id')

export const recipeSectionDao = {
  createNew,
}
