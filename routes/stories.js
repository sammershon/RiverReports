var express = require('express');
var router = express.Router();
var Story = require('../models/story');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

// INDEX
router.get('/', function(req, res, next) {
  var storyFilter = {"public": true};

  Story.find(storyFilter)
  .then(function(stories) {
    res.render('stories/index', { stories: stories });
  });
});

// NEW
router.get('/new', function(req, res, next) {
  var story = {
    title: '',
    author: '',
    river: '',
    date: '',
    friends: '',
    story: '',
    public: false
  };
  res.render('stories/new', { story: story } );
});

// CREATE
router.post('/', function(req, res, next) {
  var story = new Story({
    title: req.body.title,
    author: req.body.author,
    river: req.body.river,
    date: req.body.date,
    friends: req.body.friends,
    story: req.body.story,
    public: req.body.public ? true : false
  });
  story.save()
  .then(function(saved) {
    res.redirect('/stories');
  }, function(err) {
    return next(err);
  });
});

// SHOW
router.get('/:id', function(req, res, next) {
  Story.findById(req.params.id)
  .then(function(story) {
    if (!story) return next(makeError(res, 'Document not found', 404));
    res.render('stories/show', { story: story });
  }, function(err) {
    return next(err);
  });
});

// EDIT
router.get('/:id/edit', function(req, res, next) {
  Report.findById(req.params.id)
  .then(function(story) {
    if (!story) return next(makeError(res, 'Document not found', 404));
    res.render('stories/edit', { story: story });
  }, function(err) {
    return next(err);
  });
});

// UPDATE
router.put('/:id', function(req, res, next) {
  Report.findById(req.params.id)
  .then(function(story) {
    if (!story) return next(makeError(res, 'Document not found', 404));
    story.title = req.body.title;
    story.author = req.body.author;
    story.river = req.body.river;
    story.date = req.body.date;
    story.friends = req.body.friends;
    story.story = req.body.story;
    story.public = req.body.public ? true : false;
    return story.save();
  })
  .then(function(saved) {
    res.redirect('/stories');
  }, function(err) {
    return next(err);
  });
});

// DESTROY
router.delete('/:id', function(req, res, next) {
  Report.findByIdAndRemove(req.params.id)
  .then(function() {
    res.redirect('/stories');
  }, function(err) {
    return next(err);
  });
});

module.exports = router;
