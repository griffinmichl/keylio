const { MongoClient } = require('mongodb')
const url = require('./config/config')

const state = {
  db: null,
}

function connect(done) {
  if (state.db) {
    return done()
  }

  MongoClient.connect(url, (err, db) => {
    if (err) return done(err)
    state.db = db
    done()
  })
}

function get() {
  return state.db
}

function close(done) {
  if (state.db) {
    state.db.close((err, result) => {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}

module.exports = {
  connect,
  get,
  close,
}
