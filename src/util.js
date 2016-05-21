import R from 'ramda'
import keycode from 'keycode'

export function getCharInRange(first, last) {
  const charactersInRange = R.compose(R.map(keycode), R.range)
  return charactersInRange(first, last)
}
