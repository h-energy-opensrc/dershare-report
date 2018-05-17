// Create Labels from Non-numeric Data with Ordinal Scales in D3 v4

// When your data contains discrete, non-numeric property values that you need to format or convert before displaying, d3.scaleOrdinal() is the API you need. Maybe you need to convert a “pass”/”fail” field to “green”/”red” for coloring your bubble chart? This lesson shows you exactly what to do.

const d3 = require('d3')

var ordinalScale = d3.scaleOrdinal()
    .domain(["poor", "good", "great"])
    .range(["red", "white", "green"])

console.log(ordinalScale("good"));
console.log(ordinalScale("great"));
console.log(ordinalScale("poor"));