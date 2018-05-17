const d3 = require('d3')
var linearScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0,1])

// Sclae Linear function is crucial to measure exact point from the graph. 
// domain is an actual value 
// range is an rescaled 

console.log(linearScale(0))     //0
console.log(linearScale(50))    //0.5
console.log(linearScale(100))   //1
console.log(linearScale(200))   //2

var linearScale = d3.scaleLinear()
.domain([0, 100])
.range([0,600])

console.log(linearScale(0))     //0
console.log(linearScale(50))    //300
console.log(linearScale(100))   //600
console.log(linearScale(200))   //1200


var linearScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0,600])
    .clamp(true) //restrict maximum variable 

console.log(linearScale(0))     //0
console.log(linearScale(50))    //300
console.log(linearScale(100))   //600
console.log(linearScale(200))   //1200

console.log(linearScale.invert(200))   //1200


