import Prompt from './prompt'

function view(state$, interactions) {
  return state$
    .map(({keyboard, prompt, heatmap}) =>
      <div>
        <div>
          {keyboard === null ? <Prompt content={prompt} keydown={interactions.listener('keydown')} keyup={interactions.listener('keyup')} /> : keyboard}
        </div>
        <div>
          {heatmap === null ? '' : heatmap}
        </div>
        <div className="row">
          <p className="offset-2 col-8 sub-title top-buffer">
            You can view your stats by finishing the prompt or pressing `enter`
          </p>
        </div>
      </div>
    )
}

export default view
