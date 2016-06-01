import Cycle from 'cycle-react'
import keycode from 'keycode'

const Prompt = Cycle.component('Prompt', function (interactions, props) {
  const input$ = interactions.get('change')
    .map(ev => ev.target.value)
    .map(txt => txt.endsWith(' ') ? '' : txt)
    .startWith('')

  const vtree$ = props
    .get('content')
    .combineLatest(input$)
    .map(([content, input]) =>
      <div className="row">
        <div className="offset-3 col-6 prompt">
          <div className="prompt-text">
            {content}
          </div>
          <div className="prompt-input">
            <input
              type="text"
              value={input}
              placeholder="type word here"
              onChange={interactions.listener('change')}
              onKeyDown={interactions.listener('keydown')}
              onKeyUp={interactions.listener('keyup')}
            />
          </div>
        </div>
      </div>
    )

  return {
    view: vtree$,
    events: {
      keydown: interactions.get('keydown'),
      keyup: interactions.get('keyup'),
    },
  }
});

export default Prompt

