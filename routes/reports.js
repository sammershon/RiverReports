var express = require('express');
var router = express.Router();
var Report = require('../models/report');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

// INDEX
router.get('/', function(req, res, next) {
  var reportFilter = {"public": true};

  Report.find(reportFilter)
  .then(function(reports) {
    res.render('reports/index', { reports: reports });
  });
});

/*/ INDEX
router.get('/', function(req, res, next) {
  // get all the reports and render the index view
  Report.find({})
  .then(function(reports) {
    res.render('reports/index', { reports: reports } );
  }, function(err) {
    return next(err);
  });
});*/

// NEW
router.get('/new', function(req, res, next) {
  var report = {
    title: '',
    reach: '',
    date: '',
    level: '',
    units: '',
    weather: '',
    hazard: false,
    public: false,
    beta: ''
  };
  res.render('reports/new', { report: report } );
});

// CREATE
router.post('/', function(req, res, next) {
  var report = new Report({
    title: req.body.title,
    reach: req.body.reach,
    date: req.body.date,
    level: req.body.level,
    units: req.body.units,
    weather: req.body.weather,
    hazard: req.body.hazard ? true : false,
    public: req.body.public ? true : false,
    beta: req.body.beta
  });
  report.save()
  .then(function(saved) {
    res.redirect('/reports');
  }, function(err) {
    return next(err);
  });
});

// SHOW
router.get('/:id', function(req, res, next) {
  Report.findById(req.params.id)
  .then(function(report) {
    if (!report) return next(makeError(res, 'Document not found', 404));
    res.render('reports/show', { report: report });
  }, function(err) {
    return next(err);
  });
});

// EDIT
router.get('/:id/edit', function(req, res, next) {
  Report.findById(req.params.id)
  .then(function(report) {
    if (!report) return next(makeError(res, 'Document not found', 404));
    res.render('reports/edit', { report: report });
  }, function(err) {
    return next(err);
  });
});

// UPDATE
router.put('/:id', function(req, res, next) {
  Report.findById(req.params.id)
  .then(function(report) {
    if (!report) return next(makeError(res, 'Document not found', 404));
    report.title = req.body.title;
    report.reach = req.body.reach;
    report.date = req.body.date;
    report.level = req.body.level;
    report.units =req.body.units;
    report.weather = req.body.weather;
    report.hazard = req.body.hazard ? true : false;
    report.public = req.body.public ? true : false;
    report.beta =req.body.beta;
    return report.save();
  })
  .then(function(saved) {
    res.redirect('/reports');
  }, function(err) {
    return next(err);
  });
});

// DESTROY
router.delete('/:id', function(req, res, next) {
  Report.findByIdAndRemove(req.params.id)
  .then(function() {
    res.redirect('/reports');
  }, function(err) {
    return next(err);
  });
});

module.exports = router;
