const db = require('./db')

function range(a, b, arr = []) {
  if (a === b) {
    return arr
  }
  return range(a+1, b, arr.concat(a))
}

const rangeObject = range(0, 1000)
  .reduce((obj, num) => {
    obj[num] = 0
    return obj
  }, {})

const initialData = range('a'.charCodeAt(0), 'z'.charCodeAt(0) + 1)
  .map(code => String.fromCharCode(code))
  .reduce((charArr, nextChar) =>
    charArr.concat({ character: nextChar, times: rangeObject })
  , [])

db.connect((err) => {
  const collection = db.get().collection('dwell')
  collection.drop()
  collection.insert(initialData, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('data initialized')
    }
    db.close(() => console.log('done'))
  })
})
