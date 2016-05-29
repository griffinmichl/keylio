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

export default function appModel({ keystroke$, wordCount$, text$ }) {
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

/*
  const promptWord$ = text$
    .flatMap(text => Observable.from(text.split(' '))

  const classedWord$ = promptWord$
    .withLatestFrom(word$, (promptWord, typedWord) => {
                     
    })
*/   
  return dwell$.combineLatest(prompt$)
}
