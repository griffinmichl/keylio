import { Observable } from 'rx'
import R from 'ramda'
import { characters } from '../../config'
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

  // match keyups with keydowns to determine dwell time
  const keystroke$ = characters.reduce((acc$, char) =>
    acc$.merge(Observable.zip(
      keydown$
        .filter(ev => ev.key === char),
      keyup$
        .filter(ev => ev.key === char)
    )), Observable.empty())
    .map(getDwellTime)

  const componentDidMount$ = lifecycles.componentDidMount
  const text$ = componentDidMount$
    .flatMap(() => DOM.get('/api/prompt'))
    .map(data => data.response)
    .startWith('')
/*
  const char$ = interactions
    .get('keyup')
    .map(keycode)
    .filter(char => characters.includes(char))
*/

  const wordCount$ = interactions
    .get('keyup')
    .map(keycode)
    .filter(char => char === 'space')
    .map((_, i) => i + 1)
    .startWith(0)

/*
  const word$ = char$
    .buffer(() => space$)
    .map((chars, index) => ({
      index,
      word: chars.join(''),
    }))
*/

  return {
    keystroke$,
    text$,
    wordCount$,
  }
}

