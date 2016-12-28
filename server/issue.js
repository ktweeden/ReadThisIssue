const mongoose = require('mongoose')

const issueSchema = mongoose.Schema({
  title: {type: String, unique: true},
  description: String,
  relatedTags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Issue'}]
});

const Issue = mongoose.model('Issue', issueSchema);


/**
 * Searches by title whether issue and returns boolean
 */
function checkIssueExists(issueTitle) {
  return (
    Issue.find({title:issueTitle})
    .then(docs => !!docs.length)
  )
}

/**
 * Adds issue to the database. Passes issue object to callback.
 */
function addIssueToDb (issueObject) {
  return new Issue({
    title: issueObject.title,
    description:issueObject.description,
    relatedTags: issueObject.relatedTags
  }).save()
}

module.exports = {
    Issue:Issue,
    checkExists: checkIssueExists,
    addToDb: addIssueToDb,
}
