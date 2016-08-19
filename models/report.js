var mongoose = require('mongoose');

var ReportSchema = new mongoose.Schema({
  title:         { type: String,  required: true },
  reach:         { type: String,  required: false },
  date:          { type: String,  required: false},
  level:         { type: Number,  required: false },
  weather:       { type: String,  required: false },
  first:         { type: Boolean, required: true },
  beta:          { type: String,  required: false }
  }

);

module.exports = mongoose.model('Report', ReportSchema);
