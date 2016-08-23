var express = require('express');
var router = express.Router();

var Report = require('../models/report');
var User = require('../models/user')

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

// helper method to redirect a user if they are not authorized to use a page
function authenticate(req, res, next) {
  if(!req.isAuthenticated()) {
    req.flash('error', 'Not allowed!');
    res.redirect('/');
  }
  else {
    next();
  }
}

// INDEX
router.get('/', authenticate, function(req, res, next) {
  var reports = global.currentUser.reports;
  res.render('userreports/index', { reports: reports, message: req.flash() });
});

// NEW
router.get('/new', authenticate, function(req, res, next) {
  var report = {
    title: '',
    reach: '',
    date: '',
    level:'',
    units: '',
    weather: '',
    hazard: false,
    public: false,
    beta:''
  };
  res.render('userreports/new', { report: report, message: req.flash() });
});

// SHOW
router.get('/:id', authenticate, function(req, res, next) {
  //mongoose provides us with this id method to set the id to the req
  var report = currentUser.reports.id(req.params.id);
  if (!report) return next(makeError(res, 'Document not found', 404));
  res.render('userreports/show', { report: report, message: req.flash() } );
});

// CREATE
router.post('/', authenticate, function(req, res, next) {
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
  // Since a user's reports are an embedded document, we just need to push a new
  // report to the user's list of reports and save the user.
  currentUser.reports.push(report);
  currentUser.save()
  .then(function() {
    res.redirect('/userreports');
  }, function(err) {
    return next(err);
  });
});

// EDIT
router.get('/:id/edit', authenticate, function(req, res, next) {
  var report = currentUser.reports.id(req.params.id);
  if (!report) return next(makeError(res, 'Document not found', 404));
  res.render('userreports/edit', { report: report, message: req.flash() } );
});

// UPDATE
router.put('/:id', authenticate, function(req, res, next) {
  var report = currentUser.reports.id(req.params.id);
  if (!report) return next(makeError(res, 'Document not found', 404));
  else {
    report.title = req.body.title;
    report.reach = req.body.reach;
    report.date = req.body.date;
    report.level = req.body.level;
    report.units =req.body.units;
    report.weather = req.body.weather;
    report.hazard = req.body.hazard ? true : false;
    report.public = req.body.public ? true : false;
    report.beta =req.body.beta;
    currentUser.save()
    .then(function(saved) {
      res.redirect('/userreports');
    }, function(err) {
      return next(err);
    });
  }
});

// DESTROY
router.delete('/:id', authenticate, function(req, res, next) {
  var report = currentUser.reports.id(req.params.id);
  if (!report) return next(makeError(res, 'Document not found', 404));
  var index = currentUser.reports.indexOf(report);
  currentUser.reports.splice(index, 1);
  currentUser.save()
  .then(function(saved) {
    res.redirect('/userreports');
  }, function(err) {
    return next(err);
  });
});


module.exports = router;
