function median(counts) {
  let left = 0
  let right = counts.length - 1
  while (left <= right) {
    if (counts[left] > 0) {
      counts[left]--
    }

    if (counts[right] > 0) {
      counts[right]--
    }

    if (counts[left] === 0) {
      left++
    }
    if (counts[right] === 0) {
      right--
    }
  } 

  if (left === right) {
    return left
  } else {
    return (left + right) / 2
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

