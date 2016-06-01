import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import Prompt from './routes/Prompt/index'
import Cycle from 'cycle-react'
import classNames from 'classnames'
import keycode from 'keycode'
// TODO: look into smaller versions of rx
// and rx-dom once we know what methods we need
// import { Observable } from 'rx'
import { Observable, DOM } from 'rx-dom'
import createKeyboard from './graphs/keyboardGraph'

const Home = Cycle.component('Home', function computer(interactions, props, self, lifecycles) {
  const windowSize$ = Observable.fromEvent(window, 'resize')
    .map(ev => ({
      height: ev.target.innerHeight,
      width: ev.target.innerWidth,
    }))
    .throttle(50)
    .startWith({ 
      height: window.innerHeight,
      width: window.innerWidth,
    })

  const componentDidMount$ = lifecycles.componentDidMount
  const graph$ = componentDidMount$
    .flatMap(() => DOM.get('/api/keyboard'))
    .map(data => JSON.parse(data.response))
    .combineLatest(windowSize$, createKeyboard)

  return graph$
    .map(graph => 
      <div className="container">
        <header className="row">
          <h1 className="col-12 title">keylio</h1>
          <h3 className="col-12 sub-title">discover your unique typing style</h3>
        </header>
        <div className="row">
          <div className="keyboard-container">{graph}</div>
        </div>
        <div className="row top-buffer">
          <Link className="offset-3 col-2 btn btn-main" to="/prompt">Try It!</Link>
          <Link className="offset-2 col-2 btn btn-main" to="/prompt">About</Link>
        </div>
      </div>
    )
})

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Home} />
    <Route path="/prompt" component={Prompt} />
  </Router>
  ), document.querySelector('.app'))

