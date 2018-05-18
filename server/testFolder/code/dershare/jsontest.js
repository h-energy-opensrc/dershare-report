var fs = require('fs');
fs.readFile('FeasibilityStudyResult1.json', 'utf8', 
    function (err, data) {
        if (err)
            console.log(err)
        // error handling
        var obj = JSON.parse(data);
        console.log(obj)
})

fs.unlinkSync('FeasibilityStudyResult.json')