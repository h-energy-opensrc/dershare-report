const d3 = require('d3')

d3.tsv('./d.tsv', function(err, data){
    console.log("data", data)
    console.log(err)
})
