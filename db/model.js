const db = require('./db')

// TODO: customize update callbacks to handle errors better
exports.incrementLetter = (char, time, cb) => {
  const collection = db.get().collection('dwell')
  const address = `times.${time}`

  collection
    .update({ character: char }, { $inc: { [address]: 1 } }, cb)
}

exports.incrementTransition = (from, to, time, cb) => {
  const collection = db.get().collection('transition')
  const transitionChars = `${from}.${to}`
  const address = `times.${time}`

  collection
    .update({ characters: transitionChars }, { $inc: { [address]: 1 } }, cb)
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

exports.getAllTransitions = (db) => {
  const collection = db.get().collection('transition')
  collection.find().toArray((err, result) => {
    if (err) {
      console.log('error retrieving', char)
      cb(err, null)
    } else {
      const countData = result.reduce((countObj, currentObj) => {
        const { characters } = currentObj
        const from = characters.split[0]
        const to = characters.split[1]
        if (!countObj.hasOwnProperty(from)) {
          countObj[from] = {}  
        }
        countObj[from][to] = createCountArray(currentObj)
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
