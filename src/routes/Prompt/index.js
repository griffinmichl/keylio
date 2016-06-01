import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import Cycle from 'cycle-react'
import intent from './intent'
import model from './model'
import view from './view'

const TryIt = Cycle.component('TryIt', function computer(interactions, props, self, lifecycles) {
  const intention = intent(interactions, lifecycles)
  const state$ = model(intention)
  return view(state$, interactions)

})

export default TryIt
