var mongoose = require('mongoose');
var xml2js = require('xml2js');
var cfg = require('../cfg.json');
var request = require('request');
var inputValidation = require('./utils/input_validation');

var error = {};

/**
 * Searches goodreads database for a book given title or ISBN.
 */
var searchGoodreads = function (bookIdentifyer, onfound) {

   if (!inputValidation.inputValidation(bookIdentifyer)) {
     error.message ="Your search must contain letters a-z, numbers 1-0 and the characters - . , ! ?";
     console.log(error.message);
   }
   else {
     var book = encodeURIComponent(bookIdentifyer);
     var searchUrl = "https://www.goodreads.com/search/index.xml?key=" + cfg.GOODREADS_KEY + "&q=" + book;
     console.log(searchUrl);
     request.get(searchUrl, function (error, response, body){
       if (!!error) {
         return onfound(error);
       }
       xml2js.parseString(body, onfound);
     });
   }
}


module.exports = {
  searchGoodreads: searchGoodreads,
  error:error
}
