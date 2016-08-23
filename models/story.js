var mongoose = require('mongoose');

var StorySchema = new mongoose.Schema({
  title:         { type: String,  required: true  },
  author:        { type: String,  required: false },
  river:         { type: String,  required: false },
  date:          { type: String,  required: false },
  friends:       { type: String,  required: false },
  story:         { type: String,  required: true  },
  public:        { type: Boolean, required: false }
});


module.exports = mongoose.model('Story', StorySchema);
