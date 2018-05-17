const { spawn } = require('child_process');
var repl = spawn('docker', ['run', '-ai', '-t', 'read-data', 'R', '--no-save']);

// write command onto the repl
repl.stdin.write('x <- 5; print(x)');

// get output from repl
repl.stdout.on('data', (data) => {
  console.log(data.toString());
});