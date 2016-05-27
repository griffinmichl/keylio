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
import createKeyboard from './graphs/keyboardGraph'

const Root = Cycle.component('Root', function computer(interactions, props, self, lifecycles) {
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
      </div>
    )
})

// function App(props) {
//   return (
//     <div>
//       <nav className="row">
//         <Link className="col-3" to="/">Keystroke Profiler</Link>
//         <Link activeClassName="active" className="col-1" to="/about">About</Link>
//         <Link activeClassName="active" className="col-1" to="/message">Message</Link>
//       </nav>
//       {props.children}
//     </div>
//   )
// }
//
//
// function About(props) {
//   return <h3>About</h3>
// }
//
// function Message(props) {
//   return <h5>Message</h5>
// }
//
// ReactDOM.render((
//   <Router history={browserHistory}>
//     <Route path="/" component={App}>
//       <Route path="/home" component={Home} />
//       <Route path="/about" component={About} />
//       <Route path="/message" component={Message} />
//     </Route>
//   </Router>
//   ), document.querySelector('.app')

ReactDOM.render(<Root />, document.querySelector('.app'))
