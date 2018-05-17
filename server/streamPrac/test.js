
var Readable = require('stream').Readable;
var rs = new Readable;
rs.push('beep ');
rs.push('boop\n');
rs.push(null);

// rs.pipe(process.stdout);
rs.on('data', (err,data)=>{
    // console.log(err.toString('utf8'))
    console.log(data.toString('utf8'))
})