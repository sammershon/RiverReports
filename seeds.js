var mongoose = require('mongoose');
//add models here
var Report = require('./models/report');

function quit() {
  mongoose.disconnect();
  console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
  console.log('ERROR:', err);
  quit();
  return err;
}

console.log('removing old reports...');
Report.remove({})
.then(function() {
  console.log('old reports removed');
  console.log('creating some new reports...');
  var green  = new Todo({ title: 'Green River', reach: 'Narrows', date: 'Nov 4', level: 12, weather: 'overcast', first: false });
  var big = new Todo({ title: 'Big Creek', reach: 'Upper', date: 'April 16', level: 3.7, weather: 'raining', first: false });
  return Report.create([green, big]);
})
.then(function(savedReports) {
  console.log('Just saved', savedReports.length, 'reports.');
  return Report.find({});
})
.then(function(allReports) {
  console.log('Printing all reports:');
  allReports.forEach(function(report) {
    console.log(report);
  });
  return Report.findOne({title: 'green'});
})
.then(function(green) {
  green.first = true;
  return green.save();
})
.then(function(green) {
  console.log('updated green:', green);
  return green.remove();
})
.then(function(deleted) {
  return Report.find({});
})
.then(function(allReports) {
  console.log('Printing all reports:');
  allReports.forEach(function(report) {
    console.log(report);
  });
  quit();
});
