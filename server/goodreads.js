var mongoose = require('mongoose');
var xml2js = require('xml2js');
var cfg = require('../cfg.json');
var request = require('request');
var inputValidation = require('./utils/input_validation');

var error = {};

/**
 * Searches goodreads database for a book given title or ISBN.
 */
var searchGoodreads = function (bookIdentifyer, onFound) {

   if (!inputValidation.inputValidation(bookIdentifyer)) {
     error.message ="Your search must contain letters a-z, numbers 1-0 and the characters - . , ! ?";
     console.log(error.message);
   }
   else {
     var book = encodeURIComponent(bookIdentifyer);
     var searchUrl = "https://www.goodreads.com/search/index.xml?key=" + cfg.GOODREADS_KEY + "&q=" + book;
     console.log(searchUrl);

     //Send query to goodreads
     request.get(searchUrl, function (error, response, body){
       if (!!error) {
         return onFound(error);
       }

       //parse goodreads xml search result to JSON string
       xml2js.parseString(body, function (error, parsed){
         if (!!error){
           return onFound(error);
         }

         //check if there are any results matching search
         else if (parsed.GoodreadsResponse.search[0]['total-results'][0] === '0') {
           return onFound(null, []);
        }
         //create new, cleaner string of relevant result info and pass to callback
         onFound(null, parseWork(parsed.GoodreadsResponse.search[0].results[0].work));
       });
     });
   }
}

var parseWork = function (arrayOfWorks) {
  var listOfWorks =[];
  console.log(arrayOfWorks);
  for (var work of arrayOfWorks) {
    var workObject = {};
    workObject.workID = work.id[0]['_'];
    workObject.bookID = work.best_book[0].id[0]['_'];
    workObject.publicationYear = work.original_publication_year[0]['_'];
    workObject.title = work.best_book[0].title[0];
    workObject.author = work.best_book[0].author[0].name[0];
    listOfWorks.push(workObject);
  }
  return listOfWorks;
}

module.exports = {
  searchGoodreads: searchGoodreads,
  error:error
}
