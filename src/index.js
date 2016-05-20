import { run } from '@cycle/core'
import { makeDOMDriver } from '@cycle/dom'
import { Observable } from 'rx'

function intent(DOM) {
  return {
  }
}

function model() {
  return {}
}

function view({ state$ }) {
  return div([
    h1('Keystroke Profiler'),
    div('.prompt', 'It was the...'),
    input('.input', { type: 'text', val: '' })
  ])

}

function main({ DOM }) {
  const actions = intent(DOM)
  const state$ = model(actions)
  return {
    DOM: view(state$)
  };
}

const drivers = {
  DOM: makeDOMDriver(document.querySelector('.app')),
}

run(main, drivers)

