import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import Prompt from './routes/prompt/index'
import About from './routes/about/index'
import Home from './routes/home/index'

function App(props) {
  return (
    <div className="container">
      <header className="row">
        <h1 className="col-12 title"><Link to="/">keylio</Link></h1>
        <h3 className="col-12 sub-title">discover your unique typing style</h3>
      </header>
      {props.children}
    </div>
  )
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/prompt" component={Prompt} />
      <Route path="/about" component={About} />
    </Route>
  </Router>
  ), document.querySelector('.app'))
