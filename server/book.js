var mongoose = require("mongoose");

var bookSchema = mongoose.Schema({
  title: String,
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
  description: String,
  rating: Number,
  publicationYear: Number,

  goodreadsId: Number,
  isbn: String,

  imageURL: String,
  goodreadsURL: String,

  issues: [{
    title: String,
    description: String,
    issueId: {type: mongoose.Schema.Types.ObjectId, ref: 'Issue'},
    approved: {type: Boolean, default: false}
  }]

});

var Book = mongoose.model('Book', bookSchema);


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
    Book:Book,
    addBookToDb: addBookToDb,
    checkBookExists: checkBookExists
}
