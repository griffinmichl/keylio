import R from 'ramda'
import ReactFauxDOM from 'react-faux-dom'
import d3 from 'd3'

export default function createDwellGraph(data) {
  function median(nums) {
    return nums
      .slice()
      .sort((a,b) => a - b)[Math.floor(nums.length / 2)] || 0
  }

  function processPressTimes(dataObject) {
    return Object
      .keys(dataObject)
      .reduce((arr, key) => arr.concat({ key, value: median(dataObject[key])}), [])
  }
  console.log(processPressTimes(data))
  //dry this section of code relative to other graph
  // var characters = _.range(65, 91).map(function (charCode) {
  //   return String.fromCharCode(charCode);
  // });
  // var charHash = characters.reduce(function (hash, char) {
  //   hash[char] = true;
  //   return hash;
  // }, {});
  //

  var dataEntries = processPressTimes(data);
  dataEntries = dataEntries.sort(function (a, b) {
    return a.key.localeCompare(b.key);
  });

  var margin = { top: 50, right: 0, bottom: 100, left: 30 };
  //var width = d3.select('#chart')[0][0].clientWidth - margin.left - margin.right;
  //var height = d3.select('#chart')[0][0].clientWidth * 0.5 - margin.top - margin.bottom;
  var fauxChart = ReactFauxDOM.createElement('div')

  var width = 960
  var height = 500

  // scale to ordinal because x axis is not numerical
  var x = d3.scale.ordinal().rangeBands([0, width], .1);

  //scale to numerical value by height
  var y = d3.scale.linear().range([height, 0]);

  var chart = d3.select(fauxChart).append('svg') //append svg element inside #chart
  .attr('class', 'pressChart').attr('width', width + margin.left + margin.right) //set width
  .attr('height', height + margin.top + margin.bottom) //set height
  .append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  var xAxis = d3.svg.axis().scale(x).orient('bottom'); //orient bottom because x-axis will appear below the bars

  var yAxis = d3.svg.axis().scale(y).orient('left');

  x.domain(dataEntries.map(function (d) {
    return d.key;
  }));
  y.domain([0, d3.max(dataEntries, function (d) {
    return d.value;
  })]);

  // const bar = chart.selectAll('g')
  //                   .data(dataEntries)
  //                   .enter()
  //                   .append('g')
  //                   .attr('transform', (d, i) => 'translate('+x(d.key)+', 0)');

  var bars = chart.selectAll('.bar').data(dataEntries);

  bars.enter().append('rect').attr('class', 'bar').attr('y', function (d) {
    return y(d.value);
  }).attr('x', function (d) {
    return x(d.key);
  }).attr('height', function (d) {
    return height - y(d.value);
  }).attr('width', x.rangeBand()); //set width base on range on ordinal data

  chart.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + height + ')').call(xAxis);

  chart.append('g').attr('class', 'y axis').attr('transform', 'translate(0,0)').call(yAxis);
  // .append('text')
  // .attr('transform', 'rotate(-90)')
  // .attr('y', 6)
  // .attr('dy', '.71em')
  // // .style('text-anchor', 'end')
  // // .text('Average Press Time');

  chart.append('text').attr('x', width / 2).attr('y', 0 - margin.top / 2).attr('text-anchor', 'middle').style('font-size', '16').text('Keystroke Dwell Time');
  return fauxChart
};
