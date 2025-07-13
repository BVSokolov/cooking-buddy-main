import {QueryBuilder} from 'knex'
import {db} from '../db/db'

export const getFirstRow = async (queryFn: QueryBuilder, column?: string) => {
  console.log('in getFirstRow util column is', column)
  const res = await queryFn
  console.log('result is', res)
  return column ? res[0][column] : res[0]
}
