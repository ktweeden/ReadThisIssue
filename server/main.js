const express = require('express')
const nunjucks  = require('nunjucks')
const path = require('path')
const middlewares = require('./middlewares.js')
const db = require('./db')


const app = express()

//nunjucks config
nunjucks.configure((path.join(__dirname, '../client/templates')), {
  autoescape: true,
  express   : app
})


//Initialise database connection and begin listening on port 3000
db.initialiseDbConnection(() => {
  app.listen(9000, () => {
    console.log('Read This Issue listening on port 9000')
  })
})

//Binds app to middlewares
middlewares.bind(app)
