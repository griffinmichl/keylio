import R from 'ramda'
import keycode from 'keycode'

export function getCharInRange(first, last) {
  const charactersInRange = R.compose(R.map(keycode), R.range)
  return charactersInRange(first, last)
}

export function median(nums) {
  const sortedNums = nums.slice().sort((a, b) => a - b)
  const middleIndex = Math.floor(sortedNums.length / 2)
  if (sortedNums.length % 2 === 0) {
    return (sortedNums[middleIndex - 1] + sortedNums[middleIndex]) / 2
  } else {
    return sortedNums[middleIndex]
  }
}

export function processPressTimes(obj) {
  return Object
    .keys(obj)
    .reduce((arr, key) => {
      if (typeof obj[key] === 'number') {
        return arr.concat({ key, value: obj[key] })
      } else {
        const value = median(obj[key]) || 0
        return arr.concat({ key, value })
      }
    }, [])
}

export function processTransitionTimes(obj) {
  return Object
    .keys(obj)
    .reduce((arr, fromKey) =>
      arr.concat(Object.keys(obj[fromKey])
        .reduce((fromArr, toKey) => {
          const value = median(obj[fromKey][toKey]) || 0
          fromArr.push({ fromKey, toKey, value })
          return fromArr
        }, [])
      )
    , [])
}
