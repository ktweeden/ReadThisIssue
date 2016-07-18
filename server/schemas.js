var mongoose = require("mongoose");

var authorSchema = mongoose.Schema({
  name: String
});

//Models for each schema
var Issue = mongoose.model('Issue', issueSchema);
var Author = mongoose.model('Author', authorSchema);

module.exports = {
  Book:Book,
  Issue:Issue,
  Author:Author
}
