import { Observable } from 'rx'
import R from 'ramda'
import { characters } from './config'
import keycode from 'keycode'
import { DOM } from 'rx-dom'

function getDwellTime([down, up]) {
  return {
    key: down.key,
    dwell: up.time - down.time,
  }
}

function parseKeyEvent(e) {
  return {
    key: keycode(e),
    time: e.timeStamp,
  }
}


export default function intent(interactions, lifecycles) {
  const keyup$ = interactions
    .get('keyup')
    .map(parseKeyEvent)

  const keydown$ = interactions
    .get('keydown')
    .map(parseKeyEvent)
    .distinctUntilChanged(ev => ev.key)
    .takeUntil(keyup$).repeat()

  const keydown1$ = interactions
    .get('keydown')
    .map(parseKeyEvent)
    .distinctUntilChanged(ev => ev.key)
  keydown1$.subscribe(x => console.log('keydown', x))

  const keystroke$ = characters.reduce((acc$, char) =>
    acc$.merge(Observable.zip(
      keydown$
        .filter(ev => ev.key === char),
      keyup$
        .filter(ev => ev.key === char)
    )), Observable.empty())
    .do(console.log.bind(console))
    .map(getDwellTime)
/*
  const char$ = keyup$
    .map(keycode)
    .filter(char => characters.includes(char))

  const space$ = keyup$
    .map(keycode)
    .filter(char => char === 'space')

  const word$ = char$.buffer(() => space$)

*/

  const componentDidMount$ = lifecycles.componentDidMount
  const text$ = componentDidMount$
    .flatMap(() => DOM.get('/api/prompt'))
    .map(data => data.response)
    .startWith('')

  return {
    keystroke$,
    text$,
  }
}

/*
function isChar(key) {
  return characters.includes(key);
}

function isSpace(key) {
  return key === 'space'
}

const keyup$ = Observable
  .fromEvent(promptInput, 'keyup')
  .map(keycode)

export const char$ = keyup$.filter(isChar)
export const space$ = keyup$.filter(isSpace)

export const word$ = char$
  .buffer(() => space$)
  .map(listOfChar => listOfChar.join(''))
*/
