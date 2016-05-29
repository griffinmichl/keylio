import classNames from 'classnames'

function Word({ word, key, selected }) {
  const wordClass = classNames({
    'word': true,
    'selected': !!selected,
  })
  return <span key={key} className={wordClass}>{word}</span>
}

export default Word
