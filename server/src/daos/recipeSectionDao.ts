import {RecipeSection} from '../../../types/types'
import {DaoContext} from '../types/types'
import {getFirstRow} from './utils'

const createNew = async (trx: DaoContext['trx'], data: Omit<RecipeSection, 'id'>) =>
  await getFirstRow(trx('recipeSection').insert(data, 'id'), 'id')

export const recipeSectionDao = {
  createNew,
}
