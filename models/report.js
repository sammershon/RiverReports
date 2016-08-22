var mongoose = require('mongoose');

var ReportSchema = new mongoose.Schema({
  title:         { type: String,  required: true  },
  reach:         { type: String,  required: false },
  date:          { type: String,  required: false },
  level:         { type: Number,  required: false },
  units:         { type: String,  required: false  },
  weather:       { type: String,  required: false },
  hazard:        { type: Boolean, required: false  },
  beta:          { type: String,  required: false }
},
{ timestamps: true }  // createdAt, updatedAt
);

function date2String(date) {
  var options = {
    weekday: 'long', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

ReportSchema.methods.getCreatedAt = function() {
  return date2String(this.createdAt);
};

ReportSchema.methods.getUpdatedAt = function() {
  return date2String(this.updatedAt);
};

module.exports = mongoose.model('Report', ReportSchema);
