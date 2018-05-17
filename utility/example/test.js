const d3 = require('d3')

function delayedHello(callback) {
  setTimeout(function () {
    console.log("Hello!");
    callback(null);
  }, 2500);
}

var q = d3.queue();
q.defer(delayedHello);
q.defer(delayedHello);
q.await(function (error) {
  if (error) throw error;
  console.log("Goodbye!");
});
