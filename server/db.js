const mongoose = require('mongoose')

//local modules
const cfg = require('../cfg.json')
const schema = require('./schemas.js')

/**
 * Opens connection to database and binds handlers
 */
function initialiseDbConnection(onDbInitialise) {
  mongoose.connect(cfg.DATABASE_URI)
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', onDbInitialise)
}

module.exports = {
  initialiseDbConnection: initialiseDbConnection,
}
