var mongoose = require('mongoose');

//local modules
var cfg = require('../cfg.json');
var schema = require('./schemas.js')

/**
 * Opens connection to database and binds handlers
 */
function initialiseDbConnection(onDbInitialise) {
  mongoose.connect(cfg.DATABASE_URI);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', onDbInitialise);
}

/**
 * Searches by title whether issue and returns boolean
 */
var checkIssueExists = function(issueTitle, onCheck) {
  console.log('checking ' + issueTitle);
  schema.Issue.find({title:issueTitle}, function (error, docs) {
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
  var issue = new schema.Issue({title: issueObject.title, description:issueObject.description, relatedTags: issueObject.relatedTags});
  issue.save(function (error, issue, numAffected) {
    if (error) {
      onSave(error);
    }
    onSave(null, issue);
  });
}


module.exports = {
  initialiseDbConnection: initialiseDbConnection,
  checkIssueExists: checkIssueExists,
  addIssueToDb: addIssueToDb
}
