const db = require('../db')

exports.incrementLetter = (char, time, cb) => {
  const collection = db.get().collection('dwell')
  const address = `times.${time}`
  collection
    .update({ character: char }, { $inc: { [address]: 1 } })
    .exec(cb)
}

exports.getAllLetters = (cb) => {
  const collection = db.get().collection('dwell')
  collection.find().toArray((err, result) => {
    if (err) {
      console.log('error retrieving', char)
      cb(err, null)
    } else {
      const countData = result.reduce((countObj, currentObj) => {
        const { character } = currentObj
        countObj[character] = createCountArray(currentObj)
        return countObj
      }, {})

      cb(null, countData)
    } 
  })
}

function createCountArray(obj) {
  const countArray = []
  const { times } = obj 

  for (let stamp in times) {
    countArray[parseInt(stamp, 10)] = times[stamp]
  }

  return countArray
}
