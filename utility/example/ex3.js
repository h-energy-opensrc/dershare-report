// Convert Dates no Numeric Values with Time Scales in D3v4
//Mapping abstract values to visual representations is what data visualization is all about, and that’s exactly what D3 scales do. This is usually done using pretty straightforward algorithms, but nothing is straightforward when you’re working with Date objects in JavaScript. If you’re plotting temporal data, you need to use a time scale.
const d3 = require('d3')

var timeScale = d3.scaleTime()
.domain([new Date(2016, 0, 1), new Date()])
.range([0, 100])

console.log(timeScale(new Date(2016, 4, 15)));
console.log(timeScale(new Date(2016, 3, 15)));
console.log(timeScale(new Date()));

console.log(timeScale.invert(50));
