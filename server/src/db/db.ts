// const Pool = require('pg').Pool
// const pool = new Pool({
//     user: 'dbuser',
//     host: 'localhost',
//     database: 'api',
//     password: 'dbuser',
//     port: 5432
// })

import knex from 'knex'

export const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    database: 'cooking-buddy',
    user: 'dbuser',
    password: 'dbuser',
  },
})
