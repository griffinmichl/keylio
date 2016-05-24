import R from 'ramda'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'
import { processPressTimes, median } from '../util'

export default function generateKeyboard(pressTimes) {
  const margin = {top: 50, right: 0, bottom: 100, left: 30}
  const height = 600
  const width = 960
  //const width = d3.select('#keyboard')[0][0].clientWidth - margin.left - margin.right
  //const height = d3.select('#keyboard')[0][0].clientWidth * 0.98 - margin.top - margin.bottom
  const gridSize = Math.floor(height / 10) //10 keys map for simple version
  // const legendElementHeight = gridSize*3
  // const buckets = 9 //number of color buckets. TODO: increase, update color scheme
  const colors = ['#ffffcc','#c7e9b4','#7fcdbb','#41b6c4','#2c7fb8','#253494']
  // const characters = _.range(65, 91).map(charCode => String.fromCharCode(charCode))
  // const charHash = characters.reduce((hash, char) => {
  //   hash[char] = true
  //   return hash
  // }, {})
  const keyVals = [{key: 'q', row: 0, col: 0},
                    {key: 'w', row: 0, col: 1},
                    {key: 'e', row: 0, col: 2},
                    {key: 'r', row: 0, col: 3},
                    {key: 't', row: 0, col: 4},
                    {key: 'y', row: 0, col: 5},
                    {key: 'u', row: 0, col: 6},
                    {key: 'i', row: 0, col: 7},
                    {key: 'o', row: 0, col: 8},
                    {key: 'p', row: 0, col: 9},
                    {key: 'a', row: 1, col: 0},
                    {key: 's', row: 1, col: 1},
                    {key: 'd', row: 1, col: 2},
                    {key: 'f', row: 1, col: 3},
                    {key: 'g', row: 1, col: 4},
                    {key: 'h', row: 1, col: 5},
                    {key: 'j', row: 1, col: 6},
                    {key: 'k', row: 1, col: 7},
                    {key: 'l', row: 1, col: 8},
                    {key: 'z', row: 2, col: 0},
                    {key: 'x', row: 2, col: 1},
                    {key: 'c', row: 2, col: 2},
                    {key: 'v', row: 2, col: 3},
                    {key: 'b', row: 2, col: 4},
                    {key: 'n', row: 2, col: 5},
                    {key: 'm', row: 2, col: 6}]

  const processedPressTimes = processPressTimes(pressTimes)

  const fauxKeyboard = ReactFauxDOM.createElement('div')
  const svg = d3
    .select(fauxKeyboard)
    .append('svg')
    .attr('class', 'transitionChart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const colorScale = d3.scale
    .quantile()
    .domain([d3.min(processedPressTimes, d => d.value), d3.max(processedPressTimes, d => d.value)])
    .range(colors)

  const keys = svg
    .selectAll('.key')
    .data(keyVals, d => `${d.row}: ${d.col}`)
    .enter()
    .append('g')
    .attr('transform', d => {
      return `translate(${d.col * gridSize + d.row * gridSize * 0.35}, ${d.row * gridSize})`
    })

  keys.append('rect')
      .attr('width', gridSize)
      .attr('height', gridSize)
      .style('fill', d => {
        const times = pressTimes[d.key]
        return times.length > 0 ? colorScale(median(times)) : 'white'
      })
      .style('stroke', 'black')

  keys.append('text')
      .attr('x', gridSize / 2)
      .attr('y', gridSize / 2)
      .text(d => d.key)

  return fauxKeyboard
}
