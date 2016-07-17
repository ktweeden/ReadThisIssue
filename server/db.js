var mongoose = require('mongoose');

//local modules
var cfg = require('../cfg.json');
var schema = require('./schemas.js')

/**
 * Opens connection to database and binds handlers
 */
function initialiseDbConnection(onDbInitialise) {
  mongoose.connect(cfg.DATABASE_URI);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', onDbInitialise);
}

/**
 * Searches by title whether issue and returns boolean
 */
var checkIssueExists = function(issueTitle, onCheck) {
  console.log('checking ' + issueTitle);
  schema.Issue.find({title:issueTitle}, function (error, docs) {
    console.log(docs);
    if (error){
      onCheck(error);
    }
    else if(docs.length){
       onCheck(null, true);
    }
    else {
      onCheck(null, false);
    }
  });
}

/**
 * Adds issue to the database
 */
var addIssueToDb = function (issueObject, onSave) {
  var issue = new schema.Issue({title: issueObject.title, description:issueObject.description, relatedTags: issueObject.relatedTags});
  issue.save(function (error, issue, numAffected) {
    if (error) {
      onSave(error);
    }
    onSave(null, issue);
  });
}


/**
 * Searches by ID whether book exists in db, and returns boolean
 */
var checkBookExists = function(goodreadsId, onCheck) {
  console.log('checking ' + goodreadsId);
  schema.Book.find({goodreadsId:goodreadsId}, function (error, docs) {
    console.log(docs);
    if (error){
      onCheck(error);
    }
    else if(docs.length){
       onCheck(null, true);
    }
    else {
      onCheck(null, false);
    }
  });
}

/**
 * Adds book to the database
 */
var addBookToDb = function (bookObject, onSave) {
  var book = new schema.Book({
    title: bookObject.title,
    author:bookObject.author,
    publicationYear: bookObject.publicationYear,
    description: bookObject.description,
    rating: bookObject.rating,
    goodreadsId: bookObject.rating,
    isbn: bookObject.isbn,
    imageURL: bookObject.imageURL,
    goodreadsURL: bookObject.goodreadsURL,
    issues: bookObject.issues,
    goodreadsId: bookObject.bookID
  });
  book.save(function (error, book, numAffected) {
    if (error) {
      return onSave(error);
    }
    onSave(null, book);
  });
}


module.exports = {
  initialiseDbConnection: initialiseDbConnection,
  checkIssueExists: checkIssueExists,
  addIssueToDb: addIssueToDb,
  addBookToDb: addBookToDb,
  checkBookExists: checkBookExists
}
