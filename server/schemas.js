const mongoose = require("mongoose")

const authorSchema = mongoose.Schema({
  name: String
})

//Models for each schema
const Author = mongoose.model('Author', authorSchema)

module.exports = {
  Author: Author
}
