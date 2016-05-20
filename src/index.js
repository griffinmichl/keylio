import { run } from '@cycle/core'
import {
  makeDOMDriver,
  div,
  h1,
  input,
} from '@cycle/dom'
import { Observable } from 'rx'
import keycode from 'keycode'
import R from 'ramda'

const FIRST_CHARCODE = 65
const LAST_CHARCODE = 91

function getCharInRange(first, last) {
  const charactersInRange = R.compose(R.map(keycode), R.range)
  return charactersInRange(first, last)
}

function arrayToStorageObject(arr) {
  return arr.reduce((objectSoFar, arrayElement) => {
    objectSoFar[arrayElement] = []
    return objectSoFar
  }, {})
}

function eventToObject(e) {
  return {
    key: keycode(e),
    time: e.timeStamp,
  }
}

function eventObjIsChar({ key }) {
  const firstLetter = 'a'
  const lastLetter = 'z' 
  return key.length === 1 &&
         key >= firstLetter &&
         key <= lastLetter
}


function intent(DOM) {
  const chars = getCharInRange(FIRST_CHARCODE, LAST_CHARCODE)
  // TODO: factor out zipping to own function
  // TODO: can we make keystroke of the form ([key, elapsedTime])?
  const keystroke$ = chars.reduce((acc$, char) => 
    acc$.merge(Observable.zip(
      DOM
        .select(':root')
        .events('keydown')
        .map(eventToObject)
        .filter(obj => obj.key === char),
      DOM
        .select(':root')
        .events('keyup')
        .map(eventToObject)
        .filter(obj => obj.key === char)
  )), Observable.empty())

  return {
    keystroke$,
  }
}

function dwellTimeFromKeystroke(keystroke) {
  return {
    key: keystroke[0].key,
    dwell: keystroke[1].time - keystroke[0].time
  }
}

function model({ keystroke$ }) {
  // TODO: switch to immutable maps of lists for cleaner scanning
  const keyStrokeDataStore = 
    R.compose(arrayToStorageObject, getCharInRange)(FIRST_CHARCODE, LAST_CHARCODE)

  const dwellTime$ = keystroke$
    .map(dwellTimeFromKeystroke)
    .startWith(keyStrokeDataStore)
    .scan((acc, cur) => {
      acc[cur.key] = acc[cur.key].concat(cur.dwell)
      return acc
    }).do(console.log.bind(console))

  return {
    state$: dwellTime$, 
  }
}

function view({ state$ }) {
  return state$.startWith(null).map(() => 
    div([
      h1('Keystroke Profiler'),
      div('.prompt', 'It was the...'),
      input('.input', { type: 'text', val: '' })
    ])
  )
}

function main({ DOM }) {
  const actions = intent(DOM)
  const state$ = model(actions)
  return {
    DOM: view(state$)
  }
}

const drivers = {
  DOM: makeDOMDriver(document.querySelector('.app')),
}

run(main, drivers)

