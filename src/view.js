import Cycle from 'cycle-react'
import { Observable } from 'rx'

const Graph = Cycle.component('App', (interactions) => {
  const keydown$ = interactions.get('keydown')
  const keyup$ = interactions.get('keyup')
  return {
    view: Observable.just(
      <div className='container'
           onKeyDown={ interactions.listener('keydown') }
           onKeyUp={ interactions.listener('keyup') }>
      </div> 
    ),
    events: {
      keydown$,
      keyup$,
    },
  }
})


function appView(item$, interactions) {
  return item$.map(function renderElements(itemsData) {
    return <div>Test</div>
  })
}

export default appView
