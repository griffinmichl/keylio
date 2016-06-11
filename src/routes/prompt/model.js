// TODO: refactor to immutable
// import { Map, List } from 'immutable'
import { Observable, DOM } from 'rx-dom'
import { characters } from '../../config'
import Word from './word'
import createKeyboard from '../../graphs/keyboardGraph'
import createTransitionGraph from '../../graphs/transitionGraph'

function create1DStore(chars) {
  return chars.reduce((store, char) => {
    store[char] = []
    return store
  }, {})
}

function create2DStore(chars) {
  return chars.reduce((store, char) => {
    store[char] = create1DStore(chars)
    return store
  }, {})
}

export default function model({ keystroke$, wordCount$, text$, transition$ }) {

  const finished$ = text$
    .map(text => text.split(' ').length)
    //.map(x => 5)
    .combineLatest(wordCount$)
    .filter(([words, count]) => words === count)
    .map(x => 1)

  const dwell$ = keystroke$
    .startWith(create1DStore(characters))
    .scan((store, keypress) => {
      store[keypress.key].push(keypress.dwell)
      return store
    })
    .skipUntil(finished$)
    .do(store => {
      DOM.ajax({
        url: '/api/dwell',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(store),
      }).subscribe(x => console.log(x))
    })
    .map(createKeyboard)
    .startWith(null)

  // TODO: highlight correct/incorrect words + letters
  const prompt$ = text$
    .map(text => text.split(' '))
    .combineLatest(wordCount$, (prompt, wordIndex) =>
      prompt.map((pWord, pIndex) =>
        Word({ word: pWord, key: pIndex, selected: pIndex === wordIndex })
      )
    )
    .takeUntil(finished$)

  const heatmap$ = transition$
    .startWith(create2DStore(characters))
    .scan((store, {from, to, time}) => {
      store[from][to].push(time)
      return store
    })
    .skipUntil(finished$)
    .map(createTransitionGraph)
    .startWith(null)

  return Observable.combineLatest(
    dwell$,
    prompt$,
    heatmap$,
    (keyboard, prompt, heatmap) => ({
      keyboard,
      prompt,
      heatmap,
    }),
  )
}
