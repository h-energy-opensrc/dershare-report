// Create Labels from Numeric Data with Quantize Scales in D3 v4
// Sometimes data needs to be converted from a continuous range, like test scores, to a discrete set of output values, like letter grades. In this lesson we’ll see how to use d3.scaleQuantize() to do exactly that.
const d3 = require('d3')

var quantizeScale = d3.scaleQuantize()
.domain([0,100])         //input range
.range(["red", "white", "blue", "green"]) //output range

console.log(quantizeScale(22))  // red
console.log(quantizeScale(50))  // blue
console.log(quantizeScale(88))  // green
console.log(quantizeScale(99))  // green

console.log(quantizeScale.invertExtent('white')) //[ 25, 50 ]