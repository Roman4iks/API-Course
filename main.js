
require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const db = require('./db')

const getUsers = (request, response) => {
  db.query('SELECT * FROM "Members" ORDER BY members_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
  )
  
app.get('/', (request, response) => {
      response.json({ info: 'Node.js, Express, and Postgres API' })
    })
    
app.get('/members', getUsers)

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`)
})