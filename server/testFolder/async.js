const async = require("async")
async.parallel([
    function(callback) { console.log(1) },
    function(callback) { console.log(2) },
    function(callback) { console.log(3) }
], function(err, results) {
    
});