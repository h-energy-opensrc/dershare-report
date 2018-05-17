var secondLink = d3.selectAll('')
//console.log()
secondLink.attr('href', 'http://google.com')
//console.log(secondLink.attr('href', ))
secondLink.stlye('color', 'red')

// create dom elements with d3v4
d3.select('.title')
  .append('button')
    .html('Inventory <b> SALE</b>')
  .append('button')
    .style('display', 'block')
    text('submit')

d3.select('.action').remove()


/////

/**
 * <div class="ex1">
    <div>Billy</div>
    <div>Cindy</div>
  </div>
 */

var scores = [
  { name: 'Alice', score: 96 },
  { name: 'Billy', score: 83 },
  { name: 'Cindy', score: 91 },
  { name: 'David', score: 96 },
  { name: 'Emily', score: 88 }
];

// d3.select('.ex1')
//   .selectAll('div')
//   .data(scores, d => d ? d.name : this.innerText)
//   .style('color', 'blue')

// Update Existing 
var update = d3.select('.ex1')
  .selectAll('div')
  // .data(scores, function(d) {return d ? d.name : this.innerText})
  .data(scores, function(d){ return d ? d.name : this.innerText})
  .style('color', 'blue')

// create new div
var enter = update.enter()
  .append('div')
  .text(d => d.name)
  .style('color', 'green')

// matching 
// update.exit().remove()

// // merge 
// update.merge(enter)
//   .style('text-transform', 'uppercase')
//   .style('width', d => d.score + 'px')
//   .style('background', 'lightgreen')



/**
 * 
 *  <div class="ex1">
  </div>
 * 
 */



var bar = d3.select('.ex1')
.append('svg')
.selectAll('rect')
.data(scores)
.enter()
  .append('g')
  .attr('transform', (d, i) => 'translate(0, ' + i * 33 + ')')

bar.append('rect')
.style('width', d => d.score)
.attr('class', 'bar')

bar.append('text')
.attr('y', 20)
.text(function(d) {
  return d.name
})