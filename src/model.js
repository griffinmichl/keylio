// TODO: refactor to immutable
// import { Map, List } from 'immutable'
import { Observable } from 'rx'
import { characters } from './config'
import Word from './components/word'
import createDwellGraph from './graphs/dwellGraph'
import createKeyboard from './graphs/keyboardGraph'

function createStore(chars) {
  return chars.reduce((store, char) => {
    store[char] = []
    return store
  }, {})
}

export default function appModel({ keystroke$, word$, text$ }) {
  const dwell$ = keystroke$
    .do(x => console.log(x))
    .startWith(createStore(characters))
    .scan((store, keypress) => {
      store[keypress.key].push(keypress.dwell)
      return store
    })
    .map(createKeyboard)

  const prompt$ = text$
    .map(text => text
      .split(' ')
      .map((word, index) => Word({ word, key: index } )) 
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
