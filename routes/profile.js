var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

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
  res.render('profile/index', {message: req.flash() });
});




module.exports = router;
