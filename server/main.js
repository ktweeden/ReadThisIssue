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
var schema = require('./schemas.js')

var app = express();


//CONFIGS

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
