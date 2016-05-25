const db = require('../db')

exports.increment = (char, time, cb) => {
  const collection = db.get().collection('dwell')
  const address = `times.${time}`
  collection
    .update({ character: char }, { $inc: { [address]: 1 } })
    .exec(cb)
}

exports.getLetter = (char, cb) => {
  const collection = db.get().collection('dwell')
  collection.findOne({ character: char }, (err, result) => {
    if (err) {
      console.log('error retrieving', char)
    } else {
      const resultsArray = []
      const { times } = result
      for (let key in times) {
        resultsArray[parseInt(key, 10)] = times[key]
      }
      cb(resultsArray)
    } 
  })
}
