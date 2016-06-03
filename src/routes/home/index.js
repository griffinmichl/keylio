import Cycle from 'cycle-react'
import classNames from 'classnames'
import keycode from 'keycode'
// TODO: look into smaller versions of rx
// and rx-dom once we know what methods we need
import { Observable, DOM } from 'rx-dom'
import { Link } from 'react-router'
import createKeyboard from '../../graphs/keyboardGraph'

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
      <div>
        <div className="row">
          <div className="keyboard-container">{graph}</div>
        </div>
        <div className="row top-buffer">
          <Link className="offset-3 col-2 btn btn-main" to="/prompt">Try It!</Link>
          <Link className="offset-2 col-2 btn btn-main" to="/about">About</Link>
        </div>
      </div>
    )
})

export default Home
