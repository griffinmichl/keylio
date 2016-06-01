const db = require('./db')

function range(a, b, arr = []) {
  if (a === b) {
    return arr
  }
  return range(a+1, b, arr.concat(a))
}

function combinations(arr) {
  return arr
    .reduce((allCombos, from) =>
      allCombos.concat(
        arr.reduce((curCombos, to) => curCombos.concat(`${from}.${to}`), [])
      )
    , [])
}

const rangeObject = range(0, 1000)
  .reduce((obj, num) => {
    obj[num] = 0
    return obj
  }, {})

const initialDwellData = range('a'.charCodeAt(0), 'z'.charCodeAt(0) + 1)
  .map(code => String.fromCharCode(code))
  .reduce((charArr, nextChar) =>
    charArr.concat({ character: nextChar, times: rangeObject })
  , [])

const characterCombinations = combinations(range('a'.charCodeAt(0), 'z'.charCodeAt(0) + 1)
  .map(code => String.fromCharCode(code)))

const initialTransitionData = characterCombinations
  .map(combo => ({ characters: combo, times: rangeObject }))

db.connect((err) => {
  const dwell_collection = db.get().collection('dwell')
  dwell_collection.drop()
  dwell_collection.insert(initialDwellData, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('dwell data initialized')
      const transition_collection = db.get().collection('transition')
      transition_collection.drop()
      transition_collection.insert(initialTransitionData, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('transition data initialized')
          db.close(() => console.log('done'))
        }          
      })
    }
  })
})
