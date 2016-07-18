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

module.exports = {
  initialiseDbConnection: initialiseDbConnection,
}
