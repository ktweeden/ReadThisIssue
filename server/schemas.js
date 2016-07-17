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

var issueSchema = mongoose.Schema({
  title: {type: String, unique: true},
  description: String,
  relatedTags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Issue'}]
});

var authorSchema = mongoose.Schema({
  name: String
});

//Models for each schema
var Book = mongoose.model('Book', bookSchema);
var Issue = mongoose.model('Issue', issueSchema);
var Author = mongoose.model('Author', authorSchema);

module.exports = {
  Book:Book,
  Issue:Issue,
  Author:Author
}
