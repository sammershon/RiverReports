var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Report = require('./report');
var Story = require('./story');

var UserSchema = new mongoose.Schema({
  local : {
    email    : String,
    password : String
  },
  name : {
    first : String,
    last : String
  },
  hometown: String,
  favoriteRiver : String,
  reports : [Report.schema],
  stories: [Story.schema]
});

UserSchema.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

UserSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
