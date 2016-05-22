import React from 'react'
import ReactDOM from 'react-dom'
import Cycle from 'cycle-react'
import keycode from 'keycode'
// TODO: look into smaller versions of rx
// and rx-dom once we know what methods we need
//import { Observable } from 'rx'
import { Observable, DOM } from 'rx-dom'
import intent from './intent'
import model from './model'
import createDwellGraph from './dwellGraph'
import Word from './components/word'

const Root = Cycle.component('Root', function computer(interactions, props, self, lifecycles) {
  const intention = intent(interactions, lifecycles)
  const state$ = model(intention)
  //return view(state$, interactions)

  return state$
    .map(([graph, prompt]) =>
      <div className="container">
        <header className="row">
          <h1 className="col-12 title">Keystroke Profiler</h1>
        </header>
        <div className="row">
          <div className="offset-3 col-6 prompt">{prompt}</div>
        </div>
        <div className="row">
          <input
            className="offset-3 col-6 promptInput"
            type="text"
            onKeyDown={interactions.listener('keydown')}
            onKeyUp={interactions.listener('keyup')}
          />
        </div>
        <div>{graph.toReact()}</div>
      </div>
    )
})

ReactDOM.render(
  <Root />,
  document.querySelector('.app')
)
