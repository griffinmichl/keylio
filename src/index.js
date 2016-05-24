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
