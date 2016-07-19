var mongoose = require('mongoose');

var issueSchema = mongoose.Schema({
  title: {type: String, unique: true},
  description: String,
  relatedTags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Issue'}]
});

var Issue = mongoose.model('Issue', issueSchema);


/**
 * Searches by title whether issue and returns boolean
 */
var checkIssueExists = function(issueTitle, onCheck) {
  console.log('checking ' + issueTitle);
  Issue.find({title:issueTitle}, function (error, docs) {
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
  var issue = new Issue({title: issueObject.title, description:issueObject.description, relatedTags: issueObject.relatedTags});
  issue.save(function (error, issue, numAffected) {
    if (error) {
      onSave(error);
    }
    onSave(null, issue);
  });
}

module.exports = {
    Issue:Issue,
    checkExists: checkIssueExists,
    addToDb: addIssueToDb,
}
