import {QueryBuilder} from 'knex'
import {db} from '../db/db'

export const getFirstRow = async (queryFn: QueryBuilder, column?: string) => {
  console.log('in getFirstRow util column is', column)
  const res = await queryFn
  console.log('result is', res)
  return column ? res[0][column] : res[0]
}

export const dbTrx = async (daoFn: Promise<any>) => {
  let trxObj = null
  try {
    const res = await db
      .transaction(function (trx) {
        trxObj = trx
        daoFn.then(trx.commit).catch(trx.rollback)
      })
      .then(function (inserts) {
        console.log('inserts finished: ', inserts)
        return inserts
      })
      .catch(function (error) {
        // If we get here, that means that
        // neither the 'Old Books' catalogues insert,
        // nor any of the books inserts will have taken place.
        console.error(error)
      })
    return res
  } catch (error) {
    console.log('AAHHASDJKLSFHJKLASDKJLFHASJKLHJKFASGHJGKFHJASGHJGHJKGHJKLADGKJFGLHJKDGLIHJFGKH')
    console.error(error)
    if (trxObj) trxObj.rollback()
  }
}
