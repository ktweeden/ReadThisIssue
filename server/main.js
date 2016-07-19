var express = require('express');
var nunjucks  = require('nunjucks');
var path = require('path');
var middlewares = require('./middlewares.js');
var db = require('./db');


var app = express();

//nunjucks config
nunjucks.configure((path.join(__dirname, '../client/templates')), {
  autoescape: true,
  express   : app
});


//Initialise database connection and begin listening on port 3000
db.initialiseDbConnection(function(){
  app.listen(9000, function () {
    console.log('Read This Issue listening on port 9000');
  });
});

//Binds app to middlewares
middlewares.bind(app);
