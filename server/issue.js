const mongoose = require('mongoose');

const issueSchema = mongoose.Schema({
  title: {type: String, unique: true},
  description: String,
  relatedTags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Issue'}]
});

const Issue = mongoose.model('Issue', issueSchema);


/**
 * Searches by title whether issue and returns boolean
 */
const checkIssueExists = function(issueTitle, onCheck) {
  Issue.find({title:issueTitle}
  .then(docs => onCheck(null, !!docs.length))
  .catch(onCheck)
}

/**
 * Adds issue to the database. Passes issue object to callback.
 */
const addIssueToDb = function (issueObject, onSave) {
  new Issue({
    title: issueObject.title,
    description:issueObject.description,
    relatedTags: issueObject.relatedTags
  }).save(issue)
  .then(doc => onSave(null, doc))
  .catch(onSave)
}

module.exports = {
    Issue:Issue,
    checkExists: checkIssueExists,
    addToDb: addIssueToDb,
}
