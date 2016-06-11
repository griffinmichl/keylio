export default function About() {
  return (
    <article>
      <div className="row">
        <p className="offset-3 col-6">
          Everyone types differently.
          We dwell on some keys longer than others
          and transitions take different amounts of
          time between different keys.
        </p>
      </div>
      <div className="row">
        <p className="offset-3 col-6">
          kelio is an app that teaches users about
          their typing style. This is not another 'typing speed test'.
        </p>
      </div>
      <div className="row">
        <p className="offset-3 col-6">
          This app collects data on two main metrics:
          <ol>
            <li>Dwell Time - the time elapsed between an initial keydown and the keyup for a given key</li>
            <li>Transition time - the time between one keydown and the next for a given key</li>
          </ol>
        </p>
      </div>
      <div className="row">
        <p className="offset-3 col-6">
          kelio is built with cycle-react and d3.
        </p>
      </div>
    </article>
  )
}

