var express = require('express');
var router = express.Router();

var Story = require('../models/story');

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
  var stories = global.currentUser.stories;
  res.render('userstories/index', { stories: stories, message: req.flash() });
});

// NEW
router.get('/new', authenticate, function(req, res, next) {
  var story = {
    title: '',
    author: '',
    river: '',
    date: '',
    friends: '',
    story: '',
    public: false
  };
  res.render('userstories/new', { story: story, message: req.flash() });
});

// SHOW
router.get('/:id', authenticate, function(req, res, next) {
  //mongoose provides us with this id method to set the id to the req
  var story = currentUser.stories.id(req.params.id);
  if (!story) return next(makeError(res, 'Document not found', 404));
  res.render('userstories/show', { story: story, message: req.flash() } );
});

// CREATE
router.post('/', authenticate, function(req, res, next) {
  var story = new Story({
    title: req.body.title,
    author: req.body.author,
    river: req.body.river,
    date: req.body.date,
    friends: req.body.friends,
    story: req.body.story,
    public: req.body.public ? true : false
  });
  // Since a user's stories are an embedded document, we just need to push a new
  // story to the user's list of stories and save the user.
  currentUser.stories.push(story);
  currentUser.save()
  .then(function() {
    res.redirect('/userstories');
  }, function(err) {
    return next(err);
  });
});

// EDIT
router.get('/:id/edit', authenticate, function(req, res, next) {
  var story = currentUser.stories.id(req.params.id);
  if (!story) return next(makeError(res, 'Document not found', 404));
  res.render('userstories/edit', { story: story, message: req.flash() } );
});

// UPDATE
router.put('/:id', authenticate, function(req, res, next) {
  var story = currentUser.stories.id(req.params.id);
  if (!story) return next(makeError(res, 'Document not found', 404));
  else {
    story.title = req.body.title;
    story.author = req.body.author;
    story.river = req.body.river;
    story.date = req.body.date;
    story.friends = req.body.friends;
    story.story = req.body.story;
    story.public = req.body.public ? true : false;
    currentUser.save()
    .then(function(saved) {
      res.redirect('/userstories');
    }, function(err) {
      return next(err);
    });
  }
});

// DESTROY
router.delete('/:id', authenticate, function(req, res, next) {
  var story = currentUser.stories.id(req.params.id);
  if (!story) return next(makeError(res, 'Document not found', 404));
  var index = currentUser.stories.indexOf(story);
  currentUser.stories.splice(index, 1);
  currentUser.save()
  .then(function(saved) {
    res.redirect('/userstories');
  }, function(err) {
    return next(err);
  });
});

// TOGGLE completed
router.get('/:id/toggle', function(req, res, next) {
  var story = currentUser.stories.id(req.params.id);
  if (!story) return next(makeError(res, 'Document not found', 404));
  else {
    story.completed = !story.completed;
    currentUser.save()
    .then(function(saved) {
      res.redirect('/userstories');
    }, function(err) {
      return next(err);
    });
  }
});

module.exports = router;
