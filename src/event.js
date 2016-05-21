import { Observable } from 'rx'
import R from 'ramda'
import { characters } from './config'
import keycode from 'keycode'

const promptInput = document.querySelector('.promptInput')

function eventToObject(e) {
  return {
    key: keycode(e),
    time: e.timeStamp,
  }
}

function createCharObservable(element, event, char) {
  return Observable.fromEvent(element, event)
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

function charToDwell(element, char) {
  const keydown$ = createCharObservable(element, 'keydown', char)
  const keyup$ = createCharObservable(element, 'keyup', char)
  return createDwellTime(keydown$, keyup$)
}

// TODO: factor out zipping to own function
// TODO: can we make keystroke of the form ([key, elapsedTime])?

export const keystroke$ = characters.reduce(
  (acc$, char) => acc$.merge(charToDwell(promptInput, char)),
  Observable.empty()
)
console.log('mytest')
console.log(keystroke$)
