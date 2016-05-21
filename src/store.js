import { Map, List, fromJS } from 'immutable'
import R from 'ramda'
import { characters } from './config'
import { keystroke$ } from './event'

function charsToStorageObject(arr) {
  return arr.reduce((objectSoFar, arrayElement) => {
    objectSoFar[arrayElement] = []
    return objectSoFar
  }, {})
}

function createImmutableCharStore(chars) {
  return R.compose(fromJS, charsToStorageObject)(chars)
}

const keyStrokeDataStore = createImmutableCharStore(characters)

const dwellTime$ = keystroke$
  .startWith(keyStrokeDataStore)
  .scan((acc, cur) =>
    acc.map((val, key) => key === cur.key ? val.push(cur.dwell) : val)
  )

dwellTime$.subscribe(console.log.bind(console))
