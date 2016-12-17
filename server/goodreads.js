const mongoose = require('mongoose')
const xml2js = require('xml2js')
const cfg = require('../cfg.json')
const request = require('request-promise') //TODO install request-promise
const inputSanitation = require('./utils/input_sanitation')


function parseXmlPromise(xml){
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, function (error, parsed){
      if (!!error){
        return reject(error)
      }
      resolve(parsed)
    })
  })
}

/**
 * Searches goodreads database for a book given title or ISBN. Passes array of works found to callback.
 */
const searchGoodreads = function (bookIdentifyer, onFound) {

   if (!inputSanitation.inputSanitation(bookIdentifyer)) {
     throw new Error("Your search must contain letters a-z, numbers 1-0 and the characters - . , ! ?")
     //TODO push error message to page
   }

   const book = encodeURIComponent(bookIdentifyer)
   const searchUrl = `https://www.goodreads.com/search/index.xml?key=${cfg.GOODREADS_KEY}&q=${book}`

   //Send query to goodreads
   request.get(searchUrl)
   .then(body => {
     //parse goodreads xml search result to JSON string
     xml2js.parseString(body, function (error, parsed){
       if (!!error){
         return onFound(error)
       }
       //check if there are any results matching search
       if (parsed.GoodreadsResponse.search[0]['total-results'][0] === '0') {
         return onFound(null, [])
       }
       //create new, cleaner string of relevant result info and pass to callback
       onFound(null, parseWorks(parsed.GoodreadsResponse.search[0].results[0].work))
     })
   })
   .catch(onFound)
}

/*
 * Returns book info from Goodreads given Goodreads ID
 */
function getBookByGoodreadsID(goodreadsBookId, onFound) {
  const searchUrl = `https://www.goodreads.com/book/show/${goodreadsBookId}.xml?key=${cfg.GOODREADS_KEY}`

  //send query to goodreads
  request.get(searchUrl)
  .then(parseXmlPromise)
  .then(parseBook)
  .then(parsed => onFound(null, parsed))
  .catch(onFound)
}


/**
 * Create cleaned up array of 'work' objects from goodreads search response xml
 */
var parseWorks = function (arrayOfWorks) {
  var listOfWorks =[];
  for (var work of arrayOfWorks) {
    var workObject = {};
    workObject.workID = work.id[0]['_'];
    workObject.bookID = work.best_book[0].id[0]['_'];
    workObject.publicationYear = work.original_publication_year[0]['_'];
    workObject.title = work.best_book[0].title[0];
    workObject.author = work.best_book[0].author[0].name[0];
    workObject.cover = work.best_book[0].image_url[0];
    listOfWorks.push(workObject);
  }
  return listOfWorks;
}

/**
 * Create book object from goodreads book by ID response xml
 */
var parseBook = function (bookResponse) {
  var response = bookResponse.GoodreadsResponse.book[0];
  var book = {};
  book.title = response.title[0];
  book.author = response.authors[0].author[0].name[0];
  book.publicationYear = response.work[0].original_publication_year[0]['_'];
  book.description = response.description[0];
  book.cover = response.image_url[0];
  book.bookID = response.id[0];
  return book;
}

module.exports = {
  searchGoodreads: searchGoodreads,
  getBookByGoodreadsID: getBookByGoodreadsID,
  error:error
}
