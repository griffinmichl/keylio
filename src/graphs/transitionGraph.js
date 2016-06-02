import { processTransitionTimes } from '../util'
import { characters } from '../config'
import ReactFauxDOM from 'react-faux-dom'

export default function generateTransitionGraph(data) {
  const margin = {top: 50, right: 0, bottom: 100, left: 30}
  const width = 500
  const height = 500
  //const width = d3.select('#transitionChart')[0][0].clientWidth - margin.left - margin.right
  //const height = d3.select('#transitionChart')[0][0].clientWidth * 0.98 - margin.top - margin.bottom
  const gridSize = Math.floor(height / 26)
  const legendElementHeight = gridSize*3
  const buckets = 9 //number of color buckets. TODO: increase, update color scheme
  const colors = ['#ffffcc','#c7e9b4','#7fcdbb','#41b6c4','#2c7fb8','#253494']

  const transitionData = processTransitionTimes(data)

  const fauxTransitionGraph = ReactFauxDOM.createElement('svg')

  const svg = d3
    .select(fauxTransitionGraph)
    .attr('class', 'transition-graph')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const xlabels = svg.selectAll('.xlabel')
    .data(characters)
    .enter()
    .append('text')
    .attr('class', d => 'row-' + d) //currently unnecessary
    .classed('xlabel', true)
    .text(d => d)
    .attr('x', 0)
    .attr('y', (d, i) => i * gridSize)
    .style('text-anchor', 'middle')
    .attr('transform', `translate(-6, ${gridSize / 1.5})`)

  const yName = svg.append('text')
    .attr('text-anchor', 'end')
    .attr('transform', `translate(${width / 2}, ${-(margin.top/2)})`)
    .style('font-size', '16')
    .text('Transition Time')


  const ylabels = svg.selectAll('.ylabel')
    .data(characters)
    .enter()
    .append('text')
    .attr('class', d => 'col-' + d)
    .classed('ylabel', true)
    .text(d => d)
    .attr('x', (d, i) => i * gridSize)
    .attr('y', 0)
    .style('text-anchor', 'middle')
    .attr('transform', `translate(${gridSize / 2}, -6)`)

  //todo: ensure domain is correct
  const colorScale = d3.scale
    .quantile()
    .domain([d3.min(transitionData.filter(d => d.value !== 0), d => d.value), d3.max(transitionData, d => d.value)])
    .range(colors)

  const transitions = svg.selectAll('.transition')
    .data(transitionData, d => `${d.fromKey}: ${d.toKey}`)

  transitions.append('title')

  transitions.enter()
    .append('rect')
    .attr('x', d => ((d.fromKey.toUpperCase().charCodeAt(0) - 65) * gridSize))
    .attr('y', d => ((d.toKey.toUpperCase().charCodeAt(0) - 65) * gridSize))
    .attr('rx', 4)
    .attr('ry', 4)
    .attr('width', gridSize)
    .attr('height', gridSize)
    .style('fill', d => d.value === 0 ? 'white' : colorScale(d.value))
    .on('mouseover', function(d) {
      d3.select(this).classed('cell-hover', true)
      d3.selectAll('.ylabel').classed('highlighted', r => r === d.fromKey)
      d3.selectAll('.xlabel').classed('highlighted', r => r === d.toKey)
    })
    .on('mouseout', function() {
      d3.select(this).classed('cell-hover', false)
      d3.selectAll('.ylabel').classed('highlighted', false)
      d3.selectAll('.xlabel').classed('highlighted', false)
    })

  transitions.transition().duration(1000)
    .style('fill', d => colorScale(d.value))

  transitions.select('title').text(d => d.value)

  const legend = svg.selectAll('.legend')
    .data([d3.min(transitionData, d => d.value)].concat(colorScale.quantiles()), d => d)

  legend.enter().append('g')
    .attr('class', 'legend')

  legend.append('rect')
    .attr('x', height) //double check
    .attr('y', (d,i) => legendElementHeight * i)
    .attr('width', gridSize)
    .attr('height', legendElementHeight)
    .style('fill', (d, i) => colors[i])

  legend.append('text')
    .text(d => `≥  ${Math.round(d)}ms`)
    .attr('x', height + legendElementHeight)
    .attr('y', (d, i) => legendElementHeight / 2 + legendElementHeight * i)

  return fauxTransitionGraph.toReact()
}
