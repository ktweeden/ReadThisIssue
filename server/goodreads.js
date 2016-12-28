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
function searchGoodreads(bookIdentifyer) {

   if (!inputSanitation.inputSanitation(bookIdentifyer)) {
     return Promise.reject(new Error("Your search must contain letters a-z, numbers 1-0 and the characters - . , ! ?"))
   }

   const book = encodeURIComponent(bookIdentifyer)
   const searchUrl = `https://www.goodreads.com/search/index.xml?key=${cfg.GOODREADS_KEY}&q=${book}`

   //Send query to goodreads
   return (request.get(searchUrl)
   .then(parseXmlPromise)
   .then(parsed => {
     //check if there are any results matching search
     if (parsed.GoodreadsResponse.search[0]['total-results'][0] === '0') {
       return []
     }
     //create new, cleaner string of relevant result info and pass to callback
     return parseWorks(parsed.GoodreadsResponse.search[0].results[0].work)
   }))
}


/*
 * Returns book info from Goodreads given Goodreads ID
 */
function getBookByGoodreadsID(goodreadsBookId) {
  const searchUrl = `https://www.goodreads.com/book/show/${goodreadsBookId}.xml?key=${cfg.GOODREADS_KEY}`

  return (
    request.get(searchUrl)
    .then(parseXmlPromise)
    .then(parseBook)
  )
}



/**
 * Create cleaned up array of 'work' objects from goodreads search response xml
 */
function parseWorks(arrayOfWorks) {

  return arrayOfWorks.map(work => ({
    workID: work.id[0]['_'],
    bookID: work.best_book[0].id[0]['_'],
    publicationYear: work.original_publication_year[0]['_'],
    title: work.best_book[0].title[0],
    author: work.best_book[0].author[0].name[0],
    cover: work.best_book[0].image_url[0]
  })
}

/**
 * Create book object from goodreads book by ID response xml
 */
function parseBook(bookResponse) {
  const response = bookResponse.GoodreadsResponse.book[0]
  return {
    title: response.title[0],
    author: response.authors[0].author[0].name[0],
    publicationYear: response.work[0].original_publication_year[0]['_'],
    description: response.description[0],
    cover: response.image_url[0],
    bookID: response.id[0]
  }
}

module.exports = {
  searchGoodreads: searchGoodreads,
  getBookByGoodreadsID: getBookByGoodreadsID,
}
