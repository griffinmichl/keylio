import Cycle from 'cycle-react'

const Prompt = Cycle.component('Prompt', function (interactions, props) {
  const vtree$ = props
    .get('content')
    .map(content =>
      <div className="row">
        <div className="offset-3 col-6 prompt">
          <div className="prompt-text">
            {content}
          </div>
          <div className="prompt-input">
            <input
              type="text"
              placeholder="type words here"
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

