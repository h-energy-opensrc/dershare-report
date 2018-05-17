const d3 = require('d3')
d3.csv('obs.csv', data => {
    console.log(data)
})