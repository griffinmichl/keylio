function median(counts) {
  let left = 0
  let right = counts.length - 1
  
  const allZeros = counts
    .reduce((bool, num) => num === 0 & bool, true)

  if (allZeros) {
    return 0
  } 

  let prevLeft = 0
  let prevRight = 0 
  while (left < right) {
    prevLeft = left
    prevRight = right

    while (counts[left] === 0) {
      left++
    }

    while (counts[right] === 0) {
      right--
    }
    
    counts[left]--
    counts[right]--
  } 

  if (left === right) {
    return left
  } else {
    return (prevLeft + prevRight) / 2
  }
}

function mean(counts) {
  const sum = counts
    .map((count, val) => count * val)
    .reduce((a, b) => a + b)

  const size = counts
    .reduce((a, b) => a + b)

  return sum / size
}

module.exports = {
  median,
  mean,
}

