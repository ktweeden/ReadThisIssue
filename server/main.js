var express = require('express');
var nunjucks  = require('nunjucks');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var xml2js = require('xml2js');
var request = require('request');


//local modules
var cfg = require('../cfg.json');
var db = require('./db');
var goodreads = require('./goodreads');

var app = express();


//CONFIGS

//nunjucks config
nunjucks.configure((path.join(__dirname, '../client/templates')), {
  autoescape: true,
  express   : app
});

//body parser config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Serve css files
app.use(express.static(path.join(__dirname, "../static/css")));

var bookWrapper = {
  allBooks: [
    {
      title: 'Human Acts',
      author: 'Han Kang',
      summary: 'A book from multiple perspectives about the guangju massacre',
      rating: '5/5'
    }
  ]
}

//Initialise database connection and begin listening on port 3000
db.initialiseDbConnection(function(){
  app.listen(9000, function () {
    console.log('Read This Issue listening on port 9000');
  });
});


//Home page request response
app.get('/', function (req, res) {
  if (!req.query.search) {
    console.log("no search term entered");
    res.render(path.join(__dirname, '../client/templates/addBook.njk'));
  }
  else {
    console.log (req.query);
    var searchTerm = req.query.search;
    goodreads.searchGoodreads(searchTerm, function(error, listOfWorks){
      console.log(listOfWorks);
      res.render(path.join(__dirname, '../client/templates/addBook.njk'), {listOfWorks:listOfWorks});
    });
  }
});
