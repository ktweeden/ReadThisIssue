var mongoose = require("mongoose");

var authorSchema = mongoose.Schema({
  name: String
});

//Models for each schema
var Author = mongoose.model('Author', authorSchema);

module.exports = {
  Author:Author
}
