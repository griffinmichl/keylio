import R from 'ramda'
import keycode from 'keycode'

export function getCharInRange(first, last) {
  const charactersInRange = R.compose(R.map(keycode), R.range)
  return charactersInRange(first, last)
}

export function textToSpan(text, cls) {
  const textNode = document.createTextNode(text)
  const span = document.createElement('span')
  if (cls) {
    span.classList.add(cls)
  }
  span.appendChild(textNode)
  return span
}

export function getNodeIndex(node) {
  return Array.from(node.parentNode.children).indexOf(node)
}

export function focusSpan(node) {
  node.classList.add('selected')
  const chars = node.innerHTML.split('')
  node.innerHTML = ''
  chars
    .map(char => textToSpan(char))
    .forEach(span => node.appendChild(span))
}

