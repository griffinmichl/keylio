function view(state$, interactions) {
  return state$
    .map(([graph, prompt]) =>
      <div className="container">
        <header className="row">
          <h1 className="col-12 title">keylio</h1>
          <h3 className="col-12 sub-title">discover your unique typing style</h3>
        </header>
        <div className="row">
          <div className="offset-3 col-6 prompt">
            <div className="prompt-text">
              {prompt}
            </div>
            <div className="prompt-input">
              <input
                type="text"
                placeholder="type the words here"
                onKeyDown={interactions.listener('keydown')}
                onKeyUp={interactions.listener('keyup')}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <p className="offset-2 col-8 sub-title top-buffer">
            when you finish the prompt, we'll automatically generate your stats
          </p>
        </div>
      </div>
    )
}

export default view
