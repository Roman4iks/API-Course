
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.BASEDATA,
  password: process.env.PASSWORD,
  port: process.env.PORT_BASEDATA,
})

module.exports = pool