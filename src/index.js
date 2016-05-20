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
import { Map, List, fromJS } from 'immutable'

// TODO: modify constants and getCharInRange to make model + intent pure
const FIRST_CHARCODE = 65
const LAST_CHARCODE = 91

function getCharInRange(first, last) {
  const charactersInRange = R.compose(R.map(keycode), R.range)
  return charactersInRange(first, last)
}

function charsToStorageObject(arr) {
  return arr.reduce((objectSoFar, arrayElement) => {
    objectSoFar[arrayElement] = []
    return objectSoFar
  }, {})
}

function createImmutableCharStore(first, last) {
  return R.compose(fromJS, charsToStorageObject, getCharInRange)(first, last)
}

function eventToObject(e) {
  return {
    key: keycode(e),
    time: e.timeStamp,
  }
}

function createCharObservable(DOM, event, char) {
  return DOM
    .select(':root')
    .events(event)
    .map(eventToObject)
    .filter(x => x.key === char)
}

function downUpTupleToDwell([down, up]) {
  return {
    key: down.key,
    dwell: up.time - down.time,
  }
}

function createDwellTime(keydown$, keyup$) {
  return Observable.zip(keydown$, keyup$)
    .map(downUpTupleToDwell) 
}

function charToDwell(DOM, char) {
  const keydown$ = createCharObservable(DOM, 'keydown', char)
  const keyup$ = createCharObservable(DOM, 'keyup', char)
  return createDwellTime(keydown$, keyup$)
}

function intent(DOM) {
  const chars = getCharInRange(FIRST_CHARCODE, LAST_CHARCODE)
  // TODO: factor out zipping to own function
  // TODO: can we make keystroke of the form ([key, elapsedTime])?

  const keystroke$ = chars.reduce(
    (acc$, char) => acc$.merge(charToDwell(DOM, char)),
    Observable.empty()
  )

  return {
    keystroke$,
  }
}

function model({ keystroke$ }) {
  // TODO: switch to immutable maps of lists for cleaner scanning
  const keyStrokeDataStore = createImmutableCharStore(FIRST_CHARCODE, LAST_CHARCODE)

  const dwellTime$ = keystroke$
    .startWith(keyStrokeDataStore)
    .scan((acc, cur) =>
      acc.map((val, key) => key === cur.key ? val.push(cur.dwell) : val)
    ).do(console.log.bind(console))

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

