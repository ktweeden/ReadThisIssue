var mongoose = require("mongoose");

var bookSchema = mongoose.schema({
  title: String,
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
  goodreadsSynopsis: String,
  rating: Number,
  publicationYear: Number,

  goodreadsId: Number,
  isbn: String,

  imageURL: String,
  goodreadsURL: String,

  issues: [{
    description: String,
    issueId: {type: mongoose.Schema.Types.ObjectId, ref: 'Issue'},
    approved: {type: Boolean, default: false}
  }]

});

var issueSchema = mongoose.schema({
  title: String,
  description: String,
  relatedTags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Issue'}]
});

var authorSchema = mongoose.schema({
  name: String
});

//Models for each schema
var Book = mongoose.model('Book', bookSchema);
var Issue = mongoose.model('Issue', issueSchema);
var Author = mongoose.model('Author', authorSchema);
