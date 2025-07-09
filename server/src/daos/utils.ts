import {QueryBuilder} from 'knex'

export const getFirstRow = async (queryFn: QueryBuilder, column?: string) => {
  console.log('in getFirstRow DAO column is', column)
  const res = await queryFn
  console.log('asd in DAO result is', res)
  return column ? res[0][column] : res[0]
}
