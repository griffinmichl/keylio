import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import Cycle from 'cycle-react'
import classNames from 'classnames'
import keycode from 'keycode'
// TODO: look into smaller versions of rx
// and rx-dom once we know what methods we need
// import { Observable } from 'rx'
import { Observable, DOM } from 'rx-dom'
import intent from './intent'
import model from './model'

const Prompt = Cycle.component('Prompt', function computer(interactions, props, self, lifecycles) {
  const intention = intent(interactions, lifecycles)
  const state$ = model(intention)
  //return view(state$, interactions)

  return state$
    .map(([graph, prompt]) =>
      <div className="container">
        <header className="row">
          <h1 className="col-12 title">keylio</h1>
        </header>
        <div className="row top-buffer">
          <div className="offset-3 col-6 prompt">
            <div className="prompt-text">
              {prompt}
            </div>
            <div className="prompt-input">
              <input
                type="text"
                onKeyDown={interactions.listener('keydown')}
                onKeyUp={interactions.listener('keyup')}
              />
            </div>
          </div>
        </div>
      </div>
    )
})

export default Prompt

