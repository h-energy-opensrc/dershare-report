const { spawn } = require('child_process');
// const ls = spawn('R', ['--save']);

// ls.stdin.write('x<-5; print(x);')
// ls.stdin.end();
// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data.toString()}`);
// });
// ls.stderr.on('data', (data) => {
//   console.log(`stderr: ${data}`);
// });
// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });

const ls2 = spawn('docker',["exec", "-i", "b4be7749c35d", "R",  "--save", "--quiet"]);
ls2.stdin.write('x<-x * 5+ a\n print(x)\n print(x)\n print(x)\n')
ls2.stdin.write('print(x);')

ls2.stdout.on('data', (data) => {
  console.log("stdout")
  console.log(`${data.toString()}`);
});
ls2.stderr.on('data', (data) => {
  console.log("error")
  console.log(`${data}`);
});
ls2.on('close', (code) => {
  ls2.stdin.end();
  console.log(`child process exited with code ${code}`);
});