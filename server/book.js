const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
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

const Book = mongoose.model('Book', bookSchema)


/**
 * Searches by ID whether book exists in db, and returns boolean
 */
const checkBookExists = function(goodreadsId, onCheck) {
  Book.find({goodreadsId:goodreadsId})
  .then(docs => onCheck(null, !!docs.length))
  .catch(onCheck)
}


/**
 * Adds book to the database.
 */
const addBookToDb = function (bookObject, onSave) {
  const book = new Book({
    title: bookObject.title,
    author:bookObject.author,
    publicationYear: bookObject.publicationYear,
    description: bookObject.description,
    rating: bookObject.rating,
    isbn: bookObject.isbn,
    imageURL: bookObject.imageURL,
    goodreadsURL: bookObject.goodreadsURL,
    issues: bookObject.issues,
    goodreadsId: bookObject.bookID
  });

  book.save()
  .then(book => onSave(null, book))
  .catch(onSave)
}

module.exports = {
    Book:Book,
    addToDb: addBookToDb,
    checkExists: checkBookExists
}
