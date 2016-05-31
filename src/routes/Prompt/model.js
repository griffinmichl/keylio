// TODO: refactor to immutable
// import { Map, List } from 'immutable'
import { Observable } from 'rx'
import { characters } from '../../config'
import Word from './word'

function createStore(chars) {
  return chars.reduce((store, char) => {
    store[char] = []
    return store
  }, {})
}

export default function model({ keystroke$, wordCount$, text$ }) {
  const dwell$ = keystroke$
    .startWith(createStore(characters))
    .scan((store, keypress) => {
      store[keypress.key].push(keypress.dwell)
      return store
    })

  // TODO: highlight correct/incorrect words + letters
  const prompt$ = text$
    .map(text => text.split(' '))
    .combineLatest(wordCount$, (prompt, wordIndex) =>
      prompt.map((pWord, pIndex) =>
        Word({ word: pWord, key: pIndex, selected: pIndex === wordIndex })
      )
    )

  return dwell$.combineLatest(prompt$)
}
