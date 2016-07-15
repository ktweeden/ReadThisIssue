var mongoose = require('mongoose');
var xml2js = require('xml2js');
var cfg = require('../cfg.json');

/**
 * Searches goodreads database for a book given title or ISBN.
 */

 var searchGoodreads = function (bookIdentifyer, onFound) {

   //TODO Make sure bookIdentifyer is sanitised (make input validation on front and back?)

   var searchUrl = "https://www.goodreads.com/search/index.xml?key=" + cfg.GOODREADS_KEY + "&q=" + bookIdentifyer;

   onFound;
 }
