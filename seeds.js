var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
//add models here
var Report = require('./models/report');

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
}
else {
  mongoose.connect('mongodb://localhost/reports');
}
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
  }
);
mongoose.connection.once('open', function() {
  console.log("Mongoose has connected to MongoDB!");
});

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

console.log('removing reports...');
Report.remove({})
.then(function() {
  console.log('old reports removed');
  console.log('creating new reports...');
  var green  = new Report({ title: 'Green River', reach: 'Narrows', date: '2016-03-4', level: 11, units: 'In', weather: 'overcast', hazard: false });
  var big    = new Report({ title: 'Big Creek', reach: 'Upper', date: '2016-04-14', level: 3.7, units: 'Ft', weather: 'raining', hazard: false });
  var overflow  = new Report({ title: 'Overflow Creek', reach: 'Upper', date: '2015-08-04', level: 1.1, units: 'Ft', weather: 'sunny', hazard: false });
  var lookingGlass  = new Report({ title: 'Looking Glass Creek', reach: 'Above the falls', date: '2015-06-12', weather: 'overcast', hazard: false, beta: 'Medium high level with lots of wood lodged throughout the run. Major log across the river after the second big slide. Triple drop rapid was clean, but still looked sketchy.' });
  var northFork  = new Report({ title: 'North Fork of the French Broad', reach: 'Lower', date: '2016-01-15', level: 1200, units: 'cfs', weather: 'light rain', hazard: true, beta: 'Good day on the NFFB with a medium-high water level. Hazard at the bottom of the Clog rapid where a tree has fallen into the slot towards the top.' });
  return Report.create([green, big, overflow, lookingGlass, northFork]);
})
.then(function(savedReports) {
  console.log('Just saved', savedReports.length, 'reports.');
  return Report.find({});
})/*
.then(function(allReports) {
  console.log('Printing all reports:');
  allReports.forEach(function(report) {
    console.log(report);
  });
  return Report.findOne({title: 'Green River'});
})
.then(function(green) {
  green.hazard = true;
  return green.save();
})
.then(function(green) {
  console.log('updated green:', green);
  return green.remove();
})
.then(function(deleted) {
  return Report.find({});
})*/
.then(function(allReports) {
  console.log('Printing all reports:');
  allReports.forEach(function(report) {
    console.log(report);
  })
  quit();
});
